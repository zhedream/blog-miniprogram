import { GRAPHQL_ENDPOINT } from '../config/api'

interface GraphQLError {
  message: string
}

interface GraphQLResponse<T> {
  data?: T
  errors?: GraphQLError[]
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export function graphqlRequest<TData, TVariables extends object = Record<string, never>>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  return new Promise((resolve, reject) => {
    wx.request<GraphQLResponse<TData>>({
      url: GRAPHQL_ENDPOINT,
      method: 'POST',
      timeout: 15000,
      header: {
        'content-type': 'application/json',
      },
      data: {
        query,
        variables: variables ?? {},
      },
      success(response) {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new ApiError(`请求失败（${response.statusCode}）`))
          return
        }

        const firstError = response.data.errors?.[0]
        if (firstError) {
          reject(new ApiError(firstError.message))
          return
        }

        if (!response.data.data) {
          reject(new ApiError('接口没有返回数据'))
          return
        }

        resolve(response.data.data)
      },
      fail(error) {
        reject(new ApiError(error.errMsg || '网络连接失败'))
      },
    })
  })
}
