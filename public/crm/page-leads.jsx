/* ============================================
   Leads — Kanban / Funnel / Table
   With Marketing vs AE role separation
   - Top role switcher: Marketing & Sales | AE | All (handover view)
   - Qualified stage = handover bridge
   ============================================ */

const stageMeta = (id) => window.CRM_DATA.STAGES.find(s => s.id === id) || window.CRM_DATA.STAGES[0];

const visibleStagesForRole = (role) => {
  const { STAGES } = window.CRM_DATA;
  // Marketing/Sales view: new/contacted/qualified/followup/won (handover at won)
  if (role === "marketing") return STAGES.filter(s => s.phase === "marketing" || s.phase === "handover");
  // AE view: won (incoming bucket) + ae_meeting/ae_proposal/closed
  if (role === "ae")        return STAGES.filter(s => s.phase === "handover" || s.phase === "ae");
  return STAGES;
};

const phaseAccent = (phase) => phase === "marketing" ? "marketing" : phase === "ae" ? "sales" : "service";

/* ---------- Card ---------- */
const KanbanCard = ({ lead, onDragStart, onDragEnd, onOpen }) => {
  const { TAGS, REQUIRED_CALLS } = window.CRM_DATA;
  const stage = stageMeta(lead.stage);
  const isHandover = stage.phase === "handover" && !lead.aeOwner;
  const isFollowup = lead.stage === "followup";
  const isAeFollowup = lead.stage === "ae_followup";
  const callsNeeded = (lead.callsCount || 0) < (REQUIRED_CALLS || 5);

  return (
    <div
      className={cn(
        "kanban-card group bg-[var(--card)] border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-[0_1px_2px_oklch(0_0_0/0.04)] hover:shadow-md transition-all",
        isHandover ? "border-[var(--warning)]/60 bg-[oklch(0.99_0.04_85)]" : "border-[var(--border)] hover:border-[var(--ring)]/40"
      )}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", lead.id); e.currentTarget.classList.add("dragging"); onDragStart(lead); }}
      onDragEnd={(e) => { e.currentTarget.classList.remove("dragging"); onDragEnd(); }}
      onClick={() => onOpen(lead)}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold leading-tight line-clamp-2 flex-1">{lead.company}</p>
        <Badge tone={stage.color} soft className="!text-[10px] !px-1.5 !py-0 shrink-0">{lead.id}</Badge>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] truncate">{lead.contact} · {lead.nickname}</p>

      <div className="flex flex-wrap gap-1 mt-2">
        {lead.tags.slice(0, 3).map(tid => {
          const t = TAGS.find(t => t.id === tid);
          if (!t) return null;
          return <Badge key={tid} tone={t.color} soft className="!text-[10px] !py-0">{t.label}</Badge>;
        })}
      </div>

      {/* Sales 5-call Follow-up progress */}
      {isFollowup && (
        <div className="mt-2.5 p-1.5 rounded bg-[var(--sales-soft)]/60 border border-[var(--sales)]/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-[var(--sales-fg)] flex items-center gap-1">
              <Icon name="PhoneCall" size={10} />Follow-up
            </span>
            <span className={cn("text-[10px] font-bold tabular", callsNeeded ? "text-[var(--sales-fg)]" : "text-[var(--service-fg)]")}>
              {lead.callsCount || 0}/{REQUIRED_CALLS || 5} ครั้ง
            </span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: REQUIRED_CALLS || 5 }, (_, i) => (
              <div key={i} className={cn("flex-1 h-1 rounded-sm", i < (lead.callsCount || 0) ? "bg-[var(--sales)]" : "bg-[var(--muted)]")} />
            ))}
          </div>
        </div>
      )}

      {/* AE Deposit indicator */}
      {lead.stage === "ae_deposit" && (
        <div className="mt-2.5 px-2 py-1.5 rounded bg-[oklch(0.96_0.08_55)] border border-[oklch(0.7_0.15_55)]/30">
          <div className="flex items-center gap-1.5">
            <Icon name="HandCoins" size={11} className="text-[oklch(0.45_0.16_55)]" />
            <span className="text-[10px] font-semibold text-[oklch(0.4_0.16_55)] flex-1">รอมัดจำ 50% หรือ ≥ ฿5,000</span>
          </div>
        </div>
      )}

      {/* AE Onboard indicator */}
      {lead.stage === "ae_onboard" && (
        <div className="mt-2.5 px-2 py-1.5 rounded bg-[oklch(0.96_0.07_240)] border border-[oklch(0.6_0.15_240)]/30">
          <div className="flex items-center gap-1.5">
            <Icon name="GraduationCap" size={11} className="text-[oklch(0.4_0.16_240)]" />
            <span className="text-[10px] font-semibold text-[oklch(0.4_0.16_240)] flex-1">นัด Onboarding</span>
          </div>
        </div>
      )}

      {/* AE Follow-up indicator (payment/contract/docs) */}
      {isAeFollowup && (
        <div className="mt-2.5 px-2 py-1.5 rounded bg-[oklch(0.96_0.06_55)] border border-[oklch(0.7_0.15_55)]/30">
          <div className="flex items-center gap-1.5">
            <Icon name={lead.aeFollowupReason === "payment" ? "Banknote" : lead.aeFollowupReason === "contract" ? "FileSignature" : "FileText"} size={11} className="text-[oklch(0.45_0.16_55)]" />
            <span className="text-[10px] font-semibold text-[oklch(0.4_0.16_55)] flex-1">
              {lead.aeFollowupReason === "payment" ? "รอชำระเงิน"
                : lead.aeFollowupReason === "contract" ? "รอเซ็นสัญญา"
                : lead.aeFollowupReason === "documents" ? "รอเอกสาร" : "ติดตามต่อ"}
            </span>
            <span className="text-[10px] tabular text-[var(--muted-foreground)]">ครั้งที่ {lead.aeFollowupAttempts || 1}</span>
          </div>
        </div>
      )}

      {isHandover && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[oklch(0.45_0.16_75)] bg-[oklch(0.95_0.08_85)] px-1.5 py-1 rounded">
          <Icon name="Sparkles" size={10} />Won — รอ AE รับช่วงต่อ
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
          <Icon name="Banknote" size={12} />
          <span className="tabular">฿{lead.value.toLocaleString()}</span>
        </div>
        <div className="flex items-center -space-x-1.5">
          {lead.mkOwner && (
            <div className="ring-2 ring-[var(--card)] rounded-full" title={`Sales: ${lead.mkOwner}`}>
              <Avatar name={lead.mkOwner} size={20} />
            </div>
          )}
          {lead.aeOwner && (
            <div className="ring-2 ring-[var(--card)] rounded-full relative" title={`AE: ${lead.aeOwner}`}>
              <Avatar name={lead.aeOwner} size={20} />
              <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-bold bg-[var(--sales)] text-white rounded px-0.5 leading-none">AE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Column ---------- */
const KanbanColumn = ({ stage, leads, onDragOver, onDrop, onDragStart, onDragEnd, onOpenLead, isDropTarget }) => {
  const a = stage.color === "default" || stage.color === "slate" ? null : moduleAccent(stage.color);
  const total = leads.reduce((s, l) => s + l.value, 0);
  const isHandover = stage.phase === "handover";

  return (
    <div
      className={cn(
        "kanban-col flex flex-col h-full min-w-[280px] w-[280px] rounded-xl border transition-colors",
        isHandover ? "bg-[oklch(0.99_0.04_85)] border-[var(--warning)]/40" : "bg-[var(--muted)]/40 border-[var(--border)]",
        isDropTarget && "drop-target"
      )}
      onDragOver={(e) => { e.preventDefault(); }}
      onDragEnter={() => onDragOver(stage.id)}
      onDrop={(e) => { e.preventDefault(); onDrop(stage.id); }}
    >
      <div className="p-3 pb-2 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("w-1.5 h-5 rounded-sm shrink-0",
            isHandover ? "bg-[var(--warning)]" : (a ? a.solid : "bg-[oklch(0.6_0.02_240)]")
          )} />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">{stage.label}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-tight truncate">{leads.length} · ฿{total.toLocaleString()}</p>
          </div>
        </div>
        {isHandover && (
          <Badge tone="amber" soft className="!text-[9px] !py-0 !px-1.5"><Icon name="ArrowRightLeft" size={9} />Handover</Badge>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin p-2 space-y-2 min-h-[300px]">
        {leads.map(lead => <KanbanCard key={lead.id} lead={lead} onDragStart={onDragStart} onDragEnd={onDragEnd} onOpen={onOpenLead} />)}
        {leads.length === 0 && (
          <div className="text-center text-xs text-[var(--muted-foreground)] py-6 border border-dashed border-[var(--border)] rounded-md">
            ลากการ์ดมาที่นี่
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Phase rail above Kanban ---------- */
const PhaseRail = ({ stages, role }) => {
  // Group consecutive stages into phase segments
  const segments = [];
  let cur = null;
  stages.forEach((s, i) => {
    const phase = s.phase;
    if (!cur || cur.phase !== phase) {
      cur = { phase, stages: [s], start: i, count: 1 };
      segments.push(cur);
    } else {
      cur.stages.push(s);
      cur.count++;
    }
  });
  // Each segment width based on count
  const total = stages.length;
  return (
    <div className="flex items-stretch gap-3 px-2 mb-2">
      {segments.map((seg, i) => {
        const isMk = seg.phase === "marketing";
        const isHandover = seg.phase === "handover";
        const isAe = seg.phase === "ae";
        const colWidth = seg.count * 280 + (seg.count - 1) * 12; // 280px column + 12px gap
        return (
          <div key={i}
            style={{ width: `${colWidth}px` }}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border",
              isMk && "bg-[var(--marketing-soft)] border-[var(--marketing)]/30 text-[var(--marketing-fg)]",
              isHandover && "bg-[oklch(0.97_0.06_85)] border-[var(--warning)]/40 text-[oklch(0.45_0.16_75)]",
              isAe && "bg-[var(--sales-soft)] border-[var(--sales)]/30 text-[var(--sales-fg)]"
            )}>
            <div className={cn("h-6 w-6 rounded flex items-center justify-center",
              isMk && "bg-[var(--marketing)] text-white",
              isHandover && "bg-[var(--warning)] text-white",
              isAe && "bg-[var(--sales)] text-white"
            )}>
              <Icon name={isMk ? "Magnet" : isHandover ? "ArrowRightLeft" : "Briefcase"} size={13} />
            </div>
            <div className="leading-tight">
              <p className="font-semibold">
                {isMk ? "Phase 1 · Marketing / Sales" : isHandover ? "Handover (at Won)" : "Phase 2 · AE (Account Executive)"}
              </p>
              <p className="opacity-75">
                {isMk ? "หา Lead · Qualify · Follow-up (ไม่เกิน 5 ครั้ง) · ปิดดีล"
                  : isHandover ? "ลูกค้าตกลงซื้อแล้ว → ส่งต่อให้ AE"
                  : "1st Meeting · เก็บข้อมูล · ทำใบเสนอราคาเชิงลึก · Onboard"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Kanban ---------- */
const LeadsKanban = ({ leads, onMove, onOpenLead, role }) => {
  const stages = visibleStagesForRole(role);
  const [dragOver, setDragOver] = React.useState(null);
  const [dragLead, setDragLead] = React.useState(null);

  return (
    <div className="-mx-2 overflow-x-auto scroll-thin">
      {role === "all" && <PhaseRail stages={stages} role={role} />}
      <div className="flex gap-3 p-2 min-h-[560px]">
        {stages.map(s => (
          <KanbanColumn
            key={s.id}
            stage={s}
            leads={leads.filter(l => l.stage === s.id)}
            isDropTarget={dragOver === s.id && dragLead && dragLead.stage !== s.id}
            onDragOver={(stageId) => setDragOver(stageId)}
            onDragStart={(l) => setDragLead(l)}
            onDragEnd={() => { setDragOver(null); setDragLead(null); }}
            onDrop={(stageId) => {
              if (dragLead && dragLead.stage !== stageId) onMove(dragLead.id, stageId);
              setDragOver(null);
              setDragLead(null);
            }}
            onOpenLead={onOpenLead}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------- Funnel ---------- */
const LeadsFunnel = ({ leads, onOpenLead, role }) => {
  const stages = visibleStagesForRole(role);
  const total = leads.length || 1;
  return (
    <div className="space-y-1.5">
      {stages.map((s, i) => {
        const stageLeads = leads.filter(l => l.stage === s.id);
        const pct = (stageLeads.length / total) * 100;
        const widthPct = 100 - i * 12;
        const isHandover = s.phase === "handover";
        const value = stageLeads.reduce((sum, l) => sum + l.value, 0);
        const bg = isHandover ? "var(--warning)" : `var(--${s.color === "default" || s.color === "slate" ? "marketing" : s.color})`;
        return (
          <React.Fragment key={s.id}>
            {/* Handover divider above qualified */}
            {isHandover && (
              <div className="my-2 flex items-center gap-2">
                <div className="flex-1 h-px border-t-2 border-dashed border-[var(--warning)]/60" />
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--warning)]/15 text-[oklch(0.4_0.16_75)] flex items-center gap-1">
                  <Icon name="ArrowRightLeft" size={10} /> Handover · Marketing/Sales → AE
                </span>
                <div className="flex-1 h-px border-t-2 border-dashed border-[var(--warning)]/60" />
              </div>
            )}
            <div>
              <div className="flex items-end gap-3">
                <div className="w-36 shrink-0 text-right">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{s.desc}</p>
                </div>
                <div className="flex-1">
                  <div className="relative h-14 mx-auto rounded-lg flex items-center justify-center text-white font-semibold transition-all hover:scale-[1.01]"
                    style={{
                      width: `${widthPct}%`,
                      background: bg,
                      clipPath: i === stages.length - 1 ? undefined : "polygon(0 0, 100% 0, calc(100% - 20px) 100%, 20px 100%)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl tabular">{stageLeads.length}</span>
                      <div className="text-left text-[11px] opacity-90">
                        <p>฿{value.toLocaleString()}</p>
                        <p>{pct.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {stageLeads.length > 0 && (
                <div className="ml-36 mt-1.5 flex flex-wrap gap-1.5">
                  {stageLeads.slice(0, 6).map(l => (
                    <button key={l.id} onClick={() => onOpenLead(l)} className="text-[11px] px-2 py-1 rounded-md bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors">
                      {l.company}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ---------- Table ---------- */
const LeadsTable = ({ leads, onOpenLead, onMove, role }) => {
  const { TAGS } = window.CRM_DATA;
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/50">
            <tr className="border-b border-[var(--border)]">
              <th className="text-left font-medium px-3 py-2.5">Lead</th>
              <th className="text-left font-medium px-3 py-2.5">บริษัท / ผู้ติดต่อ</th>
              <th className="text-left font-medium px-3 py-2.5">Tags</th>
              <th className="text-left font-medium px-3 py-2.5">Source</th>
              <th className="text-left font-medium px-3 py-2.5">Phase / Stage</th>
              <th className="text-right font-medium px-3 py-2.5">มูลค่า</th>
              <th className="text-left font-medium px-3 py-2.5">เจ้าของ MK / AE</th>
              <th className="text-left font-medium px-3 py-2.5">ติดต่อล่าสุด</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map(l => {
              const s = stageMeta(l.stage);
              return (
                <tr key={l.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/40 cursor-pointer row-pad" onClick={() => onOpenLead(l)}>
                  <td className="px-3 py-2.5"><span className="text-xs font-mono text-[var(--muted-foreground)]">{l.id}</span></td>
                  <td className="px-3 py-2.5">
                    <p className="font-medium leading-tight">{l.company}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{l.contact}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {l.tags.slice(0, 2).map(tid => {
                        const t = TAGS.find(t => t.id === tid);
                        return t ? <Badge key={tid} tone={t.color} soft className="!text-[10px] !py-0">{t.label}</Badge> : null;
                      })}
                      {l.tags.length > 2 && <Badge soft className="!text-[10px] !py-0">+{l.tags.length - 2}</Badge>}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--muted-foreground)]">{l.source}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Badge tone={s.phase === "marketing" ? "marketing" : s.phase === "handover" ? "amber" : "sales"} soft className="!text-[10px] !py-0">
                        {s.phase === "marketing" ? "MK" : s.phase === "handover" ? "HO" : "AE"}
                      </Badge>
                      <Badge tone={s.color === "slate" ? "slate" : s.color} soft dot>{s.label}</Badge>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular font-medium">฿{l.value.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {l.mkOwner ? (
                        <div className="flex items-center gap-1" title={`Marketing: ${l.mkOwner}`}>
                          <Avatar name={l.mkOwner} size={22} />
                          <span className="text-[10px] text-[var(--muted-foreground)] font-medium">MK</span>
                        </div>
                      ) : <span className="text-xs text-[var(--muted-foreground)]">—</span>}
                      <Icon name="ArrowRight" size={12} className="text-[var(--muted-foreground)]" />
                      {l.aeOwner ? (
                        <div className="flex items-center gap-1" title={`AE: ${l.aeOwner}`}>
                          <Avatar name={l.aeOwner} size={22} />
                          <span className="text-[10px] text-[var(--sales-fg)] font-medium">AE</span>
                        </div>
                      ) : <span className="text-[11px] italic text-[var(--muted-foreground)]">รอ AE</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--muted-foreground)] text-xs">{l.lastTouch}</td>
                  <td className="px-3 py-2.5"><Icon name="ChevronRight" size={14} className="text-[var(--muted-foreground)]" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

/* ============================================
   New Lead modal
   ============================================ */
const NewLeadModal = ({ open, onClose, onCreate }) => {
  const { SOURCES, TAGS } = window.CRM_DATA;
  const [form, setForm] = React.useState({ company: "", contact: "", nickname: "", phone: "", line: "", email: "", source: "Facebook", tags: [], value: 0, note: "" });
  React.useEffect(() => { if (open) setForm({ company: "", contact: "", nickname: "", phone: "", line: "", email: "", source: "Facebook", tags: [], value: 0, note: "" }); }, [open]);

  const toggleTag = (id) => setForm(f => ({ ...f, tags: f.tags.includes(id) ? f.tags.filter(t => t !== id) : [...f.tags, id] }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="สร้าง Lead ใหม่"
      description="Step 1 · Marketing/Sales — บันทึก Lead เข้าระบบ"
      size="lg"
      footer={<>
        <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
        <Button variant="marketing" onClick={() => { onCreate(form); onClose(); }}>
          <Icon name="Plus" size={14} />สร้าง Lead
        </Button>
      </>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">ชื่อบริษัท *</label>
            <Input placeholder="เช่น Cloud Studio Bangkok" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">ผู้ติดต่อหลัก</label>
            <Input placeholder="เช่น คุณภัทร นาคะ" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">ชื่อเล่น</label>
            <Input placeholder="ตอง" value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">เบอร์โทร</label>
            <Input placeholder="08x-xxx-xxxx" icon={<Icon name="Phone" size={13} />} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">Line ID</label>
            <Input placeholder="@line-id" icon={<Icon name="MessageCircle" size={13} />} value={form.line} onChange={e => setForm(f => ({ ...f, line: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">Email</label>
            <Input placeholder="contact@company.co.th" icon={<Icon name="Mail" size={13} />} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">ที่มา (Source)</label>
            <Select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">มูลค่าโดยประมาณ (บาท/ปี)</label>
            <Input type="number" placeholder="24000" value={form.value || ""} onChange={e => setForm(f => ({ ...f, value: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">สนใจบริการ (Tag)</label>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map(t => {
              const on = form.tags.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggleTag(t.id)}
                  className={cn("px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                    on ? cn(moduleAccent("marketing").solid, "text-white border-transparent")
                       : "border-[var(--border)] hover:bg-[var(--muted)]"
                  )}
                >
                  {on && <Icon name="Check" size={12} className="inline mr-1" />}{t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg bg-[var(--marketing-soft)]/50 border border-[var(--marketing)]/20 p-3 text-xs text-[var(--marketing-fg)] flex items-start gap-2">
          <Icon name="Info" size={13} className="mt-0.5" />
          <div>
            <p className="font-medium">Workflow ครั้งถัดไป</p>
            <p className="mt-0.5 opacity-90">Marketing/Sales จะติดต่อลูกค้าและ Qualify · หาก Qualified แล้ว ระบบจะส่งต่อให้ AE รับช่วงต่อ</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">Note เริ่มต้น</label>
          <Textarea placeholder="ลูกค้าสนใจ ทำบัญชี + วาง BOI ภาษี ..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
        </div>
      </div>
    </Modal>
  );
};

/* ============================================
   Handover modal — assign AE
   ============================================ */
const HandoverModal = ({ open, lead, onClose, onConfirm }) => {
  const [ae, setAe] = React.useState(window.CRM_DATA.AE_TEAM?.[0] || "ขวัญ");
  React.useEffect(() => { if (open && lead?.aeOwner) setAe(lead.aeOwner); }, [open, lead]);
  if (!open || !lead) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Handover → ส่งต่อให้ AE"
      description="ลูกค้าตัดสินใจซื้อแล้ว · ส่งต่อให้ Account Executive ทำใบเสนอราคาเชิงลึกและ Onboard"
      footer={<>
        <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
        <Button variant="sales" onClick={() => onConfirm(lead.id, ae)}>
          <Icon name="ArrowRightLeft" size={13} />ส่งต่อให้ {ae}
        </Button>
      </>}
    >
      <div className="space-y-4">
        <Card className="!shadow-none">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center font-bold", moduleAccent("service").soft, moduleAccent("service").fg)}>{lead.company[0]}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{lead.company}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Sales: {lead.mkOwner} · ตามไปแล้ว {lead.callsCount || 0} ครั้ง · ฿{lead.value.toLocaleString()}/ปี</p>
            </div>
            <Badge tone="service" soft><Icon name="Trophy" size={11} />Won</Badge>
          </CardContent>
        </Card>

        <div>
          <p className="text-xs font-medium mb-2">เลือก AE</p>
          <div className="grid grid-cols-3 gap-2">
            {(window.CRM_DATA.AE_TEAM || ["ขวัญ", "พีท", "เจน"]).map(name => (
              <button key={name} onClick={() => setAe(name)}
                className={cn("flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all",
                  ae === name ? "border-[var(--sales)] bg-[var(--sales-soft)]/60" : "border-[var(--border)] hover:bg-[var(--muted)]"
                )}>
                <Avatar name={name} size={36} />
                <span className="text-xs font-medium">{name}</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{Math.floor(Math.random() * 5) + 2} deals active</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-[var(--sales-soft)] border border-[var(--sales)]/30 p-3 text-xs text-[var(--sales-fg)] space-y-1">
          <p className="font-semibold flex items-center gap-1.5"><Icon name="Sparkles" size={12} />ระบบจะทำให้อัตโนมัติ</p>
          <ol className="list-decimal pl-5 space-y-0.5 opacity-90">
            <li>แจ้งเตือน AE ที่เลือกผ่าน Line OA และในระบบ</li>
            <li>ส่ง Customer Journey ทั้งหมด (Sales note, call log {lead.callsCount || 0} ครั้ง, tags) ให้ AE</li>
            <li>เปลี่ยนสถานะเป็น "1st Meeting" และเปิดสิทธิ์ให้ AE จัดทำใบเสนอราคา</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
};

/* ============================================
   Lead Detail Drawer — phase-aware
   ============================================ */
/* ---------- AE Stage Requirements widget — blocks advance until all required fields filled ---------- */
const AeStageRequirementWidget = ({ lead, stageId, onUpdateFields, onAdvance, advanceLabel, nextStageId }) => {
  const spec = window.CRM_DATA?.AE_STAGE_REQUIREMENTS?.[stageId];
  if (!spec) return null;
  const stored = lead.stageData?.[stageId] || {};
  const [values, setValues] = React.useState(stored);
  React.useEffect(() => { setValues(stored); /* eslint-disable-next-line */ }, [lead.id, stageId]);

  const set = (id, v) => {
    const next = { ...values, [id]: v };
    setValues(next);
    onUpdateFields(lead.id, stageId, next);
  };

  const isFieldFilled = (f) => {
    if (f.dependsOn && values[f.dependsOn] !== "yes") return true; // conditional, skipped
    const v = values[f.id];
    if (f.type === "yesno") return v === "yes" || v === "no";
    if (f.type === "number") return v !== "" && v !== undefined && v !== null && !isNaN(Number(v));
    if (Array.isArray(v)) return v.length > 0;
    return v != null && String(v).trim() !== "";
  };
  const requiredFields = spec.fields.filter(f => !f.dependsOn || values[f.dependsOn] === "yes");
  const filledCount = requiredFields.filter(isFieldFilled).length;
  const total = requiredFields.length;
  const allFilled = filledCount === total;

  return (
    <Card className="!shadow-none border-[var(--sales)]/30">
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] uppercase font-semibold tracking-wider text-[var(--sales-fg)] flex items-center gap-1">
            <Icon name="ListChecks" size={12} />{spec.title}
          </p>
          <Badge tone={allFilled ? "service" : "sales"} soft className="!text-[10px]">
            {filledCount}/{total} ครบ
          </Badge>
        </div>

        <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden mb-3">
          <div className={cn("h-full", moduleAccent(allFilled ? "service" : "sales").solid)} style={{ width: `${(filledCount / total) * 100}%` }} />
        </div>

        <div className="space-y-2.5 max-h-[360px] overflow-y-auto scroll-thin pr-1">
          {spec.fields.map(f => {
            if (f.dependsOn && values[f.dependsOn] !== "yes") return null;
            const v = values[f.id] ?? "";
            const filled = isFieldFilled(f);
            return (
              <div key={f.id}>
                <label className="text-[11px] font-medium flex items-center gap-1 mb-0.5">
                  {filled ? <Icon name="CheckCircle2" size={11} className="text-[var(--service-fg)]" /> : <Icon name="Circle" size={11} className="text-[var(--muted-foreground)]" />}
                  {f.label}
                  {f.unit && <span className="text-[10px] text-[var(--muted-foreground)] font-normal">({f.unit})</span>}
                </label>
                {f.type === "yesno" && (
                  <div className="grid grid-cols-2 gap-1">
                    {["yes", "no"].map(opt => (
                      <button key={opt} onClick={() => set(f.id, opt)}
                        className={cn("h-7 rounded text-xs font-medium border transition-colors",
                          v === opt ? cn(moduleAccent("sales").solid, "text-white border-transparent") : "border-[var(--border)] hover:bg-[var(--muted)]"
                        )}>{opt === "yes" ? "มี / จดแล้ว" : "ไม่ / ยังไม่จด"}</button>
                    ))}
                  </div>
                )}
                {f.type === "number" && (
                  <input type="number" value={v} onChange={e => set(f.id, e.target.value)}
                    placeholder={f.placeholder || "0"}
                    className="h-7 w-full rounded border border-[var(--input)] px-2 text-xs tabular" />
                )}
                {f.type === "text" && (
                  <input type="text" value={v} onChange={e => set(f.id, e.target.value)}
                    placeholder={f.placeholder || ""}
                    className="h-7 w-full rounded border border-[var(--input)] px-2 text-xs" />
                )}
                {f.type === "date" && (
                  <input type="date" value={v} onChange={e => set(f.id, e.target.value)}
                    className="h-7 w-full rounded border border-[var(--input)] px-2 text-xs" />
                )}
                {f.type === "textarea" && (
                  <textarea value={v} onChange={e => set(f.id, e.target.value)}
                    placeholder={f.placeholder || ""}
                    className="min-h-[52px] w-full rounded border border-[var(--input)] px-2 py-1 text-xs resize-none" />
                )}
                {f.type === "choices" && (
                  <div className="grid grid-cols-3 gap-1">
                    {f.options.map(opt => (
                      <button key={opt.v} onClick={() => set(f.id, opt.v)}
                        className={cn("h-8 rounded text-xs font-medium border flex items-center justify-center gap-1 transition-colors",
                          v === opt.v ? cn(moduleAccent("sales").solid, "text-white border-transparent") : "border-[var(--border)] hover:bg-[var(--muted)]"
                        )}><Icon name={opt.i} size={11} />{opt.l}</button>
                    ))}
                  </div>
                )}
                {f.type === "person" && (
                  <div className="grid grid-cols-3 gap-1">
                    {f.options.map(name => (
                      <button key={name} onClick={() => set(f.id, name)}
                        className={cn("h-8 rounded text-xs font-medium border flex items-center justify-center gap-1 transition-colors",
                          v === name ? cn(moduleAccent("service").solid, "text-white border-transparent") : "border-[var(--border)] hover:bg-[var(--muted)]"
                        )}>
                        <Avatar name={name} size={18} />
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <Button
            variant={allFilled ? "service" : "outline"}
            size="sm"
            className="w-full"
            disabled={!allFilled}
            onClick={() => onAdvance(lead.id, nextStageId)}
            title={allFilled ? "" : `ต้องกรอกข้อมูลให้ครบ ${total} รายการก่อน`}
          >
            {allFilled
              ? <><Icon name="ArrowRight" size={13} />{advanceLabel}</>
              : <>กรอกข้อมูลให้ครบ ({filledCount}/{total})</>}
          </Button>
          {!allFilled && (
            <p className="text-[10px] text-[var(--muted-foreground)] text-center mt-1.5">
              <Icon name="Lock" size={10} className="inline" /> ระบบล็อกการข้าม step จนกว่าข้อมูลจะครบ
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

/* ---------- AE Stage Requirements widget end ---------- */
const LeadDetailDrawer = ({ lead, onClose, onMove, onSendProposal, onHandover, onLogCall, onNavigate, allFollowups, onUpdateStageFields }) => {
  if (!lead) return null;
  const { TAGS, STAGES, ACTIVITIES, REQUIRED_CALLS } = window.CRM_DATA;
  const acts = ACTIVITIES.filter(a => a.leadId === lead.id);
  const stageIdx = STAGES.findIndex(s => s.id === lead.stage);
  const curStage = STAGES[stageIdx];
  const isQualified = lead.stage === "qualified";
  const isFollowup = lead.stage === "followup";
  const isWon = lead.stage === "won";
  const isAeFollowup = lead.stage === "ae_followup";
  const isAeDeposit = lead.stage === "ae_deposit";
  const isAeOnboard = lead.stage === "ae_onboard";
  const isAeProposal = lead.stage === "ae_proposal";
  const isAeMeeting = lead.stage === "ae_meeting";
  const isMkPhase = curStage.phase === "marketing";
  const isAePhase = curStage.phase === "ae";
  const required = REQUIRED_CALLS || 5;
  const callsDone = lead.callsCount || 0;
  const callsCompleted = callsDone >= required;

  return (
    <div className="fixed inset-0 z-50 fade-in" style={{ background: "oklch(0 0 0 / 0.4)" }} onClick={onClose}>
      <div className="absolute top-0 right-0 h-full w-full max-w-[960px] bg-[var(--background)] shadow-2xl slide-up overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-[var(--border)] p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn("h-11 w-11 rounded-lg flex items-center justify-center font-bold text-lg shrink-0", moduleAccent(phaseAccent(curStage.phase)).soft, moduleAccent(phaseAccent(curStage.phase)).fg)}>
              {lead.company[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--muted-foreground)] font-mono">{lead.id}</span>
                <Badge tone={curStage.color === "slate" ? "slate" : curStage.color} soft dot className="!text-[10px]">{curStage.label}</Badge>
                <Badge tone={isMkPhase ? "marketing" : isAePhase ? "sales" : "amber"} className="!text-[10px]">
                  {isMkPhase ? "Marketing/Sales Phase" : isAePhase ? "AE Phase" : "Handover Point"}
                </Badge>
              </div>
              <h2 className="text-xl font-semibold mt-1">{lead.company}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{lead.contact} ({lead.nickname}) · {lead.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button variant="outline" size="sm"><Icon name="Phone" size={13} />โทร</Button>
            <Button variant="outline" size="sm"><Icon name="Mail" size={13} />อีเมล</Button>
            <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" size={16} /></Button>
          </div>
        </div>

        {/* Owner pair strip */}
        <div className="border-b border-[var(--border)] px-5 py-3 bg-[var(--muted)]/30 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            {/* MK owner */}
            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md border", lead.mkOwner ? cn(moduleAccent("marketing").soft, moduleAccent("marketing").border) : "border-dashed border-[var(--border)]")}>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--marketing-fg)] opacity-70">MK</span>
              {lead.mkOwner ? <><Avatar name={lead.mkOwner} size={22} /><span className="text-xs font-medium">{lead.mkOwner}</span></> : <span className="text-xs italic text-[var(--muted-foreground)]">ไม่ระบุ</span>}
            </div>

            <Icon name="ArrowRight" size={13} className="text-[var(--muted-foreground)]" />

            {/* AE owner */}
            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md border", lead.aeOwner ? cn(moduleAccent("sales").soft, moduleAccent("sales").border) : "border-dashed border-[var(--border)]")}>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--sales-fg)] opacity-70">AE</span>
              {lead.aeOwner
                ? <><Avatar name={lead.aeOwner} size={22} /><span className="text-xs font-medium">{lead.aeOwner}</span></>
                : <span className="text-xs italic text-[var(--muted-foreground)]">รอมอบหมาย</span>}
            </div>
          </div>

          {isWon && !lead.aeOwner && (
            <Button variant="sales" size="sm" onClick={() => onHandover(lead)}>
              <Icon name="ArrowRightLeft" size={13} />Handover → AE
            </Button>
          )}
        </div>

        {/* Stage progress strip — show phase divider */}
        <div className="border-b border-[var(--border)] px-5 py-3 bg-[var(--muted)]/20">
          <div className="flex items-center gap-1.5">
            {STAGES.map((s, i) => {
              const reached = i <= stageIdx;
              const isCurrent = i === stageIdx;
              const isHandoverStage = s.phase === "handover";
              const a = s.color === "slate" || s.color === "default" ? null : moduleAccent(s.color);
              const prev = STAGES[i - 1];
              const phaseChange = prev && prev.phase !== s.phase;
              return (
                <React.Fragment key={s.id}>
                  {phaseChange && i > 0 && (
                    <div className="px-0.5">
                      <Icon name="ArrowRightLeft" size={12} className="text-[var(--warning)]" />
                    </div>
                  )}
                  <button
                    onClick={() => onMove(lead.id, s.id)}
                    className={cn("flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium border transition-all whitespace-nowrap",
                      reached
                        ? cn(isHandoverStage ? "bg-[var(--warning)] text-white" : (a ? a.solid : "bg-[oklch(0.5_0.02_240)]"), "text-white border-transparent")
                        : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)]",
                      isCurrent && "ring-2 ring-offset-2 ring-[var(--ring)]/40"
                    )}
                  >
                    {s.label}
                  </button>
                  {i < STAGES.length - 1 && !phaseChange && <Icon name="ChevronRight" size={12} className="text-[var(--muted-foreground)] shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--marketing)]" />Marketing/Sales</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--warning)]" />Handover</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--sales)]" />AE</span>
            <span className="ml-auto opacity-70"><Icon name="MousePointerClick" size={9} className="inline" /> กดเพื่อเปลี่ยนสถานะ</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_320px]">
          <div className="overflow-y-auto scroll-thin p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Customer Journey Timeline</h3>
              <Tabs value="all" onChange={() => {}} size="sm" options={[
                { value: "all", label: "ทั้งหมด" },
                { value: "mk", label: "MK only" },
                { value: "ae", label: "AE only" },
              ]} />
            </div>

            <Card>
              <div className="p-3 space-y-2">
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { i: "Phone", l: "Log โทร" },
                    { i: "FileText", l: "Note" },
                    { i: "Mail", l: "Email" },
                    { i: "ListChecks", l: "Checklist 1st Meeting", aeOnly: true },
                    { i: "Calendar", l: "นัด Follow-up" },
                  ].filter(b => !b.aeOnly || isAePhase).map(b => (
                    <button key={b.l} className="flex items-center gap-1.5 px-2.5 h-8 rounded-md text-xs font-medium border border-[var(--border)] hover:bg-[var(--muted)]">
                      <Icon name={b.i} size={13} />{b.l}
                    </button>
                  ))}
                </div>
                <Textarea placeholder={isMkPhase ? "Marketing note — เช่น สนใจอะไรเป็นพิเศษ..." : "AE note — เก็บข้อมูลเชิงลึก: ขนาดธุรกิจ, จำนวนพนักงาน..."} className="!min-h-[60px] text-sm" />
              </div>
            </Card>

            <ol className="relative border-l-2 border-dashed border-[var(--border)] ml-3 space-y-4 pl-5">
              {acts.length === 0 && <Empty icon="History" title="ยังไม่มีกิจกรรม" hint="เริ่มโทร / ส่งอีเมล / เพิ่ม note" />}
              {acts.slice().reverse().map((a, i) => {
                const tones = { call: "sales", email: "marketing", note: "marketing", stage: "service", proposal: "sales", followup: "sales", create: "default" };
                const tone = tones[a.type] || "default";
                const acc = tone === "default" ? null : moduleAccent(tone);
                return (
                  <li key={a.id} className="relative">
                    <span className={cn("absolute -left-[34px] top-0.5 w-6 h-6 rounded-full ring-4 ring-[var(--background)] flex items-center justify-center", acc ? cn(acc.soft, acc.fg) : "bg-[var(--muted)] text-[var(--muted-foreground)]")}>
                      <Icon name={a.icon} size={12} />
                    </span>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{a.text}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{a.by} · {a.at} {a.duration && <span>· ⏱ {a.duration}</span>}</p>
                      </div>
                      {acc && <Badge tone={tone} soft className="!text-[10px] !py-0">{a.type}</Badge>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Side panel */}
          <aside className="border-l border-[var(--border)] overflow-y-auto scroll-thin bg-[var(--muted)]/30">
            <div className="p-4 space-y-4">

              {/* Upcoming Follow-ups linked to Sales Follow-up menu */}
              {(() => {
                const leadFollowups = (allFollowups || []).filter(f => f.leadId === lead.id);
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] uppercase font-semibold text-[var(--muted-foreground)] tracking-wider flex items-center gap-1">
                        <Icon name="CalendarClock" size={11} />Follow-up นัดหมาย
                      </p>
                      <span className="text-[10px] text-[var(--muted-foreground)]">{leadFollowups.length} รายการ</span>
                    </div>
                    <Card className="!shadow-none">
                      <div className="p-3 space-y-2">
                        {leadFollowups.length === 0 && (
                          <p className="text-[11px] text-[var(--muted-foreground)] text-center py-2">ยังไม่มีนัด · กดด้านล่างเพื่อเพิ่ม</p>
                        )}
                        {leadFollowups.map(f => (
                          <div key={f.id} className="flex items-center gap-2 p-2 rounded-md bg-[var(--sales-soft)]/50 border border-[var(--sales)]/20">
                            <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", moduleAccent("sales").solid, "text-white")}>
                              <Icon name={f.type === "Call" ? "Phone" : f.type === "Email" ? "Mail" : "MessageCircle"} size={12} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium leading-tight truncate">{f.type} · ครั้งที่ {f.attempts}</p>
                              <p className="text-[10px] text-[var(--muted-foreground)] tabular">{f.at}</p>
                            </div>
                            <Badge tone={f.attempts >= 4 ? "rose" : "sales"} soft className="!text-[9px] !py-0">{f.status === "scheduled" ? "นัดไว้" : f.status}</Badge>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full" onClick={() => {
                          onClose();
                          onNavigate("sales", { openSchedule: true, prefillLeadId: lead.id });
                        }}>
                          <Icon name="CalendarPlus" size={12} />นัด Follow-up ใหม่
                        </Button>
                        <p className="text-[10px] text-[var(--muted-foreground)] text-center flex items-center justify-center gap-1">
                          <Icon name="Link2" size={9} />ซิงค์อัตโนมัติกับเมนู Sales Follow-up
                        </p>
                      </div>
                    </Card>
                  </div>
                );
              })()}

              {/* === Gated requirement widgets per AE stage === */}
              {isAeProposal && (
                <AeStageRequirementWidget
                  lead={lead}
                  stageId="ae_proposal"
                  onUpdateFields={onUpdateStageFields}
                  onAdvance={onMove}
                  advanceLabel="ครบแล้ว → ไป 1st Meeting"
                  nextStageId="ae_meeting"
                />
              )}
              {isAeFollowup && (
                <AeStageRequirementWidget
                  lead={lead}
                  stageId="ae_followup"
                  onUpdateFields={onUpdateStageFields}
                  onAdvance={onMove}
                  advanceLabel="ครบแล้ว → ไป Onboarding"
                  nextStageId="ae_onboard"
                />
              )}
              {isAeOnboard && (
                <AeStageRequirementWidget
                  lead={lead}
                  stageId="ae_onboard"
                  onUpdateFields={onUpdateStageFields}
                  onAdvance={onMove}
                  advanceLabel="ครบแล้ว → Close ดีล"
                  nextStageId="closed"
                />
              )}

              {/* AE Deposit widget — show after proposal */}
              {isAeDeposit && (
                <Card className="!shadow-none border-[var(--sales)]/30">
                  <div className="p-3.5">
                    <p className="text-[11px] uppercase font-semibold tracking-wider text-[var(--sales-fg)] flex items-center gap-1 mb-2">
                      <Icon name="HandCoins" size={12} />รอลูกค้าวางมัดจำ
                    </p>
                    <div className="rounded-md bg-[var(--sales-soft)]/60 p-2.5 space-y-1.5 text-xs mb-2">
                      <p className="font-medium">เงื่อนไขมัดจำเพื่อตกลงรับบริการ</p>
                      <ul className="space-y-0.5 text-[var(--muted-foreground)]">
                        <li className="flex items-center gap-1.5"><Icon name="Check" size={10} className="text-[var(--service-fg)]" />50% ของยอด Proposal · ฿{Math.round((lead.value || 0) * 0.5).toLocaleString()}</li>
                        <li className="flex items-center gap-1.5"><Icon name="Check" size={10} className="text-[var(--service-fg)]" />หรืออย่างน้อย ฿5,000</li>
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">ยอดที่ลูกค้าวางมัดจำ</label>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-[var(--muted-foreground)]">฿</span>
                        <input type="number" placeholder="0" className="h-8 flex-1 rounded border border-[var(--input)] px-2 text-sm tabular" />
                        <Button variant="sales" size="sm"><Icon name="Check" size={11} />ยืนยัน</Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full"><Icon name="Receipt" size={12} />อัปโหลดสลิป / ใบเสร็จ</Button>
                    </div>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-2 flex items-start gap-1">
                      <Icon name="Info" size={10} className="mt-px shrink-0" />
                      เมื่อยืนยันมัดจำ → ระบบจะเลื่อนไป Onboarding อัตโนมัติ
                    </p>
                  </div>
                </Card>
              )}

              {/* AE Onboard widget — schedule onboarding meeting */}
              {isAeOnboard && (
                <Card className="!shadow-none border-[var(--sales)]/30">
                  <div className="p-3.5">
                    <p className="text-[11px] uppercase font-semibold tracking-wider text-[var(--sales-fg)] flex items-center gap-1 mb-2">
                      <Icon name="GraduationCap" size={12} />Onboarding Meeting
                    </p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mb-2">นัดประชุมเพื่อ onboard · แนะนำขั้นตอนการทำงาน · ส่งมอบทีม Service</p>

                    {/* Onboarding agenda checklist */}
                    <div className="space-y-1 mb-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">วาระประชุม</p>
                      {[
                        { d: true, t: "แนะนำทีม Service ที่จะดูแล" },
                        { d: false, active: true, t: "อธิบาย workflow รายเดือน (ส่งเอกสาร · ปิดบัญชี · ภาษี)" },
                        { d: false, t: "ตั้งกลุ่ม Line OA สำหรับสื่อสาร" },
                        { d: false, t: "นัดวันส่งเอกสารครั้งแรก" },
                        { d: false, t: "เซ็นสัญญาบริการรายปี" },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className={cn("h-3.5 w-3.5 rounded border-2 flex items-center justify-center shrink-0",
                            c.d ? "bg-[var(--sales)] border-[var(--sales)]" : c.active ? "border-[var(--sales)]" : "border-[var(--border)]"
                          )}>
                            {c.d && <Icon name="Check" size={9} style={{ color: "white" }} />}
                          </div>
                          <span className={cn(c.d && "line-through text-[var(--muted-foreground)]", c.active && "font-medium")}>{c.t}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">นัดวันประชุม</label>
                      <input type="datetime-local" defaultValue="2026-05-25T14:00" className="h-8 w-full rounded border border-[var(--input)] px-2 text-sm" />
                      <div className="grid grid-cols-2 gap-1.5">
                        <Button variant="outline" size="sm"><Icon name="Video" size={11} />ออนไลน์</Button>
                        <Button variant="outline" size="sm"><Icon name="Users" size={11} />On-site</Button>
                      </div>
                      <Button variant="sales" size="sm" className="w-full"><Icon name="CalendarCheck2" size={12} />ยืนยันนัด</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* AE Follow-up widget (payment / contract / docs) */}
              {isAeFollowup && (
                <Card className="!shadow-none border-[var(--sales)]/30">
                  <div className="p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] uppercase font-semibold tracking-wider text-[var(--sales-fg)] flex items-center gap-1">
                        <Icon name="AlarmClock" size={12} />AE Follow-up
                      </p>
                      <Badge tone="sales" soft className="!text-[10px]">
                        ครั้งที่ {lead.aeFollowupAttempts || 0}
                      </Badge>
                    </div>

                    {/* Reason picker */}
                    <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">เรื่องที่ตามอยู่</p>
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {[
                        { id: "payment", l: "ตามชำระเงิน", i: "Banknote" },
                        { id: "contract", l: "ตามเซ็นสัญญา", i: "FileSignature" },
                        { id: "documents", l: "ตามเอกสาร", i: "FileText" },
                        { id: "other", l: "อื่น ๆ", i: "MoreHorizontal" },
                      ].map(r => {
                        const on = lead.aeFollowupReason === r.id;
                        return (
                          <div key={r.id} className={cn(
                            "flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px] border",
                            on ? "border-[var(--sales)] bg-[var(--sales-soft)] text-[var(--sales-fg)] font-medium" : "border-[var(--border)] text-[var(--muted-foreground)]"
                          )}>
                            <Icon name={r.i} size={11} />{r.l}
                            {on && <Icon name="Check" size={10} className="ml-auto" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Mini activity log */}
                    <div className="space-y-1.5 mb-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">ประวัติการตาม</p>
                      {[
                        { at: "เมื่อวาน 14:30", txt: "ส่งใบแจ้งหนี้ผ่าน Line", by: lead.aeOwner },
                        { at: "3 วันที่แล้ว", txt: "โทรแจ้งกำหนดชำระ", by: lead.aeOwner },
                      ].slice(0, lead.aeFollowupAttempts || 0).map((a, i) => (
                        <div key={i} className="text-[11px] flex items-start gap-1.5 p-1.5 rounded bg-[var(--muted)]/40">
                          <Icon name="Check" size={10} className="text-[var(--sales-fg)] mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="leading-tight">{a.txt}</p>
                            <p className="text-[var(--muted-foreground)] mt-0.5">{a.by} · {a.at}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button variant="sales" size="sm" className="w-full"><Icon name="Phone" size={12} />Log การติดตาม</Button>

                    <p className="text-[10px] text-[var(--muted-foreground)] mt-2 flex items-start gap-1">
                      <Icon name="Info" size={10} className="mt-px shrink-0" />
                      ลูกค้ายังไม่ Close — รอชำระเงิน / เซ็นสัญญา / ส่งเอกสาร
                    </p>
                  </div>
                </Card>
              )}

              {/* Follow-up calls widget — show when in followup or before Won */}
              {(isFollowup || lead.stage === "qualified" || lead.stage === "contacted") && (
                <Card className="!shadow-none border-[var(--sales)]/30">
                  <div className="p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] uppercase font-semibold tracking-wider text-[var(--sales-fg)] flex items-center gap-1">
                        <Icon name="PhoneCall" size={12} />Sales Follow-up
                      </p>
                      <Badge tone={callsCompleted ? "service" : "sales"} soft className="!text-[10px]">
                        {callsDone}/{required} ครั้ง
                      </Badge>
                    </div>
                    {/* Call dots */}
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: required }, (_, i) => (
                        <div key={i} className={cn(
                          "flex-1 h-7 rounded flex items-center justify-center text-[10px] font-bold",
                          i < callsDone
                            ? "bg-[var(--sales)] text-white"
                            : i === callsDone
                              ? "bg-[var(--sales-soft)] text-[var(--sales-fg)] border border-[var(--sales)]/40 border-dashed"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                        )}>
                          {i < callsDone ? <Icon name="Check" size={11} /> : `#${i + 1}`}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mb-2.5">
                      {callsCompleted
                        ? <span className="text-[var(--service-fg)]"><Icon name="CheckCircle2" size={10} className="inline" /> ครบ {required} ครั้งแล้ว — แนะนำให้สรุปดีล Won หรือ Lost</span>
                        : <>ตามครบ {required} ครั้งช่วยให้ Qualify ดีลได้แม่นยำขึ้น · ลูกค้าตกลงเร็วก็ปิดได้เลย</>}
                    </p>
                    <Button variant="sales" size="sm" className="w-full" onClick={() => onLogCall(lead.id)}>
                      <Icon name="Phone" size={12} />Log การโทรครั้งที่ {callsDone + 1}
                    </Button>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-2 flex items-start gap-1">
                      <Icon name="Info" size={10} className="mt-px shrink-0" />
                      เชื่อมกับเมนู Sales Follow-up · ห้ามตั้งเวลาซ้ำ
                    </p>
                  </div>
                </Card>
              )}

              {/* Calls history when in won/AE phase */}
              {(isWon || isAePhase) && callsDone > 0 && (
                <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Icon name="History" size={11} />Sales ตามครบ {callsDone} ครั้ง · ลูกค้าตัดสินใจซื้อ
                </div>
              )}

              {/* AE checklist removed — now driven by AeStageRequirementWidget per stage */}

              <div>
                <p className="text-[11px] uppercase font-semibold text-[var(--muted-foreground)] tracking-wider mb-2">ข้อมูลการติดต่อ</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2"><Icon name="Phone" size={13} className="text-[var(--muted-foreground)]" /><span>{lead.phone}</span></div>
                  <div className="flex items-center gap-2"><Icon name="MessageCircle" size={13} className="text-[var(--muted-foreground)]" /><span>{lead.line}</span></div>
                  <div className="flex items-center gap-2"><Icon name="Mail" size={13} className="text-[var(--muted-foreground)]" /><span className="truncate">{lead.email}</span></div>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase font-semibold text-[var(--muted-foreground)] tracking-wider mb-2">ที่มาและสนใจ</p>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  <Badge soft tone="default" dot>{lead.source}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {lead.tags.map(tid => {
                    const t = TAGS.find(t => t.id === tid);
                    return t ? <Badge key={tid} tone={t.color} soft>{t.label}</Badge> : null;
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase font-semibold text-[var(--muted-foreground)] tracking-wider mb-2">มูลค่าโดยประมาณ</p>
                <p className="text-2xl font-semibold tabular">฿{lead.value.toLocaleString()}<span className="text-xs text-[var(--muted-foreground)] font-normal"> /ปี</span></p>
              </div>

              <Divider />

              <div className="space-y-2">
                {/* Won + no AE → Handover */}
                {isWon && !lead.aeOwner && (
                  <Button variant="sales" className="w-full" onClick={() => onHandover(lead)}>
                    <Icon name="ArrowRightLeft" size={14} />Handover → AE
                  </Button>
                )}
                {/* AE phase (meeting, proposal) — handled by requirement widget */}
                {isAePhase && !isAeFollowup && !isAeDeposit && !isAeOnboard && !isAeProposal && !isAeMeeting && (
                  <Button variant="sales" className="w-full" onClick={() => onSendProposal(lead)}>
                    <Icon name="FileSignature" size={14} />ทำใบเสนอราคา (AE)
                  </Button>
                )}
                {/* 1st Meeting → next is deposit */}
                {isAeMeeting && (
                  <Button variant="sales" className="w-full" onClick={() => onMove(lead.id, "ae_deposit")}>
                    <Icon name="HandCoins" size={14} />ประชุมเสร็จ → รอมัดจำ
                  </Button>
                )}
                {/* AE Deposit → on confirm move to followup (สร้างสัญญาและเปิดเคส) */}
                {isAeDeposit && (
                  <Button variant="sales" className="w-full" onClick={() => onMove(lead.id, "ae_followup")}>
                    <Icon name="FileText" size={14} />ยืนยันมัดจำ → สร้างสัญญาและเปิดเคส
                  </Button>
                )}
                {/* In followup: Mark as Won — 5 calls is a guideline, not a hard gate */}
                {isFollowup && (
                  <Button
                    variant="service"
                    className="w-full"
                    onClick={() => onMove(lead.id, "won")}
                  >
                    <Icon name="Trophy" size={14} />Mark as Won (ลูกค้าตกลง)
                  </Button>
                )}
                {/* Earlier MK stages */}
                {isMkPhase && lead.stage !== "followup" && (
                  <Button variant="marketing" className="w-full" onClick={() => {
                    const nextStage = lead.stage === "new" ? "contacted" : lead.stage === "contacted" ? "qualified" : "followup";
                    onMove(lead.id, nextStage);
                  }}>
                    <Icon name="ArrowRight" size={14} />
                    {lead.stage === "new" ? "เริ่มติดต่อ" : lead.stage === "contacted" ? "Mark as Qualified" : "เริ่ม Follow-up"}
                  </Button>
                )}
                <Button variant="ghost" className="w-full text-[var(--destructive)] hover:bg-[var(--destructive)]/10"><Icon name="XCircle" size={14} />Mark as Lost</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ============================================
   Main Leads page
   ============================================ */
const LeadsPage = ({ onNavigate, sharedState, routeArgs }) => {
  const { SOURCES } = window.CRM_DATA;
  const lockedRole = routeArgs?.lockedRole; // 'marketing' | 'ae' | undefined
  const [role, setRole] = React.useState(lockedRole || "all");

  // Re-sync role if the menu changes
  React.useEffect(() => {
    if (lockedRole) setRole(lockedRole);
  }, [lockedRole]);

  const [view, setView] = React.useState("kanban");
  const [search, setSearch] = React.useState("");
  const [filterSource, setFilterSource] = React.useState("all");
  const [showNew, setShowNew] = React.useState(false);
  const [openLead, setOpenLead] = React.useState(null);
  const [handoverLead, setHandoverLead] = React.useState(null);
  const toast = useToast();

  // Open a specific lead if routed in via routeArgs.openLeadId
  React.useEffect(() => {
    if (routeArgs?.openLeadId) {
      const l = sharedState.leads.find(x => x.id === routeArgs.openLeadId);
      if (l) setOpenLead(l);
    }
  }, [routeArgs?.openLeadId]);

  const stages = visibleStagesForRole(role);
  const stageIds = new Set(stages.map(s => s.id));

  const filtered = sharedState.leads.filter(l => {
    if (!stageIds.has(l.stage)) return false;
    if (filterSource !== "all" && l.source !== filterSource) return false;
    if (search && !(l.company.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const counts = {
    marketing: sharedState.leads.filter(l => stageMeta(l.stage).phase === "marketing").length,
    handover: sharedState.leads.filter(l => l.stage === "won" && !l.aeOwner).length,
    ae: sharedState.leads.filter(l => stageMeta(l.stage).phase === "ae").length,
  };

  const doHandover = (leadId, aeName) => {
    sharedState.setLeads(ls => ls.map(l => l.id === leadId ? { ...l, aeOwner: aeName, stage: "ae_proposal" } : l));
    setOpenLead(l => l ? { ...l, aeOwner: aeName, stage: "ae_proposal" } : null);
    setHandoverLead(null);
    toast({ title: "Handover สำเร็จ", description: `ส่งต่อให้ AE ${aeName} แล้ว — เริ่ม AE Proposal`, tone: "sales", icon: "ArrowRightLeft" });
  };

  const logCall = (leadId) => {
    sharedState.setLeads(ls => ls.map(l => l.id === leadId ? { ...l, callsCount: (l.callsCount || 0) + 1, lastTouch: new Date().toISOString().slice(0, 16).replace("T", " ") } : l));
    setOpenLead(l => l ? { ...l, callsCount: (l.callsCount || 0) + 1 } : null);
    const lead = sharedState.leads.find(l => l.id === leadId);
    toast({ title: "Log การโทรแล้ว", description: `${lead?.company} · ครั้งที่ ${(lead?.callsCount || 0) + 1}/5`, tone: "sales", icon: "PhoneCall" });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("inline-block w-1.5 h-7 rounded-sm",
            role === "marketing" ? "bg-[var(--marketing)]" : role === "ae" ? "bg-[var(--sales)]" : "bg-gradient-to-b from-[var(--marketing)] via-[var(--warning)] to-[var(--sales)]"
          )} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight">
                {lockedRole === "marketing" && "Marketing & Lead"}
                {lockedRole === "ae"        && "AE Pipeline"}
                {!lockedRole                && "Marketing & Lead"}
              </h1>
              {lockedRole && (
                <Badge tone={lockedRole === "marketing" ? "marketing" : "sales"} soft className="!text-[10px]">
                  <Icon name="Lock" size={9} />
                  {lockedRole === "marketing" ? "Marketing/Sales role" : "AE role"}
                </Badge>
              )}
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              {role === "marketing" && "Phase 1 · Marketing/Sales — หา Lead, ติดต่อ, Qualify, ส่งต่อ AE"}
              {role === "ae"        && "Phase 2 · Account Executive — รับงานต่อจาก Marketing, ประชุม, ทำใบเสนอราคา, ปิดการขาย"}
              {role === "all"       && "Pipeline ทั้งหมด — Marketing/Sales → Handover → AE"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lockedRole === "ae" && (
            <Button variant="ghost" size="sm" onClick={() => onNavigate("leads")}>
              <Icon name="ArrowLeft" size={13} />ดู Marketing pipeline
            </Button>
          )}
          {lockedRole === "marketing" && (
            <Button variant="ghost" size="sm" onClick={() => onNavigate("ae-pipeline")}>
              ดู AE pipeline<Icon name="ArrowRight" size={13} />
            </Button>
          )}
          <Button variant="outline" size="sm"><Icon name="Download" size={14} />Export</Button>
          {role !== "ae" && (
            <Button variant="marketing" size="default" onClick={() => setShowNew(true)}><Icon name="Plus" size={14} />สร้าง Lead ใหม่</Button>
          )}
        </div>
      </div>

      {/* Role switcher — only when NOT locked */}
      {!lockedRole && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { v: "marketing", t: "Marketing/Sales", d: "Phase 1 · New → Qualified", icon: "Magnet", acc: "marketing", count: counts.marketing },
            { v: "ae",        t: "AE (Account Executive)", d: "Phase 2 · Meeting → Won", icon: "Briefcase", acc: "sales", count: counts.ae },
            { v: "all",       t: "Pipeline ทั้งหมด", d: "Marketing → Handover → AE", icon: "GitMerge", acc: "service", count: sharedState.leads.length },
          ].map(opt => {
            const active = role === opt.v;
            const a = moduleAccent(opt.acc);
            return (
              <button key={opt.v} onClick={() => setRole(opt.v)}
                className={cn(
                  "text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3",
                  active ? cn(a.border, a.soft) : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]/40"
                )}>
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  active ? a.solid : "bg-[var(--muted)]"
                )}>
                  <Icon name={opt.icon} size={18} className={active ? "text-white" : "text-[var(--muted-foreground)]"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-semibold text-sm", active && a.fg)}>{opt.t}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] truncate">{opt.d}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-2xl font-bold tabular leading-none", active ? a.fg : "text-[var(--foreground)]")}>{opt.count}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-1">leads</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Phase summary strip — when role is locked, show a compact phase summary */}
      {lockedRole && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {lockedRole === "marketing" ? (
            <>
              <Stat label="Lead ใหม่" value={sharedState.leads.filter(l => l.stage === "new").length} icon="Sparkles" accent="marketing" />
              <Stat label="ติดต่อแล้ว" value={sharedState.leads.filter(l => l.stage === "contacted").length} icon="MessageCircle" accent="marketing" />
              <Stat label="Qualified" value={counts.handover} icon="CheckCircle2" accent="marketing" />
              <Stat label="ส่งต่อ AE แล้ว" value={counts.ae} icon="ArrowRightLeft" accent="sales" />
            </>
          ) : (
            <>
              <Stat label="Lead รอรับ" value={sharedState.leads.filter(l => l.stage === "won" && !l.aeOwner).length} icon="Inbox" accent="amber" deltaTone="amber" />
              <Stat label="1st Meeting" value={sharedState.leads.filter(l => l.stage === "ae_meeting").length} icon="Users" accent="sales" />
              <Stat label="Proposal / Follow-up" value={sharedState.leads.filter(l => l.stage === "ae_proposal" || l.stage === "ae_followup" || l.stage === "ae_deposit" || l.stage === "ae_onboard").length} icon="FileSignature" accent="sales" />
              <Stat label="Closed (เดือนนี้)" value={sharedState.leads.filter(l => l.stage === "closed").length} icon="Trophy" accent="service" />
            </>
          )}
        </div>
      )}

      {/* Handover banner */}
      {counts.handover > 0 && ((role === "all") || (lockedRole === "ae")) && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[oklch(0.97_0.06_85)] border border-[var(--warning)]/40 fade-in">
          <div className="h-8 w-8 rounded-md bg-[var(--warning)] text-white flex items-center justify-center shrink-0">
            <Icon name="ArrowRightLeft" size={15} />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-[oklch(0.35_0.16_75)]">
              {sharedState.leads.filter(l => l.stage === "qualified" && !l.aeOwner).length || counts.handover} Lead {lockedRole === "ae" ? "รอ AE รับช่วงต่อ — เปิดดูและกด Take Lead ได้เลย" : "รอ AE รับช่วงต่อ"}
            </p>
            <p className="text-[oklch(0.4_0.12_75)] mt-0.5">Marketing/Sales ได้ Qualify แล้ว · ส่งต่อให้ AE เพื่อนัดประชุมและเก็บข้อมูล</p>
          </div>
          {!lockedRole && <Button variant="outline" size="sm" onClick={() => setRole("ae")}><Icon name="ArrowRight" size={13} />ดูในมุม AE</Button>}
        </div>
      )}

      {/* Handover banner for Marketing locked — show how many they've handed to AE */}
      {lockedRole === "marketing" && counts.ae > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--marketing-soft)] border border-[var(--marketing)]/30 fade-in">
          <div className="h-8 w-8 rounded-md bg-[var(--marketing)] text-white flex items-center justify-center shrink-0">
            <Icon name="GitMerge" size={15} />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-[var(--marketing-fg)]">
              {counts.ae} Lead ปิดดีลและส่งต่อให้ AE แล้ว
            </p>
            <p className="text-[var(--marketing-fg)] opacity-80 mt-0.5">AE กำลังทำใบเสนอราคาเชิงลึกและ Onboard ลูกค้า — ดูสถานะได้ใน AE Pipeline</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate("ae-pipeline")}>ดูใน AE Pipeline<Icon name="ArrowRight" size={13} /></Button>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
        <Input className="lg:max-w-sm" icon={<Icon name="Search" size={14} />} placeholder="ค้นหาบริษัท / ผู้ติดต่อ..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select className="lg:w-44" value={filterSource} onChange={e => setFilterSource(e.target.value)}>
          <option value="all">ที่มา: ทั้งหมด</option>
          {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <div className="flex-1" />
        <Tabs value={view} onChange={setView} options={[
          { value: "kanban", label: "Kanban", icon: "Kanban" },
          { value: "funnel", label: "Funnel", icon: "Filter" },
          { value: "table", label: "Table", icon: "Table" },
        ]} />
      </div>

      {/* Body */}
      <div className="fade-in" key={role + view}>
        {view === "kanban" && (
          <LeadsKanban role={role} leads={filtered} onMove={(id, stage) => {
            sharedState.moveLead(id, stage);
            const lead = sharedState.leads.find(l => l.id === id);
            toast({ title: "เปลี่ยนสถานะ", description: `${lead?.company} → ${stageMeta(stage).label}`, icon: "ArrowRight", tone: "marketing" });
          }} onOpenLead={setOpenLead} />
        )}
        {view === "funnel" && <LeadsFunnel role={role} leads={filtered} onOpenLead={setOpenLead} />}
        {view === "table"  && <LeadsTable role={role} leads={filtered} onOpenLead={setOpenLead} onMove={sharedState.moveLead} />}
      </div>

      <NewLeadModal open={showNew} onClose={() => setShowNew(false)} onCreate={(l) => {
        sharedState.addLead(l);
        toast({ title: "สร้าง Lead สำเร็จ", description: `${l.company} เพิ่มเข้า Marketing pipeline แล้ว`, tone: "marketing" });
      }} />

      <HandoverModal
        open={!!handoverLead}
        lead={handoverLead}
        onClose={() => setHandoverLead(null)}
        onConfirm={doHandover}
      />

      <LeadDetailDrawer
        lead={openLead}
        allFollowups={sharedState.followups}
        onNavigate={onNavigate}
        onClose={() => setOpenLead(null)}
        onHandover={(lead) => setHandoverLead(lead)}
        onLogCall={logCall}
        onUpdateStageFields={(id, stageId, values) => {
          sharedState.setLeads(ls => ls.map(l => l.id === id ? { ...l, stageData: { ...(l.stageData || {}), [stageId]: values } } : l));
          setOpenLead(l => l && l.id === id ? { ...l, stageData: { ...(l.stageData || {}), [stageId]: values } } : l);
        }}
        onMove={(id, stage) => {
          sharedState.moveLead(id, stage);
          setOpenLead(l => l ? { ...l, stage } : null);
          toast({ title: "เปลี่ยนสถานะ", description: `→ ${stageMeta(stage).label}`, tone: stage === "won" ? "service" : stage === "closed" ? "service" : "marketing", icon: stage === "won" || stage === "closed" ? "Trophy" : "ArrowRight" });
        }}
        onSendProposal={(lead) => {
          setOpenLead(null);
          onNavigate("proposals", { newFromLead: lead });
        }}
      />
    </div>
  );
};

Object.assign(window, { LeadsPage });
