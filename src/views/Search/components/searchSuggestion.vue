<template>
  <div class="searchSuggestion-container">
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="resultShow(item, index)"
    >
      <template #icon>
        <van-icon name="search" class="search-icon"></van-icon>
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggestion } from '@/api'
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
      suggestions: []
    }
  },
  methods: {
    async getSearchSuggestion () {
      try {
        const res = await getSearchSuggestion(this.keywords)
        console.log(res)
        this.suggestions = res.data.data.options.filter(Boolean)
      } catch (err) {
        console.log(err)
      }
    },
    resultShow (item, index) {
      // 将点击的搜索建议传给父组件
      this.$emit('resultShow', this.suggestions[index])
    }
  },
  created () {},
  mounted () {},
  watch: {
    keywords: {
      immediate: true,
      handler () {
        this.getSearchSuggestion()
      }
    }
  },
  computed: {
    // 对原数组筛选
    highlightData () {
      const reg = new RegExp(this.keywords, 'gi')
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style='color:red'>${match}</span>`)
      )
    }
  },
  components: {}
}
</script>
<style scoped lang="less">
.searchSuggestion-container {
  /deep/.van-icon {
    padding-top: 8px;
    padding-right: 6px;
  }
}
</style>
