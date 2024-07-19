import { kea, path, props } from 'kea'
import { forms } from 'kea-forms'
import { router, encodeParams } from 'kea-router'
import { notifications } from '@mantine/notifications'

import type { loginLogicType } from './loginLogicType'
import { userLogic } from '../userLogic'
import { api, ApiConfig } from '../../lib/api'
import { LoginType } from '../../types'

const loginLogic = kea<loginLogicType>([
  path(['scenes', 'auth', 'loginLogicType']),
  forms(({ actions }) => ({
    loginForm: {
      defaults: {
        email: '',
        password: '',
      } as LoginType,
      errors: ({ email, password }: LoginType) => ({
        email: email ? (/^\S+@\S+$/.test(email) ? null : 'Please enter a valid email') : 'Please enter an email',
        password: password.length <= 6 ? 'Password should include at least 6 characters' + password.length : null,
      }),
      submit: async ({ email, password }) => {
        try {
          const response = await api.auth.login({ email, password })
          ApiConfig.persistToken(response)

          userLogic.actions.loadUser()

          notifications.show({
            color: 'green',
            title: '👋 Welcome back!',
            message: 'Great to see you.',
            radius: 'md',
          })
          actions.resetLoginForm()
        } catch (error: any) {
          notifications.show({
            color: 'red',
            title: 'Error',
            message: 'Could not login. Please try again',
            radius: 'md',
          })
        }
      },
    },
  })),
])

export function handleLoginRedirect(): void {
  let nextURL = '/'
  try {
    const nextPath = router.values.searchParams['next'] || '/'
    const url = new URL(nextPath.startsWith('/') ? location.origin + nextPath : nextPath)
    nextURL = url.pathname + url.search + encodeParams(router.values.hashParams, '#')
  } catch (e) {
    // do nothing
  }
  // A safe way to redirect to a user input URL. Calls history.replaceState() ensuring the URLs origin does not change
  router.actions.replace(nextURL)
}

export default loginLogic
