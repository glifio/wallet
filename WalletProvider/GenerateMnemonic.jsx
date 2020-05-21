import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export default dynamic({
  ssr: false,
  loader: async () => {
    const rustModule = await import('@zondax/filecoin-signer-wasm')

    const GenerateMnemonic = ({ setMnemonic }) => {
      const [createdMnemonic, setCreatedMnemonic] = useState(false)

      useEffect(() => {
        if (!createdMnemonic) {
          setMnemonic(rustModule.generateMnemonic())
          setCreatedMnemonic(true)
        }
      }, [createdMnemonic, setCreatedMnemonic, setMnemonic])

      return null
    }

    GenerateMnemonic.propTypes = {
      setMnemonic: PropTypes.func.isRequired
    }

    return GenerateMnemonic
  }
})
