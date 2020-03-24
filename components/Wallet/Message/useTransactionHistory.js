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
import formatFilscanMessages from './formatFilscanMessages'

const PAGINATION_COUNT = 8

export default address => {
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

  const fetchInitialData = useCallback(async () => {
    if (total === confirmed.length) return
    try {
      const { data } = await axios.post(
        `${FILSCAN}/messages/MessageByAddress`,
        {
          method: '',
          begindex: confirmed.length,
          count: PAGINATION_COUNT,
          // address,
          address: 't1hn7twanih6djfrg7s3phaek3ayge72c6vhndrhq',
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
      dispatch(fetchedConfirmedMessagesFailure(new Error(err.message)))
    }
  }, [address, confirmed.length, dispatch, total])

  const showMore = useCallback(() => {
    dispatch(fetchingNextPage())
    fetchInitialData()
  }, [fetchInitialData, dispatch])

  useEffect(() => {
    if (!loading && !loadedFailure && !loadedSuccess) {
      dispatch(fetchingConfirmedMessages())
      fetchInitialData()
    }
  }, [loading, loadedFailure, loadedSuccess, fetchInitialData, dispatch])

  return {
    loading,
    loadedSuccess,
    loadedFailure,
    pending,
    confirmed,
    showMore,
    paginating,
    total
  }
}
