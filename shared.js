/* React 简写、图标和页面共用的小工具。 */

const {
  useState,
  useEffect,
  useRef
} = React;

const h = React.createElement;

const pct = y => (y - AXIS_START) / (AXIS_END - AXIS_START) * 100;

const ICONS = {
  mail: "M2 6.2A2.2 2.2 0 0 1 4.2 4h15.6A2.2 2.2 0 0 1 22 6.2v.35l-9.47 5.9a1 1 0 0 1-1.06 0L2 6.55V6.2Zm0 2.7 8.94 5.57a2.9 2.9 0 0 0 3.12 0L23 8.9v8.9a2.2 2.2 0 0 1-2.2 2.2H4.2A2.2 2.2 0 0 1 2 17.8V8.9Z",
  github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
};

const Icon = name => h("svg", {
  className: "icon",
  viewBox: "0 0 24 24",
  "aria-hidden": "true",
  focusable: "false"
}, h("path", {
  d: ICONS[name]
}));

const guestbookOn = () => !!GUESTBOOK_API || typeof location !== "undefined" && new URLSearchParams(location.search).get("guestbook") === "demo";

const NAV = guestbookOn() ? [...NAV_BASE.slice(0, 4), ["guestbook", "Guestbook"], ...NAV_BASE.slice(4)] : NAV_BASE;

const since = iso => {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + (mins === 1 ? " minute ago" : " minutes ago");
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + (hrs === 1 ? " hour ago" : " hours ago");
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + (days === 1 ? " day ago" : " days ago");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
