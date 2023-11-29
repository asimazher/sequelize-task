const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const PDFTable = require('pdfkit-table');
const { Sequelize, DataTypes } = require('sequelize');
const Customer = require('../models/Customers');
const Order = require('../models/Orders');
const Payment = require('../models/Payments');
const OrderDetails = require('../models/OrderDetails');
const Product = require('../models/Products');
const Employee = require('../models/Employees');
const Office = require('../models/Office');


const getInvoice =  async (req, res) => {
    const orderNumber = req.query.orderNumber
  try {
        const orderDetail = await Order.findOne({
          where: { orderNumber: orderNumber },
          include: [
            {
              model: OrderDetails,
              attributes: ['orderNumber', 'productCode', 'quantityOrdered', 'priceEach', 'orderLineNumber'],
              include: [
                {
                  model: Product,
                  attributes: ['productName', 'buyPrice', 'productDescription']
            },
        ],
    },
            {
              model: Customer,
              attributes: ['customerNumber', 'customerName', 'contactFirstName', 'contactLastName', 'creditLimit'],
              include: [
                {
                  model: Employee,
                  attributes: ['employeeNumber', 'firstName', 'lastName', 'jobTitle'],
                  include: [
                    {
                      model: Office, 
                      attributes: ['officeCode', 'city', 'phone', 'addressLine1', 'addressLine2', 'state', 'country', 'postalCode', 'territory'],
                    },
                  ],
                },
                {
                    model: Payment,
                    attributes: ['checkNumber', 'paymentDate', 'amount'],
                  },
              ],
            },
          ],
        });


    // Generate PDF
    const pdfDoc = new PDFDocument();

// Set response headers for file download
res.setHeader('Content-Disposition', `attachment; filename=invoice-${Date.now()}.pdf`);
res.setHeader('Content-Type', 'application/pdf');

// Pipe the PDF content directly to the response
pdfDoc.pipe(res);


// const fileName = `invoice-${Date.now()}.pdf`;
// console.log(orderDetail.Customer)
// pdfDoc.pipe(fs.createWriteStream(fileName));



// Add your standard invoice template here
    pdfDoc
      .fontSize(18)
      .text('Alibaba', { align: 'center' })
      .fontSize(12)
      .text(`Invoice for Order. ${orderNumber}`)
      .text(`Customer ID: ${orderDetail.Customer.customerNumber}`)
      .text(`Customer Name: ${orderDetail.Customer.customerName}`)
      .text(`Contact Name: ${orderDetail.Customer.contactFirstName} ${orderDetail.Customer.contactLastName}`)
      .text(`Credit Limit: ${orderDetail.Customer.creditLimit}`)
      .text(`Order Date: ${orderDetail.dataValues.orderDate}`)
      .text(`Ship Date: ${orderDetail.dataValues.shippedDate}`)
      .text(`Order Status: ${orderDetail.dataValues.status}`)
      .text(`Payment Date: ${orderDetail.Customer.Payments[0].paymentDate}`)
      .text(`Payment Amount: ${orderDetail.Customer.Payments[0].amount}`)
      .moveDown()
      .text('Order Details:')
      .text('Order No. , Quantity Ordered')
      .text(`${orderNumber}, ${orderDetail.OrderDetails[0].quantityOrdered}`)
      .moveDown()
      .text('Product Details:')
      .text('Product Name, Buy Price, Product Line Details')
      .text(`${orderDetail.OrderDetails[0].dataValues.Product.productName}, ${orderDetail.OrderDetails[0].dataValues.Product.buyPrice}, ${orderDetail.OrderDetails[0].dataValues.Product.productDescription}`)
      .moveDown()
      .text('Sales Rep Details:')
      .text(`Sales Rep: ${orderDetail.Customer.Employee.firstName} ${orderDetail.Customer.Employee.lastName}`)
      .text(`Office: ${orderDetail.Customer.Employee.Office.city}, ${orderDetail.Customer.Employee.Office.country}`)
      .text(`Phone: ${orderDetail.Customer.Employee.Office.phone}`);

    pdfDoc.end();

    
    // Respond with the generated PDF file
    res.status(200).download(`invoice-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = getInvoice
