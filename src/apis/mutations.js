import { gql } from '@apollo/client/core';

const REFRESH_TOKEN_MUTATION = gql`
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

export { REFRESH_TOKEN_MUTATION };