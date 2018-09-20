<template>
  <div class="container">
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <b-dropdown v-on:change="onSelectCategory">
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
        </div>
      </div>

      <div class="level-right">
        <div class="level-item">
          <router-link to="/new" class="button has-icon">
            New Topic
          </router-link>
        </div>
      </div>
    </nav>

    <b-table :loading="fetching" :data="topicList">
      
      <template slot-scope="props">
        <b-table-column field="title" label="Topic">
          <router-link :to="topicRoute(props.row)">
            {{ props.row.title }}
          </router-link>
        </b-table-column>
        <b-table-column field="categoryId" label="Category">
          <span class="tag" v-if="categoryFromId(props.row.categoryId)">
            {{ categoryFromId(props.row.categoryId) }}
          </span>
        </b-table-column>
        <b-table-column field="numberOfReplies" label="Replies">
            {{ props.row.numberOfReplies }}
        </b-table-column>
        <b-table-column field="upvotes" label="Upvotes">
            {{ props.row.upvotes }}
        </b-table-column>
        <b-table-column field="pendingPayout" label="Pending Payout">
            {{ props.row.pendingPayout }}
        </b-table-column>

      </template>

    </b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

var allCategories = { name: 'All Categories' }

export default {
  name: 'home',
  computed: {
    ...mapState('topics', [
      'fetching'
    ]),
    ...mapState('categories', [
      'fetching',
      'categoryList',
      'categoriesById'
    ]),
    topicList () {
      if (!this.selectedCategory.id) return this.$store.state.topics.topicList

      return this.$store.state.topics.topicList.filter(topic => {
        return topic.categoryId === this.selectedCategory.id
      })
    }
  },
  methods: {
    onSelectCategory (value) {
      this.selectedCategory = value
    },
    topicRoute (topic) {
      return `/topics/${topic.author}/${topic.permlink}`
    },
    categoryFromId (id) {
      return (this.categoriesById[id] || { name: '' }).name
    }
  },
  data () {
    return {
      allCategories,
      selectedCategory: allCategories
    }
  }
}
</script>
