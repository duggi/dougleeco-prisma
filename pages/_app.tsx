import "@/styles/dlco-admin.css"
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Layout from '@/components/layout'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '@/lib/apollo'
import type { AppProps } from 'next/app'



function DlcoAdminApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </UserProvider>
  );
}

export default DlcoAdminApp;
