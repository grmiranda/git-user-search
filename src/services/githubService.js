import { $api } from 'boot/axios'

export default {
  getUsers: params => $api.get('/search/users', { params }),
  getUser: userName => $api.get(`/users/${userName}`),
  getUserRepos: userName => $api.get(`/users/${userName}/repos`)
}
