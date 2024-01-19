import { HomeContainer, Product } from "./styles/pages/home"

import Image from 'next/image'

import Head from 'next/head'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { stripe } from "./lib/stripe"
import { GetStaticProps } from "next"
import Stripe from "stripe"
import Link from "next/link"

interface HomeProps {
  products: {
    id: string,
    name: string,
    ImageUrl: string,
    price: string
  }[]
}

export default function Home({ products }: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })

  return (
    <>

      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">

        {products.map((product) => {
          return (
            <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
              <Product key={product.id} className="keen-slider__slide">
                <Image src={product.ImageUrl} alt="" width={520} height={480} />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          )
        })}
      </HomeContainer>
    </>
  )
}

const formatPrice = (unitAmount: number | null): string => {
  if (unitAmount !== null) {
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(unitAmount / 100);
  }

  return "Valor indisponível";
};

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {

    const price = product.default_price as Stripe.Price
    const formattedPrice = formatPrice(price.unit_amount);

    return {
      id: product.id,
      name: product.name,
      ImageUrl: product.images[0],
      price: formattedPrice,
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2 // 2 horas
  }
}

