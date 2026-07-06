import { IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

const onest = localFont({
  src: "./fonts/Onest-Variable.ttf",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-onest",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  preload: false,
  fallback: ["Courier New", "monospace"],
});

export const appFontVariables = [
  onest.variable,
  playfairDisplay.variable,
  ibmPlexMono.variable,
].join(" ");
