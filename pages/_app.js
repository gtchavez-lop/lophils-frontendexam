import { PrefetcherWrapper } from '../components/Prefetcher';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PrefetcherWrapper>
        <section className="flex justify-center">
          <main className="w-full hidden lg:block max-w-5xl px-10 lg:px-0 select-none pb-32">
            <Component {...pageProps} />
          </main>
        </section>

        {/* show not available on tablets and mobile */}
        <main className="w-full lg:hidden max-w-5xl px-10 lg:px-0 select-none pb-32 flex justify-center items-center h-screen">
          <p className="text-center text-gray-500">
            Not available on tablets and mobile.
          </p>
        </main>
      </PrefetcherWrapper>
    </>
  );
}

export default MyApp;
