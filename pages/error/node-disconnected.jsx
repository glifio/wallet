import React from 'react'
import { ErrorView } from '@glif/react-components'

const NodeDisconnected = () => {
  return (
    <ErrorView
      title='Disconnected!'
      description='We had trouble connecting to our Filecoin nodes. Sorry for the inconvenience, please try again in a few hours!'
      linkhref=''
      linkDisplay=''
    />
  )
}

export default NodeDisconnected
