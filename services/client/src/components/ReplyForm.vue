<template>
  <form @submit.prevent="$emit('submit')">
    <b-field>
      <b-input type="textarea"
        @input="value => $emit('input', value)"
        :value="text"
        :loading="fetching"
        :disabled="fetching"
        minlength="10"
        placeholder="Type here.">
      </b-input>
    </b-field>

    <b-field>
      <div class="control">
        <button role="submit"
          class="button is-primary"
          v-bind:class="{ 'is-loading': fetching }">
          Reply
        </button>
      </div>
    </b-field>
  </form>
</template>

<style lang="scss" scoped>
form { width: 500px; }
textarea { width: 450px; }
</style>

<script>
export default {
  props: {
    fetching: Boolean,
    text: String
  }
}
</script>