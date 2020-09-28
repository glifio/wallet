import React from 'react'
import dayjs from 'dayjs'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { string, oneOf, oneOfType, number } from 'prop-types'
import { Menu, MenuItem } from '../../Menu'
import { Text, Label } from '../../Typography'
import { IconSend, IconPending } from '../../Icons'
import makeFriendlyBalance from '../../../../utils/makeFriendlyBalance'

const ExecRow = ({ status, value, timestamp }) => {
  return (
    <>
      <Menu>
        <MenuItem display='flex' flexDirection='row'>
          <Menu display='flex' flexDirection='column' justifyContent='center'>
            <MenuItem position='relative'>
              <IconSend status={status} />
              {status === 'pending' && (
                <IconPending position='absolute' top='6px' left={4} />
              )}
            </MenuItem>
          </Menu>
          <Menu display='flex' flex-wrap='wrap' ml={[2, 4, 5]}>
            <MenuItem
              overflow='hidden'
              width={9}
              display='flex'
              flexDirection='column'
              justifyContent='center'
            >
              <Label color='core.nearblack' my={0}>
                Created new actor
              </Label>
              {/* should figure out way to get actor address here */}
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

ExecRow.propTypes = {
  status: oneOf(['confirmed', 'pending']).isRequired,
  timestamp: oneOfType([string, number]).isRequired,
  value: string.isRequired
}

export default ExecRow
