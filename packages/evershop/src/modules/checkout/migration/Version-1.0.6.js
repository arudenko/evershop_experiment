const { execute } = require('@evershop/postgres-query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {

  await execute(
    connection,
    `ALTER TABLE "payment_transaction" ADD COLUMN IF NOT EXISTS "payment_reference" varchar DEFAULT NULL`
  );

};
