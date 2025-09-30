const fs = require('fs')
const path = require('path')

function loadPosts() {
  const p = path.join(process.cwd(), 'data', 'posts.json')
  const raw = fs.readFileSync(p, 'utf-8')
  return JSON.parse(raw)
}

function genSitemapXml(posts, siteUrl) {
  const urls = [
    `<url><loc>${siteUrl}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    ...posts.map(p => `<url><loc>${siteUrl}/${p.slug}/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}

function main() {
  const siteUrl = (process.env.SITE_URL || 'https://cyberooms.com').replace(/\/$/, '')
  const posts = loadPosts()
  const xml = genSitemapXml(posts, siteUrl)
  const outDir = path.join(process.cwd(), 'public')
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml)
  fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
  console.log('Generated sitemap.xml and robots.txt')
}

main()
