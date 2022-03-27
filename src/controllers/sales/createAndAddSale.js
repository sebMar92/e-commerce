const { Sale } = require('../../database.js');

const createAndAddSale = async (salesData) => {
  try {
    const { description, percentage, day, productAmount, category, product, image, id } =
      salesData;
    const newSale = await Sale.create({
      description,
      percentage,
      day,
      productAmount,
      image,
      id,
    });
    if (category === 0 && product === 0) {
      newSale.global = true;
      newSale.save();
    }
    if (category > 0) {
      newSale.addCategory(category);
    }
    if (product > 0) {
      newSale.addProduct(product);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = createAndAddSale;
