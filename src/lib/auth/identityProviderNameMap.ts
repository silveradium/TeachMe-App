import { IdentityProvider } from "@prisma/client";

export const identityProviderNameMap: { [key in IdentityProvider]: string } = {
  [IdentityProvider.TEACHME]: "TeachMe",
  [IdentityProvider.GOOGLE]: "Google",
};
