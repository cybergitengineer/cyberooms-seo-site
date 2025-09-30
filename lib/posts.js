import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

const dataPath = path.join(process.cwd(), 'data', 'posts.json')
const contentDir = path.join(process.cwd(), 'content')

export function getAllPosts() {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const posts = JSON.parse(raw)

  return posts.map(p => {
    let html = p.content || ''
    if (p.contentPath) {
      const full = path.join(contentDir, p.contentPath)
      const body = fs.readFileSync(full, 'utf-8')
      // If it's markdown, convert to HTML
      const isMd = /\.md$/i.test(p.contentPath)
      html = isMd ? marked.parse(body) : body
    }
    return {
      title: p.title || 'Untitled',
      slug: p.slug,
      description: p.description || '',
      content: html,
      author: p.author || 'Cyberooms',
      datePublished: p.datePublished || new Date().toISOString().slice(0,10),
      updatedAt: p.updatedAt || p.datePublished || new Date().toISOString().slice(0,10),
      schemaType: p.schemaType || 'Article',
      keywords: p.keywords || []
    }
  })
}

export function getPostBySlug(slug) {
  return getAllPosts().find(p => p.slug === slug) || null
}

export function getAllSlugs() {
  return getAllPosts().map(p => p.slug)
}
