<template>
  <div class="">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in resultList"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>
<script>
import { getSearchRusult } from '@/api/search'
export default {
  name: 'SearchHistory',
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      resultList: [], // 搜索结果数组
      page: 1,
      per_page: 15,
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    async getSearch () {
      const { data } = await getSearchRusult(this.keywords)
      this.resultList = data.data.results
    },
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchRusult({
          page: this.page,
          per_page: this.perPage,
          q: this.keywords
        })
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.resultList.push(...results)
        this.loading = false
        // 4. 判断数据是否加载完毕
        if (results.length) {
          this.page++ // 更新获取下一页数据的页码
        } else {
          this.finished = true // 没有数据了，将加载状态设置结束，不再 onLoad
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  created () {
    this.getSearch()
  },
  mounted () {},
  watch: {},
  computed: {},
  components: {}
}
</script>
<style scoped lang="less"></style>
