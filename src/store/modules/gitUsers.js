/* eslint-disable no-param-reassign */
const state = () => ({
  users: [],
})

const mutations = {
  ADD_OR_DELETE_USER(stateParam, user) {
    const UserIndex = stateParam.users.findIndex(item => user.id === item.id)
    if (UserIndex >= 0) {
      stateParam.users.splice(UserIndex, 1)
    } else {
      stateParam.users.push(user)
    }
  },
}

const getters = {
  GET_IS_USER_SAVED(stateParam) {
    return user => stateParam.users.findIndex(item => user.id === item.id) >= 0
  },
  GET_USERS(stateParam) {
    return (filter, pagination) => {
      let users = stateParam.users.filter(user => user.repositories.length >= filter.repos
        && ((!filter.user || filter.user === 0)
        || user.login.includes(filter.user)
        || user.name.toLowerCase().includes(filter.user.toLowerCase()))
        && ((!filter.location || filter.location === 0 || !user.location)
        || user.location.toLowerCase().includes(filter.location.toLowerCase())))
      users = users.filter(user => {
        if (!(!filter.language || filter.language === 0)) {
          return user.repositories.some(repo => (repo.language ? filter.language.toLowerCase() === repo.language.toLowerCase() : false))
        }
        return true
      })
      const totalRows = users.length
      const init = pagination.rowsPerPage * (pagination.page - 1)
      const end = pagination.rowsPerPage * (pagination.page)
      users = users.slice(init, end)
      return {
        totalRows,
        users
      }
    }
  }
}

const actions = {
  async saveAccessToken({ commit }, value) {
    commit('SET_USER_ACCESS_TOKEN', value)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
}
