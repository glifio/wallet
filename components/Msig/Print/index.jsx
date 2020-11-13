import React, { useState } from 'react'
import axios from 'axios'
import { jsPDF as PDF } from 'jspdf'
import { validateAddressString } from '@glif/filecoin-address'
import { Box, Button, Input, OnboardCard, Text, Title } from '../../Shared'
import { FILFOX } from '../../../constants'
import { useWasm } from '../../../lib/WasmLoader'
import { formatFilfoxMessages } from '../../../lib/useTransactionHistory/formatMessages'
import getMsgParams from '../../../lib/useTransactionHistory/getMsgParams'

const PAGE_SIZE = 20

const Print = () => {
  const { deserializeParams } = useWasm()
  const [address, setAddress] = useState('')
  const [err, setErr] = useState('')

  const onSubmit = async e => {
    e.preventDefault()
    const trimmedAddr = address.trim()
    if (!validateAddressString(trimmedAddr)) return setErr('Invalid address.')
    if (Number(trimmedAddr[1]) !== 0 && Number(trimmedAddr[1]) !== 2)
      return setErr('Invalid Actor Address. Second character must be 0 or 2.')

    const res = await axios.get(
      `${FILFOX}/v1/address/${address}/messages?pageSize=${PAGE_SIZE}&page=0&detailed`
    )

    if (res.status !== 200) {
      setErr(res.data.error)
      return
    }
    const total = Number(res.data.totalCount)

    let { messages } = res.data
    if (total > PAGE_SIZE) {
      const lastPage = Math.ceil(PAGE_SIZE / total)
      const res = await axios.get(
        `${FILFOX}/v1/address/${address}/messages?pageSize=${PAGE_SIZE}&page=${lastPage}&detailed`
      )

      if (res.status !== 200) {
        setErr(res.data.error)
        return
      }
      messages = res.data.messages
    }

    const messagesWithParams = await getMsgParams(
      formatFilfoxMessages(messages),
      deserializeParams
    )
    console.log(messagesWithParams)

    const doc = new PDF()
    doc.text('Hihihihi', 1, 1)
    doc.save()
  }
  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      justifyContent='center'
      alignItems='center'
      padding={[2, 3, 5]}
    >
      <OnboardCard
        width='100%'
        maxWidth={13}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
      >
        <Box>
          <Title mt={3}>Multisig address</Title>
          <Text>
            Please input a multisig address below to print its details as a PDF.
          </Text>
        </Box>
        <form
          onSubmit={onSubmit}
          css={`
            display: flex;
            flex-direction: row;
          `}
        >
          <Input.Text
            value={address}
            onChange={e => setAddress(e.target.value)}
            label='Msig address'
            placeholder='f02'
            error={err}
            onFocus={() => setErr('')}
          />
          <Button title='Print' variant='primary' ml={2} type='submit' />
        </form>
      </OnboardCard>
    </Box>
  )
}

export default Print
