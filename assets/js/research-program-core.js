(() => {
  "use strict";
  const payload = window.JSLResearchProgramData;
  if (!payload) return;
  const { REPOS, DATA, LAYOUT, HALOS, EDGES, MOBILE_GROUPS } = payload;

  const section = document.querySelector(".rpm-section");
  const map = document.getElementById("rpm-map");
  if (!section || !map) return;

  section.querySelector(".rpm-controls")?.remove();
  section.classList.add("rpm-anticipatory-identity");

  const heading = section.querySelector(".section-header h2");
  const intro = section.querySelector(".section-header p");
  if (heading) heading.textContent = "Computational Statistics for Anticipatory Human Security.";
  if (intro) intro.innerHTML = "Discover hidden structure. Quantify uncertainty. Detect consequential change before the outcome is obvious.";

  const detailLabels = [...section.querySelectorAll(".rpm-detail-label")];
  if (detailLabels[1]) detailLabels[1].textContent = "Methods / concepts";
  if (detailLabels[2]) detailLabels[2].textContent = "Selected work";

  const detailFoot = section.querySelector(".rpm-detail-foot");
  if (detailFoot) detailFoot.textContent = "Pillars carry the research questions. Squares are Research/CV projects. Method tags open repositories; work items open the project or publication.";

  const legend = section.querySelector(".rpm-footer-legend");
  if (legend) legend.innerHTML = `<span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-pillar">◆</span>Pillar</span><span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-method">●</span>Method</span><span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-domain">○</span>Domain</span><span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-project">□</span>Project / study</span>`;

  const footerState = section.querySelector(".rpm-footer-state");
  if (footerState) footerState.textContent = "Statistician first · applications second";

  function conceptRepo(label) {
    const x = String(label || "").toLowerCase();
    if (/unsupervised/.test(x)) return REPOS.unsupervised;
    if (/(cluster|hdbscan|hierarchical|mixture|fuzzy|density)/.test(x)) return REPOS.clustering;
    if (/(dimension|pca|umap|mds|embedding)/.test(x)) return REPOS.dimension;
    if (/(network|centrality|community|bipartite|diffusion)/.test(x)) return REPOS.networks;
    if (/(longitudinal|panel|trajectory|alignment|multilevel|mixed|partial pooling|nested)/.test(x)) return REPOS.longitudinal;
    if (/(missing|imputation|missingness)/.test(x)) return REPOS.missing;
    if (/(spatial|distance|geographic|population-weighted)/.test(x)) return REPOS.spatial;
    if (/(text|nlp|extraction|attribution|classification)/.test(x)) return REPOS.unTranscript;
    if (/(human ecology|climate|environment)/.test(x)) return REPOS.ecology;
    if (/humanitarian/.test(x)) return REPOS.humanitarian;
    if (/human security/.test(x)) return REPOS.humansecurity;
    if (/(counterterror|terrorism)/.test(x)) return REPOS.terrorism;
    return REPOS.computing;
  }

  function projectRepo(label) {
    const match = Object.values(DATA).find(item => item.kind === "project" && item.title === label);
    return match?.url || null;
  }

  function nodeRepo(id) {
    if (DATA[id]?.kind === "project") return DATA[id].url || null;
    return ({
      unsupervised:REPOS.unsupervised,
      clustering:REPOS.clustering,
      dimension:REPOS.dimension,
      networks:REPOS.networks,
      longitudinal:REPOS.longitudinal,
      missing:REPOS.missing,
      bayesian:REPOS.computing,
      multilevel:REPOS.longitudinal,
      validation:REPOS.computing,
      nlp:REPOS.unTranscript,
      spatial:REPOS.spatial,
      forecasting:REPOS.computing,
      political:REPOS.political,
      massviolence:REPOS.political,
      counterextremism:REPOS.terrorism,
      humanecology:REPOS.ecology,
      humanitarian:REPOS.humanitarian,
      humansecurity:REPOS.humansecurity,
      climate:REPOS.ecology,
      ainonproliferation:REPOS.technology,
      autonomous:REPOS.technology
    })[id] || null;
  }

  const haloMarkup = h => `<g class="rpm-cluster-halo" data-cluster="${h.id}"><ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" /></g>`;
  const edgeMarkup = e => `<line class="rpm-edge rpm-edge-${e.type}" data-a="${e.a}" data-b="${e.b}" x1="${LAYOUT[e.a].x}" y1="${LAYOUT[e.a].y}" x2="${LAYOUT[e.b].x}" y2="${LAYOUT[e.b].y}" />`;

  function shapeMarkup(node, kind) {
    if (kind === "pillar") return `<polygon class="rpm-shape" points="0,${-node.r} ${node.r*.86},0 0,${node.r} ${-node.r*.86},0" />`;
    if (kind === "project") return `<rect class="rpm-shape" x="${-node.r}" y="${-node.r}" width="${node.r*2}" height="${node.r*2}" />`;
    return `<circle class="rpm-shape" r="${node.r}" />`;
  }

  function labelMarkup(node, id) {
    if (DATA[id].kind === "project") return "";
    if (id === "center") return `<text class="rpm-network-center-label" text-anchor="middle" aria-hidden="true"><tspan x="0" y="-8">Computational</tspan><tspan x="0" y="14">Statistics</tspan><tspan class="rpm-network-center-sub" x="0" y="34">ANTICIPATORY HUMAN SECURITY</tspan></text>`;
    const start = node.r + 15;
    const lines = node.lines.map((line,i) => `<tspan x="0" y="${start+i*13}">${line}</tspan>`).join("");
    const primary = node.primary ? `<tspan class="rpm-network-node-sub" x="0" y="${start+node.lines.length*13+2}">SIGNATURE METHOD</tspan>` : "";
    return `<text class="rpm-network-node-label" text-anchor="middle" aria-hidden="true">${lines}${primary}</text>`;
  }

  function nodeMarkup(id,node) {
    const d = DATA[id];
    return `<g class="rpm-node rpm-network-node rpm-kind-${d.kind}${node.primary?" rpm-primary":""}${id==="center"?" is-active":""}" role="button" tabindex="0" aria-hidden="false" data-id="${id}" transform="translate(${node.x} ${node.y})">${d.kind==="project"?`<title>${d.title}</title>`:""}${shapeMarkup(node,d.kind)}${labelMarkup(node,id)}</g>`;
  }

  map.setAttribute("viewBox","0 0 980 650");
  map.innerHTML = `<title id="rpm-title">Research program network</title><desc id="rpm-desc">Computational statistics connected to three research pillars, methods, application domains, and specific research and applied projects listed on the Research page and CV.</desc><g>${HALOS.map(haloMarkup).join("")}</g><g>${EDGES.map(edgeMarkup).join("")}</g><g>${Object.entries(LAYOUT).map(([id,node])=>nodeMarkup(id,node)).join("")}</g>`;

  const nodes=[...map.querySelectorAll(".rpm-node")], edges=[...map.querySelectorAll(".rpm-edge")], halos=[...map.querySelectorAll(".rpm-cluster-halo")];
  const mobile=section.querySelector(".rpm-mobile"), kicker=document.getElementById("rpm-detail-kicker"), title=document.getElementById("rpm-detail-title"), summary=document.getElementById("rpm-detail-summary"), plain=document.getElementById("rpm-detail-questions"), methods=document.getElementById("rpm-detail-methods"), projects=document.getElementById("rpm-detail-projects");
  let locked=null;

  function renderDetail(id) {
    const d=DATA[id]||DATA.center;
    if (detailLabels[0]) detailLabels[0].textContent=d.kind==="pillar"?"Core questions":"In plain English";
    kicker.textContent=d.kind==="core"?"Research identity":d.kind==="pillar"?"Research pillar":d.kind==="method"?"Method":d.kind==="domain"?"Application domain":"Project / study";
    title.textContent=d.title;
    summary.textContent=d.summary;
    plain.innerHTML=d.bullets.map(x=>`<li>${x}</li>`).join("");
    methods.innerHTML=d.methods.map(x=>`<a class="rpm-chip" href="${conceptRepo(x)}" target="_blank" rel="noopener noreferrer">${x}</a>`).join("");

    const linked=d.work.map(label=>({label,href:projectRepo(label)})).filter(x=>x.href);
    const block=projects.closest(".rpm-detail-block");
    if(linked.length){
      block.hidden=false;
      projects.innerHTML=linked.map(x=>`<li><a class="rpm-work-link" href="${x.href}" target="_blank" rel="noopener noreferrer">${x.label}</a></li>`).join("");
    } else {
      block.hidden=true;
      projects.innerHTML="";
    }
  }

  function clear(){nodes.forEach(n=>n.classList.remove("is-active","is-related","is-muted"));edges.forEach(e=>e.classList.remove("is-active","is-muted"));halos.forEach(h=>h.classList.remove("is-related","is-muted"));}
  function overview(){clear();nodes.find(n=>n.dataset.id==="center")?.classList.add("is-active");renderDetail("center");locked=null;}
  function neighbors(id){const set=new Set([id]);edges.forEach(e=>{if(e.dataset.a===id)set.add(e.dataset.b);if(e.dataset.b===id)set.add(e.dataset.a);});return set;}
  function clusters(ids){const set=new Set();ids.forEach(id=>(LAYOUT[id]?.groups||[]).forEach(g=>set.add(g)));return set;}
  function highlight(id,temp=false){const rel=neighbors(id), cls=clusters(rel);nodes.forEach(n=>{const x=n.dataset.id;n.classList.toggle("is-active",x===id);n.classList.toggle("is-related",x!==id&&rel.has(x));n.classList.toggle("is-muted",!rel.has(x));});edges.forEach(e=>{const active=e.dataset.a===id||e.dataset.b===id;e.classList.toggle("is-active",active);e.classList.toggle("is-muted",!active);});halos.forEach(h=>{const yes=cls.has(h.dataset.cluster);h.classList.toggle("is-related",yes);h.classList.toggle("is-muted",cls.size>0&&!yes);});renderDetail(id);if(!temp)locked=id;}
  function restore(){locked?highlight(locked,true):overview();}

  nodes.forEach(node=>{
    const id=node.dataset.id;
    node.addEventListener("mouseenter",()=>highlight(id,true));
    node.addEventListener("mouseleave",restore);
    node.addEventListener("focus",()=>highlight(id,true));
    node.addEventListener("blur",restore);
    node.addEventListener("click",()=>{
      const d=DATA[id];
      if(d.kind==="project"&&d.url){window.open(d.url,"_blank","noopener,noreferrer");return;}
      if(id==="center"||locked===id)overview();else highlight(id);
    });
    node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();node.click();}});
  });

  function renderMobile(){
    if(!mobile)return;
    mobile.innerHTML=MOBILE_GROUPS.map((g,i)=>`<div class="rpm-mobile-item${i===0?" is-open":""}"><button class="rpm-mobile-trigger" type="button" aria-expanded="${i===0?"true":"false"}"><span class="rpm-mobile-name">${g.title}</span><span class="rpm-mobile-symbol">${i===0?"−":"+"}</span></button><div class="rpm-mobile-content"><p>${g.summary}</p>${g.ids.map(id=>{const href=DATA[id].url||nodeRepo(id);return href?`<a href="${href}" target="_blank" rel="noopener noreferrer">${DATA[id].title}</a>`:`<span>${DATA[id].title}</span>`;}).join("")}</div></div>`).join("");
  }

  mobile?.addEventListener("click",e=>{const b=e.target.closest(".rpm-mobile-trigger");if(!b)return;const item=b.closest(".rpm-mobile-item"),symbol=b.querySelector(".rpm-mobile-symbol"),open=!item.classList.contains("is-open");item.classList.toggle("is-open",open);b.setAttribute("aria-expanded",open?"true":"false");symbol.textContent=open?"−":"+";});

  renderMobile();
  overview();
})();