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
        x: 155,
        displayWidth: 220,
        location: "Chugach Mountains, Alaska",
        date: "Date TBD",
        elevationFt: 4050,
        type: "Summit",
        note: "A compact Arctic Valley summit with a steep pyramidal face and a long descending shoulder.",
        image: ""
      },
      {
        name: "Mount Gordon Lyon",
        relief: "gordon-lyon",
        x: 405,
        displayWidth: 255,
        location: "Chugach Mountains, Alaska",
        date: "Date TBD",
        elevationFt: 4100,
        type: "Summit",
        note: "A broad tundra-covered Chugach summit above Arctic Valley with rounded shoulders.",
        image: ""
      },
      {
        name: "Gold Star Peak",
        relief: "gold-star",
        x: 650,
        displayWidth: 220,
        location: "Chugach State Park, Alaska",
        date: "Jun 2024",
        elevationFt: 4148,
        type: "Summit",
        note: "A compact rocky Chugach summit with a sharp upper crown.",
        image: ""
      },
      {
        name: "Mount Healy",
        relief: "healy",
        x: 915,
        displayWidth: 320,
        location: "Denali region, Alaska",
        date: "May 2024",
        elevationFt: 5716,
        type: "Mountain",
        note: "A long Alaska Range ridge immediately outside the developed core of Denali National Park.",
        image: ""
      },
      {
        name: "East Twin Peak",
        relief: "east-twin",
        x: 1195,
        displayWidth: 320,
        location: "Chugach Mountains, Alaska",
        date: "Feb 2023",
        elevationFt: 5873,
        type: "Summit",
        note: "A craggy Chugach summit block with a visibly broken upper ridge.",
        image: ""
      },
      {
        name: "Mount Fuji",
        relief: "fuji",
        signature: "fuji",
        x: 1490,
        displayWidth: 570,
        location: "Japan",
        date: "Jul 2024",
        elevationFt: 12388,
        type: "Summit",
        note: "Japan's highest peak, rendered here with its broad, nearly symmetrical volcanic cone.",
        image: ""
      },
      {
        name: "Mount Toubkal",
        relief: "toubkal",
        x: 1810,
        displayWidth: 430,
        location: "Atlas Mountains, Morocco",
        date: "May 2019",
        elevationFt: 13671,
        type: "Summit",
        note: "The highest peak in North Africa, shown as a rugged asymmetric High Atlas massif.",
        image: ""
      },
      {
        name: "Denali",
        relief: "denali",
        signature: "denali",
        x: 2110,
        displayWidth: 720,
        location: "Alaska, USA",
        date: "Goal",
        elevationFt: 20310,
        type: "Long-term objective",
        note: "The long-term objective anchoring the composition, rendered as a broad asymmetric massif rather than a narrow summit spike.",
        image: "",
        goal: true
      }
    ];

    const SVG_NS = "http://www.w3.org/2000/svg";
    const profileWidth = 2400;
    const profileHeight = 780;
    const plot = { left: 80, right: 2320, top: 70, bottom: 650 };
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
        [-1.00,1.00],[-.93,.95],[-.86,.89],[-.78,.81],[-.70,.72],
        [-.62,.63],[-.54,.54],[-.46,.45],[-.38,.36],[-.30,.28],
        [-.22,.20],[-.15,.13],[-.09,.075],[-.04,.035],[0,0],
        [.04,.035],[.09,.075],[.15,.13],[.22,.20],[.30,.28],
        [.38,.36],[.46,.45],[.54,.54],[.62,.63],[.70,.72],
        [.78,.81],[.86,.89],[.93,.95],[1.00,1.00]
      ],
      denali: [
        [-1.00,1.00],[-.94,.92],[-.88,.84],[-.82,.76],[-.76,.69],
        [-.70,.62],[-.64,.55],[-.58,.49],[-.52,.43],[-.46,.38],
        [-.40,.34],[-.34,.30],[-.28,.25],[-.22,.21],[-.17,.18],
        [-.12,.20],[-.07,.14],[-.02,.095],[.035,.00],[.09,.035],
        [.15,.065],[.22,.11],[.30,.17],[.38,.24],[.47,.32],
        [.57,.42],[.67,.53],[.77,.65],[.87,.79],[.94,.90],[1.00,1.00]
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
        .sort((a, b) => b.displayWidth - a.displayWidth)
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

        const label = svgNode("text", {
          class: `mountain-generated mountain-profile-label${point.goal ? " is-goal" : ""}`,
          x: point.x,
          y: horizonY + 32,
          "text-anchor": "middle"
        });
        label.textContent = point.name;

        const meta = svgNode("text", {
          class: `mountain-generated mountain-profile-meta${point.goal ? " is-goal" : ""}`,
          x: point.x,
          y: horizonY + 53,
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

  if (currentServiceRow) {
    const toUtcDay = (value) => Date.parse(value + "T00:00:00Z");
    const start = toUtcDay(currentServiceRow.dataset.start);
    const end = toUtcDay(currentServiceRow.dataset.end);
    const today = new Date();
    const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));

    currentServiceRow.style.setProperty("--today", pct.toFixed(4) + "%");
  }

  const trainingEvents = [...document.querySelectorAll(".training-event")];

  function setTrainingEventState(trainingEvent, isOpen) {
    trainingEvent.classList.toggle("is-open", isOpen);
    trainingEvent.setAttribute("aria-expanded", String(isOpen));
    trainingEvent.querySelector(".training-popover")?.setAttribute("aria-hidden", String(!isOpen));
  }

  function closeTrainingEvents(except = null) {
    trainingEvents.forEach((trainingEvent) => {
      if (trainingEvent !== except) setTrainingEventState(trainingEvent, false);
    });
  }

  trainingEvents.forEach((trainingEvent) => {
    trainingEvent.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      const willOpen = !trainingEvent.classList.contains("is-open");
      closeTrainingEvents(trainingEvent);
      setTrainingEventState(trainingEvent, willOpen);
    });
  });

  if (trainingEvents.length) {
    document.addEventListener("click", () => closeTrainingEvents());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeTrainingEvents();
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
