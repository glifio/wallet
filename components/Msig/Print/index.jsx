import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import dayjs from 'dayjs'
import { jsPDF as PDF } from 'jspdf'
import LotusRPCClient from '@glif/filecoin-rpc-client'
import { validateAddressString } from '@glif/filecoin-address'
import { Box, Button, Input, OnboardCard, Text, Title } from '../../Shared'
import { FILFOX, PL_SIGNERS } from '../../../constants'
import { useWasm } from '../../../lib/WasmLoader'
import { formatFilfoxMessages } from '../../../lib/useTransactionHistory/formatMessages'
import getMsgParams from '../../../lib/useTransactionHistory/getMsgParams'
import getAddrFromReceipt from '../../../utils/getAddrFromReceipt'
import getMsgsUntilCustodyTaken from './getMsgsUntilCustodyTaken'

const PAGE_SIZE = 20

const Print = () => {
  const router = useRouter()
  const { deserializeParams } = useWasm()
  const [address, setAddress] = useState(router.query.address)
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

    const messagesWithParams = (
      await getMsgParams(formatFilfoxMessages(messages), deserializeParams)
    ).sort((a, b) => Number(a.timestamp) - Number(b.timestamp))

    const doc = new PDF()
    const EXEC = messagesWithParams[0]
    const actorID = getAddrFromReceipt(EXEC.receipt.return)
    const lCli = new LotusRPCClient({
      apiAddress: process.env.LOTUS_NODE_JSONRPC
    })

    const { Balance, State } = await lCli.request(
      'StateReadState',
      actorID,
      null
    )

    doc.setFontSize(12)
    doc.text(`Multisig: ${actorID}`, 20, 20)
    doc.text(
      `Creation date: ${dayjs
        .unix(EXEC.timestamp)
        .format('YYYY-MM-DD HH:mm:ss')}`,
      20,
      32
    )
    doc.text(`Creation block height: ${EXEC.height}`, 20, 44)
    doc.text(
      `Initial vesting multisig actor balance: ${State.InitialBalance}`,
      20,
      56
    )
    doc.text(`CURRENT multisig actor balance: ${Balance}`, 20, 68)
    doc.text(`CURRENT multisig signers: ${State.Signers.join(',')}`, 20, 80)
    doc.text(`Unlock duration: ${State.UnlockDuration}`, 20, 92)
    doc.text(`Start epoch of vesting: ${State.StartEpoch}`, 20, 104)
    doc.text(
      '---------------------- Transaction highlights ----------------------------',
      50,
      116
    )
    const relevantMessages = await getMsgsUntilCustodyTaken(messagesWithParams)
    relevantMessages.forEach((msg, i) => {
      // skip EXEC, which is the first (0th) message
      if (i > 0) {
        let text = ''
        switch (msg.params?.method) {
          case 0: {
            text = `Withdrew funds to: ${msg.params.to}`
            break
          }
          case 5: {
            text = `Added signer: ${msg.params.params.signer} on ${dayjs
              .unix(msg.timestamp)
              .format('YYYY-MM-DD HH:mm:ss')} at block height: ${msg.height}`
            break
          }
          case 6: {
            text = `Removed signer: ${msg.params.params.signer} ${
              PL_SIGNERS.has(msg.params.params.signer) ? '(Protocol Labs)' : ''
            } on ${dayjs
              .unix(msg.timestamp)
              .format('YYYY-MM-DD HH:mm:ss')} at block height: ${msg.height}`
            break
          }
          case 7: {
            text = 'Change owner'
            break
          }
          default: {
            if (msg.method === 1) {
              text = ''
            } else {
              text = `Unrecognized transaction number: ${msg.params.method}`
            }
          }
        }

        doc.text(text, 20, 128 + i * 12)
      }
    })
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
