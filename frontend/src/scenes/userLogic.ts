import { actions, kea, path, afterMount, listeners } from 'kea'
import { loaders } from 'kea-loaders'
import type { userLogicType } from './userLogicType'
import { UserType } from '../types'
import { api } from '../lib/api'

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
