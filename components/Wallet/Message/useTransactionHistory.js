import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import {
  fetchedConfirmedMessagesSuccess,
  fetchedConfirmedMessagesFailure,
  fetchingConfirmedMessages
} from '../../../store/actions'
import { FILSCAN } from '../../../constants'
import formatFilscanMessages from './formatFilscanMessages'

const PAGINATION_COUNT = 10

export default (address, page = 0) => {
  const dispatch = useDispatch()
  const {
    loading,
    loadedSuccess,
    loadedFailure,
    pending,
    confirmed,
    paginating
  } = useSelector(state => state.messages)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post(
          `${FILSCAN}/messages/MessageByAddress`,
          {
            method: '',
            begindex: '0',
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
        } else {
          const formattedMessages = formatFilscanMessages(data.data.data)
          dispatch(fetchedConfirmedMessagesSuccess(formattedMessages))
        }
      } catch (err) {
        dispatch(fetchedConfirmedMessagesFailure(new Error(err.message)))
      }
    }

    const shouldFetchMore =
      !loading && !paginating && page * PAGINATION_COUNT >= confirmed.length

    if (shouldFetchMore) {
      dispatch(fetchingConfirmedMessages())
      fetchData()
    }
  }, [loading, paginating, page, address, confirmed.length, dispatch])

  return {
    loading,
    loadedSuccess,
    loadedFailure,
    pending,
    confirmed,
    paginating
  }
}
