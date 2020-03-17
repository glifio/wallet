import copyToClipboard from '.'

describe('copyToClipboard', () => {
  test('it returns a promise', () => {
    const returnVal = copyToClipboard('text')
    expect(returnVal instanceof Promise).toBe(true)
  })

  test('it calls the navigator.clipboard.writeText method with the passed text', async () => {
    const { navigator } = window
    const mockWriteText = jest.fn(() => Promise.resolve())
    const mockNavigator = {
      clipboard: {
        writeText: mockWriteText
      }
    }
    delete window.navigator
    window.navigator = mockNavigator
    await copyToClipboard('text')
    window.navigator = navigator

    expect(mockWriteText).toHaveBeenCalled()
  })

  test('it calls the document.execCommand method with "copy" when navigator.clipboard is undefined', async () => {
    const mockDocExec = jest.fn()
    window.document.execCommand = mockDocExec
    const { navigator } = window
    const mockNavigator = {}
    delete window.navigator
    window.navigator = mockNavigator
    await copyToClipboard('text')
    expect(mockDocExec).toHaveBeenCalledWith('copy')
    window.navigator = navigator
    delete window.document.execCommand
  })
})
