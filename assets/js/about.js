/* About page interactions: mountain ascent, military timeline, training popovers, and bookshelf. */

(() => {
  const mountainStage = document.getElementById("mountain-ascent-stage");
  const mountainSvg = document.getElementById("mountain-ascent-svg");
  const mountainPopover = document.getElementById("mountain-popover");

  if (mountainStage && mountainSvg && mountainPopover) {
    const mountainData = [
      {
        name: "Mount Inari",
        location: "Kyoto, Japan",
        date: "Jul 2024",
        elevationFt: 764,
        type: "Mountain route",
        note: "A sacred mountain route through Fushimi Inari's shrine precinct and thousands of torii gates.",
        image: ""
      },
      {
        name: "Ōwakudani",
        location: "Hakone, Japan",
        date: "Jul 2024",
        elevationFt: 3425,
        type: "Volcanic highpoint",
        note: "Owakudani Station and the volcanic valley sit at roughly 1,044 meters above sea level.",
        image: ""
      },
      {
        name: "Harding Icefield Trail",
        location: "Kenai Fjords National Park, Alaska",
        date: "Jun 2024",
        elevationFt: 3527,
        type: "Trail endpoint",
        note: "The published trail-end elevation at the edge of the Harding Icefield; shown as a route highpoint rather than a summit.",
        image: ""
      },
      {
        name: "Rainbow Peak",
        location: "Chugach Mountains, Alaska",
        date: "Apr 2024",
        elevationFt: 3543,
        type: "Summit",
        note: "A steep Chugach ascent above Turnagain Arm where relief matters more than the absolute summit elevation.",
        image: ""
      },
      {
        name: "Mount Alyeska",
        location: "Girdwood, Alaska",
        date: "Jun 2024",
        elevationFt: 3939,
        type: "Mountain",
        note: "A coastal Chugach ascent rising directly above Girdwood and Turnagain Arm.",
        image: ""
      },
      {
        name: "Gold Star Peak",
        location: "Chugach State Park, Alaska",
        date: "Jun 2024",
        elevationFt: 4148,
        type: "Summit",
        note: "A Chugach summit named in honor of Gold Star families.",
        image: ""
      },
      {
        name: "Mount Healy",
        location: "Denali region, Alaska",
        date: "May 2024",
        elevationFt: 5716,
        type: "Mountain",
        note: "A steep Alaska Range ridge immediately outside the developed core of Denali National Park.",
        image: ""
      },
      {
        name: "East Twin Peak",
        location: "Chugach Mountains, Alaska",
        date: "Feb 2023",
        elevationFt: 5873,
        type: "Summit",
        note: "A winter Chugach ascent and one of the climbs that made Alaska the dominant landscape in this collection.",
        image: ""
      },
      {
        name: "Richland Balsam",
        location: "Blue Ridge Parkway, North Carolina",
        date: "Jun 2026",
        elevationFt: 6053,
        type: "Highpoint",
        note: "The highest point on the Blue Ridge Parkway motor road.",
        image: ""
      },
      {
        name: "Point Imperial",
        location: "Grand Canyon, Arizona",
        date: "Apr 2018",
        elevationFt: 8803,
        type: "Viewpoint",
        note: "The highest point on the Grand Canyon's North Rim; included as a high-elevation waypoint rather than a summit claim.",
        image: ""
      },
      {
        name: "Mount Fuji",
        location: "Japan",
        date: "Jul 2024",
        elevationFt: 12388,
        type: "Summit",
        note: "Japan's highest peak and one of the major summit milestones on the profile.",
        image: ""
      },
      {
        name: "Mount Toubkal",
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
    const plot = { left: 72, right: 1065, top: 44, bottom: 400 };
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

      const defs = svgNode("defs", { class: "mountain-generated" });
      const gradient = svgNode("linearGradient", {
        id: "mountain-silhouette-gradient",
        x1: "0%",
        y1: "0%",
        x2: "0%",
        y2: "100%"
      }, defs);
      svgNode("stop", { offset: "0%", "stop-color": "#40313d", "stop-opacity": ".56" }, gradient);
      svgNode("stop", { offset: "48%", "stop-color": "#241b24", "stop-opacity": ".74" }, gradient);
      svgNode("stop", { offset: "100%", "stop-color": "#110e12", "stop-opacity": ".96" }, gradient);

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

      const sorted = [...mountainData].sort((a, b) => a.elevationFt - b.elevationFt);
      const usableWidth = plot.right - plot.left;
      const step = usableWidth / (sorted.length - 1);
      const plotted = sorted.map((item, index) => ({
        ...item,
        x: plot.left + step * index,
        y: elevationY(item.elevationFt)
      }));

      const summit = plotted[plotted.length - 1];
      const silhouettePoints = [
        { x: 44, y: plot.bottom + 16 },
        ...plotted.map((point, index) => ({
          x: point.x,
          y: Math.min(plot.bottom, point.y + (index < 4 ? 8 : 0))
        })),
        { x: summit.x + 40, y: summit.y + 34 },
        { x: 1125, y: 190 },
        { x: 1180, y: plot.bottom + 16 }
      ];

      const silhouetteTop = smoothPath(silhouettePoints);
      svgNode("path", {
        class: "mountain-generated mountain-silhouette",
        d: `${silhouetteTop} L 1180 ${plot.bottom + 26} L 44 ${plot.bottom + 26} Z`
      });

      svgNode("path", {
        class: "mountain-generated mountain-shadow-ridge",
        d: `M 720 302 C 780 250, 835 228, 884 197 C 926 170, 965 121, ${summit.x} ${summit.y}`
      });

      svgNode("path", {
        class: "mountain-generated mountain-snow",
        d: `M ${summit.x - 52} ${summit.y + 54}
            L ${summit.x} ${summit.y}
            L ${summit.x + 44} ${summit.y + 39}
            L ${summit.x + 24} ${summit.y + 31}
            L ${summit.x + 9} ${summit.y + 44}
            L ${summit.x - 7} ${summit.y + 28}
            L ${summit.x - 23} ${summit.y + 44}
            Z`
      });

      const completed = plotted.filter((point) => !point.goal);
      const completedPath = smoothPath(completed);
      svgNode("path", {
        class: "mountain-generated mountain-route",
        d: smoothPath(plotted)
      });
      svgNode("path", {
        class: "mountain-generated mountain-route-progress",
        d: completedPath
      });

      const lastCompleted = completed[completed.length - 1];
      svgNode("path", {
        class: "mountain-generated mountain-route-goal",
        d: `M ${lastCompleted.x} ${lastCompleted.y}
            C ${lastCompleted.x + 48} ${lastCompleted.y - 5},
              ${summit.x - 52} ${summit.y + 24},
              ${summit.x} ${summit.y}`
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
            r: 16
          }, group);
        }

        svgNode("circle", {
          class: "mountain-waypoint-hit",
          r: point.goal ? 23 : 18
        }, group);
        svgNode("circle", {
          class: "mountain-waypoint-ring",
          r: point.goal ? 7.5 : 6
        }, group);
        svgNode("circle", {
          class: "mountain-waypoint-core",
          r: point.goal ? 3.2 : 2.5
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
        x: summit.x - 18,
        y: summit.y - 18,
        "text-anchor": "end"
      });
      goalName.textContent = "Denali";

      const goalMeta = svgNode("text", {
        class: "mountain-generated mountain-goal-meta",
        x: summit.x - 18,
        y: summit.y - 3,
        "text-anchor": "end"
      });
      goalMeta.textContent = "GOAL · 20,310 FT";

      mountainStage.dataset.profileWidth = profileWidth;
      mountainStage.dataset.profileHeight = profileHeight;
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
