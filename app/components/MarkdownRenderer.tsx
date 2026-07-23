import { useState, Children } from 'react';
import ReactMarkdown from 'react-markdown';

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const getCodeText = (node: any): string => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (node.props && node.props.children) {
      if (Array.isArray(node.props.children)) {
        return node.props.children.map(getCodeText).join("");
      }
      return getCodeText(node.props.children);
    }
    if (Array.isArray(node)) {
      return node.map(getCodeText).join("");
    }
    return "";
  };

  const handleCopy = () => {
    const text = getCodeText(children);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3">
      <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-200 border border-hairline font-mono text-sm leading-relaxed">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded border border-hairline bg-white/90 px-2 py-1 text-[11px] font-medium text-slate-600 opacity-0 transition-all duration-200 hover:bg-slate-50 hover:text-ink hover:shadow-sm group-hover:opacity-100 focus:opacity-100 focus:outline-none dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700 pointer-events-auto"
        type="button"
        aria-label="Copy code"
      >
        {copied ? (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L100,192.69,218.34,74.34a8,8,0,0,1,11.32,11.32Z"/>
            </svg>
            Copied!
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
              <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/>
            </svg>
            Copy
          </span>
        )}
      </button>
    </div>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
        code: ({ children, className }) => {
          const isInline = !className;
          return isInline ? (
            <code className='rounded bg-slate-100 border border-hairline px-1.5 py-0.5 text-sm text-slate-800 dark:bg-slate-900 dark:text-slate-200'>
              {children}
            </code>
          ) : (
            <code className={className}>{children}</code>
          );
        },
        strong: ({ children }) => (
          <strong className='font-semibold text-slate-800 dark:text-slate-200'>{children}</strong>
        ),
        em: ({ children }) => <em className='italic text-slate-700 dark:text-slate-300'>{children}</em>,
        p: ({ children }) => (
          <p className='mb-2 text-slate-800 last:mb-0 dark:text-slate-200 [.list-inside_&]:inline'>
            {children}
          </p>
        ),
        li: ({ children }) => <li className='text-slate-800 dark:text-slate-200'>{children}</li>,
        ol: ({ children }) => (
          <ol className='list-inside list-decimal space-y-1 text-slate-800 dark:text-slate-200'>
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className='list-inside list-disc space-y-1 text-slate-800 dark:text-slate-200'>
            {children}
          </ul>
        ),
        h1: ({ children }) => (
          <h1 className='mb-2 text-xl font-bold text-slate-900 dark:text-slate-200'>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className='mb-2 text-lg font-bold text-slate-900 dark:text-slate-200'>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className='mb-1 text-base font-semibold text-slate-900 dark:text-slate-200'>{children}</h3>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
