const fs = require("fs");
const PDFDocument = require("pdfkit");
let doc = new PDFDocument();

// menambahkan teks ke dokumen
doc.text("Hello World!", 100, 100);

// menulis ke file
doc.pipe(fs.createWriteStream("output.pdf"));

doc.end();
