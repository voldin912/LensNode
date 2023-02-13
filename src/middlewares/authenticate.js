import { decodeJWT, convertDateToUnixTimestamp } from '../utils'
import { refresh } from '../apis/apolloClient'

// if you are familiar with middleware, you may know that
// next() call means middleware check is negative (no errors found)

// this middleware should only be used for secure routes
// routes you allow the user to access if they are authenticated
export const authenticate = async (req, res, next) => {
  const { cookies: { accessToken, refreshToken } } = req

  if (!accessToken && !refreshToken) {
    return res
      .status(401)
      .render('common/401'); // redirect to "/login" or "/"
  }

  // in seconds
  const TOKEN_EXPIRED_TIME_GAP = 30 * 60

  // decoded token has these properties: { id, role, iat, exp }
  const { exp: accessTokenExp } = decodeJWT(accessToken)
  const { exp: refreshTokenExp } = decodeJWT(refreshToken)

  const dateNowTimestamp = convertDateToUnixTimestamp()
  const accessTokenTimeDifference = dateNowTimestamp - accessTokenExp
  const refreshTokenTimeDifference = dateNowTimestamp - refreshTokenExp

  // access token has expired
  if (accessTokenTimeDifference > TOKEN_EXPIRED_TIME_GAP) {
    // refresh token has not expired
    if (refreshTokenTimeDifference < 0) {
      const refreshResult = await refresh(refreshToken)

      if (refreshResult.refresh.accessToken && refreshResult.refresh.refreshToken) {
        res
          .cookie('accessToken', refreshResult.refresh.accessToken)
          .cookie('refreshToken', refreshResult.refresh.refreshToken)
      }
      // probably should redirect to login as well if refreshing failed
    } else {
      // access and refresh tokens have expired
      return res
        .status(401)
        .render('common/401'); // redirect to "/login" or "/"
    }
  }

  next()
}