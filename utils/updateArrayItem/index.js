const updateArrayItem = (array, idxToReplace, replacement) =>
  array.map((original, index) =>
    index === idxToReplace ? replacement : original
  )

export default updateArrayItem
