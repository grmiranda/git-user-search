import { $api } from 'boot/axios'

export default {
  getUsers: keyword => $api.get('/search/users', { params: { q: keyword } })
}
