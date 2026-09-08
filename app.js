/* 页面章节顺序和 React 挂载入口。 */

function App() {
  return h(React.Fragment, null, h("a", {
    className: "skip-link",
    href: "#main"
  }, "Skip to content"), h(Topbar, null), h(LifeMotion, null), h("main", {
    id: "main"
  }, h(Hero, null), h(Glance, null), h(Experience, null), h(Projects, null), h(Skills, null), h(About, null), h(Guestbook, null), h(Contact, null), h(WoodenFish, null)));
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
