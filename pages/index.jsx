import React from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { space, layout, typography, border, color } from 'styled-system'
import {
  Box,
  Menu,
  MenuItem,
  Title,
  Text,
  IconGlif,
  BaseButton
} from '../components/Shared'

const Spacer = styled(Box)`
  margin: ;
`

const TitleCopy = styled(Title)`
  /* Used this: https://stackoverflow.com/questions/14431411/pure-css-to-make-font-size-responsive-based-on-dynamic-amount-of-characters */
  font-size: calc(48px + (64 - 40) * (100vw - 360px) / (1440 - 360));
  /* word-break: break-all; */
`

const Image = styled.img`
  z-index: -999;
`

const ButtonSignUp = styled.button`
  outline: none;
  border: 0;
  cursor: pointer;
  background: transparent;

  &:hover {
    box-shadow: 0px 0px 8px #999;
  }
  ${space}
  ${layout}
  ${typography}
  ${border}
  ${color}
`

export default class Home extends React.Component {
  componentDidMount() {
    // Router.push(`/onboard?network=t`)
  }

  render() {
    return (
      <Box
        display='block'
        margin='0 auto'
        py={[2, 4]}
        pl={[3, 4, 6, 7]}
        pr={[3, 4, 6]}
        maxWidth='1680px'
        width='100%'
        minHeight='100vh'
        // bg='core.white'
      >
        <Menu
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexWrap='wrap'
        >
          <MenuItem>
            <Box
              display='inline-block'
              py={4}
              mr={[4, 6, 7, 8]}
              px={2}
              borderRadius={4}
              css={`
                background: linear-gradient(180deg, #ff8d3b 0%, #ffeb80 100%);
                border-radius: 16px;
              `}
            >
              <IconGlif size={[6, 7, 8]} />
            </Box>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>is</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>an</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>interoperable</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>set</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>of</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>tools</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <Image width='200px' alt='' src='/static/imgtools.png' />
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>that</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>function</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>on</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>the</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>Filecoin</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>network.</TitleCopy>
          </MenuItem>
          <MenuItem
            display='flex'
            flexWrap='wrap'
            alignItems='center'
            justifyContent='space-between'
            width='100%'
            color='core.darkgray'
            my={[2, 3]}
          >
            <Text fontSize={[4, 5, 6]} my={2}>
              Be the first to learn when we launch
            </Text>
            <ButtonSignUp
              background='transparent'
              color='core.nearblack'
              fontSize={[4, 5, 6]}
              border={1}
              px={6}
              py={2}
              height='max-content'
              borderRadius={6}
            >
              Sign Up
            </ButtonSignUp>
          </MenuItem>
        </Menu>
        <Menu
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexWrap='wrap'
          my={8}
        >
          <MenuItem display='flex' alignItems='center' width='100%' mb={5}>
            <Box
              display='inline-block'
              py={2}
              mr={[4, 6, 7, 8]}
              px={4}
              borderRadius={4}
              css={`
                background: linear-gradient(
                  180deg,
                  #1a1a1a 2.72%,
                  rgba(128, 128, 128, 0.6) 100%
                );
                border-radius: 16px;
              `}
            >
              <IconGlif
                fill='#fff'
                size={[6, 7, 8]}
                css={`
                  transform: rotate(-90deg);
                `}
              />
            </Box>
            <TitleCopy>Wallet</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>is</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>a</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>lightweight</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]} height='120px'>
            <Image width='300px' alt='' src='/static/imgwallet.png' />
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>interface</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>for</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>sending</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>and</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>receiving</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>Filecoin</TitleCopy>
          </MenuItem>
        </Menu>
        <Menu
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexWrap='wrap'
          my={8}
        >
          <MenuItem display='flex' alignItems='center' width='100%' mb={5}>
            <Box
              display='inline-block'
              py={2}
              mr={[4, 6, 7, 8]}
              px={4}
              borderRadius={4}
              css={`
                background: linear-gradient(
                  180deg,
                  #1a1a1a 2.72%,
                  rgba(128, 128, 128, 0.6) 100%
                );
                border-radius: 16px;
              `}
            >
              <IconGlif
                fill='#fff'
                size={[6, 7, 8]}
                css={`
                  transform: rotate(-90deg);
                `}
              />
            </Box>
            <TitleCopy>Node</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>a</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>fully</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>managed</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>Filecoin</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>node</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>you</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]} height='120px'>
            <Image width='200px' alt='' src='/static/imgnode.png' />
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>can</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>deploy</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>from</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>the</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]}>
            <TitleCopy>command-line</TitleCopy>
          </MenuItem>
        </Menu>
      </Box>
    )
  }
}
