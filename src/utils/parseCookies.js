export const parseCookies = (cookies = []) => cookies.reduce((map, cookie) => {
  const substring = cookie.substring(0, cookie.indexOf(';'))
  const [key, value] = substring.split('=')

  map[key] = value

  return map
}, {})