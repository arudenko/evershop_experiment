import React from 'react';
import PropTypes from 'prop-types';

export function Transactions({ transactions }) {
  let reference = '';
  transactions.forEach((transaction) => {
    if (transaction.paymentAction.toUpperCase() === 'CAPTURE') {
      reference = transaction.paymentReference;
    }
  });

  return (
    <div className="flex justify-between">
      <div className="self-center">
        <span>Payment reference</span>
      </div>
      <div className="self-center">
        <span>{reference}</span>
      </div>
    </div>
  );
}

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      }),
      createdAt: PropTypes.string.isRequired,
      transactionType: PropTypes.string.isRequired,
      paymentAction: PropTypes.string.isRequired
    })
  )
};

Transactions.defaultProps = {
  transactions: []
};
