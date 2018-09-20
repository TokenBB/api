<template>
  <div class="container">

    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <b-dropdown hoverable>
              <button class="button" slot="trigger">
                  <span>All categories</span>
                  <b-icon icon="menu-down"></b-icon>
              </button>

              <b-dropdown-item>A category</b-dropdown-item>
              <b-dropdown-item>Another category</b-dropdown-item>
              <b-dropdown-item>Yet another</b-dropdown-item>
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

    <b-table :loading="fetching" :data="topicList" :columns="columns"></b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState('topics', [
      'fetching', 
      'topicList'
    ])
  },
  data () {
    return {
      columns: [
        {
          field: 'title',
          label: 'Topic'
        },
        {
          field: 'category',
          label: 'Category'
        },
        {
          field: 'replies',
          label: 'Replies'
        },
        {
          field: 'upvotes',
          label: 'Upvotes'
        },
        {
          field: 'pending',
          label: 'Pending Payout'
        }
      ]
    }
  }
}
</script>
