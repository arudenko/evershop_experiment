import PropTypes from 'prop-types';
import React from 'react';
import { Subtotal } from '@components/frontStore/checkout/success/summary/order/Subtotal';
import { Total } from '@components/frontStore/checkout/success/summary/order/Total';

function OrderSummary({
  items,
  subTotal,
  subTotalInclTax,
  grandTotal,
  displayCheckoutPriceIncludeTax
}) {
  return (
    <div className="checkout-summary-block">
      <Subtotal
        count={items.length}
        total={
          displayCheckoutPriceIncludeTax ? subTotalInclTax.text : subTotal.text
        }
      />
      <Total
        total={grandTotal.text}
        displayCheckoutPriceIncludeTax={displayCheckoutPriceIncludeTax}
      />
    </div>
  );
}

OrderSummary.propTypes = {
  discountAmount: PropTypes.shape({
    text: PropTypes.string.isRequired
  }),
  grandTotal: PropTypes.shape({
    text: PropTypes.string.isRequired
  }),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.shape({
        text: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  shippingFeeInclTax: PropTypes.shape({
    text: PropTypes.string.isRequired
  }),
  subTotal: PropTypes.shape({
    text: PropTypes.string
  }),
  subTotalInclTax: PropTypes.shape({
    text: PropTypes.string
  }),
  taxAmount: PropTypes.shape({
    text: PropTypes.string
  }),
  displayCheckoutPriceIncludeTax: PropTypes.bool.isRequired
};

OrderSummary.defaultProps = {
  discountAmount: {
    text: '0.00'
  },
  grandTotal: {
    text: '0.00'
  },
  shippingFeeInclTax: {
    text: '0.00'
  },
  subTotal: {
    text: '0.00'
  },
  subTotalInclTax: {
    text: '0.00'
  },
  taxAmount: {
    text: '0.00'
  }
};

export { OrderSummary };
