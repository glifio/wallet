import { act, renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import { cleanup } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

import useTransactionHistory from './useFilscanTransactionHistory'

jest.mock('axios')

const sampleSuccessResponse = {
  data: {
    data: {
      data: [],
      total: '20'
    },
    res: { code: 3, msg: 'success' }
  }
}

for (let i = 0; i < 10; i++) {
  const sampleMessageFromFilscan = {
    block_cids: [
      'bafy2bzacedhezqvd2nae4wuiilkygot6m63brn4ex7vj5tfpkjwwzddkxjuyq'
    ],
    cid: `bafy2bzacebqph7t55ncquxehaacec6poc7g376xiqtj5elklupctpltvywd4o${i}`,
    exit_code: '',
    gas_used: '',
    height: i,
    method_name: 'Transfer',
    msg: {
      from:
        i % 2 === 0
          ? 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'
          : 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy',
      gaslimit: '10000',
      gasprice: '0',
      method: '0',
      nonce: i,
      params: '',
      from:
        i % 2 === 0
          ? 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
          : 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi',
      value: '0.005'
    },
    msgcreate: `158646683${i}`,
    return: '',
    size: '63'
  }

  sampleSuccessResponse.data.data.data.push(sampleMessageFromFilscan)
}

describe('useTransactionHistory', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it fetches and stores the transaction history in redux', async () => {
    axios.post.mockResolvedValue(sampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await waitForNextUpdate()

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(20)
    expect(confirmed.length).toBe(10)
    expect(confirmed[0]).toHaveProperty('from', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gaslimit', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gasprice', expect.any(String))
    expect(confirmed[0]).toHaveProperty('method', expect.any(String))
    expect(confirmed[0]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('value', expect.any(String))
    expect(confirmed[0]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gas_used', expect.any(String))
    expect(confirmed[0]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it fetches more data when showMore gets called', async () => {
    axios.post.mockResolvedValue(sampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const {
      result: { current },
      waitForNextUpdate
    } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await act(async () => {
      current.showMore()
      await waitForNextUpdate()
    })

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(20)
    expect(confirmed.length).toBeGreaterThan(10)
    expect(confirmed[11]).toHaveProperty('from', expect.any(String))
    expect(confirmed[11]).toHaveProperty('gaslimit', expect.any(String))
    expect(confirmed[11]).toHaveProperty('gasprice', expect.any(String))
    expect(confirmed[11]).toHaveProperty('method', expect.any(String))
    expect(confirmed[11]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[11]).toHaveProperty('value', expect.any(String))
    expect(confirmed[11]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[11]).toHaveProperty('gas_used', expect.any(String))
    expect(confirmed[11]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it handles errors from filscan', async () => {
    const sampleFailResponse = {
      data: {
        data: {
          data: [],
          total: '20'
        },
        res: { code: 4, msg: '' }
      }
    }

    axios.post.mockResolvedValue(sampleFailResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await waitForNextUpdate()

    expect(store.getState().messages.loadedFailure).toBeTruthy()
    expect(store.getState().messages.loadedSuccess).toBeFalsy()
  })
})
