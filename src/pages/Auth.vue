<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h5">GITHUB Access Token</h1>
    <p class="text-subtitle">
      Provide yout GITHUB Access Token, this will allow you to do more than 60 requests per hour.
      <br/> You can get one following the
      <a href="https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token" target="_blank">
        Creating a personal access token tutorial
      </a>
    </p>
    <q-form :submit="saveAccessToken()">
      <q-input outlined v-model="accessToken" label="Access Token:" />
      <q-btn class="float-right q-mt-sm" color="primary" label="Save" type="submit"/>
    </q-form>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Auth',
  data: () => ({
    accessToken: ''
  }),
  mounted() {
    this.accessToken = this.githubAccessToken
  },
  computed: {
    ...mapGetters({
      githubAccessToken: 'user/GET_USER_ACCESS_TOKEN'
    })
  },
  methods: {
    ...mapMutations({
      SET_USER_ACCESS_TOKEN: 'user/SET_USER_ACCESS_TOKEN'
    }),
    saveAccessToken() {
      this.SET_USER_ACCESS_TOKEN(this.accessToken)
    }
  }
}
</script>
