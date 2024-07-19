import { actions, kea, path, afterMount, listeners, defaults, reducers } from 'kea'
import { loaders } from 'kea-loaders'
import type { userLogicType } from './userLogicType'
import { UserType } from '../types'
import { ApiConfig, api } from '../lib/api'
import { notifications } from '@mantine/notifications'

export const userLogic = kea<userLogicType>([
  path(['scenes', 'app', 'userLogic']),
  defaults({ user: null }),
  actions({
    loadUser: () => ({}),
    logout: true
  }),
  listeners(({ actions }) => ({
    logout: () => {
      ApiConfig.clearToken()
      actions.loadUserSuccess(null)
      notifications.show({
        title: 'You\'ve been logged out',
        message: 'See you again soon 👋',
        radius: 'md',
      })
    }
  })),
  loaders(({ actions }) => ({
    user: [
      null as UserType | null,
      {
        loadUser: async () => {
          try {
            return await api.auth.currentUser()
          } catch (error: any) {
            actions.loadUserFailure(error.message)
          }
          return null
        }
      }
    ]
  })),
  afterMount(({ actions }) => {
    actions.loadUser()
  }),
])
