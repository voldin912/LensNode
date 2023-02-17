// decoded token has these properties: { id, role, iat, exp }
export const decodeJWT = (token = '') => {
  if (!token) {
    return null
  }

  const base64Payload = token.split('.')[1];
  const payload = Buffer.from(base64Payload, 'base64');

  return JSON.parse(payload.toString());
}