export type SmartReaderPage = {
  chapter: string;
  content: string[];
};

export type SmartDocument = {
  id: string;
  title: string;
  overview: string;
  keyPoints: string[];
  sections: Array<{ title: string; text: string }>;
  highlights: Array<{ no: string; text: string }>;
  pages: SmartReaderPage[];
};

const STOP_WORDS = new Set([
  'de', 'la', 'el', 'y', 'en', 'que', 'a', 'los', 'del', 'se', 'las', 'por', 'un',
  'para', 'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'mas', 'más', 'pero', 'sus',
  'le', 'ya', 'o', 'este', 'si', 'sí', 'porque', 'esta', 'entre', 'cuando', 'muy',
  'sin', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde', 'todo',
  'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'fue', 'ese', 'eso',
  'ante', 'ellos', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras',
  'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual',
  'poco', 'ella', 'estar', 'estas', 'algunas', 'algo', 'nosotros', 'mi', 'mis', 'tú',
  'te', 'ti', 'tu', 'tus', 'ellas', 'nosotras', 'vosotros', 'vosotras', 'os', 'mío',
  'mía', 'míos', 'mías', 'tuyo', 'tuya', 'tuyos', 'tuyas', 'suyo', 'suya', 'suyos',
  'suyas', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros',
  'vuestras', 'esos', 'esas', 'estoy', 'estás', 'está', 'estamos', 'están', 'esté',
  'estés', 'estemos', 'estén', 'estaré', 'estará', 'estarán', 'fui', 'fue', 'fueron',
  'era', 'eran', 'ser', 'son', 'es',
]);

const cleanText = (text: string): string =>
  text.replace(/\s+/g, ' ').replace(/\u0000/g, '').trim();

const splitSentences = (text: string): string[] =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-záéíóúüñ\s]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

const buildFrequencyMap = (sentences: string[]): Map<string, number> => {
  const freq = new Map<string, number>();
  sentences.forEach((s) =>
    tokenize(s).forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1))
  );
  return freq;
};

const scoreSentence = (sentence: string, freq: Map<string, number>): number => {
  const tokens = tokenize(sentence);
  if (tokens.length === 0) return 0;
  const score = tokens.reduce((acc, t) => acc + (freq.get(t) ?? 0), 0);
  return score * (0.6 + Math.min(tokens.length, 32) / 32);
};

const selectTopSentences = (sentences: string[], amount: number): string[] => {
  const freq = buildFrequencyMap(sentences);
  const scored = sentences
    .map((s, i) => ({ sentence: s, index: i, score: scoreSentence(s, freq) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(amount * 2, sentences.length));

  return Array.from(new Map(scored.map((x) => [x.sentence.toLowerCase(), x])).values())
    .sort((a, b) => a.index - b.index)
    .slice(0, amount)
    .map((x) => x.sentence);
};

const chunkParagraphs = (text: string, targetSize = 650): string[] => {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [text];

  const chunks: string[] = [];
  let current = '';
  sentences.forEach((s) => {
    if ((current + ' ' + s).trim().length > targetSize && current.length > 0) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = `${current} ${s}`.trim();
    }
  });
  if (current.length > 0) chunks.push(current);
  return chunks;
};

const fallbackTitle = (fileName: string): string =>
  fileName.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ').trim();

export const buildSmartDocument = (pageTexts: string[], fileName: string): SmartDocument => {
  const cleanedPages = pageTexts.map(cleanText).filter((p) => p.length > 0);
  const fullText = cleanedPages.join(' ');
  const sentences = splitSentences(fullText);
  const highlights = selectTopSentences(sentences, 2);
  const keyPoints = selectTopSentences(sentences, 6);

  const overview =
    highlights.length > 0
      ? highlights.join(' ')
      : (cleanedPages[0] ?? 'No se pudo extraer texto suficiente del PDF para resumir.');

  const sections = cleanedPages.slice(0, 8).map((page, index) => {
    const pageSummary = selectTopSentences(splitSentences(page), 2);
    return { title: `Sección ${index + 1}`, text: pageSummary.join(' ') || page.slice(0, 280) };
  });

  const pages: SmartReaderPage[] = cleanedPages.map((page, index) => ({
    chapter: `Página ${index + 1}`,
    content: chunkParagraphs(page),
  }));

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: fallbackTitle(fileName),
    overview,
    keyPoints: keyPoints.length > 0 ? keyPoints : [overview],
    sections,
    highlights: highlights.map((text, idx) => ({ no: `${idx + 1}`, text })),
    pages,
  };
};
