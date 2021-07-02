<template>
  <q-form class="row q-col-gutter-sm" @submit="$emit('filter', filter)">
    <q-input class="col-sm-6 col-12" outlined v-model="filter.user" label="Real Name or Login:" />
    <q-input class="col-sm-6 col-12" outlined v-model="filter.language" label="Language:" />
    <q-input class="col-sm-6 col-12" outlined v-model="filter.location" label="Location:" />
    <q-input class="col-sm-6 col-12" outlined v-model="filter.repos" type="number" label="Min Repositories:" />
    <div class="col-12">
      <q-btn class="float-right" color="primary" label="Search" type="submit"/>
    </div>
  </q-form>
</template>

<script>
export default {
  name: 'UsersSearchForm',
  data: () => ({
    filter: {
      user: '', // should be always the first key (to prevent errors in query string)
      language: '',
      location: '',
      repos: 0,
    },
  }),
}
</script>
