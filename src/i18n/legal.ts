// Body text for the privacy, cookie and language assistance pages. States first that this is a demo,
// and briefly shows what a real clinic site would say (this is not legal wording).

import type { Locale } from "./config";

export type Section = { h: string; items: string[] };

export const PRIVACY: Record<Locale, Section[]> = {
  en: [
    { h: "What this demo does", items: ["No personal data is collected or stored.", "Booking and queue forms work only in your browser; nothing is sent.", "Chat messages go to this site's own function to choose an answer. Questions it can't answer from fixed rules are sent to Cloudflare Workers AI to write a reply from the clinic's information; Cloudflare states it does not use them to train AI models. This site does not store or log messages.", "No analytics or tracking pixels are loaded. Fonts are served from this site. The Contact page shows an embedded Google map. When it loads, your IP address is shared with Google, and Google may set its own cookies."] },
    { h: "What a real clinic site would add", items: ["Who the data controller is and how to contact them.", "Which data is collected for bookings and reminders, why, and for how long.", "Which providers process it (booking, messaging, hosting), with a data processing agreement for each.", "How to access, correct or delete your data."] },
  ],
  es: [
    { h: "Qué hace esta demo", items: ["No se recogen ni se guardan datos personales.", "Los formularios de cita y de turnos funcionan solo en tu navegador; no se envía nada.", "Los mensajes del chat van a una función de esta web que elige la respuesta. Las preguntas que no se pueden responder con las reglas fijas se envían a Cloudflare Workers AI para redactar una respuesta con la información de la clínica; Cloudflare indica que no los usa para entrenar modelos de IA. Esta web no guarda ni registra los mensajes.", "No se cargan analítica ni píxeles de seguimiento. Las fuentes se sirven desde este sitio. La página de contacto muestra un mapa de Google integrado. Al cargarse, tu dirección IP se comparte con Google, que puede instalar sus propias cookies."] },
    { h: "Qué añadiría la web de una clínica real", items: ["Quién es el responsable del tratamiento y cómo contactarlo.", "Qué datos se recogen para citas y recordatorios, para qué y durante cuánto tiempo.", "Qué proveedores los tratan (citas, mensajería, alojamiento), con un contrato de encargo de tratamiento con cada uno.", "Cómo acceder a tus datos, corregirlos o borrarlos."] },
  ],
  ca: [
    { h: "Què fa aquesta demo", items: ["No es recullen ni es desen dades personals.", "Els formularis de cita i de torns funcionen només al teu navegador; no s'envia res.", "Els missatges del xat van a una funció d'aquest web que tria la resposta. Les preguntes que no es poden respondre amb les regles fixes s'envien a Cloudflare Workers AI per redactar una resposta amb la informació de la clínica; Cloudflare indica que no els fa servir per entrenar models d'IA. Aquest web no desa ni registra els missatges.", "No es carreguen analítica ni píxels de seguiment. Les fonts se serveixen des d'aquest lloc. La pàgina de contacte mostra un mapa de Google integrat. En carregar-se, la teva adreça IP es comparteix amb Google, que pot instal·lar les seves pròpies galetes."] },
    { h: "Què afegiria el web d'una clínica real", items: ["Qui és el responsable del tractament i com contactar-hi.", "Quines dades es recullen per a cites i recordatoris, per a què i durant quant de temps.", "Quins proveïdors les tracten (cites, missatgeria, allotjament), amb un contracte d'encàrrec de tractament amb cadascun.", "Com accedir a les teves dades, corregir-les o esborrar-les."] },
  ],
  fr: [
    { h: "Ce que fait cette démo", items: ["Aucune donnée personnelle n'est collectée ni conservée.", "Les formulaires de rendez-vous et de file fonctionnent uniquement dans votre navigateur ; rien n'est envoyé.", "Les messages du chat sont envoyés à une fonction de ce site qui choisit la réponse. Les questions auxquelles les règles fixes ne répondent pas sont transmises à Cloudflare Workers AI pour rédiger une réponse à partir des informations du cabinet ; Cloudflare indique ne pas les utiliser pour entraîner des modèles d'IA. Ce site ne conserve ni n'enregistre les messages.", "Aucune mesure d'audience ni aucun pixel de suivi n'est chargé. Les polices sont servies depuis ce site. La page Contact affiche un plan Google intégré. À son chargement, votre adresse IP est transmise à Google, qui peut déposer ses propres cookies."] },
    { h: "Ce qu'ajouterait le site d'un vrai cabinet", items: ["Qui est le responsable du traitement et comment le contacter.", "Quelles données sont collectées pour les rendez-vous et les rappels, pourquoi et pour combien de temps.", "Quels prestataires les traitent (rendez-vous, messagerie, hébergement), avec un accord de traitement pour chacun.", "Comment accéder à vos données, les corriger ou les supprimer."] },
  ],
};

export const COOKIES: Record<Locale, Section[]> = {
  en: [
    { h: "Cookies on this site", items: ["None from this site. The style you pick is kept in your browser's local storage, which never leaves your device. The Google map on the Contact page may set Google's own cookies."] },
    { h: "On a real clinic site", items: ["Analytics or advertising cookies are only set after you agree, and refusing is as easy as accepting.", "Booking widgets or maps from other companies load only after consent, or are replaced by a link."] },
  ],
  es: [
    { h: "Cookies en este sitio", items: ["Ninguna de esta web. El estilo que eliges se guarda en el almacenamiento local de tu navegador y nunca sale de tu dispositivo. El mapa de Google de la página de contacto puede instalar cookies propias de Google."] },
    { h: "En la web de una clínica real", items: ["Las cookies de analítica o publicidad solo se instalan si aceptas, y rechazarlas es tan fácil como aceptarlas.", "Los widgets de citas o mapas de otras empresas solo se cargan tras el consentimiento, o se sustituyen por un enlace."] },
  ],
  ca: [
    { h: "Galetes en aquest lloc", items: ["Cap d'aquest web. L'estil que tries es desa a l'emmagatzematge local del navegador i no surt mai del teu dispositiu. El mapa de Google de la pàgina de contacte pot instal·lar galetes pròpies de Google."] },
    { h: "Al web d'una clínica real", items: ["Les galetes d'analítica o publicitat només s'instal·len si acceptes, i rebutjar-les és tan fàcil com acceptar-les.", "Els ginys de cites o mapes d'altres empreses només es carreguen després del consentiment, o se substitueixen per un enllaç."] },
  ],
  fr: [
    { h: "Cookies sur ce site", items: ["Aucun de ce site. Le style choisi est gardé dans le stockage local de votre navigateur et ne quitte jamais votre appareil. Le plan Google de la page Contact peut déposer des cookies propres à Google."] },
    { h: "Sur le site d'un vrai cabinet", items: ["Les cookies de mesure d'audience ou de publicité ne sont déposés qu'avec votre accord, et refuser est aussi simple qu'accepter.", "Les modules de rendez-vous ou les cartes d'autres sociétés ne se chargent qu'après consentement, ou sont remplacés par un lien."] },
  ],
};

/**
 * Language assistance notice (US version). Only a few languages as a sample. A real clinic would use the
 * HHS-published translations for the top 15 languages in each state. These translations are not checked by native speakers.
 */
export const TAGLINES: { lang: string; name: string; text: string; dir?: "rtl" }[] = [
  { lang: "es", name: "Español", text: "Hay ayuda gratuita con el idioma. Pregunte en recepción." },
  { lang: "vi", name: "Tiếng Việt", text: "Có hỗ trợ ngôn ngữ miễn phí. Vui lòng hỏi quầy lễ tân." },
  { lang: "zh-Hans", name: "中文", text: "我们提供免费的语言协助服务。请向前台咨询。" },
  { lang: "ko", name: "한국어", text: "무료 언어 지원 서비스를 이용하실 수 있습니다. 접수처에 문의하세요." },
  { lang: "ar", name: "العربية", text: "تتوفر المساعدة اللغوية مجانًا. يرجى السؤال في مكتب الاستقبال.", dir: "rtl" },
  { lang: "tl", name: "Tagalog", text: "May libreng tulong sa wika. Magtanong sa front desk." },
  { lang: "fr", name: "Français", text: "Une aide linguistique gratuite est disponible. Adressez-vous à l'accueil." },
];

export const TAGLINE_NOTE: Record<"en" | "es", string> = {
  en: "Sample notice. A real clinic covered by Section 1557 would show the official translations for the 15 most common languages in its state. These translations have not been checked by native speakers.",
  es: "Aviso de ejemplo. Una clínica real sujeta a la Sección 1557 mostraría las traducciones oficiales de los 15 idiomas más hablados en su estado. Estas traducciones no han sido revisadas por hablantes nativos.",
};
