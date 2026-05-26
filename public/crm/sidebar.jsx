/* ============================================
   Sidebar — match existing Case Management nav
   + new CRM section grouped by module
   ============================================ */

const SIDEBAR_NAV = [
  // Existing items from the live app ("จัดการเอกสาร" รวมไปอยู่ใน CRM → จัดการงาน)
  { kind: "single", title: "แดชบอร์ด", route: "dashboard-original", icon: "LayoutDashboard", group: "core", original: true },
  { kind: "single", title: "ปฏิทิน", route: "calendar", icon: "Calendar", group: "core", original: true },
  { kind: "single", title: "จัดการแพ็กเกจลูกค้า", route: "packages", icon: "Wallet", group: "core", original: true },
];

// NEW — CRM section
const CRM_NAV = [
  {
    kind: "section",
    title: "CRM",
    badge: "ใหม่",
    items: [
      { title: "CRM Dashboard", route: "crm-dashboard", icon: "LayoutGrid", accent: null },
      { title: "Marketing & Lead", route: "leads", icon: "Magnet", accent: "marketing", badge: 5 },
      { title: "AE Pipeline", route: "ae-pipeline", icon: "Briefcase", accent: "sales", badge: 5 },
      { title: "Sales Follow-up", route: "sales", icon: "PhoneCall", accent: "sales", badge: 5 },
      { title: "Proposal", route: "proposals", icon: "FileSignature", accent: "sales" },
      { title: "จัดการลูกค้า", route: "customers", icon: "Building2", accent: "service" },
      { title: "จัดการงาน", route: "service", icon: "Wrench", accent: "service", badge: 3 },
    ],
  },
];

const SETTINGS_NAV = {
  title: "ตั้งค่า",
  icon: "Settings2",
  items: [
    { title: "จัดการประเภทเอกสาร", route: "manage-doc-types" },
    { title: "จัดการเทมเพลตงาน", route: "manage-templates" },
    { title: "จัดการแผนก", route: "manage-departments" },
    { title: "จัดการผู้ใช้งาน", route: "manage-users" },
  ],
};

const Sidebar = ({ route, onNavigate, onToggleMobile, mobileOpen }) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const isActive = (r) => route === r;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onToggleMobile} />
      )}

      <aside className={cn(
        "z-50 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex flex-col",
        "lg:sticky lg:top-0 lg:h-screen lg:w-[260px] lg:flex",
        "fixed inset-y-0 left-0 w-[260px] transition-transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-3">
          <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate("crm-dashboard");}} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--sidebar-accent)]">
            <div className="bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] flex aspect-square w-8 h-8 items-center justify-center rounded-lg">
              <Icon name="Command" size={16} />
            </div>
            <div className="text-left text-sm leading-tight">
              <p className="font-medium truncate">Case Management</p>
              <p className="text-xs text-[var(--muted-foreground)] truncate">Netichai And Accounting</p>
            </div>
          </a>
        </div>

        <div className="px-3 mb-2">
          <Input icon={<Icon name="Search" size={14} />} placeholder="ค้นหาเมนู..." className="text-xs" />
        </div>

        <nav className="flex-1 overflow-y-auto scroll-thin px-3 pb-3 space-y-4">
          {/* Original Core nav */}
          <div>
            <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">ระบบหลัก</p>
            <ul className="space-y-0.5">
              {SIDEBAR_NAV.map(item => (
                <li key={item.route}>
                  <button
                    onClick={() => onNavigate(item.route)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors text-left",
                      isActive(item.route)
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                        : "text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)]/60"
                    )}
                  >
                    <Icon name={item.icon} size={16} />
                    <span className="truncate">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* NEW CRM section */}
          {CRM_NAV.map(section => (
            <div key={section.title}>
              <div className="px-2 mb-1.5 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{section.title}</p>
                {section.badge && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--service)]/15 text-[var(--service-fg)]">{section.badge}</span>
                )}
              </div>
              <ul className="space-y-0.5">
                {section.items.map(item => {
                  const accent = item.accent ? moduleAccent(item.accent) : null;
                  const active = isActive(item.route);
                  return (
                    <li key={item.route}>
                      <button
                        onClick={() => { onNavigate(item.route); onToggleMobile && onToggleMobile(false); }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors text-left group",
                          active
                            ? cn("bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]")
                            : "text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)]/60"
                        )}
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center",
                          accent ? cn(accent.soft, accent.fg) : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                        )}>
                          <Icon name={item.icon} size={13.5} />
                        </span>
                        <span className="truncate flex-1">{item.title}</span>
                        {item.badge && (
                          <span className={cn(
                            "text-[10px] tabular px-1.5 py-0.5 rounded font-semibold",
                            accent ? cn(accent.soft, accent.fg) : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          )}>{item.badge}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Settings */}
          <div>
            <button
              onClick={() => setSettingsOpen(o => !o)}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)]/60"
            >
              <Icon name="Settings2" size={16} />
              <span className="flex-1 text-left">ตั้งค่า</span>
              <Icon name={settingsOpen ? "ChevronDown" : "ChevronRight"} size={14} />
            </button>
            {settingsOpen && (
              <ul className="mt-1 ml-7 border-l border-[var(--sidebar-border)] pl-2 space-y-0.5">
                {SETTINGS_NAV.items.map(it => (
                  <li key={it.route}>
                    <button
                      onClick={() => onNavigate(it.route)}
                      className="w-full text-left text-sm py-1 px-2 rounded-md text-[var(--sidebar-foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]/60"
                    >{it.title}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Footer / user */}
        <div className="p-3 border-t border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-[var(--sidebar-accent)] cursor-pointer">
            <Avatar name="นิภา อ้อม" size={32} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">นิภา (อ้อม)</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">Admin · ฝ่ายขาย</p>
            </div>
            <Icon name="ChevronsUpDown" size={14} className="text-[var(--muted-foreground)]" />
          </div>
        </div>
      </aside>
    </>
  );
};

/* ---------- Topbar (page chrome) ---------- */
const Topbar = ({ route, breadcrumbs, onToggleMobile }) => {
  return (
    <header className="sticky top-0 z-30 bg-[var(--background)]/85 backdrop-blur border-b border-[var(--border)]">
      <div className="h-14 flex items-center gap-2 px-4 sm:px-6">
        <button className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-[var(--muted)]" onClick={() => onToggleMobile(true)}>
          <Icon name="Menu" size={18} />
        </button>
        <nav className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] flex-1 min-w-0">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="ChevronRight" size={13} className="opacity-50" />}
              <span className={cn(i === breadcrumbs.length - 1 && "text-[var(--foreground)] font-medium truncate")}>{b}</span>
            </React.Fragment>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" title="ค้นหา"><Icon name="Search" size={15} /></Button>
          <Button variant="ghost" size="icon-sm" title="ความช่วยเหลือ"><Icon name="HelpCircle" size={15} /></Button>
          <div className="relative">
            <Button variant="ghost" size="icon-sm" title="การแจ้งเตือน"><Icon name="Bell" size={15} /></Button>
            <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-[var(--destructive)]" />
          </div>
        </div>
      </div>
    </header>
  );
};

Object.assign(window, { Sidebar, Topbar });
