import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "out");

function injectJsonLd(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      injectJsonLd(filePath);
      continue;
    }

    if (file.endsWith(".html")) {
      let html = fs.readFileSync(filePath, "utf8");

      // skip if already has JSON-LD
      if (html.includes('"@context"')) continue;

      // insert JSON-LD before </head>
      const jsonLd = `
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Cyberooms AI",
          "url": "https://ai.cyberooms.com",
          "logo": "https://ai.cyberooms.com/logo.png",
          "sameAs": [
            "https://www.linkedin.com/company/cyberooms",
            "https://twitter.com/cyberooms"
          ]
        }
        </script>`;

      html = html.replace("</head>", `${jsonLd}\n</head>`);
      fs.writeFileSync(filePath, html, "utf8");
      console.log(`✅ Injected JSON-LD into: ${filePath}`);
    }
  }
}

injectJsonLd(outDir);
