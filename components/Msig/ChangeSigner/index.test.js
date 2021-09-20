import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@glif/filecoin-number'

import ChangeSigner from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'
import {
  MULTISIG_ACTOR_ADDRESS,
  MULTISIG_SIGNER_ADDRESS
} from '../../../MsigProvider/__mocks__'

jest.mock('@glif/filecoin-wallet-provider')
jest.mock('../../../MsigProvider')

describe('Change signer flow', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  describe('Changing signers', () => {
    afterEach(() => {
      jest.clearAllTimers()
      cleanup()
    })

    test('it allows a user to change signer', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const toAddr = 't0100'

      await act(async () => {
        render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      expect(walletProvider.simulateMessage).toHaveBeenCalled()
      const message = walletProvider.wallet.sign.mock.calls[0][0]
      expect(!!message.gaspremium).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(!!message.gasfeecap).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(!!message.gaslimit).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe(MULTISIG_ACTOR_ADDRESS)

      expect(store.getState().messages.pending.length).toBe(1)
    })

    test('it does not allow a user to change address if address is poorly formed', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')

      await act(async () => {
        render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: 't51235jds' },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(screen.getByText(/Invalid to address/)).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it does not allow a user to change address if address is poorly formed (2)', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')

      await act(async () => {
        render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: '' },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(screen.getByText(/Invalid to address/)).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it allows the user to see the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
    })

    test('it allows the user to set the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '2000000' }
        })
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/Save/)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/)).toBeInTheDocument()
    })

    test('it allows the user to save the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '2000000' }
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Save'))
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/0.000000000002/)).toBeInTheDocument()
    })
  })

  describe('snapshots', () => {
    afterEach(cleanup)

    test('it renders preface correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      let res
      await act(async () => {
        res = render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
      })
      expect(res.container).toMatchSnapshot()
      expect(screen.getByText(/Warning/)).toBeInTheDocument()
      expect(
        screen.getByText(
          /You're changing a signer of your multisig account to a new Filecoin address/
        )
      ).toBeInTheDocument()
    })

    test('it renders step 2 correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      let res
      await act(async () => {
        res = render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(
        screen.getByText(/input the new Filecoin address/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/input the new Filecoin address/)
      ).toBeInTheDocument()
      expect(screen.getByText(/New signer/)).toBeInTheDocument()
      expect(screen.getByText(/Old signer/)).toBeInTheDocument()
      //f1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a
      expect(screen.getByText(/uo3a/)).toBeInTheDocument()
      expect(res.container).toMatchSnapshot()
    })

    test('it renders step 3 correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const toAddr = 't0100'

      let res
      await act(async () => {
        res = render(
          <Tree>
            <ChangeSigner oldSignerAddress={MULTISIG_SIGNER_ADDRESS} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
      })
      expect(
        screen.getByText(/review the transaction fee details/)
      ).toBeInTheDocument()
      expect(res.container).toMatchSnapshot()
    })
  })
})
