import { afterMount, kea, path, actions, defaults } from 'kea'
import { loaders } from 'kea-loaders'
import grapesjs from 'grapesjs'

import type { paywallsLogicType } from './editorLogicType'

const paywallsLogic = kea<paywallsLogicType>([
  path(['scenes', 'editor', 'editorLogic']),
  defaults({}),
  actions({}),
  loaders(({ actions, values }) => ({}))
])

export default paywallsLogic
