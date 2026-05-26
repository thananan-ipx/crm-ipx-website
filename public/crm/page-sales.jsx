/* ============================================
   Sales Follow-up — Call Log + Calendar + Notes
   ============================================ */

const SalesPage = ({ onNavigate, sharedState, routeArgs }) => {
  const { LEADS, CALLS } = window.CRM_DATA;
  const followups = sharedState.followups;
  const setFollowups = sharedState.setFollowups;
  const leads = sharedState.leads;
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [scheduleLead, setScheduleLead] = React.useState(routeArgs?.prefillLeadId || leads[0]?.id || "");
  const [scheduleTime, setScheduleTime] = React.useState(routeArgs?.prefillTime || "2026-05-20T10:00");
  const [scheduleType, setScheduleType] = React.useState("Call");
  const toast = useToast();

  // Open schedule modal automatically if routed in with prefill
  React.useEffect(() => {
    if (routeArgs?.openSchedule) {
      setShowSchedule(true);
      if (routeArgs.prefillLeadId) setScheduleLead(routeArgs.prefillLeadId);
    }
  }, [routeArgs]);

  /* Calendar grid: 7-day week starting May 17 (Sun) */
  const weekDays = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  const days = [
    { d: 18, name: "จันทร์", date: "2026-05-18" },
    { d: 19, name: "อังคาร", date: "2026-05-19" },
    { d: 20, name: "พุธ", date: "2026-05-20" },
    { d: 21, name: "พฤหัส", date: "2026-05-21" },
    { d: 22, name: "ศุกร์", date: "2026-05-22" },
    { d: 17, name: "เสาร์", date: "2026-05-17" },
    { d: 23, name: "อาทิตย์", date: "2026-05-23" },
  ];
  const hours = Array.from({ length: 9 }, (_, i) => 8 + i); // 8..16

  const detectDuplicate = (newTime, leadId) => {
    return followups.some(f => f.at.startsWith(newTime.slice(0, 16).replace("T", " ")) && f.leadId !== leadId);
  };

  const addFollowup = () => {
    const result = sharedState.scheduleFollowup({
      leadId: scheduleLead,
      at: scheduleTime,
      type: scheduleType,
      by: "นิ้ง",
    });
    if (!result.ok) {
      toast({ title: "ตรวจพบเวลาซ้ำ", description: "ห้ามตั้ง Follow-up เวลาเดียวกัน — เลือกเวลาใหม่", tone: "sales", icon: "AlertTriangle" });
      return;
    }
    const lead = leads.find(l => l.id === scheduleLead);
    setShowSchedule(false);
    toast({ title: "นัด Follow-up สำเร็จ", description: `${lead?.company} · ${result.followup.at} · จะขึ้นใน Lead Timeline ด้วย`, tone: "sales", icon: "Calendar" });
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Sales Follow-up" subtitle="ตามไม่เกิน 5 ครั้ง · ห้ามตั้งเวลาซ้ำ · log ทุกการสนทนา — ลูกค้าตกลงเร็วก็ปิดได้เลย" accent="sales">
        <Button variant="outline" size="sm"><Icon name="Download" size={14} />Export Call Log</Button>
        <Button variant="sales" size="sm" onClick={() => setShowSchedule(true)}><Icon name="CalendarPlus" size={14} />นัด Follow-up</Button>
      </PageHeader>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Follow-up นัดไว้" value={followups.length} icon="CalendarClock" accent="sales" />
        <Stat label="โทรไปแล้ววันนี้" value={CALLS.filter(c => c.at.startsWith("2026-05-16")).length} icon="PhoneCall" accent="sales" />
        <Stat label="ติดต่อสำเร็จ" value={`${Math.round((CALLS.filter(c => c.result === "ตอบรับ").length / CALLS.length) * 100)}%`} icon="CheckCircle2" accent="service" />
        <Stat label="Lead เสี่ยงหลุด" value="3" icon="AlertTriangle" accent="sales" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>ปฏิทินนัด Follow-up</CardTitle>
              <CardDescription>17 — 23 พ.ค. 2026 · เชื่อมกับปฏิทิน Case</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm"><Icon name="ChevronLeft" size={14} /></Button>
              <Button variant="outline" size="sm">วันนี้</Button>
              <Button variant="ghost" size="icon-sm"><Icon name="ChevronRight" size={14} /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto scroll-thin">
              <div className="min-w-[640px]">
                {/* Header row */}
                <div className="grid grid-cols-[60px_repeat(7,minmax(60px,1fr))] border border-[var(--border)] rounded-t-md bg-[var(--muted)]/50 text-xs text-[var(--muted-foreground)]">
                  <div className="px-2 py-1.5"></div>
                  {days.map((d, i) => (
                    <div key={d.date} className={cn("px-2 py-1.5 text-center border-l border-[var(--border)]", d.date === "2026-05-17" && "bg-[var(--sales)]/10 text-[var(--sales-fg)] font-semibold")}>
                      <p>{["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"][i]}</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{d.d}</p>
                    </div>
                  ))}
                </div>
                {/* Hours rows */}
                <div className="border-x border-b border-[var(--border)] rounded-b-md">
                  {hours.map(h => (
                    <div key={h} className="grid grid-cols-[60px_repeat(7,minmax(60px,1fr))] border-t border-[var(--border)] first:border-t-0">
                      <div className="px-2 py-1.5 text-[10px] text-[var(--muted-foreground)] tabular text-right">{String(h).padStart(2, "0")}:00</div>
                      {days.map(d => {
                        const slot = followups.find(f => f.at.startsWith(`${d.date} ${String(h).padStart(2, "0")}`));
                        return (
                          <div key={d.date + h} className="border-l border-[var(--border)] min-h-[40px] p-1 relative">
                            {slot && (
                              <div
                                onClick={() => onNavigate("leads", { openLeadId: slot.leadId })}
                                className={cn("rounded-md p-1.5 text-[10px] leading-tight cursor-pointer hover:scale-105 transition-transform", moduleAccent("sales").soft, moduleAccent("sales").fg, "border", moduleAccent("sales").border)}
                                title="คลิกเพื่อเปิด Lead"
                              >
                                <p className="font-semibold truncate">{slot.company}</p>
                                <p className="opacity-75">{slot.type} · {slot.at.slice(11, 16)}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-2 flex items-center gap-1">
              <Icon name="ShieldAlert" size={11} /> ระบบจะป้องกันการตั้งเวลาซ้ำ — duplicate detection อัตโนมัติ
            </p>
          </CardContent>
        </Card>

        {/* Today's queue */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>คิว Follow-up</CardTitle>
              <CardDescription>เรียงตามเวลา</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {followups.map(f => {
              const lead = leads.find(l => l.id === f.leadId);
              const overdue = f.attempts >= 4;
              return (
                <div key={f.id} className={cn("rounded-lg border p-3 hover:shadow-sm transition-all cursor-pointer", overdue ? "border-[var(--destructive)]/40 bg-[var(--destructive)]/5" : "border-[var(--border)]")}
                  onClick={() => onNavigate("leads", { openLeadId: f.leadId })}
                  title="เปิดดู Lead"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{f.company}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">{f.at}</p>
                    </div>
                    <Badge tone={overdue ? "rose" : "sales"} soft className="!text-[10px] !py-0">ครั้งที่ {f.attempts}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <Badge tone="sales" soft className="!text-[10px]"><Icon name={f.type === "Call" ? "Phone" : f.type === "Email" ? "Mail" : "MessageCircle"} size={10} />{f.type}</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm"><Icon name="Check" size={12} /></Button>
                      <Button variant="ghost" size="icon-sm"><Icon name="Calendar" size={12} /></Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Call Log + Sales note */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Call Log</CardTitle>
              <CardDescription>บันทึกผลการสนทนาทุกครั้ง · เชื่อมกับ Lead timeline</CardDescription>
            </div>
            <Button variant="outline" size="sm"><Icon name="Plus" size={13} />Log Call</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-[var(--muted-foreground)]">
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left font-medium pb-2">เวลา</th>
                    <th className="text-left font-medium pb-2">บริษัท</th>
                    <th className="text-left font-medium pb-2">ผลการคุย</th>
                    <th className="text-left font-medium pb-2">ระยะเวลา</th>
                    <th className="text-left font-medium pb-2">Note</th>
                    <th className="text-left font-medium pb-2">โดย</th>
                  </tr>
                </thead>
                <tbody>
                  {CALLS.map(c => (
                    <tr key={c.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/40">
                      <td className="py-2 pr-2 text-xs tabular text-[var(--muted-foreground)]">{c.at}</td>
                      <td className="py-2 pr-2 font-medium">{c.company}</td>
                      <td className="py-2 pr-2"><Badge tone={c.result === "ตอบรับ" ? "service" : "rose"} soft dot>{c.result}</Badge></td>
                      <td className="py-2 pr-2 tabular text-xs">{c.duration}</td>
                      <td className="py-2 pr-2 text-xs text-[var(--muted-foreground)] max-w-[260px] truncate">{c.note}</td>
                      <td className="py-2 pr-2"><Avatar name={c.by} size={22} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Sales Playbook</CardTitle>
              <CardDescription>แพทเทิร์นคำถามมาตรฐาน</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm">
              {[
                { i: "Smile", h: "สิ่งที่ลูกค้าให้ความสำคัญ", q: "ราคา / คุณภาพ / ความเร็ว / บริการ" },
                { i: "Frown", h: "Pain Points", q: "ปัญหาที่เจอ / ไม่โอเคจากเจ้าอื่น" },
                { i: "ShieldQuestion", h: "ความกังวล", q: "ความถูกต้องของกฎหมาย / Audit" },
                { i: "Banknote", h: "งบประมาณ", q: "งบต่อปี / รูปแบบชำระ" },
                { i: "Users", h: "ผู้มีอำนาจตัดสินใจ", q: "เจ้าของ / CFO / Owner" },
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0", moduleAccent("sales").soft, moduleAccent("sales").fg)}>
                    <Icon name={p.i} size={13} />
                  </div>
                  <div>
                    <p className="font-medium text-xs">{p.h}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">{p.q}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Modal */}
      <Modal
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        title="นัด Follow-up"
        description="เชื่อมกับปฏิทินงาน · ระบบจะแจ้งเตือนอัตโนมัติ"
        footer={<>
          <Button variant="outline" onClick={() => setShowSchedule(false)}>ยกเลิก</Button>
          <Button variant="sales" onClick={addFollowup}><Icon name="CalendarPlus" size={14} />ยืนยัน</Button>
        </>}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">Lead</label>
            <Select value={scheduleLead} onChange={e => setScheduleLead(e.target.value)}>
              {leads.filter(l => l.stage !== "closed").map(l => <option key={l.id} value={l.id}>{l.company}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">วัน/เวลา</label>
              <input type="datetime-local" className="h-9 w-full rounded-md border border-[var(--input)] px-3 text-sm" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">วิธีติดต่อ</label>
              <Select value={scheduleType} onChange={e => setScheduleType(e.target.value)}>
                <option>Call</option><option>Email</option><option>Line</option>
              </Select>
            </div>
          </div>
          <div className="text-xs text-[var(--muted-foreground)] bg-[var(--sales-soft)] border border-[var(--sales)]/20 rounded-md p-2.5 flex items-start gap-2">
            <Icon name="ShieldAlert" size={13} className="text-[var(--sales-fg)] mt-0.5" />
            <span>ระบบจะตรวจ duplicate time อัตโนมัติ — ถ้ามี Follow-up อื่นตรงเวลาเดียวกัน จะแจ้งเตือน</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

Object.assign(window, { SalesPage });
