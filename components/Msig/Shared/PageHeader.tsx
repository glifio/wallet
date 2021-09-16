import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import {
  NavLink,
  Box,
  Title,
  Menu,
  MenuItem,
  IconGlif
} from '@glif/react-components'
import { Address } from '../Shared'
import { PAGE } from '../../../constants'
import { generateRouteWithRequiredUrlParams } from '../../../utils/urlParams'

const PageHeader = ({ msigAddress }) => {
  const router = useRouter()
  const getRoute = useCallback(generateRouteWithRequiredUrlParams, [
    router.query
  ])
  return (
    <>
      <Box display='flex' alignItems='center' position='absolute'>
        <IconGlif
          size={6}
          css={`
            transform: rotate(-90deg);
          `}
        />
        <Title ml={2}>Vault</Title>
      </Box>
      <Box
        display='flex'
        alignItems='center'
        flexDirection='row'
        justifyContent='space-between'
        mb={3}
      >
        <Box display='flex' alignItems='center' flexDirection='row' mx='auto'>
          <NavLink
            href={getRoute(
              router.query as Record<string, string>,
              PAGE.MSIG_HOME
            )}
            isActive={router.pathname === PAGE.MSIG_HOME}
            mr={3}
          >
            Assets
          </NavLink>
          <NavLink
            href={getRoute(
              router.query as Record<string, string>,
              PAGE.MSIG_HISTORY
            )}
            isActive={router.pathname === PAGE.MSIG_HISTORY}
            mr={3}
          >
            History
          </NavLink>
          <NavLink
            href={getRoute(
              router.query as Record<string, string>,
              PAGE.MSIG_OWNERS
            )}
            isActive={router.pathname === PAGE.MSIG_OWNERS}
            mr={3}
          >
            Owners
          </NavLink>
          <Address
            label='Multisig Address'
            address={msigAddress}
            glyphAcronym='Ms'
          />
        </Box>
      </Box>
    </>
  )
}

PageHeader.propTypes = {
  msigAddress: PropTypes.string.isRequired
}

export default PageHeader
