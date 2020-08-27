import { act, renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import { cleanup } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import {
  filscoutMockData,
  secondaryFilscoutMockData
} from '../../../test-utils/mockData'

import useTransactionHistory from './useTransactionHistory'

jest.mock('axios')

const sampleSuccessResponse = {
  data: {
    code: 200,
    data: {
      data: filscoutMockData,
      pagination: { total: 47, page: 1, page_size: 15 }
    },
    error: 'ok'
  }
}

describe('useTransactionHistory', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it fetches and stores the transaction history in redux', async () => {
    axios.get.mockResolvedValue(sampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await waitForNextUpdate()

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(47)
    expect(confirmed.length).toBe(15)
    expect(confirmed[0]).toHaveProperty('from', expect.any(String))
    expect(confirmed[0]).toHaveProperty('maxFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('paidFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('method', expect.any(String))
    expect(confirmed[0]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('value', expect.any(String))
    expect(confirmed[0]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gas_used', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it fetches more data when showMore gets called', async () => {
    const secondarySampleSuccessResponse = {
      data: {
        code: 200,
        data: {
          data: secondaryFilscoutMockData,
          pagination: { total: 47, page: 1, page_size: 15 }
        },
        error: 'ok'
      }
    }
    axios.get
      .mockResolvedValueOnce(sampleSuccessResponse)
      .mockResolvedValueOnce(secondarySampleSuccessResponse)

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
    expect(total).toBe(47)
    expect(confirmed.length).toBeGreaterThan(15)
    expect(confirmed[0]).toHaveProperty('from', expect.any(String))
    expect(confirmed[0]).toHaveProperty('maxFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('paidFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('method', expect.any(String))
    expect(confirmed[0]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('value', expect.any(String))
    expect(confirmed[0]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gas_used', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it fetches new data when refresh gets called', async () => {
    const secondarySampleSuccessResponse = {
      data: {
        code: 200,
        data: {
          data: secondaryFilscoutMockData,
          pagination: { total: 47, page: 1, page_size: 15 }
        },
        error: 'ok'
      }
    }
    axios.get
      .mockResolvedValueOnce(sampleSuccessResponse)
      .mockResolvedValueOnce(secondarySampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const {
      result: { current },
      waitForNextUpdate
    } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await act(async () => {
      current.refresh()
      await waitForNextUpdate()
    })

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(47)
    expect(confirmed.length).toBeGreaterThan(15)
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it does not add duplicate data to redux', async () => {
    const secondarySampleSuccessResponse = {
      data: {
        code: 200,
        data: {
          data: filscoutMockData,
          pagination: { total: 47, page: 1, page_size: 15 }
        },
        error: 'ok'
      }
    }
    axios.get
      .mockResolvedValueOnce(sampleSuccessResponse)
      .mockResolvedValueOnce(secondarySampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const {
      result: { current },
      waitForNextUpdate
    } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await act(async () => {
      current.refresh()
      await waitForNextUpdate()
    })

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(47)
    expect(confirmed.length).toBe(15)
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it handles errors from filscout', async () => {
    const sampleFailResponse = {
      data: {
        code: 500,
        error: 'kobe!'
      }
    }

    axios.get.mockResolvedValue(sampleFailResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await waitForNextUpdate()

    expect(store.getState().messages.loadedFailure).toBeTruthy()
    expect(store.getState().messages.loadedSuccess).toBeFalsy()
  })
})
