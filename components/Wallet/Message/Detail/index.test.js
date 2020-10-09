import { cleanup, render, screen, act } from '@testing-library/react'

import MessageDetail from '.'
import { SEND } from '../../../../constants'
import composeMockAppTree from '../../../../test-utils/composeMockAppTree'

describe('MessageHistory View', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it renders a final, sent, SEND transaction correctly', async () => {
    const address = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
    const message = {
      to: 't1wiomfs6nimyfztx6kyaxrry5yiewrjraqyou7oq',
      from: address,
      value: '100',
      cid: 'rdafdsagdfsa',
      status: 'confirmed',
      timestamp: '1234565678',
      method: SEND,
      params: {}
    }

    const { Tree } = composeMockAppTree('postOnboard')
    await act(async () => {
      const { container } = render(
        <Tree>
          <MessageDetail message={message} close={() => {}} address={address} />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getByText('Transaction Details')).toBeInTheDocument()
      expect(screen.getByText('SENT')).toBeInTheDocument()
    })
  })

  test('it renders a final, received, SEND transaction correctly', async () => {
    const address = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
    const message = {
      from: 't1wiomfs6nimyfztx6kyaxrry5yiewrjraqyou7oq',
      to: address,
      value: '100',
      cid: 'rdafdsagdfsa',
      status: 'confirmed',
      timestamp: '1234565678',
      method: SEND,
      params: {}
    }

    const { Tree } = composeMockAppTree('postOnboard')
    await act(async () => {
      const { container } = render(
        <Tree>
          <MessageDetail message={message} close={() => {}} address={address} />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getByText('Transaction Details')).toBeInTheDocument()
      expect(screen.getByText('RECEIVED')).toBeInTheDocument()
    })
  })

  test('it renders a pending, send transaction correctly', async () => {
    const address = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
    const message = {
      from: 't1wiomfs6nimyfztx6kyaxrry5yiewrjraqyou7oq',
      to: address,
      value: '100',
      cid: 'rdafdsagdfsa',
      status: 'pending',
      timestamp: '1234565678',
      method: SEND,
      params: {}
    }

    const { Tree } = composeMockAppTree('postOnboard')
    await act(async () => {
      const { container } = render(
        <Tree>
          <MessageDetail message={message} close={() => {}} address={address} />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getByText('Transaction Details')).toBeInTheDocument()
      expect(screen.getByText('PENDING')).toBeInTheDocument()
    })
  })
})
