import Head from 'next/head';
import { DougLeeCo } from '../components/DougLeeCo';
import { items } from '../data/items';

export default function Home() {
  return (
    <div>
      <Head>
        <title>DougLeeCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <ul className="">
          {items.map((item) => (
            <DougLeeCo
              key={item.id}
              id={item.id}
              slug={item.slug}
              title={item.title}
              description={item.description}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
