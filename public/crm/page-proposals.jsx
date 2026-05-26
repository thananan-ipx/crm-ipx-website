/* ============================================
   Proposal Management — Draft → Sent → Approved
   ============================================ */

const propStatusTone = (s) => ({ Draft: "default", Sent: "marketing", Approved: "service", Rejected: "rose" }[s] || "default");
const propStatusLabel = (s) => ({ Draft: "ร่าง", Sent: "ส่งแล้ว", Approved: "อนุมัติ", Rejected: "ปฏิเสธ" }[s] || s);

/* ---------- Proposal Detail (read-only, mirrors builder layout) ---------- */
const ProposalDetail = ({ proposal: p }) => {
  const { PACKAGE_TIERS, PACKAGE_ITEMS, LEADS } = window.CRM_DATA;
  const tier = PACKAGE_TIERS.find(t => t.id === p.tierId);
  const lead = LEADS.find(l => l.id === p.leadId);

  const monthlyPrice = p.monthlyPrice || 0;
  const annualBase = monthlyPrice * 12;
  const annualDiscountAmt = Math.round(annualBase * (p.annualDiscountPct || 0) / 100);
  const annualAfterDiscount = annualBase - annualDiscountAmt;
  const oneTimeTotal = (p.addons || []).reduce((s, a) => s + (a.price || 0), 0);
  const isAnnual = p.billingMode === "annual";
  const yearTotal = (isAnnual ? annualAfterDiscount : annualBase) + oneTimeTotal;

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn("h-11 w-11 rounded-lg flex items-center justify-center font-bold text-lg shrink-0", moduleAccent("sales").soft, moduleAccent("sales").fg)}>
            {p.company[0]}
          </div>
          <div>
            <p className="font-semibold text-lg leading-tight">{p.company}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              <span className="font-mono">{p.id}</span> · สร้าง {p.createdAt} · เจ้าของ {p.owner}
            </p>
            {lead && (
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                <Icon name="Magnet" size={10} className="inline" /> จาก Lead <span className="font-mono">{p.leadId}</span> · {lead.contact}
              </p>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <Badge tone={propStatusTone(p.status)} soft dot>{propStatusLabel(p.status)}</Badge>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
            <Icon name={isAnnual ? "CalendarCheck2" : "CalendarDays"} size={10} className="inline" />
            {" "}{isAnnual ? "ชำระรายปี" : "ชำระรายเดือน"}
          </p>
        </div>
      </div>

      <Divider />

      {/* Tier card */}
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

      {/* Add-ons */}
      {p.addons && p.addons.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-2">Add-ons ({p.addons.length})</p>
          <div className="space-y-1.5">
            {p.addons.map(a => (
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

      {/* Billing breakdown */}
      <Card className="!shadow-none">
        <div className="p-3.5 space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">สรุปยอด</p>
            <Badge tone={isAnnual ? "service" : "sales"} soft className="!text-[10px]">
              <Icon name={isAnnual ? "CalendarCheck2" : "CalendarDays"} size={10} />
              {isAnnual ? "รายปี" : "รายเดือน"}
            </Badge>
          </div>

          {isAnnual ? (
            <>
              <div className="flex items-center justify-between">
                <span>{tier?.label || "Package"} × 12 เดือน</span>
                <span className="tabular text-[var(--muted-foreground)]">฿{annualBase.toLocaleString()}</span>
              </div>
              {p.annualDiscountPct > 0 && (
                <div className="flex items-center justify-between text-[var(--service-fg)]">
                  <span>ส่วนลดรายปี ({p.annualDiscountPct}%)</span>
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
              <span>Add-ons ({p.addons.length}) — ครั้งเดียว</span>
              <span className="tabular">฿{oneTimeTotal.toLocaleString()}</span>
            </div>
          )}

          <Divider />

          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-[11px] text-[var(--muted-foreground)]">รวมทั้งหมด</p>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                {isAnnual ? "เก็บครั้งเดียวต้นปี" : `เก็บทุกเดือน ฿${monthlyPrice.toLocaleString()} (+ add-on ครั้งเดียว)`}
              </p>
            </div>
            <p className="text-2xl font-bold tabular text-[var(--sales-fg)]">฿{yearTotal.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button variant="outline" size="sm"><Icon name="Download" size={13} />ดาวน์โหลด PDF</Button>
        <Button variant="outline" size="sm"><Icon name="Mail" size={13} />ส่งอีเมลซ้ำ</Button>
        <Button variant="outline" size="sm"><Icon name="Copy" size={13} />Duplicate Proposal</Button>
        <Button variant="outline" size="sm"><Icon name="Edit2" size={13} />แก้ไข</Button>
      </div>
    </div>
  );
};

/* ---------- Proposal Builder (Tier picker + add-ons) ---------- */
const ProposalBuilder = ({ leads, defaultLeadId }) => {
  const { PACKAGE_ITEMS, PACKAGE_TIERS, ONE_TIME_SERVICES, PACKAGE_ADDONS } = window.CRM_DATA || {};

  // Guard against data not loaded
  if (!PACKAGE_TIERS || !ONE_TIME_SERVICES || !PACKAGE_ADDONS) {
    return <div className="p-6 text-center text-sm text-[var(--muted-foreground)]">กำลังโหลดข้อมูลแพ็กเกจ...</div>;
  }
  const [leadId, setLeadId] = React.useState(defaultLeadId || leads[0]?.id || "");

  // Proposal type — 'package' (recurring) or 'one_time' (registration etc.)
  const [proposalType, setProposalType] = React.useState("package");

  // ---- Package state ----
  const [tierId, setTierId] = React.useState(PACKAGE_TIERS[1].id); // default Tier 2
  const tier = PACKAGE_TIERS.find(t => t.id === tierId) || PACKAGE_TIERS[0];
  const [monthlyPrice, setMonthlyPrice] = React.useState(tier.priceMin);
  const [billingMode, setBillingMode] = React.useState("monthly");
  const [annualDiscountPct, setAnnualDiscountPct] = React.useState(10);
  const [advisoryAddons, setAdvisoryAddons] = React.useState({});

  React.useEffect(() => {
    const t = PACKAGE_TIERS.find(t => t.id === tierId);
    if (t) setMonthlyPrice(Math.round((t.priceMin + t.priceMax) / 2 / 500) * 500);
  }, [tierId]);

  const toggleAdvisory = (a) => {
    setAdvisoryAddons(s => {
      const next = { ...s };
      if (next[a.id]) delete next[a.id];
      else next[a.id] = { price: a.custom ? 0 : a.priceMin };
      return next;
    });
  };
  const setAdvisoryPrice = (id, price) => setAdvisoryAddons(s => ({ ...s, [id]: { ...s[id], price } }));

  // ---- One-time state ----
  const [otService, setOtService] = React.useState(ONE_TIME_SERVICES[0].id);
  const otSvc = ONE_TIME_SERVICES.find(s => s.id === otService) || ONE_TIME_SERVICES[0];
  const [otPrice, setOtPrice] = React.useState(otSvc.priceMin);
  React.useEffect(() => {
    const s = ONE_TIME_SERVICES.find(x => x.id === otService);
    if (s) setOtPrice(Math.round((s.priceMin + s.priceMax) / 2 / 500) * 500);
  }, [otService]);

  // ---- Computed totals ----
  const advisoryTotal = Object.entries(advisoryAddons).reduce((sum, [id, info]) => sum + (info.price || 0), 0);
  const monthlyTotal = monthlyPrice;
  const annualBase = monthlyTotal * 12;
  const annualDiscountAmt = Math.round(annualBase * annualDiscountPct / 100);
  const annualPriceAfterDiscount = annualBase - annualDiscountAmt;
  const pkgYearTotal = (billingMode === "annual" ? annualPriceAfterDiscount : annualBase) + advisoryTotal;
  return (
    <div className="space-y-4">
      {/* Lead selector */}
      <div>
        <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">Lead / บริษัท</label>
        <Select value={leadId} onChange={e => setLeadId(e.target.value)}>
          <option value="">เลือก Lead...</option>
          {leads.map(l => <option key={l.id} value={l.id}>{l.company}</option>)}
        </Select>
      </div>

      <Divider />

      {/* Tier picker */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">เลือกแพ็กเกจ (ราคารายเดือน)</p>
          <Badge tone="sales" soft className="!text-[10px]">รายเดือน</Badge>
        </div>
        <div className="space-y-1.5">
          {PACKAGE_TIERS.map(t => {
            const selected = tierId === t.id;
            return (
              <button key={t.id} onClick={() => setTierId(t.id)}
                className={cn("w-full text-left p-3 rounded-md border-2 transition-all",
                  selected ? "border-[var(--sales)] bg-[var(--sales-soft)]/40" : "border-[var(--border)] hover:bg-[var(--muted)]/40"
                )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                      selected ? "border-[var(--sales)] bg-[var(--sales)]" : "border-[var(--border)]"
                    )}>
                      {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold", selected && "text-[var(--sales-fg)]")}>{t.label}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{t.desc}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {t.items.map(itemId => (
                          <span key={itemId} className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                            selected ? "bg-[var(--sales)]/15 text-[var(--sales-fg)]" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          )}>#{itemId} {PACKAGE_ITEMS.find(p => p.id === itemId)?.label.slice(0, 18)}{(PACKAGE_ITEMS.find(p => p.id === itemId)?.label.length || 0) > 18 ? "..." : ""}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-sm font-semibold tabular", selected ? "text-[var(--sales-fg)]" : "text-[var(--foreground)]")}>
                      ฿{t.priceMin.toLocaleString()} – {t.priceMax.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">/เดือน</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price slider within tier */}
      <div className="p-3 rounded-md bg-[var(--sales-soft)]/40 border border-[var(--sales)]/20">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[var(--sales-fg)]">ปรับราคาภายในช่วง</p>
          <p className="text-2xl font-bold tabular text-[var(--sales-fg)]">฿{monthlyPrice.toLocaleString()}<span className="text-xs font-normal opacity-70">/เดือน</span></p>
        </div>
        <input
          type="range"
          min={tier.priceMin}
          max={tier.priceMax}
          step={500}
          value={monthlyPrice}
          onChange={e => setMonthlyPrice(parseInt(e.target.value))}
          className="w-full accent-[var(--sales)]"
        />
        <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] tabular mt-1">
          <span>฿{tier.priceMin.toLocaleString()}</span>
          <span>฿{tier.priceMax.toLocaleString()}</span>
        </div>
      </div>

      <Divider />

      {/* Billing frequency selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">ประเภทการชำระ</p>
          {billingMode === "annual" && (
            <Badge tone="service" soft className="!text-[10px]"><Icon name="Sparkles" size={9} />ลดทันที {annualDiscountPct}%</Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { v: "monthly", l: "ชำระรายเดือน", d: "เก็บค่าบริการทุกเดือน", i: "CalendarDays" },
            { v: "annual",  l: "ชำระรายปี",   d: `ชำระล่วงหน้า 12 เดือน · ลด ${annualDiscountPct}%`, i: "CalendarCheck2" },
          ].map(opt => {
            const sel = billingMode === opt.v;
            return (
              <button key={opt.v} onClick={() => setBillingMode(opt.v)}
                className={cn("text-left p-3 rounded-md border-2 transition-all",
                  sel ? "border-[var(--sales)] bg-[var(--sales-soft)]/40" : "border-[var(--border)] hover:bg-[var(--muted)]/40"
                )}>
                <div className="flex items-start gap-2.5">
                  <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    sel ? "border-[var(--sales)] bg-[var(--sales)]" : "border-[var(--border)]"
                  )}>
                    {sel && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Icon name={opt.i} size={13} className={sel ? "text-[var(--sales-fg)]" : "text-[var(--muted-foreground)]"} />
                      <p className={cn("text-sm font-semibold", sel && "text-[var(--sales-fg)]")}>{opt.l}</p>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{opt.d}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {billingMode === "annual" && (
          <div className="mt-2 p-2.5 rounded bg-[var(--service-soft)]/50 border border-[var(--service)]/30 flex items-center gap-2">
            <Icon name="Percent" size={13} className="text-[var(--service-fg)]" />
            <span className="text-[11px] text-[var(--service-fg)]">ส่วนลดรายปี</span>
            <input
              type="range"
              min={0} max={20} step={1}
              value={annualDiscountPct}
              onChange={e => setAnnualDiscountPct(parseInt(e.target.value))}
              className="flex-1 accent-[var(--service)]"
            />
            <span className="text-sm font-semibold tabular text-[var(--service-fg)] w-8 text-right">{annualDiscountPct}%</span>
          </div>
        )}
      </div>

      <Divider />

      {/* Add-ons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Add-ons (เลือกเพิ่มได้)</p>
          <Badge tone="default" soft className="!text-[10px]">ครั้งเดียว / Advisory</Badge>
        </div>
        <div className="space-y-1.5">
          {ADDONS.map(a => {
            const selected = !!addons[a.id];
            const isCustom = a.custom;
            return (
              <div key={a.id} className={cn("rounded-md border transition-all",
                selected ? "border-[var(--service)] bg-[var(--service-soft)]/30" : "border-[var(--border)]"
              )}>
                <label className="flex items-start gap-2.5 p-3 cursor-pointer">
                  <input type="checkbox" checked={selected} onChange={() => toggleAddon(a)}
                    className="mt-1 rounded accent-[var(--service)]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-medium">{a.label}</p>
                        {a.autoCreatesJob && <Badge tone="service" soft className="!text-[10px] !py-0"><Icon name="Sparkles" size={9} />Auto-job</Badge>}
                        {isCustom && <Badge tone="amber" soft className="!text-[10px] !py-0">Custom</Badge>}
                      </div>
                      <p className="text-xs tabular text-[var(--muted-foreground)] shrink-0">
                        {isCustom ? "พิจารณาตามเหมาะสม"
                          : `฿${a.priceMin.toLocaleString()} – ${a.priceMax.toLocaleString()}`}
                      </p>
                    </div>
                    {a.note && <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{a.note}</p>}
                  </div>
                </label>
                {selected && (
                  <div className="px-3 pb-3 pt-1 border-t border-[var(--border)]/60">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--muted-foreground)] shrink-0">ราคา:</span>
                      <span className="text-[11px] text-[var(--muted-foreground)]">฿</span>
                      <input
                        type="number"
                        value={addons[a.id].price}
                        onChange={e => setAddonPrice(a.id, parseInt(e.target.value) || 0)}
                        className="h-7 w-32 rounded border border-[var(--input)] px-2 text-sm tabular"
                        placeholder={isCustom ? "กรอกราคาเอง" : "0"}
                        min="0"
                      />
                      {!isCustom && (
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => setAddonPrice(a.id, a.priceMin)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)] hover:bg-[var(--accent)]">ต่ำสุด</button>
                          <button onClick={() => setAddonPrice(a.id, a.priceMax)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)] hover:bg-[var(--accent)]">สูงสุด</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <Card className="!shadow-none border-[var(--sales)]/40">
        <div className="p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--sales-fg)]">สรุปยอด Proposal</p>
            <Badge tone={billingMode === "annual" ? "service" : "sales"} soft className="!text-[10px]">
              <Icon name={billingMode === "annual" ? "CalendarCheck2" : "CalendarDays"} size={10} />
              {billingMode === "annual" ? "รายปี" : "รายเดือน"}
            </Badge>
          </div>

          {billingMode === "monthly" ? (
            <div className="flex items-center justify-between text-sm">
              <span>{tier.label} ({tier.items.map(i => `#${i}`).join(" + ")})</span>
              <span className="font-medium tabular">฿{monthlyTotal.toLocaleString()}/เดือน × 12</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span>{tier.label} (×12 เดือน)</span>
                <span className="tabular text-[var(--muted-foreground)]">฿{annualBase.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-[var(--service-fg)]">
                <span>ส่วนลดรายปี ({annualDiscountPct}%)</span>
                <span className="tabular font-medium">- ฿{annualDiscountAmt.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span>รวมค่าบริการรายปี</span>
                <span className="tabular">฿{annualPriceAfterDiscount.toLocaleString()}</span>
              </div>
            </>
          )}

          {Object.keys(addons).length > 0 && (
            <>
              <Divider />
              {Object.entries(addons).map(([aid, info]) => {
                const a = ADDONS.find(x => x.id === aid);
                return (
                  <div key={aid} className="flex items-center justify-between text-sm">
                    <span>+ {a.label}</span>
                    <span className="font-medium tabular">{info.price ? `฿${info.price.toLocaleString()}` : "TBD"} ครั้งเดียว</span>
                  </div>
                );
              })}
            </>
          )}
          <Divider />
          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {billingMode === "annual"
                  ? "รวมรายปีล่วงหน้า + add-on ครั้งเดียว"
                  : "รวมรายเดือน × 12 + add-on ครั้งเดียว"}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                เก็บค่าบริการ {billingMode === "annual" ? "ครั้งเดียวต้นปี" : "ทุกเดือน " + monthlyTotal.toLocaleString() + " บาท"}
              </p>
            </div>
            <p className="text-2xl font-bold tabular text-[var(--sales-fg)]">฿{yearTotal.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ProposalsPage = ({ onNavigate, sharedState }) => {
  const { PROPOSALS, LEADS } = window.CRM_DATA;
  const [proposals, setProposals] = React.useState(sharedState.proposals);
  const [open, setOpen] = React.useState(null);
  const [approveTarget, setApproveTarget] = React.useState(null);
  const toast = useToast();

  React.useEffect(() => { setProposals(sharedState.proposals); }, [sharedState.proposals]);

  const updateStatus = (id, status) => {
    sharedState.setProposals(ps => ps.map(p => p.id === id ? { ...p, status } : p));
  };

  const approve = (proposal) => {
    updateStatus(proposal.id, "Approved");
    setApproveTarget(null);
    // Auto-create customer + jobs
    sharedState.convertToCustomer(proposal);
    toast({
      title: "อนุมัติ Proposal สำเร็จ",
      description: `สร้าง Customer Profile + งาน ${proposal.services.filter(s => SERVICE_CATALOG.find(c => c.label.includes(s.split(" ")[0]))?.autoCreatesJob).length || proposal.services.length} งานอัตโนมัติ`,
      tone: "service",
      icon: "Sparkles",
    });
  };

  const grouped = {
    Draft: proposals.filter(p => p.status === "Draft"),
    Sent: proposals.filter(p => p.status === "Sent"),
    Approved: proposals.filter(p => p.status === "Approved"),
    Rejected: proposals.filter(p => p.status === "Rejected"),
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Proposal Management" subtitle="ผู้บริหารอนุมัติราคาตามมาตรฐาน · เมื่ออนุมัติแล้วสร้าง Customer + งาน Service อัตโนมัติ" accent="sales">
        <Button variant="outline" size="sm"><Icon name="FileSpreadsheet" size={14} />ราคากลาง</Button>
        <Button variant="sales" size="sm" onClick={() => setOpen({ new: true })}><Icon name="Plus" size={14} />สร้าง Proposal</Button>
      </PageHeader>

      {/* Status strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { k: "Draft", l: "ร่าง", t: "default", i: "FileText" },
          { k: "Sent", l: "ส่งแล้ว / รอลูกค้า", t: "marketing", i: "Send" },
          { k: "Approved", l: "อนุมัติ", t: "service", i: "CheckCheck" },
          { k: "Rejected", l: "ปฏิเสธ", t: "rose", i: "XCircle" },
        ].map(s => (
          <Card key={s.k}>
            <CardContent className="p-4 pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">{s.l}</p>
                  <p className="text-2xl font-semibold mt-1 tabular">{grouped[s.k].length}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-1">฿{grouped[s.k].reduce((a, p) => a + p.total, 0).toLocaleString()}</p>
                </div>
                <Badge tone={s.t} soft className="!text-[10px]"><Icon name={s.i} size={11} />{s.l}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/50">
              <tr className="border-b border-[var(--border)]">
                <th className="text-left font-medium px-3 py-2.5">เลขที่</th>
                <th className="text-left font-medium px-3 py-2.5">บริษัท / Lead</th>
                <th className="text-left font-medium px-3 py-2.5">บริการ</th>
                <th className="text-right font-medium px-3 py-2.5">ยอดรวม/ปี</th>
                <th className="text-left font-medium px-3 py-2.5">สถานะ</th>
                <th className="text-left font-medium px-3 py-2.5">วันที่</th>
                <th className="text-left font-medium px-3 py-2.5">ผู้รับผิดชอบ</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {proposals.map(p => (
                <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/40 row-pad">
                  <td className="px-3 py-2.5"><span className="font-mono text-xs text-[var(--muted-foreground)]">{p.id}</span></td>
                  <td className="px-3 py-2.5"><p className="font-medium">{p.company}</p><p className="text-xs text-[var(--muted-foreground)]">{p.leadId}</p></td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {p.services.map(s => <Badge key={s} soft tone="default" className="!text-[10px]">{s}</Badge>)}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular font-semibold">฿{p.total.toLocaleString()}</td>
                  <td className="px-3 py-2.5"><Badge tone={propStatusTone(p.status)} soft dot>{propStatusLabel(p.status)}</Badge></td>
                  <td className="px-3 py-2.5 text-xs text-[var(--muted-foreground)]">{p.createdAt}</td>
                  <td className="px-3 py-2.5"><Avatar name={p.owner} size={22} /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      {p.status === "Draft" && (
                        <Button variant="outline" size="sm" onClick={() => { updateStatus(p.id, "Sent"); toast({ title: "ส่ง Proposal แล้ว", tone: "marketing", icon: "Send" }); }}>
                          <Icon name="Send" size={12} />ส่ง
                        </Button>
                      )}
                      {p.status === "Sent" && (
                        <Button variant="service" size="sm" onClick={() => setApproveTarget(p)}>
                          <Icon name="Check" size={12} />อนุมัติ
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(p)}><Icon name="Eye" size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Approval dialog */}
      <Modal
        open={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        title={`อนุมัติ Proposal ${approveTarget?.id}`}
        description="ผู้บริหารอนุมัติราคาตามมาตรฐานข้อมูลและราคากลางของบริษัท"
        size="lg"
        footer={<>
          <Button variant="outline" onClick={() => setApproveTarget(null)}>ยกเลิก</Button>
          <Button variant="ghost" className="text-[var(--destructive)]" onClick={() => { updateStatus(approveTarget.id, "Rejected"); setApproveTarget(null); toast({ title: "ปฏิเสธ", tone: "default" }); }}><Icon name="X" size={14} />ปฏิเสธ</Button>
          <Button variant="service" onClick={() => approve(approveTarget)}><Icon name="CheckCheck" size={14} />อนุมัติและสร้างงาน</Button>
        </>}
      >
        {approveTarget && (
          <div className="space-y-4">
            {/* Full proposal detail */}
            <ProposalDetail proposal={approveTarget} />

            <Divider />

            <div className="rounded-lg border border-[var(--service)]/30 bg-[var(--service-soft)] p-4">
              <p className="text-sm font-semibold flex items-center gap-2 text-[var(--service-fg)]">
                <Icon name="Sparkles" size={14} />เมื่ออนุมัติ — ระบบจะทำ 3 อย่างให้อัตโนมัติ
              </p>
              <ol className="mt-2 space-y-1 text-xs text-[var(--service-fg)] list-decimal pl-5">
                <li>สร้าง <strong>Customer Profile</strong> ใหม่ในระบบ (ไม่ต้องกรอกข้อมูลซ้ำ)</li>
                <li>สร้าง <strong>งานบริการ</strong> ตามเทมเพลตของแต่ละบริการ</li>
                <li>ส่งต่อให้ทีม Service ทันที พร้อม Note และ Insight ทั้งหมดจาก Sales</li>
              </ol>
            </div>

            <div>
              <p className="text-xs font-medium mb-2">เลือกประเภทลูกค้า (สำหรับการจัดกลุ่ม)</p>
              <div className="grid grid-cols-3 gap-2">
                {["ตามแพ็คเกจบัญชี", "ร้านอาหาร", "Shopee/E-com", "นำเข้า-ส่งออก", "Service-based", "Manufacturing"].map((g, i) => (
                  <button key={g} className={cn("text-xs py-1.5 px-2 rounded-md border", i === 0 ? "bg-[var(--service-soft)] border-[var(--service)]/40 text-[var(--service-fg)]" : "border-[var(--border)] hover:bg-[var(--muted)]")}>{g}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Proposal viewer/new */}
      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.new ? "สร้าง Proposal ใหม่" : `Proposal ${open?.id}`}
        size="lg"
        description={open?.new ? "เลือกบริการและให้ระบบคำนวณราคากลาง" : open?.company}
        footer={open?.new ? <>
          <Button variant="outline" onClick={() => setOpen(null)}>ยกเลิก</Button>
          <Button variant="outline"><Icon name="Save" size={13} />บันทึก Draft</Button>
          <Button variant="sales"><Icon name="Send" size={13} />ส่งให้ลูกค้า</Button>
        </> : <Button variant="outline" onClick={() => setOpen(null)}>ปิด</Button>}
      >
        {open?.new ? (
          <ProposalBuilder leads={LEADS} defaultLeadId={open?.leadId} />
        ) : open ? (
          <ProposalDetail proposal={open} />
        ) : null}
      </Modal>
    </div>
  );
};

Object.assign(window, { ProposalsPage });
