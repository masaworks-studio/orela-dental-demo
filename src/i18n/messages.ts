// Fixed short texts such as buttons and headings. Clinic content (treatments, team, FAQ) lives in the CMS.
// ca and fr are not yet checked by native speakers (stated on the "how it was made" page).

import type { Locale } from "./config";

export type Messages = {
  demoNotice: string;
  nav: { home: string; treatments: string; allTreatments: string; prices: string; insurance: string; clinic: string; team: string; faq: string; contact: string; emergency: string; menu: string; close: string };
  status: { open: string; closed: string; closesIn: string; closesAt: string; opensToday: string; opensTomorrow: string; opensOn: string };
  hero: { title: string; lede: string };
  book: { heading: string; cta: string; short: string; pick: string; sample: string; none: string; all: string };
  call: string;
  facts: { rating: string; years: string; languages: string };
  photo: string;
  aiLabel: string;
  aiVideoLabel: string;
  motion: { pause: string; play: string };
  photoAlt: { hero: string; team: string; treatment: string };
  sections: { treatments: string; prices: string; insurance: string; seeAll: string };
  from: string;
  emergency: {
    title: string; lede: string; waiting: string; wait: string; take: string; taken: string; closed: string; closingSoon: string;
    notDiagnosis: string; strip: string;
  };
  form: { name: string; phone: string; treatment: string; time: string; submit: string; sentNot: string; step: string; back: string; review: string; next: string };
  footer: { hours: string; address: string; phone: string; privacy: string; cookies: string; languageHelp: string; demo: string; aiImages: string };
  hours: string;
  closedDay: string;
  minutes: string;
  chat: { open: string; title: string; placeholder: string; send: string; intro: string; disclaimer: string; aiTag: string; aiNote: string };
  cookie: { title: string; body: string; reject: string; accept: string; settings: string; sample: string };
  map: { title: string; after: string; illustration: string; larger: string };
  wa: {
    whatsapp: string; sms: string; status: string; demo: string; demoSms: string; welcome: string; hint: string; placeholder: string; close: string;
    menu: { book: string; change: string; emergency: string; location: string; human: string };
    pickTreatment: string; pickSlot: string; noSlots: string; askName: string; booked: string; queueOpen: string; seeMap: string; again: string; viewOptions: string; checkupShort: string;
  };
  style: string;
  region: string;
  language: string;
};

const en: Messages = {
  demoNotice: "Demo site based on real dental clinic websites. The clinic, people, address and phone number are fictional.",
  nav: { home: "Home", treatments: "Treatments", allTreatments: "All treatments", prices: "Prices", insurance: "Insurance", clinic: "Clinic", team: "Team", faq: "FAQ", contact: "Contact", emergency: "Emergency", menu: "Menu", close: "Close" },
  status: { open: "Open now", closed: "Closed now", closesIn: "Closes in {t}", closesAt: "until {t}", opensToday: "Opens today at {t}", opensTomorrow: "Opens tomorrow at {t}", opensOn: "Opens {d} at {t}" },
  hero: { title: "See a dentist this week.", lede: "Pick a time and you're booked. We send a reminder the day before." },
  book: { heading: "Next free times", cta: "Book this time", short: "Book", pick: "Choose a time", sample: "Sample times for this demo. Nothing is sent.", none: "No free times in the next two weeks.", all: "See all times" },
  call: "Call",
  facts: { rating: "Patient rating (sample)", years: "Years in the area (sample)", languages: "Languages spoken" },
  photo: "AI-generated image (placeholder)",
  aiLabel: "AI-generated image", aiVideoLabel: "AI-generated video", motion: { pause: "Pause motion", play: "Play motion" }, photoAlt: { hero: "Bright treatment room at the clinic", team: "Portrait of {name}", treatment: "{name}" },
  sections: { treatments: "Treatments", prices: "Prices", insurance: "Insurance and payment", seeAll: "See all" },
  from: "from {p}",
  emergency: {
    title: "Same-day emergency", lede: "Take a place in today's emergency queue and come in when it's your turn.",
    waiting: "{n} waiting", wait: "about {m} min", take: "Take a place", taken: "You're number {n} in the queue (demo — nothing was sent).",
    closed: "Emergency queue opens with the clinic.", closingSoon: "Today's emergency queue is closed. Please call us.",
    notDiagnosis: "This queue does not assess symptoms. If you have severe swelling, trouble breathing or uncontrolled bleeding, call {sos}.",
    strip: "Emergency today",
  },
  form: { name: "Name", phone: "Phone", treatment: "Treatment", time: "Time", submit: "Confirm booking", sentNot: "This is a demo, so nothing was sent.", step: "Step {n} of 3", back: "Back", review: "Review", next: "Next" },
  footer: { hours: "Hours", address: "Address", phone: "Phone", privacy: "Privacy", cookies: "Cookies", languageHelp: "Language assistance", demo: "About this demo", aiImages: "Images are AI-generated." },
  hours: "Hours",
  closedDay: "Closed",
  minutes: "min",
  chat: { open: "Ask us", title: "Front desk assistant", placeholder: "Type a question…", send: "Send", intro: "Hi! I can help with hours, prices, booking and directions.", disclaimer: "Demo assistant. Common questions get fixed answers; other questions are answered by AI using only the clinic's information. It does not give medical advice. Please don't enter personal details.", aiTag: "AI", aiNote: "Written by AI from the clinic's information" },
  cookie: { title: "Cookies", body: "We use only the cookies needed for the site to work. With your consent we would also measure visits to improve the site.", reject: "Reject", accept: "Accept", settings: "Settings", sample: "Sample banner for this demo: no cookies are set, whatever you choose." },
  map: { title: "Map", after: "The map shows the district only; the pin marks the district, not the clinic. The clinic and its address are fictional.", illustration: "Map of the district", larger: "View larger map" },
  wa: {
    whatsapp: "WhatsApp", sms: "Text us", status: "Usually replies in a few minutes", demo: "Demo: WhatsApp-style simulation. Nothing is sent.", demoSms: "Demo: text-message simulation. Nothing is sent.",
    welcome: "Hi! This is {clinic}. How can we help?", hint: "Pick an option or type a question.", placeholder: "Message", close: "Close",
    menu: { book: "Book a visit", change: "Change or cancel", emergency: "Emergency today", location: "How to get here", human: "Talk to a person" },
    pickTreatment: "Which treatment?", pickSlot: "Next free times for {treatment}:", noSlots: "No free times in the next two weeks. Please call us.",
    askName: "{treatment} on {slot}. What name should we book it under?", booked: "Booked: {treatment}, {slot}, for {name}. We'll send a reminder the day before. (Demo: nothing was sent.)",
    queueOpen: "Today's emergency list: {n} waiting, about {m} min.", seeMap: "See map", again: "Anything else?", viewOptions: "View options", checkupShort: "First visit and X-rays",
  },
  style: "Style",
  region: "Region",
  language: "Language",
};

const es: Messages = {
  demoNotice: "Web de demostración basada en webs reales de clínicas dentales. La clínica, las personas, la dirección y el teléfono son ficticios.",
  nav: { home: "Inicio", treatments: "Tratamientos", allTreatments: "Todos los tratamientos", prices: "Precios", insurance: "Seguros", clinic: "Clínica", team: "Equipo", faq: "Preguntas frecuentes", contact: "Contacto", emergency: "Urgencias", menu: "Menú", close: "Cerrar" },
  status: { open: "Abierto ahora", closed: "Cerrado ahora", closesIn: "Cierra en {t}", closesAt: "hasta las {t}", opensToday: "Abre hoy a las {t}", opensTomorrow: "Abre mañana a las {t}", opensOn: "Abre el {d} a las {t}" },
  hero: { title: "Ven al dentista esta semana.", lede: "Elige una hora y tu cita queda reservada. Te enviamos un recordatorio el día antes." },
  book: { heading: "Próximas horas libres", cta: "Pedir cita", short: "Pedir cita", pick: "Elige una hora", sample: "Horas de ejemplo para esta demo. No se envía nada.", none: "No hay horas libres en las próximas dos semanas.", all: "Ver todas las horas" },
  call: "Llamar",
  facts: { rating: "Valoración de pacientes (ejemplo)", years: "Años en el barrio (ejemplo)", languages: "Idiomas" },
  photo: "Imagen generada con IA (provisional)",
  aiLabel: "Imagen generada con IA", aiVideoLabel: "Vídeo generado con IA", motion: { pause: "Pausar el movimiento", play: "Reanudar el movimiento" }, photoAlt: { hero: "Sala de tratamiento luminosa de la clínica", team: "Retrato de {name}", treatment: "{name}" },
  sections: { treatments: "Tratamientos", prices: "Precios", insurance: "Seguros y pago", seeAll: "Ver todo" },
  from: "desde {p}",
  emergency: {
    title: "Urgencias del día", lede: "Pide turno en la lista de urgencias de hoy y ven cuando te toque.",
    waiting: "{n} en espera", wait: "unos {m} min", take: "Pedir turno", taken: "Tienes el turno {n} (demo: no se ha enviado nada).",
    closed: "La lista de urgencias abre con la clínica.", closingSoon: "La lista de urgencias de hoy está cerrada. Llámanos, por favor.",
    notDiagnosis: "Este servicio no valora síntomas. Si tienes una inflamación importante, dificultad para respirar o un sangrado que no para, llama al {sos}.",
    strip: "Urgencias hoy",
  },
  form: { name: "Nombre", phone: "Teléfono", treatment: "Tratamiento", time: "Hora", submit: "Confirmar cita", sentNot: "Es una demo: no se ha enviado nada.", step: "Paso {n} de 3", back: "Atrás", review: "Revisar", next: "Siguiente" },
  footer: { hours: "Horario", address: "Dirección", phone: "Teléfono", privacy: "Privacidad", cookies: "Cookies", languageHelp: "Ayuda con el idioma", demo: "Sobre esta demo", aiImages: "Las imágenes están generadas con IA." },
  hours: "Horario",
  closedDay: "Cerrado",
  minutes: "min",
  chat: { open: "Pregúntanos", title: "Asistente de recepción", placeholder: "Escribe una pregunta…", send: "Enviar", intro: "¡Hola! Te ayudo con horarios, precios, citas y cómo llegar.", disclaimer: "Asistente de demostración. Las preguntas habituales tienen respuestas fijas; las demás las responde una IA solo con la información de la clínica. No da consejos médicos. No escribas datos personales.", aiTag: "IA", aiNote: "Escrito por IA con la información de la clínica" },
  cookie: { title: "Cookies", body: "Solo usamos las cookies necesarias para que la web funcione. Con tu consentimiento, también mediríamos las visitas para mejorarla.", reject: "Rechazar", accept: "Aceptar", settings: "Configurar", sample: "Banner de ejemplo para esta demo: no se instala ninguna cookie, elijas lo que elijas." },
  map: { title: "Mapa", after: "El mapa muestra solo el barrio; el marcador señala la zona, no la clínica. La clínica y su dirección son ficticias.", illustration: "Mapa del barrio", larger: "Ver mapa más grande" },
  wa: {
    whatsapp: "WhatsApp", sms: "Envíanos un SMS", status: "Suele responder en pocos minutos", demo: "Demo: simulación tipo WhatsApp. No se envía nada.", demoSms: "Demo: simulación de mensajes de texto. No se envía nada.",
    welcome: "¡Hola! Somos {clinic}. ¿En qué te ayudamos?", hint: "Elige una opción o escribe una pregunta.", placeholder: "Mensaje", close: "Cerrar",
    menu: { book: "Pedir cita", change: "Cambiar o anular", emergency: "Urgencias hoy", location: "Cómo llegar", human: "Hablar con una persona" },
    pickTreatment: "¿Qué tratamiento?", pickSlot: "Próximas horas libres para {treatment}:", noSlots: "No hay horas libres en las próximas dos semanas. Llámanos, por favor.",
    askName: "{treatment}, {slot}. ¿A nombre de quién reservamos?", booked: "Reservado: {treatment}, {slot}, a nombre de {name}. Te enviaremos un recordatorio el día antes. (Demo: no se ha enviado nada.)",
    queueOpen: "Lista de urgencias de hoy: {n} en espera, unos {m} min.", seeMap: "Ver mapa", again: "¿Algo más?", viewOptions: "Ver opciones", checkupShort: "Primera visita y RX",
  },
  style: "Estilo",
  region: "Región",
  language: "Idioma",
};

const ca: Messages = {
  demoNotice: "Web de demostració basada en webs reals de clíniques dentals. La clínica, les persones, l'adreça i el telèfon són ficticis.",
  nav: { home: "Inici", treatments: "Tractaments", allTreatments: "Tots els tractaments", prices: "Preus", insurance: "Assegurances", clinic: "Clínica", team: "Equip", faq: "Preguntes freqüents", contact: "Contacte", emergency: "Urgències", menu: "Menú", close: "Tancar" },
  status: { open: "Obert ara", closed: "Tancat ara", closesIn: "Tanca d'aquí a {t}", closesAt: "fins a les {t}", opensToday: "Obre avui a les {t}", opensTomorrow: "Obre demà a les {t}", opensOn: "Obre el {d} a les {t}" },
  hero: { title: "Vine al dentista aquesta setmana.", lede: "Tria una hora i la cita queda reservada. T'enviem un recordatori el dia abans." },
  book: { heading: "Properes hores lliures", cta: "Demanar cita", short: "Demanar cita", pick: "Tria una hora", sample: "Hores d'exemple per a aquesta demo. No s'envia res.", none: "No hi ha hores lliures en les properes dues setmanes.", all: "Veure totes les hores" },
  call: "Trucar",
  facts: { rating: "Valoració dels pacients (exemple)", years: "Anys al barri (exemple)", languages: "Idiomes" },
  photo: "Imatge generada amb IA (provisional)",
  aiLabel: "Imatge generada amb IA", aiVideoLabel: "Vídeo generat amb IA", motion: { pause: "Aturar el moviment", play: "Reprendre el moviment" }, photoAlt: { hero: "Sala de tractament lluminosa de la clínica", team: "Retrat de {name}", treatment: "{name}" },
  sections: { treatments: "Tractaments", prices: "Preus", insurance: "Assegurances i pagament", seeAll: "Veure-ho tot" },
  from: "des de {p}",
  emergency: {
    title: "Urgències del dia", lede: "Agafa número a la cua d'urgències d'avui i vine quan sigui el teu torn.",
    waiting: "{n} en espera", wait: "uns {m} min", take: "Agafar número", taken: "Tens el número {n} a la cua (demo: no s'ha enviat res).",
    closed: "La cua d'urgències obre amb la clínica.", closingSoon: "La cua d'urgències d'avui està tancada. Truca'ns, si us plau.",
    notDiagnosis: "Aquesta cua no valora símptomes. Si tens una inflamació important, dificultat per respirar o un sagnat que no s'atura, truca al {sos}.",
    strip: "Urgències avui",
  },
  form: { name: "Nom", phone: "Telèfon", treatment: "Tractament", time: "Hora", submit: "Confirmar la cita", sentNot: "És una demo: no s'ha enviat res.", step: "Pas {n} de 3", back: "Enrere", review: "Revisar", next: "Següent" },
  footer: { hours: "Horari", address: "Adreça", phone: "Telèfon", privacy: "Privadesa", cookies: "Galetes", languageHelp: "Ajuda amb l'idioma", demo: "Sobre aquesta demo", aiImages: "Les imatges estan generades amb IA." },
  hours: "Horari",
  closedDay: "Tancat",
  minutes: "min",
  chat: { open: "Pregunta'ns", title: "Assistent de recepció", placeholder: "Escriu una pregunta…", send: "Enviar", intro: "Hola! T'ajudo amb horaris, preus, cites i com arribar.", disclaimer: "Assistent de demostració. Les preguntes habituals tenen respostes fixes; les altres les respon una IA només amb la informació de la clínica. No dona consells mèdics. No escriguis dades personals.", aiTag: "IA", aiNote: "Escrit per IA amb la informació de la clínica" },
  cookie: { title: "Galetes", body: "Només fem servir les galetes necessàries perquè el web funcioni. Amb el teu consentiment, també mesuraríem les visites per millorar-lo.", reject: "Rebutjar", accept: "Acceptar", settings: "Configurar", sample: "Bàner d'exemple per a aquesta demo: no s'instal·la cap galeta, triïs el que triïs." },
  map: { title: "Mapa", after: "El mapa només mostra el barri; el marcador indica la zona, no la clínica. La clínica i la seva adreça són fictícies.", illustration: "Mapa del barri", larger: "Veure el mapa més gran" },
  wa: {
    whatsapp: "WhatsApp", sms: "Envia'ns un SMS", status: "Sol respondre en pocs minuts", demo: "Demo: simulació tipus WhatsApp. No s'envia res.", demoSms: "Demo: simulació de missatges de text. No s'envia res.",
    welcome: "Hola! Som {clinic}. En què t'ajudem?", hint: "Tria una opció o escriu una pregunta.", placeholder: "Missatge", close: "Tancar",
    menu: { book: "Demanar cita", change: "Canviar o anul·lar", emergency: "Urgències avui", location: "Com arribar", human: "Parlar amb una persona" },
    pickTreatment: "Quin tractament?", pickSlot: "Properes hores lliures per a {treatment}:", noSlots: "No hi ha hores lliures en les properes dues setmanes. Truca'ns, si us plau.",
    askName: "{treatment}, {slot}. A nom de qui fem la reserva?", booked: "Reservat: {treatment}, {slot}, a nom de {name}. T'enviarem un recordatori el dia abans. (Demo: no s'ha enviat res.)",
    queueOpen: "Llista d'urgències d'avui: {n} en espera, uns {m} min.", seeMap: "Veure el mapa", again: "Alguna cosa més?", viewOptions: "Veure opcions", checkupShort: "Primera visita i RX",
  },
  style: "Estil",
  region: "Regió",
  language: "Idioma",
};

const fr: Messages = {
  demoNotice: "Site de démonstration inspiré de vrais sites de cabinets dentaires. Le cabinet, les personnes, l'adresse et le téléphone sont fictifs.",
  nav: { home: "Accueil", treatments: "Soins", allTreatments: "Tous les soins", prices: "Tarifs", insurance: "Assurances", clinic: "Cabinet", team: "Équipe", faq: "Questions fréquentes", contact: "Contact", emergency: "Urgences", menu: "Menu", close: "Fermer" },
  status: { open: "Ouvert", closed: "Fermé", closesIn: "Ferme dans {t}", closesAt: "jusqu'à {t}", opensToday: "Ouvre aujourd'hui à {t}", opensTomorrow: "Ouvre demain à {t}", opensOn: "Ouvre {d} à {t}" },
  hero: { title: "Un rendez-vous chez le dentiste dès cette semaine.", lede: "Choisissez un horaire et c'est réservé. Nous envoyons un rappel la veille." },
  book: { heading: "Prochains créneaux libres", cta: "Prendre rendez-vous", short: "Rendez-vous", pick: "Choisissez un créneau", sample: "Créneaux d'exemple pour cette démo. Rien n'est envoyé.", none: "Aucun créneau libre dans les deux prochaines semaines.", all: "Voir tous les créneaux" },
  call: "Appeler",
  facts: { rating: "Note des patients (exemple)", years: "Années dans le quartier (exemple)", languages: "Langues parlées" },
  photo: "Image générée par IA (provisoire)",
  aiLabel: "Image générée par IA", aiVideoLabel: "Vidéo générée par IA", motion: { pause: "Mettre le mouvement en pause", play: "Reprendre le mouvement" }, photoAlt: { hero: "Salle de soins lumineuse du cabinet", team: "Portrait de {name}", treatment: "{name}" },
  sections: { treatments: "Soins", prices: "Tarifs", insurance: "Assurances et paiement", seeAll: "Tout voir" },
  from: "à partir de {p}",
  emergency: {
    title: "Urgences du jour", lede: "Prenez un ticket dans la file d'urgences du jour et venez quand c'est votre tour.",
    waiting: "{n} en attente", wait: "environ {m} min", take: "Prendre un ticket", taken: "Vous êtes le numéro {n} dans la file (démo : rien n'a été envoyé).",
    closed: "La file d'urgences ouvre avec le cabinet.", closingSoon: "La file d'urgences du jour est fermée. Merci de nous appeler.",
    notDiagnosis: "Cette file n'évalue pas les symptômes. En cas de gonflement important, de difficulté à respirer ou de saignement qui ne s'arrête pas, appelez le {sos}.",
    strip: "Urgences aujourd'hui",
  },
  form: { name: "Nom", phone: "Téléphone", treatment: "Soin", time: "Horaire", submit: "Confirmer le rendez-vous", sentNot: "C'est une démo : rien n'a été envoyé.", step: "Étape {n} sur 3", back: "Retour", review: "Vérifier", next: "Suivant" },
  footer: { hours: "Horaires", address: "Adresse", phone: "Téléphone", privacy: "Confidentialité", cookies: "Cookies", languageHelp: "Aide linguistique", demo: "À propos de cette démo", aiImages: "Les images sont générées par IA." },
  hours: "Horaires",
  closedDay: "Fermé",
  minutes: "min",
  chat: { open: "Une question ?", title: "Assistant d'accueil", placeholder: "Écrivez une question…", send: "Envoyer", intro: "Bonjour ! Je peux vous aider pour les horaires, les tarifs, les rendez-vous et l'accès.", disclaimer: "Assistant de démonstration. Les questions courantes ont des réponses fixes ; les autres sont traitées par une IA à partir des seules informations du cabinet. Il ne donne pas d'avis médical. N'indiquez pas de données personnelles.", aiTag: "IA", aiNote: "Rédigé par IA à partir des informations du cabinet" },
  cookie: { title: "Cookies", body: "Nous n'utilisons que les cookies nécessaires au fonctionnement du site. Avec votre accord, nous mesurerions aussi l'audience pour l'améliorer.", reject: "Refuser", accept: "Accepter", settings: "Paramétrer", sample: "Bannière d'exemple pour cette démo : aucun cookie n'est déposé, quel que soit votre choix." },
  map: { title: "Plan", after: "Le plan montre seulement le quartier ; le repère indique le secteur, pas le cabinet. Le cabinet et son adresse sont fictifs.", illustration: "Plan du quartier", larger: "Voir le plan en grand" },
  wa: {
    whatsapp: "WhatsApp", sms: "Envoyez-nous un SMS", status: "Répond généralement en quelques minutes", demo: "Démo : simulation de type WhatsApp. Rien n'est envoyé.", demoSms: "Démo : simulation de SMS. Rien n'est envoyé.",
    welcome: "Bonjour ! Ici {clinic}. Comment pouvons-nous vous aider ?", hint: "Choisissez une option ou écrivez une question.", placeholder: "Message", close: "Fermer",
    menu: { book: "Prendre rendez-vous", change: "Modifier ou annuler", emergency: "Urgences aujourd'hui", location: "Accès", human: "Parler à quelqu'un" },
    pickTreatment: "Quel soin ?", pickSlot: "Prochains créneaux libres pour {treatment} :", noSlots: "Aucun créneau libre dans les deux prochaines semaines. Merci de nous appeler.",
    askName: "{treatment}, {slot}. À quel nom réservons-nous ?", booked: "Réservé : {treatment}, {slot}, au nom de {name}. Nous enverrons un rappel la veille. (Démo : rien n'a été envoyé.)",
    queueOpen: "File d'urgences du jour : {n} en attente, environ {m} min.", seeMap: "Voir le plan", again: "Autre chose ?", viewOptions: "Voir les options", checkupShort: "1re visite et radios",
  },
  style: "Style",
  region: "Région",
  language: "Langue",
};

export const MESSAGES: Record<Locale, Messages> = { en, es, ca, fr };

/** Fills in placeholders such as {n} in "{n} waiting" */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
