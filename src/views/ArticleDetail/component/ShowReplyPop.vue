<template>
  <div class="ShowReplyPop-container">
    <van-nav-bar
      :title="
        currentReply.reply_count > 0
          ? `${currentReply.reply_count}条回复`
          : '暂无回复'
      "
      left-arrow
      @click-left="$emit('update:showReply', !showReply)"
      class="nav-title"
    />
    <OneCommentItem :currentReply="currentReply"></OneCommentItem>
    <van-cell title="全部回复" />
    <OneCommentItem
      v-for="(currentReply, index) in commentList"
      :key="index"
      :currentReply="currentReply"
    ></OneCommentItem>
    <div class="btn-bottom">
      <van-button class="btn" small="mini" round @click="postShow = true">
        评论</van-button
      >
    </div>
    <van-popup v-model="postShow" position="bottom">
      <div class="post-comment" v-if="postShow">
        <van-field
          class="post-field"
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <van-button
          @click="onCommentReply"
          type="primary"
          size="small"
          class="btn"
        >
          发布</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script>
import { getArticlesComments, addArticlesCommentsReply } from '@/api'
import OneCommentItem from '@/views/ArticleDetail/component/OneICommentItem.vue'
export default {
  name: '',
  data () {
    return {
      commentList: [],
      postShow: false,
      message: '',
      list: []
    }
  },
  props: {
    commentId: {
      type: String,
      required: true
    },
    currentReply: {
      type: Object,
      required: true
    },
    showReply: {
      type: Boolean,
      required: true
    }
  },
  components: { OneCommentItem },
  computed: {},
  created () {
    this.getArticlesComments()
  },
  mounted () {},
  methods: {
    async getArticlesComments () {
      const {
        data: { data }
      } = await getArticlesComments({
        type: 'c',
        source: this.commentId,
        limit: 10
      })
      this.commentList = data.results
      console.log(this.commentList)
    },
    async onCommentReply () {
      try {
        const {
          data: { data }
        } = await addArticlesCommentsReply(
          this.currentReply.com_id,
          this.message,
          this.currentReply.aut_id
        )
        this.commentList.unshift(data.new_obj)
        this.postShow = false
        this.$toast.success('发布评论成功')
      } catch (error) {
        this.$toast.fail('发布评论失败')
      }
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
/deep/.btn-bottom {
  width: 100%;
  height: 1.33333rem;
  position: fixed;
  bottom: 0;
  border-top: 0.01333rem solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff69b4;
  .btn {
    position: fixed;
    bottom: 6px;
    width: 80%;
    width: 8.53333rem;
    height: 1.06667rem;
  }
}
.post-comment {
  display: flex;
  padding: 15px;
  align-items: flex-end;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
  .btn {
    color: #6ba3d8;
    background-color: #fff;
    font-size: 0.36333rem;
    border: none;
  }
}
</style>
