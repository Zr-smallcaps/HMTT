<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="articleLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.aut_name">
        <!-- 文章标题 -->
        <h1 class="article-title">这是文章标题</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
            ref="article_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate }}</div>
          <van-button
            class="follow-btn"
            :type="article.is_followed ? 'default' : 'info'"
            color="#3296fa"
            round
            size="small"
            :icon="article.is_followed ? '' : 'plus'"
            @click="followingUser"
            >{{ article.is_followed ? '已关注' : '关注' }}</van-button
          >
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <van-list
          offset="100"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <CommentItem
            v-for="(comment, index) in commentsList"
            :key="index"
            class="comments-container"
            :comment="comment"
            :is_liking.sync="comment.is_liking"
            :like_count.sync="comment.like_count"
          ></CommentItem>
        </van-list>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="reload">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="showPop"
        >写评论</van-button
      >
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '20%' }"
        class="pop-container"
      >
        <van-field
          class="pop-text"
          v-model.trim="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <div class="publish-text" @click="publishComments">发布</div>
      </van-popup>
      <van-icon name="comment-o" :info="article.comm_count" color="#777" />
      <!-- 收藏 -->
      <van-icon
        color="#ffa500"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="whetherCollect"
        :loading="loading"
      />
      <!-- 点赞 -->
      <van-icon
        color="#777"
        :name="article.attitude ? 'good-job' : 'good-job-o'"
        @click="likingsArticles"
        :loading="loading"
      />
      <!-- 分享 -->
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import CommentItem from '@/views/ArticleDetail/component/CommentItem.vue'
import {
  getArticlesComments,
  followingUser,
  unFollowingUser,
  likingsArticles,
  unLikingsArticles
} from '@/api'

import {
  getArticlesById,
  addArticlescollections,
  delectArticlescollections,
  addArticlesComments
} from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: { CommentItem },
  props: {},
  data () {
    return {
      article: {},
      loading: false,
      errorStatus: 0, // 失败的状态码
      articleId: this.$route.params.articleId,
      show: false,
      message: '',
      commentsList: [],
      lastId: 0,
      finished: false,
      articleLoading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
    this.getArticlesComments()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      try {
        const {
          data: { data }
        } = await getArticlesById(this.$route.params.articleId)
        this.article = data
        setTimeout(() => {
          this.previewImage()
        })
        this.articleLoading = false
        console.log('data', data)
      } catch (err) {
        // console.log(err)
        this.articleLoading = false
        console.log('获取数据失败', err)
        if (err.response.status === 404) {
          this.errorStatus = 404
        }
      }
    },
    onClickLeft () {
      this.$router.back()
    },
    async whetherCollect () {
      if (this.article.is_collected) {
        try {
          // 此文章已经收藏，此时点击要取消收藏
          await delectArticlescollections(this.article.art_id)
          this.article.is_collected = false
        } catch (error) {
          this.$toast.fail('取消收藏失败')
        }
      } else {
        // 对此收藏
        try {
          await addArticlescollections(this.article.art_id)
          this.article.is_collected = true
        } catch (error) {
          this.$toast.fail('收藏失败')
          console.log('收藏失败')
        }
      }
      this.loading = false
    },
    showPop () {
      this.show = true
    },
    async publishComments () {
      if (this.message) {
        try {
          const {
            data: { data }
          } = await addArticlesComments(this.article.art_id, this.message)
          this.commentsList.unshift(data.new_obj)
          this.article.comm_count++
          this.$toast('发表评论成功')
          this.show = false
          this.message = ''
        } catch (err) {
          this.$toast.fail('发表评论失败')
        }
      } else {
        this.$toast.fail('评论内容不能为空')
      }
    },
    async reload () {
      await this.loadArticle()
    },
    // 获取文章的评论
    async getArticlesComments () {
      try {
        const {
          data: { data }
        } = await getArticlesComments({
          type: 'a',
          source: this.articleId,
          limit: 3
        })
        this.commentsList = data.results
        // 获取返回数据的最后一条评论id
        this.lastId = data.last_id
        console.log('data', data)
      } catch (error) {
        console.log(error)
      }
    },
    // onLoad事件触发了在次获取评论
    async onLoad () {
      const {
        data: { data }
      } = await getArticlesComments({
        type: 'a',
        source: this.articleId,
        last_id: this.lastId,
        limit: 3
      })
      this.commentsList.unshift(...data.results)
      this.lastId = data.last_id
      if (!this.lastId) {
        this.finished = true
      }
      this.loading = false
    },
    async followingUser () {
      if (this.article.is_followed) {
        // 此时是关注的  点击取消关注
        try {
          await unFollowingUser(this.article.aut_id)
          this.article.is_followed = false
          this.$toast.success('取消关注成功')
        } catch (error) {
          this.$toast.fail('取消关注失败')
        }
      } else {
        // 关注用户
        try {
          await followingUser(this.article.aut_id)
          this.article.is_followed = true
          this.$toast.success('关注成功')
        } catch (error) {
          this.$toast.fail('关注失败')
        }
      }
    },
    previewImage () {
      const articleContent = this.$refs['article-content']
      // 将内容当中的照片全部选中
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      // 将图片中的地址全部添加到images数组当中
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个照片绑定点击事件
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: index
          })
        }
      })
    },
    // 对此文章点赞
    async likingsArticles () {
      if (this.article.attitude) {
        // 取消点赞
        try {
          await unLikingsArticles(this.article.art_id)
          this.article.attitude = false
          this.$toast.success('取消点赞成功')
        } catch (error) {
          this.$toast.fail('取消点赞失败')
        }
      } else {
        // 点赞
        try {
          await likingsArticles(this.article.art_id)
          this.article.attitude = true
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
.article-container {
  .main-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      font-size: 15px;
      width: 675px;
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
      .markdown-body {
        word-wrap: break-word;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 0;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .comments-container {
    position: unset;
  }
  /deep/.active {
    background-color: pink;
  }
  .pop-container {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    .pop-text {
      width: 80%;
      background-color: #f5f7f9;
    }
    .publish-text {
      margin-left: 20px;
      font-size: 17px;
      color: dodgerblue;
    }
  }
}
</style>
