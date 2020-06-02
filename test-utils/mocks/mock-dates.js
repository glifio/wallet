const unix = jest.fn().mockImplementation(() => {
  return {
    format: fmt => {
      if (fmt === 'MMM DD') return 'Jan 12'
      if (fmt === 'hh:mmA') return '2:30PM'
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
