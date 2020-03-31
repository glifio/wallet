import React from 'react'
import Router from 'next/router'
import styled from 'styled-components'
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
  font-size: calc(48px + (64 - 40) * (100vw - 360px) / (1440 - 360));
  /* word-break: break-all; */
`

const Image = styled.img`
  z-index: -999;
`

const ButtonSignUp = styled.button``

export default class Home extends React.Component {
  componentDidMount() {
    // Router.push(`/onboard?network=t`)
  }

  render() {
    return (
      <Box
        py={[2, 6]}
        px={[3, 4, 6, 8]}
        width='100%'
        minHeight='100vh'
        bg='core.white'
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
              <IconGlif size={8} />
            </Box>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>is</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>an</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>interoperable</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>set</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>of</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>tools</TitleCopy>
          </MenuItem>

          <MenuItem
            position={['absolute', 'relative']}
            mr={[4, 6, 7, 8]}
            my={[2, 3]}
          >
            <Image width='200px' alt='' src='/static/imgtools.png' />
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>that</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>function</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>on</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>the</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>Filecoin</TitleCopy>
          </MenuItem>

          <MenuItem mr={[4, 6, 7, 8]} my={[2, 3]}>
            <TitleCopy>network.</TitleCopy>
          </MenuItem>
          <MenuItem display='flex' my={[2, 3]}>
            <Text fontSize={[4, 6]}>Be the first to learn when we launch</Text>
            <ButtonSignUp
              background='transparent'
              border='core.nearblack'
              fontSize={[4, 6]}
              px={4}
            >
              Sign Up
            </ButtonSignUp>
          </MenuItem>
        </Menu>
      </Box>
    )
  }
}
