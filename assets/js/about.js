/* About page interactions: military timeline and training popovers. */

(() => {
  const militaryTimelineData = Object.freeze({
    start: "2021-11-01",
    end: "2027-05-01",
    officerStart: "2025-07-01",
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
        date: "2024-09-01",
        title: "Expert Infantryman Badge",
        school: "Infantry proficiency qualification",
        dateLabel: "Sep 2024",
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
    parachute: '<svg class="badge-icon badge-icon-parachutist" viewBox="0 0 64 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23.8 8.6c.8-3.3 3.5-5.2 8.2-5.2s7.4 1.9 8.2 5.2" stroke-width="1.25"></path><path d="M24.2 8.7H39.8" stroke-width="1.1"></path><path d="M26.3 8.7 32 18.8l5.7-10.1M28.8 8.7 32 18.8m3.2-10.1L32 18.8" stroke-width="1"></path><path d="M23.6 8.8C19.1 5.6 14.5 4.5 9.9 5.2c-3 .4-5.4 1.9-7 4.2 3-.5 5.8-.2 8.5.8-2.8.7-5.2 2-7 3.9 3.1-.3 5.9.3 8.5 1.7-1.9.6-3.5 1.6-4.8 3 5.3-.1 10-1.7 14.3-4.8M40.4 8.8c4.5-3.2 9.1-4.3 13.7-3.6 3 .4 5.4 1.9 7 4.2-3-.5-5.8-.2-8.5.8 2.8.7 5.2 2 7 3.9-3.1-.3-5.9.3-8.5 1.7 1.9.6 3.5 1.6 4.8 3-5.3-.1-10-1.7-14.3-4.8" stroke-width="1.3"></path><path d="M8.4 11.4c4.1-.2 7.6.8 10.4 2.8M6.7 15.4c3.8 0 7.1.9 9.9 2.7M55.6 11.4c-4.1-.2-7.6.8-10.4 2.8M57.3 15.4c-3.8 0-7.1.9-9.9 2.7" stroke-width=".95"></path></svg>',
    snowflake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1.8v20.4M3.17 6.9l17.66 10.2M3.17 17.1 20.83 6.9"></path><path d="m12 5.1-2-2m2 2 2-2m-2 15.8-2 2m2-2 2 2M6 8.55l-2.75-.7M6 8.55l-.75-2.7m12.75 9.6 2.75.7M18 15.45l.75 2.7M6 15.45l-2.75.7M6 15.45l-.75 2.7M18 8.55l2.75-.7M18 8.55l.75-2.7"></path><path d="m9.2 7.25-.7-2.35m6.3 2.35.7-2.35m-6.3 11.85-.7 2.35m6.3-2.35.7 2.35"></path><circle cx="12" cy="12" r="1.15"></circle></svg>',
    mortar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.2c1.85 1.45 2.9 3.25 2.9 5.2v4.1c0 2.2-1.1 4.05-2.9 5.25-1.8-1.2-2.9-3.05-2.9-5.25V7.4c0-1.95 1.05-3.75 2.9-5.2Z"></path><path d="M9.7 7.2h4.6M9.5 12.4h5"></path><path d="M12 16.75v3.05"></path><path d="m12 19.8-3.5 2m3.5-2 3.5 2"></path><path d="m10.1 18.4 1.9 1.4 1.9-1.4"></path></svg>',
    mountain: '<svg class="badge-icon badge-icon-rams-head" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 30.8 29.8 10M10.2 10.2 30 30" stroke-width="1.6"></path><path d="m8.6 9.2 3.4-2.6 1.8 1.7-2.7 3.7M27.9 28.1l3.5 3.7-1.7 1.7-3.8-2.8M28.2 8.8l3.4-2.4 1.7 1.7-2.5 3.6M8.7 28l-3.3 3.7 1.7 1.7 3.7-2.7" stroke-width="1"></path><path d="M20 12.6c-3.2 0-5.7 2.6-5.7 6.5 0 5.9 2.5 10.6 5.7 13.4 3.2-2.8 5.7-7.5 5.7-13.4 0-3.9-2.5-6.5-5.7-6.5Z" stroke-width="1.35"></path><path d="M16.4 15.1c-1.9-4.5-5.4-6.9-8.4-5.8-3.1 1.1-3.7 4.9-1.7 7.5 1.7 2.3 5.1 2.6 7.5.7-2.5.1-4.2-.9-4.5-2.3-.4-1.4.8-2.7 2.5-2.7 1.8 0 3.2 1 4.6 2.6M23.6 15.1c1.9-4.5 5.4-6.9 8.4-5.8 3.1 1.1 3.7 4.9 1.7 7.5-1.7 2.3-5.1 2.6-7.5.7 2.5.1 4.2-.9 4.5-2.3.4-1.4-.8-2.7-2.5-2.7-1.8 0-3.2 1-4.6 2.6" stroke-width="1.5"></path><path d="M17.4 20.1h5.2M18 24.6c1.3 1 2.7 1.5 4 1.5s2.7-.5 4-1.5" stroke-width="1"></path></svg>',
    eib: '<img src="assets/images/about/military/expert-infantry-badge.svg" alt="">'
  });

  function renderMilitaryTimeline() {
    const career = document.getElementById("military-career-timeline");
    const canvas = document.getElementById("military-timeline-canvas");
    if (!career || !canvas) return null;

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
        <path class="service-band-edge service-band-edge--top" d="M0 .7 H100" aria-hidden="true"></path>
        <path class="service-band-edge service-band-edge--bottom" d="M0 51.3 H100" aria-hidden="true"></path>
      </svg>
      <svg class="service-sankey service-sankey--officer" viewBox="0 0 100 52" preserveAspectRatio="none" role="group" aria-label="Officer Commissioning Candidate, July 2025 through expected commissioning in May 2027">
        <path class="service-flow service-flow--officer" tabindex="0" role="button" aria-expanded="false" aria-label="${roleAria(officerRole)}" d="M0 0 H100 V52 H0 Z"><title>${officerRole.title}</title></path>
        <path class="service-band-edge service-band-edge--top" d="M0 .7 H100" aria-hidden="true"></path>
        <path class="service-band-edge service-band-edge--bottom" d="M0 51.3 H100" aria-hidden="true"></path>
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


})();
