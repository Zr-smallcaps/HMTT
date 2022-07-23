<template>
  <div>
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="$router.back()"
        @focus="visibleSearchSuggestion"
        background="#3296fa"
        class="search"
      />
    </form>

    <component
      :is="componentName"
      :keywords="keywords"
      @item="Item"
      :search-historys="searchHistorys"
      @search="onSearch"
      @allDelte="searchHistorys = []"
      @delOneHistory="delOneHistory"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/searchHistory'
import SearchResult from './components/searchResult.vue'
import SearchSuggestion from './components/searchSuggestion.vue'
import { get, set } from '@/utils/storage'
export default {
  name: 'Search',
  data () {
    return {
      keywords: '',
      isShowSearchResult: false,
      searchHistorys: get('TOUTIAO_LISHI') || []
    }
  },
  methods: {
    onSearch (val) {
      this.isShowSearchResult = true
      this.keywords = val
      const index = this.searchHistorys.indeOf(val)
      if (index !== 1) {
        this.searchHistorys.splice(index, 1)
      }
      this.searchHistorys.unshift(val)
    },
    visibleSearchSuggestion () {
      this.isShowSearchResult = false
    },
    Item (val) {
      this.keywords = val
    },
    delOneHistory (index) {
      this.searchHistorys.splice(index, 1)
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
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
  watch: {
    searchHistorys (val) {
      set('TOUTIAO_LISHI', val)
    }
  }
}
</script>

<style></style>
