import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import Send from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'

jest.mock('@openworklabs/filecoin-wallet-provider')

describe('Send Flow', () => {
  let close = () => {}
  beforeEach(() => {
    jest.clearAllMocks()
    close = jest.fn()
  })

  describe('Sending a message', () => {
    afterEach(cleanup)

    test('it allows a user to send a message', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const address = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'
      const filAmount = new FilecoinNumber('.01', 'fil')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: { value: address }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
        fireEvent.click(screen.getByText('Confirm'))
        await flushPromises()
      })
      expect(walletProvider.getNonce).toHaveBeenCalled()
      console.log(store.getState())
    })
  })
})
