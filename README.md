# 者之梦博客微信小程序

微信原生 TypeScript 小程序，共用现有 Blog GraphQL API。首版提供公开文章列表、下拉刷新、分页加载、文章详情、富文本阅读和微信分享。

## 技术栈

- 微信原生小程序
- TypeScript
- GraphQL over `wx.request`
- `mp-html` 2.5.2

文章详情优先渲染 API 已生成的 `html` 字段；这样 Markdown 只在服务端转换一次，小程序无需携带 Markdown 解析器。若旧文章只有 `md`，页面会安全地以预格式化文本降级显示。

## 本地开发

需要 Node.js 22+ 和微信开发者工具。

```bash
npm install
npm run typecheck
```

然后使用微信开发者工具导入仓库根目录，执行“工具 → 构建 npm”，再编译运行。

项目沿用原 `blogTaro` 中公开的 AppID。如需改用新的小程序，在 `project.config.json` 中替换 `appid`。

## API 与域名

公开 GraphQL 地址配置在 `miniprogram/config/api.ts`：

```text
https://zhedream-blog-api-preview.vercel.app/api/graphql
```

这不是把小程序部署到 Vercel；小程序代码仍由微信发布，只是访问现有的 Vercel Blog API。正式真机访问前，需要在微信公众平台把以下域名加入 **request 合法域名**：

```text
https://zhedream-blog-api-preview.vercel.app
```

## CI

GitHub Actions 在推送和 Pull Request 时安装依赖并执行 TypeScript 检查，不会自动上传或发布微信小程序。
