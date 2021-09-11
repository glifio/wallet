import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import {
  NavLink,
  Box,
  Title,
  Menu,
  MenuItem,
  IconGlif
} from '@glif/react-components'
import Address from './Address'
import {
  PAGE_MSIG_HOME,
  PAGE_MSIG_HISTORY,
  PAGE_MSIG_OWNERS
} from '../../../constants'
import { gotoRouteWithKeyUrlParams } from '../../../utils/urlParams'

// todo: decide how to do responsive design
// add enough room for vault icon
const responsiveMenuBuffer = 1024 + 300

const StyledNavLink = styled(NavLink).attrs(props => ({
  mr: 3
}))``

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
          <StyledNavLink
            href={PAGE_MSIG_HOME}
            onClick={repairLink}
            isActive={pageId === PAGE_MSIG_HOME}
          >
            Assets
          </StyledNavLink>
          <StyledNavLink
            href={PAGE_MSIG_HISTORY}
            onClick={repairLink}
            isActive={pageId === PAGE_MSIG_HISTORY}
          >
            History
          </StyledNavLink>
          <StyledNavLink
            href={PAGE_MSIG_OWNERS}
            onClick={repairLink}
            isActive={pageId === PAGE_MSIG_OWNERS}
          >
            Owners
          </StyledNavLink>
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
