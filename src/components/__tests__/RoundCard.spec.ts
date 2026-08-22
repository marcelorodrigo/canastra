import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RoundCard from '@/components/RoundCard.vue'

const baseProps = {
  round: [100, 200],
  roundNumber: 1,
  teamNames: ['Nós', 'Eles'],
}

const touch = (screenX: number) => ({ changedTouches: [{ screenX }] })

describe('RoundCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const swipeLeftClasses = (wrapper: ReturnType<typeof mount>) =>
    wrapper.classes().includes('-translate-x-20') && wrapper.classes().includes('opacity-50')

  it('shows the swipe-to-delete action on a left swipe and hides it after the timer', async () => {
    const wrapper = mount(RoundCard, { props: { ...baseProps } })
    await wrapper.trigger('touchstart', touch(200))
    await wrapper.trigger('touchmove', touch(100))
    await wrapper.trigger('touchend')
    await nextTick()

    expect(swipeLeftClasses(wrapper)).toBe(true)

    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(swipeLeftClasses(wrapper)).toBe(false)
  })

  it('clears a pending reset timer before scheduling a competing one', async () => {
    const clearSpy = vi.spyOn(window, 'clearTimeout')
    const wrapper = mount(RoundCard, { props: { ...baseProps } })

    await wrapper.trigger('touchstart', touch(200))
    await wrapper.trigger('touchmove', touch(100))
    await wrapper.trigger('touchend')

    await wrapper.trigger('touchstart', touch(100))
    await wrapper.trigger('touchmove', touch(0))
    await wrapper.trigger('touchend')

    expect(clearSpy).toHaveBeenCalled()
  })

  it('clears the pending reset timer on unmount', async () => {
    const clearSpy = vi.spyOn(window, 'clearTimeout')
    const wrapper = mount(RoundCard, { props: { ...baseProps } })

    await wrapper.trigger('touchstart', touch(200))
    await wrapper.trigger('touchmove', touch(100))
    await wrapper.trigger('touchend')

    wrapper.unmount()

    expect(clearSpy).toHaveBeenCalled()
  })

  it('resets touchEndX per gesture so a stale value cannot trigger a phantom swipe', async () => {
    const wrapper = mount(RoundCard, { props: { ...baseProps } })

    // First gesture: left swipe
    await wrapper.trigger('touchstart', touch(200))
    await wrapper.trigger('touchmove', touch(100))
    await wrapper.trigger('touchend')
    expect(swipeLeftClasses(wrapper)).toBe(true)

    // Second gesture: right swipe without reusing the previous end position
    await wrapper.trigger('touchstart', touch(200))
    await wrapper.trigger('touchmove', touch(300))
    await wrapper.trigger('touchend')
    await nextTick()

    expect(swipeLeftClasses(wrapper)).toBe(false)
  })

  it('gives the delete button an accessible name and marks its icon decorative', () => {
    const wrapper = mount(RoundCard, { props: { ...baseProps } })
    const deleteButton = wrapper.find('button')

    expect(deleteButton.attributes('aria-label')).toBe('Remover rodada')
    expect(deleteButton.find('svg').attributes('aria-hidden')).toBe('true')
  })
})
