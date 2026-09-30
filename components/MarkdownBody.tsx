import ReactMarkdown from "react-markdown";

export function MarkdownBody({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className="markdown text-ink">
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
