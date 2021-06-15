import Store, { thunk } from 'repatch';
import produce from 'immer';

const initialState = {
  query: null,
  products: {},
  searches: {},
};

const store = new Store(initialState).addMiddleware(thunk);
const act = producer => state => produce(state, producer);

/* eslint-disable no-param-reassign */

export const fetchProductBySlug = (slug, client) => () => (dispatch) => {
  dispatch(act((state) => {
    state.products[slug] = state.products[slug] || { result: null };
    state.products[slug].status = 'loading';
  }));

  return client.productBySlug(slug)
    .then((product) => {
      dispatch(act((state) => {
        state.products[slug].result = product;
        state.products[slug].status = 'success';
      }));
    });
};

export const fetchProductsMatching = (query, client) => () => (dispatch) => {
  dispatch(act((state) => {
    state.searches[query] = state.searches[query] || { result: [] };
    state.searches[query].status = 'loading';
    state.query = query;
  }));

  return client.productsMatching(query)
    .then((products) => {
      dispatch(act((state) => {
        state.searches[query].status = 'success';
        state.searches[query].result = products.map(p => p.slug);
        products.forEach((product) => {
          state.products[product.slug] = state.products[product.slug] || {};
          state.products[product.slug].result = product;
        });
      }));
    });
};

export default store;
