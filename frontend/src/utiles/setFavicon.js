export const setFavicon = (href) => {
  if (!href) return;

  let link =
    document.querySelector("link[rel~='icon']") ||
    document.createElement("link");

  link.rel = "icon";
  link.type = "image/webp";
  link.href = href;

  document.head.appendChild(link);
};
