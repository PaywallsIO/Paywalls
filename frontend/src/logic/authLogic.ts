import { kea, actions, reducers, path } from 'kea'

import type { authLogicType } from './authLogicType'

const authLogic = kea<authLogicType>([path(['src', 'logics', 'authLogic']), actions({}), reducers({})])
