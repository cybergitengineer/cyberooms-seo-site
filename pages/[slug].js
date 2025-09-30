import SEO from '../components/SEO'
import { getAllSlugs, getPostBySlug } from '../lib/posts'

export default function PostPage({ post, siteUrl }) {
  if (!post) return <div className="container">Not found</div>
  const url = `${siteUrl.replace(/\/$/, '')}/${post.slug}/`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.schemaType || "Article",
    "headline": post.title,
    "author": { "@type": "Person", "name": post.author || "Cyberooms" },
    "datePublished": post.datePublished,
    "dateModified": post.updatedAt || post.datePublished,
    "description": post.description,
    "mainEntityOfPage": url
  }
  return (
    <div className="container">
      <SEO title={post.title} description={post.description} url={url} type="article" jsonLd={jsonLd} />
      <h1 className="site-title">{post.title}</h1>
      <p className="meta">
        <time dateTime={post.datePublished}>{post.datePublished}</time> · {post.author}
      </p>
      <hr />
      <article dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}

export async function getStaticPaths() {
  const slugs = getAllSlugs()
  const paths = slugs.map(slug => ({ params: { slug } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug) || null
  const siteUrl = process.env.SITE_URL || 'https://cyberooms.com'
  return { props: { post, siteUrl } }
}
