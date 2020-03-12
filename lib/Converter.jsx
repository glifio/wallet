import React, { useContext, createContext, useEffect, useState } from 'react'
import { string, node } from 'prop-types'
import { Converter, BigNumber } from '@openworklabs/filecoin-number'

const ConverterContext = createContext({})

export const ConverterWrapper = ({ children, currency }) => {
  const [converter, setConverter] = useState(null)
  const [converterError, setConverterError] = useState(null)
  useEffect(() => {
    const setupConverter = async () => {
      try {
        const converterInstance = new Converter(currency, {
          apiURL: 'https://cmc-proxy.openworklabs.com'
        })
        await converterInstance.cacheConversionRate()
        setConverter(converterInstance)
      } catch (err) {
        setConverterError(new Error(err))
      }
    }

    setupConverter()
  }, [currency])
  return (
    <ConverterContext.Provider value={{ converter, converterError }}>
      {children}
    </ConverterContext.Provider>
  )
}

ConverterWrapper.propTypes = {
  currency: string,
  children: node
}

ConverterWrapper.defaultProps = {
  currency: 'USD',
  children: <></>
}

export const useConverter = () => {
  return useContext(ConverterContext)
}
