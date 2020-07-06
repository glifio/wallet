import React from 'react'
import { useSelector } from 'react-redux'
import { useMsig } from '../../MsigProvider'

export default () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const msig = useMsig(msigActorAddress)
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
