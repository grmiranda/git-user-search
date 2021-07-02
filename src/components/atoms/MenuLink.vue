<template>
  <q-item clickable :to="formatedLink">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="q-pt-xs">{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'MenuLink',
  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    page: {
      type: String,
      default: '#',
    },
    icon: {
      type: String,
      default: '',
    },
    params: {
      type: Object,
      default: null,
    },
  },
  computed: {
    formatedLink() {
      if (this.params) {
        return { name: this.page, params: { ...this.params } }
      }
      return { name: this.page }
    },
  },
}
</script>
