import linkedinIcon from "../assets/images/linkedin.svg";
import twitterIcon from "../assets/images/twitter.svg";
import facebookIcon from "../assets/images/facebook.svg";
import instagramIcon from "../assets/images/instagram.svg";
import youtubeIcon from "../assets/images/youtube.svg";
import gmailIcon from "../assets/images/gmail.svg";
import websiteIcon from "../assets/images/website.svg";

const SOCIAL_ICON_SIZE = { width: "14px", height: "14px" };
const WEBSITE_ICON_SIZE = { width: "16px", height: "16px" };

export const getSocialIconAndName = (url) => {
  if (!url) {
    return {
      name: "Website",
      icon: <img src={websiteIcon} alt="Website" style={WEBSITE_ICON_SIZE} />,
    };
  }

  const lowerUrl = url.toLowerCase();

  const platforms = [
    { match: "linkedin.com", name: "LinkedIn", icon: linkedinIcon },
    { match: "twitter.com", name: "Twitter", icon: twitterIcon },
    { match: "x.com", name: "Twitter", icon: twitterIcon },
    { match: "facebook.com", name: "Facebook", icon: facebookIcon },
    { match: "instagram.com", name: "Instagram", icon: instagramIcon },
    { match: "youtube.com", name: "YouTube", icon: youtubeIcon },
    { match: "youtu.be", name: "YouTube", icon: youtubeIcon },
    { match: "gmail.com", name: "Gmail", icon: gmailIcon },
  ];

  for (const platform of platforms) {
    if (lowerUrl.includes(platform.match)) {
      return {
        name: platform.name,
        icon: <img src={platform.icon} alt={platform.name} style={SOCIAL_ICON_SIZE} />,
      };
    }
  }

  return {
    name: "Website",
    icon: <img src={websiteIcon} alt="Website" style={WEBSITE_ICON_SIZE} />,
  };
};
