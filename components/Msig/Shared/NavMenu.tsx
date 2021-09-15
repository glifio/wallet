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
import { PAGE, RESPONSIVE_BREAKPOINT } from '../../../constants'
import { generateRouteWithRequiredUrlParams } from '../../../utils/urlParams'

const responsiveMenuBuffer = RESPONSIVE_BREAKPOINT + 300

const NavMenu = ({ msigAddress }) => {
  const router = useRouter()
  const getRoute = useCallback(generateRouteWithRequiredUrlParams, [router])
  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        position='absolute'
        my={5}
        css={`
          /* todo #responsiveDesign: decide how to do responsive design */
          @media only screen and (max-width: ${responsiveMenuBuffer}px) {
            display: none;
          }
        `}
      >
        <IconGlif
          size={6}
          css={`
            transform: rotate(-90deg);
          `}
        />
        <Title ml={2}>Vault</Title>
      </Box>
      <Menu
        display='flex'
        flexWrap='wrap'
        width='100%'
        maxWidth={18}
        margin='0 auto'
        justifyContent='flex-start'
        alignItems='center'
        my={5}
      >
        <MenuItem
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          pr={3}
          css={`
            /* todo: decide how to do responsive design */
            @media only screen and (min-width: ${responsiveMenuBuffer + 1}px) {
              display: none;
            }
          `}
        >
          <IconGlif
            size={6}
            css={`
              transform: rotate(-90deg);
            `}
          />
          <Title ml={2}>Vault</Title>
        </MenuItem>
        <MenuItem display='flex' justifyContent='space-between'>
          <NavLink
            href={getRoute(router, PAGE.MSIG_HOME)}
            isActive={router.pathname === PAGE.MSIG_HOME}
            mr={3}
          >
            Assets
          </NavLink>
          <NavLink
            href={getRoute(router, PAGE.MSIG_HISTORY)}
            isActive={router.pathname === PAGE.MSIG_HISTORY}
            mr={3}
          >
            History
          </NavLink>
          <NavLink
            href={getRoute(router, PAGE.MSIG_OWNERS)}
            isActive={router.pathname === PAGE.MSIG_OWNERS}
            mr={3}
          >
            Owners
          </NavLink>
        </MenuItem>
        <MenuItem ml='auto'>
          <Box>
            <Address
              label='Multisig Address'
              address={msigAddress}
              glyphAcronym='Ms'
            />
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}

NavMenu.propTypes = {
  msigAddress: PropTypes.string.isRequired
}

export default NavMenu
