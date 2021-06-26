import { $api } from 'boot/axios'

export default {
  getUsers: params => $api.get('/search/users', { params })
}
