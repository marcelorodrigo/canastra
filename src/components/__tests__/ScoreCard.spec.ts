import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScoreCard from '@/components/ScoreCard.vue'

describe('ScoreCard', () => {
  const baseProps = {
    teamName: 'Nós',
    score: 100,
    progressPercentage: 3,
  }

  it('renders a flex root container so layout classes take effect', () => {
    const wrapper = mount(ScoreCard, { props: { ...baseProps, layout: 'horizontal' } })
    expect(wrapper.element.classList.contains('flex')).toBe(true)
  })

  it('applies flex-row for horizontal layout', () => {
    const wrapper = mount(ScoreCard, { props: { ...baseProps, layout: 'horizontal' } })
    expect(wrapper.element.classList.contains('flex-row')).toBe(true)
    expect(wrapper.element.classList.contains('flex-col')).toBe(false)
  })

  it('applies flex-col for vertical layout', () => {
    const wrapper = mount(ScoreCard, { props: { ...baseProps, layout: 'vertical' } })
    expect(wrapper.element.classList.contains('flex-col')).toBe(true)
    expect(wrapper.element.classList.contains('flex-row')).toBe(false)
  })
})
