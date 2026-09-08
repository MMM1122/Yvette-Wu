/* Top navigation bar, mobile menu, and light/dark theme toggle. */

function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const next = theme === "dark" ? "light" : "dark";
  return h("button", {
    className: "theme-toggle",
    onClick: () => setTheme(next),
    "aria-label": "Switch to " + next + " theme"
  }, h("span", {
    "aria-hidden": "true"
  }, theme === "dark" ? "☀" : "☾"), h("span", {
    className: "tt-label"
  }, theme === "dark" ? "Light" : "Dark"));
}

function Topbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, {
      rootMargin: "-20% 0px -70% 0px"
    });
    document.querySelectorAll("main section[id]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return h("header", {
    className: "topbar"
  }, h("div", {
    className: "topbar-in"
  }, h("a", {
    className: "brand",
    href: "#top",
    "aria-label": "Yvette Wu, back to top"
  }, "yw", h("span", null, ".")), h("span", {
    className: "status-pill"
  }, h("span", {
    className: "dot"
  }), "Open to work"), h(ThemeToggle, null), h("button", {
    className: "menu-toggle",
    "aria-expanded": open,
    "aria-controls": "topnav",
    onClick: () => setOpen(!open)
  }, open ? "Close" : "Menu"), h("nav", {
    id: "topnav",
    className: "topnav" + (open ? " open" : ""),
    "aria-label": "Sections"
  }, NAV.map(([id, label]) => h("a", {
    key: id,
    href: "#" + id,
    "aria-current": active === id ? "location" : undefined,
    onClick: () => setOpen(false)
  }, label)))));
}
