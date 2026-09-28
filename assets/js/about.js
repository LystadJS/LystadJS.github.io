/* About page interactions: mountain ascent, military timeline, training popovers, and bookshelf. */

(() => {
  const militaryTimelineData = Object.freeze({
    start: "2021-11-01",
    end: "2027-05-01",
    officerStart: "2025-07-01",
    kicker: "Service & Leadership Chronology · Nov 2021–May 2027",
    todayLabel: "Today",
    roles: [
      {
        id: "infantry",
        label: "Indirect Fire Infantryman",
        labelLines: ["Indirect Fire", "Infantryman"],
        start: "2021-11-01",
        end: "2025-07-01",
        title: "Indirect Fire Infantryman · Nov 2021–Jul 2025"
      },
      {
        id: "leader",
        label: "Infantry Squad Leader",
        labelLines: ["Infantry Squad", "Leader"],
        start: "2023-03-01",
        end: "2025-07-01",
        title: "Infantry Squad Leader · Mar 2023–Jul 2025"
      },
      {
        id: "comms",
        label: "Infantry Company Communications Chief",
        labelLines: ["Infantry Company", "Communications Chief"],
        start: "2024-04-01",
        end: "2025-07-01",
        title: "Infantry Company Communications Chief · Apr 2024–Jul 2025"
      },
      {
        id: "officer",
        label: "Officer Commissioning Candidate",
        labelLines: ["Officer Commissioning", "Candidate"],
        start: "2025-07-01",
        end: "2027-05-01",
        title: "Officer Commissioning Candidate · Jul 2025–May 2027 (expected)"
      }
    ],
    units: [
      {
        id: "198th",
        date: "2022-04-01",
        name: "198th Infantry Brigade",
        dateLabel: "Apr 2022",
        datetime: "2022-04",
        image: "assets/images/about/military/198th-infantry-brigade.svg",
        alt: "198th Infantry Brigade shoulder sleeve insignia"
      },
      {
        id: "11th-airborne",
        date: "2022-11-01",
        name: "11th Airborne Division",
        dateLabel: "Nov 2022",
        datetime: "2022-11",
        image: "assets/images/about/military/11th-airborne-division.png",
        alt: "11th Airborne Division shoulder sleeve insignia with Arctic and Airborne tabs"
      },
      {
        id: "usacc",
        date: "2025-07-01",
        name: "U.S. Army Cadet Command",
        dateLabel: "Jul 2025",
        datetime: "2025-07",
        image: "assets/images/about/military/usacc.svg",
        alt: "U.S. Army Cadet Command shoulder sleeve insignia",
        className: "commissioning-transition"
      }
    ],
    training: [
      {
        id: "airborne-school",
        date: "2022-09-01",
        title: "U.S. Army Airborne School",
        school: "Airborne & Ranger Training Brigade",
        dateLabel: "Sep 2022",
        logo: "assets/images/about/military/infantry-school.svg",
        icon: "parachute"
      },
      {
        id: "cwic",
        date: "2022-12-01",
        title: "Cold Weather Indoctrination Course",
        school: "Northern Warfare Training Center · 11th Airborne Division",
        dateLabel: "Dec 2022",
        logo: "assets/images/about/military/nwtc-logo.gif",
        logoClass: "nwtc-logo",
        icon: "snowflake"
      },
      {
        id: "imlc",
        date: "2023-08-01",
        title: "Infantry Mortar Leader Course",
        school: "U.S. Army Infantry School",
        dateLabel: "Aug 2023",
        logo: "assets/images/about/military/infantry-school.svg",
        icon: "mortar"
      },
      {
        id: "cwlc",
        date: "2024-02-01",
        title: "Cold Weather Leaders Course",
        school: "Northern Warfare Training Center · 11th Airborne Division",
        dateLabel: "Feb 2024",
        logo: "assets/images/about/military/nwtc-logo.gif",
        logoClass: "nwtc-logo",
        icon: "snowflake"
      },
      {
        id: "bmmc",
        date: "2024-07-01",
        title: "Basic Military Mountaineering Course",
        school: "Northern Warfare Training Center · 11th Airborne Division",
        dateLabel: "Jul 2024",
        logo: "assets/images/about/military/nwtc-logo.gif",
        logoClass: "nwtc-logo",
        icon: "mountain"
      },
      {
        id: "eib",
        date: "2024-08-01",
        title: "Expert Infantryman Badge",
        school: "Infantry proficiency qualification",
        dateLabel: "Aug 2024",
        logo: "assets/images/about/military/expert-infantry-badge.svg",
        logoClass: "eib-icon",
        icon: "eib",
        className: "training-stagger"
      }
    ],
    ranks: [
      {
        id: "pv2",
        date: "2021-11-01",
        abbr: "PV2",
        name: "Private",
        dateLabel: "Nov 2021",
        datetime: "2021-11",
        image: "assets/images/about/military/rank-pv2.svg",
        alt: "Private Second Class rank insignia",
        className: "edge-start"
      },
      {
        id: "spc",
        date: "2022-05-01",
        abbr: "SPC",
        name: "Specialist",
        dateLabel: "May 2022",
        datetime: "2022-05",
        image: "assets/images/about/military/rank-spc.svg",
        alt: "Specialist rank insignia"
      },
      {
        id: "sgt",
        date: "2025-01-01",
        abbr: "SGT",
        name: "Sergeant",
        dateLabel: "Jan 2025",
        datetime: "2025-01",
        image: "assets/images/about/military/rank-sgt.svg",
        alt: "Sergeant rank insignia"
      },
      {
        id: "2lt",
        date: "2027-05-01",
        abbr: "2LT",
        name: "Second Lieutenant",
        dateLabel: "May 2027",
        datetime: "2027-05",
        status: "Expected",
        officer: true,
        className: "expected"
      }
    ]
  });

  const militaryTrainingIcons = Object.freeze({
    parachute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9c1.8-4.5 5-6.5 9-6.5S19.2 4.5 21 9H3Z"></path><path d="M6 9l6 7 6-7M12 9v7"></path><path d="M9.5 19.5h5"></path></svg>',
    snowflake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1.8v20.4M3.17 6.9l17.66 10.2M3.17 17.1 20.83 6.9"></path><path d="m12 5.1-2-2m2 2 2-2m-2 15.8-2 2m2-2 2 2M6 8.55l-2.75-.7M6 8.55l-.75-2.7m12.75 9.6 2.75.7M18 15.45l.75 2.7M6 15.45l-2.75.7M6 15.45l-.75 2.7M18 8.55l2.75-.7M18 8.55l.75-2.7"></path><path d="m9.2 7.25-.7-2.35m6.3 2.35.7-2.35m-6.3 11.85-.7 2.35m6.3-2.35.7 2.35"></path><circle cx="12" cy="12" r="1.15"></circle></svg>',
    mortar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.2c1.85 1.45 2.9 3.25 2.9 5.2v4.1c0 2.2-1.1 4.05-2.9 5.25-1.8-1.2-2.9-3.05-2.9-5.25V7.4c0-1.95 1.05-3.75 2.9-5.2Z"></path><path d="M9.7 7.2h4.6M9.5 12.4h5"></path><path d="M12 16.75v3.05"></path><path d="m12 19.8-3.5 2m3.5-2 3.5 2"></path><path d="m10.1 18.4 1.9 1.4 1.9-1.4"></path></svg>',
    mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="m2.5 20 7-12 3.3 5.4L15.5 9l6 11H2.5Z"></path><path d="m7.8 11 1.7 1.5 1.6-1.5M14 11.5l1.5 1.3 1.4-1.3"></path><path d="M18.3 4.2 8.6 19.1"></path><path d="M15.4 5.7c1.5-1.35 3.2-1.8 4.7-1.35"></path><path d="m8 18.15 1.9 1.25"></path></svg>',
    eib: '<img src="assets/images/about/military/expert-infantry-badge.svg" alt="">'
  });

  function renderMilitaryTimeline() {
    const career = document.getElementById("military-career-timeline");
    const kicker = document.getElementById("military-timeline-kicker");
    const canvas = document.getElementById("military-timeline-canvas");
    if (!career || !kicker || !canvas) return null;

    const toUtcDay = (value) => Date.parse(value + "T00:00:00Z");
    const clampPct = (value) => Math.max(0, Math.min(100, value));
    const start = toUtcDay(militaryTimelineData.start);
    const end = toUtcDay(militaryTimelineData.end);
    const officerStart = toUtcDay(militaryTimelineData.officerStart);
    const pct = (date, rangeStart = start, rangeEnd = end) =>
      clampPct(((toUtcDay(date) - rangeStart) / (rangeEnd - rangeStart)) * 100);
    const pos = (date) => pct(date).toFixed(4) + "%";
    const officerPct = pct(militaryTimelineData.officerStart);
    const roleById = Object.fromEntries(militaryTimelineData.roles.map((role) => [role.id, role]));
    const officerRole = roleById.officer;

    kicker.textContent = militaryTimelineData.kicker;
    canvas.style.setProperty("--officer-start", officerPct.toFixed(4) + "%");
    canvas.style.setProperty("--officer-label-x", ((officerPct + 100) / 2).toFixed(4) + "%");

    const today = new Date();
    const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    canvas.style.setProperty(
      "--today",
      clampPct(((now - start) / (end - start)) * 100).toFixed(4) + "%"
    );

    const yearTicks = [];
    const startYear = new Date(start).getUTCFullYear();
    const endYear = new Date(end).getUTCFullYear();
    for (let year = startYear + 1; year <= endYear; year += 1) {
      yearTicks.push(
        `<span class="year-tick" style="--x:${pos(year + "-01-01")};" aria-hidden="true"><span class="year-tick-label">${year}</span></span>`
      );
    }

    const leaderPct = pct(roleById.leader.start, start, officerStart);
    const commsPct = pct(roleById.comms.start, start, officerStart);
    const transitionWidth = 6;
    const leaderEnd = Math.min(100, leaderPct + transitionWidth);
    const commsEnd = Math.min(100, commsPct + transitionWidth);
    const n = (value) => Number(value.toFixed(4));

    const roleAria = (role) =>
      role.id === "officer"
        ? `${role.label}, July 2025 through expected commissioning in May 2027`
        : `${role.label}, ${role.title.split(" · ")[1]}`;

    const serviceMarkup = `
      <svg class="service-sankey service-sankey--preofficer" viewBox="0 0 100 52" preserveAspectRatio="none" role="group" aria-label="Enlisted infantry service roles, November 2021 through July 2025">
        <path class="service-flow service-flow--infantry" tabindex="0" role="button" aria-expanded="false" aria-label="${roleAria(roleById.infantry)}" d="M0 0 H100 V17.3333 H${n(commsEnd)} C${n(commsPct + 4)} 17.3333 ${n(commsPct + 2)} 26 ${n(commsPct)} 26 H${n(leaderEnd)} C${n(leaderPct + 4)} 26 ${n(leaderPct + 2)} 52 ${n(leaderPct)} 52 H0 Z"><title>${roleById.infantry.title}</title></path>
        <path class="service-flow service-flow--leader" tabindex="0" role="button" aria-expanded="false" aria-label="${roleAria(roleById.leader)}" d="M${n(leaderPct)} 52 C${n(leaderPct + 2)} 52 ${n(leaderPct + 4)} 26 ${n(leaderEnd)} 26 H${n(commsPct)} C${n(commsPct + 2)} 26 ${n(commsPct + 4)} 17.3333 ${n(commsEnd)} 17.3333 H100 V34.6666 H${n(commsEnd)} C${n(commsPct + 4)} 34.6666 ${n(commsPct + 2)} 52 ${n(commsPct)} 52 H${n(leaderPct)} Z"><title>${roleById.leader.title}</title></path>
        <path class="service-flow service-flow--comms" tabindex="0" role="button" aria-expanded="false" aria-label="${roleAria(roleById.comms)}" d="M${n(commsPct)} 52 C${n(commsPct + 2)} 52 ${n(commsPct + 4)} 34.6666 ${n(commsEnd)} 34.6666 H100 V52 Z"><title>${roleById.comms.title}</title></path>
      </svg>
      <svg class="service-sankey service-sankey--officer" viewBox="0 0 100 52" preserveAspectRatio="none" role="group" aria-label="Officer Commissioning Candidate, July 2025 through expected commissioning in May 2027">
        <path class="service-flow service-flow--officer" tabindex="0" role="button" aria-expanded="false" aria-label="${roleAria(officerRole)}" d="M0 0 H100 V52 H0 Z"><title>${officerRole.title}</title></path>
      </svg>
      ${militaryTimelineData.roles.map((role) => {
        const labelX = role.id === "officer"
          ? "var(--officer-label-x)"
          : "var(--officer-start)";
        const labelY = role.id === "infantry" ? "12px" : role.id === "leader" ? "36px" : role.id === "comms" ? "60px" : "36px";
        return `<span class="service-flow-label service-flow-label--${role.id}" style="--label-x:${labelX};--label-y:${labelY};" aria-hidden="true">${role.labelLines.join("<br>")}</span>`;
      }).join("")}
    `;

    const unitMarkup = militaryTimelineData.units.map((unit) => `
      <div class="unit-event${unit.className ? " " + unit.className : ""}" data-event-id="${unit.id}" style="--x:${pos(unit.date)};" tabindex="0" role="button" aria-expanded="false" aria-label="${unit.name}, ${unit.dateLabel}">
        <span class="unit-event-label">
          <strong class="unit-event-name">${unit.name}</strong>
          <time class="unit-event-date" datetime="${unit.datetime}">${unit.dateLabel}</time>
        </span>
        <img src="${unit.image}" alt="${unit.alt}" loading="lazy">
      </div>
    `).join("");

    const trainingMarkup = militaryTimelineData.training.map((event) => `
      <button class="training-event${event.className ? " " + event.className : ""}" type="button" data-event-id="${event.id}" style="--x:${pos(event.date)};" aria-label="${event.dateLabel} — ${event.title}" aria-expanded="false">
        <span class="training-popover" aria-hidden="true">
          <img${event.logoClass ? ` class="${event.logoClass}"` : ""} src="${event.logo}" alt="">
          <span class="training-popover-box">
            <strong class="training-popover-title">${event.title}</strong>
            <span class="training-popover-school">${event.school}</span>
            <span class="training-popover-meta">${event.dateLabel}</span>
          </span>
        </span>
        <span class="qualification-icon" aria-hidden="true">${militaryTrainingIcons[event.icon]}</span>
      </button>
    `).join("");

    const rankMarkup = militaryTimelineData.ranks.map((rank) => {
      const insignia = rank.officer
        ? '<svg class="rank-insignia-svg rank-insignia-officer" viewBox="0 0 18 48" role="img" aria-label="Second Lieutenant gold bar rank insignia"><rect x="2.25" y="1.5" width="13.5" height="45" rx="1.6" fill="#c7a347" stroke="#7e672b" stroke-width="1.5"></rect><rect x="4.25" y="3.8" width="9.5" height="40.4" rx="1.1" fill="#ddb95a" opacity=".86"></rect></svg>'
        : `<img class="rank-insignia" src="${rank.image}" alt="${rank.alt}" loading="lazy">`;
      return `
        <div class="rank-event${rank.className ? " " + rank.className : ""}" data-event-id="${rank.id}" style="--x:${pos(rank.date)};" tabindex="0" role="button" aria-expanded="false" aria-label="${rank.abbr}, ${rank.name}, ${rank.status ? "expected " : ""}${rank.dateLabel}">
          <span class="rank-event-marker" aria-hidden="true"></span>
          <span class="rank-insignia-wrap">${insignia}</span>
          <span class="rank-event-abbr">${rank.abbr}</span>
          <span class="rank-event-detail">
            <strong class="rank-event-name">${rank.name}</strong>
            <time class="rank-event-date" datetime="${rank.datetime}">${rank.dateLabel}</time>
            ${rank.status ? `<span class="rank-event-status">${rank.status}</span>` : ""}
          </span>
        </div>
      `;
    }).join("");

    canvas.innerHTML = `
      <span class="past-service-continuation" aria-hidden="true"></span>
      <div class="timeline-line" style="--from:0%;--to:var(--today);" aria-hidden="true"></div>
      <div class="timeline-line projected" style="--from:var(--today);--to:100%;" aria-hidden="true"></div>
      <span class="current-day-marker" aria-hidden="true"></span>
      <span class="current-day-label" aria-hidden="true">${militaryTimelineData.todayLabel}</span>
      ${yearTicks.join("")}
      ${serviceMarkup}
      ${unitMarkup}
      ${trainingMarkup}
      ${rankMarkup}
      <span class="future-service-continuation" aria-hidden="true"></span>
    `;

    return canvas;
  }

  const currentServiceRow = renderMilitaryTimeline();

  const mountainStage = document.getElementById("mountain-ascent-stage");
  const mountainScroll = document.getElementById("mountain-ascent-scroll");
  const mountainSvg = document.getElementById("mountain-ascent-svg");
  const mountainPopover = document.getElementById("mountain-popover");

  if (mountainStage && mountainScroll && mountainSvg && mountainPopover) {
    // Curated silhouette lineup. Minor route/highpoint entries and the shortest
    // profiles are intentionally omitted so each remaining mountain can read as
    // a recognizable individual form rather than a compressed elevation mark.
    const mountainData = [
      {
        name: "Rendezvous Peak",
        relief: "rendezvous",
        x: 220,
        displayWidth: 180,
        labelRow: 0,
        location: "Chugach Mountains, Alaska",
        date: "Date TBD",
        elevationFt: 4050,
        type: "Summit",
        note: "A compact Arctic Valley summit with a steep pyramidal face and a long descending shoulder.",
        image: ""
      },
      {
        name: "Gold Star Peak",
        relief: "gold-star",
        x: 370,
        displayWidth: 180,
        labelRow: 1,
        location: "Chugach State Park, Alaska",
        date: "Jun 2024",
        elevationFt: 4148,
        type: "Summit",
        note: "A compact rocky Chugach summit with a sharp upper crown.",
        image: ""
      },
      {
        name: "Mount Gordon Lyon",
        relief: "gordon-lyon",
        x: 525,
        displayWidth: 240,
        labelRow: 2,
        location: "Chugach Mountains, Alaska",
        date: "Date TBD",
        elevationFt: 4100,
        type: "Summit",
        note: "A broad tundra-covered Chugach summit above Arctic Valley with rounded shoulders.",
        image: ""
      },
      {
        name: "East Twin Peak",
        relief: "east-twin",
        signature: "eastTwin",
        x: 700,
        displayWidth: 300,
        labelRow: 0,
        location: "Chugach Mountains, Alaska",
        date: "Feb 2023",
        elevationFt: 5873,
        type: "Summit",
        note: "A craggy Chugach summit block with a visibly broken, twin-crested upper ridge.",
        image: ""
      },
      {
        name: "Mount Healy",
        relief: "healy",
        signature: "healy",
        x: 850,
        displayWidth: 340,
        labelRow: 2,
        location: "Denali region, Alaska",
        date: "May 2024",
        elevationFt: 5716,
        type: "Mountain",
        note: "A long Alaska Range ridge with a broad crest rather than a single isolated point.",
        image: ""
      },
      {
        name: "Mount Fuji",
        relief: "fuji",
        signature: "fuji",
        x: 650,
        displayWidth: 650,
        labelRow: 1,
        location: "Japan",
        date: "Jul 2024",
        elevationFt: 12388,
        type: "Summit",
        note: "Japan's highest peak, rendered as a broad, iconic volcanic cone.",
        image: ""
      },
      {
        name: "Mount Toubkal",
        relief: "toubkal",
        signature: "toubkal",
        x: 940,
        displayWidth: 500,
        labelRow: 0,
        location: "Atlas Mountains, Morocco",
        date: "May 2019",
        elevationFt: 13671,
        type: "Summit",
        note: "North Africa's highest peak, rendered as a broad asymmetric High Atlas massif.",
        image: ""
      },
      {
        name: "Denali",
        relief: "denali",
        signature: "denali",
        x: 1260,
        displayWidth: 720,
        labelRow: 1,
        location: "Alaska, USA",
        date: "Goal",
        elevationFt: 20310,
        type: "Long-term objective",
        note: "The long-term objective anchoring the composition, rendered as a broad dominant massif.",
        image: "",
        goal: true
      }
    ];

    const SVG_NS = "http://www.w3.org/2000/svg";
    const profileWidth = 1680;
    const profileHeight = 780;
    const plot = { left: 70, right: 1610, top: 90, bottom: 650 };
    const denaliElevation = 20310;
    const demProfiles = window.MOUNTAIN_DEM_PROFILES?.profiles || {};
    let activeMountainPoint = null;

    const popoverImage = document.getElementById("mountain-popover-image");
    const popoverPlaceholder = document.getElementById("mountain-popover-placeholder");
    const popoverType = document.getElementById("mountain-popover-type");
    const popoverName = document.getElementById("mountain-popover-name");
    const popoverLocation = document.getElementById("mountain-popover-location");
    const popoverDate = document.getElementById("mountain-popover-date");
    const popoverElevation = document.getElementById("mountain-popover-elevation");
    const popoverNote = document.getElementById("mountain-popover-note");
    const popoverClose = document.getElementById("mountain-popover-close");

    // Reference-shaped signature profiles. These are deliberately silhouette-first:
    // Fuji follows the broad Lake Shoji-style cone; Denali follows the broad Wonder
    // Lake massif with an asymmetric summit and long shoulders. The waypoint remains
    // the exact published summit elevation; the profile shape is presentation geometry.
    const signatureProfiles = {
      fuji: [
        [-1.00,1.00],[-.94,.965],[-.88,.915],[-.82,.855],[-.76,.790],
        [-.70,.720],[-.64,.650],[-.58,.575],[-.52,.500],[-.46,.425],
        [-.40,.355],[-.34,.290],[-.28,.230],[-.22,.175],[-.16,.125],
        [-.11,.085],[-.07,.055],[-.035,.025],[0,0],[.035,.025],
        [.07,.055],[.11,.085],[.16,.125],[.22,.175],[.28,.230],
        [.34,.290],[.40,.355],[.46,.425],[.52,.500],[.58,.575],
        [.64,.650],[.70,.720],[.76,.790],[.82,.855],[.88,.915],
        [.94,.965],[1.00,1.00]
      ],

      denali: [
        [-1.00,1.00],[-.94,.95],[-.88,.88],[-.82,.80],[-.76,.72],
        [-.69,.65],[-.62,.58],[-.55,.52],[-.48,.46],[-.42,.40],
        [-.36,.36],[-.31,.32],[-.26,.27],[-.21,.24],[-.17,.26],
        [-.13,.20],[-.09,.17],[-.055,.13],[-.025,.105],[.005,.075],
        [.035,.035],[.060,0],[.088,.020],[.12,.045],[.17,.070],
        [.23,.105],[.30,.150],[.38,.205],[.46,.285],[.55,.365],
        [.63,.455],[.71,.555],[.79,.665],[.86,.760],[.92,.845],
        [.97,.930],[1.00,1.00]
      ],

      toubkal: [
        [-1.00,1.00],[-.92,.92],[-.84,.84],[-.76,.76],[-.68,.69],
        [-.60,.61],[-.52,.54],[-.44,.47],[-.36,.40],[-.28,.33],
        [-.20,.25],[-.13,.18],[-.06,.11],[0,0],[.05,.03],[.11,.07],
        [.18,.12],[.26,.19],[.35,.28],[.45,.39],[.56,.51],[.68,.64],
        [.80,.77],[.91,.89],[1.00,1.00]
      ],

      eastTwin: [
        [-1.00,1.00],[-.90,.93],[-.80,.86],[-.70,.77],[-.60,.66],
        [-.50,.55],[-.40,.43],[-.31,.31],[-.24,.21],[-.18,.13],
        [-.13,.08],[-.09,.05],[-.05,.03],[-.02,.015],[0,0],[.04,.04],
        [.08,.07],[.12,.05],[.17,.08],[.22,.14],[.28,.22],[.36,.31],
        [.46,.43],[.58,.57],[.72,.72],[.86,.87],[1.00,1.00]
      ],

      healy: [
        [-1.00,1.00],[-.92,.92],[-.84,.84],[-.76,.77],[-.68,.70],
        [-.60,.63],[-.52,.56],[-.44,.49],[-.36,.43],[-.28,.37],
        [-.20,.31],[-.12,.25],[-.04,.20],[.03,.15],[.10,.11],[.16,.08],
        [.21,.06],[.27,.04],[.34,.03],[.41,.01],[.46,0],[.52,.03],
        [.60,.08],[.68,.15],[.77,.24],[.86,.36],[.94,.50],[1.00,1.00]
      ]
    };

    function svgNode(tag, attrs = {}, parent = mountainSvg) {
      const node = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
      parent.appendChild(node);
      return node;
    }

    function elevationY(elevationFt) {
      const ratio = Math.max(0, Math.min(1, elevationFt / denaliElevation));
      return plot.bottom - ratio * (plot.bottom - plot.top);
    }

    function ridgePath(points) {
      if (!points.length) return "";
      return points
        .map((point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
        )
        .join(" ");
    }

    function selectProfileSamples(samples) {
      if (samples.length <= 12) return samples;

      const selected = [samples[0]];
      const summitIndex = Math.floor(samples.length / 2);

      for (let i = 1; i < samples.length - 1; i += 1) {
        const previous = Number(samples[i - 1].elevation_m);
        const current = Number(samples[i].elevation_m);
        const next = Number(samples[i + 1].elevation_m);
        const slopeIn = current - previous;
        const slopeOut = next - current;
        const turningPoint = slopeIn === 0 || slopeOut === 0 || slopeIn * slopeOut < 0;
        const summitNeighborhood = Math.abs(i - summitIndex) <= 2;

        if (turningPoint || summitNeighborhood || i % 4 === 0) {
          selected.push(samples[i]);
        }
      }

      selected.push(samples[samples.length - 1]);
      return selected;
    }

    function buildDemGeometry(profile, summitX, summitY, horizonY, displayWidth) {
      if (!profile?.samples?.length || !profile.dem_summit) return null;

      const summitElevation = Number(profile.dem_summit.elevation_m);
      const minimumElevation = Number(profile.min_elevation_m);
      const radiusKm = Number(profile.radius_km);
      const reliefMeters = summitElevation - minimumElevation;
      const displayHeight = horizonY - summitY;

      if (
        !Number.isFinite(summitElevation) ||
        !Number.isFinite(minimumElevation) ||
        !Number.isFinite(radiusKm) ||
        reliefMeters <= 0 ||
        displayHeight <= 0 ||
        radiusKm <= 0
      ) {
        return null;
      }

      const pixelsPerMeter = displayHeight / reliefMeters;
      const samples = selectProfileSamples(profile.samples);
      const coords = samples
        .map((sample) => ({
          distanceKm: Number(sample.distance_km),
          elevationM: Number(sample.elevation_m)
        }))
        .filter((sample) =>
          Number.isFinite(sample.distanceKm) && Number.isFinite(sample.elevationM)
        )
        .map((sample) => ({
          x: summitX + (sample.distanceKm / radiusKm) * displayWidth / 2,
          y: summitY + (summitElevation - sample.elevationM) * pixelsPerMeter
        }));

      if (coords.length < 2) return null;

      const ridgeD = ridgePath(coords);
      const first = coords[0];
      const last = coords[coords.length - 1];
      const fillD =
        `${ridgeD} L ${last.x.toFixed(2)} ${horizonY.toFixed(2)} ` +
        `L ${first.x.toFixed(2)} ${horizonY.toFixed(2)} Z`;

      return { ridgeD, fillD };
    }

    function buildSignatureGeometry(points, summitX, summitY, horizonY, displayWidth) {
      if (!points?.length) return null;

      const displayHeight = horizonY - summitY;
      const coords = points.map(([x, y]) => ({
        x: summitX + x * displayWidth / 2,
        y: summitY + y * displayHeight
      }));

      const ridgeD = ridgePath(coords);
      const first = coords[0];
      const last = coords[coords.length - 1];
      const fillD =
        `${ridgeD} L ${last.x.toFixed(2)} ${horizonY.toFixed(2)} ` +
        `L ${first.x.toFixed(2)} ${horizonY.toFixed(2)} Z`;

      return { ridgeD, fillD };
    }

    function buildMountainProfile() {
      mountainSvg.querySelectorAll(".mountain-generated").forEach((node) => node.remove());

      const horizonY = plot.bottom;

      const defs = svgNode("defs", { class: "mountain-generated" });
      const gradient = svgNode("linearGradient", {
        id: "mountain-silhouette-gradient",
        x1: "0%",
        y1: "0%",
        x2: "0%",
        y2: "100%"
      }, defs);
      svgNode("stop", { offset: "0%", "stop-color": "#594452", "stop-opacity": ".78" }, gradient);
      svgNode("stop", { offset: "48%", "stop-color": "#2c222b", "stop-opacity": ".90" }, gradient);
      svgNode("stop", { offset: "100%", "stop-color": "#0e0b10", "stop-opacity": ".98" }, gradient);

      [0, 5000, 10000, 15000, 20000].forEach((elevation) => {
        const y = elevationY(elevation);
        svgNode("line", {
          class: "mountain-generated mountain-guide",
          x1: plot.left,
          y1: y,
          x2: plot.right,
          y2: y
        });
        const label = svgNode("text", {
          class: "mountain-generated mountain-guide-label",
          x: 18,
          y: y + 5
        });
        label.textContent = elevation === 0 ? "0 FT" : `${elevation / 1000}K`;
      });

      const plotted = mountainData.map((point) => ({
        ...point,
        y: elevationY(point.elevationFt)
      }));

      // Broad signature mountains are painted first; smaller profiles then sit
      // cleanly in their own dedicated slots without being swallowed by them.
      [...plotted]
        .sort((a, b) => b.elevationFt - a.elevationFt)
        .forEach((point) => {
          const profile = demProfiles[point.relief];
          const signature = point.signature ? signatureProfiles[point.signature] : null;
          const geometry = signature
            ? buildSignatureGeometry(signature, point.x, point.y, horizonY, point.displayWidth)
            : buildDemGeometry(profile, point.x, point.y, horizonY, point.displayWidth);

          if (!geometry) return;

          const classes = [
            "mountain-generated",
            "mountain-peak-relief",
            `mountain-peak-relief--${point.relief}`
          ];
          if (point.signature) classes.push("mountain-peak-relief--signature");
          if (point.goal) classes.push("mountain-peak-relief--goal");
          if (point.elevationFt >= 12000) classes.push("mountain-peak-relief--back");
          else if (point.elevationFt >= 5500) classes.push("mountain-peak-relief--mid");
          else classes.push("mountain-peak-relief--front");

          const group = svgNode("g", { class: classes.join(" ") });
          const profileTitle = svgNode("title", {}, group);
          profileTitle.textContent = point.signature
            ? `${point.name}: reference-shaped signature silhouette`
            : `${point.name}: ${profile?.characteristic_view || "characteristic DEM profile"}`;

          svgNode("path", {
            class: "mountain-peak-relief-fill",
            d: geometry.fillD
          }, group);

          svgNode("path", {
            class: "mountain-peak-relief-ridge",
            d: geometry.ridgeD
          }, group);
        });

      plotted.forEach((point) => {
        const group = svgNode("g", {
          class: `mountain-generated mountain-waypoint${point.goal ? " is-goal" : ""}`,
          transform: `translate(${point.x} ${point.y})`,
          tabindex: "0",
          role: "button",
          "aria-label": `${point.name}, ${point.location}, ${point.date}, ${point.elevationFt.toLocaleString()} feet`
        });

        if (point.goal) {
          svgNode("circle", {
            class: "mountain-goal-halo",
            r: 18
          }, group);
        }

        svgNode("circle", {
          class: "mountain-waypoint-hit",
          r: point.goal ? 32 : 28
        }, group);
        svgNode("circle", {
          class: "mountain-waypoint-ring",
          r: point.goal ? 8.5 : 6.5
        }, group);
        svgNode("circle", {
          class: "mountain-waypoint-core",
          r: point.goal ? 3.7 : 2.7
        }, group);

        group.addEventListener("pointerenter", () => openMountainPopover(point, group));
        group.addEventListener("focus", () => openMountainPopover(point, group));
        group.addEventListener("click", (event) => {
          event.stopPropagation();
          openMountainPopover(point, group);
        });
        group.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMountainPopover(point, group);
          }
        });

        const labelOffset = (point.labelRow || 0) * 34;
        const label = svgNode("text", {
          class: `mountain-generated mountain-profile-label${point.goal ? " is-goal" : ""}`,
          x: point.x,
          y: horizonY + 30 + labelOffset,
          "text-anchor": "middle"
        });
        label.textContent = point.name;

        const meta = svgNode("text", {
          class: `mountain-generated mountain-profile-meta${point.goal ? " is-goal" : ""}`,
          x: point.x,
          y: horizonY + 48 + labelOffset,
          "text-anchor": "middle"
        });
        meta.textContent = point.goal
          ? `GOAL · ${point.elevationFt.toLocaleString()} FT`
          : `${point.elevationFt.toLocaleString()} FT`;
      });
    }

    function updateWaypointHitTargets() {
      const renderedWidth = mountainSvg.getBoundingClientRect().width || profileWidth;
      const renderedScale = Math.max(renderedWidth / profileWidth, .001);
      const minimumRadius = 22 / renderedScale;

      mountainSvg.querySelectorAll(".mountain-waypoint").forEach((group) => {
        const hit = group.querySelector(".mountain-waypoint-hit");
        if (!hit) return;
        const baseRadius = group.classList.contains("is-goal") ? 32 : 28;
        hit.setAttribute("r", Math.max(baseRadius, minimumRadius).toFixed(2));
      });
    }

    function positionMountainPopover(point) {
      const svgRect = mountainSvg.getBoundingClientRect();
      const stageRect = mountainStage.getBoundingClientRect();
      const scaleX = svgRect.width / profileWidth;
      const scaleY = svgRect.height / profileHeight;
      const pointLeft =
        (point.x * scaleX) + (svgRect.left - stageRect.left);
      const pointTop =
        (point.y * scaleY) + (svgRect.top - stageRect.top);
      const popoverWidth = mountainPopover.offsetWidth || 270;
      const popoverHeight = mountainPopover.offsetHeight || 300;
      const viewportLeft = 8;
      const viewportRight = mountainStage.clientWidth - 8;
      const viewportTop = Math.max(8, 8 - stageRect.top);
      const viewportBottom = Math.min(
        mountainStage.clientHeight - 8,
        window.innerHeight - stageRect.top - 8
      );

      let left = pointLeft + 16;
      let top = pointTop - Math.min(48, popoverHeight * .2);

      if (left + popoverWidth > viewportRight) {
        left = pointLeft - popoverWidth - 16;
      }
      if (left < viewportLeft) left = viewportLeft;
      if (top + popoverHeight > viewportBottom) {
        top = viewportBottom - popoverHeight;
      }
      if (top < viewportTop) top = viewportTop;

      mountainPopover.style.left = `${left}px`;
      mountainPopover.style.top = `${top}px`;
    }

    function openMountainPopover(point, group) {
      if (activeMountainPoint && activeMountainPoint !== group) {
        activeMountainPoint.classList.remove("is-active");
      }
      activeMountainPoint = group;
      group.classList.add("is-active");

      popoverType.textContent = point.type;
      popoverName.textContent = point.name;
      popoverLocation.textContent = point.location;
      popoverDate.textContent = point.date;
      popoverElevation.textContent = `${point.elevationFt.toLocaleString()} ft`;
      popoverNote.textContent = point.note || "";

      if (point.image) {
        popoverImage.src = point.image;
        popoverImage.alt = `${point.name} climb photograph`;
        popoverImage.hidden = false;
        popoverPlaceholder.hidden = true;
      } else {
        popoverImage.removeAttribute("src");
        popoverImage.alt = "";
        popoverImage.hidden = true;
        popoverPlaceholder.hidden = false;
      }

      mountainPopover.classList.add("is-open");
      mountainPopover.setAttribute("aria-hidden", "false");

      requestAnimationFrame(() => positionMountainPopover(point));
      mountainPopover.dataset.activeName = point.name;
    }

    function closeMountainPopover() {
      mountainPopover.classList.remove("is-open");
      mountainPopover.setAttribute("aria-hidden", "true");
      mountainPopover.removeAttribute("data-active-name");
      if (activeMountainPoint) activeMountainPoint.classList.remove("is-active");
      activeMountainPoint = null;
    }

    buildMountainProfile();
    updateWaypointHitTargets();

    mountainStage.addEventListener("pointerleave", (event) => {
      if (!event.relatedTarget || !mountainStage.contains(event.relatedTarget)) closeMountainPopover();
    });

    mountainStage.addEventListener("click", (event) => {
      if (!event.target.closest(".mountain-waypoint") && !event.target.closest(".mountain-popover")) {
        closeMountainPopover();
      }
    });

    popoverClose?.addEventListener("click", (event) => {
      event.stopPropagation();
      closeMountainPopover();
    });

    function repositionOpenMountainPopover() {
      if (!mountainPopover.classList.contains("is-open") || !activeMountainPoint) return;
      const pointName = mountainPopover.dataset.activeName;
      const point = mountainData.find((item) => item.name === pointName);
      const transform = activeMountainPoint.getAttribute("transform") || "";
      const match = transform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
      if (point && match) {
        positionMountainPopover({
          ...point,
          x: Number(match[1]),
          y: Number(match[2])
        });
      }
    }

    window.addEventListener("resize", () => {
      updateWaypointHitTargets();
      repositionOpenMountainPopover();
    });
    mountainScroll.addEventListener("scroll", repositionOpenMountainPopover, {
      passive: true
    });
  }

    const timelineDetailEvents = currentServiceRow ? [...currentServiceRow.querySelectorAll(".unit-event, .rank-event")] : [];
  const trainingEvents = currentServiceRow ? [...currentServiceRow.querySelectorAll(".training-event")] : [];
  const serviceFlows = currentServiceRow ? [...currentServiceRow.querySelectorAll(".service-flow")] : [];

  function setTimelineDetailState(timelineEvent, isOpen) {
    timelineEvent.classList.toggle("is-detail-open", isOpen);
    timelineEvent.setAttribute("aria-expanded", String(isOpen));
  }

  function setTrainingEventState(trainingEvent, isOpen) {
    trainingEvent.classList.toggle("is-open", isOpen);
    trainingEvent.setAttribute("aria-expanded", String(isOpen));
    trainingEvent.querySelector(".training-popover")?.setAttribute("aria-hidden", String(!isOpen));
  }

  function setServiceFlowState(serviceFlow, isOpen) {
    serviceFlow.classList.toggle("is-open", isOpen);
    serviceFlow.setAttribute("aria-expanded", String(isOpen));
  }

  function closeTimelineInteractions(except = null) {
    timelineDetailEvents.forEach((timelineEvent) => {
      if (timelineEvent !== except) setTimelineDetailState(timelineEvent, false);
    });
    trainingEvents.forEach((trainingEvent) => {
      if (trainingEvent !== except) setTrainingEventState(trainingEvent, false);
    });
    serviceFlows.forEach((serviceFlow) => {
      if (serviceFlow !== except) setServiceFlowState(serviceFlow, false);
    });
  }

  timelineDetailEvents.forEach((timelineEvent) => {
    const toggle = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !timelineEvent.classList.contains("is-detail-open");
      closeTimelineInteractions(timelineEvent);
      setTimelineDetailState(timelineEvent, willOpen);
    };

    timelineEvent.addEventListener("click", toggle);
    timelineEvent.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") toggle(event);
    });
  });

  trainingEvents.forEach((trainingEvent) => {
    trainingEvent.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !trainingEvent.classList.contains("is-open");
      closeTimelineInteractions(trainingEvent);
      setTrainingEventState(trainingEvent, willOpen);
    });
  });

  serviceFlows.forEach((serviceFlow) => {
    const toggle = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !serviceFlow.classList.contains("is-open");
      closeTimelineInteractions(serviceFlow);
      setServiceFlowState(serviceFlow, willOpen);
    };

    serviceFlow.addEventListener("click", toggle);
    serviceFlow.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") toggle(event);
    });
  });

  if (timelineDetailEvents.length || trainingEvents.length || serviceFlows.length) {
    document.addEventListener("click", () => closeTimelineInteractions());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeTimelineInteractions();
    });
  }

  const books = [
    {
      title: "An Introduction to Statistical Learning",
      short: "ISL",
      status: "current",
      tone: "oxblood",
      note: "A core reference for statistical learning: broad enough to revisit constantly and practical enough to keep open while working."
    },
    {
      title: "R for Data Science",
      short: "R4DS",
      status: "current",
      tone: "plum",
      note: "A working reference for the everyday craft of turning raw data into something inspectable, reproducible, and useful."
    },
    {
      title: "Text Mining with R",
      short: "Text Mining",
      status: "current",
      tone: "slate",
      note: "A bridge between tidyverse habits and the text-as-data problems that increasingly show up in my work."
    },
    {
      title: "Speech and Language Processing",
      short: "SLP",
      status: "current",
      tone: "wine",
      note: "The larger technical map for NLP, speech, language models, representation, and computational language."
    },
    {
      title: "Eighty-Six",
      short: "Eighty-Six",
      status: "current",
      tone: "parchment",
      note: "One of my favorite fictional worlds: war, exclusion, loyalty, political systems, loss, and people trying to remain human inside machinery designed to erase them."
    },
    {
      title: "Regression and Other Stories",
      short: "Regression",
      status: "recent",
      tone: "wine",
      note: "A practical book about regression, but just as useful as a book about statistical judgment and model checking."
    },
    {
      title: "American Caesar",
      short: "American Caesar",
      status: "recent",
      tone: "olive",
      note: "Biography and military history through a character large enough to make institutional, strategic, and personal stories collide."
    },
    {
      title: "The Coldest Winter",
      short: "Coldest Winter",
      status: "recent",
      tone: "blue",
      note: "A Korean War history that moves effectively between battlefield experience, command decisions, politics, and the cost of bad assumptions."
    },
    {
      title: "Deep Learning",
      short: "Deep Learning",
      status: "next",
      tone: "oxblood",
      note: "Next in the queue: a deeper pass through neural networks, representation learning, and modern machine-learning foundations."
    }
  ];

  const statusText = {
    current: "Reading now",
    recent: "Recently read",
    next: "Up next"
  };

  const shelfTargets = {
    current: document.getElementById("current-shelf"),
    recent: document.getElementById("recent-shelf"),
    next: document.getElementById("next-shelf")
  };

  const bookStatus = document.getElementById("book-status");
  const bookTitle = document.getElementById("book-title");
  const bookCopy = document.getElementById("book-copy");

  let activeBookButton = null;

  function inspectBook(book, button) {
    if (activeBookButton && activeBookButton !== button) activeBookButton.classList.remove("is-active");
    if (button) {
      button.classList.add("is-active");
      activeBookButton = button;
    }
    if (bookStatus) bookStatus.textContent = statusText[book.status] || "";
    if (bookTitle) bookTitle.textContent = book.title;
    if (bookCopy) bookCopy.textContent = book.note;
  }

  books.forEach((book, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "book-spine " + book.tone;
    button.style.setProperty("--h", (88 + (index % 4) * 6) + "px");
    button.style.setProperty("--w", (32 + (index % 3) * 4) + "px");
    button.setAttribute("aria-label", book.title);

    const title = document.createElement("span");
    title.className = "book-title";
    title.textContent = book.short;
    button.appendChild(title);

    button.addEventListener("click", () => inspectBook(book, button));
    button.addEventListener("focus", () => inspectBook(book, button));

    const target = shelfTargets[book.status];
    if (target) target.appendChild(button);
  });

  const firstBook = books[0];
  const firstButton = document.querySelector(".book-spine");
  if (firstBook && firstButton) inspectBook(firstBook, firstButton);
})();
