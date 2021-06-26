/* eslint-disable no-param-reassign */
const state = () => ({
  githubAccessToken: '',
})

const mutations = {
  SET_USER_ACCESS_TOKEN(stateParam, value) {
    stateParam.githubAccessToken = value
  },
}

const getters = {
  GET_USER_ACCESS_TOKEN(stateParam) {
    return stateParam.githubAccessToken
  },
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
