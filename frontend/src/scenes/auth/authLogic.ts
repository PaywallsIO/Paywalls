import { kea, path, props } from 'kea'
import { forms } from 'kea-forms'
import { notifications } from '@mantine/notifications'
import axios from 'axios'
import Cookies from 'js-cookie'
import appLogic from '../app/appLogic'

import type { authLogicType } from './authLogicType'

interface AuthFormIF {
  email: string
  password: string
}

const authLogic = kea<authLogicType>([
  path(['scenes', 'auth', 'authLogic']),
  forms(({ }) => ({
    authForm: {
      defaults: {
        email: '',
        password: '',
      } as AuthFormIF,
      errors: ({ email, password }: AuthFormIF) => ({
        email: email ? (/^\S+@\S+$/.test(email) ? null : 'Please enter a valid email') : 'Please enter an email',
        password: password.length <= 6 ? 'Password should include at least 6 characters' + password.length : null,
      }),
      submit: async ({ email, password }) => {
        console.log({ email, password })
        try {
          const response = await axios.post("/api/token", { email, password })

          const { access, refresh } = response.data
          Cookies.set('access_token', access, { secure: true, sameSite: 'strict' })
          Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' })

          appLogic.actions.setAuthRefreshToken(access, refresh)

          notifications.show({
            color: 'green',
            title: 'Welcome back!',
            message: 'Great to see you.',
            radius: 'md'
          })
        } catch (error) {
          notifications.show({
            color: 'red',
            title: 'Error',
            message: 'Could not login. Please try again',
            radius: 'md'
          })
        }
      }
    },
  })),
])

export default authLogic
