export const getComboScore = (combo: number, isTreasure?: boolean) => {
  let result = 0
  switch (combo) {
    case 3:
      result = 100
      break
    case 4:
      result = 200
      break
    case 5:
      result = 500
      break
    case 6:
      result = 1000
      break
    case 7:
      result = 2000
      break
    case 8:
      result = 4000
      break
    default:
      result = 0
      break
  }

  if (isTreasure) {
    result += combo * 100
  }

  return result
}
