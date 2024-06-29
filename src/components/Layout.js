import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Call Analysis Tool</title>
        <meta name="description" content="Analyze your sales calls" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {children}
      </main>
    </>
  );
}