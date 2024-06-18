import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import ProgressBar from 'nextjs-progressbar';
import { ToastContainer } from 'react-toastify';

// Components.
import Layout from '@/components/layout';
import theme from '@/theme';
import '../theme/fonts.css';
import '../theme/globals.css';

// Libraries CSS.
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>/sammwy/ - ପ(๑•ᴗ•๑)ଓ ♡</title>
        <meta name="description" content="This is just an example" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
        <script async src="/assets/vendor/oneko/oneko.js"></script>
      </Head>

      {process.env.NODE_ENV === 'production' && <Analytics />}
      <ToastContainer />
      <ProgressBar
        color="#BB86FC"
        startPosition={0.5}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
