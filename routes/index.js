const express = require("express");
const pdfService = require("../service/pdf-service");

const router = express.Router();

const invoice = {
  orderDetails: {
    _id: 1234567,
    date: "24 - 09 - 22",
  },
  shipping: {
    name: "aamna",
    email: "aamnasadiq29@gmail.com",
    phone: "8707092808",
    address: "C224, Paryavarn Complex, near garden of 5 senses, Saket",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110030",
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000,
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000,
    },
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
};

router.get("/invoice", (req, res) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline;filename=invoice.pdf",
  });

  pdfService.buildPdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    invoice
  );
});

module.exports = router;
