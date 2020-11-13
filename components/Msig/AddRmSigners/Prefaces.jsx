import React from 'react'
import { oneOf } from 'prop-types'
import { Warning } from '../../Shared'

const Preface = ({ method }) => {
  return (
    <>
      {method === 5 && (
        <Warning
          title='Warning'
          description={[
            "You're about to add another signer to your Multisig wallet.",
            'Please make sure you know and trust the new owner as they will be able to deposit funds from your Multisig wallet.'
          ]}
        />
      )}
      {method === 7 && (
        <Warning
          title='Warning'
          description={[
            'Right now, Protocol Labs owns an account that is a signer on your Multisig actor.',
            "You're about to remove Protocol Labs from your Multisig actor, effectively taking full control.",
            'This action is irreversible.'
          ]}
        />
      )}
    </>
  )
}

Preface.propTypes = {
  method: oneOf([5, 7]).isRequired
}

export default Preface
