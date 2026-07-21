import { useEffect } from 'react'

interface KeyboardNavOptions {
  itemCount: number
  selectedIndex: number
  onSelectIndex: (index: number) => void
  onOpen?: () => void
  onClaim?: () => void
  onResolve?: () => void
  onSnooze?: () => void
  onEscape?: () => void
  enabled?: boolean
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useKeyboardNav({
  itemCount,
  selectedIndex,
  onSelectIndex,
  onOpen,
  onClaim,
  onResolve,
  onSnooze,
  onEscape,
  enabled = true,
}: KeyboardNavOptions) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return
      if (itemCount === 0 && event.key !== 'Escape') return

      switch (event.key) {
        case 'j':
        case 'ArrowDown':
          event.preventDefault()
          onSelectIndex(Math.min(selectedIndex + 1, itemCount - 1))
          break
        case 'k':
        case 'ArrowUp':
          event.preventDefault()
          onSelectIndex(Math.max(selectedIndex - 1, 0))
          break
        case 'Enter':
          event.preventDefault()
          onOpen?.()
          break
        case 'c':
        case 'C':
          onClaim?.()
          break
        case 'r':
        case 'R':
          onResolve?.()
          break
        case 's':
        case 'S':
          onSnooze?.()
          break
        case 'Escape':
          onEscape?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, itemCount, selectedIndex, onSelectIndex, onOpen, onClaim, onResolve, onSnooze, onEscape])
}