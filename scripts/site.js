(() => {
  const SLOW_PRONUNCIATION_RATE = 0.86;
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

  const pronunciationItems = [...document.querySelectorAll("[data-pronunciation-part]")]
    .map((part) => {
      const toggle = part.querySelector("[data-pronunciation-toggle]");
      const playButton = part.querySelector("[data-pronunciation-play]");
      const audio = playButton
        ? document.getElementById(playButton.dataset.pronunciationPlay)
        : null;

      return { part, toggle, playButton, audio };
    })
    .filter(({ toggle, playButton, audio }) => toggle && playButton && audio);

  const resetAudio = ({ playButton, audio }) => {
    audio.pause();
    audio.currentTime = 0;
    playButton.classList.remove("is-playing");
  };

  const stopAudio = () => pronunciationItems.forEach(resetAudio);

  pronunciationItems.forEach((item) => {
    const { part, toggle, playButton, audio } = item;
    const name = part.dataset.pronunciationName;
    let nextPlaybackRate = 1;

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      part.classList.toggle("is-expanded", !isExpanded);
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      toggle.setAttribute(
        "aria-label",
        `${isExpanded ? "Show the pronunciation of" : "Show the spelling of"} ${name}`,
      );
      playButton.hidden = isExpanded;

      if (isExpanded) {
        resetAudio(item);
        audio.playbackRate = 1;
        nextPlaybackRate = 1;
      }
    });

    playButton.addEventListener("click", () => {
      stopAudio();
      const playbackRate = nextPlaybackRate;

      audio.playbackRate = playbackRate;
      playButton.classList.add("is-playing");
      audio
        .play()
        .then(() => {
          nextPlaybackRate = playbackRate === 1 ? SLOW_PRONUNCIATION_RATE : 1;
        })
        .catch(() => playButton.classList.remove("is-playing"));
    });

    audio.addEventListener("ended", () => playButton.classList.remove("is-playing"));
  });

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
