/* Contact information, email composition form, and guestbook. */

function MessageForm() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const compose = () => body.trim() + "\n\n— " + (name.trim() || "a visitor") + (from.trim() ? " (" + from.trim() + ")" : "");
  const send = async () => {
    if (!body.trim()) {
      setStatus({
        kind: "error",
        text: "Add a message before sending."
      });
      return;
    }
    if (FORM_ENDPOINT) {
      setSending(true);
      try {
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name: name.trim(),
            email: from.trim(),
            message: body.trim()
          })
        });
        if (!r.ok) throw new Error(r.status);
        setStatus({
          kind: "ok",
          text: "Message sent. I'll reply to " + (from.trim() || "you") + " soon."
        });
        setName("");
        setFrom("");
        setBody("");
      } catch (e) {
        setStatus({
          kind: "error",
          text: "That did not go through. Email " + EMAIL + " instead, or copy the message below."
        });
      } finally {
        setSending(false);
      }
      return;
    }
    const subject = "Message from " + (name.trim() || "your portfolio");
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(compose());
    setStatus({
      kind: "ok",
      text: "Your email app should be opening with the message ready to send."
    });
  };
  const copy = async () => {
    const text = compose();
    try {
      await navigator.clipboard.writeText(text);
      setStatus({
        kind: "ok",
        text: "Copied. Paste it into an email to " + EMAIL + "."
      });
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      setStatus(ok ? {
        kind: "ok",
        text: "Copied. Paste it into an email to " + EMAIL + "."
      } : {
        kind: "error",
        text: "Copying is blocked in this browser. Select the message and copy it manually."
      });
    }
  };
  return h("div", {
    className: "msg-form"
  }, h("h3", null, "Leave me a message"), h("p", {
    className: "msg-hint"
  }, FORM_ENDPOINT ? "It comes straight to my inbox." : "This hands the message to your email app, already filled in — nothing is stored on this page."), h("div", {
    className: "field-row"
  }, h("label", {
    className: "field"
  }, h("span", null, "Your name"), h("input", {
    type: "text",
    value: name,
    placeholder: "Optional",
    onChange: e => setName(e.target.value)
  })), h("label", {
    className: "field"
  }, h("span", null, "Email or company"), h("input", {
    type: "text",
    value: from,
    placeholder: "So I can reply",
    onChange: e => setFrom(e.target.value)
  }))), h("label", {
    className: "field"
  }, h("span", null, "Message"), h("textarea", {
    rows: 4,
    value: body,
    placeholder: "A role you are hiring for, a question about a project, or just hello.",
    onChange: e => setBody(e.target.value)
  })), h("div", {
    className: "msg-actions"
  }, h("button", {
    className: "button primary",
    onClick: send,
    disabled: sending
  }, Icon("mail"), sending ? "Sending…" : "Send message"), h("button", {
    className: "button",
    onClick: copy
  }, "Copy message")), status && h("p", {
    className: "msg-status " + status.kind,
    role: "status",
    "aria-live": "polite"
  }, status.text));
}

function Contact() {
  return h("section", {
    id: "contact",
    className: "contact"
  }, h("img", {
    src: AVATAR,
    alt: "",
    width: "72",
    height: "72",
    style: {
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      margin: "0 auto 1.2rem",
      border: "1px solid var(--edge-2)"
    }
  }), h("h2", null, "Let's talk"), h("p", null, "If you are hiring for a co-op or full-time role in data, analytics or software in Vancouver, I would love to hear from you."), h(MessageForm, null), h("div", {
    className: "contact-links"
  }, h("a", {
    className: "button",
    href: "mailto:" + EMAIL
  }, Icon("mail"), EMAIL), h("a", {
    className: "button",
    href: "https://www.linkedin.com/in/chenyu-yvette-wu/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, Icon("linkedin"), "LinkedIn"), h("a", {
    className: "button",
    href: "https://github.com/MMM1122",
    target: "_blank",
    rel: "noopener noreferrer"
  }, Icon("github"), "GitHub")), h("p", {
    className: "colophon"
  }, "Chenyu (Yvette) Wu · Vancouver, BC · Built with React."));
}

function Guestbook() {
  const demo = typeof location !== "undefined" && new URLSearchParams(location.search).get("guestbook") === "demo";
  const live = !!GUESTBOOK_API;
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState(null);
  const load = () => {
    if (demo && !live) {
      setEntries(DEMO_ENTRIES);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    fetch(GUESTBOOK_API).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
      setEntries(Array.isArray(d) ? d : d.entries || []);
      setLoading(false);
    }).catch(() => {
      setLoadError(true);
      setLoading(false);
    });
  };
  useEffect(() => {
    if (live || demo) load();
  }, []);
  if (!live && !demo) return null;
  const post = async () => {
    if (!message.trim()) {
      setStatus({
        kind: "error",
        text: "Write a message before posting."
      });
      return;
    }
    if (trap) {
      return;
    }
    if (!live) {
      setStatus({
        kind: "error",
        text: "This is a preview. The guestbook is not connected yet."
      });
      return;
    }
    setPosting(true);
    setStatus(null);
    try {
      const r = await fetch(GUESTBOOK_API, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          name: name.trim().slice(0, 40),
          message: message.trim().slice(0, 500),
          website: trap
        })
      });
      const d = await r.json();
      if (d.status !== "ok") throw new Error(d.message || "rejected");
      if (d.entry) setEntries([d.entry, ...entries]);
      setStatus({
        kind: "ok",
        text: d.pending ? "Thanks. Your message will appear once I have read it." : "Posted. Thanks for stopping by."
      });
      setName("");
      setMessage("");
    } catch (e) {
      setStatus({
        kind: "error",
        text: "That did not post. Try again in a moment, or email me instead."
      });
    } finally {
      setPosting(false);
    }
  };
  const shown = showAll ? entries : entries.slice(0, 6);
  const left = 500 - message.length;
  return h("section", {
    id: "guestbook"
  }, h("h2", null, "Guestbook"), h("p", {
    className: "section-note"
  }, "Say hello, leave a note about a project, or tell me where you found this. Names and messages are public — please keep anything private to email."), h("div", {
    className: "gb"
  }, h("div", {
    className: "gb-form"
  }, h("div", {
    className: "field-row"
  }, h("label", {
    className: "field"
  }, h("span", null, "Name"), h("input", {
    type: "text",
    value: name,
    maxLength: 40,
    placeholder: "Optional",
    onChange: e => setName(e.target.value)
  })), h("label", {
    className: "field trap",
    "aria-hidden": "true"
  }, h("span", null, "Website"), h("input", {
    type: "text",
    value: trap,
    tabIndex: "-1",
    autoComplete: "off",
    onChange: e => setTrap(e.target.value)
  }))), h("label", {
    className: "field"
  }, h("span", null, "Message"), h("textarea", {
    rows: 3,
    value: message,
    maxLength: 500,
    placeholder: "Keep it short and kind.",
    onChange: e => setMessage(e.target.value)
  })), h("div", {
    className: "gb-actions"
  }, h("button", {
    className: "button primary",
    onClick: post,
    disabled: posting
  }, posting ? "Posting…" : "Post to guestbook"), message.length > 400 && h("span", {
    className: "gb-count"
  }, left + " characters left")), status && h("p", {
    className: "msg-status " + status.kind,
    role: "status",
    "aria-live": "polite"
  }, status.text)), loading && h("p", {
    className: "gb-state"
  }, "Loading messages…"), loadError && h("div", {
    className: "gb-state"
  }, h("p", null, "The guestbook did not load. It may be a connection problem."), h("button", {
    className: "button",
    onClick: load
  }, "Try again")), !loading && !loadError && entries.length === 0 && h("p", {
    className: "gb-state"
  }, "No messages yet — yours would be the first."), !loading && !loadError && entries.length > 0 && h("ul", {
    className: "gb-list"
  }, shown.map((e, i) => h("li", {
    className: "gb-entry",
    key: i
  }, h("span", {
    className: "gb-avatar",
    "aria-hidden": "true"
  }, (e.name || "?").trim().charAt(0).toUpperCase()), h("div", null, h("div", {
    className: "gb-meta"
  }, h("strong", null, e.name ? e.name : "Anonymous"), h("span", null, since(e.date))), h("p", null, e.message))))), !showAll && entries.length > 6 && h("button", {
    className: "button gb-more",
    onClick: () => setShowAll(true)
  }, "Show all " + entries.length + " messages")));
}
