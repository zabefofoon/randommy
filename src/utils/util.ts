import ShortUniqueId from 'short-unique-id'

const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

const generateUniqueId = (): string => {
  const uId = new ShortUniqueId({
    length: 10,
    dictionary: 'alpha'
  })
  return uId.rnd()
}

export default {
  sleep,
  generateUniqueId
}
