// pages/notion/[slug].js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('content'));
  const paths = files
    .filter(name => name.endsWith('.md'))
    .map(filename => ({
      params: { slug: filename.replace('.md', '') }
    }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params: { slug } }) {
  const filePath = path.join('content', `${slug}.md`);
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(markdown);

  return {
    props: { content, slug },
  };
}

export default function NotionPost({ content, slug }) {
  return (
    <article className="container">
      <h1>{slug.replace(/-/g, ' ')}</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </article>
  );
}
