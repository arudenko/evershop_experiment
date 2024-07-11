export default function CaptureButton() {
  return null;
}

CaptureButton.propTypes = {
};

export const layout = {
  areaId: 'orderPaymentActions',
  sortOrder: 10
};

export const query = `
  query Query {
    captureAPI: url(routeId: "codCapturePayment")
    order(uuid: getContextValue("orderId")) {
      uuid
      paymentStatus {
        code
      }
      paymentMethod
    }
  }
`;
