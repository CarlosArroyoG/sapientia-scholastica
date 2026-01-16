import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Info,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Scale,
  Cross,
  Globe,
  ShieldCheck,
  ShieldAlert,
  Search,
  User,
  Book as BookIcon,
  ChevronLeft,
  ChevronRight,
  Layout
} from 'lucide-react';

const App = () => {
  const [activeSection, setActiveSection] = useState('introduccion');
  const [viewMode, setViewMode] = useState('modules'); // 'modules' o 'reader'
  const [currentPage, setCurrentPage] = useState(0);

  // Estructura de síntesis (Módulos)
  const documentData = {
    introduccion: {
      title: "I. Introducción",
      subtitle: "El don de la inteligencia y el cambio de época",
      nos: "1-6",
      summary: "La Iglesia sitúa el desarrollo de la IA en el marco de la creación del ser humano 'a imagen de Dios'. Se reconoce un 'cambio de época' donde la tecnología no solo remedia males, sino que cuestiona la identidad humana.",
      points: [
        "El don de la inteligencia como reflejo de la Sabiduría divina (n. 1).",
        "La colaboración humana en el perfeccionamiento de la creación (n. 2).",
        "Preocupación por la crisis de verdad y la autonomía de las máquinas (n. 3).",
        "Invitación a una renovada 'sabiduría del corazón' (n. 5)."
      ],
      citations: [
        { no: "1", text: "[Antiqua et nova] Con antigua y nueva sabiduría estamos llamados a considerar los cotidianos desafíos y oportunidades... La tradición cristiana considera que el don de la inteligencia es un aspecto esencial de la creación de los seres humanos «a imagen de Dios»." }
      ]
    },
    definicion: {
      title: "II. ¿Qué es la Inteligencia Artificial?",
      subtitle: "Diferenciación técnica y funcional",
      nos: "7-12",
      summary: "Se analiza la evolución de la IA desde 1956. Se distingue entre la 'IA débil' y la hipotética 'IA General'. Se critica la tendencia a antropomorfizar la computación.",
      points: [
        "La IA se basa en inferencias estadísticas, no en deducciones lógicas profundas (n. 8).",
        "Diferencia crítica: La IA tiene capacidades de tarea, pero NO de pensar (n. 12).",
        "El Test de Turing como medida funcional y reduccionista (n. 11)."
      ],
      citations: [
        { no: "10", text: "En el contexto de la IA, la inteligencia se entiende en un sentido funcional, asumiendo que las actividades de la mente pueden descomponerse en pasos digitalizados." }
      ]
    },
    antropologia: {
      title: "III. Tradición Filosófica y Teológica",
      subtitle: "La persona integral frente al cálculo",
      nos: "13-35",
      summary: "Define la antropología cristiana: el hombre como unidad de cuerpo y alma. La inteligencia humana es relacional, encarnada y busca la Verdad trascendente.",
      points: [
        "Intellectus (intuición) vs Ratio (discurso) (n. 14).",
        "El ser humano como ser esencialmente encarnado (n. 16).",
        "La inteligencia es relacional: aprendemos con los otros (n. 18)."
      ],
      citations: [
        { no: "34", text: "El valor de una persona no depende de sus capacidades singulares... sino de su dignidad intrínseca basada en haber sido creada a imagen de Dios." }
      ]
    },
    etica: {
      title: "IV. El Papel de la Ética",
      subtitle: "Guía para el desarrollo y uso",
      nos: "36-48",
      summary: "La técnica no es neutra. El desarrollo tecnológico debe estar al servicio del individuo y del bien común. Se enfatiza la responsabilidad humana.",
      points: [
        "La actividad técnico-científica no es neutra (n. 36).",
        "Solo el ser humano es un agente moral responsable (n. 39).",
        "Los algoritmos deben ser fiables y transparentes (n. 46)."
      ],
      citations: [
        { no: "46", text: "Lo que hace la máquina es una elección técnica... El ser humano, en cambio, no sólo elige, sino que en su corazón es capaz de decidir." }
      ]
    },
    especificos: {
      title: "V. Cuestiones Específicas",
      subtitle: "Aplicaciones y riesgos sectoriales",
      nos: "49-107",
      summary: "Se detallan los impactos en áreas clave: Educación, Sanidad, Trabajo, Guerra y Casa Común.",
      submodules: [
        { title: "Educación (n. 77-84)", text: "Formación integral 'cabeza, corazón, manos'. Centralidad del maestro." },
        { title: "Relaciones (n. 56-63)", text: "Riesgo de antropomorfización. La IA solo simula empatía." },
        { title: "Trabajo (n. 64-70)", text: "La IA debe ayudar al juicio humano, no sustituirlo." },
        { title: "Guerra (n. 98-103)", text: "Oposición a sistemas de armas autónomas letales." }
      ],
      citations: [
        { no: "79", text: "La presencia física del maestro crea una dinámica relacional que la IA no puede replicar... nutre el desarrollo integral del alumno." }
      ]
    },
    sabiduria: {
      title: "VI. Reflexión Final",
      subtitle: "La verdadera sabiduría del corazón",
      nos: "108-117",
      summary: "Conclusión teológica. La medida de la humanidad es el grado de caridad y la inclusión de los últimos.",
      points: [
        "Valorar si la IA nos hace mejores seres humanos (n. 109).",
        "La sabiduría es un don del Espíritu, no un algoritmo (n. 114).",
        "La caridad como medida de perfección (n. 116)."
      ],
      citations: [
        { no: "116", text: "Lo que mide la perfección de las personas es su grado de caridad, no la cantidad de datos que acumulen." }
      ]
    }
  };

  // Contenido íntegro segmentado para el Lector Digital (Digital Book)
  const fullDocumentPages = [
    {
      chapter: "Portada y Título",
      content: [
        "ANTIQUA ET NOVA",
        "Nota sobre la relación entre la inteligencia artificial y la inteligencia humana",
        "Dicasterio para la Doctrina de la Fe",
        "Dicasterio para la Cultura y la Educación",
        "28 de Enero de 2025"
      ]
    },
    {
      chapter: "I. Introducción",
      content: [
        "1. Con antigua y nueva sabiduría estamos llamados a considerar los cotidianos desafíos y oportunidades propuestos por el saber científico y tecnológico, en particular los del reciente desarrollo de la inteligencia artificial (IA). La tradición cristiana considera que el don de la inteligencia es un aspecto esencial de la creación de los seres humanos «a imagen de Dios» (Gen 1,27).",
        "2. La Iglesia promueve los progresos en la ciencia, viéndolos como parte de la «colaboración del hombre y de la mujer con Dios en el perfeccionamiento de la creación visible».",
        "4. La IA marca una nueva fase en la relación de la humanidad con la tecnología, situándose en un «cambio de época». Su influencia se siente en educación, trabajo, salud y derecho."
      ]
    },
    {
      chapter: "II. ¿Qué es la IA?",
      content: [
        "7. El concepto de inteligencia en la IA ha evolucionado desde 1956. Se define como hacer una máquina capaz de mostrar un comportamiento inteligente.",
        "8. Los sistemas contemporáneos se basan en inferencias estadísticas analizando grandes conjuntos de datos para identificar patrones y predecir efectos.",
        "10. Es un error usar la palabra inteligencia del mismo modo para humanos que para máquinas. En el humano es una facultad integral; en la IA es funcional y digitalizada.",
        "12. La IA tiene capacidades sofisticadas para realizar tareas, pero no la de pensar."
      ]
    },
    {
      chapter: "III. Tradición Filosófica y Teológica",
      content: [
        "14. Tomás de Aquino explica: «intelecto deriva de la penetración de la verdad; razón de la investigación discursiva». Son dos caras del único acto de entender.",
        "16. El pensamiento cristiano concibe al ser humano como unidad de cuerpo y alma. No somos un espíritu encerrado, sino seres encarnados.",
        "18. La inteligencia humana es relacional. No es una facultad aislada, se ejerce en el diálogo, la colaboración y la solidaridad.",
        "30. La IA obra realizando tareas basadas en datos cuantitativos, pero carece de la capacidad de evolucionar de forma orgánica a través del crecimiento psicológico y físico."
      ]
    },
    {
      chapter: "IV. Papel de la Ética",
      content: [
        "36. La actividad técnico-científica no es neutra. Pone en cuestión dimensiones humanísticas y culturales.",
        "39. Solo el ser humano es un agente moral, un sujeto responsable que ejerce su libertad siguiendo la voz de la conciencia.",
        "41. Los productos tecnológicos reflejan la visión del mundo de sus creadores y propietarios. Por tanto, deben evaluarse según el bien común.",
        "46. Quien utiliza la IA para realizar un trabajo es responsable del poder que ha delegado. Los algoritmos deben ser fiables, robustos y transparentes."
      ]
    },
    {
      chapter: "V. Cuestiones: Educación",
      content: [
        "77. La verdadera educación se propone la formación integral de la persona en orden a su fin último y al bien de la sociedad.",
        "79. En el centro está la relación indispensable maestro-alumno. El profesor es modelo e inspirador. La IA no puede replicar esta dinámica relacional física.",
        "81. El uso extensivo de la IA podría provocar dependencia tecnológica, bloqueando la autonomía de los estudiantes.",
        "82. La educación debe centrarse en promover el pensamiento crítico y el discernimiento en el uso de datos obtenidos en la web."
      ]
    },
    {
      chapter: "V. Cuestiones: Sociedad y Relaciones",
      content: [
        "52. Las tecnologías digitales han servido para aumentar desigualdades. La IA podría prolongar la marginación y crear nuevas formas de pobreza.",
        "59. Es crucial distinguir que la IA es una herramienta, no una persona. El lenguaje que antropomorfiza la IA borra la línea entre lo humano y lo artificial.",
        "61. Ninguna aplicación de IA es capaz de sentir empatía real. Las emociones requieren corporeidad y relación con la vida.",
        "63. Sustituir las relaciones reales por medios tecnológicos es un simulacro sin vida."
      ]
    },
    {
      chapter: "V. Cuestiones: Trabajo y Sanidad",
      content: [
        "67. La IA puede desespecializar trabajadores y someterlos a vigilancia automatizada si no se diseña para ayudarlos.",
        "68. Existe el riesgo de un beneficio desproporcionado para pocos a costa del empobrecimiento de muchos.",
        "73. En sanidad, si la IA sustituye la relación médico-paciente, se deshumaniza la estructura del cuidado.",
        "74. La carga de responsabilidad en las decisiones que afectan la vida debe permanecer siempre en manos de personas."
      ]
    },
    {
      chapter: "V. Cuestiones: Guerra y Casa Común",
      content: [
        "96. La 'nube' no es etérea; necesita máquinas y energía masiva. El desarrollo de la IA tiene un alto coste ambiental que debe ser gestionado.",
        "98. La paz es obra de la justicia. La IA bélica aleja la responsabilidad de la devastación causada.",
        "100. Los sistemas de armas autónomas letales carecen de juicio moral. Ninguna máquina debería elegir poner fin a una vida humana."
      ]
    },
    {
      chapter: "VI. Reflexión Final y Sabiduría",
      content: [
        "109. La cuestión fundamental es si el hombre, en este progreso, se hace de veras mejor, más responsable y abierto a los demás.",
        "112. El reto es evitar el 'reduccionismo digital'. La IA debe ser una herramienta complementaria, no sustituta de la riqueza humana.",
        "114. Necesitamos recuperar la 'sabiduría del corazón', la virtud que permite entrelazar el todo y las partes.",
        "116. Lo que mide la perfección es el grado de caridad. El modo como usemos la IA para incluir a los últimos es la medida de nuestra humanidad."
      ]
    }
  ];

  const NavButton = ({ id, title, icon }) => (
    <button 
      onClick={() => { setActiveSection(id); setViewMode('modules'); }}
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
          
          <button 
            onClick={() => setViewMode('reader')}
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
          {viewMode === 'modules' ? (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-12 animate-in slide-in-from-right-4 duration-500">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-blue-100">
                    Numerales {documentData[activeSection].nos}
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-blue-950 mb-3 leading-none tracking-tight">
                  {documentData[activeSection].title}
                </h2>
                <p className="text-xl lg:text-2xl text-blue-800 font-serif italic mb-8 opacity-80">
                  {documentData[activeSection].subtitle}
                </p>
                <div className="p-8 bg-slate-50 rounded-[2rem] border-l-8 border-blue-900 shadow-inner">
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
                    {documentData[activeSection].summary}
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
                  {documentData[activeSection].points ? (
                    documentData[activeSection].points.map((p, i) => (
                      <div key={i} className="flex gap-5 p-5 rounded-2xl transition-all duration-300 border border-transparent hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                        <div className="mt-1 h-7 w-7 bg-blue-900 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110">
                          {i+1}
                        </div>
                        <p className="text-[15px] text-slate-600 leading-relaxed font-semibold">{p}</p>
                      </div>
                    ))
                  ) : (
                    documentData[activeSection].submodules.map((m, i) => (
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
                    {documentData[activeSection].citations.map((cite, i) => (
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
            /* LECTOR DIGITAL (Digital Book Mode) */
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col min-h-[700px] animate-in zoom-in-95 duration-500">
              {/* Navegación del Lector */}
              <div className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookIcon className="text-amber-400 w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest opacity-80">Antiqua et Nova • Lectura Íntegra</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Página {currentPage + 1} de {fullDocumentPages.length}
                </div>
              </div>

              {/* Contenido de la Página */}
              <div className="flex-1 p-10 lg:p-20 bg-[#faf9f6] relative">
                {/* Marcas de Agua / Estilo de Libro */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-slate-100/50 hidden lg:block"></div>
                
                <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
                  <span className="text-blue-900 font-black text-[10px] uppercase tracking-[0.3em] mb-6 block text-center">
                    {fullDocumentPages[currentPage].chapter}
                  </span>
                  
                  <div className="space-y-8">
                    {fullDocumentPages[currentPage].content.map((p, i) => (
                      <p key={i} className={`text-slate-800 leading-relaxed font-serif ${currentPage === 0 ? 'text-center text-3xl font-black text-blue-950 py-4' : 'text-lg text-justify'}`}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controles del Libro */}
              <div className="bg-white border-t border-slate-100 p-6 flex items-center justify-between">
                <button 
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-900 font-bold transition-all duration-300 disabled:opacity-20 hover:scale-110 transform"
                >
                  <ChevronLeft className="w-6 h-6 transition-transform hover:-translate-x-1" /> Anterior
                </button>

                <div className="flex gap-2">
                  {fullDocumentPages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 hover:h-2 cursor-pointer ${currentPage === i ? 'w-8 bg-blue-900' : 'w-2 bg-slate-200 hover:bg-blue-400'}`}
                      onClick={() => setCurrentPage(i)}
                    ></div>
                  ))}
                </div>

                <button 
                  disabled={currentPage === fullDocumentPages.length - 1}
                  onClick={() => setCurrentPage(prev => Math.min(fullDocumentPages.length - 1, prev + 1))}
                  className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-bold transition-all duration-300 disabled:opacity-20 hover:scale-110 transform"
                >
                  Siguiente <ChevronRight className="w-6 h-6 transition-transform hover:translate-x-1" />
                </button>
              </div>
            </div>
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