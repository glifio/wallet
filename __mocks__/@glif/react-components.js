import { useContext, createContext } from 'react'
export * from '../../node_modules/@glif/react-components/dist'

export const pushPendingMessageSpy = jest.fn()
const clearPendingMessageSpy = jest.fn()
const messages = []

const contextValue = {
  messages,
  pushPendingMessage: pushPendingMessageSpy,
  clearPendingMessage: clearPendingMessageSpy
}

export const PendingMsgContext = createContext(contextValue)

export const PendingMessageProvider = ({ children }) => {
  return (
    <PendingMsgContext.Provider value={contextValue}>
      {children}
    </PendingMsgContext.Provider>
  )
}

export const useSubmittedMessages = () => {
  return useContext(PendingMsgContext)
}
