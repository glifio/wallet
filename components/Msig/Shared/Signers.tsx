import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Box } from '@glif/react-components'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import converAddrToFPrefix from '../../../utils/convertAddrToFPrefix'
import Address from './Address'
import { navigate } from '../../../utils/urlParams'
import { PAGE } from '../../../constants'
import { Signer } from '../../../MsigProvider/types'

const Signers = ({
  signers,
  walletAddress
}: {
  signers: Signer[]
  walletAddress: string
}) => {
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
              onRemoveSigner={() => {
                navigate(router, {
                  pageUrl: PAGE.MSIG_REMOVE_SIGNER,
                  urlPathExtension: [signer.account]
                })
              }}
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
