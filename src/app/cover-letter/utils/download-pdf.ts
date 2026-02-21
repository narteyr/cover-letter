"use client";

/**
 * Captures the cover letter editor DOM node and downloads it as a PDF.
 *
 * Strategy:
 *   1. html2canvas renders the live DOM into a canvas (font-faithful, WYSIWYG).
 *   2. jsPDF embeds the canvas image sized to A4 (210 × 297 mm).
 *
 * The caller should pass a ref to the white paper card element (the inner
 * DefaultCard content div), not the scroll container, so we capture only the
 * letter itself without chrome/padding.
 */
export async function downloadCoverLetterPdf(
    element: HTMLElement,
    filename: string = "cover-letter.pdf"
): Promise<void> {
    // Dynamic imports keep these large libs out of the initial bundle.
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
    ]);

    // ── 1. Render to canvas ────────────────────────────────────────────────
    const canvas = await html2canvas(element, {
        scale: 2,           // 2× for crisp PDF output
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        // Ensure the full height is captured even if the element is clipped
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // ── 2. Build PDF ───────────────────────────────────────────────────────
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();   // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    // Scale image to fit the full page width
    const imgAspect = canvas.height / canvas.width;
    const imgHeightMm = pageWidth * imgAspect;

    // If the letter is taller than one page, split across pages
    if (imgHeightMm <= pageHeight) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeightMm);
    } else {
        let yOffset = 0;
        let remainingHeight = imgHeightMm;

        while (remainingHeight > 0) {
            const sliceHeight = Math.min(remainingHeight, pageHeight);
            // yPosition in the source image (in mm units)
            const srcY = yOffset / imgHeightMm * canvas.height;
            const srcH = sliceHeight / imgHeightMm * canvas.height;

            // Crop the canvas slice into a temporary canvas
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = srcH;
            const ctx = sliceCanvas.getContext("2d")!;
            ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

            const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.98);
            pdf.addImage(sliceData, "JPEG", 0, 0, pageWidth, sliceHeight);

            remainingHeight -= pageHeight;
            yOffset += pageHeight;

            if (remainingHeight > 0) {
                pdf.addPage();
            }
        }
    }

    pdf.save(filename);
}
