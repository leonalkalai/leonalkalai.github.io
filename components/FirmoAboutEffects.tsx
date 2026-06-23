"use client";

import { useEffect } from "react";

function hidePagePreloader() {
  document
    .querySelectorAll<HTMLElement>("[data-page-preloader], .lk-page-preloader")
    .forEach((preloader) => {
      preloader.classList.add("is-hidden");
      preloader.style.setProperty("opacity", "0", "important");
      preloader.style.setProperty("visibility", "hidden", "important");
      preloader.style.setProperty("pointer-events", "none", "important");
    });
}

function isElementInRevealZone(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.top < viewportHeight * 0.88 && rect.bottom > viewportHeight * 0.12;
}

export default function FirmoAboutEffects() {
  useEffect(() => {
    document.body.classList.add("lk-about-route");
    hidePagePreloader();

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-about-reveal]"),
    );

    const prepareItem = (item: HTMLElement, index: number) => {
      item.classList.remove("is-visible");
      item.dataset.aboutAnimationReady = "true";
      item.style.setProperty("--lk-about-delay", String(Math.min(index * 42, 360)) + "ms");
    };

    const showItem = (item: HTMLElement) => {
      item.classList.add("is-visible");
    };

    const hideItem = (item: HTMLElement) => {
      item.classList.remove("is-visible");
    };

    items.forEach((item, index) => {
      prepareItem(item, index);
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(showItem);

      return () => {
        document.body.classList.remove("lk-about-route");
      };
    }

    let scrollFrame = 0;

    const updateVisibleItems = () => {
      scrollFrame = 0;

      items.forEach((item) => {
        if (isElementInRevealZone(item)) {
          showItem(item);
        } else {
          hideItem(item);
        }
      });
    };

    const requestUpdate = () => {
      if (scrollFrame) return;

      scrollFrame = window.requestAnimationFrame(updateVisibleItems);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            showItem(item);
          } else {
            hideItem(item);
          }
        });
      },
      {
        threshold: [0, 0.12, 0.28],
        rootMargin: "0px 0px -8% 0px",
      },
    );

    items.forEach((item) => observer.observe(item));

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateVisibleItems);
    });

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (scrollFrame) {
        window.cancelAnimationFrame(scrollFrame);
      }

      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      items.forEach((item) => {
        item.classList.remove("is-visible");
        item.style.removeProperty("--lk-about-delay");
        delete item.dataset.aboutAnimationReady;
      });

      document.body.classList.remove("lk-about-route");
    };
  }, []);

  return null;
}
