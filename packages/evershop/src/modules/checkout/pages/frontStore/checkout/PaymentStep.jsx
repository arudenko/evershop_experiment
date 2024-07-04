import PropTypes from 'prop-types';
import React from 'react';
import {
  useCheckoutSteps,
  useCheckoutStepsDispatch
} from '@components/common/context/checkoutSteps';
import { StepContent } from '@components/frontStore/checkout/checkout/payment/paymentStep/StepContent';
import { _ } from '@evershop/evershop/src/lib/locale/translate';

export default function PaymentStep({ cart }) {
  const steps = useCheckoutSteps();
  const step = steps.find((e) => e.id === 'payment') || {};
  const [display, setDisplay] = React.useState(false);
  const { canStepDisplay, addStep } = useCheckoutStepsDispatch();

  React.useEffect(() => {
    addStep({
      id: 'payment',
      title: _('Payment'),
      previewTitle: _('Payment'),
      isCompleted: false,
      sortOrder: 15,
      editable: true
    });
  }, []);

  React.useEffect(() => {
    setDisplay(canStepDisplay(step, steps));
  });

  return (
    <div className="checkout-payment checkout-step">
      {display && <StepContent cart={cart} step={step} />}
    </div>
  );
}

PaymentStep.propTypes = {
  cart: PropTypes.shape({
    addPaymentMethodApi: PropTypes.string.isRequired
  }).isRequired
};

export const layout = {
  areaId: 'checkoutSteps',
  sortOrder: 20
};

export const query = `
  query Query {
    cart {
      addPaymentMethodApi
    }
  }
`;
