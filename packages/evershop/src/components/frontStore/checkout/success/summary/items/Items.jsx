import PropTypes from 'prop-types';
import React from 'react';
import { ItemVariantOptions } from '@components/frontStore/checkout/cart/items/ItemVariantOptions';
import './Items.scss';
import ProductNoThumbnail from '@components/common/ProductNoThumbnail';

function Items({ items, displayCheckoutPriceIncludeTax }) {

  function renderItems(localItems) {
    return localItems.map((item, index) => (
      <tr key={index}>
        <td>
          <div className="product-thumbnail">
            <div className="thumbnail">
              {item.thumbnail && (
                <img src={item.thumbnail} alt={item.productName} />
              )}
              {!item.thumbnail && (
                <ProductNoThumbnail width={45} height={45} />
              )}
            </div>
            <span className="qty">{item.qty}</span>
          </div>
        </td>
        <td>
          <div className="product-column">
            <div>
              <span className="font-semibold">{item.productName} </span>
            </div>

            <ItemVariantOptions
              options={JSON.parse(item.variantOptions || '[]')}
            />
          </div>
        </td>
        <td>
          <span>
            {displayCheckoutPriceIncludeTax
              ? item.total.text
              : item.subTotal.text}
          </span>
        </td>
      </tr>)
    );
  }

  const groupByEmail = (products) => products.reduce((acc, product) => {
    const { sellerEmail } = product;
    const lowercaseSellerEmail = sellerEmail.toLowerCase();
    if (!acc[lowercaseSellerEmail]) {
      acc[lowercaseSellerEmail] = [];
    }
    acc[lowercaseSellerEmail].push(product);
    return acc;
  }, {});

  const groupedItems = groupByEmail(items);

  const renderedGroupedItems = Object.keys(groupedItems).map((email, index) =>
    (
      <div>
        <h3>Please contact <u><a href={`mailto:${groupedItems[email][0].sellerEmail}`}>{groupedItems[email][0].sellerEmail}</a></u> for collection: </h3>
      <table className="listing items-table" key={index}>
        <tbody>
        {renderItems(groupedItems[email])}
        </tbody>
      </table>
      </div>
    ));

  return (
    <div id="summary-items">
    { renderedGroupedItems }
    </div>
  );
}

Items.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      qty: PropTypes.number.isRequired,
      thumbnail: PropTypes.string,
      total: PropTypes.shape({
        text: PropTypes.string.isRequired
      }).isRequired,
      variantOptions: PropTypes.string,
      sellerEmail: PropTypes.string
    })
  ).isRequired,
  displayCheckoutPriceIncludeTax: PropTypes.bool.isRequired
};

export { Items };
