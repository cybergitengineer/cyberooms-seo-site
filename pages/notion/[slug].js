import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";

export default function NotionPost({ post }) {
  if (!post) return <div className="container">Post not found.</div>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description || ""} />
      </Head>
      <div className="container">
        <h1>{post.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), "content"));
  const paths = files.map((file) => ({
    params: { slug: file.replace(/\.md$/, "") },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "content", `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  return {
    props: {
      post: {
        ...data,
        title: data.title || params.slug,
        content: content.replace(/\n/g, "<br />"),
      },
    },
  };
}
