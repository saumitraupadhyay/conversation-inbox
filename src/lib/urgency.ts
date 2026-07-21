import type { Conversation, EscalationReasonType, UrgencyResult, UrgencyTier } from '../types/conversation'

const REASON_WEIGHT: Record<EscalationReasonType, number> = {
  legal_threat: 40,
  cancellation_threat: 32,
  refund_request: 26,
  repeat_escalation: 18,
  sla_breach_risk: 22,
  low_csat: 14,
  complex_issue: 8,
}

const REASON_LABEL: Record<EscalationReasonType, string> = {
  legal_threat: 'Legal or regulatory threat',
  cancellation_threat: 'Customer threatened to cancel',
  refund_request: 'Refund requested',
  repeat_escalation: 'Repeat escalation',
  sla_breach_risk: 'SLA at risk',
  low_csat: 'Low satisfaction score',
  complex_issue: 'Complex, multi-part issue',
}

const VIP_WEIGHT = 15
const NEGATIVE_SENTIMENT_WEIGHT = 12

const TIER_THRESHOLDS: Record<UrgencyTier, number> = {
  now: 45,
  soon: 20,
  later: 0,
}

function minutesSince(iso: string, now: Date): number {
  return Math.max(0, (now.getTime() - new Date(iso).getTime()) / 60_000)
}

function slaMinutesRemaining(conversation: Conversation, now: Date): number {
  const elapsed = minutesSince(conversation.escalatedAt, now)
  return conversation.slaMinutes - elapsed
}

/**
 * Computes an urgency tier and score for a conversation at a given moment.
 * Pure function of (conversation, now) so it's trivial to unit test and to
 * recompute on a ticking clock without re-fetching data.
 */
export function computeUrgency(conversation: Conversation, now: Date = new Date()): UrgencyResult {
  let score = 0
  const reasons: { label: string; weight: number }[] = []

  for (const reason of conversation.escalationReasons) {
    const weight = REASON_WEIGHT[reason.type]
    score += weight
    reasons.push({ label: REASON_LABEL[reason.type], weight })
  }

  if (conversation.tier === 'vip') {
    score += VIP_WEIGHT
    reasons.push({ label: 'VIP customer', weight: VIP_WEIGHT })
  }

  if (conversation.sentiment === 'negative') {
    score += NEGATIVE_SENTIMENT_WEIGHT
    reasons.push({ label: 'Customer sounds frustrated', weight: NEGATIVE_SENTIMENT_WEIGHT })
  }

  const remaining = slaMinutesRemaining(conversation, now)
  if (remaining <= 0) {
    // An already-breached SLA is a "now" on its own, independent of every
    // other signal - deliberately weighted above the 'now' threshold by itself.
    const weight = 46
    score += weight
    reasons.push({ label: 'SLA already breached', weight })
  } else if (remaining <= 15) {
    const weight = 25
    score += weight
    reasons.push({ label: `SLA expires in ${Math.round(remaining)}m`, weight })
  } else if (remaining <= 30) {
    const weight = 10
    score += weight
    reasons.push({ label: `SLA expires in ${Math.round(remaining)}m`, weight })
  }

  // Sitting untouched for a long time matters even without a hard SLA signal.
  const waited = minutesSince(conversation.escalatedAt, now)
  if (conversation.status === 'unassigned' && waited > 60) {
    const weight = 6
    score += weight
    reasons.push({ label: `Waiting ${Math.round(waited / 60)}h, unclaimed`, weight })
  }

  reasons.sort((a, b) => b.weight - a.weight)

  const tier: UrgencyTier =
    score >= TIER_THRESHOLDS.now ? 'now' : score >= TIER_THRESHOLDS.soon ? 'soon' : 'later'

  return {
    tier,
    score,
    reasons: reasons.map((r) => r.label),
  }
}

export function sortByUrgency(conversations: Conversation[], now: Date = new Date()): Conversation[] {
  return [...conversations].sort((a, b) => computeUrgency(b, now).score - computeUrgency(a, now).score)
}