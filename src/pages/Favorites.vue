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
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          outline
          @click="exportTable"
        />
      </template>
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
            <q-btn round :color="checkUserSaved(props.row) ? 'yellow-14' : 'grey-5'" icon="star" size="md" flat @click="deleteUser(props.row)">
              <q-tooltip>Remove user from favorites</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import UserSearchForm from 'src/components/elements/UsersSearchForm.vue'
import { exportFile, useQuasar } from 'quasar'
import { mapMutations, mapGetters } from 'vuex'
import GitHubService from 'src/services/githubService'

const columnsData = [
  { field: 'avatar_url', name: 'avatar_url', align: 'left', label: '', sortable: false },
  { field: 'login', name: 'login', align: 'left', label: 'Username', sortable: false },
  { field: 'name', name: 'name', align: 'left', label: 'Full Name', sortable: false },
  { field: 'repositories', format: val => `${val.length} repos`, name: 'repositories', align: 'left', label: 'Repos Number', sortable: false },
  { field: 'actions', name: 'actions', align: 'left', label: 'Actions', sortable: false },
]
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn && {}.toString.call(formatFn) === '[object Function]'
    ? formatFn(val)
    : val

  formatted = formatted === 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  return `"${formatted}"`
}

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
      checkUserSaved: 'gitUsers/GET_IS_USER_SAVED',
      getUsers: 'gitUsers/GET_USERS'
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
    deleteUser(user) {
      this.saveOrDeleteUser(user)
      this.searchUsers()
    },
    async searchUsers() {
      this.loading = true
      const usersList = await this.getUsers(this.filter, this.pagination)
      this.pagination.rowsNumber = usersList.totalRows
      this.users = []
      usersList.users.forEach(item => {
        this.users.push(item)
        this.fetchUserData(item.id, item.login)
      })
      this.loading = false
    },
    async fetchUserData(userId, userLogin) {
      try {
        const UserData = await GitHubService.getUser(userLogin)
        const UserReposData = await GitHubService.getUserRepos(userLogin)
        const UserIndex = this.users.findIndex(item => userId === item.id)
        if (UserIndex >= 0) {
          this.users.splice(UserIndex, 1, { ...UserData.data, repositories: UserReposData.data })
        }
      } catch {
        const $q = useQuasar()
        $q.notify('Error when update user data')
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
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
        this.users.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        const $q = useQuasar()
        $q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
  }
}
</script>
