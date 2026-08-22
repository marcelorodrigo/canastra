import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import AddTeams from '@/components/AddTeams.vue'

describe('AddTeams', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const teamCountButton = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('button')[0]

  it('advances to the next step after the auto-advance timer fires', async () => {
    const wrapper = mount(AddTeams)
    await teamCountButton(wrapper).trigger('click')
    vi.advanceTimersByTime(300)
    await nextTick()

    expect(wrapper.text()).toContain('Nomes das Equipes')
  })

  it('does not double-advance when team count is tapped rapidly', async () => {
    const wrapper = mount(AddTeams)
    await teamCountButton(wrapper).trigger('click')
    await teamCountButton(wrapper).trigger('click')
    vi.advanceTimersByTime(300)
    await nextTick()

    // Only a single advance to step 2, not a competing advance to step 3
    expect(wrapper.text()).toContain('Nomes das Equipes')
    expect(wrapper.text()).not.toContain('Meta de Pontos')
  })

  it('clears the pending auto-advance timer on unmount', async () => {
    const clearSpy = vi.spyOn(window, 'clearTimeout')
    const wrapper = mount(AddTeams)
    await teamCountButton(wrapper).trigger('click')

    wrapper.unmount()

    expect(clearSpy).toHaveBeenCalled()
  })
})
