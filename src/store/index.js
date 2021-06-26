import Vuex from 'vuex'
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

const Store = new Vuex.Store({
  modules: {
    user,
  },
  strict: process.env.DEBUGGING,
  plugins: [persistence],
})

export default Store
