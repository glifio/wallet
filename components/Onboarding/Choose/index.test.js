import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

import Choose from '.'

describe('Choosing a wallet', () => {
  afterEach(cleanup)
  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders warning text for create wallet option', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    act(() => {
      fireEvent.click(
        screen.getByText(
          'New to crypto? We’ll create a new seed phrase for you'
        )
      )
    })
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders warning text for import seed option', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    act(() => {
      fireEvent.click(screen.getByText('Import Seed Phrase'))
    })
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders warning text for import private key option', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    act(() => {
      fireEvent.click(screen.getByText('Import Private Key'))
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
