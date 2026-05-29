/* ============================================
   Root App — routing, shared state, tweaks
   ============================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable"
}/*EDITMODE-END*/;

const ROUTES = {
  "crm-dashboard":   { breadcrumbs: ["CRM", "Dashboard"], Page: window.CrmDashboardPage },
  "leads":           { breadcrumbs: ["CRM", "Marketing & Lead"], Page: window.LeadsPage, args: { lockedRole: "marketing" } },
  "ae-pipeline":     { breadcrumbs: ["CRM", "AE Pipeline"], Page: window.LeadsPage, args: { lockedRole: "ae" } },
  "sales":           { breadcrumbs: ["CRM", "Sales Follow-up"], Page: window.SalesPage },
  "proposals":       { breadcrumbs: ["CRM", "Proposal"], Page: window.ProposalsPage },
  "customers":       { breadcrumbs: ["CRM", "จัดการลูกค้า"], Page: window.CustomersPageCRM },
  "service":         { breadcrumbs: ["CRM", "จัดการงาน"], Page: window.ServicePage },
  "dashboard-original": { breadcrumbs: ["ระบบหลัก", "แดชบอร์ด"], Page: null },
  "calendar":           { breadcrumbs: ["ระบบหลัก", "ปฏิทิน"], Page: null },
  "cases":              { breadcrumbs: ["ระบบหลัก", "จัดการเอกสาร"], Page: null },
  "packages":           { breadcrumbs: ["ระบบหลัก", "จัดการแพ็กเกจลูกค้า"], Page: null },
};

/* Helper: derive the service codes for newly-created customers */
const deriveCodes = (proposal) => {
  const baseCode = proposal.id.replace(/\D/g, "").slice(-3) || "000";
  return { revenue: `C${baseCode}-REV`, payroll: `C${baseCode}-EMP`, tax: `C${baseCode}-TAX` };
};

const TEMPLATE_STEPS = {
  "จดบริษัท": {
    template: "Company Registration v3",
    steps: [
      "เตรียมเอกสารผู้ก่อตั้ง",
      "จองชื่อบริษัท (DBD)",
      "ยื่นจดทะเบียนหนังสือบริคณห์ฯ",
      "ประชุมผู้ถือหุ้น",
      "รับใบสำคัญแสดงการจดทะเบียน",
      "ขอเลขประจำตัวผู้เสียภาษี (RD)",
      "แต่งตั้งเป็นตัวแทนหัก ณ ที่จ่าย",
    ],
  },
  "บัญชีรายเดือน": {
    template: "Monthly Bookkeeping Standard",
    steps: [
      "รับเอกสารรายได้ผ่าน Line",
      "ตรวจสอบใบกำกับภาษีซื้อ-ขาย",
      "บันทึกบัญชี",
      "ยื่น ภพ.30",
      "ยื่น ภงด.1, 3, 53",
      "ส่งรายงานสรุปให้ลูกค้า",
    ],
  },
  "วางระบบ": {
    template: "Tax Setup v2",
    steps: ["วิเคราะห์โครงสร้างภาษี", "ออกแบบ workflow", "ฝึกอบรมทีมลูกค้า", "Go-live"],
  },
  "ตรวจสอบ": {
    template: "Annual Audit",
    steps: ["รับเอกสาร", "Sample testing", "ออก Management Letter", "ออกรายงานผู้สอบ"],
  },
  "เงินเดือน": {
    template: "Payroll Setup",
    steps: ["รับข้อมูลพนักงาน HR", "ตั้งระบบประกันสังคม", "Run payroll เดือนแรก"],
  },
};

const App = () => {
  // Tweaks
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    document.body.setAttribute("data-density", tweaks.density);
  }, [tweaks.density]);

  // Routing
  const [route, setRoute] = React.useState("crm-dashboard");
  const [routeArgs, setRouteArgs] = React.useState({});
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = (r, args = {}) => { setRoute(r); setRouteArgs(args); setMobileOpen(false); window.scrollTo(0, 0); };

  // Shared state (single source of truth for the prototype)
  const [leads, setLeads] = React.useState(window.CRM_DATA.LEADS);
  const [proposals, setProposals] = React.useState(window.CRM_DATA.PROPOSALS);
  const [customers, setCustomers] = React.useState(window.CRM_DATA.CUSTOMERS);
  const [jobs, setJobs] = React.useState(window.CRM_DATA.JOBS);
  const [followups, setFollowups] = React.useState(window.CRM_DATA.FOLLOWUPS);
  const [calls, setCalls] = React.useState(window.CRM_DATA.CALLS);

  const moveLead = (id, stage) => {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, stage } : l));
  };

  const addLead = (form) => {
    const id = `L-${(1100 + Math.floor(Math.random() * 900))}`;
    setLeads(ls => [{
      ...form,
      id,
      stage: "new",
      owner: "นิ้ง",
      mkOwner: "นิ้ง",
      aeOwner: null,
      createdAt: new Date().toISOString().slice(0, 10),
      lastTouch: "—",
    }, ...ls]);
  };

  const convertToCustomer = (proposal) => {
    // 1. Create customer (auto-derived from proposal/lead)
    const lead = leads.find(l => l.id === proposal.leadId);
    const codes = deriveCodes(proposal);
    const newCustomerId = `C-${(50 + customers.length).toString().padStart(4, "0")}`;
    const newCustomer = {
      id: newCustomerId,
      fromProposal: proposal.id,
      company: proposal.company + " Co., Ltd.",
      taxId: `0105${new Date().getFullYear() - 1957}00${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`,
      type: "นิติบุคคล / ตามแพ็คเกจบัญชี",
      address: "(สร้างจาก Lead — แก้ไขที่นี่ได้)",
      contact: lead?.contact || proposal.company,
      phone: lead?.phone || "—",
      line: lead?.line || "—",
      email: lead?.email || "—",
      package: proposal.services.join(" + "),
      sinceMonth: "พ.ค. 2569",
      revenue: proposal.total,
      tags: [],
      insights: {
        pace: "ปกติ",
        lineResponse: "ตอบไลน์",
        callNeeded: "ไม่ต้องโทร",
        detail: "ปานกลาง",
        payment: "ตรงเวลา",
      },
      serviceCode: codes,
    };
    setCustomers(cs => [newCustomer, ...cs]);

    // 2. Auto-create jobs
    const newJobs = [];
    proposal.services.forEach((svc, idx) => {
      const tmplKey = Object.keys(TEMPLATE_STEPS).find(k => svc.includes(k));
      if (!tmplKey) return;
      const t = TEMPLATE_STEPS[tmplKey];
      newJobs.push({
        id: `J-${2100 + jobs.length + idx}`,
        customerId: newCustomerId,
        customer: proposal.company,
        type: `งาน${tmplKey}`,
        template: t.template,
        progress: 0,
        dueAt: "2026-06-15",
        owner: "ทีม Service",
        steps: t.steps.map((name, i) => ({ id: `s${i}`, name, done: false, active: i === 0 })),
      });
    });
    setJobs(js => [...newJobs, ...js]);

    // 3. Move lead to "won"
    if (lead) moveLead(lead.id, "won");
  };

  const scheduleFollowup = ({ leadId, at, type, by = "นิ้ง" }) => {
    const lead = leads.find(l => l.id === leadId);
    const duplicate = followups.some(f => f.at.startsWith(at.slice(0, 16).replace("T", " ")));
    if (duplicate) return { ok: false, reason: "duplicate" };
    const newF = {
      id: `f${Date.now()}`,
      leadId,
      company: lead?.company || "",
      at: at.replace("T", " "),
      type, by,
      attempts: (followups.filter(f => f.leadId === leadId).length) + 1,
      status: "scheduled",
    };
    setFollowups(fs => [...fs, newF]);
    // update lead lastTouch hint
    setLeads(ls => ls.map(l => l.id === leadId ? { ...l, lastTouch: newF.at } : l));
    return { ok: true, followup: newF };
  };

  const sharedState = { leads, setLeads, proposals, setProposals, customers, setCustomers, jobs, setJobs, followups, setFollowups, calls, setCalls, moveLead, addLead, convertToCustomer, scheduleFollowup };

  const current = ROUTES[route] || ROUTES["crm-dashboard"];

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-[var(--background)]">
        <Sidebar route={route} onNavigate={navigate} mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen(o => !o)} />

        <main className="flex-1 min-w-0 flex flex-col">
          <Topbar route={route} breadcrumbs={current.breadcrumbs} onToggleMobile={setMobileOpen} />
          <div className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto fade-in">
            {current.Page ? (
              <current.Page key={route} onNavigate={navigate} sharedState={sharedState} routeArgs={{ ...routeArgs, ...(current.args || {}) }} />
            ) : (
              <ExistingPagePlaceholder route={route} title={current.breadcrumbs.at(-1)} />
            )}
          </div>
        </main>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Density">
          <TweakRadio
            label="ความหนาแน่น"
            value={tweaks.density}
            onChange={v => setTweak("density", v)}
            options={[
              { value: "comfortable", label: "Comfortable" },
              { value: "compact", label: "Compact" },
            ]}
          />
        </TweakSection>
        <TweakSection title="ทดสอบ flow">
          <p className="text-xs text-[var(--muted-foreground)] mb-2">ลองทำตามนี้เพื่อดู End-to-End:</p>
          <ol className="text-xs space-y-1 list-decimal pl-5 text-[var(--muted-foreground)]">
            <li>เข้า Marketing & Lead → ลาก card ใน Kanban</li>
            <li>กดเปิด Lead → ดู Customer Journey</li>
            <li>เข้า Proposal → กด "อนุมัติ" บนรายการที่สถานะส่งแล้ว</li>
            <li>เข้า Customer Profile → จะเห็นลูกค้าใหม่</li>
            <li>เข้า Service Operation → เห็นงานสร้างอัตโนมัติ</li>
          </ol>
        </TweakSection>
      </TweaksPanel>
    </ToastProvider>
  );
};

/* Placeholder card for existing pages */
const ExistingPagePlaceholder = ({ route, title }) => (
  <div className="space-y-4">
    <PageHeader title={title} subtitle="หน้านี้เป็นของระบบเดิม — ไม่อยู่ในขอบเขตของการเพิ่ม CRM" />
    <Card>
      <CardContent className="p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-[var(--muted)] flex items-center justify-center mb-3"><Icon name="Construction" size={20} /></div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-md mx-auto">
          ในระบบจริง หน้านี้คือ <code className="px-1 py-0.5 bg-[var(--muted)] rounded text-[10px]">{route}</code> ของ CRM เดิม.
          ดู CRM ที่เพิ่มเข้ามาในเมนู "CRM" ทางซ้าย
        </p>
      </CardContent>
    </Card>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
