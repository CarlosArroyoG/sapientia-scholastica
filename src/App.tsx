import React, { useEffect, useMemo, useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Info,
  ArrowRight,
  GraduationCap,
  Scale,
  Cross,
  Globe,
  ShieldCheck,
  ShieldAlert,
  Search,
  User,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Book as BookIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  documentData,
  fullDocumentPages,
  SectionKey
} from './data/content';
import type { SmartDocument, SmartReaderPage } from './utils/smartSummary';

type ViewMode = 'modules' | 'reader' | 'uploads' | 'uploadedReader';

type NavButtonProps = {
  id: SectionKey;
  title: string;
  icon: React.ReactNode;
};

type ReadingProgress = {
  base: number;
  uploaded: Record<string, number>;
};

const DOCS_STORAGE_KEY = 'sapientia.uploadedDocs';
const PROGRESS_STORAGE_KEY = 'sapientia.readingProgress';
const DEFAULT_ADMIN_PASSWORD = 'sapientia2026';

const parseStoredDocs = (): SmartDocument[] => {
  try {
    const raw = localStorage.getItem(DOCS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as SmartDocument[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
};

const parseStoredProgress = (): ReadingProgress => {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return { base: 0, uploaded: {} };
    }
    const parsed = JSON.parse(raw) as ReadingProgress;
    return {
      base: Number.isFinite(parsed.base) ? parsed.base : 0,
      uploaded: parsed.uploaded && typeof parsed.uploaded === 'object' ? parsed.uploaded : {}
    };
  } catch {
    return { base: 0, uploaded: {} };
  }
};

const App = () => {
  const adminPassword = (import.meta as { env?: { VITE_ADMIN_PASSWORD?: string } }).env?.VITE_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>(() => parseStoredProgress());
  const [activeSection, setActiveSection] = useState<SectionKey>('introduccion');
  const [viewMode, setViewMode] = useState<ViewMode>('modules');
  const [currentPage, setCurrentPage] = useState(readingProgress.base);
  const [uploadedReaderPage, setUploadedReaderPage] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState<SmartDocument[]>(() => parseStoredDocs());
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  const currentSectionData = documentData[activeSection];
  const selectedUpload = useMemo(
    () => uploadedDocs.find((doc) => doc.id === selectedDocId) ?? null,
    [uploadedDocs, selectedDocId]
  );

  useEffect(() => {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(uploadedDocs));
  }, [uploadedDocs]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(readingProgress));
  }, [readingProgress]);

  useEffect(() => {
    if (selectedDocId || uploadedDocs.length === 0) {
      return;
    }

    const firstDoc = uploadedDocs[0];
    setSelectedDocId(firstDoc.id);
    setUploadedReaderPage(readingProgress.uploaded[firstDoc.id] ?? 0);
  }, [selectedDocId, uploadedDocs, readingProgress.uploaded]);

  const saveBaseReadingProgress = (page: number) => {
    setCurrentPage(page);
    setReadingProgress((prev) => ({ ...prev, base: page }));
  };

  const saveUploadedReadingProgress = (docId: string, page: number) => {
    setUploadedReaderPage(page);
    setReadingProgress((prev) => ({
      ...prev,
      uploaded: {
        ...prev.uploaded,
        [docId]: page
      }
    }));
  };

  const shareToWhatsApp = (bookLabel: string, chapter: string, paragraph: string) => {
    const message = `${bookLabel}\n${chapter}\n\n"${paragraph}"`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput.trim() === adminPassword) {
      setIsAdmin(true);
      setAdminError(null);
      setAdminPasswordInput('');
      return;
    }
    setAdminError('Clave incorrecta.');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminError(null);
    setAdminPasswordInput('');
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      setUploadError('Solo un administrador con clave puede subir documentos.');
      return;
    }

    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      setUploadError('Solo se admiten archivos PDF.');
      return;
    }

    setUploadError(null);
    setIsProcessingPdf(true);

    try {
      const [{ extractPdfPages }, { buildSmartDocument }] = await Promise.all([
        import('./utils/pdfExtractor'),
        import('./utils/smartSummary')
      ]);

      const pages = await extractPdfPages(file);

      if (pages.length === 0) {
        throw new Error('No se detectó texto legible en el PDF.');
      }

      const smartDoc = buildSmartDocument(pages, file.name);
      setUploadedDocs((prev) => [smartDoc, ...prev]);
      setSelectedDocId(smartDoc.id);
      saveUploadedReadingProgress(smartDoc.id, 0);
      setViewMode('uploads');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo procesar el PDF.';
      setUploadError(message);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const ReaderPanel = ({
    pages,
    current,
    onChange,
    label,
    onShare
  }: {
    pages: SmartReaderPage[];
    current: number;
    onChange: (value: number) => void;
    label: string;
    onShare?: (chapter: string, paragraph: string) => void;
  }) => {
    if (pages.length === 0) {
      return (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500">
          Este documento no tiene páginas disponibles para lectura.
        </div>
      );
    }

    const safePage = Math.min(Math.max(current, 0), pages.length - 1);

    return (
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col min-h-[700px] animate-in zoom-in-95 duration-500">
        <div className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookIcon className="text-amber-400 w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest opacity-80">{label}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Página {safePage + 1} de {pages.length}
          </div>
        </div>

        <div className="flex-1 p-10 lg:p-20 bg-[#faf9f6] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-slate-100/50 hidden lg:block"></div>

          <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
            <span className="text-blue-900 font-black text-[10px] uppercase tracking-[0.3em] mb-6 block text-center">
              {pages[safePage].chapter}
            </span>

            <div className="space-y-8">
              {pages[safePage].content.map((paragraph, i) => (
                <div key={`${safePage}-${i}`} className="group rounded-2xl p-3 border border-transparent hover:border-emerald-200 hover:bg-white/50 transition-colors">
                  <p className="text-lg text-justify text-slate-800 leading-relaxed font-serif">
                    {paragraph}
                  </p>
                  {onShare && (
                    <button
                      type="button"
                      onClick={() => onShare(pages[safePage].chapter, paragraph)}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MessageCircle className="w-4 h-4" /> Exportar frase a WhatsApp
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-slate-100 p-6 flex items-center justify-between">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => onChange(Math.max(0, safePage - 1))}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-900 font-bold transition-all duration-300 disabled:opacity-20"
          >
            <ChevronLeft className="w-6 h-6" /> Anterior
          </button>

          <div className="flex gap-2" aria-label="Paginación del lector digital">
            {pages.map((_, i) => (
              <button
                type="button"
                key={i}
                aria-label={`Ir a la página ${i + 1}`}
                aria-current={safePage === i ? 'page' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 hover:h-2 ${safePage === i ? 'w-8 bg-blue-900' : 'w-2 bg-slate-200 hover:bg-blue-400'}`}
                onClick={() => onChange(i)}
              ></button>
            ))}
          </div>

          <button
            type="button"
            disabled={safePage === pages.length - 1}
            onClick={() => onChange(Math.min(pages.length - 1, safePage + 1))}
            className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-bold transition-all duration-300 disabled:opacity-20"
          >
            Siguiente <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const NavButton = ({ id, title, icon }: NavButtonProps) => (
    <button 
      type="button"
      onClick={() => { setActiveSection(id); setViewMode('modules'); }}
      aria-current={activeSection === id && viewMode === 'modules' ? 'page' : undefined}
      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 border-l-4 transform hover:scale-105 hover:shadow-xl ${
        activeSection === id && viewMode === 'modules'
        ? 'bg-blue-900 text-white border-blue-400 shadow-lg' 
        : 'bg-white text-slate-600 border-transparent hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:border-blue-300 shadow-sm'
      }`}
    >
      {icon}
      <div className="text-left">
        <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">{id}</p>
        <p className="font-bold text-sm leading-tight">{title}</p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans selection:bg-blue-200">
      {/* Barra de Título Dinámica */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-900 text-white p-3 rounded-xl shadow-inner">
              <Cross className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tighter leading-none">Sapientia Scholastica App</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-white bg-blue-700 px-2 py-0.5 rounded uppercase tracking-wider">Área de Formación Espiritual</span>
                <span className="text-[10px] font-bold text-slate-400">|</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Ambiente Escolar</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end border-l-2 border-slate-100 pl-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <User className="w-4 h-4" />
              <span>Prof. Carlos Fernando Arroyo</span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">Autor de esta Aplicacion</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Navegación Lateral */}
        <aside className="lg:w-1/4 flex flex-col gap-2">
          <div className="mb-4 px-4 flex justify-between items-center">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Guía de Estudio</h3>
          </div>

          <div className={`mb-4 p-4 rounded-2xl border text-xs ${isAdmin ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <Lock className="w-4 h-4" />
                {isAdmin ? 'Modo administrador activo' : 'Modo visitante'}
              </div>
              {isAdmin && (
                <button type="button" onClick={handleAdminLogout} className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700">
                  <LogOut className="w-3 h-3" /> salir
                </button>
              )}
            </div>
            {!isAdmin && <p className="mt-2">Solo admin puede subir PDFs. Todos pueden leer y revisar resúmenes.</p>}
          </div>
          
          <button 
            type="button"
            onClick={() => { setViewMode('reader'); setCurrentPage(0); }}
            aria-label={viewMode === 'reader' ? 'Lector digital activado' : 'Activar lector digital'}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 border-l-4 mb-4 transform hover:scale-105 hover:shadow-xl ${
              viewMode === 'reader'
              ? 'bg-amber-600 text-white border-amber-400 shadow-lg' 
              : 'bg-white text-amber-700 border-transparent hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:border-amber-300 shadow-sm'
            }`}
          >
            <BookIcon className="w-5 h-5" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Documento Íntegro</p>
              <p className="font-bold text-sm leading-tight">Lector Digital</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('uploads')}
            aria-label={viewMode === 'uploads' ? 'Biblioteca IA activada' : 'Abrir biblioteca IA'}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 border-l-4 mb-4 ${
              viewMode === 'uploads' || viewMode === 'uploadedReader'
                ? 'bg-emerald-700 text-white border-emerald-400 shadow-lg'
                : 'bg-white text-emerald-700 border-transparent hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 shadow-sm'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Nuevos Archivos</p>
              <p className="font-bold text-sm leading-tight">Biblioteca IA PDF</p>
            </div>
          </button>

          <NavButton id="introduccion" title="I. Introducción" icon={<Info className="w-5 h-5" />} />
          <NavButton id="definicion" title="II. Concepto de IA" icon={<Search className="w-5 h-5" />} />
          <NavButton id="antropologia" title="III. Antropología" icon={<Brain className="w-5 h-5" />} />
          <NavButton id="etica" title="IV. Papel de la Ética" icon={<ShieldCheck className="w-5 h-5" />} />
          <NavButton id="especificos" title="V. Ámbitos Críticos" icon={<Globe className="w-5 h-5" />} />
          <NavButton id="sabiduria" title="VI. Sabiduría Final" icon={<Heart className="w-5 h-5" />} />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 italic text-[11px] text-blue-800 leading-relaxed">
             "Este recurso pedagógico es puesto a disposición por el Área de Formación Espiritual para la comunidad escolar."
          </div>
        </aside>

        {/* Área de Visualización Principal */}
        <main className="lg:w-3/4">
          {viewMode === 'uploads' ? (
            <div className="space-y-8">
              <section className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-emerald-900 tracking-tight">Biblioteca IA</h2>
                    <p className="text-sm text-slate-600 mt-2">Sube un PDF y la plataforma genera resumen inteligente y lector completo dinámico.</p>
                  </div>
                  {isAdmin ? (
                    <label className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold cursor-pointer hover:bg-emerald-800 transition-colors">
                      <Upload className="w-4 h-4" />
                      Cargar PDF
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                  ) : (
                    <div className="w-full md:w-auto">
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={adminPasswordInput}
                          onChange={(event) => setAdminPasswordInput(event.target.value)}
                          placeholder="Clave admin"
                          className="px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                        <button
                          type="button"
                          onClick={handleAdminLogin}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800"
                        >
                          Desbloquear
                        </button>
                      </div>
                      {adminError && <p className="mt-2 text-xs text-red-600 font-semibold">{adminError}</p>}
                    </div>
                  )}
                </div>

                {isProcessingPdf && (
                  <div className="mt-5 flex items-center gap-3 text-emerald-700 font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" /> Procesando PDF y creando resumen inteligente...
                  </div>
                )}

                {uploadError && (
                  <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                    {uploadError}
                  </div>
                )}
              </section>

              <section className="grid lg:grid-cols-[280px_1fr] gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Documentos Cargados</h3>
                  <div className="space-y-2 max-h-[460px] overflow-auto pr-1">
                    {uploadedDocs.length === 0 && (
                      <p className="text-sm text-slate-500">Aún no hay documentos. Carga un PDF para comenzar.</p>
                    )}
                    {uploadedDocs.map((doc) => (
                      <button
                        type="button"
                        key={doc.id}
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          setUploadedReaderPage(readingProgress.uploaded[doc.id] ?? 0);
                          setViewMode('uploads');
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-colors ${
                          selectedDocId === doc.id
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-white border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4" />
                          <span className="font-bold text-sm line-clamp-1">{doc.title}</span>
                        </div>
                        <p className="text-xs text-slate-500">{doc.pages.length} páginas</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  {!selectedUpload ? (
                    <div className="h-full flex items-center justify-center text-center text-slate-500">
                      <div>
                        <Sparkles className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
                        <p className="font-semibold">Selecciona un documento para ver su resumen inteligente.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-black text-blue-950 tracking-tight">{selectedUpload.title}</h2>
                        <p className="text-slate-700 mt-4 text-lg leading-relaxed">{selectedUpload.overview}</p>
                        <button
                          type="button"
                          onClick={() => {
                            saveUploadedReadingProgress(selectedUpload.id, readingProgress.uploaded[selectedUpload.id] ?? 0);
                            setViewMode('uploadedReader');
                          }}
                          className="mt-5 inline-flex items-center gap-2 bg-blue-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-800"
                        >
                          <BookOpen className="w-4 h-4" /> Leer documento completo
                        </button>
                      </div>

                      <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Resumen Inteligente</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedUpload.keyPoints.map((point, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                              <p className="text-sm font-semibold text-slate-700">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Partición en Secciones</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedUpload.sections.map((section, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-[#fcfdfe] border border-slate-200">
                              <p className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-2">{section.title}</p>
                              <p className="text-sm text-slate-700 leading-relaxed">{section.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedUpload.highlights.length > 0 && (
                        <div>
                          <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4">Citas Clave Detectadas</h3>
                          <div className="space-y-3">
                            {selectedUpload.highlights.map((highlight) => (
                              <div key={highlight.no} className="p-5 rounded-2xl border border-amber-100 bg-amber-50/40">
                                <span className="inline-block px-2 py-1 bg-amber-500 text-white rounded-md text-[10px] font-bold mb-3">Cita {highlight.no}</span>
                                <p className="text-slate-700 italic">{highlight.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : viewMode === 'uploadedReader' ? (
            selectedUpload ? (
              <ReaderPanel
                pages={selectedUpload.pages}
                current={uploadedReaderPage}
                onChange={(page) => saveUploadedReadingProgress(selectedUpload.id, page)}
                label={`${selectedUpload.title} • Lectura Íntegra`}
                onShare={(chapter, paragraph) => shareToWhatsApp(selectedUpload.title, chapter, paragraph)}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
                <p className="text-slate-500 mb-4">No hay documento seleccionado para lectura.</p>
                <button type="button" onClick={() => setViewMode('uploads')} className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold">
                  Ir a Biblioteca IA
                </button>
              </div>
            )
          ) : viewMode === 'modules' ? (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-12 animate-in slide-in-from-right-4 duration-500">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-blue-100">
                    Numerales {currentSectionData.nos}
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-blue-950 mb-3 leading-none tracking-tight">
                  {currentSectionData.title}
                </h2>
                <p className="text-xl lg:text-2xl text-blue-800 font-serif italic mb-8 opacity-80">
                  {currentSectionData.subtitle}
                </p>
                <div className="p-8 bg-slate-50 rounded-[2rem] border-l-8 border-blue-900 shadow-inner">
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
                    {currentSectionData.summary}
                  </p>
                </div>
              </div>

              <div className="mb-14">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  Síntesis para la Escuela
                  <div className="h-px flex-1 bg-slate-200"></div>
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {currentSectionData.points ? (
                    currentSectionData.points.map((p, i) => (
                      <div key={i} className="group flex gap-5 p-5 rounded-2xl transition-all duration-300 border border-transparent hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 hover:shadow-lg transform hover:-translate-y-1">
                        <div className="mt-1 h-7 w-7 bg-blue-900 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110">
                          {i+1}
                        </div>
                        <p className="text-[15px] text-slate-600 leading-relaxed font-semibold">{p}</p>
                      </div>
                    ))
                  ) : (
                    currentSectionData.submodules?.map((m, i) => (
                      <div key={i} className="bg-[#fcfdfe] p-7 rounded-[1.5rem] border border-slate-100 group hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 hover:border-blue-200 transform hover:-translate-y-2 cursor-pointer">
                        <h4 className="font-black text-blue-900 mb-3 flex items-center justify-between uppercase text-xs tracking-wider">
                          {m.title}
                          <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-2 transition-all duration-300" />
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{m.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <section className="mt-16 bg-slate-50/30 p-2 rounded-[2.5rem]">
                <div className="bg-white p-8 lg:p-12 rounded-[2.3rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                    <BookOpen className="w-5 h-5" /> Fundamentación Textual
                  </h3>
                  <div className="space-y-10">
                    {currentSectionData.citations.map((cite, i) => (
                      <div key={i} className="relative p-10 bg-[#fffefc] rounded-[2rem] border-2 border-amber-50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-amber-200 hover:bg-gradient-to-br hover:from-amber-50/30 hover:to-orange-50/30 transform hover:-translate-y-1">
                        <span className="inline-block px-3 py-1 bg-amber-500 text-white rounded-lg font-black text-xs shadow-sm mb-6 transition-all duration-300 hover:bg-amber-600 hover:scale-105">
                          Numeral {cite.no}
                        </span>
                        <p className="text-xl font-serif text-slate-800 leading-[1.6] italic">
                          "{cite.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <ReaderPanel
              pages={fullDocumentPages}
              current={currentPage}
              onChange={saveBaseReadingProgress}
              label="Antiqua et Nova • Lectura Íntegra"
              onShare={(chapter, paragraph) => shareToWhatsApp('Antiqua et Nova', chapter, paragraph)}
            />
          )}

          {/* Widgets de Formación Infra */}
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-blue-900 text-white p-8 rounded-[2rem] shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105 transform cursor-pointer">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                <GraduationCap className="w-24 h-24" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Misión Educativa</h4>
              <p className="text-sm font-medium leading-relaxed">Inspirar la alegría del descubrimiento, no solo transferir datos automatizados.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transform hover:-translate-y-2 cursor-pointer group">
              <Scale className="text-blue-900 mb-5 w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-slate-400 group-hover:text-blue-600 transition-colors">Criterio Ético</h4>
              <p className="text-sm font-bold text-slate-700 leading-relaxed">Discernir lo que promueve la dignidad frente al reduccionismo digital.</p>
            </div>
            <div className="bg-amber-500 text-white p-8 rounded-[2rem] shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105 transform cursor-pointer">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">
                <ShieldAlert className="w-24 h-24" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Alerta Crítica</h4>
              <p className="text-sm font-medium leading-relaxed">Evitar que la IA bloquee la autonomía y la creatividad del estudiante.</p>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-slate-950 text-white py-20 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16">
          <div className="max-w-md">
            <h5 className="font-black text-3xl mb-6 uppercase tracking-tighter text-blue-400">Sapientia Scholastica App</h5>
            <p className="text-white text-sm leading-relaxed font-medium">
              Recurso académico para el estudio profundo de la Nota «Antiqua et Nova» (2025). 
              Propiedad intelectual y pedagógica desarrollada por el Prof. Carlos Fernando Arroyo bajo el amparo del Área de Formación Espiritual.
            </p>
            <div className="mt-8 flex items-center gap-4">
               <div className="h-10 w-10 bg-blue-900/30 rounded-lg flex items-center justify-center border border-blue-900/50">
                  <Cross className="w-5 h-5 text-blue-400" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Ad Maiorem Dei Gloriam</span>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-6">
            <p className="text-lg font-serif italic text-blue-200 border-b border-blue-900 pb-4">«La inteligencia es nada sin deleite» — n. 28</p>
            <div className="text-right">
              <p className="text-xs font-black uppercase text-gray-300 tracking-widest">Responsable de Contenidos</p>
              <p className="text-sm font-bold text-white mt-1">Prof. Carlos Fernando Arroyo</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black uppercase text-gray-300 tracking-widest">Area Educativa</p>
              <p className="text-sm font-bold text-white mt-1">Formación Espiritual</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-[10px] text-white font-mono flex justify-between">
           <span>© 2026 SAPÌENTIA SCHOLASTICA - AMBIENTE ACADÉMICO CATÓLICO</span>
           <span>ESTUDIO SOBRE LA IA Y LA DIGNIDAD HUMANA</span>
        </div>
      </footer>
    </div>
  );
};

export default App;