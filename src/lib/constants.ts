export const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || "http://localhost:3000";

export const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
export const IS_GOOGLE_LOGIN_ENABLED = !!GOOGLE_CLIENT_ID && !!GOOGLE_CLIENT_SECRET;

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "TeachMe";

export const SOCIALS = {
  phone: "+94 72 150 7394",
  email: "mandinu.20221585@iit.ac.lk",
  instagram: "https://www.instagram.com/teachme",
  facebook: "https://www.facebook.com/teachme",
};
