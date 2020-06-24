import { act, renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import { cleanup } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import {
  filscanMockData,
  secondaryFilscanMockData
} from '../../../test-utils/mockData'

import useTransactionHistory from './useFilscanTransactionHistory'

jest.mock('axios')

const sampleSuccessResponse = {
  data: {
    data: {
      data: filscanMockData,
      total: '20'
    },
    res: { code: 3, msg: 'success' }
  }
}

const secondSampleSuccessResponse = {
  data: {
    data: {
      data: secondaryFilscanMockData,
      total: '20'
    },
    res: { code: 3, msg: 'success' }
  }
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
    expect(confirmed.length).toBe(8)
    expect(confirmed[0]).toHaveProperty('from', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gaslimit', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gasprice', expect.any(String))
    expect(confirmed[0]).toHaveProperty('method', expect.any(String))
    expect(confirmed[0]).toHaveProperty('nonce', expect.any(String))
    expect(confirmed[0]).toHaveProperty('value', expect.any(String))
    expect(confirmed[0]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gas_used', expect.any(String))
    expect(confirmed[0]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it fetches more data when showMore gets called', async () => {
    axios.post
      .mockResolvedValueOnce(sampleSuccessResponse)
      .mockResolvedValueOnce(secondSampleSuccessResponse)

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
    expect(confirmed[11]).toHaveProperty('nonce')
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
