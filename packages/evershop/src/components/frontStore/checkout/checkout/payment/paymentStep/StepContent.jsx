import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from 'urql';
import Area from '@components/common/Area';
import { useCheckoutStepsDispatch } from '@components/common/context/checkoutSteps';
import { Form } from '@components/common/form/Form';
import { useCheckout } from '@components/common/context/checkout';
import { Field } from '@components/common/form/Field';
import Button from '@components/common/form/Button';
import { _ } from '@evershop/evershop/src/lib/locale/translate';
import Spinner from '@components/common/Spinner';

const QUERY = `
  query Query($cartId: String) {
    cart(id: $cartId) {
      totalQty
    }
  }
`;

export function StepContent({
  cart: { addPaymentMethodApi }
}) {
  const { completeStep } = useCheckoutStepsDispatch();
  const { cartId, paymentMethods, getPaymentMethods } = useCheckout();
  const [loading, setLoading] = useState(false);

  const onSuccess = async (response) => {
    if (!response.error) {
      const result = await fetch(addPaymentMethodApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method_code: "cod",
          method_name: "Cash On Delivery"
        })
      });
      const data = await result.json();
      if (!data.error) {
        completeStep('payment');
      }
    } else {
      setLoading(false);
      toast.error(response.error.message);
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const [result] = useQuery({
    query: QUERY,
    variables: {
      cartId
    }
  });
  const { fetching, error } = result;

  if (fetching) {
    return (
      <div className="flex justify-center items-center p-3">
        <Spinner width={25} height={25} />
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-critical">{error.message}</div>;
  }
  return (
    <div>
      <Form
        method="POST"
        action=""
        onSuccess={onSuccess}
        onValidationError={() => setLoading(false)}
        id="checkoutPaymentForm"
        submitBtn={false}
        isJSON
      >
        <h4 className="mb-4 mt-12">{_('Payment Method')}</h4>
        {paymentMethods && paymentMethods.length > 0 && (
          <>
            <div className="divide-y border rounded border-divider px-8 mb-8">
              {paymentMethods.map((method) => (
                <div
                  key={method.code}
                  className="border-divider payment-method-list"
                >
                  <div className="py-8">
                    <Area id={`checkoutPaymentMethod${method.code}`} />
                  </div>
                </div>
              ))}
            </div>
            <Field
              type="hidden"
              name="method_code"
              value={paymentMethods.find((e) => e.selected === true)?.code}
              validationRules={[
                {
                  rule: 'notEmpty',
                  message: _('Please select a payment method')
                }
              ]}
            />
            <input
              type="hidden"
              value={paymentMethods.find((e) => e.selected === true)?.name}
              name="method_name"
            />
            <input type="hidden" value="billing" name="type" />
          </>
        )}
        {paymentMethods.length === 0 && (
          <div className="alert alert-warning">
            {_('No payment method available')}
          </div>
        )}
        <Area id="beforePlaceOrderButton" noOuter />
        <div className="form-submit-button">
          <Button
            onAction={() => {
              setLoading(true);
              // document
              //   .getElementById('checkoutPaymentForm')
              //   .dispatchEvent(
              //     new Event('submit', { cancelable: true, bubbles: true })
              //   );
              onSuccess({ error: null });
            }}
            title={_('Place Order')}
            isLoading={loading}
          />
        </div>
      </Form>
    </div>
  );
}

StepContent.propTypes = {
  cart: PropTypes.shape({
    addPaymentMethodApi: PropTypes.string.isRequired
  }).isRequired
};
