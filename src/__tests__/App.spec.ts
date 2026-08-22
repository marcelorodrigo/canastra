import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import App from '../App.vue'
import { useCanastraStore } from '@/stores/canastra'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Marcador de Canastra')
  })

  it('renders a single semantic main landmark', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.findAll('main')).toHaveLength(1)
  })

  it('shows the setup wizard before a game starts', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.text()).toContain('Novo Jogo')
    expect(wrapper.findComponent({ name: 'ListMatches' }).exists()).toBe(false)
  })

  it('restarts the wizard at step 1 after reset', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useCanastraStore()
    store.startGame({
      teams: 2,
      names: ['Nós', 'Eles'],
      winningPoints: 3000,
      obrigacaoPoints: 1500,
    })

    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    })
    // Game view is shown
    expect(wrapper.findComponent({ name: 'ListMatches' }).exists()).toBe(true)

    store.reset()
    await wrapper.vm.$nextTick()

    // Wizard remounts fresh at step 1
    expect(wrapper.findComponent({ name: 'ListMatches' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Novo Jogo')
  })
})
