import { boot } from 'quasar/wrappers'
import axios from 'axios'
import store from 'src/store'

const api = axios.create({ baseURL: 'https://api.github.com' })

const setAuthorizationMiddleware = request => {
  const token = store.getters['user/GET_USER_ACCESS_TOKEN'] || false
  if (token) {
    request.headers.Authorization = `token ${token}`
  }
  return request
}

api.interceptors.request.use(setAuthorizationMiddleware)

export default boot(({ app }) => {
  // for use inside Vue files through this.$axios and this.$api
  app.config.globalProperties.$axios = axios // eslint-disable-line no-param-reassign
  app.config.globalProperties.$api = api // eslint-disable-line no-param-reassign
})

export { api }
