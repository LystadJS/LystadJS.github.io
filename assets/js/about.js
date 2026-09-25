/* About page interactions: mountain ascent, military timeline, training popovers, and bookshelf. */

(() => {
  const mountainStage = document.getElementById("mountain-ascent-stage");
  const mountainSvg = document.getElementById("mountain-ascent-svg");
  const mountainPopover = document.getElementById("mountain-popover");

  if (mountainStage && mountainSvg && mountainPopover) {
    const mountainData = [
      {
        name: "Mount Inari",
        flank: "left",
        location: "Kyoto, Japan",
        date: "Jul 2024",
        elevationFt: 764,
        type: "Mountain route",
        note: "A sacred mountain route through Fushimi Inari's shrine precinct and thousands of torii gates.",
        image: ""
      },
      {
        name: "Lion Head",
        relief: "lion-head",
        flank: "left",
        location: "Matanuska Valley, Alaska",
        date: "Date TBD",
        elevationFt: 3185,
        type: "Summit",
        note: "A compact, glacier-scoured rock massif above the Matanuska River and glacier, with a steep cliff face and distinctive head-like summit block.",
        image: ""
      },
      {
        name: "Ōwakudani",
        flank: "right",
        location: "Hakone, Japan",
        date: "Jul 2024",
        elevationFt: 3425,
        type: "Volcanic highpoint",
        note: "Owakudani Station and the volcanic valley sit at roughly 1,044 meters above sea level.",
        image: ""
      },
      {
        name: "Harding Icefield Trail",
        flank: "left",
        location: "Kenai Fjords National Park, Alaska",
        date: "Jun 2024",
        elevationFt: 3527,
        type: "Trail endpoint",
        note: "The published trail-end elevation at the edge of the Harding Icefield; shown as a route highpoint rather than a summit.",
        image: ""
      },
      {
        name: "Rainbow Peak",
        relief: "rainbow",
        flank: "right",
        location: "Chugach Mountains, Alaska",
        date: "Apr 2024",
        elevationFt: 3543,
        type: "Summit",
        note: "A steep Chugach ascent above Turnagain Arm where relief matters more than the absolute summit elevation.",
        image: ""
      },
      {
        name: "Mount Alyeska",
        relief: "alyeska",
        flank: "left",
        location: "Girdwood, Alaska",
        date: "Jun 2024",
        elevationFt: 3939,
        type: "Mountain",
        note: "A coastal Chugach ascent rising directly above Girdwood and Turnagain Arm.",
        image: ""
      },
      {
        name: "Rendezvous Peak",
        relief: "rendezvous",
        flank: "right",
        location: "Chugach Mountains, Alaska",
        date: "Date TBD",
        elevationFt: 4050,
        type: "Summit",
        note: "A compact Arctic Valley summit with a steep triangular face and a longer descending shoulder toward the surrounding Chugach ridges.",
        image: ""
      },
      {
        name: "Mount Gordon Lyon",
        relief: "gordon-lyon",
        flank: "left",
        location: "Chugach Mountains, Alaska",
        date: "Date TBD",
        elevationFt: 4100,
        type: "Summit",
        note: "A broad tundra-covered Chugach summit above Arctic Valley, characterized by rounded shoulders and a comparatively subdued summit crest.",
        image: ""
      },
      {
        name: "Gold Star Peak",
        relief: "gold-star",
        flank: "right",
        location: "Chugach State Park, Alaska",
        date: "Jun 2024",
        elevationFt: 4148,
        type: "Summit",
        note: "A Chugach summit named in honor of Gold Star families.",
        image: ""
      },
      {
        name: "Mount Healy",
        relief: "healy",
        flank: "left",
        location: "Denali region, Alaska",
        date: "May 2024",
        elevationFt: 5716,
        type: "Mountain",
        note: "A steep Alaska Range ridge immediately outside the developed core of Denali National Park.",
        image: ""
      },
      {
        name: "East Twin Peak",
        relief: "east-twin",
        flank: "right",
        location: "Chugach Mountains, Alaska",
        date: "Feb 2023",
        elevationFt: 5873,
        type: "Summit",
        note: "A winter Chugach ascent and one of the climbs that made Alaska the dominant landscape in this collection.",
        image: ""
      },
      {
        name: "Richland Balsam",
        flank: "left",
        location: "Blue Ridge Parkway, North Carolina",
        date: "Jun 2026",
        elevationFt: 6053,
        type: "Highpoint",
        note: "The highest point on the Blue Ridge Parkway motor road.",
        image: ""
      },
      {
        name: "Point Imperial",
        flank: "right",
        location: "Grand Canyon, Arizona",
        date: "Apr 2018",
        elevationFt: 8803,
        type: "Viewpoint",
        note: "The highest point on the Grand Canyon's North Rim; included as a high-elevation waypoint rather than a summit claim.",
        image: ""
      },
      {
        name: "Mount Fuji",
        relief: "fuji",
        flank: "left",
        location: "Japan",
        date: "Jul 2024",
        elevationFt: 12388,
        type: "Summit",
        note: "Japan's highest peak and one of the major summit milestones on the profile.",
        image: ""
      },
      {
        name: "Mount Toubkal",
        relief: "toubkal",
        flank: "right",
        location: "Atlas Mountains, Morocco",
        date: "May 2019",
        elevationFt: 13671,
        type: "Summit",
        note: "The highest peak in North Africa and the highest completed summit on this profile.",
        image: ""
      },
      {
        name: "Denali",
        location: "Alaska, USA",
        date: "Goal",
        elevationFt: 20310,
        type: "Long-term objective",
        note: "The summit goal anchoring the visualization.",
        image: "",
        goal: true
      }
    ];

    const SVG_NS = "http://www.w3.org/2000/svg";
    const profileWidth = 1200;
    const profileHeight = 470;
    const plot = { left: 72, top: 44, bottom: 400 };
    const denaliElevation = 20310;
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

    function smoothPath(points) {
      if (!points.length) return "";
      if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i += 1) {
        const previous = points[i - 1];
        const current = points[i];
        const midX = (previous.x + current.x) / 2;
        path += ` C ${midX} ${previous.y}, ${midX} ${current.y}, ${current.x} ${current.y}`;
      }
      return path;
    }

    function buildMountainProfile() {
      mountainSvg.querySelectorAll(".mountain-generated").forEach((node) => node.remove());

      const summitX = 620;
      const summitY = elevationY(denaliElevation);
      const sharedReliefHorizonY = plot.bottom - 18;

      const defs = svgNode("defs", { class: "mountain-generated" });
      const gradient = svgNode("linearGradient", {
        id: "mountain-silhouette-gradient",
        x1: "0%",
        y1: "0%",
        x2: "0%",
        y2: "100%"
      }, defs);
      svgNode("stop", { offset: "0%", "stop-color": "#483744", "stop-opacity": ".62" }, gradient);
      svgNode("stop", { offset: "42%", "stop-color": "#2a2029", "stop-opacity": ".82" }, gradient);
      svgNode("stop", { offset: "100%", "stop-color": "#100d11", "stop-opacity": ".98" }, gradient);

      [0, 5000, 10000, 15000, 20000].forEach((elevation) => {
        const y = elevationY(elevation);
        svgNode("line", {
          class: "mountain-generated mountain-guide",
          x1: plot.left - 10,
          y1: y,
          x2: profileWidth - 42,
          y2: y
        });
        const label = svgNode("text", {
          class: "mountain-generated mountain-guide-label",
          x: 12,
          y: y + 4
        });
        label.textContent = elevation === 0 ? "0 FT" : `${elevation / 1000}K`;
      });

      // A broad, asymmetric Denali-inspired massif: long lower shoulders,
      // a steep upper mountain, and a dominant central summit.
      const silhouettePoints = [
        { x: 34, y: 423 },
        { x: 92, y: 414 },
        { x: 138, y: 388 },
        { x: 183, y: 371 },
        { x: 226, y: 336 },
        { x: 266, y: 320 },
        { x: 305, y: 286 },
        { x: 344, y: 273 },
        { x: 382, y: 236 },
        { x: 419, y: 226 },
        { x: 454, y: 188 },
        { x: 486, y: 177 },
        { x: 516, y: 139 },
        { x: 544, y: 126 },
        { x: 568, y: 91 },
        { x: 592, y: 101 },
        { x: summitX, y: summitY },
        { x: 641, y: 66 },
        { x: 660, y: 58 },
        { x: 682, y: 92 },
        { x: 713, y: 105 },
        { x: 741, y: 145 },
        { x: 777, y: 159 },
        { x: 812, y: 203 },
        { x: 855, y: 218 },
        { x: 900, y: 259 },
        { x: 951, y: 278 },
        { x: 1005, y: 319 },
        { x: 1062, y: 341 },
        { x: 1121, y: 384 },
        { x: 1175, y: 423 }
      ];

      const silhouetteD = silhouettePoints
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");

      svgNode("path", {
        class: "mountain-generated mountain-silhouette",
        d: `${silhouetteD} L 1175 ${plot.bottom + 28} L 34 ${plot.bottom + 28} Z`
      });

      // Interior ridges give the massif more relief without pretending to be a
      // literal topographic trace of Denali.
      [
        "M 205 358 C 286 323, 346 286, 405 229 C 461 177, 520 142, 568 91",
        "M 363 313 C 430 278, 484 229, 525 176 C 558 133, 589 95, 620 44",
        "M 620 44 C 666 91, 700 126, 741 145 C 797 171, 842 219, 900 259",
        "M 660 58 C 704 99, 749 143, 805 196 C 876 263, 955 306, 1062 341"
      ].forEach((d) => {
        svgNode("path", {
          class: "mountain-generated mountain-shadow-ridge",
          d
        });
      });

      // Stylized upper snowfields and glacier bands.
      [
        `M 538 139 L 568 91 L 592 101 L 620 44 L 641 66 L 660 58 L 680 91
            L 654 83 L 640 96 L 622 78 L 607 108 L 589 101 L 575 126 Z`,
        "M 430 224 C 470 203, 504 181, 536 149 L 522 183 C 493 201, 465 224, 441 246 Z",
        "M 703 113 C 747 145, 784 177, 816 207 L 784 194 C 755 173, 730 149, 706 132 Z"
      ].forEach((d) => {
        svgNode("path", {
          class: "mountain-generated mountain-snow",
          d
        });
      });

      const completed = mountainData.filter((point) => !point.goal);
      const leftCompleted = completed
        .filter((point) => point.flank === "left")
        .sort((a, b) => a.elevationFt - b.elevationFt);
      const rightCompleted = completed
        .filter((point) => point.flank === "right")
        .sort((a, b) => a.elevationFt - b.elevationFt);

      function flankPosition(point, index, count) {
        const ratio = Math.max(0, Math.min(1, point.elevationFt / denaliElevation));
        const distance = 46 + 405 * Math.pow(1 - ratio, .76);
        const sequenceNudge = count > 1 ? ((index / (count - 1)) - .5) * 28 : 0;
        const direction = point.flank === "left" ? -1 : 1;
        return {
          ...point,
          x: summitX + direction * (distance + sequenceNudge),
          y: elevationY(point.elevationFt)
        };
      }

      const leftPlotted = leftCompleted.map((point,index) => flankPosition(point,index,leftCompleted.length));
      const rightPlotted = rightCompleted.map((point,index) => flankPosition(point,index,rightCompleted.length));

      const reliefSpecs = {
          "rainbow": {
            w: 138, h: 60, summitIndex: 8,
            ridge: [[-1.00,1.00],[-.89,.92],[-.78,.83],[-.67,.71],[-.56,.58],[-.45,.44],[-.33,.29],[-.18,.13],[0,0],[.12,.08],[.24,.18],[.36,.33],[.50,.41],[.64,.56],[.79,.74],[.91,.88],[1.00,1.00]]
          },
          "alyeska": {
            w: 168, h: 64, summitIndex: 6,
            ridge: [[-1.00,1.00],[-.90,.90],[-.80,.76],[-.70,.56],[-.60,.33],[-.49,.12],[-.38,0],[-.27,.06],[-.14,.11],[0,.19],[.15,.28],[.31,.40],[.48,.55],[.66,.69],[.83,.84],[1.00,1.00]]
          },
          "gold-star": {
            w: 126, h: 64, summitIndex: 8,
            ridge: [[-1.00,1.00],[-.88,.90],[-.75,.80],[-.62,.67],[-.49,.54],[-.36,.38],[-.23,.23],[-.10,.09],[0,0],[.10,.07],[.21,.19],[.33,.35],[.46,.48],[.61,.63],[.77,.80],[.90,.91],[1.00,1.00]]
          },
          "healy": {
            w: 190, h: 54, summitIndex: 9,
            ridge: [[-1.00,1.00],[-.90,.93],[-.79,.85],[-.68,.75],[-.57,.64],[-.46,.53],[-.35,.43],[-.24,.33],[-.12,.23],[0,0],[.12,.08],[.24,.18],[.37,.28],[.51,.40],[.65,.53],[.79,.69],[.91,.84],[1.00,1.00]]
          },
          "east-twin": {
            w: 178, h: 74, summitIndex: 9,
            ridge: [[-1.00,1.00],[-.89,.91],[-.78,.80],[-.67,.66],[-.56,.51],[-.45,.36],[-.33,.22],[-.22,.12],[-.11,.05],[0,0],[.10,.03],[.20,.00],[.31,.08],[.43,.20],[.56,.36],[.69,.55],[.82,.76],[.92,.90],[1.00,1.00]]
          },
          "fuji": {
            w: 248, h: 94, summitIndex: 10,
            ridge: [[-1.00,1.00],[-.90,.93],[-.80,.84],[-.70,.73],[-.60,.61],[-.49,.49],[-.38,.37],[-.28,.26],[-.18,.16],[-.08,.07],[0,0],[.08,.06],[.18,.15],[.29,.26],[.40,.38],[.52,.51],[.64,.64],[.76,.77],[.88,.90],[1.00,1.00]]
          },
          "toubkal": {
            w: 194, h: 80, summitIndex: 9,
            ridge: [[-1.00,1.00],[-.90,.91],[-.80,.82],[-.70,.70],[-.60,.58],[-.49,.47],[-.38,.35],[-.27,.23],[-.15,.10],[0,0],[.10,.04],[.20,.01],[.31,.10],[.43,.18],[.56,.31],[.69,.48],[.82,.68],[.92,.86],[1.00,1.00]]
          },
          "rendezvous": {
            w: 156, h: 70, summitIndex: 7,
            ridge: [[-1.00,1.00],[-.89,.92],[-.78,.82],[-.67,.68],[-.56,.51],[-.44,.32],[-.31,.14],[-.16,0],[0,.08],[.15,.18],[.31,.31],[.48,.46],[.65,.62],[.81,.80],[.92,.92],[1.00,1.00]]
          },
          "gordon-lyon": {
            w: 192, h: 50, summitIndex: 9,
            ridge: [[-1.00,1.00],[-.90,.94],[-.80,.86],[-.69,.77],[-.58,.66],[-.47,.55],[-.36,.43],[-.24,.31],[-.12,.18],[0,0],[.13,.07],[.27,.16],[.42,.28],[.57,.42],[.71,.58],[.84,.76],[.93,.90],[1.00,1.00]]
          },
          "lion-head": {
            w: 158, h: 78, summitIndex: 8,
            ridge: [[-1.00,1.00],[-.89,.92],[-.79,.82],[-.69,.68],[-.58,.51],[-.47,.34],[-.35,.18],[-.19,.06],[0,0],[.13,.04],[.26,.13],[.40,.25],[.55,.39],[.70,.56],[.83,.74],[.92,.88],[1.00,1.00]]
          }
        };

      function drawPeakRelief(point) {
        if (!point.relief) return;

        const spec = reliefSpecs[point.relief];
        if (!spec) return;

        const summitProfile = spec.ridge[spec.summitIndex];
        const summitRx = summitProfile[0];
        const summitRy = summitProfile[1];

        const horizonY = sharedReliefHorizonY;
        const reliefHeight = horizonY - point.y;
        const reliefWidth = reliefHeight * (spec.w / spec.h);
        const verticalSpan = 1 - summitRy;

        const coords = spec.ridge.map(([rx, ry]) => ({
          x: point.x + (rx - summitRx) * reliefWidth / 2,
          y: point.y + ((ry - summitRy) / verticalSpan) * reliefHeight
        }));

        const d = coords
          .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
          .join(" ");

        const leftBase = coords[0];
        const rightBase = coords[coords.length - 1];

        // Appending after Denali puts the secondary reliefs in front of the
        // principal massif while keeping routes and waypoints above both.
        const group = svgNode("g", {
          class: `mountain-generated mountain-peak-relief mountain-peak-relief--${point.relief}`
        });

        svgNode("path", {
          class: "mountain-peak-relief-fill",
          d: `${d} L ${rightBase.x.toFixed(1)} ${horizonY.toFixed(1)} L ${leftBase.x.toFixed(1)} ${horizonY.toFixed(1)} Z`
        }, group);

        svgNode("path", {
          class: "mountain-peak-relief-ridge",
          d
        }, group);

        const foldEndX = point.x + (rightBase.x - point.x) * .20;
        svgNode("path", {
          class: "mountain-peak-relief-fold",
          d: `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}
              C ${(point.x - reliefWidth * .05).toFixed(1)} ${(point.y + reliefHeight * .22).toFixed(1)},
                ${(point.x + reliefWidth * .07).toFixed(1)} ${(point.y + reliefHeight * .46).toFixed(1)},
                ${foldEndX.toFixed(1)} ${horizonY.toFixed(1)}`
        }, group);
      }

      const summit = {
        ...mountainData.find((point) => point.goal),
        x: summitX,
        y: summitY
      };
      const plotted = [...leftPlotted, ...rightPlotted, summit];

      // Significant mountain reliefs sit in front of Denali but behind routes
      // and waypoints. Route endpoints and viewpoints remain visually quiet.
      [...leftPlotted, ...rightPlotted]
        .filter((point) => point.relief)
        .forEach(drawPeakRelief);

      const leftRoute = [
        { x: 120, y: plot.bottom + 7 },
        ...leftPlotted
      ];
      const rightRoute = [
        { x: 1080, y: plot.bottom + 7 },
        ...rightPlotted
      ];

      [leftRoute,rightRoute].forEach((route) => {
        svgNode("path", {
          class: "mountain-generated mountain-route",
          d: smoothPath(route)
        });
        svgNode("path", {
          class: "mountain-generated mountain-route-progress",
          d: smoothPath(route)
        });
      });

      const leftHigh = leftPlotted[leftPlotted.length - 1];
      const rightHigh = rightPlotted[rightPlotted.length - 1];
      [
        `M ${leftHigh.x} ${leftHigh.y}
           C ${leftHigh.x + 42} ${leftHigh.y - 12},
             ${summit.x - 52} ${summit.y + 42},
             ${summit.x} ${summit.y}`,
        `M ${rightHigh.x} ${rightHigh.y}
           C ${rightHigh.x - 42} ${rightHigh.y - 12},
             ${summit.x + 52} ${summit.y + 42},
             ${summit.x} ${summit.y}`
      ].forEach((d) => {
        svgNode("path", {
          class: "mountain-generated mountain-route-goal",
          d
        });
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
            r: 17
          }, group);
        }

        svgNode("circle", {
          class: "mountain-waypoint-hit",
          r: point.goal ? 24 : 18
        }, group);
        svgNode("circle", {
          class: "mountain-waypoint-ring",
          r: point.goal ? 8 : 6
        }, group);
        svgNode("circle", {
          class: "mountain-waypoint-core",
          r: point.goal ? 3.4 : 2.5
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
      });

      const goalName = svgNode("text", {
        class: "mountain-generated mountain-goal-name",
        x: summit.x + 31,
        y: summit.y + 3,
        "text-anchor": "start"
      });
      goalName.textContent = "Denali";

      const goalMeta = svgNode("text", {
        class: "mountain-generated mountain-goal-meta",
        x: summit.x + 31,
        y: summit.y + 19,
        "text-anchor": "start"
      });
      goalMeta.textContent = "GOAL · 20,310 FT";

    }

    function positionMountainPopover(point) {
      const svgRect = mountainSvg.getBoundingClientRect();
      const stageRect = mountainStage.getBoundingClientRect();
      const scaleX = svgRect.width / profileWidth;
      const scaleY = svgRect.height / profileHeight;
      const pointLeft = (point.x * scaleX) + (svgRect.left - stageRect.left);
      const pointTop = (point.y * scaleY) + (svgRect.top - stageRect.top);
      const popoverWidth = mountainPopover.offsetWidth || 270;
      const popoverHeight = mountainPopover.offsetHeight || 300;

      let left = pointLeft + 16;
      let top = pointTop - Math.min(48, popoverHeight * .2);

      if (left + popoverWidth > stageRect.width - 8) left = pointLeft - popoverWidth - 16;
      if (left < 8) left = 8;
      if (top + popoverHeight > stageRect.height - 8) top = stageRect.height - popoverHeight - 8;
      if (top < 8) top = 8;

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

    window.addEventListener("resize", () => {
      if (!mountainPopover.classList.contains("is-open") || !activeMountainPoint) return;
      const pointName = mountainPopover.dataset.activeName;
      const point = mountainData.find((item) => item.name === pointName);
      const transform = activeMountainPoint.getAttribute("transform") || "";
      const match = transform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
      if (point && match) {
        positionMountainPopover({ ...point, x: Number(match[1]), y: Number(match[2]) });
      }
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
