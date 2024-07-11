const { select } = require('@evershop/postgres-query-builder');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { getOrdersBaseQuery } = require('../../../services/getOrdersBaseQuery');

module.exports = {
  Query: {
    order: async (_, { uuid }, { pool }) => {
      const query = getOrdersBaseQuery();
      query.where('uuid', '=', uuid);
      const order = await query.load(pool);
      if (!order) {
        return null;
      } else {
        return camelCase(order);
      }
    },
    shipmentStatusList: () => getConfig('oms.order.shipmentStatus', {}),
    paymentStatusList: () => getConfig('oms.order.paymentStatus', {})
  },
  Order: {
    items: async ({ orderId }, _, { pool }) => {
      const getSenderEmail = async (itemId) => {
        const attributes =  await select()
          .from('product_attribute_value_index')
          .where('product_id', '=', itemId)
          .execute(pool);
        return attributes.find((attribute) => attribute.attribute_id === getConfig("seller_email_attribute_id", -1)).option_text;
      }

      const items = await select()
        .from('order_item')
        .where('order_item_order_id', '=', orderId)
        .execute(pool);
      return items.map(async (item) => {
        const processedItem = camelCase(item)
        processedItem.sellerEmail = await getSenderEmail(item.product_id);
        return processedItem;
      });
    },
    activities: async ({ orderId }, _, { pool }) => {
      const query = select().from('order_activity');
      query.where('order_activity_order_id', '=', orderId);
      query.orderBy('order_activity_id', 'DESC');
      const activities = await query.execute(pool);
      return activities
        ? activities.map((activity) => camelCase(activity))
        : null;
    },
    shipment: async ({ orderId, uuid }, _, { pool }) => {
      const shipment = await select()
        .from('shipment')
        .where('shipment_order_id', '=', orderId)
        .load(pool);
      return shipment ? { ...camelCase(shipment), orderUuid: uuid } : null;
    },
    shipmentStatus: ({ shipmentStatus }) => {
      const statusList = getConfig('oms.order.shipmentStatus', {});
      const status = statusList[shipmentStatus] || {
        name: 'Unknown',
        code: shipmentStatus,
        badge: 'default',
        progress: 'incomplete'
      };

      return {
        ...status,
        code: shipmentStatus
      };
    },
    paymentStatus: ({ paymentStatus }) => {
      const statusList = getConfig('oms.order.paymentStatus', {});
      const status = statusList[paymentStatus] || {
        name: 'Unknown',
        code: paymentStatus,
        badge: 'default',
        progress: 'incomplete'
      };

      return {
        ...status,
        code: paymentStatus
      };
    }
  },
  Customer: {
    orders: async ({ customerId }, _, { pool }) => {
      const orders = await select()
        .from('order')
        .where('order.customer_id', '=', customerId)
        .execute(pool);
      return orders.map((row) => camelCase(row));
    }
  },
  OrderItem: {
    productUrl: async ({ productId }, _, { pool }) => {
      const product = await select()
        .from('product')
        .where('product_id', '=', productId)
        .load(pool);
      return product ? buildUrl('productEdit', { id: product.uuid }) : null;
    }
  }
};
