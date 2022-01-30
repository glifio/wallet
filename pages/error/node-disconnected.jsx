import React from 'react'
import { ErrorView } from '@glif/react-components'

const NodeDisconnected = () => {
  return (
    <ErrorView
      title='Disconnected!'
      description='We had trouble connecting to our Filecoin nodes. We are aware of the situation and are working on fixing this as soon as possible.'
      linkhref=''
      linkDisplay=''
    />
  )
}

export default NodeDisconnected
