<template>
  <div class="">
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="visableSearchSuggestion"
        background="#3296fa"
      />
    </form>
    <!-- 搜索结果、历史、建议 -->
    <component
      :is="componentName"
      :keywords="keywords"
      @resultShow="resultShow"
    ></component>
  </div>
</template>
<script>
import SearchHistory from '@/views/Search/components/searchHistory'
import SearchResult from '@/views/Search/components/searchResult'
import SearchSuggestion from '@/views/Search/components/searchSuggestion'
export default {
  name: 'index',
  props: {},
  data () {
    return {
      keywords: '',
      isShowSearchResult: false
    }
  },
  methods: {
    onSearch () {
      this.isShowSearchResult = true
      this.$store.commit('setData', this.keywords)
    },
    onCancel () {
      this.$router.go(-1)
    },
    visableSearchSuggestion () {
      return (this.isShowSearchResult = false)
    },
    resultShow (val) {
      /* const reg1 = /<span style='color:red'>/gi
      const reg2 = /<\/span>/gi
      val = val.replace(reg1, '').replace(reg2, '') */
      this.$store.commit('setData', val)
      this.keywords = val
      this.isShowSearchResult = true
    }
  },
  created () {},
  mounted () {},
  watch: {},
  computed: {
    componentName () {
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  }
}
</script>
<style scoped lang="less"></style>
