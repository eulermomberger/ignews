import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home ({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get accews to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton/>
        </section>

        <Image src="/images/avatar.svg" alt="Girl coding" width={366} height={521} />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LNR1aCm2XbIatseA69ZPn7G');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  };
}
