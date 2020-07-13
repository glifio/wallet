import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import {
  fetchedConfirmedMessagesSuccess,
  fetchedConfirmedMessagesFailure,
  fetchingConfirmedMessages,
  fetchingNextPage
} from '../../../store/actions'
import { FILSCAN } from '../../../constants'
import { formatFilscanMessages } from './formatMessages'
import useWallet from '../../../WalletProvider/useWallet'
import reportError from '../../../utils/reportError'

const PAGINATION_COUNT = 8

export default () => {
  const { address } = useWallet()
  const dispatch = useDispatch()
  const {
    loading,
    loadedSuccess,
    loadedFailure,
    pending,
    confirmed,
    total,
    paginating
  } = useSelector(state => {
    return {
      ...state.messages,
      confirmed: state.messages.confirmed.map(message => ({
        ...message,
        status: 'confirmed'
      })),
      pending: state.messages.pending.map(message => ({
        ...message,
        status: 'pending'
      }))
    }
  })

  const fetchData = useCallback(
    async (address, total, cachedCount) => {
      if (total === cachedCount) return
      try {
        const { data } = await axios.post(
          `${FILSCAN}/messages/MessageByAddress`,
          {
            method: '',
            begindex: cachedCount,
            count: PAGINATION_COUNT,
            address,
            from_to: ''
          }
        )

        // filscan reports 3 as success code https://github.com/filecoin-shipyard/filscan-backend/blob/master/Filscan_Interface_v1.0.md#2public-response-parameters
        if (data.res.code !== 3) {
          dispatch(
            fetchedConfirmedMessagesFailure(
              new Error('Error fetching from Filscan: ', data.res.msg)
            )
          )
          reportError(12, false, 'Error fetching from Filscan: ', data.res.msg)
        } else {
          const formattedMessages = formatFilscanMessages(data.data.data)
          dispatch(
            fetchedConfirmedMessagesSuccess(
              formattedMessages,
              Number(data.data.total)
            )
          )
        }
      } catch (err) {
        reportError(13, false, err.message, err.stack)
        dispatch(fetchedConfirmedMessagesFailure(err))
      }
    },
    [dispatch]
  )

  const showMore = useCallback(() => {
    dispatch(fetchingNextPage())
    fetchData(address, total, confirmed.length)
  }, [address, confirmed.length, total, fetchData, dispatch])

  const refresh = useCallback(() => {
    dispatch(fetchingConfirmedMessages())
    fetchData(address, total, 0)
  }, [address, total, fetchData, dispatch])

  useEffect(() => {
    if (!loading && !loadedFailure && !loadedSuccess) {
      dispatch(fetchingConfirmedMessages())
      fetchData(address, total, confirmed.length)
    }
  }, [
    address,
    total,
    confirmed.length,
    loading,
    loadedFailure,
    loadedSuccess,
    fetchData,
    dispatch
  ])

  return {
    loading,
    loadedSuccess,
    loadedFailure,
    pending,
    confirmed,
    showMore,
    refresh,
    paginating,
    total
  }
}
