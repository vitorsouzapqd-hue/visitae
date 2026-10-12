import { Header } from "./layout/Header.mjs";
import { Hero } from "./sections/Hero.mjs";
import { ShareMarquee } from "./sections/ShareMarquee.mjs";
import { TourShowcase } from "./sections/TourShowcase.mjs";
import { Applications } from "./sections/Applications.mjs";
import { OwnPageShowcase } from "./sections/OwnPageShowcase.mjs";
import { GoogleMapsShowcase } from "./sections/GoogleMapsShowcase.mjs";
import { Testimonials } from "./sections/Testimonials.mjs";
import { ActivationMagazine } from "./sections/ActivationMagazine.mjs";
import { Solutions } from "./sections/Solutions.mjs";
import { Process } from "./sections/Process.mjs";
import { Founder } from "./sections/Founder.mjs";
import { FAQ } from "./sections/FAQ.mjs";
import { QuoteForm } from "./sections/QuoteForm.mjs";
import { Footer } from "./layout/Footer.mjs";
import { CreditsDialog } from "./components/CreditsDialog.mjs";
import { OwnPageDialog } from "./components/OwnPageDialog.mjs";
import { WhatsAppIcon } from "./components/WhatsAppIcon.mjs";

export const pageComponents = {
  Header,
  Hero,
  ShareMarquee,
  TourShowcase,
  Applications,
  OwnPageShowcase,
  GoogleMapsShowcase,
  Testimonials,
  ActivationMagazine,
  Solutions,
  Process,
  Founder,
  FAQ,
  QuoteForm,
  Footer,
  CreditsDialog,
  OwnPageDialog,
  WhatsAppSymbol: () => WhatsAppIcon({ attributes: ' id="whatsapp" viewBox="0 0 24 24"', symbol: true }),
};
