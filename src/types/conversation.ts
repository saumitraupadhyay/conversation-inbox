export type Channel = 'chat' | 'email' | 'whatsapp'

export type CustomerTier = 'vip' | 'standard'

export type Sentiment = 'negative' | 'neutral' | 'positive'

export type ConversationStatus = 'unassigned' | 'claimed' | 'resolved' | 'snoozed'

export type EscalationReasonType =
  | 'refund_request'
  | 'cancellation_threat'
  | 'legal_threat'
  | 'repeat_escalation'
  | 'low_csat'
  | 'complex_issue'
  | 'sla_breach_risk'

export interface EscalationReason {
  type: EscalationReasonType
  detail: string
}

export interface Message {
  id: string
  author: 'customer' | 'agent' | 'ai'
  body: string
  sentAt: string // ISO timestamp
}

export interface Conversation {
  id: string
  customerName: string
  tier: CustomerTier
  channel: Channel
  sentiment: Sentiment
  csatScore: number | null // 1-5, null if not yet surveyed
  escalatedAt: string // ISO timestamp
  slaMinutes: number // total SLA budget for this conversation, from escalatedAt
  escalationReasons: EscalationReason[]
  aiSummary: string
  messages: Message[]
  status: ConversationStatus
  assignedAgent: string | null
}

/** The three triage tiers an agent scans, in priority order. */
export type UrgencyTier = 'now' | 'soon' | 'later'

export interface UrgencyResult {
  tier: UrgencyTier
  score: number
  /** Ordered, human-readable reasons, most important first. Capped by the caller for display. */
  reasons: string[]
}