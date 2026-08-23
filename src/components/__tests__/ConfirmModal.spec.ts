import { describe, it, expect, afterEach } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import ConfirmModal from '@/components/ConfirmModal.vue'

describe('ConfirmModal', () => {
  let wrapper: ReturnType<typeof mount> | undefined

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  const buttonByText = (text: string) =>
    Array.from(document.body.querySelectorAll('button')).find((b) =>
      (b.textContent ?? '').includes(text),
    ) as HTMLElement

  it('renders title, message and default action labels', () => {
    wrapper = mount(ConfirmModal, {
      props: { show: true, title: 'Excluir?', message: 'Tem certeza?' },
    })
    expect(document.body.textContent).toContain('Excluir?')
    expect(document.body.textContent).toContain('Tem certeza?')
    expect(buttonByText('Confirmar')).toBeTruthy()
    expect(buttonByText('Cancelar')).toBeTruthy()
  })

  it('emits confirm when the confirm button is clicked', async () => {
    wrapper = mount(ConfirmModal, {
      props: { show: true, title: 't', message: 'm', confirmText: 'Sim' },
    })
    await new DOMWrapper(buttonByText('Sim')).trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel when the cancel button is clicked', async () => {
    wrapper = mount(ConfirmModal, {
      props: { show: true, title: 't', message: 'm' },
    })
    await new DOMWrapper(buttonByText('Cancelar')).trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits cancel when the backdrop is clicked', async () => {
    wrapper = mount(ConfirmModal, {
      props: { show: true, title: 't', message: 'm' },
    })
    const backdrop = document.body.querySelector('.backdrop-blur-sm') as HTMLElement
    await new DOMWrapper(backdrop).trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('applies the confirm color classes', () => {
    wrapper = mount(ConfirmModal, {
      props: {
        show: true,
        title: 't',
        message: 'm',
        confirmText: 'Sim',
        confirmColor: 'red',
      },
    })
    expect(buttonByText('Sim').className).toContain('bg-red-500')
  })
})
