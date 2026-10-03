import { useEffect, useRef, useState } from "react";
import { profile, stats, skills, concepts, projects, experience, education, hobbies } from "./data.js";

const NAV = ["About", "Skills", "Projects", "Experience", "Education", "Hobbies", "Contact"];
const dv = (n, v = "original") => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${n}/${n}-${v}.svg`;

/* ---------- hooks & helpers ---------- */
function useInView(margin = "-12%") {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), o.disconnect()), { rootMargin: `0px 0px ${margin} 0px` });
    ref.current && o.observe(ref.current);
    return () => o.disconnect();
  }, [margin]);
  return [ref, shown];
}

const Reveal = ({ children, delay = 0, fx = "up", className = "", style, ...rest }) => {
  const [ref, shown] = useInView();
  return (
    <div ref={ref} className={`reveal ${fx} ${shown ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </div>
  );
};

// pointer position inside the element as CSS vars (spotlights, tilt, shine)
const spot = (e) => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  el.style.setProperty("--rx", `${(0.5 - y / r.height) * 12}deg`);
  el.style.setProperty("--ry", `${(x / r.width - 0.5) * 14}deg`);
};
const isTouch = () => typeof matchMedia !== "undefined" && matchMedia("(hover: none)").matches;

// on touch screens there is no hover, so elements marked data-act get a data-on attribute while centred in the viewport
function useTouchActive() {
  useEffect(() => {
    if (!isTouch()) return;
    const o = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.toggleAttribute("data-on", e.isIntersecting)),
      { rootMargin: "-38% 0px -38% 0px" }
    );
    document.querySelectorAll("[data-act]").forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, []);
}
const unTilt = (e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };

const Split = ({ text, className = "" }) => (
  <span className={`split ${className}`} aria-label={text}>
    {[...text].map((c, i) => <span key={i} className="ch" style={{ "--i": i }} aria-hidden>{c === " " ? " " : c}</span>)}
  </span>
);

function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
  };
  return <span ref={ref} className="magnet" onMouseMove={move} onMouseLeave={() => (ref.current.style.transform = "")}>{children}</span>;
}

function CountUp({ value, run }) {
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const [n, setN] = useState(m ? 0 : value);
  useEffect(() => {
    if (!run) return;
    if (!m) { // scramble non-numeric values
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&";
      let f = 0;
      const id = setInterval(() => {
        f++;
        setN([...value].map((c, i) => (i < f / 2 ? c : chars[(Math.random() * chars.length) | 0])).join(""));
        if (f / 2 >= value.length) clearInterval(id);
      }, 40);
      return () => clearInterval(id);
    }
    const end = +m[2], t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 1400));
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
      p < 1 && (raf = requestAnimationFrame(tick));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{m ? `${m[1]}${n}${m[3]}` : n}</>;
}

function Typed({ words }) {
  const [t, setT] = useState("");
  const [w, setW] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = words[w % words.length];
    const id = setTimeout(() => {
      if (!del) { setT(full.slice(0, t.length + 1)); if (t.length + 1 === full.length) setTimeout(() => setDel(true), 1300); }
      else { setT(full.slice(0, t.length - 1)); if (t.length - 1 === 0) { setDel(false); setW(w + 1); } }
    }, del ? 35 : 70);
    return () => clearTimeout(id);
  }, [t, del, w, words]);
  return <span className="typed">{t}<i className="caret" /></span>;
}

function Logo({ src, name, size = 28, color }) {
  const [bad, setBad] = useState(!src);
  return bad ? (
    <span className="fallback" style={{ width: size, height: size, background: color, fontSize: size * 0.5 }}>{name[0]}</span>
  ) : (
    <img src={src} alt={`${name} logo`} width={size} height={size} loading="lazy" onError={() => setBad(true)} />
  );
}

const CrawlerIcon = () => (
  <svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
    <circle cx="24" cy="26" r="7" fill="#fff" fillOpacity=".18" /><circle cx="24" cy="15" r="4" />
    <path d="M17 22 8 14M17 27H6M18 32l-8 8M31 22l9-8M31 27h11M30 32l8 8" />
  </svg>
);

/* ---------- global chrome ---------- */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf;
    const move = (e) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      if (ref.current) ref.current.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move); loop();
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden />;
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement;
      ref.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
    };
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return <div ref={ref} className="progress" aria-hidden />;
}

function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [bar, setBar] = useState({ left: 0, width: 0 });
  const links = useRef({});
  useEffect(() => {
    const f = () => {
      setSolid(scrollY > 20);
      let cur = "";
      NAV.forEach((n) => { const s = document.getElementById(n.toLowerCase()); if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = n; });
      setActive(cur);
    };
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);
  useEffect(() => {
    const a = links.current[active];
    setBar(a ? { left: a.offsetLeft, width: a.offsetWidth } : { left: 0, width: 0 });
  }, [active]);
  return (
    <header className={`nav ${solid ? "solid" : ""} ${open ? "menu-open" : ""}`}>
      <a href="#top" className="brand"><span>&lt;</span>Shankz<span>/&gt;</span></a>
      <nav className={open ? "open" : ""}>
        <i className="nav-bar" style={{ transform: `translateX(${bar.left}px)`, width: bar.width, opacity: bar.width ? 1 : 0 }} />
        {NAV.map((n, i) => (
          <a key={n} style={{ "--i": i }} ref={(el) => (links.current[n] = el)} className={active === n ? "on" : ""} href={`#${n.toLowerCase()}`} onClick={() => setOpen(false)}>{n}</a>
        ))}
        <a className="btn small" style={{ "--i": NAV.length }} href="/Shankar_Azhwar_Resume.pdf" download>Resume ↓</a>
      </nav>
      <button className={`burger ${open ? "x" : ""}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><b /><b /></button>
    </header>
  );
}

/* ---------- HERO: content spreads apart & rearranges on hover ---------- */
const FLOATS = [
  // x/y = rest offset inside stage (%), sx/sy = spread vector (px), d = parallax depth
  { k: "React", i: dv("react"), cls: "badge", x: 2, y: 10, sx: -70, sy: -50, r: -8, sr: 14, d: 18 },
  { k: "Node.js", i: dv("nodejs"), cls: "badge", x: 80, y: 4, sx: 70, sy: -40, r: 6, sr: -12, d: 24 },
  { k: "TypeScript", i: dv("typescript"), cls: "badge", x: -4, y: 58, sx: -80, sy: 30, r: 5, sr: -10, d: 14 },
  { k: "AWS", i: dv("amazonwebservices", "original-wordmark"), cls: "badge", x: 86, y: 46, sx: 80, sy: 10, r: -6, sr: 12, d: 20 },
];

function Hero() {
  const ref = useRef(null);
  const [spread, setSpread] = useState(false);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5) * 2);
    ref.current.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  useEffect(() => {
    if (!isTouch()) return;
    const a = setTimeout(() => setSpread(true), 1600), b = setTimeout(() => setSpread(false), 3600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  const leave = () => { setSpread(false); ref.current.style.setProperty("--px", 0); ref.current.style.setProperty("--py", 0); };
  return (
    <section id="top" ref={ref} className={`hero ${spread ? "spread" : ""}`} onPointerEnter={(e) => e.pointerType === "mouse" && setSpread(true)} onPointerLeave={(e) => e.pointerType === "mouse" && leave()} onMouseMove={move}>
      <div className="grid-bg" aria-hidden />
      <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="pill sp" style={{ "--sx": 30, "--sy": -14, "--i": 0 }}><i className="dot" /> Open to new opportunities</span>
          <h1>
            <span className="l1"><span className="w sp" style={{ "--sx": -18, "--sy": -6, "--i": 1 }}>Hi,</span> <span className="w sp" style={{ "--sx": 22, "--sy": 6, "--sr": 4, "--i": 2 }}>I'm</span></span>
            <em className="name sp" style={{ "--sx": 10, "--sy": 4, "--i": 3 }}>{profile.name}</em>
          </h1>
          <h2 className="sp" style={{ "--sx": 44, "--sy": 4, "--i": 4 }}>{profile.role}</h2>
          <p className="lead sp" style={{ "--sx": -10, "--sy": 10, "--i": 5 }}>I build <Typed words={profile.typed} /></p>
          <div className="row hero-cta">
            <Magnetic><a className="btn sp" style={{ "--sx": -14, "--sy": 14, "--i": 6 }} href="#projects">View my work →</a></Magnetic>
            <Magnetic><a className="btn ghost sp" style={{ "--sx": 26, "--sy": 14, "--i": 7 }} href="#contact">Get in touch</a></Magnetic>
          </div>
          <div className="socials sp" style={{ "--sx": 0, "--sy": 22, "--i": 8 }}>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>

        <div className="hero-visual">
        <div className="stage" aria-hidden onClick={() => isTouch() && setSpread((v) => !v)}>
          <div className="ring" />
          <div className="ring r2" />
          <div className="fl portrait" style={{ "--r": -3, "--sr": 3, "--ss": 0.04, "--d": 8 }}>
            <div className="frame">
              <img src="/shankar.jpg" alt="Portrait of Shankar A R" />
              <div className="shine" />
            </div>
            <div className="nametag"><b>{profile.name}</b><span>📍 Nagercoil, IN</span></div>
          </div>
          {FLOATS.map((f, i) => (
            <div key={f.k} className={`fl ${f.cls}`} style={{ left: `${f.x}%`, top: `${f.y}%`, "--sx": f.sx, "--sy": f.sy, "--r": f.r, "--sr": f.sr, "--d": f.d, "--i": i }}>
              <Logo src={f.i} name={f.k} size={26} color="#334" /><span>{f.k}</span>
            </div>
          ))}
          {/* these two swap sides when the hero spreads */}
          <div className="fl card-stat" style={{ left: "-8%", top: "78%", "--sx": 300, "--sy": 30, "--r": -4, "--sr": 8, "--d": 30, "--i": 4 }}>
            <b>4+</b><span>years shipping<br />production code</span>
          </div>
          <div className="fl card-code" style={{ left: "64%", top: "84%", "--sx": -330, "--sy": -6, "--r": 3, "--sr": -6, "--d": 26, "--i": 5 }}>
            <code><i>const</i> focus = <s>"scale"</s>;</code>
          </div>
        </div>
        <button className="tap-hint" onClick={() => setSpread((v) => !v)}>✦ Tap to {spread ? "regroup" : "rearrange"}</button>
        </div>
      </div>
      <a href="#about" className="scroll-cue" aria-label="Scroll down"><span /></a>
    </section>
  );
}

/* ---------- section titles: words slide up out of a mask ---------- */
function Title({ k, t }) {
  const [ref, shown] = useInView();
  return (
    <div ref={ref} className={`title-wrap ${shown ? "in" : ""}`}>
      <p className="kicker">{k}</p>
      <h3 className="title">
        {t.split(" ").map((w, i) => <span key={i} className="mask"><span style={{ transitionDelay: `${i * 70}ms` }}>{w}</span></span>)}
      </h3>
    </div>
  );
}

/* ---------- ABOUT: 3D tilt bento, layers pop out toward you ---------- */
function About() {
  const [ref, shown] = useInView("-25%");
  return (
    <section id="about" className="sec">
      <div className="wrap">
        <Title k="01 — About" t="Engineering with ownership" />
        <div className="bento" ref={ref}>
          <Reveal fx="scale" data-act className="tile3d bio" onMouseMove={spot} onMouseLeave={unTilt}>
            <div className="layer">
              <span className="tag">whoami</span>
              <p className="about">{profile.about}</p>
              <p className="loc">📍 {profile.location}</p>
            </div>
          </Reveal>
          {stats.map((s, i) => (
            <Reveal key={s.l} fx="scale" delay={80 + i * 80} data-act className="tile3d stat" onMouseMove={spot} onMouseLeave={unTilt}>
              <div className="layer"><b><CountUp value={s.v} run={shown} /></b><span>{s.l}</span></div>
            </Reveal>
          ))}
          <Reveal fx="scale" delay={200} data-act className="tile3d focus" onMouseMove={spot} onMouseLeave={unTilt}>
            <div className="layer">
              <span className="tag">focus</span>
              <div className="focus-row">{["Scalability", "Performance", "Clean APIs", "ML integration"].map((f) => <span key={f}>{f}</span>)}</div>
            </div>
          </Reveal>
          <Reveal fx="scale" delay={260} data-act className="tile3d avail" onMouseMove={spot} onMouseLeave={unTilt}>
            <div className="layer">
              <span className="tag">status</span>
              <p><i className="dot" /> Available for Senior / Lead Full Stack roles</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- SKILLS: spotlight border + logos flip in a wave ---------- */
function Skills() {
  const half = Math.ceil(concepts.length / 2);
  return (
    <section id="skills" className="sec alt">
      <div className="wrap">
        <Title k="02 — Skills" t="Tools I work with" />
        <div className="skill-grid">
          {Object.entries(skills).map(([group, items], gi) => (
            <Reveal key={group} fx="left" delay={gi * 90} data-act className="spot-card" onMouseMove={spot}>
              <div className="sc-head"><h4>{group}</h4><span>{String(items.length).padStart(2, "0")}</span></div>
              <div className="logos">
                {items.map((s, i) => (
                  <div className="logo-chip" key={s.n} style={{ "--i": i }}>
                    <span className="tile"><Logo src={s.i} name={s.n} size={30} color="#334" /></span>
                    <small>{s.n}</small>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="marquee">
        {[concepts.slice(0, half), concepts.slice(half)].map((row, r) => (
          <div key={r} className={`track ${r ? "rev" : ""}`}>
            {[...row, ...row].map((c, i) => <span key={i} aria-hidden={i >= row.length}>{c}</span>)}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- PROJECTS: expanding accordion panels ---------- */
function Projects() {
  const [on, setOn] = useState(0);
  return (
    <section id="projects" className="sec">
      <div className="wrap">
        <Title k="03 — Projects" t="Platforms I've helped build" />
        <Reveal fx="clip" className="deck">
          {projects.map((p, i) => (
            <article
              key={p.name}
              className={`panel ${on === i ? "on" : ""}`}
              style={{ "--c": p.color }}
              onMouseEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onClick={(e) => {
                const el = e.currentTarget;
                setOn(i);
                isTouch() && setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 420);
              }}
              aria-expanded={on === i}
              onMouseMove={spot}
              tabIndex={0}
            >
              <div className="glow" />
              <div className="strip">
                <span className="num">0{i + 1}</span>
                <span className="vname">{p.name}</span>
              </div>
              <div className="pbody">
                <div className="proj-head s" style={{ "--i": 0 }}>
                  <span className="plogo">
                    {p.domain ? <Logo src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`} name={p.name} size={34} color={p.color} /> : <CrawlerIcon />}
                  </span>
                  <div><h4>{p.name}</h4><small>{p.tag}</small></div>
                  {p.url && <a className="ext" href={p.url} target="_blank" rel="noreferrer" aria-label={`Visit ${p.name}`} onClick={(e) => e.stopPropagation()}>↗</a>}
                  <span className="chev" aria-hidden><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></span>
                </div>
                <div className="pdetail"><div>
                <p className="role s" style={{ "--i": 1 }}>{p.role}</p>
                <p className="blurb s" style={{ "--i": 2 }}>{p.blurb}</p>
                <ul>{p.points.map((x, j) => <li key={x} className="s" style={{ "--i": 3 + j }}>{x}</li>)}</ul>
                <div className="facts s" style={{ "--i": 7 }}>{p.facts.map((f) => <span key={f}>✦ {f}</span>)}</div>
                <div className="chips s" style={{ "--i": 8 }}>{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                </div></div>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- EXPERIENCE: scroll-drawn line, sheen sweep + cascading bullets ---------- */
function Experience() {
  const ref = useRef(null);
  useEffect(() => {
    const f = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height));
      el.style.setProperty("--p", p);
    };
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <section id="experience" className="sec alt">
      <div className="wrap">
        <Title k="04 — Experience" t="Where I've worked" />
        <div className="timeline" ref={ref}>
          <Reveal fx="right" data-act className="item">
            <span className="node" />
            <div className="meta"><h4>{experience.title}</h4><span className="date">{experience.period}</span></div>
            <p className="co">{experience.company} · <em>{experience.note}</em></p>
            <ul>{experience.points.map((x, i) => <li key={x} style={{ "--i": i }}>{x}</li>)}</ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- EDUCATION: cap toss, year bar fills, tags pop ---------- */
function Education() {
  const [from, to] = education.period.split(/\s*[–-]\s*/);
  return (
    <section id="education" className="sec">
      <div className="wrap">
        <Title k="05 — Education" t="Where I studied" />
        <Reveal fx="up" data-act className="edu" onMouseMove={spot}>
          <div className="edu-cap" aria-hidden><span>🎓</span></div>
          <div className="edu-body">
            <div className="edu-years"><b>{from}</b><i /><b>{to}</b></div>
            <h4>{education.degree}</h4>
            <p>{education.school}</p>
            <div className="edu-tags">
              {["Bachelor of Engineering", "Computer Science", "Nagercoil, Tamil Nadu"].map((t, i) => <span key={t} style={{ "--i": i }}>{t}</span>)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- HOBBIES: liquid colour fill + a unique icon motion per hobby ---------- */
function Hobbies() {
  return (
    <section id="hobbies" className="sec alt">
      <div className="wrap">
        <Title k="06 — Hobbies" t="Life outside the editor" />
        <div className="hobbies">
          {hobbies.map((h, i) => (
            <Reveal key={h.key} fx="up" delay={i * 80} data-act className={`hobby h-${h.key}`} style={{ "--c": h.color }}>
              <span className="liquid" aria-hidden />
              <span className="h-icon" aria-hidden>{h.icon}</span>
              <h4>{h.name}</h4>
              <p>{h.line}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT: letters ripple, magnetic buttons, spinning border ---------- */
function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };
  return (
    <section id="contact" className="sec">
      <div className="wrap">
        <Reveal fx="scale" data-act className="cta">
          <div className="cta-inner">
            <p className="kicker">07 — Contact</p>
            <h3 className="big"><Split text="Let's build" /><br /><Split text="something great" className="grad" /></h3>
            <p className="about">Have a role, project or idea in mind? I'd love to hear about it.</p>
            <div className="row center">
              <Magnetic><a className="btn" href={`mailto:${profile.email}`}>{profile.email}</a></Magnetic>
              <Magnetic><button className="btn ghost" onClick={copy}>{copied ? "Copied ✓" : "Copy email"}</button></Magnetic>
              <Magnetic><a className="btn ghost" href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a></Magnetic>
              <Magnetic><a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></Magnetic>
            </div>
          </div>
        </Reveal>
        <footer>
          <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
          <a href="#top" className="to-top">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  useTouchActive();
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main><Hero /><About /><Skills /><Projects /><Experience /><Education /><Hobbies /><Contact /></main>
    </>
  );
}
