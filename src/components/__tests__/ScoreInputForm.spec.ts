import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ScoreInputForm from '@/components/ScoreInputForm.vue'
import { useCanastraStore } from '@/stores/canastra'

describe('ScoreInputForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useCanastraStore()
    store.startGame({
      teams: 2,
      names: ['Nós', 'Eles'],
      winningPoints: 3000,
      obrigacaoPoints: 1500,
    })
  })

  it('disables submit while any field is empty', () => {
    const wrapper = mount(ScoreInputForm)
    const submit = wrapper.find('button')
    expect((submit.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('enables submit and emits normalized scores when all fields are valid', async () => {
    const wrapper = mount(ScoreInputForm)
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(100)
    await inputs[1].setValue(-50)

    const submit = wrapper.find('button')
    expect((submit.element as HTMLButtonElement).disabled).toBe(false)

    await submit.trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([[100, -50]])
  })

  it('keeps submit disabled when a field is left non-finite', async () => {
    const wrapper = mount(ScoreInputForm)
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(100)
    // inputs[1] left empty -> non-finite

    const submit = wrapper.find('button')
    expect((submit.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('emits cancel when the cancel button is clicked', async () => {
    const wrapper = mount(ScoreInputForm)
    const cancel = wrapper.findAll('button').find((b) => (b.text() ?? '').includes('Cancelar'))
    expect(cancel).toBeDefined()
    await cancel!.trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('preserves negative scores when submitting', async () => {
    const wrapper = mount(ScoreInputForm)
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(-100)
    await inputs[1].setValue(50)

    const submit = wrapper.find('button')
    expect((submit.element as HTMLButtonElement).disabled).toBe(false)

    await submit.trigger('click')

    expect(wrapper.emitted('submit')![0]).toEqual([[-100, 50]])
  })

  it('renders the round total in primary for positive and red for negative', async () => {
    const wrapper = mount(ScoreInputForm)
    const inputs = wrapper.findAll('input')
    const totalEl = () =>
      wrapper
        .findAll('span')
        .find((s) => s.classes().includes('text-lg') && s.classes().includes('font-bold'))!

    await inputs[0].setValue(100)
    await inputs[1].setValue(50)
    expect(totalEl().classes()).toContain('text-primary-700')
    expect(totalEl().text()).toBe('+150')

    await inputs[0].setValue(-100)
    await inputs[1].setValue(50)
    expect(totalEl().classes()).toContain('text-red-600')
    expect(totalEl().text()).toBe('-50')
  })
})
