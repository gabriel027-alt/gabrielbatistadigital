/**
 * Google Analytics 4 and Google Ads (user's choice, 18/11/2026). Off until the IDs are set as environment variables
 * (in Vercel and/or .env.local, then a new build):
 *   NEXT_PUBLIC_GA_ID                  GA4 measurement ID, "G-XXXXXXXXXX"
 *   NEXT_PUBLIC_ADS_ID                 Google Ads tag ID, "AW-XXXXXXXXX"
 *   NEXT_PUBLIC_ADS_CONVERSION_LABEL   label of the "WhatsApp click" conversion action in Google Ads
 * With none set, no banner shows and nothing from Google is ever requested. With any set, the consent banner appears
 * and gtag.js loads only after "Aceitar" (components/ConsentBanner.tsx). Guide: docs/MEDICAO-CONTATO.md.
 */
export const analytics = {
  ga: process.env.NEXT_PUBLIC_GA_ID || "",
  ads: process.env.NEXT_PUBLIC_ADS_ID || "",
  adsLabel: process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL || "",
};
export const analyticsEnabled = Boolean(analytics.ga || analytics.ads);
export const CONSENT_KEY = "gb-consent";
