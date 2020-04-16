import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { StyledATag } from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

describe('StyledATag', () => {
  afterEach(cleanup)
  test('renders the StyledATag', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <StyledATag
          rel='noopener'
          target='_blank'
          href='https://openworklabs.com'
          fontSize={3}
          color='core.white'
        />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the StyledATag with the right attributes', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <StyledATag
          rel='noopener'
          target='_blank'
          href='https://openworklabs.com/'
          fontSize={3}
          color='core.white'
        />
      </Tree>
    )

    const a = container.querySelector('a')
    expect(a.target).toBe('_blank')
    expect(a.href).toBe('https://openworklabs.com/')
    expect(a).toHaveStyle('font-size: 1.25rem; color: rgb(255, 255, 255);')
  })

  test('renders text in StyledATag', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { getByText } = render(
      <Tree>
        <StyledATag
          rel='noopener'
          target='_blank'
          href='https://openworklabs.com'
          fontSize={3}
          color='core.white'
        >
          Send
        </StyledATag>
      </Tree>
    )

    expect(getByText('Send')).toBeTruthy()
  })
})
