// it converts human readable date (2023-02-13T16:53:20.000Z) into timestamp (1676307200)
export const convertDateToUnixTimestamp = (date = new Date()) => {
  if (!(date instanceof Date)) {
    return null
  }

  return Math.floor(date.getTime() / 1000)
}