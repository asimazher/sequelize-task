const Customer = require("./Customers");
const Employee = require("./Employees");
const Office = require("./Office");
const OrderDetails = require("./OrderDetails");
const Order = require("./Orders");
const Payment = require("./Payments");
const ProductLine = require("./ProductLines");
const Product = require("./Products");



// product and productLine
ProductLine.hasMany(Product, { foreignKey: 'productLine', targetKey: 'productLine' });
Product.belongsTo(ProductLine, { foreignKey: 'productLine', targetKey: 'productLine' });

// product and order Details
Product.hasMany(OrderDetails, { foreignKey: 'productCode', targetKey: 'productCode' });
OrderDetails.belongsTo(Product, { foreignKey: 'productCode', targetKey: 'productCode' });

// order and order details
Order.hasMany(OrderDetails, { foreignKey: 'orderNumber', targetKey: 'orderNumber' });
OrderDetails.belongsTo(Order, { foreignKey: 'orderNumber', targetKey: 'orderNumber' });

// customer and employee
Employee.hasMany(Customer, { foreignKey: 'salesRepEmployeeNumber', targetKey: 'employeeNumber' });
Customer.belongsTo(Employee, { foreignKey: 'salesRepEmployeeNumber', targetKey: 'employeeNumber' });

// employee and office 
Office.hasMany(Employee, { foreignKey: 'officeCode', targetKey: 'officeCode' });
Employee.belongsTo(Office, { foreignKey: 'officeCode', targetKey: 'officeCode' });

// customer and payment
Payment.belongsTo(Customer, { foreignKey: 'customerNumber', targetKey: 'customerNumber' });
Customer.hasMany(Payment, { foreignKey: 'customerNumber' });

// order and customer
Customer.hasMany(Order, { foreignKey: 'customerNumber', targetKey: 'customerNumber' });
Order.belongsTo(Customer, { foreignKey: 'customerNumber', targetKey: 'customerNumber' });

