function updateArrayItem(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      return item
    }

    return {
      ...item,
      ...action.item
    }
  })
}

export default updateArrayItem
