<template>
  <q-page class="q-pa-lg">
    <UserSearchForm @filter="filterData"/>
    <q-separator class="q-my-md" />
    <q-table
      title="Users"
      :rows="users"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      @request="loadData"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="avatar_url" :props="props">
            <q-avatar>
              <img :src="props.row.avatar_url">
            </q-avatar>
          </q-td>
          <q-td key="login" :props="props">
            <q-badge color="green">
              {{ props.row.login }}
            </q-badge>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="repositories" :props="props">
            {{ props.row.repositories.length == 30 ? '30+' : props.row.repositories.length}} repos
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn round :color="checkUserSaved(props.row) ? 'yellow-14' : 'grey-5'" icon="star" size="md" flat @click="saveOrDeleteUser(props.row)">
              <q-tooltip>{{ checkUserSaved(props.row) ? 'Remove user from favorites' : 'Add user to favorites' }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import UserSearchForm from 'src/components/elements/UsersSearchForm.vue'
import { mapMutations, mapGetters } from 'vuex'
import GitHubService from 'src/services/githubService'

const columnsData = [
  { name: 'avatar_url', align: 'left', label: '', sortable: false },
  { name: 'login', align: 'left', label: 'Username', sortable: false },
  { name: 'name', align: 'left', label: 'Full Name', sortable: false },
  { name: 'repositories', align: 'left', label: 'Repos Number', sortable: false },
  { name: 'actions', align: 'left', label: 'Actions', sortable: false },
]

export default {
  name: 'Search',
  components: { UserSearchForm },
  data: () => ({
    filter: { repos: 0 },
    users: [],
    columns: columnsData,
    loading: false,
    pagination: {
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10
    }
  }),
  computed: {
    ...mapGetters({
      checkUserSaved: 'gitUsers/GET_IS_USER_SAVED'
    })
  },
  mounted() {
    this.loadData({
      pagination: this.pagination,
    })
  },
  methods: {
    ...mapMutations({
      saveOrDeleteUser: 'gitUsers/ADD_OR_DELETE_USER'
    }),
    async searchUsers() {
      this.loading = true
      const { data: usersList } = await GitHubService.getUsers(this.getQueryFiltersFormated())
      this.pagination.rowsNumber = usersList.total_count
      this.users = []
      usersList.items.forEach(item => {
        this.users.push({
          id: item.id,
          avatar_url: item.avatar_url,
          login: item.login,
          repositories: []
        })
        this.fetchUserData(item.id, item.login)
      })
      this.loading = false
    },
    getQueryFiltersFormated() {
      let queryString = ''
      Object.keys(this.filter).forEach(key => {
        if (key === 'user') {
          queryString += `${this.filter[key]} `
        } else if (key === 'repos') {
          queryString += `${key}:>${this.filter[key]} `
        } else if (this.filter[key]) {
          queryString += `${key}:${this.filter[key]} `
        }
      })
      return {
        q: queryString,
        per_page: this.pagination.rowsPerPage,
        page: this.pagination.page
      }
    },
    async fetchUserData(userId, userLogin) {
      const UserData = await GitHubService.getUser(userLogin)
      const UserReposData = await GitHubService.getUserRepos(userLogin)
      const UserIndex = this.users.findIndex(item => userId === item.id)
      if (UserIndex >= 0) {
        this.users.splice(UserIndex, 1, { ...UserData.data, repositories: UserReposData.data })
      }
    },
    async loadData(props) {
      const { page, rowsPerPage } = props.pagination
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.searchUsers()
    },
    filterData(filter) {
      this.filter = filter
      this.searchUsers()
    }
  }
}
</script>
