const PDFDocument = require("pdfkit");

function buildPdf(dataCallback, endCallback, invoice) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
}

function generateHeader(doc) {
  doc
    .image("./service/logo.png", 50, 38, { width: 60 })
    .fillColor("#444444")
    .fontSize(20)
    .fontSize(10)
    .text("Ecofreak Inc.", 200, 50, { align: "right" })
    .text("123 Champa Gali", 200, 65, { align: "right" })
    .text("Saket, NY, 110017", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Order ID:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 120, customerInformationTop)
    .font("Helvetica")
    .text("Order Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 120, customerInformationTop + 15)
    .text("Invoice Date:", 50, customerInformationTop + 30)
    .text(formatDate(new Date()), 120, customerInformationTop + 30)
    .text("PAN:", 50, customerInformationTop + 45)
    .text("AAICA4872D", 120, customerInformationTop + 45)
    .text("CIN:", 50, customerInformationTop + 59)
    .text("U52100DL2010PTC2026000", 120, customerInformationTop + 59)

    .font("Helvetica-Bold")
    .text("Ship To :", 300, customerInformationTop)
    .text(invoice.shipping.name, 300, customerInformationTop + 15)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 30)
    .text(
      invoice.shipping.city +
        ", " +
        invoice.shipping.state +
        ", " +
        invoice.shipping.pincode,
      300,
      customerInformationTop + 58
    )
    .moveDown();

  generateHr(doc, 280);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Qty",
    "Unit Cost",
    "IGST",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.quantity,
      formatCurrency(item.amount / item.quantity),
      igst(item.amount),
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc.fontSize(10).text("Thank you for your business.", 50, 780, {
    align: "center",
    width: 500,
  });
}

function generateTableRow(doc, y, item, igst, unitCost, qty, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(qty, 370, y, { width: 90, align: "right" })
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(igst, 270, y)
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(rupees) {
  return "Rs." + rupees.toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

function igst(totalAmount) {
  const percentage = (totalAmount * 12) / 100;

  return "Rs." + percentage;
}

module.exports = { buildPdf };
