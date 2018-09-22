<template>
  <b-dropdown @change="onChange">
    <button class="button" type="button" slot="trigger">
      <span>{{ selectedCategory.name }}</span>
      <b-icon icon="menu-down"></b-icon>
    </button>

    <b-dropdown-item :value="allCategories">
      {{ allCategories.name }}
    </b-dropdown-item>

    <b-dropdown-item v-for="category in categoryList" :value="category">
      {{ category.name }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    selected: {
      type: Object,
      default: function () {
        return this.allCategories
      }
    },
    labelForAll: String
  },
  data () {
    return {
      all: {
        name: 'All Categories'
      }
    }
  },
  computed: {
    allCategories () {
      return this.labelForAll 
        ? Object.assign(this.all, { name: this.labelForAll }) 
        : this.all
    },
    selectedCategory () {
      return this.selected || this.allCategories
    },
    ...mapState('categories', [
      'fetching',
      'categoryList',
      'categoriesById'
    ])
  },
  methods: {
    onChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>