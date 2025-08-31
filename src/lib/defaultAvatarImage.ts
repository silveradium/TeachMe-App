import md5Parser from "md5";

/**
 * Provided either an email or an MD5 hash, return the URL for the Gravatar
 * image aborting early if neither is provided.
 */
export const defaultAvatarSrc = function ({
  email,
  md5 = "",
  size = 160,
}: {
  email?: string;
  md5?: string;
  size?: number;
}) {
  const build = (hash: string) => `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp&r=PG`;

  if (md5) {
    return build(md5);
  }

  if (email) {
    return build(md5Parser(email));
  }

  return "";
};

/**
 * Given an avatar URL and a name, return the appropriate avatar URL. In the
 * event that no avatar URL is provided, return a placeholder avatar URL from
 * ui-avatars.com.
 *
 * ui-avatars.com is a free service that generates placeholder avatars based on
 * a name. It is used here to provide a consistent placeholder avatar for users
 * who have not uploaded an avatar.
 */
export function getPlaceholderAvatar(avatar: string | null | undefined, name: string | null) {
  return avatar
    ? avatar
    : "https://eu.ui-avatars.com/api/?background=fff&color=f9f9f9&bold=true&background=000000&name=" +
        encodeURIComponent(name || "");
}
