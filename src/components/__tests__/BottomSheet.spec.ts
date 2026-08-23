import { describe, it, expect, afterEach } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import BottomSheet from '@/components/BottomSheet.vue'

describe('BottomSheet', () => {
  let wrapper: ReturnType<typeof mount> | undefined

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('renders the title and slotted content', () => {
    wrapper = mount(BottomSheet, {
      props: { show: true, title: 'Adicionar Pontos' },
      slots: { default: '<p>conteúdo do formulário</p>' },
    })
    expect(document.body.textContent).toContain('Adicionar Pontos')
    expect(document.body.textContent).toContain('conteúdo do formulário')
  })

  it('emits close when the backdrop is clicked', async () => {
    wrapper = mount(BottomSheet, { props: { show: true, title: 't' } })
    const backdrop = document.body.querySelector('.backdrop-blur-sm') as HTMLElement
    await new DOMWrapper(backdrop).trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when the close button is clicked', async () => {
    wrapper = mount(BottomSheet, { props: { show: true, title: 't' } })
    const closeButton = Array.from(document.body.querySelectorAll('button')).find(
      (b) => (b.getAttribute('aria-label') ?? '') === 'Fechar',
    ) as HTMLElement
    await new DOMWrapper(closeButton).trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when Escape is pressed', async () => {
    wrapper = mount(BottomSheet, { props: { show: true, title: 't' } })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
