// Fictional sample data for the clinic. All names, addresses and phone numbers are fictional.
// Prices and figures are demo samples. Once Sanity is connected, data of the same shape is read from the CMS.

import type { Clinic, Faq, TeamMember, Treatment, TrustNumbers } from "./types";

const h = (hh: number, mm = 0) => hh * 60 + mm;
const weekday = (a: [number, number][]) => a.map(([s, e]) => ({ start: s, end: e }));

export const CLINICS: Record<Clinic["region"], Clinic> = {
  es: {
    region: "es",
    key: "orela-bcn",
    name: "Orela Dental",
    area: "Gràcia · Barcelona",
    address: "Carrer de l'Exemple 00, 08012 Barcelona",
    phone: "+34 000 000 000",
    phoneHref: "tel:+34000000000",
    sos: "112",
    messaging: "whatsapp",
    schedule: {
      timeZone: "Europe/Madrid",
      weekly: {
        1: weekday([[h(9), h(14)], [h(15), h(20)]]),
        2: weekday([[h(9), h(14)], [h(15), h(20)]]),
        3: weekday([[h(9), h(14)], [h(15), h(20)]]),
        4: weekday([[h(9), h(14)], [h(15), h(20)]]),
        5: weekday([[h(9), h(14)], [h(15), h(19)]]),
        6: weekday([[h(10), h(14)]]),
      },
      closedDates: ["2026-12-08", "2026-12-25", "2026-12-26", "2027-01-01", "2027-01-06"],
    },
  },
  us: {
    region: "us",
    key: "orela-hou",
    name: "Orela Dental",
    area: "Bellaire · Houston, TX",
    address: "0000 Example Blvd, Houston, TX 77000",
    phone: "(713) 555-0142",
    phoneHref: "tel:+17135550142",
    sos: "911",
    messaging: "sms",
    schedule: {
      timeZone: "America/Chicago",
      weekly: {
        1: weekday([[h(8), h(12)], [h(13), h(18)]]),
        2: weekday([[h(8), h(12)], [h(13), h(18)]]),
        3: weekday([[h(8), h(12)], [h(13), h(18)]]),
        4: weekday([[h(8), h(12)], [h(13), h(18)]]),
        5: weekday([[h(8), h(14)]]),
      },
      closedDates: ["2026-11-26", "2026-11-27", "2026-12-24", "2026-12-25", "2027-01-01"],
    },
  },
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "checkup",
    minutes: 45,
    priceFrom: 65,
    us: { kind: "covered" },
    bookable: true,
    name: { en: "First visit and X-rays", es: "Primera visita y radiografías", ca: "Primera visita i radiografies", fr: "Première visite et radios" },
    summary: {
      en: "A full check of teeth and gums, with X-rays and a written plan.",
      es: "Revisión completa de dientes y encías, con radiografías y un plan por escrito.",
      ca: "Revisió completa de dents i genives, amb radiografies i un pla per escrit.",
      fr: "Un bilan complet des dents et des gencives, avec radios et un plan écrit.",
    },
    body: {
      en: "We look at every tooth, take the X-rays you need and explain what we see on screen. You leave with a written plan and prices for any treatment, so you can decide at home.",
      es: "Revisamos cada diente, hacemos las radiografías necesarias y te explicamos en pantalla lo que vemos. Te llevas un plan por escrito con los precios, para decidir con calma en casa.",
      ca: "Revisem cada dent, fem les radiografies necessàries i t'expliquem a la pantalla el que veiem. T'emportes un pla per escrit amb els preus, per decidir amb calma a casa.",
      fr: "Nous examinons chaque dent, faisons les radios nécessaires et vous expliquons à l'écran ce que nous voyons. Vous repartez avec un plan écrit et les tarifs, pour décider tranquillement chez vous.",
    },
  },
  {
    slug: "cleaning",
    minutes: 45,
    priceFrom: 55,
    us: { kind: "covered" },
    bookable: true,
    name: { en: "Cleaning", es: "Limpieza", ca: "Neteja", fr: "Détartrage" },
    summary: {
      en: "Professional cleaning with your own hygienist, every six months.",
      es: "Limpieza profesional con tu higienista de siempre, cada seis meses.",
      ca: "Neteja professional amb la teva higienista de sempre, cada sis mesos.",
      fr: "Détartrage avec votre hygiéniste attitré(e), tous les six mois.",
    },
    body: {
      en: "The same hygienist sees you at every visit, so they know your history. We send a reminder when your next cleaning is due.",
      es: "La misma higienista te atiende en cada visita y conoce tu historial. Te avisamos cuando toque la próxima limpieza.",
      ca: "La mateixa higienista t'atén a cada visita i coneix el teu historial. T'avisem quan toqui la propera neteja.",
      fr: "Le même hygiéniste vous reçoit à chaque visite et connaît votre historique. Nous vous prévenons quand le prochain détartrage approche.",
    },
  },
  {
    slug: "filling",
    minutes: 40,
    priceFrom: 70,
    us: { kind: "monthly", from: 39 },
    bookable: true,
    name: { en: "Fillings", es: "Empastes", ca: "Empastaments", fr: "Obturations" },
    summary: {
      en: "White fillings that match your teeth, usually done in one visit.",
      es: "Empastes del color del diente, normalmente en una sola visita.",
      ca: "Empastaments del color de la dent, normalment en una sola visita.",
      fr: "Obturations couleur dent, en général en une seule visite.",
    },
    body: {
      en: "We use white composite that matches your teeth. The price depends on the size of the filling; you see it before we start.",
      es: "Usamos composite del color del diente. El precio depende del tamaño del empaste y lo ves antes de empezar.",
      ca: "Fem servir composite del color de la dent. El preu depèn de la mida de l'empastament i el veus abans de començar.",
      fr: "Nous utilisons un composite couleur dent. Le prix dépend de la taille de l'obturation ; vous le voyez avant de commencer.",
    },
  },
  {
    slug: "implants",
    minutes: 90,
    priceFrom: 1150,
    us: { kind: "monthly", from: 89 },
    bookable: true,
    name: { en: "Dental implants", es: "Implantes dentales", ca: "Implants dentals", fr: "Implants dentaires" },
    summary: {
      en: "Replace a missing tooth with an implant and crown.",
      es: "Sustituye un diente perdido con un implante y una corona.",
      ca: "Substitueix una dent perduda amb un implant i una corona.",
      fr: "Remplacez une dent manquante par un implant et une couronne.",
    },
    body: {
      en: "We start with a 3D scan and a written plan. The price shown is for one implant; the crown is quoted separately.",
      es: "Empezamos con un escáner 3D y un plan por escrito. El precio es de un implante; la corona se presupuesta aparte.",
      ca: "Comencem amb un escàner 3D i un pla per escrit. El preu és d'un implant; la corona es pressuposta a part.",
      fr: "Nous commençons par un scanner 3D et un plan écrit. Le prix indiqué concerne un implant ; la couronne fait l'objet d'un devis séparé.",
    },
  },
  {
    slug: "aligners",
    minutes: 60,
    priceFrom: 2400,
    us: { kind: "monthly", from: 129 },
    bookable: true,
    name: { en: "Clear aligners", es: "Ortodoncia invisible", ca: "Ortodòncia invisible", fr: "Aligneurs transparents" },
    summary: {
      en: "Straighten your teeth with clear, removable aligners.",
      es: "Alinea tus dientes con férulas transparentes y removibles.",
      ca: "Alinea les dents amb fèrules transparents i extraïbles.",
      fr: "Alignez vos dents avec des gouttières transparentes et amovibles.",
    },
    body: {
      en: "After a scan you see a preview of the result before you decide. Check-ups every six to eight weeks.",
      es: "Tras el escáner ves una simulación del resultado antes de decidir. Revisiones cada seis u ocho semanas.",
      ca: "Després de l'escàner veus una simulació del resultat abans de decidir. Revisions cada sis o vuit setmanes.",
      fr: "Après le scanner, vous voyez une simulation du résultat avant de décider. Contrôles toutes les six à huit semaines.",
    },
  },
  {
    slug: "whitening",
    minutes: 60,
    priceFrom: 290,
    us: { kind: "fee", amount: 399 },
    bookable: true,
    name: { en: "Whitening", es: "Blanqueamiento", ca: "Blanquejament", fr: "Blanchiment" },
    summary: {
      en: "In-clinic whitening after a check-up.",
      es: "Blanqueamiento en clínica, después de una revisión.",
      ca: "Blanquejament a la clínica, després d'una revisió.",
      fr: "Blanchiment au cabinet, après un contrôle.",
    },
    body: {
      en: "We check your teeth first, because whitening is not suitable for everyone. The session takes about an hour.",
      es: "Primero revisamos tus dientes, porque el blanqueamiento no es para todo el mundo. La sesión dura una hora.",
      ca: "Primer revisem les dents, perquè el blanquejament no és per a tothom. La sessió dura una hora.",
      fr: "Nous vérifions d'abord vos dents, car le blanchiment ne convient pas à tout le monde. La séance dure environ une heure.",
    },
  },
  {
    slug: "emergency",
    minutes: 20,
    priceFrom: 50,
    us: { kind: "fee", amount: 95 },
    bookable: false,
    name: { en: "Same-day emergency", es: "Urgencias del día", ca: "Urgències del dia", fr: "Urgences du jour" },
    summary: {
      en: "Broken tooth or lost filling? Take a place in today's queue.",
      es: "¿Diente roto o empaste caído? Pide turno en la lista de urgencias de hoy.",
      ca: "Dent trencada o empastament caigut? Agafa número a la cua d'avui.",
      fr: "Dent cassée ou plombage tombé ? Prenez un ticket dans la file du jour.",
    },
    body: {
      en: "We keep time every day for emergencies. Take a place online and we tell you roughly how long the wait is.",
      es: "Cada día reservamos tiempo para urgencias. Pide turno en línea y te decimos, más o menos, cuánto falta.",
      ca: "Cada dia reservem temps per a urgències. Agafa número en línia i et diem quant falta, més o menys.",
      fr: "Nous gardons du temps chaque jour pour les urgences. Prenez un ticket en ligne et nous vous indiquons l'attente approximative.",
    },
  },
];

export const TEAM: TeamMember[] = [
  {
    region: "es", name: "Dra. Laia Ferrer", hygienist: false, languages: ["es", "ca", "en"],
    role: { en: "Dentist, implants", es: "Odontóloga, implantes", ca: "Odontòloga, implants", fr: "Dentiste, implants" },
    bio: { en: "Leads the implant and 3D planning work.", es: "Dirige los implantes y la planificación en 3D.", ca: "Dirigeix els implants i la planificació en 3D.", fr: "Responsable des implants et de la planification 3D." },
  },
  {
    region: "es", name: "Dr. Hugo Martel", hygienist: false, languages: ["es", "fr", "en"],
    role: { en: "Dentist, aligners", es: "Odontólogo, ortodoncia", ca: "Odontòleg, ortodòncia", fr: "Dentiste, orthodontie" },
    bio: { en: "Looks after aligner treatment and family check-ups.", es: "Se ocupa de la ortodoncia invisible y las revisiones familiares.", ca: "S'ocupa de l'ortodòncia invisible i les revisions familiars.", fr: "S'occupe des aligneurs et des contrôles en famille." },
  },
  {
    region: "es", name: "Núria Vidal", hygienist: true, languages: ["ca", "es", "en"],
    role: { en: "Dental hygienist", es: "Higienista dental", ca: "Higienista dental", fr: "Hygiéniste dentaire" },
    bio: { en: "Your hygienist for cleanings and six-month check-ups.", es: "Tu higienista para limpiezas y revisiones semestrales.", ca: "La teva higienista per a netejes i revisions semestrals.", fr: "Votre hygiéniste pour les détartrages et les contrôles semestriels." },
  },
  {
    region: "us", name: "Dr. Elena Ruiz, DDS", hygienist: false, languages: ["en", "es"],
    role: { en: "General dentist", es: "Dentista general", ca: "Dentista general", fr: "Dentiste généraliste" },
    bio: { en: "Family dentistry, fillings and same-day emergencies.", es: "Odontología familiar, empastes y urgencias del día.", ca: "Odontologia familiar, empastaments i urgències del dia.", fr: "Soins familiaux, obturations et urgences du jour." },
  },
  {
    region: "us", name: "Dr. James Okafor, DMD", hygienist: false, languages: ["en"],
    role: { en: "Implants and aligners", es: "Implantes y ortodoncia", ca: "Implants i ortodòncia", fr: "Implants et orthodontie" },
    bio: { en: "Plans implant and aligner cases with 3D scans.", es: "Planifica implantes y ortodoncia con escáner 3D.", ca: "Planifica implants i ortodòncia amb escàner 3D.", fr: "Planifie implants et aligneurs avec scanner 3D." },
  },
  {
    region: "us", name: "Maria Delgado, RDH", hygienist: true, languages: ["en", "es"],
    role: { en: "Registered dental hygienist", es: "Higienista dental", ca: "Higienista dental", fr: "Hygiéniste dentaire" },
    bio: { en: "Your hygienist for cleanings and recall visits.", es: "Tu higienista para limpiezas y revisiones periódicas.", ca: "La teva higienista per a netejes i revisions.", fr: "Votre hygiéniste pour les détartrages et les rappels." },
  },
];

export const FAQS: Faq[] = [
  {
    region: "both", topic: "booking",
    question: { en: "How do I book?", es: "¿Cómo pido cita?", ca: "Com demano cita?", fr: "Comment prendre rendez-vous ?" },
    answer: {
      en: "Pick a free time on the home page or the booking page. You get a confirmation and a reminder the day before.",
      es: "Elige una hora libre en la portada o en la página de citas. Recibes una confirmación y un recordatorio el día antes.",
      ca: "Tria una hora lliure a la portada o a la pàgina de cites. Reps una confirmació i un recordatori el dia abans.",
      fr: "Choisissez un créneau libre sur la page d'accueil ou la page de réservation. Vous recevez une confirmation et un rappel la veille.",
    },
  },
  {
    region: "both", topic: "cancel",
    question: { en: "Can I change or cancel?", es: "¿Puedo cambiar o anular la cita?", ca: "Puc canviar o anul·lar la cita?", fr: "Puis-je modifier ou annuler ?" },
    answer: {
      en: "Yes. Reply to the reminder message. If you cancel, we offer the time to someone on the waiting list.",
      es: "Sí. Responde al mensaje de recordatorio. Si anulas, ofrecemos la hora a alguien de la lista de espera.",
      ca: "Sí. Respon al missatge de recordatori. Si anul·les, oferim l'hora a algú de la llista d'espera.",
      fr: "Oui. Répondez au message de rappel. Si vous annulez, nous proposons le créneau à une personne de la liste d'attente.",
    },
  },
  {
    region: "both", topic: "emergency",
    question: { en: "Do you see emergencies?", es: "¿Atienden urgencias?", ca: "Atengueu urgències?", fr: "Recevez-vous les urgences ?" },
    answer: {
      en: "Yes, every day we are open. Take a place in the emergency queue online, or call us.",
      es: "Sí, todos los días que abrimos. Pide turno en línea en la lista de urgencias o llámanos.",
      ca: "Sí, tots els dies que obrim. Agafa número a la cua d'urgències en línia o truca'ns.",
      fr: "Oui, chaque jour d'ouverture. Prenez un ticket en ligne ou appelez-nous.",
    },
  },
  {
    region: "es", topic: "prices",
    question: { en: "Are prices fixed?", es: "¿Los precios son cerrados?", ca: "Els preus són tancats?", fr: "Les tarifs sont-ils fixes ?" },
    answer: {
      en: "Each treatment has a starting price. After the first visit you get a written quote before any work starts.",
      es: "Cada tratamiento tiene un precio de partida. Después de la primera visita recibes un presupuesto por escrito antes de empezar.",
      ca: "Cada tractament té un preu de partida. Després de la primera visita reps un pressupost per escrit abans de començar.",
      fr: "Chaque soin a un prix de départ. Après la première visite, vous recevez un devis écrit avant tout traitement.",
    },
  },
  {
    region: "us", topic: "insurance",
    question: { en: "Do you take my insurance?", es: "¿Aceptan mi seguro?", ca: "Accepteu la meva assegurança?", fr: "Acceptez-vous mon assurance ?" },
    answer: {
      en: "We accept most PPO plans and check your coverage before your visit. Monthly payment plans are available.",
      es: "Aceptamos la mayoría de los planes PPO y revisamos tu cobertura antes de la visita. Hay planes de pago mensual.",
      ca: "Acceptem la majoria de plans PPO i revisem la cobertura abans de la visita. Hi ha plans de pagament mensual.",
      fr: "Nous acceptons la plupart des plans PPO et vérifions votre couverture avant la visite. Des paiements mensuels sont possibles.",
    },
  },
  {
    region: "both", topic: "languages",
    question: { en: "Which languages do you speak?", es: "¿Qué idiomas hablan?", ca: "Quins idiomes parleu?", fr: "Quelles langues parlez-vous ?" },
    answer: {
      en: "See each team member's languages on the team page.",
      es: "En la página del equipo verás los idiomas de cada persona.",
      ca: "A la pàgina de l'equip veuràs els idiomes de cada persona.",
      fr: "Les langues de chaque membre de l'équipe figurent sur la page équipe.",
    },
  },
];

export const TRUST: TrustNumbers = { rating: 4.9, years: 12 };
