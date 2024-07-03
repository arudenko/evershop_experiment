import React from 'react';

export default function UserIcon() {
  return (
    <div className="self-center" />
  );
}

// UserIcon.propTypes = {
  // accountUrl: PropTypes.string,
  // customer: PropTypes.shape({
  //   email: PropTypes.string.isRequired,
  //   fullName: PropTypes.string.isRequired,
  //   uuid: PropTypes.string.isRequired
  // })
  // loginUrl: PropTypes.string.isRequired
// };

UserIcon.defaultProps = {
  // accountUrl: null,
  // customer: null
};

export const layout = {
  areaId: 'icon-wrapper',
  sortOrder: 30
};

export const query = `
  query Query {
    customer: currentCustomer {
      uuid
      fullName
      email
    }
    accountUrl: url(routeId: "account")
    loginUrl: url(routeId: "login")
  }
`;
