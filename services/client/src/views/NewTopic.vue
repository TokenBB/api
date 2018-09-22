<template>
  <div class="container">
    <h2 class="title is-2">Create a New Topic</h2>

    <form @submit.prevent="onSubmit">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <b-field label="Title">
              <b-input v-model="title" placeholder="Type title here"></b-input>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Category">
              <CategoryDropdown
                @change="onSelectCategory"
                :selected="selectedCategory"
                :labelForAll="'Uncategorized'">
              </CategoryDropdown>
            </b-field>
          </div>
        </div>
      </div>

      <b-field label="Message">
        <b-input v-model="content" type="textarea"
          placeholder="Type here.">
        </b-input>
      </b-field>

      <div class="field">
        <div class="control">
          <button role="submit"
            :class="{ 'is-loading': fetching }"
            class="button is-primary">
            Create Topic
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  width: 500px;
}
</style>

<script>
import CategoryDropdown from '@/components/CategoryDropdown.vue'

export default {
  name: 'new-topic',
  components: {
    CategoryDropdown
  },
  data () {
    return {
      fetching: false,
      selectedCategory: null,
      title: '',
      content: ''
    }
  },
  methods: {
    onSubmit () {
      var payload = {
        title: this.title,
        category: this.selectedCategory ? this.selectedCategory.id : null,
        content: this.content
      }

      this.fetching = true

      this.$store.dispatch('topics/createTopic', payload)
        .then(topic => {
          this.$router.push(`/topics/${topic.author}/${topic.permlink}`)
        })
        .catch(err => {
          console.error(err)
          this.fetching = false
        })
    },
    onSelectCategory (category) {
      this.selectedCategory = category
    }
  }
}
</script>
