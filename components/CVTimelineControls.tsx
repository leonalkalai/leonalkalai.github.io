"use client";

import { useEffect } from "react";

function normalizeDate(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export default function CVTimelineControls() {
useEffect(() => {
  let cleanupTimeline: (() => void) | undefined;

  const setup = () => {
    cleanupTimeline?.();

    const section = document.querySelector<HTMLElement>("#cv-timeline");
    if (!section) return;

    const select = section.querySelector<HTMLSelectElement>("#cvTimelineSelect");
    const buttonsWrap = section.querySelector<HTMLElement>(".lk-cv-date-buttons");
    const entries = Array.from(
      section.querySelectorAll<HTMLElement>(".timeline-entry[data-cv-date]"),
    );

    if (!select || !buttonsWrap || entries.length === 0) return;

    select.innerHTML = '<option value="">Select date</option>';
    buttonsWrap.innerHTML = "";

    entries.forEach((entry, index) => {
      const date = normalizeDate(entry.dataset.cvDate ?? "");
      const id = entry.id || "cv-entry-" + (index + 1);

      entry.id = id;

      const option = document.createElement("option");
      option.value = id;
      option.textContent = date;
      select.appendChild(option);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "lk-cv-date-button";
      button.dataset.target = id;
      const label = document.createElement("span");
      label.textContent = date;
      button.appendChild(label);
      buttonsWrap.appendChild(button);
    });

    let scrollTimer: number | undefined;

    const scrollToEntry = (id: string, delay = 1000) => {
      const target = document.getElementById(id);
      if (!target) return;

      if (scrollTimer) {
        window.clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, delay);
    };

    const activateDateNavigation = (id: string) => {
  entries.forEach((item) => item.classList.remove("is-active"));

  buttonsWrap
    .querySelectorAll(".lk-cv-date-button")
    .forEach((button) => {
      button.classList.remove("is-active");
      button.classList.remove("is-pending");
    });

  select.classList.remove("is-pending");

  const targetEntry = document.getElementById(id);
  const activeButton = buttonsWrap.querySelector<HTMLElement>(
    '.lk-cv-date-button[data-target="' + id + '"]',
  );

  if (targetEntry instanceof HTMLElement) {
    targetEntry.classList.add("is-active");
  }

  if (activeButton) {
    activeButton.classList.add("is-pending");
    activeButton.classList.add("is-active");

    activeButton.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  select.value = id;
  select.classList.add("is-pending");

  window.setTimeout(() => {
    activeButton?.classList.remove("is-pending");
    select.classList.remove("is-pending");
  }, 1000);
};

 const handleSelectChange = () => {
  if (!select.value) return;

  activateDateNavigation(select.value);
  scrollToEntry(select.value, 1000);
};

const handleButtonClick = (event: Event) => {
  const target = event.target as HTMLElement | null;
  const button = target?.closest<HTMLButtonElement>(".lk-cv-date-button");

  if (!button?.dataset.target) return;

  activateDateNavigation(button.dataset.target);
  scrollToEntry(button.dataset.target, 1000);
};

    const setActiveEntry = (entry: HTMLElement | null) => {
      entries.forEach((item) => item.classList.remove("is-active"));

      buttonsWrap
        .querySelectorAll(".lk-cv-date-button")
        .forEach((button) => button.classList.remove("is-active"));

      if (!entry) return;

      entry.classList.add("is-active");
      select.value = entry.id;

      const activeButton = buttonsWrap.querySelector<HTMLElement>(
        '.lk-cv-date-button[data-target="' + entry.id + '"]',
      );

      activeButton?.classList.add("is-active");
    };

    const observer = new IntersectionObserver(
      (observerEntries) => {
        observerEntries.forEach((entry) => {
          if (entry.target instanceof HTMLElement) {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
          }
        });

        const visible = observerEntries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          setActiveEntry(visible.target);
        }
      },
      {
        threshold: [0.22, 0.4, 0.62],
        rootMargin: "-18% 0px -42% 0px",
      },
    );

    entries.forEach((entry) => observer.observe(entry));

    select.addEventListener("change", handleSelectChange);
    buttonsWrap.addEventListener("click", handleButtonClick);

cleanupTimeline = () => {
  if (scrollTimer) {
    window.clearTimeout(scrollTimer);
  }

  observer.disconnect();
  select.removeEventListener("change", handleSelectChange);
  buttonsWrap.removeEventListener("click", handleButtonClick);
};
  };

  setup();

  window.addEventListener("lk-cv-timeline-ready", setup);

  return () => {
    cleanupTimeline?.();
    window.removeEventListener("lk-cv-timeline-ready", setup);
  };
}, []);

  return null;
}
