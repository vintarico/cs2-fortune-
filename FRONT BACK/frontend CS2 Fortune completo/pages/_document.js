import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta Tags Essenciais */}
        <meta charSet="UTF-8" />
        <meta name="description" content="CS2 Fortune - A melhor plataforma de casos CS2 do Brasil. Abra caixas, ganhe skins raras e saque instantaneamente!" />
        <meta name="keywords" content="CS2, Counter-Strike 2, casos, skins, fortune, caixas, AWP, facas, luvas" />
        <meta name="author" content="CS2 Fortune" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cs2fortune.com/" />
        <meta property="og:title" content="CS2 Fortune - Abra Casos e Ganhe Skins Raras" />
        <meta property="og:description" content="A maior plataforma de casos CS2 do Brasil. Saques instantâneos, skins exclusivas e bônus diários!" />
        <meta property="og:image" content="/images/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cs2fortune.com/" />
        <meta property="twitter:title" content="CS2 Fortune - Abra Casos e Ganhe Skins Raras" />
        <meta property="twitter:description" content="A maior plataforma de casos CS2 do Brasil. Saques instantâneos!" />
        <meta property="twitter:image" content="/images/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Fonts (opcional - Google Fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* Theme Color */}
        <meta name="theme-color" content="#a855f7" />
      </Head>
      <body className="bg-gray-900 text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
