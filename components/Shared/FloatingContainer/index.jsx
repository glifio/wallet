import React from 'react'
import styled from 'styled-components'
import Button from './Button'
import Text from './Typography'
import Box from './Box'

const FloatingContainer = styled(Box)`
  position: fixed;
  display: flex;
  bottom: ${props => props.theme.sizes[3]}px;
  flex-direction: row;
  justify-content: space-between;
  width: calc(58% - 1rem);
  max-width: 580px;
  box-shadow: ${props => props.theme.shadows[2]};
  background-color: ${props => props.theme.colors.core.white};
  border: ${props => props.theme.borders[1]};
  border-color: ${props => props.theme.colors.core.silver};
  border-radius: ${props => props.theme.radii[2]};
`

const FloatingContainer = forwardRef(({ ...props }, ref) => (
  <FloatingContainerWrapper {...props} ref={ref}>
    {step === 2 && wallet.type === LEDGER ? (
      <Text>Confirm or reject the transaction on your Ledger Device.</Text>
    ) : (
      <>
        <Button
          type='button'
          title='Cancel'
          variant='secondary'
          onClick={() => {
            setAttemptingTx(false)
            setUncaughtError('')
            resetLedgerState()
            setSending(false)
          }}
        />
        <Button
          disabled={
            !!(
              hasError() ||
              !isValidForm(
                toAddress,
                value.fil,
                wallet.balance,
                toAddressError,
                valueError
              )
            )
          }
          type='submit'
          title='Next'
          variant='primary'
          onClick={() => {}}
        />
      </>
    )}
  </FloatingContainerWrapper>
))

export default FloatingContainer
