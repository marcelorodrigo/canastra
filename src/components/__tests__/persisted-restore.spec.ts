import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick, createApp } from 'vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import { useCanastraStore } from '@/stores/canastra'

describe('persisted restore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('restores an active game after the app reloads', async () => {
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    createApp(() => {}).use(pinia)
    setActivePinia(pinia)
    const store = useCanastraStore()
    store.startGame({
      teams: 2,
      names: ['Nós', 'Eles'],
      winningPoints: 3000,
      obrigacaoPoints: 1500,
    })
    store.addRound([100, 200])
    await nextTick()

    expect(localStorage.getItem('scores')).toBeTruthy()

    const wrapper = mount(App, { global: { plugins: [pinia] } })
    expect(wrapper.text()).toContain('Nós')
    wrapper.unmount()

    const freshPinia = createPinia()
    freshPinia.use(piniaPluginPersistedstate)
    createApp(() => {}).use(freshPinia)
    setActivePinia(freshPinia)
    const reloaded = mount(App, { global: { plugins: [freshPinia] } })

    expect(reloaded.findComponent({ name: 'ListMatches' }).exists()).toBe(true)
    expect(reloaded.text()).toContain('Nós')
  })
})
