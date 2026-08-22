import { computed, nextTick, onUnmounted, watch, useId, type Ref } from 'vue'
import { useScrollLock } from './useScrollLock'

const overlayStack: Array<() => void> = []

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface UseAccessibleOverlayOptions {
  isOpen: Ref<boolean>
  onClose: () => void
  initialFocus?: Ref<HTMLElement | null | undefined>
}

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

export function useAccessibleOverlay(
  target: Ref<HTMLElement | null>,
  options: UseAccessibleOverlayOptions,
) {
  const { isOpen, onClose, initialFocus } = options
  const titleId = useId()
  const { lock, unlock } = useScrollLock()

  let previouslyFocused: HTMLElement | null = null
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null

  const focusFirst = () => {
    if (initialFocus?.value) {
      initialFocus.value.focus()
      return
    }
    const focusable = getFocusable(target.value)
    if (focusable.length > 0) focusable[0].focus()
    else target.value?.focus()
  }

  const onKeydown = (e: KeyboardEvent) => {
    const isTopmost = overlayStack[overlayStack.length - 1] === onClose
    if (!isTopmost) return

    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab' || !target.value) return
    const focusable = getFocusable(target.value)
    if (focusable.length === 0) {
      e.preventDefault()
      target.value.focus()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement as HTMLElement | null
    if (e.shiftKey) {
      if (active === first || !target.value.contains(active)) {
        e.preventDefault()
        last.focus()
      }
    } else if (active === last || !target.value.contains(active)) {
      e.preventDefault()
      first.focus()
    }
  }

  const activate = () => {
    lock()
    overlayStack.push(onClose)
    previouslyFocused = (document.activeElement as HTMLElement | null) ?? null
    keydownHandler = onKeydown
    window.addEventListener('keydown', keydownHandler)
    nextTick(focusFirst)
  }

  const deactivate = () => {
    const index = overlayStack.lastIndexOf(onClose)
    if (index !== -1) overlayStack.splice(index, 1)
    if (keydownHandler) {
      window.removeEventListener('keydown', keydownHandler)
      keydownHandler = null
    }
    if (previouslyFocused && document.contains(previouslyFocused)) {
      previouslyFocused.focus()
    }
    previouslyFocused = null
    unlock()
  }

  watch(
    isOpen,
    (open) => {
      if (open) activate()
      else deactivate()
    },
    { immediate: true },
  )

  onUnmounted(() => {
    deactivate()
  })

  const dialogAttrs = computed(() => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': titleId,
  }))

  return { dialogAttrs, titleId }
}
