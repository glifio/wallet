import { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import {
  fetchedConfirmedMessagesSuccess,
  fetchedConfirmedMessagesFailure,
  fetchingConfirmedMessages,
  fetchingNextPage
} from '../../../store/actions'
import { FILSCOUT } from '../../../constants'
import { formatFilscoutMessages } from './formatMessages'
import useWallet from '../../../WalletProvider/useWallet'
import reportError from '../../../utils/reportError'

export default () => {
  const { address } = useWallet()
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
    async (address, page = 1, pageSize = 15) => {
      try {
        const { data } = await axios.get(
          `${FILSCOUT}/message/list?address=${address}&page=${page}&page_size=${pageSize}`
        )

        if (data.code !== 200) {
          dispatch(
            fetchedConfirmedMessagesFailure(
              new Error('Error fetching from Filscout: ', data.error)
            )
          )
          reportError(12, false, 'Error fetching from Filscout: ', data.error)
        } else {
          setPage(Number(data.data.pagination.page) + 1)
          const formattedMessages = formatFilscoutMessages(data.data.data)
          dispatch(
            fetchedConfirmedMessagesSuccess(
              formattedMessages,
              Number(data.data.pagination.total)
            )
          )
        }
      } catch (err) {
        reportError(13, false, err.message, err.stack)
        dispatch(fetchedConfirmedMessagesFailure(new Error(err.message)))
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
    fetchData(address, 1, 30)
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
