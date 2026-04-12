import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const sanitizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').replace(/\u0000/g, '').trim();

export const extractPdfPages = async (file: File): Promise<string[]> => {
  const buffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const pages: string[] = [];

  for (let index = 1; index <= pdf.numPages; index += 1) {
    const page = await pdf.getPage(index);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => {
        if ('str' in item && typeof item.str === 'string') {
          return item.str;
        }
        return '';
      })
      .join(' ');

    pages.push(sanitizeText(text));
  }

  return pages.filter((pageText) => pageText.length > 0);
};
