const unix = jest.fn().mockImplementation(() => {
  return {
    format: fmt => {
      if (fmt === 'YYYY-MM-DD') return '2020-01-12'
      if (fmt === 'MMM DD, YYYY') return 'Jan 12, 2020'
      if (fmt === 'HH:mm:ss') return '2:30:30'
      if (fmt === 'MMM DD, YYYY - HH:mm:ss') return 'Jan 12, 2020 - 2:30:30'
    }
  }
})

const dayjs = () => {
  return {
    unix
  }
}

dayjs.unix = unix

module.exports = dayjs
