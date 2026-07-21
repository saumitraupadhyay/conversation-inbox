import type {
  Channel,
  Conversation,
  CustomerTier,
  EscalationReason,
  EscalationReasonType,
  Message,
  Sentiment,
} from '../types/conversation'

// Deterministic PRNG (mulberry32) so the demo data is stable across reloads
// and reviewers see the same queue every time, without hand-maintaining 24 objects.
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(20260721)

function pick<T>(arr: readonly T[]): T {
  const item = arr[Math.floor(rng() * arr.length)]
  if (item === undefined) throw new Error('pick() called on empty array')
  return item
}

function pickWeighted<T>(items: readonly (readonly [T, number])[]): T {
  const total = items.reduce((sum, [, w]) => sum + w, 0)
  let r = rng() * total
  for (const [item, weight] of items) {
    r -= weight
    if (r <= 0) return item
  }
  const last = items[items.length - 1]
  if (!last) throw new Error('pickWeighted() called on empty array')
  return last[0]
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

const NAMES = [
  'Aarav Sharma',
  'Priya Sharma',
  'Rohan Verma',
  'Ananya Gupta',
  'Arjun Singh',
  'Sneha Patel',
  'Rahul Mehta',
  'Neha Agarwal',
  'Karan Malhotra',
  'Meera Iyer',
  'Aditya Nair',
  'Divya Menon',
  'Vikram Reddy',
  'Pooja Mishra',
  'Siddharth Joshi',
  'Kavya Rao',
  'Aman Choudhary',
  'Nisha Kapoor',
  'Harsh Pandey',
  'Riya Srivastava',
  'Ayush Yadav',
  'Ishita Jain',
  'Varun Khanna',
  'Anjali Kulkarni',
]

const CHANNELS: Channel[] = ['chat', 'email', 'whatsapp']

const REASON_TEMPLATES: Record<EscalationReasonType, string[]> = {
  refund_request: [
    'Wants a full refund for last month\u2019s charge.',
    'Asking for a refund after the order arrived damaged.',
  ],
  cancellation_threat: [
    'Says they\u2019ll cancel their plan today if this isn\u2019t fixed.',
    'Threatening to switch to a competitor by end of week.',
  ],
  legal_threat: [
    'Mentioned involving their lawyer over the billing dispute.',
    'Referenced filing a complaint with a regulator.',
  ],
  repeat_escalation: [
    'Third time this issue has been escalated in two weeks.',
    'Previously escalated and marked resolved, but it recurred.',
  ],
  low_csat: [
    'Left a 1-star satisfaction score after the last interaction.',
    'Rated the last resolution 2/5.',
  ],
  complex_issue: [
    'Issue spans billing, account access, and a failed migration.',
    'Multiple systems involved; bot couldn\u2019t identify a single root cause.',
  ],
  sla_breach_risk: [
    'Response time SLA for this tier is close to breaching.',
  ],
}

const AI_SUMMARY_OPENERS = [
  'Customer has been waiting',
  'Conversation started',
  'Escalated after the bot',
]

function buildAiSummary(opts: {
  waitLabel: string
  reasons: EscalationReason[]
  tier: CustomerTier
  sentiment: Sentiment
}): string {
  const { waitLabel, reasons, tier, sentiment } = opts
  const primary = reasons[0]
  const reasonText = primary
    ? (REASON_TEMPLATES[primary.type][0] ?? 'General question the bot couldn\u2019t resolve.')
    : 'General question the bot couldn\u2019t resolve.'
  const tierText = tier === 'vip' ? ' Customer is on an enterprise plan.' : ''
  const moodText = sentiment === 'negative' ? ' Tone has turned frustrated.' : sentiment === 'positive' ? ' Tone remains patient.' : ''
  return `${pick(AI_SUMMARY_OPENERS)} ${waitLabel}. ${reasonText}${tierText}${moodText}`
}

function buildMessages(customerName: string, reasons: EscalationReason[], escalatedAt: string): Message[] {
  const escalatedTime = new Date(escalatedAt).getTime()
  const primary = reasons[0]
  const customerLine = primary
    ? REASON_TEMPLATES[primary.type][1] ?? REASON_TEMPLATES[primary.type][0]
    : 'I\u2019ve been going back and forth with the bot and it\u2019s not getting anywhere.'

  const messages: Message[] = [
    {
      id: 'm1',
      author: 'customer',
      body: `Hi, I need help with my account. ${customerLine ?? ''}`.trim(),
      sentAt: new Date(escalatedTime - 6 * 60_000).toISOString(),
    },
    {
      id: 'm2',
      author: 'ai',
      body: 'I understand this is frustrating. Let me pull up your account details so a specialist can take a closer look.',
      sentAt: new Date(escalatedTime - 4 * 60_000).toISOString(),
    },
    {
      id: 'm3',
      author: 'customer',
      body: `This is honestly the last straw, ${customerName.split(' ')[0]} here, I just want this sorted.`,
      sentAt: new Date(escalatedTime - 1 * 60_000).toISOString(),
    },
  ]
  return messages
}

function buildReasons(): EscalationReason[] {
  const count = pickWeighted([[1, 5], [2, 3], [3, 1]] as const)
  const pool: EscalationReasonType[] = [
    'refund_request', 'cancellation_threat', 'legal_threat',
    'repeat_escalation', 'low_csat', 'complex_issue', 'sla_breach_risk',
  ]
  const chosen: EscalationReasonType[] = []
  while (chosen.length < count && chosen.length < pool.length) {
    const candidate = pick(pool)
    if (!chosen.includes(candidate)) chosen.push(candidate)
  }
  return chosen.map((type) => ({ type, detail: pick(REASON_TEMPLATES[type]) }))
}

function buildConversation(index: number): Conversation {
  const name = NAMES[index % NAMES.length] ?? `Customer ${index}`
  const tier: CustomerTier = pickWeighted([['vip', 1], ['standard', 3]] as const)
  const channel = pick(CHANNELS)
  const sentiment: Sentiment = pickWeighted([['negative', 3], ['neutral', 4], ['positive', 1]] as const)
  const csatScore = rng() > 0.4 ? Math.ceil(rng() * 5) : null
  const waitMinutes = Math.round(pickWeighted([[5, 3], [25, 3], [90, 2], [300, 2], [1500, 1]] as const) * (0.7 + rng() * 0.6))
  const escalatedAt = minutesAgo(waitMinutes)
  const slaMinutes = pick([30, 60, 120, 240])
  const reasons = buildReasons()
  const waitLabel = waitMinutes < 60 ? `${waitMinutes} minutes` : waitMinutes < 1440 ? `${Math.round(waitMinutes / 60)} hours` : `${Math.round(waitMinutes / 1440)} days`

  return {
    id: `conv-${String(index + 1).padStart(3, '0')}`,
    customerName: name,
    tier,
    channel,
    sentiment,
    csatScore,
    escalatedAt,
    slaMinutes,
    escalationReasons: reasons,
    aiSummary: buildAiSummary({ waitLabel, reasons, tier, sentiment }),
    messages: buildMessages(name, reasons, escalatedAt),
    status: 'unassigned',
    assignedAgent: null,
  }
}

export const TOTAL_MOCK_CONVERSATIONS = 24

/**
 * conv-013 is reserved as the "always fails" write path required by the brief,
 * and is kept as a stable ID so failure handling can be exercised reliably.
 */
export const ALWAYS_FAILS_ID = 'conv-013'

export function generateMockConversations(): Conversation[] {
  return Array.from({ length: TOTAL_MOCK_CONVERSATIONS }, (_, i) => buildConversation(i))
}
