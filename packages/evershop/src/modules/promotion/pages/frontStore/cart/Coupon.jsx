import PropTypes from 'prop-types';
import React from 'react';

export default function CouponForm() {
  return (
    <div className="mt-16" />
  );
}

CouponForm.propTypes = {
  cart: PropTypes.shape({
    applyCouponApi: PropTypes.string.isRequired
  }).isRequired
};

export const layout = {
  areaId: 'shoppingCartLeft',
  sortOrder: 20
};

export const query = `
  query Query {
    cart {
      applyCouponApi
    }
  }
`;
