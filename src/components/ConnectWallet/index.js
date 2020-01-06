import React, { useState } from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'
import { useDispatch } from 'react-redux'

import { error } from '../../store/actions'
import { useProgress } from '../../hooks'
import { JustifyContentCenter, OnboardingContainer } from '../StyledComponents'

const Button = styled.button`
  cursor: pointer;
  background: #61d6d9;
  color: white;
  border: 0;
  border-radius: 4px;
`

const ConnectWalletContainer = styled(JustifyContentCenter)`
  flex-direction: column;
  align-items: center;
`

export default () => {
  const dispatch = useDispatch()
  const { setProgress } = useProgress()
  const [ledgerConnected, setLedgerConnected] = useState(false)
  const [filecoinLedgerAppOpen, setFilecoinLedgerAppOpen] = useState(false)
  const [accounts, setAccounts] = useState({
    list: [],
    startIdx: 0,
    endIdx: 5
  })
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0)
  const onRadioSelect = accountIndex =>
    setSelectedAccountIdx(Number(accountIndex))

  return (
    <ConnectWalletContainer>
      <p>
        {ledgerConnected
          ? filecoinLedgerAppOpen
            ? `Selected account: ${
                accounts.list[selectedAccountIdx]
              } with the HD path: 44/461/5/0/${accounts.startIdx +
                selectedAccountIdx}`
            : 'Make sure the Filecoin application is open on your Ledger device'
          : 'Make sure your ledger is plugged in'}
      </p>

      <OnboardingContainer>
        <form>
          <ol>
            {accounts.list.map((account, i) => {
              return (
                <li
                  css={{
                    margin: '4px'
                  }}
                  key={account}
                >
                  <input
                    onChange={() => onRadioSelect(Number(i))}
                    type='radio'
                    name='account'
                    value={account}
                    id={account}
                    checked={Number(selectedAccountIdx) === Number(i)}
                  />
                  <label htmlFor={account}>{account}</label>
                  <br />
                </li>
              )
            })}
          </ol>
        </form>
        <Button
          onClick={async () => {
            try {
              const transport = await TransportWebHID.create()
              setLedgerConnected(true)
              const provider = new Filecoin(new LedgerProvider(transport), {
                token: process.env.REACT_APP_LOTUS_JWT_TOKEN
              })

              // we call getVersion here to make sure the Filecoin Ledger app is open on the user's device
              await provider.wallet.getVersion()
              setFilecoinLedgerAppOpen(true)

              const accountList = await provider.wallet.getAccounts(
                accounts.startIdx,
                accounts.endIdx
              )
              setAccounts({
                ...accounts,
                list: accountList
              })
            } catch (err) {
              dispatch(error(err))
            }
          }}
        >
          {ledgerConnected ? 'Select account' : 'Unlock ledger'}
        </Button>
      </OnboardingContainer>
    </ConnectWalletContainer>
  )
}
