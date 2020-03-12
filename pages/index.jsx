import React from 'react'
import Router from 'next/router'

export default class Home extends React.Component {
  componentDidMount() {
    Router.push(`/onboard?network=t`)
  }

  render() {
    return <></>
  }
}
