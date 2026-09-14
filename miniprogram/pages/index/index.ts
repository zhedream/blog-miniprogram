import { getArticles } from '../../services/articles'
import type { ArticleSummary } from '../../types/article'
import { formatDate } from '../../utils/date'

const PAGE_SIZE = 10

interface ArticleView extends ArticleSummary {
  dateText: string
  tagText: string
}

Page({
  data: {
    articles: [] as ArticleView[],
    loading: false,
    refreshing: false,
    hasMore: true,
    error: '',
  },

  onLoad() {
    void this.loadArticles(true)
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true })
    void this.loadArticles(true)
  },

  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      void this.loadArticles(false)
    }
  },

  onShareAppMessage() {
    return {
      title: '者之梦',
      path: '/pages/index/index',
    }
  },

  retry() {
    void this.loadArticles(this.data.articles.length === 0)
  },

  openArticle(event: WechatMiniprogram.BaseEvent) {
    const id = String(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/article/index?id=${encodeURIComponent(id)}`,
    })
  },

  async loadArticles(reset: boolean) {
    if (this.data.loading) return

    const skip = reset ? 0 : this.data.articles.length
    this.setData({ loading: true, error: '' })

    try {
      const result = await getArticles(skip, PAGE_SIZE)
      const incoming: ArticleView[] = result.nodes.map((article) => ({
        ...article,
        dateText: formatDate(article.createdAt),
        tagText: article.tags.map((tag) => tag.name).filter(Boolean).join(' · '),
      }))
      const articles = reset ? incoming : [...this.data.articles, ...incoming]

      this.setData({
        articles,
        hasMore: articles.length < result.aggregate.count,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '文章加载失败'
      this.setData({ error: message })
    } finally {
      this.setData({ loading: false, refreshing: false })
      wx.stopPullDownRefresh()
    }
  },
})
