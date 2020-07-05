import React from 'react'

import { useMsig } from '../../msig'

export default () => {
  const msig = useMsig()
  console.log(msig)
  return (
    <div>
      <button type='button' onClick={msig.createActor}>
        Create
      </button>
      <button type='button' onClick={msig.propose}>
        Propose
      </button>
    </div>
  )
}
