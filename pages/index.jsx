import React from 'react'
import { connect } from 'react-redux'
import { AccountCard } from '@openworklabs/filecoin-wallet-styleguide'
import styled from 'styled-components'
import { startClock, serverRenderClock } from '../store'
import Examples from '../components/examples'

const StyledDiv = styled.div`
  background-color: blue;
`

class Index extends React.Component {
  static getInitialProps({ reduxStore, req }) {
    const isServer = !!req
    reduxStore.dispatch(serverRenderClock(isServer))

    return {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    this.timer = startClock(dispatch)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return <StyledDiv>yo</StyledDiv>
  }
}

export default connect()(Index)
