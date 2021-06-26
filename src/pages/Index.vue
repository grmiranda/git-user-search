<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
  </q-page>
</template>

<script>
import GitHubService from 'src/services/githubService'

export default {
  name: 'PageIndex',
  async mounted() {
    this.users = await GitHubService.getUsers('grmiranda')
  },
  data: () => ({
    users: []
  })
}
</script>
