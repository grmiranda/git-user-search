<template>
  <q-page class="q-pa-lg">
    <q-form class="row q-col-gutter-sm" @submit="searchUsers()">
      <q-input class="col-sm-6 col-12" outlined v-model="filter.user" label="Real Name or Login:" />
      <q-input class="col-sm-6 col-12" outlined v-model="filter.language" label="Language:" />
      <q-input class="col-sm-6 col-12" outlined v-model="filter.location" label="Location:" />
      <q-input class="col-sm-6 col-12" outlined v-model="filter.repos" type="number" label="Min Repositories:" />
      <div class="col-12">
        <q-btn class="float-right" color="primary" label="Search" type="submit"/>
      </div>
    </q-form>
    <q-separator class="q-my-md" />
  </q-page>
</template>

<script>
import GitHubService from 'src/services/githubService'
// import { mapMutations } from 'vuex'

export default {
  name: 'Search',
  data: () => ({
    filter: {
      user: '', // should be always the first key (to prevent errors in query string)
      language: '',
      location: '',
      repos: 0,
    },
    page: 1,
    perPage: 10,
    users: []
  }),
  methods: {
    async searchUsers() {
      let queryString = ''
      Object.keys(this.filter).forEach(key => {
        if (key === 'user') {
          queryString += `${this.filter[key]}`
        } else if (key === 'repos') {
          queryString += `${key}:>${this.filter[key]}`
        } else if (this.filter[key]) {
          queryString += `${key}:${this.filter[key]}`
        }
      })
      const params = {
        q: queryString,
        per_page: this.perPage,
        page: this.page
      }
      this.users = await GitHubService.getUsers(params)
    }
  }
}
</script>
