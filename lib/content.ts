export type SectionKey = 'introduccion' | 'definicion' | 'antropologia' | 'etica' | 'especificos' | 'sabiduria';

export type Citation = {
  no: string;
  text: string;
};

export type Submodule = {
  title: string;
  text: string;
};

export type SectionContent = {
  title: string;
  subtitle: string;
  nos: string;
  summary: string;
  citations: Citation[];
  points?: string[];
  submodules?: Submodule[];
};

export type FullDocumentPage = {
  chapter: string;
  content: string[];
};

export const documentData: Record<SectionKey, SectionContent> = {
  introduccion: {
    title: 'I. Introducción',
    subtitle: 'El don de la inteligencia y el cambio de época',
    nos: '1-6',
    summary: "La Iglesia sitúa el desarrollo de la IA en el marco de la creación del ser humano 'a imagen de Dios'. Se reconoce un 'cambio de época' donde la tecnología no solo remedia males, sino que cuestiona la identidad humana.",
    points: [
      'El don de la inteligencia como reflejo de la Sabiduría divina (n. 1).',
      'La colaboración humana en el perfeccionamiento de la creación (n. 2).',
      'Preocupación por la crisis de verdad y la autonomía de las máquinas (n. 3).',
      "Invitación a una renovada 'sabiduría del corazón' (n. 5).",
    ],
    citations: [
      {
        no: '1',
        text: '[Antiqua et nova] Con antigua y nueva sabiduría estamos llamados a considerar los cotidianos desafíos y oportunidades... La tradición cristiana considera que el don de la inteligencia es un aspecto esencial de la creación de los seres humanos «a imagen de Dios».',
      },
    ],
  },
  definicion: {
    title: 'II. ¿Qué es la Inteligencia Artificial?',
    subtitle: 'Diferenciación técnica y funcional',
    nos: '7-12',
    summary:
      "Se analiza la evolución de la IA desde 1956. Se distingue entre la 'IA débil' y la hipotética 'IA General'. Se critica la tendencia a antropomorfizar la computación.",
    points: [
      'La IA se basa en inferencias estadísticas, no en deducciones lógicas profundas (n. 8).',
      'Diferencia crítica: La IA tiene capacidades de tarea, pero NO de pensar (n. 12).',
      'El Test de Turing como medida funcional y reduccionista (n. 11).',
    ],
    citations: [
      {
        no: '10',
        text: 'En el contexto de la IA, la inteligencia se entiende en un sentido funcional, asumiendo que las actividades de la mente pueden descomponerse en pasos digitalizados.',
      },
    ],
  },
  antropologia: {
    title: 'III. Tradición Filosófica y Teológica',
    subtitle: 'La persona integral frente al cálculo',
    nos: '13-35',
    summary:
      'Define la antropología cristiana: el hombre como unidad de cuerpo y alma. La inteligencia humana es relacional, encarnada y busca la Verdad trascendente.',
    points: [
      'Intellectus (intuición) vs Ratio (discurso) (n. 14).',
      'El ser humano como ser esencialmente encarnado (n. 16).',
      'La inteligencia es relacional: aprendemos con los otros (n. 18).',
    ],
    citations: [
      {
        no: '34',
        text: 'El valor de una persona no depende de sus capacidades singulares... sino de su dignidad intrínseca basada en haber sido creada a imagen de Dios.',
      },
    ],
  },
  etica: {
    title: 'IV. El Papel de la Ética',
    subtitle: 'Guía para el desarrollo y uso',
    nos: '36-48',
    summary:
      'La técnica no es neutra. El desarrollo tecnológico debe estar al servicio del individuo y del bien común. Se enfatiza la responsabilidad humana.',
    points: [
      'La actividad técnico-científica no es neutra (n. 36).',
      'Solo el ser humano es un agente moral responsable (n. 39).',
      'Los algoritmos deben ser fiables y transparentes (n. 46).',
    ],
    citations: [
      {
        no: '46',
        text: 'Lo que hace la máquina es una elección técnica... El ser humano, en cambio, no sólo elige, sino que en su corazón es capaz de decidir.',
      },
    ],
  },
  especificos: {
    title: 'V. Cuestiones Específicas',
    subtitle: 'Aplicaciones y riesgos sectoriales',
    nos: '49-107',
    summary: 'Se detallan los impactos en áreas clave: Educación, Sanidad, Trabajo, Guerra y Casa Común.',
    submodules: [
      { title: 'Educación (n. 77-84)', text: "Formación integral 'cabeza, corazón, manos'. Centralidad del maestro." },
      { title: 'Relaciones (n. 56-63)', text: 'Riesgo de antropomorfización. La IA solo simula empatía.' },
      { title: 'Trabajo (n. 64-70)', text: 'La IA debe ayudar al juicio humano, no sustituirlo.' },
      { title: 'Guerra (n. 98-103)', text: 'Oposición a sistemas de armas autónomas letales.' },
    ],
    citations: [
      {
        no: '79',
        text: 'La presencia física del maestro crea una dinámica relacional que la IA no puede replicar... nutre el desarrollo integral del alumno.',
      },
    ],
  },
  sabiduria: {
    title: 'VI. Reflexión Final',
    subtitle: 'La verdadera sabiduría del corazón',
    nos: '108-117',
    summary: 'Conclusión teológica. La medida de la humanidad es el grado de caridad y la inclusión de los últimos.',
    points: [
      'Valorar si la IA nos hace mejores seres humanos (n. 109).',
      'La sabiduría es un don del Espíritu, no un algoritmo (n. 114).',
      'La caridad como medida de perfección (n. 116).',
    ],
    citations: [
      {
        no: '116',
        text: 'Lo que mide la perfección de las personas es su grado de caridad, no la cantidad de datos que acumulen.',
      },
    ],
  },
};

export const fullDocumentPages: FullDocumentPage[] = [
  {
    chapter: 'Portada y Título',
    content: [
      'ANTIQUA ET NOVA',
      'Nota sobre la relación entre la inteligencia artificial y la inteligencia humana',
      'Dicasterio para la Doctrina de la Fe',
      'Dicasterio para la Cultura y la Educación',
      '28 de Enero de 2025',
    ],
  },
  {
    chapter: 'I. Introducción',
    content: [
      '1. Con antigua y nueva sabiduría estamos llamados a considerar los cotidianos desafíos y oportunidades propuestos por el saber científico y tecnológico, en particular los del reciente desarrollo de la inteligencia artificial (IA). La tradición cristiana considera que el don de la inteligencia es un aspecto esencial de la creación de los seres humanos «a imagen de Dios» (Gen 1,27).',
      '2. La Iglesia promueve los progresos en la ciencia, viéndolos como parte de la «colaboración del hombre y de la mujer con Dios en el perfeccionamiento de la creación visible».',
      '4. La IA marca una nueva fase en la relación de la humanidad con la tecnología, situándose en un «cambio de época». Su influencia se siente en educación, trabajo, salud y derecho.',
    ],
  },
  {
    chapter: 'II. ¿Qué es la IA?',
    content: [
      '7. El concepto de inteligencia en la IA ha evolucionado desde 1956. Se define como hacer una máquina capaz de mostrar un comportamiento inteligente.',
      '8. Los sistemas contemporáneos se basan en inferencias estadísticas analizando grandes conjuntos de datos para identificar patrones y predecir efectos.',
      '10. Es un error usar la palabra inteligencia del mismo modo para humanos que para máquinas. En el humano es una facultad integral; en la IA es funcional y digitalizada.',
      '12. La IA tiene capacidades sofisticadas para realizar tareas, pero no la de pensar.',
    ],
  },
  {
    chapter: 'III. Tradición Filosófica y Teológica',
    content: [
      '14. Tomás de Aquino explica: «intelecto deriva de la penetración de la verdad; razón de la investigación discursiva». Son dos caras del único acto de entender.',
      '16. El pensamiento cristiano concibe al ser humano como unidad de cuerpo y alma. No somos un espíritu encerrado, sino seres encarnados.',
      '18. La inteligencia humana es relacional. No es una facultad aislada, se ejerce en el diálogo, la colaboración y la solidaridad.',
      '30. La IA obra realizando tareas basadas en datos cuantitativos, pero carece de la capacidad de evolucionar de forma orgánica a través del crecimiento psicológico y físico.',
    ],
  },
  {
    chapter: 'IV. Papel de la Ética',
    content: [
      '36. La actividad técnico-científica no es neutra. Pone en cuestión dimensiones humanísticas y culturales.',
      '39. Solo el ser humano es un agente moral, un sujeto responsable que ejerce su libertad siguiendo la voz de la conciencia.',
      '41. Los productos tecnológicos reflejan la visión del mundo de sus creadores y propietarios. Por tanto, deben evaluarse según el bien común.',
      '46. Quien utiliza la IA para realizar un trabajo es responsable del poder que ha delegado. Los algoritmos deben ser fiables, robustos y transparentes.',
    ],
  },
  {
    chapter: 'V. Cuestiones: Educación',
    content: [
      '77. La verdadera educación se propone la formación integral de la persona en orden a su fin último y al bien de la sociedad.',
      '79. En el centro está la relación indispensable maestro-alumno. El profesor es modelo e inspirador. La IA no puede replicar esta dinámica relacional física.',
      '81. El uso extensivo de la IA podría provocar dependencia tecnológica, bloqueando la autonomía de los estudiantes.',
      '82. La educación debe centrarse en promover el pensamiento crítico y el discernimiento en el uso de datos obtenidos en la web.',
    ],
  },
  {
    chapter: 'V. Cuestiones: Sociedad y Relaciones',
    content: [
      '52. Las tecnologías digitales han servido para aumentar desigualdades. La IA podría prolongar la marginación y crear nuevas formas de pobreza.',
      '59. Es crucial distinguir que la IA es una herramienta, no una persona. El lenguaje que antropomorfiza la IA borra la línea entre lo humano y lo artificial.',
      '61. Ninguna aplicación de IA es capaz de sentir empatía real. Las emociones requieren corporeidad y relación con la vida.',
      '63. Sustituir las relaciones reales por medios tecnológicos es un simulacro sin vida.',
    ],
  },
  {
    chapter: 'V. Cuestiones: Trabajo y Sanidad',
    content: [
      '67. La IA puede desespecializar trabajadores y someterlos a vigilancia automatizada si no se diseña para ayudarlos.',
      '68. Existe el riesgo de un beneficio desproporcionado para pocos a costa del empobrecimiento de muchos.',
      '73. En sanidad, si la IA sustituye la relación médico-paciente, se deshumaniza la estructura del cuidado.',
      '74. La carga de responsabilidad en las decisiones que afectan la vida debe permanecer siempre en manos de personas.',
    ],
  },
  {
    chapter: 'V. Cuestiones: Guerra y Casa Común',
    content: [
      "96. La 'nube' no es etérea; necesita máquinas y energía masiva. El desarrollo de la IA tiene un alto coste ambiental que debe ser gestionado.",
      '98. La paz es obra de la justicia. La IA bélica aleja la responsabilidad de la devastación causada.',
      '100. Los sistemas de armas autónomas letales carecen de juicio moral. Ninguna máquina debería elegir poner fin a una vida humana.',
    ],
  },
  {
    chapter: 'VI. Reflexión Final y Sabiduría',
    content: [
      '109. La cuestión fundamental es si el hombre, en este progreso, se hace de veras mejor, más responsable y abierto a los demás.',
      "112. El reto es evitar el 'reduccionismo digital'. La IA debe ser una herramienta complementaria, no sustituta de la riqueza humana.",
      "114. Necesitamos recuperar la 'sabiduría del corazón', la virtud que permite entrelazar el todo y las partes.",
      '116. Lo que mide la perfección es el grado de caridad. El modo como usemos la IA para incluir a los últimos es la medida de nuestra humanidad.',
    ],
  },
];
