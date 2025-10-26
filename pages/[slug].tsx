import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('content'))
  const paths = files
    .filter(name => name.endsWith('.md'))
    .map(filename => ({
      params: { slug: filename.replace('.md', '') },
    }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params: { slug } }) {
  const markdownFile = fs.readFileSync(
    path.join('content', slug + '.md'),
    'utf-8'
  )
  const { data: frontmatter, content } = matter(markdownFile)
  return { props: { frontmatter, content } }
}

export default function PostPage({ frontmatter, content }) {
  return (
    <main className="container">
      <h1>{frontmatter.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </main>
  )
}
