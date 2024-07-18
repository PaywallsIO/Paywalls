import { actions, kea, path, afterMount, listeners, defaults } from 'kea'
import { loaders } from 'kea-loaders'
import type { userLogicType } from './userLogicType'
import { UserType } from '../types'
import { api } from '../lib/api'

export const userLogic = kea<userLogicType>([
  path(['scenes', 'app', 'userLogic']),
  defaults({ user: null }),
  actions({
    loadUser: () => ({})
  }),
  loaders(({ actions }) => ({
    user: [
      null as UserType | null,
      {
        loadUser: async () => {
          try {
            // await new Promise(r => setTimeout(r, 2000));
            const user = await api.auth.currentUser()
            console.log("user", user)
            return user
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
