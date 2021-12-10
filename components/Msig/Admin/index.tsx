import React, { useState, useCallback } from 'react'
import {
  Box,
  Glyph,
  Text,
  Title,
  Button,
  IconLedger,
  Tooltip,
  BaseButton
} from '@glif/react-components'
import {
  useWalletProvider,
  useWallet,
  reportLedgerConfigError
} from '@glif/wallet-provider-react'
import { useRouter } from 'next/router'

import { PAGE } from '../../../constants'
import { Address, Signers, MsigPageWrapper } from '../Shared'
import { navigate } from '../../../utils/urlParams'
import { useMsig } from '../../../MsigProvider'

export default function Owners() {
  const router = useRouter()
  const { NumApprovalsThreshold, Signers: signers } = useMsig()
  const wallet = useWallet()
  const { ledger, connectLedger } = useWalletProvider()
  const [ledgerBusy, setLedgerBusy] = useState(false)
  const onShowOnLedger = useCallback(async () => {
    setLedgerBusy(true)
    const provider = await connectLedger()
    if (provider) await provider.wallet.showAddressAndPubKey(wallet.path)
    setLedgerBusy(false)
  }, [setLedgerBusy, connectLedger, wallet.path])

  const ledgerErr = reportLedgerConfigError({
    ...ledger
  })

  return (
    <MsigPageWrapper>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='center'
        width='100%'
        maxWidth={18}
        margin='0 auto'
      >
        <Box width='100%'>
          <Box display='flex' flexWrap='wrap' my={6}>
            <Title display='inline-flex'>
              <Glyph
                acronym={NumApprovalsThreshold.toString()}
                size={5}
                justifyContent='start'
                border={0}
              />
              Required Approvals
            </Title>
            <Tooltip content='The number of approvals required for a transaction' />
          </Box>
          <Box position='relative' display='flex' flexWrap='wrap'>
            <Title>Signers</Title>
            <Tooltip content='These are the Filecoin addresses that can approve and reject proposals from your Multisig wallet.' />
          </Box>
          <Box position='relative' display='flex' flexWrap='wrap' my={3}>
            <Address
              address={wallet.address}
              glyphAcronym='1'
              label='Signer 1 - Your Ledger'
            />

            <BaseButton
              display='flex'
              alignItems='center'
              maxWidth={10}
              onClick={onShowOnLedger}
              disabled={ledgerBusy}
              color='core.nearblack'
              border={1}
              bg='transparent'
              my={1}
              ml={3}
              height={6}
              borderRadius={6}
            >
              <IconLedger size={4} mr={2} />
              {!ledgerErr && ledgerBusy ? (
                <Text>Check Ledger Device</Text>
              ) : (
                <Text>View on Device</Text>
              )}
              {ledgerErr && <Text>Ledger Device Error</Text>}
            </BaseButton>
            <Tooltip content='Displays your address on your Ledger device' />
          </Box>
          <Signers signers={signers} walletAddress={wallet.address} />
          <Box display='flex' alignItems='center' mt={1}>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                navigate(router, { pageUrl: PAGE.MSIG_ADD_SIGNER })
              }}
              title='Add Signer'
              minWidth={8}
              height='40px'
              borderRadius={6}
              m={1}
            />
          </Box>
        </Box>
      </Box>
    </MsigPageWrapper>
  )
}
