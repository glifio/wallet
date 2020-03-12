import React from 'react'
import { ErrorView } from '../../components/Shared'

export default () => {
  return (
    <ErrorView
      title='Glif is currently down'
      description="We're aware of the outage and will be back up shortly."
      linkDisplay='Follow @glifwallet for updates.'
      linkhref='https://twitter.com/'
    />
  )
}
