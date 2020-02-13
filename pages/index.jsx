import React from 'react'
import { Container } from '@openworklabs/filecoin-wallet-styleguide'
import { useProgress } from '../hooks'

export default () => {
  const { progress, setProgress } = useProgress()
  console.log(progress)
  return <Container>YOOOOOOO</Container>
}
