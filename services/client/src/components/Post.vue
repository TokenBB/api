<template>
  <div class="post columns is-mobile">
    <div class="column is-narrow">
      <figure class="image is-48x48 avatar">
        <img class="is-rounded" src="https://bulma.io/images/placeholders/256x256.png">
      </figure>
    </div>
    <div class="column is-8">
      <header class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            {{ data.author }}
          </div>
        </div>

        <div class="level-right">
          <p class="level-item">
            {{ new Date(data.created).toLocaleString() }}
          </p>
        </div>
      </header>

      <article v-if="!editing" class="content has-text-left">
        {{ data.body }}
      </article>

      <form v-if="editing">
        <b-field>
          <b-input type="textarea"
            :loading="fetching"
            :disabled="fetching"
            v-model="text"
            placeholder="Type here.">
          </b-input>
        </b-field>

        <b-field>
          <p class="control">
            <a class="button is-primary" 
              :class="{ 'is-loading': this.fetching }" 
              @click="onSave">
              Save
            </a>
          </p>

          <p class="control">
            <a class="button" 
              :disabled="this.fetching"
              @click="onCancel">
              Cancel
            </a>
          </p>
        </b-field>
      </form>

      <footer class="level is-mobile">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <p class="buttons">
              <a v-if="editable && !editing"
                @click="onStartEditing"
                class="button is-small has-icon">
                <b-icon
                  icon="square-edit-outline"
                  size="is-small">
                </b-icon>
                <span>Edit</span>
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post {
  margin-bottom: 2rem;
  border-bottom: 2px solid whitesmoke;
}
</style>

<script>
export default {
  props: {
    data: Object
  },
  computed: {
    editable () {
      return this.data.author === this.$store.state.auth.username
    }
  },
  methods: {
    onStartEditing () {
      this.text = this.data.body
      this.editing = true
    },
    onSave () {
      this.fetching = true

      var payload = {
        post: this.data,
        content: this.text
      }

      this.$store.dispatch('posts/editPost', payload)
        .then(post => {
          this.data.body = post.body
          this.editing = false
          this.fetching = false
        })
        .catch(err => {
          console.error(err)
          this.fetching = false
        })
    },
    onCancel () {
      if (this.fetching) return

      this.text = ''
      this.editing = false
    }
  },
  data () {
    return {
      fetching: false,
      editing: false,
      text: ''
    }
  }
}
</script>