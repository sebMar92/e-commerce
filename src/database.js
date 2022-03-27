require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DATABASE_URL } = process.env;

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize(DATABASE_URL, {
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/ecommerce`,
        {
          logging: false, // set to console.log to see the raw SQL queries
          native: false, // lets Sequelize know we can use pg-native for ~30% more speed
        }
      );
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);

sequelize.models = Object.fromEntries(capsEntries);
// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  User,
  Direction,
  Category,
  Product,
  Image,
  Comment,
  Sale,
  Newsletter,
  Token,
  Order,
} = sequelize.models;

// User.belongsToMany(Product, { through: "Wishlist", as: "wishedProduct" });
// Product.belongsToMany(User, { through: "Wishlist" });

// User.belongsToMany(Product, { through: "ShoppingCart", as: "shoppingProduct" });
// Product.belongsToMany(User, { through: "ShoppingCart" });

User.hasMany(Direction);

User.hasMany(Order);
Product.hasMany(Order);

Category.belongsToMany(Product, { through: "Category_Product" });
Product.belongsToMany(Category, { through: "Category_Product" });

Sale.belongsToMany(Product, { through: "Sale_Product" });
Product.belongsToMany(Sale, { through: "Sale_Product" });

Sale.belongsToMany(Category, { through: "Sale_Category" });
Category.belongsToMany(Sale, { through: "Sale_Category" });

User.hasMany(Comment);
Product.hasMany(Comment);

Product.hasMany(Image);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
