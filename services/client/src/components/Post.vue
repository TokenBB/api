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

      <article class="content has-text-left">
        {{ data.body }}
      </article>

      <footer class="level is-mobile">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <p class="buttons">
              <a v-if="editable" class="button is-small has-icon">
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
  data () {
    return {

    }
  }
}
</script>