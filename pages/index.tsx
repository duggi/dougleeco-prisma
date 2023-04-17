import Head from 'next/head';
//import { DougLeeCo } from '../components/DougLeeCo';
//import { items } from '../data/items';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import type { Item } from '@prisma/client';

const AllItemsQuery = gql`
  query allItemsQuery($first: Int, $after: ID) {
    items(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          uuid
          title
          slug
          description
        }
      }
    }
  }
`

export default function Home() {
  const { data, loading, error, fetchMore } = useQuery(AllItemsQuery, {
    variables: { first: 30 },
  });

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const {endCursor, hasNextPage } = data.items.pageInfo;

  return (
    <div>
      <Head>
        <title>DougLeeCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <ol className="">
          {data?.items.edges.map(({ node }: { node: Item }) => (
            <li key={node.id}>
              id={node.id} |
              uuid={node.uuid} |
              slug={node.slug} |
              title={node.title} |
              description={node.description} |
            </li>
          ))}
        </ol>


        {hasNextPage ? (
          <button
            className=""
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.items.edges = [
                    ...prevResult.items.edges,
                    ...fetchMoreResult.items.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            more
          </button>
        ) : (
          <p className="">
            End of results{" "}
          </p>
        )}


      </div>
    </div>
  );
}
