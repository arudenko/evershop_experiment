import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useCheckoutSteps } from '@components/common/context/checkoutSteps';
import { useAppDispatch } from '@components/common/context/app';

const Checkout = React.createContext();

export function CheckoutProvider({
                                   children,
                                   cartId,
                                   placeOrderAPI,
                                   getPaymentMethodAPI,
                                   checkoutSuccessUrl
                                 }) {
  const AppContextDispatch = useAppDispatch();
  const steps = useCheckoutSteps();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState();
  const [paymentReference, setPaymentReference] = useState('');
  const [, setError] = useState(null);

  // Call api to current url when steps change
  useEffect(() => {
    const placeOrder = async () => {
      if (paymentReference === '') {
        // TODO Is this the best way to handle this?
        setError('Payment reference is required');
        return;
      }
      // If order is placed, do nothing
      if (orderPlaced) {
        return;
      }
      // If there is a incompleted step, do nothing
      if (
        steps.length < 1 ||
        steps.findIndex((s) => s.isCompleted === false) !== -1
      ) {
        return;
      }
      const response = await axios.post(placeOrderAPI, { cart_id: cartId, payment_reference: paymentReference });
      if (!response.data.error) {
        setOrderPlaced(true);
        setOrderId(response.data.data.uuid);
        setError(null);
      } else {
        setError(response.data.error.message);
      }
    };
    const reload = async () => {
      const url = new URL(window.location.href, window.location.origin);
      url.searchParams.append('ajax', true);
      await AppContextDispatch.fetchPageData(url);
      url.searchParams.delete('ajax');
      await placeOrder();
    };
    reload();
  }, [steps]);

  const getPaymentMethods = async () => {
    const response = await axios.get(getPaymentMethodAPI);

    if (!response.data.error) {
      // Force select the first method so user don't need to do extra click
      response.data.data.methods[0].selected = true;
      setPaymentMethods(response.data.data.methods);
    } else {
      setPaymentMethods([]);
    }
  };

  const contextValue = useMemo(
    () => ({
      steps,
      cartId,
      orderPlaced,
      orderId,
      paymentMethods,
      setPaymentMethods,
      getPaymentMethods,
      checkoutSuccessUrl,
      paymentReference,
      setPaymentReference
    }),
    [steps, cartId, orderPlaced, orderId, paymentMethods, paymentReference, checkoutSuccessUrl]
  );

  return <Checkout.Provider value={contextValue}>{children}</Checkout.Provider>;
}

CheckoutProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  cartId: PropTypes.string.isRequired,
  placeOrderAPI: PropTypes.string.isRequired,
  getPaymentMethodAPI: PropTypes.string.isRequired,
  checkoutSuccessUrl: PropTypes.string.isRequired
};

export const useCheckout = () => React.useContext(Checkout);
