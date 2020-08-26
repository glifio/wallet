import { Component } from 'react'
import { connect } from 'react-redux'
import { string, node, oneOf } from 'prop-types'
import Router from 'next/router'
import { MAINNET, TESTNET } from '../constants'

// This component makes sure the right investor information is in redux before allowing the user to move forward
export class RequireInvestor extends Component {
  componentDidMount() {
    if (!this.props.investor) {
      const route = Router.query.network
        ? `/?network=${Router.query.network}`
        : `/?network=${this.props.network}`
      Router.replace(route)
    }
  }

  componentDidUpdate() {
    if (!this.props.investor) {
      const route = Router.query.network
        ? `/?network=${Router.query.network}`
        : `/?network=${this.props.network}`
      Router.replace(route)
    }
  }

  render() {
    return <>{this.props.investor && this.props.children}</>
  }
}

RequireInvestor.propTypes = {
  investor: string.isRequired,
  network: oneOf([MAINNET, TESTNET]).isRequired,
  children: node.isRequired
}

const mapStateToProps = state => {
  return {
    investor: state.investor,
    network: state.network
  }
}

export default connect(mapStateToProps)(RequireInvestor)
