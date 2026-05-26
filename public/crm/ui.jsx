/* ============================================
   Shared UI primitives — shadcn vocabulary
   - Button, Badge, Card, Input, Select, Avatar
   - Module accents helper
   ============================================ */

const cn = (...xs) => xs.filter(Boolean).join(" ");

/* ---------- Icon helper (lucide vanilla UMD) ---------- */
// lucide vanilla exposes window.lucide.<IconName> as an IconNode array of [tag, props, children?]
const Icon = ({ name, size = 16, className = "", strokeWidth = 1.75, style }) => {
  const Lib = window.lucide || {};
  let data = Lib[name];
  // Try kebab-case fallback (icons object)
  if (!data && Lib.icons) {
    const kebab = name.replace(/([A-Z])/g, (m, c, i) => (i === 0 ? "" : "-") + c.toLowerCase());
    data = Lib.icons[kebab];
  }
  if (!data) data = Lib.HelpCircle;
  if (!data) return <span style={{ display: "inline-block", width: size, height: size, ...style }} />;
  // React component path (lucide-react UMD)
  if (typeof data === "function") {
    const Comp = data;
    return <Comp size={size} strokeWidth={strokeWidth} className={className} style={style} />;
  }
  // Array IconNode path (lucide vanilla): ["svg", attrs, [["path", {...}], ...]]
  if (Array.isArray(data)) {
    let children = data;
    // Unwrap top-level ["svg", attrs, children]
    if (data.length === 3 && typeof data[0] === "string" && data[0] === "svg" && Array.isArray(data[2])) {
      children = data[2];
    }
    // Normalize SVG attrs from kebab-case to camelCase
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        className={className} style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}>
        {children.map((c, i) => {
          if (!Array.isArray(c) || typeof c[0] !== "string") return null;
          const [tag, attrs] = c;
          const reactProps = { key: i };
          for (const k in attrs) {
            // kebab → camel
            const ck = k.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
            reactProps[ck] = attrs[k];
          }
          return React.createElement(tag, reactProps);
        })}
      </svg>
    );
  }
  return <span style={{ display: "inline-block", width: size, height: size, ...style }} />;
};

/* ---------- Button ---------- */
const Button = ({ variant = "default", size = "default", className = "", children, ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none";
  const variants = {
    default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90",
    secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[oklch(0.94_0_0)]",
    outline: "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]",
    ghost: "hover:bg-[var(--muted)] text-[var(--foreground)]",
    destructive: "bg-[var(--destructive)] text-white hover:opacity-90",
    marketing: "bg-[var(--marketing)] text-white hover:opacity-90",
    sales: "bg-[var(--sales)] text-white hover:opacity-90",
    service: "bg-[var(--service)] text-white hover:opacity-90",
  };
  const sizes = {
    default: "h-9 px-3.5",
    sm: "h-8 px-3 text-xs",
    lg: "h-10 px-4",
    icon: "h-9 w-9",
    "icon-sm": "h-7 w-7",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

/* ---------- Badge ---------- */
const Badge = ({ tone = "default", soft = false, className = "", children, dot = false, ...props }) => {
  const tones = {
    default: soft ? "bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]" : "bg-[var(--foreground)] text-[var(--background)] border-transparent",
    marketing: soft ? "bg-[var(--marketing-soft)] text-[var(--marketing-fg)] border-[oklch(0.85_0.08_250)]" : "bg-[var(--marketing)] text-white border-transparent",
    sales: soft ? "bg-[var(--sales-soft)] text-[var(--sales-fg)] border-[oklch(0.88_0.1_70)]" : "bg-[var(--sales)] text-white border-transparent",
    service: soft ? "bg-[var(--service-soft)] text-[var(--service-fg)] border-[oklch(0.85_0.08_163)]" : "bg-[var(--service)] text-white border-transparent",
    slate: soft ? "bg-[oklch(0.95_0.01_240)] text-[oklch(0.4_0.02_240)] border-[oklch(0.88_0.02_240)]" : "bg-[oklch(0.45_0.02_240)] text-white border-transparent",
    amber: soft ? "bg-[oklch(0.95_0.08_85)] text-[oklch(0.4_0.15_75)] border-[oklch(0.88_0.1_85)]" : "bg-[oklch(0.78_0.16_75)] text-white border-transparent",
    rose: soft ? "bg-[oklch(0.96_0.04_15)] text-[oklch(0.45_0.18_20)] border-[oklch(0.88_0.06_15)]" : "bg-[oklch(0.62_0.2_20)] text-white border-transparent",
    purple: soft ? "bg-[oklch(0.95_0.04_290)] text-[oklch(0.4_0.18_290)] border-[oklch(0.88_0.06_290)]" : "bg-[oklch(0.55_0.18_290)] text-white border-transparent",
    green: soft ? "bg-[var(--service-soft)] text-[var(--service-fg)] border-[oklch(0.85_0.08_163)]" : "bg-[var(--service)] text-white border-transparent",
    blue: soft ? "bg-[var(--marketing-soft)] text-[var(--marketing-fg)] border-[oklch(0.85_0.08_250)]" : "bg-[var(--marketing)] text-white border-transparent",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border", tones[tone] || tones.default, className)} {...props}>
      {dot && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-75" />}
      {children}
    </span>
  );
};

/* ---------- Card ---------- */
const Card = ({ className = "", children, ...props }) => (
  <div className={cn("bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-[0_1px_2px_oklch(0_0_0/0.03)]", className)} {...props}>
    {children}
  </div>
);
const CardHeader = ({ className = "", children }) => (
  <div className={cn("p-4 pb-3 flex items-start justify-between gap-3", className)}>{children}</div>
);
const CardTitle = ({ className = "", children }) => (
  <h3 className={cn("text-sm font-semibold tracking-tight", className)}>{children}</h3>
);
const CardDescription = ({ className = "", children }) => (
  <p className={cn("text-xs text-[var(--muted-foreground)] mt-0.5", className)}>{children}</p>
);
const CardContent = ({ className = "", children }) => (
  <div className={cn("p-4 pt-0", className)}>{children}</div>
);

/* ---------- Input ---------- */
const Input = ({ className = "", icon = null, ...props }) => (
  <div className={cn("relative", className)}>
    {icon && <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">{icon}</div>}
    <input
      className={cn(
        "h-9 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 text-sm",
        "placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 focus:border-[var(--ring)]/40",
        icon && "pl-8"
      )}
      {...props}
    />
  </div>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={cn(
      "min-h-[80px] w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm",
      "placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 focus:border-[var(--ring)]/40 resize-none",
      className
    )}
    {...props}
  />
);

/* ---------- Select (native, styled) ---------- */
const Select = ({ className = "", children, ...props }) => (
  <div className={cn("relative", className)}>
    <select
      className="h-9 w-full appearance-none rounded-md border border-[var(--input)] bg-[var(--background)] px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40"
      {...props}
    >{children}</select>
    <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
  </div>
);

/* ---------- Avatar ---------- */
const Avatar = ({ name = "?", className = "", size = 28 }) => {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join("").toUpperCase();
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className={cn("inline-flex items-center justify-center rounded-full font-medium select-none", className)}
      style={{
        width: size, height: size, fontSize: size * 0.4,
        background: `oklch(0.92 0.05 ${hue})`,
        color: `oklch(0.35 0.12 ${hue})`,
      }}
    >{initials}</div>
  );
};

/* ---------- Tabs (controlled) ---------- */
const Tabs = ({ value, onChange, options, className = "", size = "default" }) => (
  <div className={cn("inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--muted)] border border-[var(--border)]", className)}>
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={cn(
          "px-3 rounded-md text-sm font-medium transition-all flex items-center gap-1.5",
          size === "sm" ? "h-7 text-xs" : "h-8",
          value === opt.value
            ? "bg-[var(--background)] text-[var(--foreground)] shadow-[0_1px_2px_oklch(0_0_0/0.06)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
      >
        {opt.icon && <Icon name={opt.icon} size={14} />}
        {opt.label}
      </button>
    ))}
  </div>
);

/* ---------- Module accent helper ---------- */
const moduleAccent = (mod) => {
  const map = {
    marketing: { soft: "bg-[var(--marketing-soft)]", fg: "text-[var(--marketing-fg)]", border: "border-[var(--marketing)]/30", solid: "bg-[var(--marketing)]", ring: "ring-[var(--marketing)]/30" },
    sales:     { soft: "bg-[var(--sales-soft)]",     fg: "text-[var(--sales-fg)]",     border: "border-[var(--sales)]/30",     solid: "bg-[var(--sales)]",     ring: "ring-[var(--sales)]/30" },
    service:   { soft: "bg-[var(--service-soft)]",   fg: "text-[var(--service-fg)]",   border: "border-[var(--service)]/30",   solid: "bg-[var(--service)]",   ring: "ring-[var(--service)]/30" },
  };
  return map[mod] || map.service;
};

/* ---------- Section header ---------- */
const PageHeader = ({ title, subtitle, accent, children }) => {
  const a = moduleAccent(accent);
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {accent && <span className={cn("inline-block w-1.5 h-5 rounded-sm", a.solid)} />}
          <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
};

/* ---------- KPI Stat card ---------- */
const Stat = ({ label, value, delta, deltaTone = "service", icon, accent }) => {
  const a = moduleAccent(accent);
  return (
    <Card className="card-pad">
      <CardContent className="p-4 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-[var(--muted-foreground)] font-medium">{label}</p>
            <p className="text-2xl font-semibold tracking-tight mt-1 tabular">{value}</p>
            {delta && <p className={cn("text-xs mt-1.5 flex items-center gap-1", "text-[var(--muted-foreground)]")}>
              <Badge tone={deltaTone} soft className="!px-1.5 !py-0">{delta}</Badge>
              <span>vs สัปดาห์ก่อน</span>
            </p>}
          </div>
          {icon && (
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", accent ? a.soft : "bg-[var(--muted)]")}>
              <Icon name={icon} size={18} className={accent ? a.fg : "text-[var(--muted-foreground)]"} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* ---------- Empty / divider ---------- */
const Divider = ({ className = "" }) => <div className={cn("h-px bg-[var(--border)]", className)} />;

const Empty = ({ icon = "Inbox", title, hint }) => (
  <div className="py-10 text-center text-[var(--muted-foreground)]">
    <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-[var(--muted)] flex items-center justify-center">
      <Icon name={icon} size={18} />
    </div>
    <p className="text-sm font-medium text-[var(--foreground)]">{title}</p>
    {hint && <p className="text-xs mt-0.5">{hint}</p>}
  </div>
);

/* ---------- Modal ---------- */
const Modal = ({ open, onClose, title, description, children, footer, size = "default" }) => {
  if (!open) return null;
  const sizes = { sm: "max-w-md", default: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 fade-in" style={{ background: "oklch(0 0 0 / 0.45)" }} onClick={onClose}>
      <div className={cn("w-full bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-2xl slide-up overflow-hidden", sizes[size])} onClick={e => e.stopPropagation()}>
        <div className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            {description && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-md p-1 hover:bg-[var(--muted)]">
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto scroll-thin">{children}</div>
        {footer && <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)]/30 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

/* ---------- Toast (simple, mounted in App) ---------- */
const ToastCtx = React.createContext(null);
const ToastProvider = ({ children }) => {
  const [items, setItems] = React.useState([]);
  const push = React.useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setItems(xs => [...xs, { id, ...t }]);
    setTimeout(() => setItems(xs => xs.filter(x => x.id !== id)), t.duration || 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {items.map(it => (
          <div key={it.id} className="pointer-events-auto bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg px-4 py-3 min-w-[280px] max-w-sm slide-up">
            <div className="flex items-start gap-2.5">
              <div className={cn("h-7 w-7 rounded-md flex items-center justify-center mt-0.5",
                it.tone === "service" && "bg-[var(--service-soft)] text-[var(--service-fg)]",
                it.tone === "marketing" && "bg-[var(--marketing-soft)] text-[var(--marketing-fg)]",
                it.tone === "sales" && "bg-[var(--sales-soft)] text-[var(--sales-fg)]",
                (!it.tone || it.tone === "default") && "bg-[var(--muted)] text-[var(--foreground)]"
              )}>
                <Icon name={it.icon || "CheckCircle2"} size={15} />
              </div>
              <div>
                <p className="text-sm font-medium">{it.title}</p>
                {it.description && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{it.description}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};
const useToast = () => React.useContext(ToastCtx);

Object.assign(window, {
  cn, Icon, Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent,
  Input, Textarea, Select, Avatar, Tabs, moduleAccent, PageHeader, Stat,
  Divider, Empty, Modal, ToastProvider, useToast,
});
