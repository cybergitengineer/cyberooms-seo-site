import 'github-markdown-css/github-markdown.css';
import '../styles/globals.css'; // your site’s default CSS
import '../styles/markdown.css'; // if you create a custom one
import '../styles/globals.css'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XGDEVCP0BH"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XGDEVCP0BH');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  )
}
