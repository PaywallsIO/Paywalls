import { actions, kea, path, reducers, defaults, afterMount, listeners } from 'kea'
import type { appLogicType } from './appLogicType'
import Cookies from 'js-cookie'

interface AppDefaultsIF {
  email: string
  password: string
}

type AccessTokenType = string | null

export const appLogic = kea<appLogicType>([
  path(['scenes', 'app', 'appLogic']),
  defaults({
    accessToken: null as AccessTokenType,
    refreshToken: null as AccessTokenType,
  }),
  actions({
    loadAccessAndRefreshToken: true,
    setAuthRefreshToken: (accessToken: AccessTokenType, refreshToken: AccessTokenType) => ({ accessToken, refreshToken }),
  }),
  listeners(({ actions }) => ({
    loadAccessAndRefreshToken: async () => {
      const accessToken = Cookies.get('access_token') as AccessTokenType
      const refreshToken = Cookies.get('refresh_token') as AccessTokenType
      actions.setAuthRefreshToken(accessToken, refreshToken)
    }
  })),
  afterMount(({ actions }) => {
    actions.loadAccessAndRefreshToken()
  }),
  reducers({
    accessToken: {
      setAuthRefreshToken: (_, { accessToken }) => accessToken,
    },
    refreshToken: {
      setAuthRefreshToken: (_, { refreshToken }) => refreshToken,
    }
  }),
])

export default appLogic
