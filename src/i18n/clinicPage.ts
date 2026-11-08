// Body text of the "Clinic" page (introducing the clinic). Only state what other pages already promise
// (assigned hygienist, written estimate / insurance check, same-day emergency waiting list, reminder the day before, languages spoken).

import type { L, RegionId } from "./config";

type Point = { h: L; p: L };

const SAME_HYGIENIST: Point = {
  h: { en: "The same hygienist every time", es: "Siempre la misma higienista", ca: "Sempre la mateixa higienista", fr: "Le même hygiéniste à chaque fois" },
  p: {
    en: "Your cleanings are always with the same person, so you don't have to repeat your history.",
    es: "Tus limpiezas son siempre con la misma persona, así no tienes que repetir tu historial.",
    ca: "Les teves neteges són sempre amb la mateixa persona, així no has de repetir el teu historial.",
    fr: "Vos détartrages se font toujours avec la même personne : inutile de répéter votre historique.",
  },
};

const PRICE_ES: Point = {
  h: { en: "A written quote before anything starts", es: "Presupuesto por escrito antes de empezar", ca: "Pressupost per escrit abans de començar", fr: "Un devis écrit avant de commencer" },
  p: {
    en: "Starting prices are online. After your first visit you get the full price in writing.",
    es: "Los precios de partida están en la web. Tras la primera visita recibes el precio completo por escrito.",
    ca: "Els preus de partida són al web. Després de la primera visita reps el preu complet per escrit.",
    fr: "Les prix de départ sont en ligne. Après la première visite, vous recevez le prix complet par écrit.",
  },
};

const PRICE_US: Point = {
  h: { en: "Coverage checked before you come", es: "Revisamos tu seguro antes de la visita", ca: "", fr: "" },
  p: {
    en: "Send us your insurance details and we tell you what is covered before your visit.",
    es: "Envíanos los datos de tu seguro y te decimos qué cubre antes de la visita.",
    ca: "",
    fr: "",
  },
};

const EMERGENCY: Point = {
  h: { en: "Room for same-day emergencies", es: "Hueco para urgencias del día", ca: "Lloc per a urgències del dia", fr: "De la place pour les urgences du jour" },
  p: {
    en: "If you are in pain, take a number online and see how many people are ahead of you.",
    es: "Si tienes dolor, pide número en la web y mira cuántas personas van delante.",
    ca: "Si tens dolor, agafa número al web i mira quantes persones van davant.",
    fr: "En cas de douleur, prenez un numéro en ligne et voyez combien de personnes sont avant vous.",
  },
};

const REMINDER: Point = {
  h: { en: "A reminder the day before", es: "Un recordatorio el día antes", ca: "Un recordatori el dia abans", fr: "Un rappel la veille" },
  p: {
    en: "Book online at any hour. We remind you the day before, and changing the time is one message away.",
    es: "Pide cita en la web a cualquier hora. Te lo recordamos el día antes, y cambiar la hora es un mensaje.",
    ca: "Demana cita al web a qualsevol hora. T'ho recordem el dia abans, i canviar l'hora és un missatge.",
    fr: "Réservez en ligne à toute heure. Nous vous le rappelons la veille, et changer l'horaire tient en un message.",
  },
};

export const CLINIC_POINTS: Record<RegionId, Point[]> = {
  es: [SAME_HYGIENIST, PRICE_ES, EMERGENCY, REMINDER],
  us: [SAME_HYGIENIST, PRICE_US, EMERGENCY, REMINDER],
};

export const CLINIC_TEXT = {
  spaceTitle: { en: "The space", es: "El espacio", ca: "L'espai", fr: "Les lieux" } as L,
  whyTitle: { en: "How we work", es: "Cómo trabajamos", ca: "Com treballem", fr: "Notre façon de travailler" } as L,
  roomAlt: { en: "Treatment room with daylight", es: "Sala de tratamiento con luz natural", ca: "Sala de tractament amb llum natural", fr: "Salle de soins à la lumière du jour" } as L,
  receptionAlt: { en: "Reception desk", es: "Recepción", ca: "Recepció", fr: "Accueil" } as L,
  meetTeam: { en: "Meet the team", es: "Conoce al equipo", ca: "Coneix l'equip", fr: "Rencontrer l'équipe" } as L,
  email: { en: "Email", es: "Correo electrónico", ca: "Correu electrònic", fr: "E-mail" } as L,
};
