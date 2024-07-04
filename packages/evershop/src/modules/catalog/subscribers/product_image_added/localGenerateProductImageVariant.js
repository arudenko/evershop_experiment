// const path = require('path');
// const { existsSync } = require('fs');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
// const sharp = require('sharp');
const { update } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
// const { CONSTANTS } = require('@evershop/evershop/src/lib/helpers');
const { error } = require('@evershop/evershop/src/lib/log/logger');

module.exports = async function localGenerateProductImageVariant(data) {
  if (getConfig('system.file_storage') === 'local') {
    try {
      const imagePath = data.origin_image.replace('/assets', '');

      // if (existsSync(mediaPath)) {
      //   // Generate thumbnail
      //   await sharp(mediaPath)
      //     .resize(
      //       getConfig('catalog.product.image.thumbnail.width', 100),
      //       getConfig('catalog.product.image.thumbnail.height', 100),
      //       { fit: 'inside' }
      //     )
      //     .toFile(path.join(CONSTANTS.MEDIAPATH, thumbnailPath));
      //
      //   // Generate listing
      //   await sharp(mediaPath)
      //     .resize(
      //       getConfig('catalog.product.image.listing.width', 250),
      //       getConfig('catalog.product.image.listing.height', 250),
      //       { fit: 'inside' }
      //     )
      //     .toFile(path.join(CONSTANTS.MEDIAPATH, listingPath));
      //
      //   // Generate single
      //   await sharp(mediaPath)
      //     .resize(
      //       getConfig('catalog.product.image.single.width', 500),
      //       getConfig('catalog.product.image.single.height', 500),
      //       { fit: 'inside' }
      //     )
      //     .toFile(path.join(CONSTANTS.MEDIAPATH, singlePath));
      // }

      // Update the record in the database with the new URLs in the variant columns
      await update('product_image')
        .given({
          single_image: `/assets${imagePath}`,
          listing_image: `/assets${imagePath}`,
          thumb_image: `/assets${imagePath}`
        })
        .where('product_image_product_id', '=', data.product_image_product_id)
        .and('origin_image', '=', data.origin_image)
        .execute(pool);
    } catch (e) {
      error(e);
    }
  }
};
