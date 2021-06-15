const productFragment = `
  id
  slug
  name
  category {
    name
  }
  productType {
    name
  }
  thumbnail(size: 340) {
    url
    alt
  }
`;

const normalizeProduct = product => (
  Object.assign(
    product,
    {
      imageUrl: product.thumbnail.url,
    },
  )
);

const normalizeProducts = products => (
  products.edges.map(({ node }) => normalizeProduct(node))
);

export default class SaleorClient {
  constructor({ saleorApiUrl }) {
    this.saleorApiUrl = saleorApiUrl;
  }

  productsMatching(search) {
    return this.fetch({
      query: `
        query getProducts($search: String) {
          products(first: 3, filter: { search: $search }, channel: "default-channel") {
            edges {
              node {
                ${productFragment}
              }
            }
          }
        }
      `,
      variables: { search: search || null },
    }).then(result => normalizeProducts(result.products));
  }

  productBySlug(slug) {
    return this.fetch({
      query: `
        query getProduct($slug: String!) {
          product(slug: $slug, channel: "default-channel") {
            ${productFragment}
          }
        }
      `,
      variables: { slug },
    }).then(result => normalizeProduct(result.product));
  }

  fetch(body) {
    return fetch(
      `${this.saleorApiUrl}/graphql/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )
      .then(res => res.json())
      .then(res => res.data);
  }
}
