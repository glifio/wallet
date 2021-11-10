import Router from 'next/router'
import { FilecoinNumber } from '@glif/filecoin-number'
import { cleanup, render, screen } from '@testing-library/react'
import { RequireWallet } from './RequireWallet'
import { PAGE, SINGLE_KEY } from '../constants'

jest.mock('next/router')
const useWalletMock = jest.spyOn(
  require('../WalletProvider/useWallet'),
  'default'
)
Router.query = {}

const defaultWallet = {
  address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
  balance: new FilecoinNumber('1', 'fil'),
  path: SINGLE_KEY
}

const renderRequireWallet = (children, wallet = defaultWallet) => {
  return render(<RequireWallet wallet={wallet}>{children}</RequireWallet>)
}

describe('RequireWallet', () => {
  beforeEach(jest.clearAllMocks)
  afterEach(cleanup)

  test('it renders its children when a valid wallet is passed as a prop', async () => {
    useWalletMock.mockImplementation(() => defaultWallet)
    render(
      <RequireWallet>
        <div>Yo</div>
      </RequireWallet>
    )

    expect(screen.getByText('Yo')).toBeInTheDocument()
  })

  test('it redirects the user to onboarding if no wallet is passed', () => {
    Router.replace.mockImplementationOnce((uri) => {
      expect(uri).toBe(PAGE.LANDING)
    })

    useWalletMock.mockImplementation(() => noWallet)
    const noWallet = {
      balance: new FilecoinNumber('0', 'fil'),
      address: '',
      path: ''
    }
    renderRequireWallet(<div>child</div>, noWallet)
  })
})
