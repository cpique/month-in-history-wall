import Markdown from "react-markdown";

const allowedElements = [
  "p",
  "a",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
];

const components = {
  a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-semibold underline underline-offset-4"
      rel="noreferrer"
      target="_blank"
      {...props}
    />
  ),
  blockquote: ({ ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-2 border-[var(--border-primary)] pl-4 italic text-[var(--text-muted)]"
      {...props}
    />
  ),
  h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-6 text-2xl font-semibold" {...props} />
  ),
  h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-5 text-xl font-semibold" {...props} />
  ),
  h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-4 text-lg font-semibold" {...props} />
  ),
  h4: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-4 text-base font-semibold" {...props} />
  ),
  li: ({ ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="ml-5 list-disc" {...props} />
  ),
  ol: ({ ...props }: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="grid gap-2" {...props} />
  ),
  p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base leading-7 text-[var(--text-secondary)]" {...props} />
  ),
  strong: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-[var(--text-primary)]" {...props} />
  ),
  ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="grid gap-2" {...props} />
  ),
};

export function EventDetailMarkdown({ children }: { children: string }) {
  return (
    <div className="grid gap-4">
      <Markdown allowedElements={allowedElements} components={components}>
        {children}
      </Markdown>
    </div>
  );
}
