import PropTypes from 'prop-types'
import { NavLink } from '@glif/react-components'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Address from './Address'
import {
  PAGE_MSIG_HOME,
  PAGE_MSIG_HISTORY,
  PAGE_MSIG_OWNERS
} from '../../../constants'
import { Box, Title, Menu, MenuItem, IconGlif } from '../../Shared'
import { gotoRouteWithKeyUrlParams } from '../../../utils/urlParams'

// todo: decide how to do responsive design
// add enough room for vault icon
const responsiveMenuBuffer = 1024 + 300

const MyNavLink = styled(NavLink).attrs(props => ({
  mr: 3,
  ...props
}))`
`

const NavMenu = ({ pageId, msigAddress }) => {
  const router = useRouter()

  const repairLink = e => {
    e.preventDefault()

    gotoRouteWithKeyUrlParams(router, e.currentTarget.pathname)
  }

  return (
  <>
    <Box
      display='flex'
      alignItems='center'
      position='absolute'
      my={5}
      css={`
        /* todo: decide how to do responsive design */
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
        <MyNavLink
          href={PAGE_MSIG_HOME}
          onClick={repairLink}
          isActive={pageId === PAGE_MSIG_HOME}
        >
          Assets
        </MyNavLink>
        <MyNavLink
          href={PAGE_MSIG_HISTORY}
          onClick={repairLink}
          isActive={pageId === PAGE_MSIG_HISTORY}
        >
          History
        </MyNavLink>
        <MyNavLink
          href={PAGE_MSIG_OWNERS}
          onClick={repairLink}
          isActive={pageId === PAGE_MSIG_OWNERS}
        >
          Owners
        </MyNavLink>
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
  pageId: PropTypes.string
}

export default NavMenu
