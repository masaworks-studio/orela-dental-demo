// Fonts are bundled at build time with next/font and served from our own site (no requests to Google while browsing)
import { Archivo, Jost, Newsreader, Public_Sans } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-archivo", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-newsreader", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-public-sans", display: "swap" });
const jost = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jost", display: "swap" });

export const fontVariables = [archivo.variable, newsreader.variable, publicSans.variable, jost.variable].join(" ");

/** Applies the saved style before rendering (prevents flicker) */
export const themeBootScript = `try{var t=localStorage.getItem("orela-theme");if(t==="calm"||t==="studio"||t==="direct")document.documentElement.dataset.theme=t;if(localStorage.getItem("orela-labels")==="off")document.documentElement.dataset.labels="off"}catch(e){}`;
