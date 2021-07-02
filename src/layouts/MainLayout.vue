<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          {{ $route.name }}
        </q-toolbar-title>
        <div v-if="!githubAccessToken" class="text-warning">Missing Access Token!</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          Olá,
        </q-item-label>

        <MenuLink
          v-for="link in menuItems"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLink from 'src/components/atoms/MenuLink.vue'
import { mapGetters } from 'vuex'

const menuItemsList = [
  {
    title: 'Authorization',
    caption: 'GitHub Access Token',
    icon: 'lock',
    page: 'Authorization',
  },
  {
    title: 'Search Users',
    icon: 'search',
    page: 'Search',
  },
  {
    title: 'Favorites',
    icon: 'star',
    page: 'Favorites',
  },
]

export default {
  name: 'MainLayout',
  components: { MenuLink },
  data: () => ({
    menuItems: menuItemsList,
    leftDrawerOpen: true,
  }),
  computed: {
    ...mapGetters({
      githubAccessToken: 'user/GET_USER_ACCESS_TOKEN'
    })
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
  }
}
</script>
