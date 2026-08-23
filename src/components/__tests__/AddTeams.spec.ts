import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import AddTeams from '@/components/AddTeams.vue'
import { useCanastraStore } from '@/stores/canastra'

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

  const clickByText = async (wrapper: ReturnType<typeof mount>, text: string) => {
    const button = wrapper.findAll('button').find((b) => (b.text() ?? '').includes(text))
    expect(button).toBeDefined()
    await button!.trigger('click')
    await nextTick()
  }

  const startTeamOption = async (wrapper: ReturnType<typeof mount>) => {
    await clickByText(wrapper, '2 Equipes')
    vi.advanceTimersByTime(300)
    await nextTick()
  }

  it('runs the full setup journey and starts a two-team game', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(AddTeams, { global: { plugins: [pinia] } })

    await startTeamOption(wrapper)
    expect(wrapper.text()).toContain('Nomes das Equipes')

    const nameInputs = wrapper.findAll('input')
    await nameInputs[0].setValue('Nós')
    await nameInputs[1].setValue('Eles')
    await clickByText(wrapper, 'Próximo')
    expect(wrapper.text()).toContain('Meta de Pontos')

    await clickByText(wrapper, 'Próximo')
    expect(wrapper.text()).toContain('Configuração de Obrigação')

    const store = useCanastraStore()
    expect(store.obrigacaoPoints).toBe(1500)

    await clickByText(wrapper, 'Iniciar Jogo')

    expect(store.hasActiveGame).toBe(true)
    expect(store.teams).toBe(2)
  })

  it('keeps the next button disabled on step 2 while a team name is blank', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(AddTeams, { global: { plugins: [pinia] } })

    await startTeamOption(wrapper)

    const nameInputs = wrapper.findAll('input')
    await nameInputs[0].setValue('Nós')
    await nameInputs[1].setValue('')

    const nextButton = wrapper
      .findAll('button')
      .find((b) => (b.text() ?? '').includes('Próximo'))!
    expect((nextButton.element as HTMLButtonElement).disabled).toBe(true)
    expect(wrapper.text()).toContain('Nomes das Equipes')
  })

  it('auto-sets obrigação to half the winning target when starting a game', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(AddTeams, { global: { plugins: [pinia] } })

    await startTeamOption(wrapper)

    const nameInputs = wrapper.findAll('input')
    await nameInputs[0].setValue('Nós')
    await nameInputs[1].setValue('Eles')
    await clickByText(wrapper, 'Próximo')

    await clickByText(wrapper, '2500')
    await clickByText(wrapper, 'Próximo')
    expect(wrapper.text()).toContain('Configuração de Obrigação')

    await clickByText(wrapper, 'Iniciar Jogo')

    const store = useCanastraStore()
    expect(store.winningPoints).toBe(2500)
    expect(store.obrigacaoPoints).toBe(1250)
    expect(store.hasActiveGame).toBe(true)
  })
})
