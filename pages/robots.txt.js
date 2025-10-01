// pages/robots.txt.js
export async function getServerSideProps({ res }) {
  const body = `User-agent: *
Allow: /

Sitemap: https://ai.cyberooms.com/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=600"); // cache at the edge 10 min
  res.write(body);
  res.end();

  return { props: {} };
}

export default function Robots() {
  return null; // never rendered; response sent above
}
