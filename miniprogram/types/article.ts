export interface NamedEntity {
  id: string
  name: string | null
}

export interface ArticleSummary {
  id: string
  title: string
  desc: string | null
  createdAt: string
  type: NamedEntity | null
  tags: NamedEntity[]
}

export interface ArticleDetail extends ArticleSummary {
  md: string | null
  html: string | null
  updatedAt: string
  clickCount: number
}
