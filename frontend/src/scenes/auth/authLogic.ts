import { kea, path, props } from 'kea'
import { forms } from 'kea-forms'

import type { authLogicType } from './authLogicType'

interface AuthFormIF {
  name: string
  email: string
  password: string
  terms: boolean
}

const authLogic = kea<authLogicType>([
  path(['src', 'logics', 'authLogic']),
  props({}),
  forms(({ props, actions }) => ({
    authForm: {
      defaults: {
        name: '',
        email: '',
        password: '',
        terms: true,
      } as AuthFormIF,
      errors: ({ email, password }: AuthFormIF) => ({
        email: email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'Please enter a valid email' + email) : 'Please enter an email',
        password: 'Password should include at least ' + password.length + ' characters',
      }),
      submit: async ({ name, email, password, terms }) => {
        console.log({ name, email, password, terms })
      },
    },
  })),
])

export default authLogic
