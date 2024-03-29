import { ImageContainer, ProductContainer, ProductDetails } from "../styles/pages/product";
import { GetStaticPaths, GetStaticProps } from "next";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";

interface ProductProps {
    product: {
        id: string,
        name: string,
        ImageUrl: string,
        price: string,
        description: string,
        defaultPriceId: string
    }
}

export default function Product({ product }: ProductProps) {

    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

    const handleBuyProduct = async () => {
        try {

            setIsCreatingCheckoutSession(true)

            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId
            })

            const { checkoutUrl } = response.data

            window.location.href = checkoutUrl
        } catch (err) {

            setIsCreatingCheckoutSession(false)

            alert('Falha ao redicionar ao checkout!')
        }
    }

    const { isFallback } = useRouter()

    if (isFallback) {
        return <p>Loading...</p>
    }

    return (
        <>
            <Head>
                <title>{product.name} | Ignite Shop</title>
            </Head>

            <ProductContainer>
                <ImageContainer>
                    <Image src={product.ImageUrl} alt="" width={520} height={480} />
                </ImageContainer>

                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>

                    <p>{product.description}</p>

                    <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
                        Comprar agora
                    </button>
                </ProductDetails>
            </ProductContainer>
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

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id: 'prod_PM3ofRcZ0Tbdia' } }
        ],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }: any) => {

    const productId = params.id

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    })

    const price = product.default_price as Stripe.Price
    const formattedPrice = formatPrice(price.unit_amount);

    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                ImageUrl: product.images[0],
                price: formattedPrice,
                description: product.description,
                defaultPriceId: price.id
            }
        },
        revalidate: 60 * 60 * 1 // 1 hour
    }
}