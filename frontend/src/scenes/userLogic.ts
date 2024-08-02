import { actions, kea, path, afterMount, listeners, defaults } from 'kea'
import { loaders } from 'kea-loaders'
import type { userLogicType } from './userLogicType'
import { UserType } from '../types'
import { apiClient } from '../lib/api'
import { AuthApiClient } from './authentication/data/AuthApiClient'
import { notifications } from '@mantine/notifications'
import { router } from 'kea-router'
import { urls } from './urls'

const authApiClient = new AuthApiClient(apiClient)

export const userLogic = kea<userLogicType>([
  path(['scenes', 'app', 'userLogic']),
  defaults({ user: null }),
  actions({
    loadUser: () => ({}),
    logout: true
  }),
  listeners(({ actions }) => ({
    logout: async () => {
      await authApiClient.logout()
      actions.loadUserSuccess(null)

      notifications.show({
        title: 'You\'ve been logged out',
        message: 'See you again soon 👋',
        radius: 'md',
      })
      router.actions.push(urls.login())
    }
  })),
  loaders(({ actions }) => ({
    user: [
      null as UserType | null,
      {
        loadUser: async () => {
          try {
            return await authApiClient.currentUser()
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
