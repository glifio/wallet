import React from 'react'
import PropTypes from 'prop-types'

import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { Box } from '../../Shared'
import converAddrToFPrefix from '../../../utils/convertAddrToFPrefix'
import Address from './Address'
import { gotoRouteWithKeyUrlParams } from '../../../utils/urlParams'
import { useRouter } from 'next/router'

import {
  PAGE_MSIG_REMOVE_SIGNER
} from '../../../constants'

const Signers = ({ signers, walletAddress }) => {
  const router = useRouter()

  return (
    <Box display='flex' flexWrap='wrap'>
      {signers
        .filter(
          signer =>
            converAddrToFPrefix(signer.account) !==
            converAddrToFPrefix(walletAddress)
        )
        .map((signer, i) => {
          return (
            <Address
              key={signer.account}
              label='Additional Signer'
              address={signer.account}
              glyphAcronym={(i + 2).toString()}
              widthOverride='100%'
              onClose={ () => {gotoRouteWithKeyUrlParams(router, `${PAGE_MSIG_REMOVE_SIGNER}/${signer.account}`)} }
            />
          )
        })}
    </Box>
  )
}

Signers.propTypes = {
  signers: PropTypes.arrayOf(
    PropTypes.shape({
      account: ADDRESS_PROPTYPE,
      id: ADDRESS_PROPTYPE
    })
  ).isRequired,
  walletAddress: ADDRESS_PROPTYPE
}

export default Signers
