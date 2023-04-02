import Head from 'next/head';
//import { DougLeeCo } from '../components/DougLeeCo';
//import { items } from '../data/items';
import { gql, useQuery } from '@apollo/client'
import type { Item } from '@prisma/client'

const AllItemsQuery = gql`
  query {
    items {
      id
      title
      slug
      description
    }
  }
`



export default function Home() {
  const { data, loading, error } = useQuery(AllItemsQuery)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <div>
      <Head>
        <title>DougLeeCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <ol className="">
          {data.items.map((item: Item) => (
            <li>
              id={item.id} |
              slug={item.slug} |
              title={item.title} |
              description={item.description}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
