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

  const { exp: accessTokenExp } = decodeJWT(accessToken)
  const { exp: refreshTokenExp } = decodeJWT(refreshToken)
  const dateNowTimestamp = convertDateToUnixTimestamp()

  // access token has expired
  if (dateNowTimestamp > accessTokenExp) {
    // refresh token has not expired
    if (dateNowTimestamp < refreshTokenExp) {
      const refreshResult = await refresh(refreshToken)

      if (refreshResult?.refresh?.accessToken && refreshResult?.refresh?.refreshToken) {
        res
          .cookie('accessToken', refreshResult.refresh.accessToken)
          .cookie('refreshToken', refreshResult.refresh.refreshToken)
      } else {
        return res
          .status(401)
          .render('common/401'); // redirect to "/login" or "/"
      }
    } else {
      // access and refresh tokens have expired
      return res
        .status(401)
        .render('common/401'); // redirect to "/login" or "/"
    }
  }

  next()
}