import { Mail, MessageCircle, Phone } from 'lucide-react'
import type { Channel } from '../types/conversation'

const CHANNEL_CONFIG: Record<Channel, { label: string; Icon: typeof Mail }> = {
  chat: { label: 'Chat', Icon: MessageCircle },
  email: { label: 'Email', Icon: Mail },
  whatsapp: { label: 'WhatsApp', Icon: Phone },
}

export function ChannelTag({ channel }: { channel: Channel }) {
  const { label, Icon } = CHANNEL_CONFIG[channel]
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <Icon aria-hidden size={13} />
      {label}
    </span>
  )
}