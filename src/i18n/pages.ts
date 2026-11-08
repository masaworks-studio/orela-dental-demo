// Headings and descriptions for the sub-pages. Clinic content lives in the CMS; this file only holds the page frame text.
import type { L } from "./config";

type Page = { title: L; intro: L };

export const PAGES: Record<string, Page> = {
  treatments: {
    title: { en: "Treatments", es: "Tratamientos", ca: "Tractaments", fr: "Soins" },
    intro: {
      en: "What we do, how long it takes and what it costs.",
      es: "Qué hacemos, cuánto dura y cuánto cuesta.",
      ca: "Què fem, quant dura i quant costa.",
      fr: "Ce que nous faisons, la durée et le prix.",
    },
  },
  prices: {
    title: { en: "Prices", es: "Precios", ca: "Preus", fr: "Tarifs" },
    intro: {
      en: "Starting prices for each treatment. After your first visit you get a written quote before anything starts.",
      es: "Precios de partida de cada tratamiento. Tras la primera visita recibes un presupuesto por escrito antes de empezar.",
      ca: "Preus de partida de cada tractament. Després de la primera visita reps un pressupost per escrit abans de començar.",
      fr: "Prix de départ de chaque soin. Après la première visite, vous recevez un devis écrit avant de commencer.",
    },
  },
  insurance: {
    title: { en: "Insurance and payment", es: "Seguros y pago", ca: "Assegurances i pagament", fr: "Assurances et paiement" },
    intro: {
      en: "We check your coverage before your visit, so there are no surprises. Monthly payment plans are available through third-party financing.",
      es: "Revisamos tu cobertura antes de la visita para que no haya sorpresas. Hay planes de pago mensual con financiación externa.",
      ca: "Revisem la cobertura abans de la visita.",
      fr: "Nous vérifions votre couverture avant la visite.",
    },
  },
  team: {
    title: { en: "Our team", es: "Nuestro equipo", ca: "El nostre equip", fr: "Notre équipe" },
    intro: {
      en: "The same hygienist sees you at every cleaning, so they know your history. All names are fictional.",
      es: "La misma higienista te atiende en cada limpieza y conoce tu historial. Todos los nombres son ficticios.",
      ca: "La mateixa higienista t'atén a cada neteja i coneix el teu historial. Tots els noms són ficticis.",
      fr: "Le même hygiéniste vous reçoit à chaque détartrage et connaît votre historique. Tous les noms sont fictifs.",
    },
  },
  faq: {
    title: { en: "Questions", es: "Preguntas frecuentes", ca: "Preguntes freqüents", fr: "Questions fréquentes" },
    intro: { en: "", es: "", ca: "", fr: "" },
  },
  contact: {
    title: { en: "Contact", es: "Contacto", ca: "Contacte", fr: "Contact" },
    intro: {
      en: "Address, phone, hours and how to find us. The clinic, address, phone and email are fictional.",
      es: "Dirección, teléfono, horario y cómo encontrarnos. La clínica, la dirección, el teléfono y el correo son ficticios.",
      ca: "Adreça, telèfon, horari i com trobar-nos. La clínica, l'adreça, el telèfon i el correu són ficticis.",
      fr: "Adresse, téléphone, horaires et accès. Le cabinet, l'adresse, le téléphone et l'e-mail sont fictifs.",
    },
  },
  clinic: {
    title: { en: "The clinic", es: "La clínica", ca: "La clínica", fr: "Le cabinet" },
    intro: {
      en: "A small local clinic: one team, clear prices and room for same-day emergencies. The clinic is fictional; photos are AI-generated.",
      es: "Una clínica pequeña de barrio: un solo equipo, precios claros y hueco para urgencias el mismo día. La clínica es ficticia; las fotos están generadas con IA.",
      ca: "Una clínica petita de barri: un sol equip, preus clars i lloc per a urgències el mateix dia. La clínica és fictícia; les fotos estan generades amb IA.",
      fr: "Un petit cabinet de quartier : une seule équipe, des prix clairs et de la place pour les urgences du jour. Le cabinet est fictif ; les photos sont générées par IA.",
    },
  },
  book: {
    title: { en: "Book a visit", es: "Pedir cita", ca: "Demanar cita", fr: "Prendre rendez-vous" },
    intro: {
      en: "Choose a treatment and a time. This is a demo: nothing is sent.",
      es: "Elige tratamiento y hora. Es una demo: no se envía nada.",
      ca: "Tria tractament i hora. És una demo: no s'envia res.",
      fr: "Choisissez un soin et un horaire. C'est une démo : rien n'est envoyé.",
    },
  },
  emergency: {
    title: { en: "Same-day emergency", es: "Urgencias del día", ca: "Urgències del dia", fr: "Urgences du jour" },
    intro: {
      en: "Take a place in today's queue and come in when it's your turn. We show the waiting time so you don't have to sit in the waiting room.",
      es: "Pide turno en la lista de urgencias de hoy y ven cuando te toque. Mostramos el tiempo de espera para que no tengas que esperar en la sala.",
      ca: "Agafa número a la cua d'avui i vine quan et toqui. Mostrem el temps d'espera perquè no hagis d'esperar a la sala.",
      fr: "Prenez un ticket dans la file du jour et venez quand c'est votre tour. Nous affichons l'attente pour vous éviter la salle d'attente.",
    },
  },
  privacy: {
    title: { en: "Privacy", es: "Privacidad", ca: "Privadesa", fr: "Confidentialité" },
    intro: {
      en: "This demo does not collect personal data. Booking and queue forms are not sent anywhere, chat messages are not stored, there is no analytics, and no cookies are set.",
      es: "Esta demo no recoge datos personales. Los formularios de cita y de turnos no se envían, los mensajes del chat no se guardan, no hay analítica y no se instalan cookies.",
      ca: "Aquesta demo no recull dades personals. Els formularis de cita i de torns no s'envien, els missatges del xat no es desen, no hi ha analítica i no s'instal·len galetes.",
      fr: "Cette démo ne collecte aucune donnée personnelle. Les formulaires de rendez-vous et de file ne sont envoyés nulle part, les messages du chat ne sont pas conservés, il n'y a pas de mesure d'audience et aucun cookie.",
    },
  },
  cookies: {
    title: { en: "Cookies", es: "Cookies", ca: "Galetes", fr: "Cookies" },
    intro: {
      en: "This site sets no cookies. Your chosen style is kept only in your own browser storage. A real clinic site with analytics would ask for consent first.",
      es: "Este sitio no instala cookies. El estilo que eliges solo se guarda en tu navegador. Una web real con analítica pediría consentimiento antes.",
      ca: "Aquest lloc no instal·la galetes. L'estil que tries només es desa al teu navegador. Una web real amb analítica demanaria consentiment abans.",
      fr: "Ce site ne dépose aucun cookie. Le style choisi est gardé uniquement dans votre navigateur. Un vrai site avec mesure d'audience demanderait d'abord votre consentement.",
    },
  },
  "language-assistance": {
    title: { en: "Language assistance", es: "Ayuda con el idioma", ca: "Ajuda amb l'idioma", fr: "Aide linguistique" },
    intro: {
      en: "Free language help is available. Ask the front desk for an interpreter in your language.",
      es: "Ofrecemos ayuda gratuita con el idioma. Pide un intérprete en tu idioma en recepción.",
      ca: "",
      fr: "",
    },
  },
};
