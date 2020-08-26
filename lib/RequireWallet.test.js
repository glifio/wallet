import Router from 'next/router'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { cleanup, render } from '@testing-library/react'
import { RequireWallet } from './RequireWallet'
import { TESTNET, SINGLE_KEY } from '../constants'

jest.mock('next/router')
Router.query = {}

const defaultWallet = {
  address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
  balance: new FilecoinNumber('1', 'fil'),
  path: SINGLE_KEY
}

const renderRequireWallet = (
  children,
  wallet = defaultWallet,
  network = TESTNET
) => {
  return render(
    <RequireWallet wallet={wallet} network={network}>
      {children}
    </RequireWallet>
  )
}

describe('RequireWallet', () => {
  afterEach(cleanup)

  test('it renders its children when a valid wallet is passed as a prop', async () => {
    const { findAllByText } = renderRequireWallet(<div>child</div>)
    const items = await findAllByText(/child/)
    expect(items).toHaveLength(1)
  })

  test('it redirects the user to onboarding if no wallet is passed', () => {
    Router.replace.mockImplementationOnce(uri => {
      expect(uri).toBe('/?network=t')
    })
    const noWallet = {
      balance: new FilecoinNumber('0', 'fil'),
      address: '',
      path: ''
    }
    renderRequireWallet(<div>child</div>, noWallet)
  })
})
