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
    expect(screen.getByText('Wallet')).toBeInTheDocument()
  })

  test('it renders all wallet options when in dev mode', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    act(() => {
      fireEvent.click(screen.getByText('Dev Mode'))
    })
    expect(screen.queryByText('Ledger Device')).toBeInTheDocument()
    expect(screen.queryByText('SAFT Setup')).toBeInTheDocument()
    expect(screen.getByText('Generate Seed Phrase')).toBeInTheDocument()
    expect(screen.getByText('Import Seed Phrase')).toBeInTheDocument()
    expect(screen.getByText('Import Private Key')).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders warning text for create wallet option', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    // not sure why this fails with 1 act
    act(() => {
      fireEvent.click(screen.getByText('Dev Mode'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Generate Seed Phrase'))
    })
    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText(/Warning/)).toBeInTheDocument()
  })

  test('it renders warning text for import seed option', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    act(() => {
      fireEvent.click(screen.getByText('Dev Mode'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Import Seed Phrase'))
    })
    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText(/Warning/)).toBeInTheDocument()
  })

  test('it renders warning text for import private key option', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Choose />
      </Tree>
    )
    act(() => {
      fireEvent.click(screen.getByText('Dev Mode'))
    })
    act(() => {
      fireEvent.click(screen.getByText('Import Private Key'))
    })
    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText(/Warning/)).toBeInTheDocument()
  })
})
