const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => entities[char])
}

export function articleContent(html: string | null, markdown: string | null): string {
  if (html?.trim()) return html
  if (markdown?.trim()) return `<pre style="white-space:pre-wrap">${escapeHtml(markdown)}</pre>`
  return '<p>这篇文章暂时没有正文。</p>'
}
