// Renders Akeel's assistant messages (which come back as markdown, e.g. **bold**, lists) as
// actual HTML instead of showing the raw syntax. `marked` HTML-escapes source text by default,
// so this is safe against injection from the model's own output — only ever call this for
// assistant messages, never for raw user input.
import { marked } from 'marked'

marked.setOptions({ breaks: true })

export function useMarkdown() {
  const renderMarkdown = (text: string) => marked.parse(text ?? '', { async: false }) as string
  return { renderMarkdown }
}
