import { clinic, openingHours } from "./clinic";
import { faq, teamMember, treatment, trustNumbers } from "./content";
import { localeString, localeText } from "./locale";

export const schemaTypes = [localeString, localeText, openingHours, clinic, treatment, teamMember, faq, trustNumbers];
