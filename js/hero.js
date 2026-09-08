/* 首屏姓名与求职信息、照片窗户，以及简历概览。 */

function PortraitWindow() {
  const [open, setOpen] = useState(false);
  return h("figure", {
    className: "hero-photo living-window"
  }, h("div", {
    className: "hero-photo-frame window-scene"
  }, h("button", {
    type: "button",
    className: "portrait-window" + (open ? " is-open" : ""),
    "aria-expanded": open,
    "aria-controls": "window-portrait",
    "aria-label": open ? "Close the portrait door" : "Open the door to meet Yvette",
    onClick: () => setOpen(v => !v)
  }, h("span", {
    className: "window-photo",
    id: "window-portrait"
  }, h("img", {
    src: SOLO,
    alt: "Yvette standing beside the turquoise water at Lake Louise",
    width: "1100",
    height: "1467",
    fetchPriority: "high"
  })), h("span", {
    className: "window-sunlight",
    "aria-hidden": "true"
  }), h("span", {
    className: "window-shutter shutter-left",
    "aria-hidden": "true"
  }, h("span", {
    className: "shutter-panel"
  }), h("span", {
    className: "window-handle"
  })), h("span", {
    className: "window-shutter shutter-right",
    "aria-hidden": "true"
  }, h("span", {
    className: "shutter-panel"
  }), h("span", {
    className: "window-handle"
  })), h("span", {
    className: "window-invitation",
    "aria-hidden": "true"
  }, h("span", {
    className: "window-invitation-kicker"
  }, "A little curiosity"), h("strong", null, "Come say hello."), h("span", {
    className: "window-open-hint"
  }, "Click to open the door ↗")))), h("figcaption", null, h("span", null, "Lake Louise, Banff"), h("span", {
    className: "window-caption-action"
  }, open ? "Click the photo to close the door" : "Your first little discovery")));
}

function Hero() {
  return h("section", {
    className: "hero",
    id: "top"
  }, h("div", null, h("p", {
    className: "greet"
  }, "Hi, I'm"), h("h1", null, h("span", {
    className: "given"
  }, "Yvette"), " ", h("span", {
    className: "family"
  }, "Wu")), h("p", {
    className: "legal-name"
  }, "Chenyu (Yvette) Wu"), h("p", {
    className: "lede"
  }, "Three years of credit risk and data work at ", h("b", null, "HSBC"), " and ", h("b", null, "RBC"), ", now studying computer science at UBC and building things with it."), h("dl", {
    className: "availability"
  }, h("div", {
    className: "head"
  }, h("span", {
    className: "dot"
  }), "Open to work"), h("div", {
    className: "avail-row"
  }, h("dt", null, "Work status"), h("dd", null, h("b", null, "Canadian permanent resident"), " — no sponsorship or work permit needed.")), h("div", {
    className: "avail-row"
  }, h("dt", null, "Looking for"), h("dd", null, "Co-op terms and full-time roles in ", h("b", null, "data, analytics and software"), ".")), h("div", {
    className: "avail-row"
  }, h("dt", null, "Based in"), h("dd", null, "Vancouver, BC · English and Mandarin · flexible start date."))), h("div", {
    className: "hero-actions"
  }, h("a", {
    className: "button primary",
    href: "mailto:yvettewu2017@gmail.com"
  }, Icon("mail"), "Email me"), h("a", {
    className: "button",
    href: "https://www.linkedin.com/in/chenyu-yvette-wu/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, Icon("linkedin"), "LinkedIn"), h("a", {
    className: "button",
    href: "https://github.com/MMM1122",
    target: "_blank",
    rel: "noopener noreferrer"
  }, Icon("github"), "GitHub"))), h(PortraitWindow, null));
}

function Glance() {
  const items = [{
    v: "3 yrs",
    l: "Credit risk and data at HSBC and RBC"
  }, {
    v: "3.95",
    l: "GPA, B.Sc. Statistics & Economics, with Distinction"
  }, {
    v: "2028",
    l: "B.Sc. Computer Science at UBC, in progress"
  }, {
    v: "PR",
    l: "Canadian permanent resident, work-authorised",
    pr: true
  }];
  return h("div", {
    className: "glance"
  }, items.map(i => h("div", {
    key: i.l
  }, h("div", {
    className: "v" + (i.pr ? " pr" : "")
  }, i.v), h("div", {
    className: "l"
  }, i.l))));
}
