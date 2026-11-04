/* Work and education timeline, project cards, skills, and about me. */

function Timeline() {
  const jump = id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1600);
  };
  const bars = row => TIMELINE.filter(t => t.row === row).map((t, i) => h("button", {
    key: t.id,
    className: "tl-bar " + t.row + (t.alt ? " alt" : ""),
    style: {
      left: pct(t.start) + "%",
      width: pct(t.end) - pct(t.start) + "%",
      animationDelay: 0.15 + i * 0.1 + "s"
    },
    title: t.full || t.short,
    "aria-label": "Jump to " + (t.full || t.short),
    onClick: () => jump(t.id)
  }, t.short));
  return h("div", null, h("div", {
    className: "tl-legend"
  }, h("span", null, h("span", {
    className: "swatch",
    style: {
      background: "var(--bar-school-bg)"
    }
  }), "Study"), h("span", null, h("span", {
    className: "swatch",
    style: {
      background: "#E9CB92"
    }
  }), "Work")), h("div", {
    className: "tl-scroll",
    tabIndex: "0",
    role: "group",
    "aria-label": "Study and work timeline, 2018 to 2028"
  }, h("div", {
    className: "tl-chart"
  }, h("div", {
    className: "tl-row"
  }, h("div", {
    className: "tl-track"
  }, bars("school"))), h("div", {
    className: "tl-row"
  }, h("div", {
    className: "tl-track"
  }, bars("work"))), h("div", {
    className: "tl-axis",
    "aria-hidden": "true"
  }, TICKS.map(y => h("span", {
    key: y,
    className: "tl-tick",
    style: {
      left: pct(y) + "%"
    }
  }, y))))), h("p", {
    className: "tl-hint"
  }, "Select a bar to jump to the details."));
}

function Experience() {
  return h("section", {
    id: "experience"
  }, h("h2", null, "Where I've worked"), h("p", {
    className: "section-note"
  }, "Three years across two Canadian banks, mostly on the data side of credit risk — and, since 2025, back at UBC for a computer science degree."), Timeline(), h("div", {
    className: "entries"
  }, JOBS.map(j => h("article", {
    className: "entry",
    id: j.id,
    key: j.id
  }, h("div", {
    className: "entry-head"
  }, h("div", null, h("h3", null, j.role), h("div", {
    className: "org"
  }, j.org)), h("span", {
    className: "when"
  }, j.dates)), h("ul", {
    className: "bullets"
  }, j.bullets.map((b, i) => h("li", {
    key: i
  }, b)))))), h("p", {
    className: "sub-label"
  }, "Education"), h("div", {
    className: "edu-grid"
  }, EDU.map(e => h("article", {
    className: "edu",
    id: e.id,
    key: e.id
  }, h("div", {
    className: "entry-head"
  }, h("div", null, h("h3", null, e.degree), h("div", {
    className: "org"
  }, e.org)), h("span", {
    className: "when"
  }, e.dates)), h("p", null, e.note)))));
}

function ThresholdExplorer() {
  const [sel, setSel] = useState("default");
  const p = POLICIES.find(x => x.id === sel);
  const row = (label, value, bg, fg) => {
    const shown = Math.round(value * 100),
      inside = value >= 0.16;
    return h("div", {
      className: "bar-row",
      key: label
    }, h("span", {
      className: "bar-label"
    }, label), h("span", {
      className: "bar-lane",
      role: "img",
      "aria-label": label + ": " + shown + " percent"
    }, h("span", {
      className: "bar-fill",
      style: {
        width: shown + "%",
        background: bg
      }
    }, inside && h("span", {
      className: "bar-num",
      style: {
        color: fg
      }
    }, shown, "%")), !inside && h("span", {
      className: "bar-num outside",
      style: {
        left: shown + "%",
        color: "var(--soft)"
      }
    }, shown, "%")));
  };
  return h("div", {
    className: "explorer"
  }, h("h4", null, "Four thresholds, one model"), h("p", {
    className: "hint"
  }, "The classifier never changes. Only the cutoff does — and the cutoff decides who the lender says no to."), h("div", {
    className: "policies"
  }, POLICIES.map(x => h("button", {
    key: x.id,
    className: "policy",
    "aria-pressed": sel === x.id,
    onClick: () => setSel(x.id)
  }, x.label, " ", x.thr))), h("div", {
    className: "bars"
  }, row("Defaulters caught", p.recall, "#57D6A4", "#04150E"), row("Flags that were right", p.precision, "#2FA277", "#04150E"), row("Share of book flagged", p.flagged, p.flagged > 0.5 ? "#E9A87C" : "#9ED2A6", "#0C1A12")), h("p", {
    className: "note"
  }, p.note));
}

function Project({
  p
}) {
  return h("article", {
    className: "project" + (p.featured ? " featured" : "")
  }, h("div", {
    className: "project-top"
  }, h("h3", null, p.name), h("span", {
    className: "kind"
  }, p.kind)), p.award && h("p", {
    className: "project-award"
  }, h("span", { "aria-hidden": "true" }, "★"), p.award), h("p", {
    className: "question"
  }, p.question), h("div", {
    className: "figures"
  }, p.figures.map(f => h("div", {
    className: "figure",
    key: f.l
  }, h("div", {
    className: "n"
  }, f.n), h("div", {
    className: "l"
  }, f.l)))), h("div", {
    className: "tags"
  }, p.tags.map(t => h("span", {
    className: "tag",
    key: t
  }, t))), h("div", {
    className: "links"
  }, p.links.map(l => h("a", {
    key: l.href,
    href: l.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, l.label, " ↗"))), h("details", null, h("summary", null, "How it works, and what it trades off"), p.id === "credit" && h(ThresholdExplorer, null), h("ul", {
    className: "bullets"
  }, p.bullets.map((b, i) => h("li", {
    key: i
  }, b))), p.pull && h("div", {
    className: "pull"
  }, h("p", null, p.pull), h("div", {
    className: "who"
  }, p.pullWho))));
}

function Projects() {
  return h("section", {
    id: "projects"
  }, h("h2", null, "Things I've built"), h("p", {
    className: "section-note"
  }, "A selection of finished projects and ongoing experiments. Open each one to explore the technical decisions, trade-offs and work still in progress."), PROJECTS.map(p => h(Project, {
    key: p.id,
    p: p
  })));
}

function Skills() {
  return h("section", {
    id: "skills"
  }, h("h2", null, "What I work with"), h("div", {
    className: "skills"
  }, SKILLS.map(s => h("div", {
    className: "skill",
    key: s.title
  }, h("h3", null, s.title), h("div", {
    className: "chips"
  }, s.items.map(i => h("span", {
    className: "chip",
    key: i
  }, i)))))));
}

function About() {
  return h("section", {
    id: "about"
  }, h("h2", null, "A little about me"), h("div", {
    className: "about"
  }, h("div", null, h("p", null, "I travel whenever I get the chance, ideally somewhere I have never been, without much of a plan. The best trips have been the ones where I did not know what to expect, and I come home with a few good stories."), h("p", null, "I take psychology and cognitive science courses when I can. Outside school it is detective stories — novels, games, and ", h("em", null, "Lie to Me"), " and ", h("em", null, "Elementary"), ", both of which I have rewatched more times than I will admit. I also play the guzheng (Grade 9), and fill in the rest with badminton, swimming, Zumba, or a hike when the weather allows."), h("div", {
    className: "chips"
  }, ["Guzheng, Grade 9", "Badminton & swimming", "Zumba", "Lie to Me & Elementary", "R&B and jazz"].map(t => h("span", {
    className: "chip",
    key: t
  }, t))), h("div", {
    className: "community"
  }, h("div", {
    className: "entry-head"
  }, h("div", null, h("h3", null, "Administrator, Vancouver Hanfu Culture Society"), h("div", {
    className: "org"
  }, "Volunteer")), h("span", {
    className: "when"
  }, "April 2018 – June 2023")), h("p", null, "Ran communications across three platforms while membership grew past 700, and coordinated volunteer teams for events of 20 to 100 people as the main point of contact."))), h("figure", {
    className: "about-photo"
  }, h("img", {
    src: MORAINE,
    alt: "Turquoise water, pine trees and mountain peaks at Moraine Lake in Banff",
    width: "1600",
    height: "1200",
    loading: "lazy"
  }), h("figcaption", null, "Moraine Lake, Banff"))));
}
