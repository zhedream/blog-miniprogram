import { getArticle } from '../../services/articles'
import { articleContent } from '../../utils/html'
import { formatDate } from '../../utils/date'

Page({
  data: {
    id: '',
    title: '',
    description: '',
    content: '',
    dateText: '',
    category: '',
    tagText: '',
    loading: true,
    error: '',
  },

  onLoad(options: Record<string, string | undefined>) {
    const id = options.id ? decodeURIComponent(options.id) : ''
    if (!id) {
      this.setData({ loading: false, error: '缺少文章编号' })
      return
    }

    this.setData({ id })
    void this.loadArticle()
  },

  onShareAppMessage() {
    return {
      title: this.data.title || '者之梦',
      path: `/pages/article/index?id=${encodeURIComponent(this.data.id)}`,
    }
  },

  onShareTimeline() {
    return {
      title: this.data.title || '者之梦',
      query: `id=${encodeURIComponent(this.data.id)}`,
    }
  },

  retry() {
    void this.loadArticle()
  },

  async loadArticle() {
    this.setData({ loading: true, error: '' })

    try {
      const article = await getArticle(this.data.id)
      if (!article) {
        this.setData({ error: '文章不存在或尚未公开' })
        return
      }

      this.setData({
        title: article.title,
        description: article.desc || '',
        content: articleContent(article.html, article.md),
        dateText: formatDate(article.createdAt),
        category: article.type?.name || '',
        tagText: article.tags.map((tag) => tag.name).filter(Boolean).join(' · '),
      })
      wx.setNavigationBarTitle({ title: article.title })
    } catch (error) {
      const message = error instanceof Error ? error.message : '文章加载失败'
      this.setData({ error: message })
    } finally {
      this.setData({ loading: false })
    }
  },
})
