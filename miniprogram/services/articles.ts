import type { ArticleDetail, ArticleSummary } from '../types/article'
import { graphqlRequest } from './graphql'

const ARTICLE_LIST_QUERY = `
  query MiniProgramArticles($skip: Int!, $first: Int!) {
    articlesConnection(
      where: { isPublished: true }
      orderBy: { createdAt: desc }
      skip: $skip
      first: $first
    ) {
      aggregate { count }
      nodes {
        id
        title
        desc
        createdAt
        type { id name }
        tags { id name }
      }
    }
  }
`

const ARTICLE_DETAIL_QUERY = `
  query MiniProgramArticle($id: ID!) {
    article(where: { id: $id }) {
      id
      title
      desc
      md
      html
      createdAt
      updatedAt
      clickCount
      type { id name }
      tags { id name }
    }
  }
`

interface ArticleListData {
  articlesConnection: {
    aggregate: { count: number }
    nodes: ArticleSummary[]
  }
}

interface ArticleDetailData {
  article: ArticleDetail | null
}

export async function getArticles(skip: number, first: number) {
  return (
    await graphqlRequest<ArticleListData, { skip: number; first: number }>(
      ARTICLE_LIST_QUERY,
      { skip, first },
    )
  ).articlesConnection
}

export async function getArticle(id: string) {
  return (
    await graphqlRequest<ArticleDetailData, { id: string }>(
      ARTICLE_DETAIL_QUERY,
      { id },
    )
  ).article
}
