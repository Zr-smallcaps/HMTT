<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-cell class="comment-item">
      <van-image
        slot="icon"
        class="avatar"
        round
        fit="cover"
        :src="comment.aut_photo"
      />
      <div slot="title" class="title-wrap">
        <div class="user-name">{{ comment.aut_name }}</div>
        <van-button
          class="like-btn"
          :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
          @click="OngoodJob"
          >{{ comment.like_count || '赞' }}</van-button
        >
      </div>

      <div slot="label">
        <p class="comment-content">{{ comment.content }}</p>
        <div class="bottom-info">
          <span class="comment-pubdate">{{
            comment.pubdate | relativeTime
          }}</span>
          <van-button class="reply-btn" round @click="showReplyComments"
            >回复 {{ comment.reply_count }}</van-button
          >
        </div>
      </div>
    </van-cell>
    <!-- 评论列表 -->
    <!-- 对于回复用户下面评论的评论 -->
    <van-popup
      v-model="showReply"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ShowReplyComments
        :commentId="comment.com_id"
        :currentReply="comment"
        :showReply.sync="showReply"
      ></ShowReplyComments>
    </van-popup>
    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { likingsComments, delLikingsComments } from '@/api'
import ShowReplyComments from '@/views/ArticleDetail/component/ShowReplyPop.vue'
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: { ShowReplyComments },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      commentsList: [],
      showReply: false
    }
  },
  created () {},
  methods: {
    showReplyComments () {
      this.showReply = true
    },
    onClickLeft () {
      this.showReply = false
    },
    async OngoodJob () {
      let count = this.comment.like_count
      if (this.comment.is_liking) {
        // 此时对评论是点赞的  点击取消点赞
        try {
          await delLikingsComments(this.comment.com_id)
          this.$emit('update:is_liking', !this.comment.is_liking)
          this.$emit('update:like_count', count--)

          this.$toast.success('取消点赞成功')
        } catch (error) {
          this.$toast.fail('取消点赞失败')
        }
      } else {
        // 关注用户
        try {
          await likingsComments(this.comment.com_id)
          this.$emit('update:is_liking', !this.comment.is_liking)

          this.$emit('update:like_count', count++)
          this.$toast.success('点赞成功')
        } catch (error) {
          this.$toast.fail('点赞失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
}
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
