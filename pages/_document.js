import Document, { Html, Head, Main, NextScript } from "next/document";

const PUBLIC_URL = process.env.PUBLIC_URL;

export default function CustomDocument() {
  return (
    <Html>
      <Head>
        <meta name="title" content="Planner JS" />
        <meta
          name="description"
          content="Lightweight, interactive planner. Visualize tasks using an HTML canvas."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={PUBLIC_URL} />
        <meta property="og:title" content="Planner JS" />
        <meta
          property="og:description"
          content="Lightweight, interactive planner. Visualize tasks using an HTML canvas."
        />
        <meta
          property="og:image"
          content={`${PUBLIC_URL}/static/meta-image.png`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${PUBLIC_URL}`} />
        <meta property="twitter:title" content="Planner JS" />
        <meta
          property="twitter:description"
          content="Lightweight, interactive planner. Visualize tasks using an HTML canvas."
        />
        <meta
          property="twitter:image"
          content={`${PUBLIC_URL}/static/meta-image.png`}
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${PUBLIC_URL}/static/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${PUBLIC_URL}/static/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${PUBLIC_URL}/static/favicon-16x16.png`}
        />

        <link rel="icon" href={`${PUBLIC_URL}/static/favicon.ico`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}