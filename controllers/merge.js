const fs = require('fs');
const { PDFDocument } = require('pdf-lib');


const mergePdf = async (req, res) => {
    const { file1, file2 } = req.body;
  
    if (!file1 || !file2) {
      return res.status(400).json({ error: 'Both files are required' });
    }
  
    try {
      const file1Buffer = fs.readFileSync(file1);
      const file2Buffer = fs.readFileSync(file2);
  
      const pdfDoc1 = await PDFDocument.load(file1Buffer);
      const pdfDoc2 = await PDFDocument.load(file2Buffer);
  
      const mergedPdf = await PDFDocument.create();
  
      // Append pages from the first PDF
      for (const [pageIndex, pdfPage] of pdfDoc1.getPages().entries()) {
        const copiedPage = await mergedPdf.copyPages(pdfDoc1, [pageIndex]);
        mergedPdf.addPage(copiedPage[0]);
      }
  
      // Append pages from the second PDF
      for (const [pageIndex, pdfPage] of pdfDoc2.getPages().entries()) {
        const copiedPage = await mergedPdf.copyPages(pdfDoc2, [pageIndex]);
        mergedPdf.addPage(copiedPage[0]);
      }
  
      const mergedPdfBytes = await mergedPdf.save();
  
      // Choose a secure location to save the merged PDF
      const outputFileName = 'merged.pdf';
      fs.writeFileSync(outputFileName, mergedPdfBytes);
  
      res.json({ result: 'PDFs merged successfully', merged_pdf: outputFileName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = mergePdf