const generate = (setOfRandomNums, numRandoms, numWords) => {
  if (setOfRandomNums.size === numRandoms) return setOfRandomNums

  const randomNum = Math.round(Math.random() * numWords)
  if (setOfRandomNums.has(randomNum))
    return generate(setOfRandomNums, numRandoms, numWords)

  setOfRandomNums.add(randomNum)
  return generate(setOfRandomNums, numRandoms, numWords)
}

export default (numWords, numRandoms) => {
  const indexes = new Set([])
  const randoms = [...generate(indexes, numRandoms, numWords)]
  return randoms.sort((a, b) => a - b)
}
