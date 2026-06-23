"use client";

import { animate } from "framer-motion";
import { useEffect } from "react";

declare global {
  interface Window {
    anime?: (config: Record<string, unknown>) => {
      finished?: Promise<void>;
      pause?: () => void;
    };
  }
}

const motionAnimate = animate as unknown as (
  element: Element,
  keyframes: Record<string, unknown>,
  options: Record<string, unknown>,
) => { stop?: () => void };

function getStartPosition(element: Element) {
  const htmlElement = element as HTMLElement;

  if (htmlElement.classList.contains("leon-reveal-right")) {
    return { x: 72, y: 0 };
  }

  if (htmlElement.classList.contains("leon-reveal-left")) {
    return { x: -72, y: 0 };
  }

  return { x: 0, y: 42 };
}

function setHidden(element: Element) {
  const htmlElement = element as HTMLElement;
  const start = getStartPosition(element);

  htmlElement.style.opacity = "0";
  htmlElement.style.transform =
    `translate3d(${start.x}px, ${start.y}px, 0)`;
  htmlElement.style.filter = "blur(10px)";
  htmlElement.style.willChange = "opacity, transform, filter";
}


function setupCustomSectionReveals() {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".leon-reveal, .leon-project-row, .leon-experience-card, .leon-tech-logo-card",
    ),
  ).filter((element) => {
    if (!element.isConnected) return false;

    /*
      Important:
      Do NOT animate Webflow hero/data-w-id elements here.
      Hero replay is handled separately below.
    */
    if (
      element.closest(
        ".hero-section, .hero-title-wrap, .hero-text-wrap, .hero-btn-wrap",
      )
    ) {
      return false;
    }

    return true;
  });

  const controls = new WeakMap<Element, { stop?: () => void }>();
  const visibleState = new WeakMap<Element, boolean>();
  const initialRevealDone = new WeakSet<Element>();

targets.forEach((element) => {
  visibleState.set(element, false);

  /*
    Do not hard-hide layout parent wrappers.
    They can contain animated children and, at some breakpoints,
    hiding the parent makes the whole section disappear.
  */
  if (element.classList.contains("leon-tech-brand-layout")) {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.style.filter = "none";
    return;
  }

  setHidden(element);
});

  const stopCurrentAnimation = (element: Element) => {
    controls.get(element)?.stop?.();
  };

  const revealIn = (element: Element, index: number) => {
    if (visibleState.get(element) === true) return;

    visibleState.set(element, true);
    stopCurrentAnimation(element);

    const start = getStartPosition(element);

    const control = motionAnimate(
      element,
      {
        opacity: [0, 1],
        x: [start.x, 0],
        y: [start.y, 0],
        filter: ["blur(10px)", "blur(0px)"],
      },
      {
        duration: 0.85,
        delay: Math.min(index * 0.018, 0.22),
        ease: [0.22, 1, 0.36, 1],
      },
    );

    controls.set(element, control);
  };

  const revealOut = (element: Element) => {

    if ((element as HTMLElement).classList.contains("leon-tech-brand-layout")) {
      return;
    }
    if (visibleState.get(element) === false) return;

    visibleState.set(element, false);
    stopCurrentAnimation(element);

    const start = getStartPosition(element);

    const control = motionAnimate(
      element,
      {
        opacity: [1, 0],
        x: [0, start.x],
        y: [0, start.y],
        filter: ["blur(0px)", "blur(10px)"],
      },
      {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    );

    controls.set(element, control);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = targets.indexOf(entry.target as HTMLElement);

        if (entry.isIntersecting) {
          revealIn(entry.target, index < 0 ? 0 : index);
        } else {
          revealOut(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  targets.forEach((element) => observer.observe(element));

  /*
    Reveal items that are already visible on initial page load.
    IntersectionObserver can wait until scroll in some Webflow/Next layouts,
    so this guarantees above-the-fold content is shown immediately.
  */
window.requestAnimationFrame(() => {
  targets.forEach((element, index) => {
    const rect = element.getBoundingClientRect();

    const isVisible =
      rect.top < window.innerHeight * 0.96 &&
      rect.bottom > 0 &&
      rect.width > 0 &&
      rect.height > 0;

    if (isVisible) {
      revealIn(element, index);
    }
  });
});

  return () => {
    observer.disconnect();

    targets.forEach((element) => {
      controls.get(element)?.stop?.();
    });
  };
}

function isElementDisplayed(element: HTMLElement) {
  const style = window.getComputedStyle(element);

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.getClientRects().length > 0
  );
}

function isElementInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top < window.innerHeight * 0.96 &&
    rect.bottom > 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function setupPortfolioSectionReplay() {
  /*
    Animate only the inner profile block, not the whole .portfolio-section.
    .portfolio-section is a Webflow layout wrapper and can become huge /
    hide the page at tablet widths if we animate opacity/transform on it.
  */
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".portfolio-section > .dandy-card-frame-wrap, .portfolio-section > .portfolio-inner",
    ),
  ).filter((element) => {
    if (!element.isConnected) return false;

    return Boolean(
      element.matches(".dandy-card-frame-wrap") ||
        element.querySelector(".portolio-layout") ||
        element.querySelector(".dandy-card-frame"),
    );
  });

  if (targets.length === 0) return () => {};

  const controls = new WeakMap<Element, { stop?: () => void }>();
  const visibleState = new WeakMap<Element, boolean>();
  const initialRevealDone = new WeakSet<Element>();

  const stopCurrentAnimation = (element: HTMLElement) => {
    controls.get(element)?.stop?.();
  };

  const setHidden = (element: HTMLElement) => {
    element.style.opacity = "0";
    element.style.transform = "translate3d(0px, 42px, 0px)";
    element.style.filter = "blur(8px)";
    element.style.willChange = "opacity, transform, filter";
  };

  const setVisible = (element: HTMLElement) => {
    element.style.opacity = "1";
    element.style.transform = "translate3d(0px, 0px, 0px)";
    element.style.filter = "blur(0px)";
    element.style.willChange = "auto";
  };

  const reveal = (element: HTMLElement) => {
    if (visibleState.get(element) === true) return;

    visibleState.set(element, true);
    stopCurrentAnimation(element);

    const control = motionAnimate(
      element,
      {
        opacity: [0, 1],
        y: [42, 0],
        filter: ["blur(8px)", "blur(0px)"],
      },
      {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    );

    controls.set(element, control);
  };

  const hide = (element: HTMLElement) => {
    if (visibleState.get(element) === false) return;

    visibleState.set(element, false);
    stopCurrentAnimation(element);

    const control = motionAnimate(
      element,
      {
        opacity: [1, 0],
        y: [0, 42],
        filter: ["blur(0px)", "blur(8px)"],
      },
      {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    );

    controls.set(element, control);
  };

  targets.forEach((element) => {
    if (!isElementDisplayed(element)) {
      visibleState.set(element, true);
      setVisible(element);
      return;
    }

    if (isElementInViewport(element)) {
      visibleState.set(element, true);
      setVisible(element);
    } else {
      visibleState.set(element, false);
      setHidden(element);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;

        if (entry.isIntersecting) {
          reveal(element);
        } else {
          hide(element);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  targets.forEach((element) => observer.observe(element));

const revealInitiallyVisible = () => {
  targets.forEach((element) => {
    if (initialRevealDone.has(element)) return;
    if (!isElementDisplayed(element)) return;

    if (isElementInViewport(element)) {
      initialRevealDone.add(element);
      visibleState.set(element, false);
      reveal(element);
    }
  });
};

/*
  Run only once after layout/Webflow has settled.
  Do not call this with requestAnimationFrame + multiple timeouts,
  because that replays the initial animation multiple times.
*/
const initialRevealTimer = window.setTimeout(revealInitiallyVisible, 250);

  return () => {
    window.clearTimeout(initialRevealTimer);
    observer.disconnect();

    targets.forEach((element) => {
      controls.get(element)?.stop?.();
    });
  };
}

function setupMobilePortfolioReplay() {
  /*
    Mobile/tablet portfolio section animation.
    We animate the inner children, not the whole wrapper,
    so the section keeps its normal Webflow layout.
  */
  const section = document.querySelector<HTMLElement>(".portfolio-section-mobile");

  if (!section) return () => {};

  const targets = Array.from(section.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  const animatedTargets = targets.length > 0 ? targets : [section];

  const controls = new WeakMap<Element, { stop?: () => void }>();
  const visibleState = new WeakMap<Element, boolean>();
  const initialRevealDone = new WeakSet<Element>();

  const stopCurrentAnimation = (element: HTMLElement) => {
    controls.get(element)?.stop?.();
  };

  const setHidden = (element: HTMLElement) => {
    element.style.opacity = "0";
    element.style.transform = "translate3d(0px, 42px, 0px)";
    element.style.filter = "blur(8px)";
    element.style.willChange = "opacity, transform, filter";
  };

  const setVisible = (element: HTMLElement) => {
    element.style.opacity = "1";
    element.style.transform = "translate3d(0px, 0px, 0px)";
    element.style.filter = "blur(0px)";
    element.style.willChange = "auto";
  };

  const reveal = (element: HTMLElement, index: number) => {
    if (visibleState.get(element) === true) return;

    visibleState.set(element, true);
    stopCurrentAnimation(element);

    const control = motionAnimate(
      element,
      {
        opacity: [0, 1],
        y: [42, 0],
        filter: ["blur(8px)", "blur(0px)"],
      },
      {
        duration: 0.85,
        delay: Math.min(index * 0.06, 0.24),
        ease: [0.22, 1, 0.36, 1],
      },
    );

    controls.set(element, control);
  };

  const hide = (element: HTMLElement) => {
    if (visibleState.get(element) === false) return;

    visibleState.set(element, false);
    stopCurrentAnimation(element);

    const control = motionAnimate(
      element,
      {
        opacity: [1, 0],
        y: [0, 42],
        filter: ["blur(0px)", "blur(8px)"],
      },
      {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    );

    controls.set(element, control);
  };

animatedTargets.forEach((element) => {
  if (!isElementDisplayed(element)) {
    visibleState.set(element, true);
    setVisible(element);
    return;
  }

  if (isElementInViewport(element)) {
    visibleState.set(element, true);
    setVisible(element);
  } else {
    visibleState.set(element, false);
    setHidden(element);
  }
});

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const index = animatedTargets.indexOf(element);

        if (entry.isIntersecting) {
          reveal(element, index < 0 ? 0 : index);
        } else {
          hide(element);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  animatedTargets.forEach((element) => observer.observe(element));

const revealInitiallyVisible = () => {
  animatedTargets.forEach((element, index) => {
    if (initialRevealDone.has(element)) return;
    if (!isElementDisplayed(element)) return;

    if (isElementInViewport(element)) {
      initialRevealDone.add(element);
      visibleState.set(element, false);
      reveal(element, index);
    }
  });
};

/*
  Run only once after layout/Webflow has settled.
*/
const initialRevealTimer = window.setTimeout(revealInitiallyVisible, 250);

  return () => {
    window.clearTimeout(initialRevealTimer);
    observer.disconnect();

    animatedTargets.forEach((element) => {
      controls.get(element)?.stop?.();
    });
  };
}

function setupHeroReplay() {
  const heroSection = document.querySelector<HTMLElement>(".hero-section");

  if (!heroSection) {
    return () => {};
  }

  const heroItems = Array.from(
    heroSection.querySelectorAll<HTMLElement>(
      ".hero-title-wrap, .hero-text-wrap, .hero-btn-wrap, .hero-counter-item",
    ),
  ).filter((element) => element.isConnected);

  if (heroItems.length === 0) {
    return () => {};
  }

  const controls = new WeakMap<Element, { stop?: () => void }>();

  let hasLoadedInitially = false;
  let hasLeftHero = false;
  let isHeroVisible = false;

  const stopCurrentAnimation = (element: Element) => {
    controls.get(element)?.stop?.();
  };

  const setHeroHidden = () => {
    heroItems.forEach((element) => {
      stopCurrentAnimation(element);

      element.style.opacity = "0";
      element.style.transform =
        "translate3d(0px, 46px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)";
      element.style.transformStyle = "preserve-3d";
      element.style.filter = "blur(10px)";
      element.style.willChange = "opacity, transform, filter";
    });
  };

  const revealHero = () => {
    heroItems.forEach((element, index) => {
      stopCurrentAnimation(element);

      const control = motionAnimate(
        element,
        {
          opacity: [0, 1],
          y: [46, 0],
          filter: ["blur(10px)", "blur(0px)"],
        },
        {
          duration: 0.9,
          delay: Math.min(index * 0.09, 0.32),
          ease: [0.22, 1, 0.36, 1],
        },
      );

      controls.set(element, control);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry) return;

      if (entry.isIntersecting) {
        if (!hasLoadedInitially) {
          hasLoadedInitially = true;
          isHeroVisible = true;

          /*
            First page load:
            Force the hero to reveal even if Webflow left it hidden.
            This fixes the issue where the first section stays invisible
            until the user scrolls.
          */
          setHeroHidden();

          window.setTimeout(() => {
            revealHero();
          }, 120);

          return;
        }

        if (hasLeftHero && !isHeroVisible) {
          isHeroVisible = true;
          revealHero();
        }

        return;
      }

      if (hasLoadedInitially) {
        hasLeftHero = true;
        isHeroVisible = false;
        setHeroHidden();
      }
    },
    {
      threshold: 0.28,
      rootMargin: "-8% 0px -18% 0px",
    },
  );

  observer.observe(heroSection);

  return () => {
    observer.disconnect();

    heroItems.forEach((element) => {
      controls.get(element)?.stop?.();
    });
  };
}

function loadAnimeJs() {
  return new Promise<void>((resolve) => {
    if (window.anime) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js";
    script.async = false;
    script.type = "text/javascript";

    script.onload = () => resolve();
    script.onerror = () => resolve();

    document.body.appendChild(script);
  });
}

function setupMobileProjectsMenu() {
  const projectItems = [
    ["Hotels Finder", "/projects/hotels-finder"],
    ["Hotels Finder Room Page", "/projects/hotels-finder-room-page"],
    ["Next.js Finance App", "/projects/next-js-finance-app"],
    ["Personal Portfolio", "/projects/personal-portfolio"],
    ["Phidiashouse Apartments", "/projects/phidiashouse-apartments"],
    ["Exsell Digital Marketplace", "/projects/exsell-digital-marketplace"],
    ["Psyllias Giorgos Gypsosanides", "/projects/psyllias-giorgos-gypsosanides"],
    ["Osiris Contact Learning", "/projects/osiris-contact-learning"],
    ["Hotels Finder ElementFX", "/projects/hotels-finder-elementfx"],
    ["MenuHelp App", "/projects/menuhelp-app"],
    ["Bookaholics", "/projects/bookaholics"],
    ["create-website.gr", "/projects/create-website-gr"],
    ["Argynet Support Hosting", "/projects/argynet-support-hosting"],
    ["Body Move", "/projects/body-move"],
    ["Tesma", "/projects/tesma"],
    ["Zafiropoulos Tours", "/projects/zafiropoulos-tours"],
    ["Mykonos Rent A Cars", "/projects/mykonos-rent-a-cars"],
  ];

  const cleanupCallbacks: Array<() => void> = [];

  const isVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();

    return rect.width > 0 && rect.height > 0;
  };

  const enhanceVisibleProjectsLink = () => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[href]"),
    ).filter((link) => {
      const text = link.textContent?.replace(/[+−]/g, "").trim().toLowerCase() ?? "";
      const href = link.getAttribute("href") ?? "";

      return (
        isVisible(link) &&
        text === "projects" &&
        (href === "/projects" || href === "#works" || href === "#projects-modal")
      );
    });

    const projectsLink = links[0];

    if (!projectsLink) return;

    links.slice(1).forEach((link) => {
      const wrapper =
        link.closest<HTMLElement>(".menu-link") ??
        link.closest<HTMLElement>("li") ??
        link.parentElement;

      if (wrapper) {
        wrapper.style.display = "none";
      } else {
        link.style.display = "none";
      }
    });

    if (projectsLink.dataset.mobileProjectsReady === "true") return;

    projectsLink.dataset.mobileProjectsReady = "true";
    projectsLink.setAttribute("href", "#works");

    const plus = document.createElement("span");
    plus.textContent = "+";
    plus.className = "leon-mobile-projects-plus";
    plus.style.marginLeft = "10px";

    projectsLink.appendChild(plus);

    const list = document.createElement("div");
    list.className = "leon-mobile-projects-sublist";
    list.style.display = "none";
    list.style.padding = "14px 0 80px";
    list.style.gap = "10px";
    list.style.maxHeight = "52vh";
    list.style.overflowY = "auto";
    list.style.overflowX = "hidden";
    (list.style as CSSStyleDeclaration & {
  webkitOverflowScrolling?: string;
}).webkitOverflowScrolling = "touch";

projectItems.forEach(([title, href]) => {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = title;
  link.className = "leon-mobile-projects-sublink";
  link.setAttribute("data-mobile-project-link", "true");
  link.style.display = "block";
  link.style.fontSize = "18px";
  link.style.fontWeight = "700";
  link.style.lineHeight = "1.2";
  link.style.padding = "7px 0";
  link.style.color = "inherit";
  link.style.textDecoration = "none";

  const handleProjectClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const parts = href.split("/").filter(Boolean);
    const slug = parts[parts.length - 1];

    if (!slug) return;

    const projectLink = document.querySelector<HTMLAnchorElement>(
      '[data-project-slug="' + slug + '"]',
    );

    const closeButton =
      document.querySelector<HTMLElement>(".w-nav-button.w--open") ??
      document.querySelector<HTMLElement>(".menu-button.w--open") ??
      document.querySelector<HTMLElement>(".nav-menu-button.w--open");

    if (closeButton) {
      closeButton.click();
    }

    if (projectLink) {
      window.setTimeout(() => {
        projectLink.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          }),
        );
      }, 220);

      return;
    }

    window.location.href = href;
  };

  link.addEventListener("click", handleProjectClick);

  cleanupCallbacks.push(() => {
    link.removeEventListener("click", handleProjectClick);
  });

  list.appendChild(link);
});

const container =
  projectsLink.closest<HTMLElement>(".menu-link") ??
  projectsLink.closest<HTMLElement>("li") ??
  projectsLink.parentElement;

container?.appendChild(list);

const scrollPanel =
  projectsLink.closest<HTMLElement>(".w-nav-menu") ??
  projectsLink.closest<HTMLElement>("[data-nav-menu-open]") ??
  projectsLink.closest<HTMLElement>(".nav-menu") ??
  projectsLink.closest<HTMLElement>(".menu") ??
  container?.parentElement?.parentElement ??
  container?.parentElement;

if (scrollPanel) {
  scrollPanel.style.maxHeight = "100dvh";
  scrollPanel.style.overflowY = "auto";
  scrollPanel.style.overflowX = "hidden";
  (scrollPanel.style as CSSStyleDeclaration & {
  webkitOverflowScrolling?: string;
}).webkitOverflowScrolling = "touch";
  scrollPanel.style.paddingBottom = "96px";
}

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

const isOpen = list.style.display === "grid";

list.style.display = isOpen ? "none" : "grid";
plus.textContent = isOpen ? "+" : "−";

if (!isOpen) {
  window.setTimeout(() => {
    projectsLink.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, 80);
}
    };

    projectsLink.addEventListener("click", handleClick);

    cleanupCallbacks.push(() => {
      projectsLink.removeEventListener("click", handleClick);
    });
  };

  const normalizeMobileSocialLinks = () => {
    const socialLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="x.com"], a[href*="dribbble"], a[href*="behance"], a[href*="linkedin"]',
      ),
    );

    socialLinks.forEach((link) => {
      const href = link.getAttribute("href") ?? "";

      if (href.includes("linkedin")) {
        link.href = "https://www.linkedin.com/in/leon-koundouras/";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return;
      }
        if (
  href.includes("behance") ||
  href.includes("be.net") ||
  href.includes("facebook") ||
  href.includes("instagram") ||
  href.includes("twitter") ||
  href.includes("x.com") ||
  href.includes("dribbble")
) {
  link.style.display = "none";
  return;
}

      link.style.display = "none";
    });
  };

  const run = () => {
    enhanceVisibleProjectsLink();
    normalizeMobileSocialLinks();
  };

  run();

  const observer = new MutationObserver(() => {
    window.setTimeout(run, 80);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });

  document.addEventListener("click", run, true);

  return () => {
    observer.disconnect();
    document.removeEventListener("click", run, true);
    cleanupCallbacks.forEach((cleanup) => cleanup());
  };
}

function setupPagePreloader() {
  const preloader = document.querySelector<HTMLElement>("[data-page-preloader]");

  if (!preloader) return () => {};

  let safetyTimer: number | undefined;

  const hide = () => {
    window.clearTimeout(safetyTimer);

    window.setTimeout(() => {
      preloader.classList.add("is-hidden");
    }, 450);
  };

  const show = () => {
    preloader.classList.remove("is-hidden");

    // Safety fallback: if no real navigation happens, hide it again.
    safetyTimer = window.setTimeout(() => {
      preloader.classList.add("is-hidden");
    }, 1600);
  };

  if (document.readyState === "complete") {
    hide();
  } else {
    window.addEventListener("load", hide, { once: true });
  }

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const link = target?.closest("a") as HTMLAnchorElement | null;

    if (!link) return;

    const href = link.getAttribute("href") || "";

    // Μην εμφανίζεις preloader για custom modal links.
    if (
      link.hasAttribute("data-project-slug") ||
      link.hasAttribute("data-case-study-slug") ||
      link.closest("[data-project-slug]") ||
      link.closest("[data-case-study-slug]")
    ) {
      return;
    }

    // Μην εμφανίζεις preloader για modal buttons / close links.
    if (
      link.closest("[data-case-study-modal]") ||
      link.closest("[data-case-study-close]") ||
      link.closest("[data-blog-pagination]")
    ) {
      return;
    }

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank" ||
      link.hasAttribute("download")
    ) {
      return;
    }

    const url = new URL(link.href, window.location.href);

    if (url.origin !== window.location.origin) return;

    // Αν είναι ίδια σελίδα με διαφορετικό hash, μη δείχνεις preloader.
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return;
    }

    show();
  };

  const handleBeforeUnload = () => {
    show();
  };

  const handlePageShow = () => {
    hide();
  };

  window.addEventListener("pageshow", handlePageShow);
  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("click", handleClick, true);

  return () => {
    window.clearTimeout(safetyTimer);
    window.removeEventListener("load", hide);
    window.removeEventListener("pageshow", handlePageShow);
    window.removeEventListener("beforeunload", handleBeforeUnload);
    document.removeEventListener("click", handleClick, true);
  };
}

function setupLogoColorSwap() {
  const getLogoElements = () => {
    const logos: HTMLImageElement[] = [];

    document
      .querySelectorAll<HTMLImageElement>("[data-logo-colored]")
      .forEach((logo) => logos.push(logo));

    document.querySelectorAll<HTMLElement>("*").forEach((element) => {
      const shadowRoot = element.shadowRoot;

      if (!shadowRoot) return;

      shadowRoot
        .querySelectorAll<HTMLImageElement>("[data-logo-colored]")
        .forEach((logo) => logos.push(logo));
    });

    return Array.from(new Set(logos));
  };

  const forceBaseLogo = () => {
    getLogoElements().forEach((logo) => {
      const baseSrc = logo.dataset.logoBase || "/leonkountouras-logo.png";

      if (!logo.src.includes(baseSrc)) {
        logo.src = baseSrc;
      }

      logo.classList.remove("is-colored-logo");
    });
  };

const activateColoredLogo = () => {
  getLogoElements().forEach((logo) => {
    const coloredSrc =
      logo.dataset.logoColored || "/leonkountouras-logo-colored.png";

    const preload = new Image();

    preload.onload = () => {
      logo.classList.add("is-logo-fading");

      window.setTimeout(() => {
        logo.src = coloredSrc;
        logo.classList.remove("is-logo-fading");

        window.requestAnimationFrame(() => {
          logo.classList.add("is-colored-logo");
        });
      }, 420);
    };

    preload.src = coloredSrc;
  });
};

  forceBaseLogo();

  const baseTimerOne = window.setTimeout(forceBaseLogo, 100);
  const baseTimerTwo = window.setTimeout(forceBaseLogo, 500);
  const baseTimerThree = window.setTimeout(forceBaseLogo, 1200);

  const coloredTimer = window.setTimeout(activateColoredLogo, 3000);

  return () => {
    window.clearTimeout(baseTimerOne);
    window.clearTimeout(baseTimerTwo);
    window.clearTimeout(baseTimerThree);
    window.clearTimeout(coloredTimer);

    forceBaseLogo();
  };
}

function removeWebflowBadge() {
  const remove = () => {
    document.querySelectorAll(".w-webflow-badge").forEach((badge) => {
      badge.remove();
    });
  };

  remove();

  const timerOne = window.setTimeout(remove, 300);
  const timerTwo = window.setTimeout(remove, 1200);

  const observer = new MutationObserver(remove);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    window.clearTimeout(timerOne);
    window.clearTimeout(timerTwo);
    observer.disconnect();
  };
}

function setupFooterFinalFixes() {
  const run = () => {
    const root = document.body;

    root
      .querySelectorAll<HTMLAnchorElement>(
        "a[href*='behance'], a[href*='be.net'], a[href*='binance.com'], a[aria-label*='Behance'], a[title*='Behance']",
      )
      .forEach((link) => {
        link.remove();
      });

    Array.from(root.querySelectorAll<HTMLElement>("a, span, div, p")).forEach(
      (element) => {
        const text = element.textContent?.trim().toLowerCase() ?? "";

        if (
          text === "bē" ||
          text === "be" ||
          text === "behance" ||
          text === "binance"
        ) {
          const link = element.closest("a");

          if (link) {
            link.remove();
            return;
          }

          element.remove();
        }
      },
    );

    Array.from(root.querySelectorAll<HTMLElement>("a, span, div, p")).forEach(
      (element) => {
        const text = element.textContent?.trim() ?? "";

        if (
          text === "Designed by" ||
          text === "Mavenflow" ||
          text === "Designed by Mavenflow"
        ) {
          const parent = element.parentElement;

          if (parent) {
            parent.innerHTML =
              '<span class="lk-inspired-webflow-badge"><span class="lk-inspired-webflow-icon" aria-hidden="true">W</span><span>Inspired by Webflow</span></span>';
          } else {
            element.innerHTML =
              '<span class="lk-inspired-webflow-badge"><span class="lk-inspired-webflow-icon" aria-hidden="true">W</span><span>Inspired by Webflow</span></span>';
          }
        }

        if (text === "License") {
          const parent = element.parentElement;

          if (parent?.textContent?.includes("License")) {
            parent.remove();
          } else {
            element.remove();
          }
        }

        if (text === "Powered by") {
          const parent = element.parentElement;

          if (parent) {
            parent.innerHTML =
              '<span class="lk-inspired-webflow-badge"><span class="lk-inspired-webflow-icon" aria-hidden="true">W</span><span>Inspired by Webflow</span></span>';
          } else {
            element.innerHTML =
              '<span class="lk-inspired-webflow-badge"><span class="lk-inspired-webflow-icon" aria-hidden="true">W</span><span>Inspired by Webflow</span></span>';
          }
        }

        if (
          text === "Webflow" &&
          element.closest("footer, [class*='footer'], [class*='Footer']")
        ) {
          const parent = element.parentElement;

          if (parent?.textContent?.includes("Powered by")) {
            parent.innerHTML =
              '<span class="lk-inspired-webflow-badge"><span class="lk-inspired-webflow-icon" aria-hidden="true">W</span><span>Inspired by Webflow</span></span>';
          }
        }

        if (text === "Made in Webflow" || text === "Made with Webflow") {
          element.innerHTML =
            '<span class="lk-inspired-webflow-badge"><span class="lk-inspired-webflow-icon" aria-hidden="true">W</span><span>Inspired by Webflow</span></span>';
        }
      },
    );

    const emailInput =
      root.querySelector<HTMLInputElement>("footer input[type='email']") ??
      root.querySelector<HTMLInputElement>(
        "[class*='footer'] input[type='email']",
      ) ??
      root.querySelector<HTMLInputElement>("input[placeholder*='Email']");

    if (emailInput) {
      const form = emailInput.closest("form");
      const submit =
        form?.querySelector<HTMLElement>(
          "button[type='submit'], input[type='submit']",
        ) ??
        emailInput.parentElement?.querySelector<HTMLElement>(
          "button, input[type='submit']",
        );

      if (form) {
        form.classList.add("lk-footer-newsletter-form");
        form.style.setProperty("display", "grid", "important");
        form.style.setProperty("gap", "24px", "important");
        form.style.setProperty("row-gap", "24px", "important");
      }

      emailInput.style.setProperty("margin-bottom", "0", "important");

      if (submit) {
        submit.style.setProperty("margin-top", "24px", "important");
      }
    }

    document.querySelectorAll(".w-webflow-badge").forEach((badge) => {
      badge.remove();
    });
  };

  run();

  const timerOne = window.setTimeout(run, 100);
  const timerTwo = window.setTimeout(run, 500);
  const timerThree = window.setTimeout(run, 1500);
  const timerFour = window.setTimeout(run, 3000);

  const observer = new MutationObserver(run);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    window.clearTimeout(timerOne);
    window.clearTimeout(timerTwo);
    window.clearTimeout(timerThree);
    window.clearTimeout(timerFour);
    observer.disconnect();
  };
}

function setupBlogCaseStudies() {
  const section = document.querySelector<HTMLElement>(".leon-blog-section");

  if (!section) return () => {};

  const cards = Array.from(
    section.querySelectorAll<HTMLElement>(".leon-blog-case-card"),
  );

  const pageButtons = Array.from(
    section.querySelectorAll<HTMLButtonElement>("[data-blog-page]"),
  );

  const prevButton = section.querySelector<HTMLButtonElement>(
    "[data-blog-page-prev='true']",
  );

  const nextButton = section.querySelector<HTMLButtonElement>(
    "[data-blog-page-next='true']",
  );

  const firstButton = section.querySelector<HTMLButtonElement>(
  "[data-blog-page-first='true']",
);

const lastButton = section.querySelector<HTMLButtonElement>(
  "[data-blog-page-last='true']",
);

const pageSelect = section.querySelector<HTMLSelectElement>(
  "[data-blog-page-select='true']",
);

  const modal = section.querySelector<HTMLElement>("[data-case-study-modal='true']");
  const articles = Array.from(
    section.querySelectorAll<HTMLElement>("[data-case-study-article]"),
  );

  const closeButtons = Array.from(
    section.querySelectorAll<HTMLElement>("[data-case-study-close='true']"),
  );

  const totalPages = Math.max(pageButtons.length, 1);
  let currentPage = 1;

  const updatePage = (page: number) => {
    currentPage = Math.min(Math.max(page, 1), totalPages);

    cards.forEach((card) => {
      const cardPage = Number(card.dataset.blogCasePage || "1");
      const isVisible = cardPage === currentPage;

      card.classList.toggle("is-blog-case-visible", isVisible);
      card.style.setProperty("display", isVisible ? "grid" : "none", "important");
    });

    pageButtons.forEach((button) => {
      const isActive = Number(button.dataset.blogPage || "1") === currentPage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

if (prevButton) {
  prevButton.disabled = currentPage === 1;
}

if (firstButton) {
  firstButton.disabled = currentPage === 1;
}

if (nextButton) {
  nextButton.disabled = currentPage === totalPages;
}

if (lastButton) {
  lastButton.disabled = currentPage === totalPages;
}

if (pageSelect) {
  pageSelect.value = String(currentPage);
}
  };

  const openCaseStudy = (slug: string) => {
    if (!modal) return;

    articles.forEach((article) => {
      const isActive = article.dataset.caseStudyArticle === slug;

      article.classList.toggle("is-active", isActive);
      article.style.setProperty("display", isActive ? "grid" : "none", "important");
    });

    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.documentElement.classList.add("leon-case-study-open");
  };

  const closeCaseStudy = () => {
    if (!modal) return;

    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-open");
    document.documentElement.classList.remove("leon-case-study-open");
  };

  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;

    if (!target) return;

    const caseStudyLink = target.closest<HTMLAnchorElement>(
      "[data-case-study-slug]",
    );

    if (caseStudyLink && section.contains(caseStudyLink)) {
      event.preventDefault();

      const slug = caseStudyLink.dataset.caseStudySlug;

      if (slug) {
        openCaseStudy(slug);
      }

      return;
    }
  };

  pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updatePage(Number(button.dataset.blogPage || "1"));
    });
  });

  prevButton?.addEventListener("click", () => {
    updatePage(currentPage - 1);
  });

  nextButton?.addEventListener("click", () => {
  updatePage(currentPage + 1);
});

firstButton?.addEventListener("click", () => {
  updatePage(1);
});

lastButton?.addEventListener("click", () => {
  updatePage(totalPages);
});

pageSelect?.addEventListener("change", () => {
  updatePage(Number(pageSelect.value || "1"));
});

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeCaseStudy);
  });

  document.addEventListener("click", handleDocumentClick);

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeCaseStudy();
    }
  };

  document.addEventListener("keydown", handleKeydown);

  updatePage(1);

  return () => {
    document.removeEventListener("click", handleDocumentClick);
    document.removeEventListener("keydown", handleKeydown);
    document.documentElement.classList.remove("leon-case-study-open");
  };
}

function setupLazyProgressImages() {
  const layout = document.querySelector<HTMLElement>(".leon-projects-layout");

  if (!layout) return () => {};

  const rows = Array.from(
    layout.querySelectorAll<HTMLElement>(".leon-project-row"),
  );

  const loadMoreWrap = layout.querySelector<HTMLElement>(
    ".leon-project-load-more-wrap",
  );

  const loadMoreButton = layout.querySelector<HTMLButtonElement>(
    "[data-load-more-projects='true']",
  );

  const loadAllButton = layout.querySelector<HTMLButtonElement>(
    "[data-load-all-projects='true']",
  );

  const progressLine = layout.querySelector<SVGPathElement>(
    ".leon-project-load-more-progress-line",
  );

  const batchSize = 3;
  let visibleCount = batchSize;
  let isLoading = false;
  let timer = 0;
  let animation: { pause?: () => void } | null = null;
  let loadTargetCount = batchSize;

  const prepareProgress = () => {
    if (!progressLine) return null;

    const length = progressLine.getTotalLength();

    progressLine.style.removeProperty("transition");
    progressLine.style.removeProperty("animation");
    progressLine.style.strokeDasharray = String(length);
    progressLine.style.strokeDashoffset = String(length);

    return {
      line: progressLine,
      length,
    };
  };

  const updateRows = (nextVisibleCount: number, animateFromIndex = -1) => {
    visibleCount = Math.min(nextVisibleCount, rows.length);

    rows.forEach((row, index) => {
      const shouldShow = index < visibleCount;

      row.classList.toggle("is-project-hidden", !shouldShow);
      row.classList.toggle("is-project-visible", shouldShow);

      if (shouldShow && index >= animateFromIndex) {
        row.classList.add("is-project-loading-in");

        window.setTimeout(() => {
          row.classList.remove("is-project-loading-in");
        }, 820);
      }
    });

    if (visibleCount >= rows.length) {
      loadMoreWrap?.classList.add("is-complete");
    } else {
      loadMoreWrap?.classList.remove("is-complete");
    }

    const remaining = Math.max(rows.length - visibleCount, 0);
    const nextAmount = Math.min(batchSize, remaining);

    if (loadMoreButton) {
      loadMoreButton.textContent =
        remaining > 0
          ? "Load " +
            String(nextAmount) +
            " more project" +
            (nextAmount === 1 ? "" : "s")
          : "All projects loaded";
    }

    if (loadAllButton) {
      loadAllButton.style.display = remaining > 0 ? "" : "none";
    }
  };

  const finishLoading = () => {
    const previousVisibleCount = visibleCount;

    updateRows(loadTargetCount, previousVisibleCount);

    timer = window.setTimeout(() => {
      loadMoreWrap?.classList.remove("is-loading");

      if (loadMoreButton) {
        loadMoreButton.disabled = false;
      }

      if (loadAllButton) {
        loadAllButton.disabled = false;
      }

      isLoading = false;
      prepareProgress();
    }, 420);
  };

  const startLoadingTo = async (nextCount: number, duration = 1800) => {
    if (isLoading) return;
    if (visibleCount >= rows.length) return;

    isLoading = true;
    loadTargetCount = Math.min(nextCount, rows.length);

    loadMoreWrap?.classList.add("is-loading");

    if (loadMoreButton) {
      loadMoreButton.disabled = true;
    }

    if (loadAllButton) {
      loadAllButton.disabled = true;
    }

    const progress = prepareProgress();

    await loadAnimeJs();

    if (progress && window.anime) {
      animation = window.anime({
        targets: progress.line,
        strokeDashoffset: [progress.length, 0],
        duration,
        easing: "easeInOutCirc",
        complete: finishLoading,
      });

      return;
    }

    timer = window.setTimeout(() => {
      if (progress) {
        progress.line.style.strokeDashoffset = "0";
      }

      finishLoading();
    }, duration);
  };

  const handleLoadMore = () => {
    startLoadingTo(visibleCount + batchSize, 1800);
  };

  const handleLoadAll = () => {
    startLoadingTo(rows.length, 2200);
  };

  rows.forEach((row) => {
    row.classList.remove(
      "is-loading",
      "is-loaded",
      "is-project-hidden",
      "is-project-visible",
      "is-project-loading-in",
    );
  });

  prepareProgress();
  updateRows(batchSize);

  loadMoreButton?.addEventListener("click", handleLoadMore);
  loadAllButton?.addEventListener("click", handleLoadAll);

  return () => {
    window.clearTimeout(timer);
    animation?.pause?.();
    loadMoreButton?.removeEventListener("click", handleLoadMore);
    loadAllButton?.removeEventListener("click", handleLoadAll);
  };
}

type MlFrontendImageItem = {
  cover: string | null;
  images: string[];
  updatedAt?: string;
};

type MlFrontendImagesResponse = {
  images: Record<string, MlFrontendImageItem>;
};

async function loadMlFrontendImages() {
  try {
    const response = await fetch("/api/ml/frontend-images", {
      cache: "no-store",
    });

    if (!response.ok) return {};

    const data = (await response.json()) as MlFrontendImagesResponse;

    return data.images || {};
  } catch {
    return {};
  }
}

function updateImageElement(image: HTMLImageElement, src: string) {
  if (!src) return;
  if (image.getAttribute("src") === src) return;

  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  image.src = src;
  image.dataset.mlFrontendImage = "true";
}

async function applyMlFrontendImagesToDom() {
  const imageMap = await loadMlFrontendImages();

  document
    .querySelectorAll<HTMLAnchorElement>(".leon-project-thumb-link[data-project-slug]")
    .forEach((link) => {
      const slug = link.dataset.projectSlug;
      if (!slug) return;

      const item = imageMap[slug];
      const src = item?.cover || item?.images?.[0];
      if (!src) return;

      const image = link.querySelector<HTMLImageElement>("img.leon-project-thumb");
      if (!image) return;

      updateImageElement(image, src);
    });

  document
    .querySelectorAll<HTMLAnchorElement>(".leon-blog-case-thumb[data-case-study-slug]")
    .forEach((link) => {
      const slug = link.dataset.caseStudySlug;
      if (!slug) return;

      const item = imageMap[slug];
      const src = item?.cover || item?.images?.[0];
      if (!src) return;

      const image = link.querySelector<HTMLImageElement>("img.leon-blog-case-image");
      if (!image) return;

      updateImageElement(image, src);
    });

    
  document
  .querySelectorAll<HTMLElement>(".leon-case-study-article[data-case-study-article]")
  .forEach((article) => {
    const slug = article.dataset.caseStudyArticle;
    if (!slug) return;

    const item = imageMap[slug];
    const src = item?.cover || item?.images?.[0];
    if (!src) return;

    const image = article.querySelector<HTMLImageElement>(
      "img.leon-case-study-article-image",
    );

    if (!image) return;

    updateImageElement(image, src);
  });  

  window.dispatchEvent(
    new CustomEvent("ml-frontend-images-loaded", {
      detail: imageMap,
    }),
  );
}

function setupMlFrontendImageHydration() {
  let disposed = false;

  const run = () => {
    if (disposed) return;
    applyMlFrontendImagesToDom();
  };

  run();

  const onStorage = (event: StorageEvent) => {
    if (event.key !== "ml-frontend-images-updated") return;
    run();
  };

  const onCustomUpdate = () => {
    run();
  };

  const onFocus = () => {
    run();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("ml-frontend-images-updated", onCustomUpdate);
  window.addEventListener("focus", onFocus);

  return () => {
    disposed = true;
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("ml-frontend-images-updated", onCustomUpdate);
    window.removeEventListener("focus", onFocus);
  };
}

export default function PageEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      document
        .querySelectorAll<HTMLElement>(
          ".portfolio-inner, .dandy-card-frame-wrap, .portfolio-section-mobile, .portfolio-section-mobile *, .leon-reveal, .leon-project-row, .leon-experience-card, .leon-tech-logo-card, .hero-title-wrap, .hero-text-wrap, .hero-btn-wrap, .hero-counter-item",
        )
        .forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
          element.style.filter = "none";
        });

      return;
    }

    const cleanupCustomReveals = setupCustomSectionReveals();
    const cleanupPortfolioReplay = setupPortfolioSectionReplay();
    const cleanupMobilePortfolioReplay = setupMobilePortfolioReplay();
    const cleanupHeroReplay = setupHeroReplay();
    const cleanupLazyProgressImages = setupLazyProgressImages();
    const cleanupMlFrontendImages = setupMlFrontendImageHydration();
    const cleanupBlogCaseStudies = setupBlogCaseStudies();
    const cleanupMobileProjectsMenu = setupMobileProjectsMenu();
    const cleanupWebflowBadge = removeWebflowBadge();
    const cleanupPagePreloader = setupPagePreloader();
    const cleanupLogoColorSwap = setupLogoColorSwap();
    const cleanupFooterFinalFixes = setupFooterFinalFixes();

    return () => {
      cleanupCustomReveals();
      cleanupPortfolioReplay();
      cleanupMobilePortfolioReplay();
      cleanupHeroReplay();
      cleanupLazyProgressImages();
      cleanupMlFrontendImages();
      cleanupBlogCaseStudies();
      cleanupMobileProjectsMenu();
      cleanupWebflowBadge();
      cleanupPagePreloader();
      cleanupLogoColorSwap();
      cleanupFooterFinalFixes();
    };
  }, []);

  return null;
}
