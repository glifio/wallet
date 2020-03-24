const fallbackCopyTextToClipboard = text => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed' // avoid scrolling to bottom
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export default text =>
  new Promise((resolve, reject) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text)
      return resolve()
    }
    navigator.clipboard.writeText(text).then(resolve, reject)
  })
