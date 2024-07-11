import PropTypes from 'prop-types';
import React from 'react';

export function PaymentReference({ reference }) {
  return (
    <div className="summary-row">
      <span>Payment Reference</span>
      <div>
        <div>{reference}</div>
      </div>
    </div>
  );
}

PaymentReference.propTypes = {
  reference: PropTypes.string
};

PaymentReference.defaultProps = {
  reference: undefined
};
