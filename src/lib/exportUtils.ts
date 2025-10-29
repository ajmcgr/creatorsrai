export async function generatePDF(elementId: string, filename: string) {
  try {
    // Dynamic import to reduce bundle size
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).jsPDF;
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}

// Download arbitrary JSON data as a file (used for Canva import data)
export function downloadCanvaData(data: any, filename = 'canva-data.json') {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.warn('downloadCanvaData failed:', e);
  }
}

// Generate a Canva create URL with embedded base64 JSON payload
export function generateCanvaTemplateUrl(data: any, template?: string): string {
  try {
    const payload = template ? { ...data, template } : data;
    const json = JSON.stringify(payload);
    // Handle unicode safely in base64
    const base64 = typeof window !== 'undefined'
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, 'utf-8').toString('base64');
    return `https://www.canva.com/design?create&import=${encodeURIComponent(base64)}`;
  } catch (e) {
    console.warn('generateCanvaTemplateUrl failed:', e);
    return 'https://www.canva.com/design?create';
  }
}
