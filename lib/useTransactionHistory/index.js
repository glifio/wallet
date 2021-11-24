import { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import {
  fetchedConfirmedMessagesSuccess,
  fetchedConfirmedMessagesFailure,
  fetchingConfirmedMessages,
  fetchingNextPage
} from '../../store/actions'
import { FILFOX } from '../../constants'
import { formatFilfoxMessages } from './formatMessages'
import getMsgParams from './getMsgParams'
import reportError from '../../utils/reportError'

const useTransactionHistory = (address) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const {
    loading,
    loadedSuccess,
    loadedFailure,
    pending,
    confirmed,
    total,
    paginating
  } = useSelector((state) => {
    return {
      ...state.messages,
      confirmed: state.messages.confirmed.map((message) => ({
        ...message,
        status: 'confirmed'
      })),
      pending: state.messages.pending.map((message) => ({
        ...message,
        status: 'pending'
      }))
    }
  })

  const fetchData = useCallback(
    async (address, page = 0, pageSize = 10) => {
      try {
        const res = await axios.get(
          `${FILFOX}/v1/address/${address}/messages?pageSize=${pageSize}&page=${page}&detailed`
        )

        if (res.status !== 200) {
          dispatch(
            fetchedConfirmedMessagesFailure(
              new Error('Error fetching from Filscout: ', res.data.error)
            )
          )
          reportError(
            12,
            false,
            'Error fetching from Filscout: ',
            res.data.error
          )
        } else {
          setPage(page + 1)
          const formattedMessages = formatFilfoxMessages(res.data.messages)
          const messagesWithParams = await getMsgParams(formattedMessages)
          dispatch(
            fetchedConfirmedMessagesSuccess(
              messagesWithParams,
              Number(res.data.totalCount)
            )
          )
        }
      } catch (err) {
        if (err?.message?.includes('404')) {
          dispatch(fetchedConfirmedMessagesSuccess([], 0))
        } else {
          reportError(13, false, err.message, err.stack)
          dispatch(fetchedConfirmedMessagesFailure(new Error(err.message)))
        }
      }
    },
    [dispatch]
  )

  const showMore = () => {
    dispatch(fetchingNextPage())
    fetchData(address, page)
  }

  const refresh = () => {
    dispatch(fetchingConfirmedMessages())
    fetchData(address, 0, 30)
  }

  useEffect(() => {
    if (!loading && !loadedFailure && !loadedSuccess) {
      dispatch(fetchingConfirmedMessages())
      fetchData(address)
    }
  }, [
    address,
    total,
    confirmed.length,
    loading,
    loadedFailure,
    loadedSuccess,
    page,
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
    total,
    page
  }
}

export default useTransactionHistory
