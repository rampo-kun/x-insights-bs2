import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captures a DOM node and exports it as a single-page A4 PDF.
 * Designed to run entirely client-side (no server round trip).
 */
export async function exportNodeToPdf(node: HTMLElement, filename: string) {
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#0B0F1A",
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // If content is taller than one page, scale down to fit a single page
  // (this is a one-page branded report by design).
  let finalWidth = imgWidth;
  let finalHeight = imgHeight;
  if (imgHeight > pageHeight) {
    finalHeight = pageHeight;
    finalWidth = (canvas.width * finalHeight) / canvas.height;
  }

  const x = (pageWidth - finalWidth) / 2;
  const y = 0;

  pdf.addImage(
    imgData,
    "PNG",
    x,
    y,
    finalWidth,
    finalHeight,
    undefined,
    "FAST",
  );
  pdf.save(filename);
}
