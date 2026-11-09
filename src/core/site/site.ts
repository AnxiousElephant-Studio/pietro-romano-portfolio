import siteData from "./data/site.json";

export type SocialLink = { id: string; label: string; url: string; handle: string; icon: string };

export const site = {
  owner: siteData.owner,
  studio: siteData.studio,
  socialLinks: siteData.socialLinks as SocialLink[],
};
