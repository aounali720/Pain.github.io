const projects=[
  {
    n:"01",title:"SOC FIELDWORK — SOC Analyst Training Game",
    description:"An interactive SOC training environment spanning L1 to L3. I built visual concept walkthroughs, simulated log investigations, analyst shift exercises, incident-response decisions and interview practice using fictional security events.",
    tags:["SOC L1–L3","Incident investigation","Log analysis","Interactive JavaScript"],
    url:"https://github.com/aounali720/soc-fieldwork",
    demo:"https://aounali720.github.io/soc-fieldwork/",
    demoLabel:"Explore the lab",
    art:"socfieldwork",featured:true
  },
  {
    n:"02",title:"PACKET//ZERO — Cybersecurity Learning Game",
    description:"A browser-based security learning game with 74 lessons, interactive network diagrams, self-check questions and eight safe simulations covering networks, identity, web threats, cloud and SOC fundamentals.",
    tags:["Cybersecurity fundamentals","Network protocols","Interactive labs","JavaScript"],
    url:"https://github.com/aounali720/packet-zero",
    art:"packetzero",featured:true
  },
  {
    n:"03",title:"Casefile Zero — Cybersecurity Field Game",
    description:"A standalone browser game for learning the OWASP Top 10:2025. It combines request-flow diagrams, annotated payload examples, code reviews, quizzes and fictional TTP investigations. Examples are simulated; nothing is executed.",
    tags:["OWASP Top 10:2025","Web security","TTP analysis","Vanilla JavaScript"],
    url:"https://github.com/aounali720/Pain.github.io/tree/main/casefile-zero",
    demo:"https://aounali720.github.io/Pain.github.io/casefile-zero/",
    demoLabel:"Play the game",
    art:"casefile",featured:true
  },
  {
    n:"04",title:"Ops Atlas — Interactive Learning Game",
    description:"Built a browser-based game to practice Git, Docker, Kubernetes and cloud basics. It has 40 lessons across eight worlds, with short quizzes, flashcards, simulated terminal exercises and progress tracking.",
    tags:["React · TypeScript","Docker","Kubernetes","GitHub Actions"],
    url:"https://github.com/aounali720/ops-atlas",
    demo:"https://aounali720.github.io/ops-atlas/",
    demoLabel:"Play the game",
    art:"opsatlas",featured:true
  },
  {
    n:"05",title:"SignalForge 720 — SOC Investigation Workbench",
    description:"A local SOC practice dashboard built with Python and Streamlit. I use it to review CISA KEV and EPSS data, take investigation notes, work through fictional inventory examples and export case reports.",
    tags:["Python · Streamlit","Threat intelligence","SQLite","Detection engineering"],
    url:"https://github.com/aounali720/signalforge-720",
    demo:"https://github.com/aounali720/signalforge-720/blob/main/docs/demo-walkthrough.md",
    demoLabel:"View walkthrough",
    art:"signalforge",featured:true
  },
  {
    n:"06",title:"Harbor GRC — Risk & Control Workbench",
    description:"A fictional SaaS risk-management application linking assets, findings, controls, owners and evidence to document risk decisions. Built for reproducible GRC practice, not as a production audit tool.",
    tags:["GRC","Risk assessment","ISO / NIST","Evidence workflows"],
    url:"https://github.com/aounali720/harbor-grc",
    art:"harborgrc"
  },
  {n:"07",title:"Snort × Splunk Detection Lab",description:"Configured Snort on an Ubuntu VM and forwarded its TCP and ICMP alerts to Splunk to practice log review.",tags:["Detection engineering","Snort","Splunk","Ubuntu"],url:"https://github.com/aounali720/snort-project",art:"detection"},
  {n:"08",title:"Wazuh Endpoint Monitoring",description:"Installed Wazuh on an Ubuntu cloud VM and connected Windows and Ubuntu agents to see their events in one dashboard.",tags:["Security operations","Wazuh","Windows","Linux"],url:"https://github.com/aounali720/Wazuh-Project",art:"endpoints"},
  {n:"09",title:"Google Cloud Incident Response",description:"Worked through a Google Cloud incident exercise involving a public bucket, broad firewall rules and insecure VM settings.",tags:["Cloud security","Google Cloud","Incident response","IAM"],url:"https://github.com/aounali720/Google-Cloud-Cybersecurity-Project",art:"cloud"},
  {n:"10",title:"Threat Modelling Workshop Exercise",description:"Worked through a fictional threat-modelling workshop, mapping possible attack paths and control gaps with STRIDE and MITRE ATT&CK.",tags:["Training exercise","Threat modelling","STRIDE","Risk assessment"],url:"https://github.com/aounali720/Threat-Modelling-DevSecOps-Project",art:"threat"}
];
const visuals={
packetzero:'<rect x="18" y="16" width="264" height="112" rx="5" fill="#1e3630"/><g font-family="monospace" font-size="8" font-weight="700" fill="#ead5ad"><text x="32" y="34">PACKET//ZERO</text><text x="224" y="34">NETLAB</text></g><path d="M18 43H282" stroke="#91baaa" stroke-opacity=".45"/><g stroke="#efad7e" stroke-width="2.2" fill="none"><path d="M66 82H136M168 82H231"/><path d="m129 76 7 6-7 6M224 76l7 6-7 6"/></g><g fill="#e5eadb" stroke="#8cbaa7" stroke-width="1.5"><rect x="34" y="65" width="48" height="35" rx="4"/><rect x="136" y="61" width="42" height="43" rx="4"/><rect x="231" y="65" width="39" height="35" rx="4"/></g><g font-family="monospace" font-size="9" fill="#25463e" font-weight="700" text-anchor="middle"><text x="58" y="85">HOST</text><text x="157" y="85">FW</text><text x="250" y="85">NET</text></g><text x="32" y="118" font-family="monospace" font-size="8" fill="#c7dbcd">INSPECT · UNDERSTAND · DEFEND</text>',
harborgrc:'<rect x="18" y="16" width="264" height="112" rx="5" fill="#1d3532"/><g font-family="monospace" font-weight="700" font-size="8" fill="#e8cc9e"><text x="31" y="34">HARBOR / ASSURANCE</text><text x="249" y="34">GRC</text></g><path d="M18 43H282" stroke="#90b5a5" stroke-opacity=".45"/><g fill="#d6e4d8" stroke="#94b6a4" stroke-width="1.4"><rect x="32" y="60" width="69" height="37" rx="3"/><rect x="116" y="60" width="68" height="37" rx="3"/><rect x="199" y="60" width="69" height="37" rx="3"/></g><g fill="#254339" font-family="monospace" font-weight="700" font-size="9" text-anchor="middle"><text x="66" y="82">RISK</text><text x="150" y="82">CONTROL</text><text x="233" y="82">EVIDENCE</text></g><path d="M101 78H116M184 78H199" stroke="#e6ab7a" stroke-width="2.5" stroke-dasharray="3 3"/><text x="32" y="117" font-family="monospace" font-size="8" fill="#c1d9cb">TRACE FINDINGS TO DECISIONS</text>',
socfieldwork:'<rect x="17" y="15" width="266" height="115" rx="5" fill="#1c322e"/><path d="M17 40H283M17 111H283" stroke="#76998b" stroke-opacity=".36"/><g fill="#e6c49f" font-family="monospace" font-weight="700" font-size="8"><text x="30" y="31">SOC / FIELDWORK</text><text x="225" y="31">L1—L3</text></g><path d="M86 73H116M184 73H213" stroke="#83b4a5" stroke-width="2.5" stroke-dasharray="4 4"/><path d="m110 68 6 5-6 5M207 68l6 5-6 5" stroke="#83b4a5" stroke-width="2" fill="none"/><rect x="28" y="53" width="58" height="39" rx="4" fill="#3a5c54" stroke="#90baaa"/><rect x="116" y="53" width="68" height="39" rx="4" fill="#e6ad83"/><rect x="213" y="53" width="59" height="39" rx="4" fill="#3a5c54" stroke="#90baaa"/><g font-family="monospace" font-weight="700" font-size="9" text-anchor="middle"><text x="57" y="76" fill="#f4e3c9">ALERT</text><text x="150" y="76" fill="#203b32">TRIAGE</text><text x="242" y="76" fill="#f4e3c9">HANDOFF</text></g><g font-family="monospace" font-size="8" fill="#abc6b7"><text x="30" y="122">EVIDENCE</text><text x="117" y="122">DECISION</text><text x="218" y="122">REPORT</text></g>',
casefile:'<rect x="21" y="17" width="258" height="110" rx="4" fill="#1d342a"/><path d="M21 41H279M21 104H279" stroke="#94aa93" stroke-opacity=".32"/><g font-family="monospace" fill="#edd2a1"><text x="35" y="32" font-size="9">CASEFILE // 00</text><text x="224" y="32" font-size="8">TOP 10 / 2025</text></g><rect x="37" y="61" width="60" height="27" fill="#d79c73"/><rect x="120" y="61" width="61" height="27" fill="#e9dfc4"/><rect x="204" y="61" width="60" height="27" fill="#d79c73"/><g fill="#23382d" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold"><text x="67" y="78">INPUT</text><text x="151" y="78">CHECK</text><text x="234" y="78">DATA</text></g><path d="M98 74H119M182 74H203" stroke="#e7b58a" stroke-width="2" stroke-dasharray="4 4"/><g fill="#d5cfb8" font-family="monospace" font-size="8"><text x="35" y="118">TTP / DETECT / DEFEND</text></g>',
opsatlas:'<rect x="20" y="18" width="260" height="110" rx="5" fill="#20342b"/><path d="M34 42H266M34 111H266" stroke="#789587" stroke-opacity=".3"/><path d="M58 80 146 54 241 82" fill="none" stroke="#e4a076" stroke-width="2.4" stroke-dasharray="4 7" stroke-linecap="round"/><g fill="#ed8559" stroke="#f3cf9e" stroke-width="1.5"><rect x="43" y="66" width="28" height="28" rx="3"/><rect x="132" y="40" width="28" height="28" rx="3"/><rect x="227" y="68" width="28" height="28" rx="3"/></g><g fill="#20342b" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle"><text x="57" y="84">01</text><text x="146" y="58">04</text><text x="241" y="86">08</text></g><g fill="#f4e7cf" font-family="monospace" font-size="8" font-weight="700" text-anchor="middle"><text x="57" y="107">GIT</text><text x="146" y="82">DOCKER</text><text x="241" y="110">CLOUD</text></g><g fill="#e6aa87" font-family="monospace" font-size="8" font-weight="700"><text x="34" y="34">OPS / FIELD ROUTE</text><text x="175" y="34">40 MISSIONS</text></g>',
signalforge:'<rect x="20" y="17" width="260" height="111" rx="5" fill="#1b302e"/><path d="M20 44H280M20 95H280" stroke="#789a91" stroke-opacity=".35"/><g fill="#8eb5a8" font-family="monospace" font-size="8" font-weight="700"><text x="34" y="34">SF720 / ANALYST QUEUE</text><text x="34" y="115">ADVISORY</text><text x="118" y="115">TRIAGE</text><text x="216" y="115">EVIDENCE</text></g><g stroke="#72a594" stroke-width="2" fill="none"><path d="M49 72H118M146 72H217"/><path d="m110 67 8 5-8 5M209 67l8 5-8 5"/></g><rect x="32" y="54" width="40" height="36" rx="3" fill="#416158" stroke="#95b6a5"/><rect x="117" y="54" width="58" height="36" rx="3" fill="#37554c" stroke="#e6ad7c"/><rect x="215" y="54" width="50" height="36" rx="3" fill="#416158" stroke="#95b6a5"/><g fill="#efdebd" font-family="monospace" font-weight="700" font-size="10" text-anchor="middle"><text x="52" y="75">KEV</text><text x="146" y="75">CASE</text><text x="240" y="75">JSON</text></g><circle cx="269" cy="28" r="4" fill="#e99a72"/>',
detection:'<path d="M12 94H288M12 56H288M12 18H288" stroke="#bdcbc6" stroke-width="1"/><polyline points="12,78 46,75 67,80 88,36 108,93 138,72 162,74 177,20 198,83 223,61 250,67 288,30" fill="none" stroke="#426f66" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="177" cy="20" r="7" fill="#88afa3" stroke="#426f66" stroke-width="2"/>',
endpoints:'<g fill="#dce9e1" stroke="#426f66" stroke-width="2.3"><rect x="109" y="29" width="83" height="62" rx="7"/><rect x="23" y="83" width="62" height="38" rx="5"/><rect x="217" y="83" width="62" height="38" rx="5"/></g><g stroke="#608d80" stroke-width="2" fill="none"><path d="M150 91V107H54V83M150 107H248V83"/><path d="M124 43h53M124 53h40M124 63h49"/></g><g fill="#426f66"><circle cx="54" cy="83" r="5"/><circle cx="248" cy="83" r="5"/><circle cx="150" cy="107" r="5"/></g>',
cloud:'<g stroke="#426f66" stroke-width="2.6" fill="#dce9e1"><path d="M91 97c-22 0-37-14-37-32 0-17 15-31 31-31 7-23 29-39 55-39 29 0 51 19 56 45 22-3 42 13 42 34 0 13-10 23-24 23z" transform="translate(5 21)"/></g><g fill="#426f66"><rect x="118" y="58" width="65" height="12" rx="3"/><rect x="118" y="77" width="65" height="12" rx="3"/></g><g fill="#b9d4c8"><circle cx="128" cy="64" r="2"/><circle cx="128" cy="83" r="2"/></g>',
threat:'<g stroke="#8ba99d" stroke-width="2" fill="none"><path d="M151 17L247 60L212 119L90 119L55 60Z"/><path d="M151 17V78M247 60L151 78L55 60M151 78L212 119M151 78L90 119"/></g><g fill="#426f66"><circle cx="151" cy="17" r="7"/><circle cx="247" cy="60" r="7"/><circle cx="212" cy="119" r="7"/><circle cx="90" cy="119" r="7"/><circle cx="55" cy="60" r="7"/><circle cx="151" cy="78" r="9"/></g>'
};
function escapeHTML(value){return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
const projectRoot=document.querySelector("#projects");
projectRoot.innerHTML=projects.map(p=>`
  <article class="project ${p.featured?"project-featured":""}">
    <span class="project-number">${p.n}</span>
    <div class="project-info">
      ${p.featured?'<span class="featured-label">FEATURED · 2026</span>':""}
      <h3 class="project-title">${escapeHTML(p.title)}</h3>
      <p class="project-description">${escapeHTML(p.description)}</p>
      <div class="tag-row">${p.tags.map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>
      <div class="project-actions">
        ${p.demo?`<a class="project-demo" href="${p.demo}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(p.demoLabel)} for ${escapeHTML(p.title)}">${escapeHTML(p.demoLabel)} <span aria-hidden="true">↗</span></a>`:""}
        <a class="project-open" href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="View GitHub source for ${escapeHTML(p.title)}">Source code <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="project-art project-art--${p.art}" role="img" aria-label="Technical illustration for ${escapeHTML(p.title)}">
      <svg viewBox="0 0 300 145" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${visuals[p.art]}</svg>
    </div>
  </article>`).join("");
const toggle=document.querySelector(".menu-button"),nav=document.querySelector("#nav");toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation")});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation")}));document.querySelector("#year").textContent=new Date().getFullYear();