import { act, renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import { cleanup } from '@testing-library/react'
import composeMockAppTree from '../../test-utils/composeMockAppTree'
import {
  filfoxMockData,
  secondaryFilfoxMockData
} from '../../test-utils/mockData'

import useTransactionHistory from '.'

jest.mock('axios')

const sampleSuccessResponse = {
  status: 200,
  data: {
    messages: filfoxMockData,
    methods: ['Propose', 'Send'],
    totalCount: 40
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

    const { waitForNextUpdate } = renderHook(
      () => useTransactionHistory('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'),
      {
        wrapper: Tree
      }
    )

    await waitForNextUpdate()

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(sampleSuccessResponse.data.totalCount)
    expect(confirmed.length).toBe(sampleSuccessResponse.data.messages.length)
    expect(confirmed[0]).toHaveProperty('from', expect.any(String))
    expect(confirmed[0]).toHaveProperty('maxFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('paidFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('method', expect.any(String))
    expect(confirmed[0]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('value', expect.any(String))
    expect(confirmed[0]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[0]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it fetches more data when showMore gets called', async () => {
    const secondarySampleSuccessResponse = {
      status: 200,
      data: {
        messages: secondaryFilfoxMockData,
        methods: ['Propose', 'Send'],
        totalCount: 40
      }
    }
    axios.get
      .mockResolvedValueOnce(sampleSuccessResponse)
      .mockResolvedValueOnce(secondarySampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const {
      result: { current },
      waitForNextUpdate
    } = renderHook(
      () => useTransactionHistory('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'),
      {
        wrapper: Tree
      }
    )

    await act(async () => {
      current.showMore()
      await waitForNextUpdate()
    })

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(sampleSuccessResponse.data.totalCount)
    expect(confirmed.length).toBeGreaterThan(
      sampleSuccessResponse.data.messages.length
    )
    expect(confirmed[0]).toHaveProperty('from', expect.any(String))
    expect(confirmed[0]).toHaveProperty('maxFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('paidFee', expect.any(String))
    expect(confirmed[0]).toHaveProperty('method', expect.any(String))
    expect(confirmed[0]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('value', expect.any(String))
    expect(confirmed[0]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[0]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it fetches new data when refresh gets called', async () => {
    const secondarySampleSuccessResponse = {
      status: 200,
      data: {
        messages: secondaryFilfoxMockData,
        methods: ['Propose', 'Send'],
        totalCount: 40
      }
    }
    axios.get
      .mockResolvedValueOnce(sampleSuccessResponse)
      .mockResolvedValueOnce(secondarySampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const {
      result: { current },
      waitForNextUpdate
    } = renderHook(
      () => useTransactionHistory('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'),
      {
        wrapper: Tree
      }
    )

    await act(async () => {
      current.refresh()
      await waitForNextUpdate()
    })

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(sampleSuccessResponse.data.totalCount)
    expect(confirmed.length).toBeGreaterThan(
      sampleSuccessResponse.data.messages.length
    )
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it does not add duplicate data to redux', async () => {
    const secondarySampleSuccessResponse = {
      status: 200,
      data: {
        messages: filfoxMockData,
        methods: ['Propose', 'Send'],
        totalCount: 40
      }
    }
    axios.get
      .mockResolvedValueOnce(sampleSuccessResponse)
      .mockResolvedValueOnce(secondarySampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const {
      result: { current },
      waitForNextUpdate
    } = renderHook(
      () => useTransactionHistory('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'),
      {
        wrapper: Tree
      }
    )

    await act(async () => {
      current.refresh()
      await waitForNextUpdate()
    })

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(sampleSuccessResponse.data.totalCount)
    expect(confirmed.length).toBe(sampleSuccessResponse.data.messages.length)
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it handles errors from filfox', async () => {
    axios.get.mockRejectedValue(new Error('error!'))

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(
      () => useTransactionHistory('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'),
      {
        wrapper: Tree
      }
    )

    await waitForNextUpdate()

    expect(store.getState().messages.loadedFailure).toBeTruthy()
    expect(store.getState().messages.loadedSuccess).toBeFalsy()
  })

  test('it handles unknown addresses', async () => {
    axios.get.mockRejectedValue(new Error('404'))

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(
      () => useTransactionHistory('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'),
      {
        wrapper: Tree
      }
    )

    await waitForNextUpdate()

    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
    expect(store.getState().messages.confirmed.length).toBe(0)
  })
})
