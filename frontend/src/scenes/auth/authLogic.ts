import { kea, path, props } from 'kea'
import { forms } from 'kea-forms'

import type { authLogicType } from './authLogicType'

interface AuthFormIF {
  email: string
  password: string
}

const authLogic = kea<authLogicType>([
  path(['src', 'logics', 'authLogic']),
  props({}),
  forms(({ props, actions }) => ({
    authForm: {
      defaults: {
        email: '',
        password: '',
      } as AuthFormIF,
      errors: ({ email, password }: AuthFormIF) => ({
        email: email ? (/^\S+@\S+$/.test(email) ? null : 'Please enter a valid email') : 'Please enter an email',
        password: password.length <= 6 ? 'Password should include at least 6 characters' + password.length : null,
      }),
      submit: async ({ name, email, password, terms }) => {
        console.log({ name, email, password, terms })
      },
    },
  })),
])

export default authLogic
