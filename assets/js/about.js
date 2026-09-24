/* About page interactions: ridge, military timeline, training popovers, and bookshelf. */

(() => {
  const ridgePoints = [...document.querySelectorAll(".ridge-point")];
  const peakName = document.getElementById("peak-name");
  const peakNote = document.getElementById("peak-note");

  function activatePeak(point) {
    ridgePoints.forEach((node) => node.classList.remove("is-active"));
    point.classList.add("is-active");
    if (peakName) peakName.textContent = point.dataset.title || "";
    if (peakNote) {
      const meta = point.dataset.meta ? point.dataset.meta + " — " : "";
      peakNote.textContent = meta + (point.dataset.copy || "");
    }
  }

  ridgePoints.forEach((point) => {
    point.addEventListener("click", () => activatePeak(point));
    point.addEventListener("focus", () => activatePeak(point));
    point.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activatePeak(point);
      }
    });
  });

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
