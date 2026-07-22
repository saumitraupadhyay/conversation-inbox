/**
 * Tiny observable store for the dev-only debug panel. MSW's request handlers
 * run in the page's own JS context (the service worker just proxies fetch),
 * so a plain module-level object is enough to let the DebugPanel influence
 * the mock server without any extra plumbing.
 */
type DebugState = {
  forceFailure: boolean
  slowNetwork: boolean
  emptyQueue: boolean
}

const state: DebugState = {
  forceFailure: false,
  slowNetwork: false,
  emptyQueue: false,
}

type Listener = () => void
const listeners = new Set<Listener>()

export function getDebugState(): DebugState {
  return state
}

export function setDebugState(patch: Partial<DebugState>): void {
  Object.assign(state, patch)
  listeners.forEach((l) => l())
}

export function subscribeDebugState(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}