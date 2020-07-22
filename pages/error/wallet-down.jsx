import React from 'react'
import { ErrorView } from '../../components/Shared'

export default () => {
  return (
    <ErrorView
      title='Oops! Something went wrong.'
      description="We've been notified of the problem."
      linkDisplay='Follow @openworklabs for updates.'
      linkhref='https://twitter.com/openworklabs'
    />
  )
}
