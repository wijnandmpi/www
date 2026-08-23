(() => {
  const portrait = document.querySelector("[data-random-portrait]");

  if (portrait) {
    const portraits = portrait.dataset.portraits
      .split("|")
      .map((source) => source.trim())
      .filter(Boolean);

    if (portraits.length > 0) {
      portrait.src = portraits[Math.floor(Math.random() * portraits.length)];
    }
  }

  const pronunciation = document.querySelector("[data-pronunciation]");
  const pronunciationToggle = document.querySelector("[data-pronunciation-toggle]");
  const pronunciationAudio = document.querySelector("[data-pronunciation-audio]");

  if (pronunciation && pronunciationToggle && pronunciationAudio) {
    const playButtons = [...pronunciationAudio.querySelectorAll("[data-pronunciation-play]")];
    const audioElements = playButtons
      .map((button) => document.getElementById(button.dataset.pronunciationPlay))
      .filter(Boolean);

    const stopAudio = () => {
      audioElements.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      playButtons.forEach((button) => button.classList.remove("is-playing"));
    };

    pronunciationToggle.addEventListener("click", () => {
      const isExpanded = pronunciationToggle.getAttribute("aria-expanded") === "true";

      pronunciation.classList.toggle("is-expanded", !isExpanded);
      pronunciationToggle.setAttribute("aria-expanded", String(!isExpanded));
      pronunciationToggle.setAttribute(
        "aria-label",
        isExpanded
          ? "Show the pronunciation of Wijnand van Woerkom"
          : "Show the spelling of Wijnand van Woerkom",
      );
      pronunciationAudio.hidden = isExpanded;

      if (isExpanded) {
        stopAudio();
      }
    });

    playButtons.forEach((button) => {
      const audio = document.getElementById(button.dataset.pronunciationPlay);

      if (!audio) {
        return;
      }

      button.addEventListener("click", () => {
        stopAudio();
        button.classList.add("is-playing");
        audio.play().catch(() => button.classList.remove("is-playing"));
      });

      audio.addEventListener("ended", () => button.classList.remove("is-playing"));
    });
  }

  const publicationList = document.querySelector("#publication-list");
  const publicationToggle = document.querySelector("[data-publication-toggle]");

  if (publicationList && publicationToggle && publicationList.children.length > 5) {
    publicationList.classList.add("is-collapsed");
    publicationToggle.hidden = false;

    publicationToggle.addEventListener("click", () => {
      const isExpanded = publicationToggle.getAttribute("aria-expanded") === "true";

      publicationList.classList.toggle("is-collapsed", isExpanded);
      publicationToggle.setAttribute("aria-expanded", String(!isExpanded));
      publicationToggle.textContent = isExpanded
        ? "Expand publication list"
        : "Collapse publication list";
    });
  }

  const talkList = document.querySelector("#talk-list");
  const talkToggle = document.querySelector("[data-talk-toggle]");

  if (talkList && talkToggle && talkList.children.length > 5) {
    talkList.classList.add("is-collapsed");
    talkToggle.hidden = false;

    talkToggle.addEventListener("click", () => {
      const isExpanded = talkToggle.getAttribute("aria-expanded") === "true";

      talkList.classList.toggle("is-collapsed", isExpanded);
      talkToggle.setAttribute("aria-expanded", String(!isExpanded));
      talkToggle.textContent = isExpanded
        ? "Expand talk list"
        : "Collapse talk list";
    });
  }

  const lastModified = new Date(document.lastModified);

  if (!Number.isNaN(lastModified.getTime())) {
    const dateTime = [
      lastModified.getFullYear(),
      String(lastModified.getMonth() + 1).padStart(2, "0"),
      String(lastModified.getDate()).padStart(2, "0"),
    ].join("-");
    const displayDate = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(lastModified);

    document.querySelectorAll("[data-last-updated]").forEach((element) => {
      element.dateTime = dateTime;
      element.textContent = displayDate;
    });
  }
})();
