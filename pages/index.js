import Link from 'next/link'
import SEO from '../components/SEO'
import { getAllPosts } from '../lib/posts'

export default function Home({ posts, siteUrl }) {
  const title = 'Cyberooms Knowledge Base'
  const description = 'Static, SEO-friendly pages generated from Notion.'
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": title,
    "url": siteUrl
  }

  return (
    <div className="container">
      <SEO title={title} description={description} url={siteUrl} type="website" jsonLd={jsonLd} />
      <div className="site-title">{title}</div>
      <p className="meta">{description}</p>
      <hr />
      {posts.map(p => (
        <article key={p.slug} className="card">
          <h2><Link href={`/${p.slug}`}>{p.title}</Link></h2>
          <p className="meta">
            <time dateTime={p.datePublished}>{p.datePublished}</time> · {p.author}
          </p>
          <p>{p.description}</p>
          <Link href={`/${p.slug}`}>Read more →</Link>
        </article>
      ))}
      <footer>© {new Date().getFullYear()} Cyberooms</footer>
    </div>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  const siteUrl = process.env.SITE_URL || 'https://cyberooms.com'
  return { props: { posts, siteUrl } }
}
