import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        pre: ({ children }) => (
          <pre className='overflow-x-auto rounded-lg bg-slate-300 p-4 dark:bg-slate-900'>
            {children}
          </pre>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          return isInline ? (
            <code className='rounded bg-slate-300 px-1.5 py-0.5 text-sm text-slate-800 dark:bg-slate-900 dark:text-slate-200'>
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
          <p className='mb-2 text-slate-800 last:mb-0 dark:text-slate-200'>{children}</p>
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
