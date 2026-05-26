/* ============================================
   Customer Profile + Service Operation
   ============================================ */

const insightTag = (key, value) => {
  const map = {
    pace: { "เร็ว": ["service", "Zap"], "ปกติ": ["default", "Clock"], "ช้า": ["sales", "TurtleIcon"], "ช้า แต่ละเอียด": ["sales", "Clock"] },
    lineResponse: { "ตอบไลน์": ["service", "MessageCircle"], "ไม่ตอบไลน์": ["rose", "MessageCircleOff"] },
    callNeeded: { "ไม่ต้องโทร": ["service", "PhoneOff"], "ต้องโทรตาม": ["sales", "PhoneCall"] },
    detail: { "สูงมาก": ["marketing", "Microscope"], "ปานกลาง": ["default", "AlignLeft"], "ต่ำ": ["service", "Minimize2"] },
    payment: { "ตรงเวลา": ["service", "CircleDollarSign"], "จ่ายช้า": ["rose", "AlertTriangle"] },
  };
  return map[key]?.[value] || ["default", "Circle"];
};

/* ============================================
   Customer list (replaces existing "จัดการลูกค้า")
   - Table list as primary view, click row → profile detail
   - Optional Card view toggle
   ============================================ */
const CustomersPageCRM = ({ onNavigate, sharedState }) => {
  const customers = sharedState.customers;
  const [openId, setOpenId] = React.useState(null);
  const open = customers.find(c => c.id === openId);
  const { JOBS } = window.CRM_DATA;
  const [view, setView] = React.useState("list");
  const [search, setSearch] = React.useState("");
  const [showAdd, setShowAdd] = React.useState(false);
  const [typeTab, setTypeTab] = React.useState("active"); // active | prospect | all

  const active = customers.filter(c => c.customerType !== "prospect");
  const prospect = customers.filter(c => c.customerType === "prospect");

  const sourceList = typeTab === "active" ? active : typeTab === "prospect" ? prospect : customers;
  const filtered = sourceList.filter(c =>
    !search || c.company.toLowerCase().includes(search.toLowerCase()) || c.taxId.includes(search) || c.contact.includes(search)
  );

  const totalJobs = JOBS.length;
  const isProspectView = typeTab === "prospect";

  return (
    <div className="space-y-5">
      {/* Header matches existing app pattern */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("inline-block w-1.5 h-7 rounded-sm", moduleAccent("service").solid)} />
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight">จัดการลูกค้า</h1>
            <p className="text-sm text-[var(--muted-foreground)]">รายชื่อลูกค้า · ข้อมูลการติดต่อ · Insight และงานบริการ</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm"><Icon name="Filter" size={14} />ตัวกรอง</Button>
          <Button variant="outline" size="sm"><Icon name="Download" size={14} />Export</Button>
          <div className="relative">
            <Button variant="service" size="default" onClick={() => setShowAdd(s => !s)}>
              <Icon name="Plus" size={14} />เพิ่มลูกค้าใหม่ <Icon name="ChevronDown" size={13} />
            </Button>
            {showAdd && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAdd(false)} />
                <div className="absolute right-0 mt-1.5 w-56 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-lg z-20 py-1 slide-up">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--muted)] text-left" onClick={() => setShowAdd(false)}>
                    <Icon name="Plus" size={14} className="text-[var(--muted-foreground)]" />เพิ่มทีละรายการ
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--muted)] text-left" onClick={() => setShowAdd(false)}>
                    <Icon name="FileSpreadsheet" size={14} className="text-[var(--muted-foreground)]" />เพิ่มหลายรายการ (Excel)
                  </button>
                  <div className="border-t border-[var(--border)] my-1" />
                  <p className="px-3 py-1.5 text-[11px] text-[var(--muted-foreground)]">
                    <Icon name="Sparkles" size={11} className="inline" /> ลูกค้าใหม่ส่วนใหญ่จะถูกสร้าง<br />อัตโนมัติเมื่ออนุมัติ Proposal
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="ลูกค้าจริง (Active)" value={active.length} icon="ShieldCheck" accent="service" />
        <Stat label="Prospect (รอเซ็น/รออนุมัติ)" value={prospect.length} icon="UserPlus" accent="sales" />
        <Stat label="รายได้ Active/ปี" value={`฿${(active.reduce((s, c) => s + c.revenue, 0) / 1000).toFixed(0)}K`} icon="TrendingUp" accent="service" />
        <Stat label="งานที่กำลังทำ" value={totalJobs} icon="Briefcase" accent="service" />
      </div>

      {/* Type tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
          {[
            { v: "active", l: "ลูกค้าจริง", i: "ShieldCheck", count: active.length, acc: "service" },
            { v: "prospect", l: "Prospect", i: "UserPlus", count: prospect.length, acc: "sales" },
            { v: "all", l: "ทั้งหมด", i: "Users", count: customers.length, acc: "default" },
          ].map(t => {
            const isActive = typeTab === t.v;
            const a = t.acc === "default" ? null : moduleAccent(t.acc);
            return (
              <button
                key={t.v}
                onClick={() => setTypeTab(t.v)}
                className={cn(
                  "px-3 h-8 rounded-md text-sm font-medium transition-all flex items-center gap-1.5",
                  isActive
                    ? cn("bg-[var(--background)] shadow-[0_1px_2px_oklch(0_0_0/0.06)]", a ? a.fg : "text-[var(--foreground)]")
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon name={t.i} size={14} />
                {t.l}
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded tabular font-semibold",
                  isActive ? (a ? cn(a.soft, a.fg) : "bg-[var(--muted)]") : "bg-[var(--background)]/60"
                )}>{t.count}</span>
              </button>
            );
          })}
        </div>

        <Input className="flex-1 lg:max-w-sm" icon={<Icon name="Search" size={14} />} placeholder="ค้นหาชื่อลูกค้า / เลขผู้เสียภาษี / ผู้ติดต่อ..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Tabs value={view} onChange={setView} options={[
            { value: "list", label: "List", icon: "Rows3" },
            { value: "card", label: "Cards", icon: "LayoutGrid" },
          ]} />
          <span className="text-xs text-[var(--muted-foreground)] tabular hidden sm:inline">{filtered.length} รายการ</span>
        </div>
      </div>

      {/* Prospect explanatory banner */}
      {isProspectView && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--sales-soft)] border border-[var(--sales)]/30">
          <div className={cn("h-8 w-8 rounded-md text-white flex items-center justify-center shrink-0", moduleAccent("sales").solid)}>
            <Icon name="Info" size={15} />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-[var(--sales-fg)]">Prospect — ยังไม่ใช่ลูกค้าจริง</p>
            <p className="text-[var(--sales-fg)] opacity-85 mt-0.5">ถูกสร้างจาก Lead/Proposal เพื่อใช้ทำใบเสนอราคา · จะถูกเลื่อนเป็น "ลูกค้าจริง" เมื่อ AE Close ดีลและลูกค้าเซ็นสัญญา/ชำระเงิน</p>
          </div>
        </div>
      )}

      {/* Body */}
      {view === "list" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/50">
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left font-medium px-4 py-2.5 w-[26%]">ลูกค้า</th>
                  <th className="text-left font-medium px-4 py-2.5">เลขผู้เสียภาษี / ประเภท</th>
                  <th className="text-left font-medium px-4 py-2.5">ผู้ติดต่อ</th>
                  <th className="text-left font-medium px-4 py-2.5">Insight</th>
                  <th className="text-left font-medium px-4 py-2.5">แพ็กเกจ</th>
                  <th className="text-right font-medium px-4 py-2.5">รายได้/ปี</th>
                  <th className="text-center font-medium px-4 py-2.5">{isProspectView ? "Stage" : "งาน"}</th>
                  <th className="px-3 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const customerJobs = JOBS.filter(j => j.customerId === c.id);
                  const insightChips = Object.entries(c.insights).slice(0, 2);
                  const isProspect = c.customerType === "prospect";
                  return (
                    <tr key={c.id} className={cn("border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/40 cursor-pointer row-pad transition-colors", isProspect && "bg-[var(--sales-soft)]/10")} onClick={() => setOpenId(c.id)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                            isProspect ? cn(moduleAccent("sales").soft, moduleAccent("sales").fg, "border border-dashed border-[var(--sales)]/40") : cn(moduleAccent("service").soft, moduleAccent("service").fg)
                          )}>
                            {c.company[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium leading-tight truncate">{c.company}</p>
                              {isProspect && <Badge tone="sales" soft className="!text-[9px] !py-0">Prospect</Badge>}
                            </div>
                            <p className="text-[11px] text-[var(--muted-foreground)] font-mono mt-0.5">
                              {c.id} · {isProspect ? c.prospectStage : `เริ่ม ${c.sinceMonth}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs">{c.taxId}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 truncate max-w-[200px]">{c.type}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium">{c.contact}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1"><Icon name="Phone" size={10} />{c.phone}</span>
                          {c.line !== "—" && <span className="inline-flex items-center gap-1"><Icon name="MessageCircle" size={10} />{c.line}</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {insightChips.filter(([, v]) => v !== "—").map(([k, v]) => {
                            const [tone, icon] = insightTag(k, v);
                            return <Badge key={k} tone={tone} soft className="!text-[10px] !py-0"><Icon name={icon} size={9} />{v}</Badge>;
                          })}
                          {isProspect && <span className="text-[11px] italic text-[var(--muted-foreground)]">— ยังไม่ประเมิน</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] max-w-[180px]">
                        <p className="truncate">{c.package}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular font-semibold">฿{c.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        {isProspect ? (
                          <Badge tone="sales" soft className="!text-[10px]"><Icon name="Clock" size={10} />{c.prospectStage.split("·")[0].trim()}</Badge>
                        ) : customerJobs.length > 0 ? (
                          <Badge tone="service" soft className="!text-[10px]"><Icon name="Briefcase" size={10} />{customerJobs.length}</Badge>
                        ) : (
                          <span className="text-[11px] text-[var(--muted-foreground)]">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right"><Icon name="ChevronRight" size={14} className="text-[var(--muted-foreground)]" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <Empty icon="Users" title="ไม่พบลูกค้าตามคำค้นหา" hint="ลองเปลี่ยน keyword หรือเคลียร์ตัวกรอง" />}
          {/* Pagination footer */}
          <div className="flex items-center justify-between p-3 border-t border-[var(--border)] bg-[var(--muted)]/30">
            <span className="text-xs text-[var(--muted-foreground)]">แสดง 1–{filtered.length} จาก {customers.length} รายการ</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon-sm" disabled><Icon name="ChevronLeft" size={14} /></Button>
              <span className="text-xs px-2 tabular">หน้า 1 / 1</span>
              <Button variant="outline" size="icon-sm" disabled><Icon name="ChevronRight" size={14} /></Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {filtered.map(c => {
            const customerJobs = JOBS.filter(j => j.customerId === c.id);
            const isProspect = c.customerType === "prospect";
            return (
              <Card key={c.id} className={cn("hover:shadow-md transition-all cursor-pointer", isProspect && "border-dashed border-[var(--sales)]/40 bg-[var(--sales-soft)]/10")} onClick={() => setOpenId(c.id)}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-base font-bold",
                        isProspect ? cn(moduleAccent("sales").soft, moduleAccent("sales").fg) : cn(moduleAccent("service").soft, moduleAccent("service").fg)
                      )}>
                        {c.company[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{c.company}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)] font-mono">{c.id} · TIN {c.taxId.slice(0, 7)}...</p>
                      </div>
                    </div>
                    <Badge tone={isProspect ? "sales" : "service"} soft className="!text-[10px] shrink-0">{isProspect ? "Prospect" : "Active"}</Badge>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Icon name="Tag" size={11} />{c.type}</div>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Icon name="Package" size={11} /><span className="truncate">{c.package}</span></div>
                    {isProspect && (
                      <div className="flex items-center gap-2 text-xs text-[var(--sales-fg)] font-medium"><Icon name="Clock" size={11} />{c.prospectStage}</div>
                    )}
                  </div>
                  {!isProspect && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Object.entries(c.insights).slice(0, 3).map(([k, v]) => {
                        const [tone, icon] = insightTag(k, v);
                        return <Badge key={k} tone={tone} soft className="!text-[10px] !py-0"><Icon name={icon} size={10} />{v}</Badge>;
                      })}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs text-[var(--muted-foreground)]">{isProspect ? "ประมาณการ" : `เริ่ม ${c.sinceMonth}`}</span>
                    <span className="text-sm font-semibold tabular">฿{c.revenue.toLocaleString()}<span className="text-[10px] text-[var(--muted-foreground)] font-normal">/ปี</span></span>
                  </div>
                  {!isProspect && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge tone="service" soft className="!text-[10px] !py-0"><Icon name="Briefcase" size={10} />{customerJobs.length} งาน</Badge>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Customer detail modal */}
      <Modal open={!!open} onClose={() => setOpenId(null)} size="xl" title={open?.company} description={`${open?.id} · ${open?.type}`}
        footer={<>
          <Button variant="outline" onClick={() => setOpenId(null)}>ปิด</Button>
          <Button variant="outline"><Icon name="Edit2" size={13} />แก้ไขข้อมูล</Button>
        </>}
      >
        {open && <CustomerDetail customer={open} onNavigate={onNavigate} />}
      </Modal>
    </div>
  );
};

/* ---------- Customer Package & Finance tab ---------- */
const CustomerPackageTab = ({ customer }) => {
  const { PROPOSALS, PACKAGE_TIERS, PACKAGE_ITEMS } = window.CRM_DATA;
  // Try to find the proposal that created this customer (so we can show same structure)
  const proposal = PROPOSALS.find(p => p.id === customer.fromProposal);
  const tier = proposal && PACKAGE_TIERS.find(t => t.id === proposal.tierId);

  // Derived values for billing summary
  const monthlyPrice = proposal?.monthlyPrice ?? customer.monthlyFee ?? 0;
  const isAnnual = proposal?.billingMode === "annual";
  const annualBase = monthlyPrice * 12;
  const annualDiscountAmt = Math.round(annualBase * ((proposal?.annualDiscountPct || 0) / 100));
  const annualAfterDiscount = annualBase - annualDiscountAmt;
  const addons = proposal?.addons || [];
  const oneTimeTotal = addons.reduce((s, a) => s + (a.price || 0), 0);
  const yearTotal = (isAnnual ? annualAfterDiscount : annualBase) + oneTimeTotal;

  return (
    <div className="space-y-3">
      {/* Source banner — links to the originating proposal */}
      {proposal && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--sales-soft)]/40 border border-[var(--sales)]/20">
          <div className="flex items-center gap-2.5">
            <div className={cn("h-9 w-9 rounded-md flex items-center justify-center", moduleAccent("sales").soft, moduleAccent("sales").fg)}>
              <Icon name="FileSignature" size={16} />
            </div>
            <div>
              <p className="text-[11px] text-[var(--muted-foreground)]">บริการมาจาก Proposal</p>
              <p className="text-sm font-semibold font-mono">{proposal.id}</p>
            </div>
          </div>
          <Badge tone={isAnnual ? "service" : "sales"} soft className="!text-[11px]">
            <Icon name={isAnnual ? "CalendarCheck2" : "CalendarDays"} size={11} />
            {isAnnual ? "ชำระรายปี" : "ชำระรายเดือน"}
          </Badge>
        </div>
      )}

      {/* Tier card — same layout as ProposalDetail */}
      {tier && (
        <Card className="!shadow-none border-[var(--sales)]/30 bg-[var(--sales-soft)]/30">
          <div className="p-3.5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">แพ็กเกจรายเดือน</p>
                <p className="text-sm font-semibold text-[var(--sales-fg)] mt-0.5">{tier.label}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{tier.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tabular text-[var(--sales-fg)]">฿{monthlyPrice.toLocaleString()}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">/เดือน · ช่วง ฿{tier.priceMin.toLocaleString()}–{tier.priceMax.toLocaleString()}</p>
              </div>
            </div>
            <ul className="space-y-1 mt-2">
              {tier.items.map(id => {
                const item = PACKAGE_ITEMS.find(p => p.id === id);
                return (
                  <li key={id} className="flex items-start gap-2 text-sm">
                    <Icon name="CheckCircle2" size={13} className="text-[var(--sales-fg)] mt-0.5 shrink-0" />
                    <span>#{id} {item?.label || ""}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>
      )}

      {/* Plain package fallback (no proposal linked) */}
      {!tier && customer.packageItems?.length > 0 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>แพ็กเกจบริการ</CardTitle>
              <CardDescription>{customer.package || "—"}</CardDescription>
            </div>
            {monthlyPrice > 0 && (
              <div className="text-right">
                <p className="text-2xl font-semibold tabular">฿{monthlyPrice.toLocaleString()}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">/เดือน</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {customer.packageItems.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Icon name="CheckCircle2" size={14} className="text-[var(--service-fg)] mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Add-ons */}
      {addons.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-2">Add-ons ({addons.length})</p>
          <div className="space-y-1.5">
            {addons.map(a => (
              <div key={a.id} className="flex items-start justify-between p-2.5 rounded-md border border-[var(--border)] bg-[var(--muted)]/30">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <Icon name="Plus" size={13} className="text-[var(--service-fg)] mt-0.5 shrink-0" />
                  <span className="text-sm">{a.label}</span>
                </div>
                <span className="text-sm font-medium tabular shrink-0">฿{(a.price || 0).toLocaleString()}<span className="text-[10px] text-[var(--muted-foreground)]"> ครั้งเดียว</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing breakdown — mirror ProposalDetail */}
      {proposal && (
        <Card className="!shadow-none">
          <div className="p-3.5 space-y-1.5 text-sm">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">สรุปยอด</p>
            {isAnnual ? (
              <>
                <div className="flex items-center justify-between">
                  <span>{tier?.label || "Package"} × 12 เดือน</span>
                  <span className="tabular text-[var(--muted-foreground)]">฿{annualBase.toLocaleString()}</span>
                </div>
                {proposal.annualDiscountPct > 0 && (
                  <div className="flex items-center justify-between text-[var(--service-fg)]">
                    <span>ส่วนลดรายปี ({proposal.annualDiscountPct}%)</span>
                    <span className="tabular font-medium">- ฿{annualDiscountAmt.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-medium">
                  <span>รวมค่าบริการรายปี</span>
                  <span className="tabular">฿{annualAfterDiscount.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span>ค่าบริการรายเดือน × 12</span>
                <span className="tabular font-medium">฿{annualBase.toLocaleString()}</span>
              </div>
            )}
            {oneTimeTotal > 0 && (
              <div className="flex items-center justify-between">
                <span>Add-ons ({addons.length}) — ครั้งเดียว</span>
                <span className="tabular">฿{oneTimeTotal.toLocaleString()}</span>
              </div>
            )}
            <Divider />
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="text-[11px] text-[var(--muted-foreground)]">รวมทั้งหมด</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  {isAnnual ? "เก็บครั้งเดียวต้นปี" : `เก็บทุกเดือน ฿${monthlyPrice.toLocaleString()}`}
                </p>
              </div>
              <p className="text-2xl font-bold tabular text-[var(--sales-fg)]">฿{yearTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Financial snapshot — keep below billing */}
      {customer.annualRevenue && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>งบการเงินล่าสุด</CardTitle>
              <CardDescription>ณ วันที่ {customer.financialDate || "—"}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                ["สินทรัพย์", customer.assets, "service"],
                ["หนี้สิน", customer.liabilities, "sales"],
                ["ส่วนของเจ้าของ", customer.equity, "marketing"],
                ["รายได้", customer.annualRevenue, "service"],
                ["ค่าใช้จ่าย", customer.annualExpense, "default"],
                ["กำไรสุทธิ", customer.netProfit, "service"],
              ].map(([k, v, tone]) => (
                <div key={k} className="p-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/30">
                  <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">{k}</p>
                  <p className={cn("text-base font-semibold tabular mt-0.5",
                    tone === "service" && "text-[var(--service-fg)]",
                    tone === "sales" && "text-[var(--sales-fg)]",
                    tone === "marketing" && "text-[var(--marketing-fg)]"
                  )}>฿{(v || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employees */}
      {customer.totalEmployees && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>พนักงาน</CardTitle>
              <CardDescription>ใช้คำนวณบริการเงินเดือน · ประกันสังคม</CardDescription>
            </div>
            <Badge tone="service" className="!text-xs">รวม {customer.totalEmployees} คน</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/30">
                <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">พนักงานประจำ</p>
                <p className="text-2xl font-semibold tabular mt-0.5">{customer.permanentEmployees} <span className="text-xs font-normal text-[var(--muted-foreground)]">คน</span></p>
              </div>
              <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/30">
                <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">พนักงานชั่วคราว / Freelance</p>
                <p className="text-2xl font-semibold tabular mt-0.5">{customer.tempEmployees} <span className="text-xs font-normal text-[var(--muted-foreground)]">คน</span></p>
              </div>
            </div>
            {customer.payrollSchedule && (
              <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2 text-sm">
                <div className="grid grid-cols-[130px_1fr] gap-2">
                  <span className="text-xs text-[var(--muted-foreground)]">รอบจ่ายเงินเดือน</span>
                  <span className="font-medium">{customer.payrollSchedule}</span>
                </div>
                {customer.employerId && (
                  <div className="grid grid-cols-[130px_1fr] gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">เลขทะเบียนนายจ้าง</span>
                    <span className="font-medium font-mono">{customer.employerId}</span>
                  </div>
                )}
                {customer.specialConditions && customer.specialConditions !== "—" && (
                  <div className="grid grid-cols-[130px_1fr] gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">เงื่อนไขพิเศษ</span>
                    <span className="font-medium text-xs">{customer.specialConditions}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/* ---------- Customer Meetings & Presentations tab ---------- */
const CustomerMeetingsTab = ({ customer }) => {
  const { LEADS, PROPOSALS, ACTIVITIES, CALLS, FOLLOWUPS } = window.CRM_DATA;
  // Find originating lead via proposal → leadId, or via prospect's leadId directly
  const proposal = PROPOSALS.find(p => p.id === customer.fromProposal);
  const leadId = customer.leadId || proposal?.leadId;
  const lead = LEADS.find(l => l.id === leadId);

  if (!lead) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-[var(--muted-foreground)]">
          <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
          ไม่พบข้อมูล Lead ต้นทางของลูกค้ารายนี้
        </CardContent>
      </Card>
    );
  }

  const acts = ACTIVITIES.filter(a => a.leadId === lead.id);
  const calls = CALLS.filter(c => c.leadId === lead.id);
  const followups = FOLLOWUPS.filter(f => f.leadId === lead.id);

  // Build meeting list — synthesize from activity timeline + onboarding
  const meetings = [];
  // 1st meeting (AE)
  meetings.push({
    type: "AE 1st Meeting",
    date: "2026-04-12 14:00",
    by: "ขวัญ (AE)",
    mode: "On-site",
    status: "เสร็จสิ้น",
    notes: "เก็บข้อมูลขนาดธุรกิจ · จำนวนพนักงาน 15 คน · 4 หุ้นส่วน · ปริมาณ Invoice 40+/เดือน",
    icon: "Users",
  });
  // Proposal presentation
  meetings.push({
    type: "นำเสนอ Proposal",
    date: "2026-04-18 10:30",
    by: "ขวัญ (AE)",
    mode: "Online (Zoom)",
    status: "เสร็จสิ้น",
    notes: `นำเสนอ ${proposal?.id || "Proposal"} · Tier 2 + จดบริษัท · ลูกค้าขอเวลาคิด 3 วัน`,
    icon: "Presentation",
  });
  // Onboarding
  meetings.push({
    type: "Onboarding Meeting",
    date: "2026-04-25 14:00",
    by: "ขวัญ (AE) + อ้อม (Service)",
    mode: "On-site",
    status: "เสร็จสิ้น",
    notes: "แนะนำทีม · อธิบาย workflow รายเดือน · ตั้งกลุ่ม Line OA · เซ็นสัญญารายปี",
    icon: "GraduationCap",
  });

  return (
    <div className="space-y-3">
      {/* Lead origin banner */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--marketing-soft)]/40 border border-[var(--marketing)]/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn("h-9 w-9 rounded-md flex items-center justify-center shrink-0", moduleAccent("marketing").soft, moduleAccent("marketing").fg)}>
            <Icon name="Magnet" size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-[var(--muted-foreground)]">ข้อมูลจาก Lead ต้นทาง</p>
            <p className="text-sm font-semibold font-mono">{lead.id} · {lead.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--marketing-fg)]">
          <Badge tone="marketing" soft className="!text-[10px]">{lead.source}</Badge>
        </div>
      </div>

      {/* Sales context summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--card)]">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">ผู้รับผิดชอบ</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1.5">
              <Avatar name={lead.mkOwner || "—"} size={22} />
              <span className="text-xs">MK: {lead.mkOwner || "—"}</span>
            </div>
            <Icon name="ArrowRight" size={11} className="text-[var(--muted-foreground)]" />
            <div className="flex items-center gap-1.5">
              <Avatar name={lead.aeOwner || "—"} size={22} />
              <span className="text-xs">AE: {lead.aeOwner || "—"}</span>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--card)]">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">การโทรของ Sales</p>
          <p className="text-xl font-bold tabular mt-1">{calls.length}<span className="text-xs font-normal text-[var(--muted-foreground)]"> ครั้ง</span></p>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">บันทึกใน Call Log</p>
        </div>
        <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--card)]">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">Follow-up</p>
          <p className="text-xl font-bold tabular mt-1">{followups.length}<span className="text-xs font-normal text-[var(--muted-foreground)]"> นัด</span></p>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">จาก Sales Follow-up</p>
        </div>
      </div>

      {/* Meetings list */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>การประชุมและนำเสนอ</CardTitle>
            <CardDescription>รวมทุกการประชุมตั้งแต่ Lead จนถึง Onboarding</CardDescription>
          </div>
          <Badge tone="service" soft className="!text-[10px]">{meetings.length} รายการ</Badge>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2.5">
            {meetings.map((m, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/40 transition-colors">
                <div className={cn("h-9 w-9 rounded-md flex items-center justify-center shrink-0", moduleAccent("sales").soft, moduleAccent("sales").fg)}>
                  <Icon name={m.icon} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{m.type}</p>
                    <Badge tone="service" soft className="!text-[10px]">{m.status}</Badge>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1"><Icon name="Calendar" size={10} />{m.date}</span>
                    <span className="flex items-center gap-1"><Icon name="User" size={10} />{m.by}</span>
                    <span className="flex items-center gap-1"><Icon name={m.mode.includes("Online") ? "Video" : "MapPin"} size={10} />{m.mode}</span>
                  </p>
                  <p className="text-xs mt-1.5 text-[var(--foreground)]/80">{m.notes}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Sales journey timeline (compact) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Customer Journey จาก Lead</CardTitle>
            <CardDescription>กิจกรรมและจุดเปลี่ยนสำคัญตั้งแต่เป็น Lead</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l-2 border-dashed border-[var(--border)] ml-3 space-y-3 pl-5">
            {acts.length === 0 && <p className="text-xs text-[var(--muted-foreground)]">ไม่มี activity บันทึก</p>}
            {acts.slice().reverse().map((a) => {
              const tones = { call: "sales", email: "marketing", note: "marketing", stage: "service", proposal: "sales", followup: "sales", create: "default" };
              const tone = tones[a.type] || "default";
              const acc = tone === "default" ? null : moduleAccent(tone);
              return (
                <li key={a.id} className="relative">
                  <span className={cn("absolute -left-[34px] top-0.5 w-6 h-6 rounded-full ring-4 ring-[var(--background)] flex items-center justify-center", acc ? cn(acc.soft, acc.fg) : "bg-[var(--muted)] text-[var(--muted-foreground)]")}>
                    <Icon name={a.icon} size={12} />
                  </span>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{a.by} · {a.at}{a.duration && <span> · ⏱ {a.duration}</span>}</p>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Sales note from lead */}
      {lead.note && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Sales Note จาก Lead</CardTitle>
              <CardDescription>บันทึกที่ Sales เก็บไว้ตั้งแต่ครั้งแรกที่คุยกับลูกค้า</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{lead.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CustomerDetail = ({ customer, onNavigate }) => {
  const { JOBS, COMM_LOG } = window.CRM_DATA;
  const jobs = JOBS.filter(j => j.customerId === customer.id);
  const logs = COMM_LOG.filter(l => l.customerId === customer.id);
  const [tab, setTab] = React.useState("info");

  return (
    <div className="space-y-4">
      <Tabs value={tab} onChange={setTab} options={[
        { value: "info", label: "ข้อมูลหลัก", icon: "User" },
        { value: "package", label: "บริการ & การเงิน", icon: "Package" },
        { value: "meetings", label: "การประชุม & นำเสนอ", icon: "Presentation" },
        { value: "insight", label: "Insight", icon: "Sparkles" },
      ]} />

      {tab === "info" && (
        <div className="space-y-3">
          {/* Service overview banner */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-[var(--service-soft)]/40 border border-[var(--service)]/20">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--muted-foreground)]">ผู้ให้บริการ</span>
              <span className="font-semibold">{customer.serviceProvider || "นิติพัฒนา"}</span>
            </div>
            <div className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--muted-foreground)]">ผู้ดูแลหลัก</span>
              {customer.mainCaretaker && <Avatar name={customer.mainCaretaker} size={20} />}
              <span className="font-semibold">{customer.mainCaretaker || "—"}</span>
            </div>
            <div className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--muted-foreground)]">สัญญาให้บริการ</span>
              <Badge tone={customer.contractSignedAt ? "service" : "amber"} soft className="!text-[10px]">
                {customer.contractSignedAt ? `เซ็นแล้ว ${customer.contractSignedAt}` : "อยู่ระหว่างดำเนินการ"}
              </Badge>
            </div>
            <div className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--muted-foreground)]">เริ่มใช้บริการ</span>
              <span className="font-semibold">{customer.startDate || customer.sinceMonth || "—"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader><CardTitle>ข้อมูลบริษัท</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-2.5 text-sm">
                  {[
                    ["ชื่อบริษัท", customer.company],
                    ["เลขทะเบียน / TIN", customer.taxId],
                    ["ประเภทธุรกิจ", customer.type],
                    ["ทุนจดทะเบียน", customer.registeredCapital],
                    ["กรรมการ", customer.directors ? `${customer.directors} ท่าน` : null],
                    ["วันที่จดทะเบียน", customer.registrationDate],
                    ["กำหนดวันปิดบัญชี", customer.closingDate],
                    ["ที่อยู่", customer.address],
                  ].filter(([, v]) => v != null && v !== "").map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[130px_1fr] items-start gap-2">
                      <dt className="text-xs text-[var(--muted-foreground)]">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* Doc/registration flags */}
                <div className="mt-3 pt-3 border-t border-[var(--border)] flex flex-wrap gap-1.5">
                  <Badge tone={customer.hasCert ? "service" : "slate"} soft className="!text-[10px]">
                    <Icon name={customer.hasCert ? "Check" : "X"} size={10} />หนังสือรับรอง
                  </Badge>
                  <Badge tone={customer.hasStamp ? "service" : "slate"} soft className="!text-[10px]">
                    <Icon name={customer.hasStamp ? "Check" : "X"} size={10} />ตราประทับ
                  </Badge>
                  <Badge tone={customer.ssoRegistered ? "service" : "slate"} soft className="!text-[10px]">
                    <Icon name={customer.ssoRegistered ? "Check" : "X"} size={10} />จดประกันสังคม
                  </Badge>
                  <Badge tone={customer.vatRegistered ? "service" : "slate"} soft className="!text-[10px]">
                    <Icon name={customer.vatRegistered ? "Check" : "X"} size={10} />จด VAT
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>ผู้ติดต่อ</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-2.5 text-sm">
                  {[
                    ["ผู้ติดต่อหลัก", customer.contact],
                    ["โทรศัพท์", customer.phone],
                    ["Line", customer.line],
                    ["Email", customer.email],
                    ["ช่องทางรับเอกสาร", customer.documentChannel],
                  ].filter(([, v]) => v != null && v !== "" && v !== "—").map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[130px_1fr] items-start gap-2">
                      <dt className="text-xs text-[var(--muted-foreground)]">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>

                {customer.secondaryContact && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2 text-sm">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">ผู้ติดต่อสำรอง</p>
                    <div className="flex items-center gap-2">
                      <Avatar name={customer.secondaryContact} size={24} />
                      <div>
                        <p className="text-sm font-medium">{customer.secondaryContact}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)]">{customer.secondaryPhone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle>รหัสภายในระบบ (Account Codes)</CardTitle><CardDescription>เคยอยู่แยกหลายไฟล์ — รวมไว้ที่เดียวที่นี่</CardDescription></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    ["สรรพากร (RD)", customer.serviceCode?.tax],
                    ["พัฒนาธุรกิจ (DBD)", customer.serviceCode?.revenue],
                    ["ประกันสังคม (SSO)", customer.serviceCode?.payroll],
                    ["Internal Code", customer.id],
                  ].map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-md border border-[var(--border)] bg-[var(--muted)]/30">
                      <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">{k}</p>
                      <p className="font-mono text-sm font-medium mt-0.5">{v || "—"}</p>
                    </div>
                  ))}
                </div>
                {customer.bankStatements && customer.bankStatements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-1.5">Bank Statement</p>
                    <div className="flex flex-wrap gap-1.5">
                      {customer.bankStatements.map(b => (
                        <Badge key={b} tone="default" soft className="!text-[11px]"><Icon name="Landmark" size={10} />{b}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "package" && <CustomerPackageTab customer={customer} />}

      {tab === "insight" && (
        <Card>
          <CardHeader><CardTitle>Customer Insight Tags</CardTitle><CardDescription>แอดมินประเมินจากครั้งแรก · แชร์ให้ทุกทีมเห็น</CardDescription></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(customer.insights).map(([k, v]) => {
                const [tone, icon] = insightTag(k, v);
                const labels = { pace: "ความเร็วงาน", lineResponse: "การตอบไลน์", callNeeded: "การโทรตาม", detail: "ความละเอียด", payment: "การชำระเงิน" };
                return (
                  <div key={k} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">{labels[k]}</p>
                      <p className="font-medium mt-0.5">{v}</p>
                    </div>
                    <Badge tone={tone} soft><Icon name={icon} size={12} />{v}</Badge>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[var(--service-soft)] border border-[var(--service)]/20">
              <p className="text-xs font-medium text-[var(--service-fg)] flex items-center gap-1.5"><Icon name="Sparkles" size={12} />Recommendation</p>
              <p className="text-xs text-[var(--service-fg)] mt-1">{customer.insights.payment === "จ่ายช้า" ? "แนะนำ — ตั้ง Follow-up การจ่าย D+3 / D+7 อัตโนมัติ" : "ลูกค้าจ่ายตรงเวลา — ไม่ต้องตามค่าธรรมเนียม"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "meetings" && <CustomerMeetingsTab customer={customer} />}

    </div>
  );
};

/* ============================================
   Service Operation Page
   ============================================ */
const JobWorkflowCard = ({ job, compact, onUpdate }) => {
  const [steps, setSteps] = React.useState(job.steps);
  const completed = steps.filter(s => s.done).length;
  const progress = completed / steps.length;

  const toggleStep = (id) => {
    setSteps(ss => ss.map(s => s.id === id ? { ...s, done: !s.done, active: false } : s));
  };

  return (
    <Card className={compact ? "" : "hover:shadow-md transition-all"}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", moduleAccent("service").soft, moduleAccent("service").fg)}>
              <Icon name={job.type.includes("จด") ? "BookOpen" : job.type.includes("บัญชี") ? "Calculator" : "FileText"} size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{job.type}</p>
                <Badge tone="service" soft className="!text-[10px]">{job.id}</Badge>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{job.customer} · เทมเพลต {job.template}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5"><Icon name="Calendar" size={10} className="inline" /> ครบกำหนด {job.dueAt} · ทีม {job.owner}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-[var(--muted-foreground)]">ความคืบหน้า</p>
            <p className="text-lg font-semibold tabular">{Math.round(progress * 100)}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
          <div className={cn("h-full transition-all", moduleAccent("service").solid)} style={{ width: `${progress * 100}%` }} />
        </div>

        {/* Steps */}
        <ol className="mt-4 space-y-1.5">
          {steps.map((s, i) => (
            <li key={s.id} className={cn("flex items-center gap-2.5 p-2 rounded-md transition-colors group", s.active && "bg-[var(--service-soft)]/60", s.done && "opacity-60")}>
              <button onClick={() => toggleStep(s.id)} className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                s.done ? "bg-[var(--service)] border-[var(--service)]" :
                s.active ? "border-[var(--service)] bg-[var(--background)]" :
                "border-[var(--border)] bg-[var(--background)]")}>
                {s.done && <Icon name="Check" size={11} style={{ color: "white" }} />}
                {!s.done && s.active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--service)] pulse-dot" />}
              </button>
              <span className={cn("flex-1 text-sm", s.done && "line-through text-[var(--muted-foreground)]", s.active && "font-medium")}>{i + 1}. {s.name}</span>
              {s.active && <Badge tone="service" soft className="!text-[10px] !py-0"><Icon name="ArrowRight" size={9} />กำลังทำ</Badge>}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
};

/* ============================================
   Service Operation = "จัดการงาน" (merge with old Cases)
   - Tabs: ทั้งหมด / ของฉัน / เสร็จแล้ว / ปิดแล้ว
   - Filter panel + search + bulk select
   - Detail drawer w/ workflow + comments + attachments
   ============================================ */

const statusTone = (code) => window.CRM_DATA.STATUS_OPTS.find(s => s.value === code)?.color || "slate";
const statusLabel = (code) => window.CRM_DATA.STATUS_OPTS.find(s => s.value === code)?.label || code;
const priorityTone = (code) => window.CRM_DATA.PRIORITY_OPTS.find(s => s.value === code)?.color || "slate";
const priorityLabel = (code) => window.CRM_DATA.PRIORITY_OPTS.find(s => s.value === code)?.label || code;

/* ---------- Avatars cluster ---------- */
const AssigneesCluster = ({ assignees, max = 3 }) => {
  if (!assignees || assignees.length === 0) return <span className="text-xs italic text-[var(--muted-foreground)]">ยังไม่ได้กำหนด</span>;
  const shown = assignees.slice(0, max);
  const rest = assignees.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((a, i) => (
        <div key={i} className="ring-2 ring-[var(--background)] rounded-full" title={a.name}>
          <Avatar name={a.name} size={26} />
        </div>
      ))}
      {rest > 0 && (
        <div className="ring-2 ring-[var(--background)] h-[26px] w-[26px] rounded-full bg-[var(--muted)] flex items-center justify-center text-[10px] font-medium text-[var(--muted-foreground)]">
          +{rest}
        </div>
      )}
    </div>
  );
};

/* ---------- Filter panel ---------- */
const ServiceFilterPanel = ({ open, onClose, value, onChange, onClear }) => {
  const { STATUS_OPTS, PRIORITY_OPTS } = window.CRM_DATA;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end fade-in" style={{ background: "oklch(0 0 0 / 0.3)" }} onClick={onClose}>
      <div className="bg-[var(--card)] h-full w-full max-w-md border-l border-[var(--border)] shadow-2xl overflow-y-auto slide-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[var(--card)] border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">ตัวกรองการค้นหา</h3>
          <Button variant="ghost" size="icon-sm" onClick={onClose}><Icon name="X" size={15} /></Button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">สถานะ</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STATUS_OPTS.map(s => (
                <button
                  key={s.value}
                  onClick={() => onChange({ status: s.value })}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium border transition-colors text-left",
                    value.status === s.value ? "border-[var(--ring)] bg-[var(--muted)]" : "border-[var(--border)] hover:bg-[var(--muted)]/50"
                  )}
                >
                  {s.color && <span className={cn("w-2 h-2 rounded-full", moduleAccent(s.color === "amber" ? "sales" : s.color === "marketing" ? "marketing" : s.color === "service" ? "service" : "service").solid)} style={s.color === "amber" ? { background: "var(--warning)" } : s.color === "purple" ? { background: "oklch(0.55 0.18 290)" } : {}} />}
                  <span className="flex-1">{s.label}</span>
                  {value.status === s.value && <Icon name="Check" size={12} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">ลำดับความสำคัญ</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRIORITY_OPTS.map(p => (
                <button
                  key={p.value}
                  onClick={() => onChange({ priority: p.value })}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium border transition-colors text-left",
                    value.priority === p.value ? "border-[var(--ring)] bg-[var(--muted)]" : "border-[var(--border)] hover:bg-[var(--muted)]/50"
                  )}
                >
                  <span className="flex-1">{p.label}</span>
                  {value.priority === p.value && <Icon name="Check" size={12} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">ช่วงวันที่</p>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="h-9 w-full rounded-md border border-[var(--input)] px-3 text-sm" />
              <input type="date" className="h-9 w-full rounded-md border border-[var(--input)] px-3 text-sm" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">ลูกค้า</p>
            <Select><option>ทุกบริษัท</option><option>Bee Honey Organic Farm</option><option>Charoen Pharma Trading</option></Select>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">ผู้รับผิดชอบ</p>
            <Select><option>ทุกคน</option><option>นิ้ง</option><option>อ้อม</option><option>บอย</option><option>ฟ้า</option></Select>
          </div>
        </div>
        <div className="sticky bottom-0 bg-[var(--card)] border-t border-[var(--border)] p-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClear}><Icon name="RotateCcw" size={14} />ล้างค่า</Button>
          <Button onClick={onClose}>ใช้ตัวกรอง</Button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Job Detail Drawer ---------- */
const JobDetailDrawer = ({ job, onClose, onUpdateStatus, onToggleStep }) => {
  if (!job) return null;
  const { JOB_COMMENTS } = window.CRM_DATA;
  const comments = JOB_COMMENTS.filter(c => c.jobId === job.id);
  const [tab, setTab] = React.useState("workflow");
  const [newComment, setNewComment] = React.useState("");

  const completed = job.steps.filter(s => s.done).length;
  const progress = completed / job.steps.length;

  return (
    <div className="fixed inset-0 z-50 fade-in" style={{ background: "oklch(0 0 0 / 0.4)" }} onClick={onClose}>
      <div className="absolute top-0 right-0 h-full w-full max-w-[920px] bg-[var(--background)] shadow-2xl slide-up overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-[var(--border)] p-5 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[var(--muted-foreground)]">{job.code}</span>
              <Badge tone={statusTone(job.status)} soft dot className="!text-[10px]">{statusLabel(job.status)}</Badge>
              <Badge tone={priorityTone(job.priority)} soft className="!text-[10px]">• {priorityLabel(job.priority)}</Badge>
            </div>
            <h2 className="text-lg font-semibold leading-tight">{job.title}</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              <Icon name="Building2" size={12} className="inline mr-1" />{job.customer}
              <span className="mx-2">·</span>
              <Icon name="FileType2" size={12} className="inline mr-1" />{job.docType}
              <span className="mx-2">·</span>
              <Icon name="Calendar" size={12} className="inline mr-1" />ครบกำหนด {job.dueAt}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Select className="w-40" value={job.status} onChange={(e) => onUpdateStatus(job.id, e.target.value)}>
              {window.CRM_DATA.STATUS_OPTS.filter(s => s.value !== "All").map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
            <Button variant="outline" size="icon"><Icon name="MoreHorizontal" size={15} /></Button>
            <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" size={16} /></Button>
          </div>
        </div>

        {/* Progress strip */}
        <div className="border-b border-[var(--border)] px-5 py-2.5 bg-[var(--muted)]/30 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">ความคืบหน้า · {completed}/{job.steps.length} steps</span>
              <span className="text-xs tabular font-semibold">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
              <div className={cn("h-full transition-all", moduleAccent("service").solid)} style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
          <AssigneesCluster assignees={job.assignees} max={4} />
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3">
          <Tabs value={tab} onChange={setTab} options={[
            { value: "workflow", label: `Workflow (${job.steps.length})`, icon: "ListChecks" },
            { value: "comments", label: `Comments (${comments.length})`, icon: "MessageSquare" },
            { value: "attachments", label: `Attachments (${job.attachments})`, icon: "Paperclip" },
            { value: "activity", label: "Activity", icon: "History" },
          ]} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scroll-thin p-5 fade-in">
          {tab === "workflow" && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{job.template}</h3>
                  <Button variant="outline" size="sm"><Icon name="Plus" size={13} />เพิ่ม step</Button>
                </div>
                <Card>
                  <ol className="divide-y divide-[var(--border)]">
                    {job.steps.map((s, i) => (
                      <li key={s.id} className={cn("flex items-start gap-3 p-3.5 transition-colors hover:bg-[var(--muted)]/40", s.active && "bg-[var(--service-soft)]/40", s.done && "opacity-70")}>
                        <button onClick={() => onToggleStep(job.id, s.id)} className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                          s.done ? "bg-[var(--service)] border-[var(--service)]" :
                          s.active ? "border-[var(--service)] bg-[var(--background)]" :
                          "border-[var(--border)] bg-[var(--background)]")}>
                          {s.done && <Icon name="Check" size={11} style={{ color: "white" }} />}
                          {!s.done && s.active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--service)] pulse-dot" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm leading-tight", s.done && "line-through text-[var(--muted-foreground)]", s.active && "font-medium")}>
                            <span className="text-[var(--muted-foreground)] mr-1.5">{(i + 1).toString().padStart(2, "0")}.</span>
                            {s.name}
                          </p>
                          {s.active && <p className="text-[11px] text-[var(--service-fg)] mt-0.5"><Icon name="ArrowRight" size={9} className="inline" /> กำลังทำ</p>}
                        </div>
                        <Button variant="ghost" size="icon-sm"><Icon name="MoreVertical" size={13} /></Button>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>
              <aside className="space-y-3">
                <Card>
                  <CardHeader><CardTitle className="!text-xs uppercase tracking-wider text-[var(--muted-foreground)]">รายละเอียดงาน</CardTitle></CardHeader>
                  <CardContent className="text-xs space-y-2.5">
                    <div><p className="text-[var(--muted-foreground)]">เทมเพลต</p><p className="font-medium">{job.template}</p></div>
                    <div><p className="text-[var(--muted-foreground)]">ลูกค้า</p><p className="font-medium">{job.customer}</p></div>
                    <div><p className="text-[var(--muted-foreground)]">สร้างเมื่อ</p><p className="font-medium">{job.createdAt}</p></div>
                    <div><p className="text-[var(--muted-foreground)]">ครบกำหนด</p><p className="font-medium">{job.dueAt}</p></div>
                    <Divider />
                    <div>
                      <p className="text-[var(--muted-foreground)] mb-1">ผู้รับผิดชอบ</p>
                      <ul className="space-y-1.5">
                        {job.assignees.map((a, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Avatar name={a.name} size={20} />
                            <span>{a.name}</span>
                            <span className="text-[10px] text-[var(--muted-foreground)]">{a.role}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[var(--service-soft)]/30 border-[var(--service)]/20">
                  <CardContent className="p-3.5 text-xs">
                    <p className="font-medium flex items-center gap-1.5 text-[var(--service-fg)]"><Icon name="Sparkles" size={12} />Auto-created</p>
                    <p className="text-[var(--muted-foreground)] mt-1">งานนี้สร้างอัตโนมัติเมื่ออนุมัติ Proposal และใช้เทมเพลตของสำนักงาน</p>
                  </CardContent>
                </Card>
              </aside>
            </div>
          )}

          {tab === "comments" && (
            <div className="space-y-4">
              <Card>
                <div className="p-3">
                  <Textarea placeholder="พิมพ์ความคิดเห็น... ทีมงานทุกคนเห็น" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm"><Icon name="Paperclip" size={14} /></Button>
                      <Button variant="ghost" size="icon-sm"><Icon name="AtSign" size={14} /></Button>
                    </div>
                    <Button size="sm" disabled={!newComment}><Icon name="Send" size={12} />ส่ง</Button>
                  </div>
                </div>
              </Card>
              <ol className="space-y-3">
                {comments.map(c => (
                  <li key={c.id} className="flex items-start gap-3">
                    <Avatar name={c.by} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{c.by}</p>
                        <span className="text-[11px] text-[var(--muted-foreground)]">{c.at}</span>
                        {c.type === "update" && <Badge tone="marketing" soft className="!text-[10px] !py-0">Update</Badge>}
                        {c.type === "system" && <Badge soft tone="default" className="!text-[10px] !py-0">System</Badge>}
                      </div>
                      <div className={cn("mt-1 p-2.5 rounded-lg text-sm",
                        c.type === "update" ? "bg-[var(--marketing-soft)]/50" :
                        c.type === "system" ? "bg-[var(--muted)] text-[var(--muted-foreground)] italic" :
                        "bg-[var(--muted)]/40"
                      )}>
                        {c.text}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === "attachments" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">{job.attachments} ไฟล์</p>
                <Button variant="outline" size="sm"><Icon name="Upload" size={13} />อัปโหลด</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Array.from({ length: Math.min(job.attachments, 8) }, (_, i) => {
                  const samples = ["หนังสือบริคณห์สนธิ.pdf", "บัตรประชาชนผู้ก่อตั้ง.pdf", "ใบเสร็จค่าน้ำมัน.pdf", "Invoice_นำเข้า_2026-04.xlsx", "Bank Statement.csv", "ภพ.30_template.xlsx", "หนังสือมอบอำนาจ.pdf", "ใบสำคัญแสดงการจดทะเบียน.pdf"];
                  return (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-md border border-[var(--border)] hover:bg-[var(--muted)]/40 cursor-pointer">
                      <div className="h-9 w-9 rounded-md bg-[var(--muted)] flex items-center justify-center"><Icon name={samples[i].endsWith(".xlsx") || samples[i].endsWith(".csv") ? "FileSpreadsheet" : "FileText"} size={15} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{samples[i]}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)]">{(Math.random() * 2 + 0.2).toFixed(1)} MB · {2 + i} วันที่แล้ว</p>
                      </div>
                      <Button variant="ghost" size="icon-sm"><Icon name="Download" size={13} /></Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "activity" && (
            <ol className="relative border-l-2 border-dashed border-[var(--border)] ml-3 space-y-3 pl-5">
              {[
                { i: "Sparkles", t: "สร้างงานอัตโนมัติจาก Proposal PRP-0080", a: job.createdAt, by: "ระบบ" },
                { i: "UserPlus", t: "มอบหมายให้ " + job.assignees.map(a => a.name).join(", "), a: job.createdAt, by: "ระบบ" },
                { i: "Check", t: `Step "${job.steps[0]?.name}" เสร็จแล้ว`, a: "2026-05-12 14:30", by: job.assignees[0]?.name },
                { i: "ArrowRight", t: `เปลี่ยนสถานะเป็น ${statusLabel(job.status)}`, a: "2026-05-15 10:15", by: job.assignees[0]?.name },
                { i: "MessageSquare", t: "เพิ่ม comment", a: comments[0]?.at, by: comments[0]?.by },
              ].map((a, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[34px] top-0.5 w-6 h-6 rounded-full ring-4 ring-[var(--background)] flex items-center justify-center bg-[var(--muted)] text-[var(--muted-foreground)]">
                    <Icon name={a.i} size={12} />
                  </span>
                  <p className="text-sm">{a.t}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{a.by} · {a.a}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Jobs Kanban board ---------- */
const JobsKanban = ({ jobs, onOpenJob, onMoveJob }) => {
  const STATUS_COLUMNS = window.CRM_DATA.STATUS_OPTS.filter(s => s.value !== "All");
  const [dragOver, setDragOver] = React.useState(null);
  const [dragJob, setDragJob] = React.useState(null);

  return (
    <div className="-mx-2 overflow-x-auto scroll-thin">
      <div className="flex gap-3 p-2 min-h-[600px]">
        {STATUS_COLUMNS.map(col => {
          const colJobs = jobs.filter(j => j.status === col.value);
          const isDropTarget = dragOver === col.value && dragJob && dragJob.status !== col.value;
          // Pick badge tone for the column header bar
          const toneColor = col.color === "amber" ? "bg-[var(--warning)]"
            : col.color === "marketing" ? "bg-[var(--marketing)]"
            : col.color === "purple" ? "bg-[oklch(0.55_0.18_290)]"
            : col.color === "service" ? "bg-[var(--service)]"
            : "bg-[oklch(0.5_0.02_240)]";
          return (
            <div key={col.value}
              className={cn("kanban-col flex flex-col h-full min-w-[280px] w-[280px] rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] transition-colors", isDropTarget && "drop-target")}
              onDragOver={(e) => { e.preventDefault(); }}
              onDragEnter={() => setDragOver(col.value)}
              onDrop={(e) => {
                e.preventDefault();
                if (dragJob && dragJob.status !== col.value) onMoveJob(dragJob.id, col.value);
                setDragOver(null);
                setDragJob(null);
              }}
            >
              <div className="p-3 pb-2 flex items-center justify-between border-b border-[var(--border)]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("w-1.5 h-5 rounded-sm shrink-0", toneColor)} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate">{col.label}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">{colJobs.length} งาน</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scroll-thin p-2 space-y-2 min-h-[300px]">
                {colJobs.map(j => {
                  const completed = j.steps.filter(s => s.done).length;
                  const pct = j.steps.length ? completed / j.steps.length : 0;
                  const overdue = new Date(j.dueAt) < new Date("2026-05-17") && j.status !== "Done";
                  return (
                    <div
                      key={j.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", j.id);
                        e.currentTarget.classList.add("dragging");
                        setDragJob(j);
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove("dragging");
                        setDragOver(null);
                        setDragJob(null);
                      }}
                      onClick={() => onOpenJob(j)}
                      className="kanban-card group bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-[0_1px_2px_oklch(0_0_0/0.04)] hover:shadow-md hover:border-[var(--ring)]/40 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold leading-snug line-clamp-2 flex-1">{j.title}</p>
                        <Badge tone={priorityTone(j.priority)} soft className="!text-[10px] !px-1.5 !py-0 shrink-0">{priorityLabel(j.priority)}</Badge>
                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)] font-mono">{j.code}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1.5 truncate">
                        <Icon name="Building2" size={10} className="inline mr-1" />{j.customer}
                      </p>

                      {/* Progress */}
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-[var(--muted-foreground)]">Progress</span>
                          <span className="tabular font-medium">{completed}/{j.steps.length} · {Math.round(pct * 100)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
                          <div className={cn("h-full", j.status === "Done" ? moduleAccent("service").solid : moduleAccent(pct > 0.6 ? "service" : "sales").solid)} style={{ width: `${pct * 100}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--border)]">
                        <div className={cn("flex items-center gap-1 text-[11px]", overdue ? "text-[var(--destructive)] font-medium" : "text-[var(--muted-foreground)]")}>
                          <Icon name="Calendar" size={11} />{j.dueAt}
                          {overdue && <Icon name="AlertCircle" size={10} />}
                        </div>
                        <AssigneesCluster assignees={j.assignees} max={3} />
                      </div>
                    </div>
                  );
                })}
                {colJobs.length === 0 && (
                  <div className="text-center text-xs text-[var(--muted-foreground)] py-6 border border-dashed border-[var(--border)] rounded-md">
                    ลากการ์ดมาที่นี่
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Main page ---------- */
const ServicePage = ({ onNavigate, sharedState }) => {
  const [jobs, setJobs] = React.useState(sharedState.jobs);
  React.useEffect(() => { setJobs(sharedState.jobs); }, [sharedState.jobs]);

  const [tab, setTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState({ status: "All", priority: "All" });
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [openJob, setOpenJob] = React.useState(null);
  const [selected, setSelected] = React.useState(new Set());
  const [showCreate, setShowCreate] = React.useState(false);
  const [showBulkStatus, setShowBulkStatus] = React.useState(false);
  const [view, setView] = React.useState("table"); // 'table' | 'kanban'
  const toast = useToast();

  const filtered = jobs.filter(j => {
    if (tab === "my") {
      if (!j.assignees.some(a => a.name === "นิ้ง")) return false;
    } else if (tab === "done") {
      if (j.status !== "Done") return false;
    } else if (tab === "closed") {
      if (j.status !== "Cancel") return false;
    }
    if (filters.status !== "All" && j.status !== filters.status) return false;
    if (filters.priority !== "All" && j.priority !== filters.priority) return false;
    if (search && !(
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.code.toLowerCase().includes(search.toLowerCase()) ||
      j.customer.toLowerCase().includes(search.toLowerCase())
    )) return false;
    return true;
  });

  const updateJob = (id, patch) => {
    sharedState.setJobs(js => js.map(j => j.id === id ? { ...j, ...patch } : j));
  };

  const toggleStep = (jobId, stepId) => {
    sharedState.setJobs(js => js.map(j => {
      if (j.id !== jobId) return j;
      const newSteps = j.steps.map(s => s.id === stepId ? { ...s, done: !s.done, active: false } : s);
      // mark next undone as active
      const firstUndone = newSteps.find(s => !s.done);
      if (firstUndone) firstUndone.active = true;
      const completed = newSteps.filter(s => s.done).length;
      return { ...j, steps: newSteps, progress: completed / newSteps.length };
    }));
  };

  const toggleSelect = (id) => {
    setSelected(s => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(j => j.id)));
  };

  const tabs = [
    { value: "all", label: "งานทั้งหมด", icon: "Users", count: jobs.length },
    { value: "my", label: "งานของฉัน", icon: "User", count: jobs.filter(j => j.assignees.some(a => a.name === "นิ้ง")).length },
    { value: "done", label: "เสร็จแล้ว", icon: "BookmarkCheck", count: jobs.filter(j => j.status === "Done").length },
    { value: "closed", label: "ปิดแล้ว", icon: "BookmarkX", count: jobs.filter(j => j.status === "Cancel").length },
  ];

  return (
    <div className="space-y-5">
      {/* Header matching old Cases page */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("inline-block w-1.5 h-7 rounded-sm", moduleAccent("service").solid)} />
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight">จัดการงาน</h1>
            <p className="text-sm text-[var(--muted-foreground)]">จัดการงานเอกสาร · ติดตามสถานะ · มอบหมายงาน — รวมกับ Service Operation ของ CRM</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline"><Icon name="UserCog" size={14} />เพิ่มผู้รับผิดชอบหลายคน</Button>
          <Button variant="service" onClick={() => setShowCreate(true)}><Icon name="Plus" size={14} />เพิ่มงานใหม่</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="งานทั้งหมด" value={jobs.length} icon="Briefcase" accent="service" />
        <Stat label="ใกล้ครบกำหนด (≤3 วัน)" value={jobs.filter(j => new Date(j.dueAt) - new Date("2026-05-17") < 4 * 86400000 && j.status !== "Done").length} icon="AlarmClock" accent="sales" />
        <Stat label="เสร็จเดือนนี้" value={jobs.filter(j => j.status === "Done").length} icon="CheckCheck" accent="service" delta="+5" deltaTone="service" />
        <Stat label="Auto-created จาก Proposal" value={jobs.length} icon="Sparkles" accent="service" />
      </div>

      {/* Tabs + bulk action */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--muted)] border border-[var(--border)] overflow-x-auto scroll-thin">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); setSelected(new Set()); }}
              className={cn(
                "px-3 h-8 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap",
                tab === t.value
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-[0_1px_2px_oklch(0_0_0/0.06)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded tabular font-semibold", tab === t.value ? "bg-[var(--muted)]" : "bg-[var(--background)]/60")}>{t.count}</span>
            </button>
          ))}
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--service-soft)] border border-[var(--service)]/30 fade-in">
            <span className="text-sm font-medium text-[var(--service-fg)]">เลือก {selected.size} รายการ</span>
            <Button size="sm" variant="service" onClick={() => setShowBulkStatus(true)}><Icon name="RefreshCw" size={12} />อัปเดทสถานะ</Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>ยกเลิก</Button>
          </div>
        )}
      </div>

      {/* Search + filter + view toggle */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <Input className="flex-1" icon={<Icon name="Search" size={14} />} placeholder="ค้นหาด้วย รหัส, ชื่องาน, หรือชื่อลูกค้า..." value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="outline" onClick={() => setFilterOpen(true)}>
          <Icon name="Filter" size={14} />ตัวกรองการค้นหา
          {(filters.status !== "All" || filters.priority !== "All") && (
            <span className="ml-1 inline-block h-4 w-4 rounded-full bg-[var(--service)] text-white text-[10px] font-bold leading-4 text-center">
              {[filters.status, filters.priority].filter(v => v !== "All").length}
            </span>
          )}
        </Button>
        <Tabs value={view} onChange={setView} options={[
          { value: "table", label: "Table", icon: "Table" },
          { value: "kanban", label: "Kanban", icon: "Kanban" },
        ]} />
      </div>

      {/* Body — Table or Kanban */}
      {view === "kanban" ? (
        <JobsKanban
          jobs={filtered}
          onOpenJob={setOpenJob}
          onMoveJob={(id, status) => { updateJob(id, { status }); toast({ title: "เปลี่ยนสถานะ", description: `→ ${statusLabel(status)}`, tone: "service", icon: "ArrowRight" }); }}
        />
      ) : (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/50">
              <tr className="border-b border-[var(--border)]">
                <th className="px-3 py-2.5 w-10">
                  <input type="checkbox" className="rounded" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="text-left font-medium px-3 py-2.5 w-12">#</th>
                <th className="text-left font-medium px-3 py-2.5 w-32">Code</th>
                <th className="text-left font-medium px-3 py-2.5">ชื่องาน / เอกสาร</th>
                <th className="text-left font-medium px-3 py-2.5">ลูกค้า</th>
                <th className="text-left font-medium px-3 py-2.5">ผู้รับผิดชอบ</th>
                <th className="text-left font-medium px-3 py-2.5">สถานะ</th>
                <th className="text-left font-medium px-3 py-2.5 w-28">Progress</th>
                <th className="text-left font-medium px-3 py-2.5">ความสำคัญ</th>
                <th className="text-left font-medium px-3 py-2.5">วันสิ้นสุด</th>
                <th className="px-3 py-2.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j, i) => {
                const completed = j.steps.filter(s => s.done).length;
                const pct = completed / j.steps.length;
                const overdue = new Date(j.dueAt) < new Date("2026-05-17") && j.status !== "Done";
                const isSelected = selected.has(j.id);
                return (
                  <tr key={j.id}
                    className={cn("border-b border-[var(--border)] last:border-0 cursor-pointer row-pad transition-colors", isSelected ? "bg-[var(--service-soft)]/40" : "hover:bg-[var(--muted)]/40")}
                    onClick={() => setOpenJob(j)}
                  >
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded" checked={isSelected} onChange={() => toggleSelect(j.id)} />
                    </td>
                    <td className="px-3 py-3 text-[var(--muted-foreground)] text-xs">{i + 1}</td>
                    <td className="px-3 py-3 font-mono text-xs">{j.code}</td>
                    <td className="px-3 py-3 max-w-[280px]">
                      <p className="font-medium leading-snug">{j.title}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{j.docType}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs">{j.customer}</p>
                    </td>
                    <td className="px-3 py-3"><AssigneesCluster assignees={j.assignees} /></td>
                    <td className="px-3 py-3"><Badge tone={statusTone(j.status)} soft dot className="!text-[10px]">{statusLabel(j.status)}</Badge></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[var(--muted)] overflow-hidden min-w-[40px]">
                          <div className={cn("h-full", j.status === "Done" ? moduleAccent("service").solid : moduleAccent(pct > 0.6 ? "service" : "sales").solid)} style={{ width: `${pct * 100}%` }} />
                        </div>
                        <span className="text-[11px] tabular text-[var(--muted-foreground)] w-8 text-right">{Math.round(pct * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3"><Badge tone={priorityTone(j.priority)} soft className="!text-[10px]">• {priorityLabel(j.priority)}</Badge></td>
                    <td className="px-3 py-3">
                      <div className={cn("flex items-center gap-1 text-xs", overdue && "text-[var(--destructive)] font-medium")}>
                        <Icon name="Calendar" size={11} />{j.dueAt}
                        {overdue && <Icon name="AlertCircle" size={11} />}
                      </div>
                    </td>
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon-sm"><Icon name="MoreHorizontal" size={14} /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <Empty icon="ClipboardList" title="ไม่พบงานตามเงื่อนไข" hint="ลองล้างตัวกรอง หรือเปลี่ยน tab" />}
        <div className="flex items-center justify-between p-3 border-t border-[var(--border)] bg-[var(--muted)]/30">
          <span className="text-xs text-[var(--muted-foreground)]">แสดง 1–{filtered.length} จาก {jobs.length} รายการ</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" disabled><Icon name="ChevronLeft" size={14} /></Button>
            <span className="text-xs px-2 tabular">หน้า 1 / 1</span>
            <Button variant="outline" size="icon-sm" disabled><Icon name="ChevronRight" size={14} /></Button>
          </div>
        </div>
      </Card>
      )}
      {/* Detail drawer */}
      <JobDetailDrawer
        job={openJob}
        onClose={() => setOpenJob(null)}
        onUpdateStatus={(id, status) => {
          updateJob(id, { status });
          setOpenJob(j => j ? { ...j, status } : null);
          toast({ title: "เปลี่ยนสถานะ", description: `→ ${statusLabel(status)}`, tone: "service", icon: "ArrowRight" });
        }}
        onToggleStep={(jobId, stepId) => {
          toggleStep(jobId, stepId);
          setOpenJob(j => {
            if (!j || j.id !== jobId) return j;
            const newSteps = j.steps.map(s => s.id === stepId ? { ...s, done: !s.done, active: false } : s);
            const firstUndone = newSteps.find(s => !s.done);
            if (firstUndone) firstUndone.active = true;
            return { ...j, steps: newSteps };
          });
        }}
      />

      {/* Filter panel */}
      <ServiceFilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={filters}
        onChange={(patch) => setFilters(f => ({ ...f, ...patch }))}
        onClear={() => setFilters({ status: "All", priority: "All" })}
      />

      {/* Create modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="เพิ่มงานใหม่"
        description="สร้างจากเทมเพลตหรือเขียนเอง"
        footer={<>
          <Button variant="outline" onClick={() => setShowCreate(false)}>ยกเลิก</Button>
          <Button variant="service" onClick={() => { setShowCreate(false); toast({ title: "สร้างงานใหม่สำเร็จ", tone: "service" }); }}><Icon name="Plus" size={13} />สร้างงาน</Button>
        </>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { i: "FileSignature", l: "Template", d: "ใช้เทมเพลตงาน" },
              { i: "PenLine", l: "Manual", d: "เขียนเอง" },
            ].map((o, i) => (
              <button key={o.l} className={cn("text-left p-4 rounded-lg border-2 hover:bg-[var(--muted)]/40", i === 0 ? "border-[var(--service)] bg-[var(--service-soft)]/30" : "border-[var(--border)]")}>
                <Icon name={o.i} size={20} className="text-[var(--service-fg)]" />
                <p className="font-medium mt-2">{o.l}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{o.d}</p>
              </button>
            ))}
          </div>
          <Divider />
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">เลือกเทมเพลต</label>
            <Select>
              <option>งานจดบริษัท (Company Registration v3)</option>
              <option>งานบัญชีรายเดือน (Monthly Bookkeeping)</option>
              <option>งานตรวจสอบบัญชี (Annual Audit)</option>
              <option>ระบบเงินเดือน (Payroll Setup)</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">ลูกค้า</label>
              <Select>{window.CRM_DATA.CUSTOMERS.map(c => <option key={c.id}>{c.company}</option>)}</Select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">วันครบกำหนด</label>
              <input type="date" className="h-9 w-full rounded-md border border-[var(--input)] px-3 text-sm" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Bulk status modal */}
      <Modal
        open={showBulkStatus}
        onClose={() => setShowBulkStatus(false)}
        title={`อัปเดทสถานะ ${selected.size} รายการ`}
        size="sm"
        footer={<>
          <Button variant="outline" onClick={() => setShowBulkStatus(false)}>ย้อนกลับ</Button>
          <Button variant="service" onClick={() => {
            setShowBulkStatus(false);
            setSelected(new Set());
            toast({ title: "อัปเดทสำเร็จ", description: `${selected.size} รายการ`, tone: "service" });
          }}>อัปเดทสถานะ</Button>
        </>}
      >
        <div className="space-y-2">
          {window.CRM_DATA.STATUS_OPTS.filter(s => s.value !== "All" && s.value !== "Cancel").map(s => (
            <label key={s.value} className="flex items-center gap-2 p-2.5 rounded-md border border-[var(--border)] hover:bg-[var(--muted)]/40 cursor-pointer">
              <input type="radio" name="bulk-status" />
              <Badge tone={s.color} soft dot>{s.label}</Badge>
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
};

Object.assign(window, { CustomersPageCRM, ServicePage, JobWorkflowCard });
