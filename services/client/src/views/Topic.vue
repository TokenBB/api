<template>
  <div class="container">
    <div v-if="fetching" class="spacer">
      <b-loading :is-full-page="false" :active="fetching"></b-loading>
    </div>

    <div v-if="!fetching">
      <header class="has-text-left">
        <h2 class="title is-1">{{ topic.title }}</h2>

        <p class="subtitle is-5">
          <span class="tag">
            {{ topic.categoryId }}
          </span>
        </p>
      </header>

      <main ref="posts">
        <Post :data="topic"></Post>
        <Post v-for="reply in topic.replies" :data="reply"></Post>
      </main>

      <hr>

      <ReplyForm 
        :fetching="$store.state.replies.fetching"
        :text="replyText"
        @input="onReplyInput"
        @submit="onReplySubmit">
      </ReplyForm>
    </div>

  </div>
</template>

<style> 
.spacer {
  height: 300px; 
}
</style>

<script>
import postService from '@/services/post.service'
import Post from '@/components/Post.vue'
import ReplyForm from '@/components/ReplyForm.vue'

export default {
  name: 'topic',
  components: {
    Post,
    ReplyForm
  },
  created () {
    this.fetchTopic()
  },
  data () {
    return {
      fetching: true,
      topic: {},
      replyText: ''
    }
  },
  methods: {
    onReplyInput (text) {
      this.replyText = text
    },
    onReplySubmit () {
      var payload = {
        parent: this.topic,
        content: this.replyText
      }

      this.$store.dispatch('replies/submitReply', payload)
        .then(reply => {
          this.topic.replies.push(reply)
          this.replyText = ''
        })
    },
    fetchTopic () {
      var { author, permlink } = this.$route.params

      this.fetching = true

      return postService.getTopic(author, permlink).then(topic => {
        if (!topic) return this.$router.push('/')

        this.topic = topic
        this.fetching = false
      })
    }
  }
}
</script>
