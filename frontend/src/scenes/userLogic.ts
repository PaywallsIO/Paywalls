import { actions, kea, path, afterMount, listeners } from 'kea'
import { loaders } from 'kea-loaders'
import type { userLogicType } from './userLogicType'
import { UserType } from '../types'
import { api } from '../lib/api'
import { notifications } from '@mantine/notifications'
import { router } from 'kea-router'
import { urls } from './urls'

export const userLogic = kea<userLogicType>([
  path(['scenes', 'app', 'userLogic']),
  actions({
    loadUser: () => ({})
  }),
  loaders(({ actions }) => ({
    user: [
      null as UserType | null,
      {
        loadUser: async () => {
          try {
            return await api.auth.getCurrentUser()
          } catch (error: any) {
            console.log("ERROR Loading user " + error)
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
