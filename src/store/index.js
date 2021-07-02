import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { extend } from 'quasar'

import user from './modules/user'
import gitUsers from './modules/gitUsers'

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
    gitUsers,
  },
  strict: process.env.DEBUGGING,
  plugins: [persistence],
})

export default Store
