<template>
  <div class="container">
    <h2 class="title is-4">Settings</h2>

    <h3 class="title is-5">Categories</h3>
    <ul>
        <li v-for="category in categoryList">
          <span>{{ category.name }}</span> 
          <a class="button is-small"
            :class="{ 'is-loading': fetching }" 
            @click="remove(category)">
            <b-icon
              icon="close-circle"
              size="is-small">
            </b-icon>
          </a>
        </li>
    </ul>

    <form @submit.prevent="add">
      <b-field label="Category Name">
        <b-input v-model="name"
          :disabled="fetching">  
        </b-input>
      </b-field>

      <button role="submit"
        class="button" 
        :class="{ 'is-loading': fetching }"
        :disabled="fetching">
        Add
      </button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'settings',
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapState('categories', [
      'categoryList',
      'fetching'
    ])
  },
  methods: {
    add () {
      this.$store.dispatch('categories/add', this.name)
        .then(() => {
          this.name = ''
        })
        .catch(err => {
          console.error(err)
          this.fetching = false
        })
    },
    remove (category) {
      this.$store.dispatch('categories/remove', category)
        .catch(err => {
          console.error(err)
          this.fetching = false
        })
    }
  }
}
</script>
