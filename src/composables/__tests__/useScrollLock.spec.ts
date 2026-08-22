import { describe, it, expect, afterEach } from 'vitest'
import { useScrollLock } from '@/composables/useScrollLock'

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('locks body scroll and restores the previous overflow value on unlock', () => {
    document.body.style.overflow = 'auto'
    const { lock, unlock } = useScrollLock()
    lock()
    expect(document.body.style.overflow).toBe('hidden')
    unlock()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('is reference-counted so nested locks keep scroll hidden until the outermost unlocks', () => {
    const outer = useScrollLock()
    const inner = useScrollLock()
    outer.lock()
    inner.lock()
    expect(document.body.style.overflow).toBe('hidden')

    // Closing the inner overlay must NOT restore scroll while the outer stays open
    inner.unlock()
    expect(document.body.style.overflow).toBe('hidden')

    // Closing the outer restores the original (empty) value
    outer.unlock()
    expect(document.body.style.overflow).toBe('')
  })

  it('restores the exact overflow value that was present when the first lock was taken', () => {
    document.body.style.overflow = 'scroll'
    const { lock, unlock } = useScrollLock()
    lock()
    unlock()
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('is idempotent when unlock is called with no active lock', () => {
    const { unlock } = useScrollLock()
    expect(() => unlock()).not.toThrow()
    expect(document.body.style.overflow).toBe('')
  })
})
