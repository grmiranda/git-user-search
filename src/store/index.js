import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { extend } from 'quasar'

import user from './modules/user'

const persistence = createPersistedState({
  key: 'gitUserSerach@store',
  reducer(state) {
    const Nstate = extend(true, {}, state)
    delete Nstate.user
    return state
  },
})

export default store(() => {
  const Store = createStore({
    modules: {
      user,
    },
    strict: process.env.DEBUGGING,
    plugins: [persistence],
  })
  return Store
})
