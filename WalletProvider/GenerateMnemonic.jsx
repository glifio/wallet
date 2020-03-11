import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { generateMnemonic } from 'bip39'

export default dynamic({
  ssr: false,
  loader: async () => {
    // Will use once we have generate mnemonic exposed from rust module
    // const rustModule = await import('fcwebsigner')

    const GenerateMnemonic = ({ setMnemonic }) => {
      const [createdMnemonic, setCreatedMnemonic] = useState(false)

      useEffect(() => {
        if (!createdMnemonic) {
          setMnemonic(generateMnemonic())
          setCreatedMnemonic(true)
        }
      }, [createdMnemonic, setCreatedMnemonic, setMnemonic])

      return <></>
    }

    GenerateMnemonic.propTypes = {
      setMnemonic: PropTypes.func.isRequired
    }

    return GenerateMnemonic
  }
})
