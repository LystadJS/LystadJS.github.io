/* About page interactions: mountain ascent, military timeline, training popovers, and bookshelf. */

(() => {
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

  const currentServiceRow = document.querySelector(".current-service-row");

  const toUtcDay = (value) => Date.parse(value + "T00:00:00Z");
  const clampPct = (value) => Math.max(0, Math.min(100, value));
  const pctBetween = (value, start, end) =>
    clampPct(((value - start) / (end - start)) * 100);

  if (currentServiceRow) {
    const start = toUtcDay(currentServiceRow.dataset.start);
    const end = toUtcDay(currentServiceRow.dataset.end);
    const officerStart = toUtcDay(currentServiceRow.dataset.officerStart);

    currentServiceRow.querySelectorAll("[data-date]").forEach((eventNode) => {
      const eventDate = toUtcDay(eventNode.dataset.date);
      if (Number.isFinite(eventDate)) {
        eventNode.style.setProperty("--x", pctBetween(eventDate, start, end).toFixed(4) + "%");
      }
    });

    if (Number.isFinite(officerStart)) {
      const officerPct = pctBetween(officerStart, start, end);
      currentServiceRow.style.setProperty("--officer-start", officerPct.toFixed(4) + "%");
      currentServiceRow.style.setProperty(
        "--officer-label-x",
        ((officerPct + 100) / 2).toFixed(4) + "%"
      );

      const preOfficerSankey = currentServiceRow.querySelector(".service-sankey--preofficer");
      if (preOfficerSankey) {
        const leaderStart = toUtcDay(preOfficerSankey.dataset.leaderStart);
        const commsStart = toUtcDay(preOfficerSankey.dataset.commsStart);
        const leaderPct = pctBetween(leaderStart, start, officerStart);
        const commsPct = pctBetween(commsStart, start, officerStart);
        const transitionWidth = 6;
        const leaderEnd = Math.min(100, leaderPct + transitionWidth);
        const commsEnd = Math.min(100, commsPct + transitionWidth);
        const n = (value) => Number(value.toFixed(4));

        preOfficerSankey.querySelector(".service-flow--infantry")?.setAttribute(
          "d",
          `M0 0 H100 V17.3333 H${n(commsEnd)} C${n(commsPct + 4)} 17.3333 ${n(commsPct + 2)} 26 ${n(commsPct)} 26 H${n(leaderEnd)} C${n(leaderPct + 4)} 26 ${n(leaderPct + 2)} 52 ${n(leaderPct)} 52 H0 Z`
        );
        preOfficerSankey.querySelector(".service-flow--leader")?.setAttribute(
          "d",
          `M${n(leaderPct)} 52 C${n(leaderPct + 2)} 52 ${n(leaderPct + 4)} 26 ${n(leaderEnd)} 26 H${n(commsPct)} C${n(commsPct + 2)} 26 ${n(commsPct + 4)} 17.3333 ${n(commsEnd)} 17.3333 H100 V34.6666 H${n(commsEnd)} C${n(commsPct + 4)} 34.6666 ${n(commsPct + 2)} 52 ${n(commsPct)} 52 H${n(leaderPct)} Z`
        );
        preOfficerSankey.querySelector(".service-flow--comms")?.setAttribute(
          "d",
          `M${n(commsPct)} 52 C${n(commsPct + 2)} 52 ${n(commsPct + 4)} 34.6666 ${n(commsEnd)} 34.6666 H100 V52 Z`
        );
      }
    }

    const today = new Date();
    const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    currentServiceRow.style.setProperty("--today", pctBetween(now, start, end).toFixed(4) + "%");
  }

  const timelineDetailEvents = [...document.querySelectorAll(".unit-event, .rank-event")];
  const trainingEvents = [...document.querySelectorAll(".training-event")];
  const serviceFlows = [...document.querySelectorAll(".service-flow")];

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
