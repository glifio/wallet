import React from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { FilecoinNumber } from '@glif/filecoin-number'
import { bool, string, oneOf, oneOfType, number } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import { Menu, MenuItem } from '../../Menu'
import { Text, Label } from '../../Typography'
import { IconSend, IconReceive, IconPending } from '../../Icons'
import truncate from '../../../../utils/truncateAddress'
import makeFriendlyBalance from '../../../../utils/makeFriendlyBalance'
import { BaseButton, Box } from '../..'
import { speedUpTransaction } from '../../../../utils/modifyTransaction'

const AddressText = ({ sentMsg, to, from }) => {
  if (sentMsg) {
    return (
      <>
        <Label color='core.nearblack' my={0}>
          To
        </Label>
        <Text fontSize={3} color='core.nearblack' m={0}>
          {truncate(to)}
        </Text>
      </>
    )
  }

  return (
    <>
      <Label color='core.nearblack' my={0}>
        From
      </Label>
      <Text fontSize={3} color='core.nearblack' m={0}>
        {truncate(from)}
      </Text>
    </>
  )
}

AddressText.propTypes = {
  sentMsg: bool.isRequired,
  to: ADDRESS_PROPTYPE,
  from: ADDRESS_PROPTYPE
}

const SendRow = ({
  sentMsg,
  status,
  to,
  from,
  timestamp,
  value,
  transactionCid
}) => {
  const router = useRouter()

  return (
    <>
      <Menu>
        <MenuItem display='flex' flexDirection='row'>
          <Menu display='flex' flexDirection='column' justifyContent='center'>
            <MenuItem position='relative'>
              {sentMsg ? (
                <IconSend status={status} />
              ) : (
                <IconReceive status={status} />
              )}
              {status === 'pending' && (
                <IconPending position='absolute' top='6px' left={4} />
              )}
            </MenuItem>
          </Menu>
          <Menu display='flex' flex-wrap='wrap' ml={[2, 4, 5]}>
            <MenuItem overflow='hidden' width={9}>
              <AddressText sentMsg={sentMsg} to={to} from={from} m={0} />
            </MenuItem>
            <MenuItem
              display='flex'
              flexDirection='column'
              justifyContent='center'
              ml={4}
              width={9}
            >
              <Text color='core.darkgray' m={0}>
                {dayjs.unix(timestamp).format('HH:mm:ss')}
              </Text>
              <Text color='core.darkgray' m={0}>
                {dayjs.unix(timestamp).format('MMM DD, YYYY')}
              </Text>
            </MenuItem>
          </Menu>
          {status === 'pending' && (
            <Box textAlign='right'>
              <BaseButton
                onClick={e => {
                  e.stopPropagation()
                  speedUpTransaction(transactionCid, router)
                }}
              >
                Speed Up Transaction
              </BaseButton>
            </Box>
          )}
        </MenuItem>
      </Menu>
      <Menu
        display='flex'
        flexDirection='row'
        justifyContent='flex-end'
        flexGrow='999'
      >
        <MenuItem>
          <Menu
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            flex-wrap='wrap'
            ml={3}
          >
            <MenuItem display='flex'>
              <Text color='core.nearblack' m={0}>
                {makeFriendlyBalance(new FilecoinNumber(value, 'attofil'), 7)}
              </Text>
            </MenuItem>
          </Menu>
        </MenuItem>
        <MenuItem>
          <Menu
            display='flex'
            flexDirection='column'
            alignItems='flex-start'
            flex-wrap='wrap'
            ml={3}
          >
            <MenuItem>
              <Text color='core.nearblack' m={0}>
                FIL
              </Text>
            </MenuItem>
          </Menu>
        </MenuItem>
      </Menu>
    </>
  )
}

SendRow.propTypes = {
  to: ADDRESS_PROPTYPE,
  from: ADDRESS_PROPTYPE,
  value: string.isRequired,
  status: oneOf(['confirmed', 'pending']).isRequired,
  timestamp: oneOfType([string, number]).isRequired,
  sentMsg: bool.isRequired,
  transactionCid: string.isRequired
}

export default SendRow
