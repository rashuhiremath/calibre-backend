import PdfPrinter from "pdfmake";

export const getPdfReadableStream = (downloadFile) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [downloadFile],
  };

  const options = {
    // ...
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, {});
  pdfDoc.end();
  return pdfDoc;
};
