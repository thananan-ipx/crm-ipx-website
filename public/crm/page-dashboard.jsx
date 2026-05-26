/* ============================================
   CRM Dashboard
   ============================================ */

const FunnelChart = ({ data, accent = "marketing" }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const a = moduleAccent(d.accent || accent);
        return (
          <div key={d.label} className="flex items-center gap-3">
            <div className="w-28 shrink-0 text-xs text-[var(--muted-foreground)] font-medium">{d.label}</div>
            <div className="flex-1 h-6 rounded-md bg-[var(--muted)] overflow-hidden">
              <div className={cn("h-full rounded-md flex items-center justify-end px-2", a.solid)} style={{ width: `${pct}%` }}>
                <span className="text-[11px] font-semibold text-white tabular">{d.value}</span>
              </div>
            </div>
            <div className="w-12 text-xs text-right tabular text-[var(--muted-foreground)]">{Math.round(pct)}%</div>
          </div>
        );
      })}
    </div>
  );
};

const SparkBars = ({ data, accent = "service" }) => {
  const max = Math.max(...data);
  const a = moduleAccent(accent);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <div key={i} className={cn("flex-1 rounded-sm", a.solid)} style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (i / data.length) * 0.6 }} />
      ))}
    </div>
  );
};

const PipelineRow = ({ stage, count, value, accent, pct }) => {
  const a = moduleAccent(accent);
  return (
    <div className="flex items-center gap-3 py-2 row-pad">
      <div className={cn("w-1.5 h-8 rounded-sm", a.solid)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{stage}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{count} ดีล · ฿{value.toLocaleString()}</p>
      </div>
      <div className="w-28">
        <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
          <div className={cn("h-full", a.solid)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

const CrmDashboardPage = ({ onNavigate }) => {
  const { LEADS, FOLLOWUPS, PROPOSALS, JOBS, ACTIVITIES } = window.CRM_DATA;

  const stageCount = (st) => LEADS.filter(l => l.stage === st).length;
  const stageValue = (st) => LEADS.filter(l => l.stage === st).reduce((s, l) => s + l.value, 0);

  const totalLeads = LEADS.length;
  const won = stageCount("won");
  const convRate = ((won / totalLeads) * 100).toFixed(0);
  const activeProposals = PROPOSALS.filter(p => p.status === "Sent" || p.status === "Draft").length;

  const pipeline = [
    { stage: "Lead ใหม่", count: stageCount("new"), value: stageValue("new"), accent: "marketing" },
    { stage: "ติดต่อแล้ว", count: stageCount("contacted"), value: stageValue("contacted"), accent: "marketing" },
    { stage: "Qualified", count: stageCount("qualified"), value: stageValue("qualified"), accent: "marketing" },
    { stage: "ส่ง Proposal", count: stageCount("proposal"), value: stageValue("proposal"), accent: "sales" },
    { stage: "Follow-up", count: stageCount("followup"), value: stageValue("followup"), accent: "sales" },
    { stage: "Won", count: stageCount("won"), value: stageValue("won"), accent: "service" },
  ];
  const maxCount = Math.max(...pipeline.map(p => p.count));

  return (
    <div className="space-y-5">
      <PageHeader title="CRM Dashboard" subtitle="ภาพรวม Lead, Sale และ Service — อัปเดต real-time">
        <Button variant="outline" size="sm"><Icon name="Calendar" size={14} />30 วันล่าสุด</Button>
        <Button variant="outline" size="sm"><Icon name="Download" size={14} />Export</Button>
        <Button size="sm" onClick={() => onNavigate("leads")}><Icon name="Plus" size={14} />Lead ใหม่</Button>
      </PageHeader>

      {/* Module rail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { mod: "marketing", title: "Marketing", desc: "Lead ทั้งหมด", value: stageCount("new") + stageCount("contacted") + stageCount("qualified"), icon: "Magnet", route: "leads" },
          { mod: "sales", title: "Sales", desc: "Active deals", value: stageCount("proposal") + stageCount("followup"), icon: "PhoneCall", route: "sales" },
          { mod: "service", title: "Service", desc: "งานกำลังดำเนินการ", value: JOBS.length, icon: "Wrench", route: "service" },
        ].map(m => {
          const a = moduleAccent(m.mod);
          return (
            <button key={m.mod} onClick={() => onNavigate(m.route)} className={cn("text-left rounded-xl border p-4 hover:shadow-md transition-all", a.soft, a.border)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider", a.fg)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", a.solid)} />
                    {m.title}
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-1">{m.desc}</p>
                  <p className={cn("text-3xl font-semibold mt-2 tabular", a.fg)}>{m.value}</p>
                </div>
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center bg-white/60", a.fg)}>
                  <Icon name={m.icon} size={18} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Lead ทั้งหมด" value={totalLeads} delta="+12%" deltaTone="marketing" icon="Users" accent="marketing" />
        <Stat label="Conversion Rate" value={`${convRate}%`} delta="+3.2%" deltaTone="sales" icon="Target" accent="sales" />
        <Stat label="ลูกค้ารายใหม่ (เดือนนี้)" value={won} delta="+2" deltaTone="service" icon="UserPlus" accent="service" />
        <Stat label="งานกำลังดำเนินการ" value={JOBS.length} delta="—" deltaTone="default" icon="Briefcase" accent="service" />
      </div>

      {/* 2-col main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Pipeline ภาพรวม</CardTitle>
              <CardDescription>ดีลในแต่ละสถานะ — กดเพื่อดูใน Kanban</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("leads")}>เปิดดูทั้งหมด<Icon name="ArrowRight" size={14} /></Button>
          </CardHeader>
          <CardContent>
            <FunnelChart data={pipeline.map(p => ({ label: p.stage, value: p.count, accent: p.accent }))} />
          </CardContent>
        </Card>

        {/* Sources */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>ที่มาของ Lead</CardTitle>
              <CardDescription>30 วันล่าสุด</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { name: "Facebook", v: 14, c: "marketing" },
              { name: "Website", v: 9, c: "marketing" },
              { name: "Referral", v: 8, c: "sales" },
              { name: "Line OA", v: 5, c: "service" },
              { name: "Walk-in", v: 3, c: "default" },
            ].map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-20 text-xs">{s.name}</div>
                <div className="flex-1 h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div className={cn("h-full", moduleAccent(s.c).solid)} style={{ width: `${(s.v / 14) * 100}%` }} />
                </div>
                <div className="w-6 text-xs text-right tabular">{s.v}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity + follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>กิจกรรมล่าสุด</CardTitle>
              <CardDescription>Timeline — ทั้งระบบเห็นข้อมูลเดียวกัน</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {ACTIVITIES.slice(-6).reverse().map(a => {
                const lead = LEADS.find(l => l.id === a.leadId);
                return (
                  <li key={a.id} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-md bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] shrink-0">
                      <Icon name={a.icon} size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{a.text}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        {lead && <span className="font-medium text-[var(--foreground)]">{lead.company}</span>}
                        {lead && " · "}{a.by} · {a.at}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Follow-up วันนี้ / พรุ่งนี้</CardTitle>
              <CardDescription>{FOLLOWUPS.length} รายการ</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("sales")}>ดูทั้งหมด</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {FOLLOWUPS.slice(0, 5).map(f => {
              const lead = LEADS.find(l => l.id === f.leadId);
              return (
                <div key={f.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--muted)] cursor-pointer" onClick={() => onNavigate("sales")}>
                  <div className={cn("h-8 w-8 rounded-md flex items-center justify-center", moduleAccent("sales").soft, moduleAccent("sales").fg)}>
                    <Icon name={f.type === "Call" ? "Phone" : f.type === "Email" ? "Mail" : "MessageCircle"} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.company}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">ครั้งที่ {f.attempts} · {f.at.slice(11)}</p>
                  </div>
                  <Badge tone="sales" soft className="!px-1.5">{f.type}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

Object.assign(window, { CrmDashboardPage });
