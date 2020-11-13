import React from 'react'
import dayjs from 'dayjs'
import { FilecoinNumber } from '@glif/filecoin-number'
import { string, oneOf, oneOfType, number, object } from 'prop-types'
import { Menu, MenuItem } from '../../Menu'
import { Text, Label } from '../../Typography'
import { IconSend, IconPending } from '../../Icons'
import truncate from '../../../../utils/truncateAddress'
import makeFriendlyBalance from '../../../../utils/makeFriendlyBalance'

const methods = [
  'withdraw',
  '',
  '',
  '',
  '',
  'add signer',
  'remove signer',
  'owner swap'
]

const ProposalText = ({ params }) => {
  return (
    <>
      {methods[params.method] ? (
        <>
          <Label fontSize={1} color='core.darkgray' my={0}>
            {`Multisig ${methods[params.method]}`}
          </Label>
          <Text fontSize={3} color='core.nearblack' m={0}>
            {truncate(params.to)}
          </Text>
        </>
      ) : (
        <>
          <Label color='core.nearblack' my={0}>
            Unknown msig method
          </Label>
        </>
      )}
    </>
  )
}

ProposalText.propTypes = {
  params: object.isRequired
}

const ProposalValue = ({ params }) => {
  if (params.method === 0)
    return (
      <Text color='core.nearblack' m={0}>
        {makeFriendlyBalance(new FilecoinNumber(params.value, 'attofil'), 7)}
      </Text>
    )

  if (params.method === 5) {
    return (
      <Text fontSize={1} color='core.nearblack'>
        Add signer
      </Text>
    )
  }

  if (params.method === 6) {
    return (
      <Text fontSize={1} color='core.nearblack'>
        Remove signer
      </Text>
    )
  }

  if (params.method === 7)
    return (
      <>
        <Label fontSize={1} color='core.darkgray'>
          New Owner
        </Label>
        <Text color='core.nearblack' m={0}>
          {truncate(params.params.to)}
        </Text>
      </>
    )

  return (
    <Text color='core.nearblack' m={0}>
      Unknown multisig method
    </Text>
  )
}

ProposalValue.propTypes = {
  params: object.isRequired
}

const MsigProposeRow = ({ status, params, timestamp }) => {
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
          <Menu
            display='flex'
            flex-wrap='wrap'
            alignItems='center'
            ml={[2, 4, 5]}
          >
            <MenuItem overflow='hidden' width={9}>
              <ProposalText params={params} />
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
            <MenuItem display='flex' flexDirection='column'>
              <ProposalValue params={params} />
            </MenuItem>
          </Menu>
        </MenuItem>
        {params.method === 0 && (
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
        )}
      </Menu>
    </>
  )
}

MsigProposeRow.propTypes = {
  params: object.isRequired,
  status: oneOf(['confirmed', 'pending']).isRequired,
  timestamp: oneOfType([string, number]).isRequired
}

export default MsigProposeRow
