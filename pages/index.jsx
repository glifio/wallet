import React, { useState } from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { space, layout, typography, border, color } from 'styled-system'
import {
  Box,
  Menu,
  MenuItem,
  Title,
  Text,
  IconGlif
} from '../components/Shared'

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
  transition: 0.18s ease-in;

  &:hover {
    transform:scale(1.05);
  }
  ${space}
  ${layout}
  ${typography}
  ${border} 
  ${color}
`

const InputEmail = styled.input`
outline: 0;
border: 0;
${space}
  ${layout}
  ${typography}
  ${border}

  ${color}
`

const ShowSignUp = () => {
  return (
    <>
      <InputEmail
        fontSize={[4, 5, 6]}
        color='core.white'
        bg='core.nearblack'
        px={3}
        py={2}
        borderRadius={6}
        textAlign='center'
        placeholder='Your email, please'
      />
      <ButtonSignUp
        color='core.white'
        bg='core.nearblack'
        fontSize={[4, 5, 6]}
        border={1}
        px={6}
        py={2}
        height='max-content'
        borderRadius={6}
      >
        Submit
      </ButtonSignUp>
    </>
  )
}

export default () => {
  const [clicked, setClicked] = useState(false)

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
            py={3}
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

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>is</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>an</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>interoperable</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>set</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>of</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>tools</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <Image width='200px' alt='' src='/static/imgtools.png' />
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>for</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>the</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>Filecoin</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
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
            onClick={() => setClicked(true)}
          >
            Sign Up
          </ButtonSignUp>
          {clicked && <ShowSignUp />}
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
            mr={4}
            px={3}
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

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>A</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>lightweight</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3]} height='120px'>
          <Image width='300px' alt='' src='/static/imgwallet.png' />
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>interface</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>for</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>sending</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>and</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>receiving</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
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
            mr={4}
            px={3}
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

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>A</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>fully</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>managed</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>Filecoin</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>node</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>you</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3]} height='120px'>
          <Image width='200px' alt='' src='/static/imgnode.png' />
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>can</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>deploy</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>from</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>the</TitleCopy>
        </MenuItem>

        <MenuItem mr='8%' my={[2, 3, 5]}>
          <TitleCopy>command-line</TitleCopy>
        </MenuItem>
      </Menu>
    </Box>
  )
}
