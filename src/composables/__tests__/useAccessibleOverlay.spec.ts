import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, toRef, defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useAccessibleOverlay } from '@/composables/useAccessibleOverlay'

const Harness = defineComponent({
  props: {
    open: { type: Boolean, default: true },
    closeFn: { type: Function as unknown as () => () => void, required: true },
  },
  setup(props) {
    const target = ref<HTMLElement | null>(null)
    const { dialogAttrs, titleId } = useAccessibleOverlay(target, {
      isOpen: toRef(props, 'open'),
      onClose: props.closeFn,
    })
    return { target, dialogAttrs, titleId }
  },
  template: `<div ref="target" v-bind="dialogAttrs" tabindex="-1"><button>First</button><button>Second</button></div>`,
})

const mountHarness = (props: { open?: boolean; closeFn: () => void }) =>
  mount(Harness, { props, attachTo: document.body })

beforeEach(() => {
  document.body.style.overflow = ''
})

afterEach(() => {
  document.body.style.overflow = ''
  document.body.innerHTML = ''
})

describe('useAccessibleOverlay', () => {
  it('exposes role=dialog, aria-modal and a matching labelledby id', async () => {
    const wrapper = mountHarness({ closeFn: vi.fn() })
    await nextTick()
    const root = wrapper.find('div')
    expect(root.attributes('role')).toBe('dialog')
    expect(root.attributes('aria-modal')).toBe('true')
    const labelledby = root.attributes('aria-labelledby')
    expect(labelledby).toBeTruthy()
    wrapper.unmount()
  })

  it('locks body scroll when opened and restores it on unmount', async () => {
    const wrapper = mountHarness({ closeFn: vi.fn() })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('moves focus into the overlay on open', async () => {
    const wrapper = mountHarness({ closeFn: vi.fn() })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('button').element)
    wrapper.unmount()
  })

  it('restores focus to the trigger on close', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    const wrapper = mountHarness({ closeFn: vi.fn() })
    await nextTick()
    expect(document.activeElement).not.toBe(trigger)
    wrapper.unmount()
    await nextTick()
    expect(document.activeElement).toBe(trigger)
  })

  it('only invokes the topmost overlay close handler on Escape', async () => {
    const onClose1 = vi.fn()
    const onClose2 = vi.fn()
    const w1 = mountHarness({ closeFn: onClose1 })
    const w2 = mountHarness({ closeFn: onClose2 })
    await nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(onClose2).toHaveBeenCalledTimes(1)
    expect(onClose1).not.toHaveBeenCalled()
    w2.unmount()
    w1.unmount()
  })

  it('traps Tab focus within the overlay', async () => {
    const wrapper = mountHarness({ closeFn: vi.fn() })
    await nextTick()
    const buttons = wrapper.findAll('button')
    const [first, second] = buttons

    // Focus lands on the first focusable on open
    expect(document.activeElement).toBe(first.element)

    // Tab forward from the last focusable wraps back to the first
    second.element.focus()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    expect(document.activeElement).toBe(first.element)

    // Shift+Tab from the first focusable wraps to the last
    first.element.focus()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }))
    expect(document.activeElement).toBe(second.element)

    wrapper.unmount()
  })

  it('does nothing on Escape when no overlay is open', () => {
    const onClose = vi.fn()
    const wrapper = mountHarness({ open: false, closeFn: onClose })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onClose).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('keeps the scroll lock while a second overlay is open when the first unmounts', async () => {
    const w1 = mountHarness({ closeFn: vi.fn() })
    const w2 = mountHarness({ closeFn: vi.fn() })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    // Unmount the first overlay while the second remains open
    w1.unmount()
    expect(document.body.style.overflow).toBe('hidden')

    // Only closing the still-open second overlay releases the lock
    w2.unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
