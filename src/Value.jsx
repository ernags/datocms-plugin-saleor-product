import React, { Component } from 'preact-compat';
import PropTypes from 'prop-types';
import cn from 'classname';
import { connect } from 'react-redux';

import Client from './client';
import { fetchProductBySlug } from './store';

@connect((state, props) => {
  const product = state.products[props.value];

  return {
    status: product ? product.status : 'loading',
    product: product && product.result,
  };
})

export default class Value extends Component {
  propTypes = {
    value: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    product: PropTypes.object,
    client: PropTypes.instanceOf(Client).isRequired,
    onReset: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { value } = this.props;
    this.findProduct(value);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (nextProps.value !== value && nextProps.value) {
      this.findProduct(nextProps.value);
    }
  }

  findProduct(slug) {
    const { client, dispatch } = this.props;
    dispatch(fetchProductBySlug(slug, client));
  }

  render() {
    const { onReset, product, status } = this.props;

    return (
      <div className={cn('value', { loading: status === 'loading' })}>
        {
          product
            && (
              <div className="value__product">
                <div
                  className="value__product__image"
                  style={{ backgroundImage: `url(${product.imageUrl})` }}
                />
                <div className="value__product__info">
                  <div className="value__product__title">
                    {product.name}
                  </div>
                  <div className="value__product__product-type">
                    <strong>Product type:</strong>
                    &nbsp;
                    {product.productType.name}
                  </div>
                  <div className="value__product__product-type">
                    <strong>Catgeory:</strong>
                    &nbsp;
                    {product.category.name}
                  </div>
                </div>
              </div>
            )
        }
        <button type="button" className="value__reset" onClick={onReset} />
      </div>
    );
  }
}
