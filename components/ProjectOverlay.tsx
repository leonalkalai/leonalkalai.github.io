"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ProjectItem = {
  title: string;
  slug: string;
  url: string;
  meta: string;
  description: string;
  year: string;
  index: number;
  image: string;
  gallery: string[];
};

type MlFrontendImageItem = {
  cover: string | null;
  images: string[];
  updatedAt?: string;
};

const projects = [{"title":"Hotels Finder","url":"https://hotelsfinder.great-site.net","meta":"PHP · Booking Platform","description":"Hotel search and booking-style PHP web application with room pages and demo authentication. Demo login: demo@demo.gr / demo","year":"2026","slug":"hotels-finder","index":0,"image":"/ml-screenshots/hotels-finder/cover.webp","gallery":["/ml-screenshots/hotels-finder/cover.webp","/ml-screenshots/hotels-finder/slide-1.webp","/ml-screenshots/hotels-finder/slide-2.webp","/ml-screenshots/hotels-finder/slide-3.webp","/ml-screenshots/hotels-finder/slide-3.webp","/ml-screenshots/hotels-finder/slide-3.webp"]},{"title":"Hotels Finder Room Page","url":"https://hotelsfinder.great-site.net/room-page.php?room_id=2&check_in_date=&check_out_date=&i=1","meta":"PHP · Room Detail Page","description":"Room details page for the Hotels Finder booking flow.","year":"2026","slug":"hotels-finder-room-page","index":1,"image":"/ml-screenshots/hotels-finder-room-page/cover.webp","gallery":["/ml-screenshots/hotels-finder-room-page/cover.webp","/ml-screenshots/hotels-finder-room-page/slide-1.webp","/ml-screenshots/hotels-finder-room-page/slide-2.webp","/ml-screenshots/hotels-finder-room-page/slide-3.webp","/ml-screenshots/hotels-finder-room-page/slide-3.webp","/ml-screenshots/hotels-finder-room-page/slide-3.webp"]},{"title":"Next.js Finance App","url":"https://nextjs-finance-app-theta.vercel.app/","meta":"Next.js · Dashboard","description":"Finance dashboard application built with Next.js and deployed on Vercel.","year":"2026","slug":"next-js-finance-app","index":2,"image":"/ml-screenshots/next-js-finance-app/cover.webp","gallery":["/ml-screenshots/next-js-finance-app/cover.webp","/ml-screenshots/next-js-finance-app/slide-1.webp","/ml-screenshots/next-js-finance-app/slide-2.webp","/ml-screenshots/next-js-finance-app/slide-3.webp","/ml-screenshots/next-js-finance-app/slide-3.webp","/ml-screenshots/next-js-finance-app/slide-3.webp"]},{"title":"Personal Portfolio","url":"https://leonalkalai.github.io/","meta":"Portfolio · Frontend","description":"Personal portfolio and project hub with selected frontend and web application work.","year":"2026","slug":"personal-portfolio","index":3,"image":"/ml-screenshots/personal-portfolio/cover.webp","gallery":["/ml-screenshots/personal-portfolio/cover.webp","/ml-screenshots/personal-portfolio/slide-1.webp","/ml-screenshots/personal-portfolio/slide-2.webp","/ml-screenshots/personal-portfolio/slide-3.webp","/ml-screenshots/personal-portfolio/slide-3.webp","/ml-screenshots/personal-portfolio/slide-3.webp"]},{"title":"Phidiashouse Apartments","url":"https://phidiashouse.com/","meta":"React · SEO","description":"Luxury apartment rental website with React, TailwindCSS, SEO, performance, and accessibility improvements.","year":"2025","slug":"phidiashouse-apartments","index":4,"image":"/ml-screenshots/phidiashouse-apartments/cover.webp","gallery":["/ml-screenshots/phidiashouse-apartments/cover.webp","/ml-screenshots/phidiashouse-apartments/slide-1.webp","/ml-screenshots/phidiashouse-apartments/slide-2.webp","/ml-screenshots/phidiashouse-apartments/slide-3.webp","/ml-screenshots/phidiashouse-apartments/slide-3.webp","/ml-screenshots/phidiashouse-apartments/slide-3.webp"]},{"title":"Exsell Digital Marketplace","url":"https://exsell-digital-marketplace-9hm9.vercel.app/","meta":"Marketplace · Vercel","description":"Digital marketplace web application deployed on Vercel.","year":"2026","slug":"exsell-digital-marketplace","index":5,"image":"https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53b185d36d6444f789529_thumb-6.webp","gallery":["https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53b185d36d6444f789529_thumb-6.webp","https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b539ebfb857959dda95041_thumb-1.webp","https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53a9cc2359db9dde9fd34_thumb-2.webp","https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53ab58b03552fa6f3ebaf_thumb-3.webp"]},{"title":"Psyllias Giorgos Gypsosanides","url":"https://psyllias-giorgos-gypsosanides.vercel.app/","meta":"Business · Website","description":"Responsive business website for professional services.","year":"2026","slug":"psyllias-giorgos-gypsosanides","index":6,"image":"/ml-screenshots/psyllias-giorgos-gypsosanides/cover.webp","gallery":["/ml-screenshots/psyllias-giorgos-gypsosanides/cover.webp","/ml-screenshots/psyllias-giorgos-gypsosanides/slide-1.webp","/ml-screenshots/psyllias-giorgos-gypsosanides/slide-2.webp","/ml-screenshots/psyllias-giorgos-gypsosanides/slide-3.webp","/ml-screenshots/psyllias-giorgos-gypsosanides/slide-3.webp","/ml-screenshots/psyllias-giorgos-gypsosanides/slide-3.webp"]},{"title":"Osiris Contact Learning","url":"https://osiris-contact-learning-rps3.vercel.app/","meta":"Learning · Vercel","description":"Learning and contact web application deployed on Vercel.","year":"2026","slug":"osiris-contact-learning","index":7,"image":"/ml-screenshots/osiris-contact-learning/cover.webp","gallery":["/ml-screenshots/osiris-contact-learning/cover.webp","/ml-screenshots/osiris-contact-learning/slide-1.webp","/ml-screenshots/osiris-contact-learning/slide-2.webp","/ml-screenshots/osiris-contact-learning/slide-3.webp","/ml-screenshots/osiris-contact-learning/slide-3.webp","/ml-screenshots/osiris-contact-learning/slide-3.webp"]},{"title":"Hotels Finder ElementFX","url":"https://hotelsfinder.elementfx.com","meta":"PHP · Booking Platform","description":"Alternative deployment of the Hotels Finder booking application.","year":"2026","slug":"hotels-finder-elementfx","index":8,"image":"/ml-screenshots/hotels-finder-elementfx/cover.webp","gallery":["/ml-screenshots/hotels-finder-elementfx/cover.webp","/ml-screenshots/hotels-finder-elementfx/slide-1.webp","/ml-screenshots/hotels-finder-elementfx/slide-2.webp","/ml-screenshots/hotels-finder-elementfx/slide-3.webp","/ml-screenshots/hotels-finder-elementfx/slide-3.webp","/ml-screenshots/hotels-finder-elementfx/slide-3.webp"]},{"title":"MenuHelp App","url":"https://chingu-voyages.github.io/V53-tier2-team-23/","meta":"Chingu · Full-stack","description":"Full-stack menu scheduling platform integrating a Dishes API, built through Chingu team collaboration.","year":"2025","slug":"menuhelp-app","index":9,"image":"/ml-screenshots/menuhelp-app/cover.webp","gallery":["/ml-screenshots/menuhelp-app/cover.webp","/ml-screenshots/menuhelp-app/slide-1.webp","/ml-screenshots/menuhelp-app/slide-2.webp","/ml-screenshots/menuhelp-app/slide-3.webp","/ml-screenshots/menuhelp-app/slide-3.webp","/ml-screenshots/menuhelp-app/slide-3.webp"]},{"title":"Bookaholics","url":"https://in-tech-gration-cohort-0x02.github.io/Bookaholics/","meta":"JavaScript · API","description":"Book discovery platform integrating Google Books API.","year":"2025","slug":"bookaholics","index":10,"image":"/ml-screenshots/bookaholics/cover.webp","gallery":["/ml-screenshots/bookaholics/cover.webp","/ml-screenshots/bookaholics/slide-1.webp","/ml-screenshots/bookaholics/slide-2.webp","/ml-screenshots/bookaholics/slide-3.webp","/ml-screenshots/bookaholics/slide-3.webp","/ml-screenshots/bookaholics/slide-3.webp"]},{"title":"create-website.gr","url":"https://create-website.gr/","meta":"Employer · Company Context","description":"Company where I worked as Full-Stack / WordPress Developer, contributing to client projects including Argynet, Body Move, Tesma, Zafiropoulos Tours, and Mykonos Rent A Cars.","year":"2025","personal":false,"ownership":"employer-company","company":"create-website","companyUrl":"https://create-website.gr/","displayInProjects":false,"displayInCaseStudies":false,"useForMl":false,"slug":"create-website-gr","index":11,"image":"https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53b185d36d6444f789529_thumb-6.webp","gallery":["https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53b185d36d6444f789529_thumb-6.webp","https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b539ebfb857959dda95041_thumb-1.webp","https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53a9cc2359db9dde9fd34_thumb-2.webp","https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53ab58b03552fa6f3ebaf_thumb-3.webp"]},{"title":"Argynet Support Hosting","url":"https://argynet.support-hosting.gr/","meta":"Hosting · Support","description":"Hosted business and support website implementation.","year":"2026","personal":false,"ownership":"employer","company":"create-website","companyUrl":"https://create-website.gr/","roleContext":"Contributed to this project as part of my Full-Stack Developer role at create-website.","slug":"argynet-support-hosting","index":12,"image":"/ml-screenshots/argynet-support-hosting/cover.webp","gallery":["/ml-screenshots/argynet-support-hosting/cover.webp","/ml-screenshots/argynet-support-hosting/slide-1.webp","/ml-screenshots/argynet-support-hosting/slide-2.webp","/ml-screenshots/argynet-support-hosting/slide-3.webp","/ml-screenshots/argynet-support-hosting/slide-3.webp","/ml-screenshots/argynet-support-hosting/slide-3.webp"]},{"title":"Body Move","url":"https://body-move.vercel.app/","meta":"Web App · Vercel","description":"Fitness and movement-oriented web project deployed on Vercel.","year":"2026","personal":false,"ownership":"employer","company":"create-website","companyUrl":"https://create-website.gr/","roleContext":"Contributed to this project as part of my Full-Stack Developer role at create-website.","slug":"body-move","index":13,"image":"/ml-screenshots/body-move/cover.webp","gallery":["/ml-screenshots/body-move/cover.webp","/ml-screenshots/body-move/slide-1.webp","/ml-screenshots/body-move/slide-2.webp","/ml-screenshots/body-move/slide-3.webp","/ml-screenshots/body-move/slide-3.webp","/ml-screenshots/body-move/slide-3.webp"]},{"title":"Tesma","url":"https://tesma.create-site.gr/","meta":"Business · Website","description":"Business website deployed under create-site.gr.","year":"2026","personal":false,"ownership":"employer","company":"create-website","companyUrl":"https://create-website.gr/","roleContext":"Contributed to this project as part of my Full-Stack / WordPress Developer role at create-website.","slug":"tesma","index":14,"image":"/ml-screenshots/tesma/cover.webp","gallery":["/ml-screenshots/tesma/cover.webp","/ml-screenshots/tesma/slide-1.webp","/ml-screenshots/tesma/slide-2.webp","/ml-screenshots/tesma/slide-3.webp","/ml-screenshots/tesma/slide-3.webp","/ml-screenshots/tesma/slide-3.webp"]},{"title":"Zafiropoulos Tours","url":"https://zafiropoulostours.gr/","meta":"Tourism · Website","description":"Tourism and travel business website.","year":"2026","personal":false,"ownership":"employer","company":"create-website","companyUrl":"https://create-website.gr/","roleContext":"Contributed to this project as part of my WordPress Developer role at create-website.","slug":"zafiropoulos-tours","index":15,"image":"/ml-screenshots/zafiropoulos-tours/cover.webp","gallery":["/ml-screenshots/zafiropoulos-tours/cover.webp","/ml-screenshots/zafiropoulos-tours/slide-1.webp","/ml-screenshots/zafiropoulos-tours/slide-2.webp","/ml-screenshots/zafiropoulos-tours/slide-3.webp","/ml-screenshots/zafiropoulos-tours/slide-3.webp","/ml-screenshots/zafiropoulos-tours/slide-3.webp"]},{"title":"Mykonos Rent A Cars","url":"https://mykonosrentacars.com/","meta":"Rental · Website","description":"Car rental business website for Mykonos.","year":"2026","personal":false,"ownership":"employer","company":"create-website","companyUrl":"https://create-website.gr/","roleContext":"Contributed to this project as part of my Full-Stack Developer role at create-website.","slug":"mykonos-rent-a-cars","index":16,"image":"/ml-screenshots/mykonos-rent-a-cars/cover.webp","gallery":["/ml-screenshots/mykonos-rent-a-cars/cover.webp","/ml-screenshots/mykonos-rent-a-cars/slide-1.webp","/ml-screenshots/mykonos-rent-a-cars/slide-2.webp","/ml-screenshots/mykonos-rent-a-cars/slide-3.webp","/ml-screenshots/mykonos-rent-a-cars/slide-3.webp","/ml-screenshots/mykonos-rent-a-cars/slide-3.webp"]}] as ProjectItem[];

function findProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug) ?? null;
}

function getSlugFromPathname(pathname: string) {
  const match = pathname.match(/^\/projects\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function ProjectOverlay() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isMountedOpen, setIsMountedOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadedCarouselImages, setLoadedCarouselImages] = useState<Record<string, boolean>>({});
  const [mlFrontendImages, setMlFrontendImages] = useState<
  Record<string, MlFrontendImageItem>
  >({});

  const liveProjects = useMemo(() => {
  return projects.map((project) => {
    const item = mlFrontendImages[project.slug];
    const selectedImages = Array.isArray(item?.images)
      ? item.images.filter(Boolean)
      : [];

    if (selectedImages.length === 0) return project;

    return {
      ...project,
      image: item?.cover || selectedImages[0] || project.image,
      gallery: selectedImages,
    };
  });
  }, [mlFrontendImages]);

  const findLiveProjectBySlug = (slug: string) => {
    return liveProjects.find((project) => project.slug === slug) ?? null;
  };

const nextProject = useMemo(() => {
  if (!activeProject) return null;
  return liveProjects[(activeProject.index + 1) % liveProjects.length] ?? null;
}, [activeProject, liveProjects]);

const previousProject = useMemo(() => {
  if (!activeProject) return null;

  return liveProjects[
    activeProject.index - 1 < 0
      ? liveProjects.length - 1
      : activeProject.index - 1
  ] ?? null;
}, [activeProject, liveProjects]);

const activeGallery = activeProject?.gallery ?? [];

useEffect(() => {
  setActiveProject((currentProject) => {
    if (!currentProject) return currentProject;

    const liveProject =
      liveProjects.find((project) => project.slug === currentProject.slug) ??
      currentProject;

    const currentGalleryKey = (currentProject.gallery || []).join("|");
    const liveGalleryKey = (liveProject.gallery || []).join("|");

    const isSame =
      currentProject.image === liveProject.image &&
      currentGalleryKey === liveGalleryKey;

    return isSame ? currentProject : liveProject;
  });
}, [liveProjects]);

const previousGalleryIndex =
  activeGallery.length > 0
    ? carouselIndex - 1 < 0
      ? activeGallery.length - 1
      : carouselIndex - 1
    : 0;

const nextGalleryIndex =
  activeGallery.length > 0
    ? (carouselIndex + 1) % activeGallery.length
    : 0;

const carouselSlides = activeGallery.map((src, index) => {
  let state = "other";

  if (index === carouselIndex) state = "current";
  else if (index === previousGalleryIndex) state = "previous";
  else if (index === nextGalleryIndex) state = "next";

  return {
    src,
    index,
    state,
  };
});

const goToProject = (project: ProjectItem | null) => {
  if (!project) return;
  openProject(project, true);
};

const goToPreviousGallerySlide = () => {
  if (activeGallery.length === 0) return;

  setCarouselIndex((current) =>
    current - 1 < 0 ? activeGallery.length - 1 : current - 1,
  );
};

const goToNextGallerySlide = () => {
  if (activeGallery.length === 0) return;

  setCarouselIndex((current) => (current + 1) % activeGallery.length);
};



const handleCarouselMouseMove = (event: React.MouseEvent<HTMLLIElement>) => {
  const slide = event.currentTarget;

  if (!slide.classList.contains("brann-project-slide-current")) return;

  const rect = slide.getBoundingClientRect();

  slide.style.setProperty(
    "--x",
    String(event.clientX - (rect.left + Math.floor(rect.width / 2))),
  );

  slide.style.setProperty(
    "--y",
    String(event.clientY - (rect.top + Math.floor(rect.height / 2))),
  );
};

const handleCarouselMouseLeave = (event: React.MouseEvent<HTMLLIElement>) => {
  event.currentTarget.style.setProperty("--x", "0");
  event.currentTarget.style.setProperty("--y", "0");
};

const markCarouselImageLoaded = (src: string) => {
  setLoadedCarouselImages((current) => ({
    ...current,
    [src]: true,
  }));
};

    const openProject = (project: ProjectItem, pushUrl = true) => {
      const wrap = wrapRef.current;
      const background = backgroundRef.current;
      const content = contentRef.current;

      if (!wrap || !background || !content) return;

      setActiveProject(project);
      setIsMountedOpen(true);

      if (pushUrl) {
        window.history.pushState(
          { projectSlug: project.slug },
          "",
          "/projects/" + project.slug,
        );
      }

      document.documentElement.classList.add("project-overlay-open");

      wrap.style.display = "block";
      wrap.style.pointerEvents = "auto";

      background.style.height = "0%";
      background.style.transition = "height 0.9s cubic-bezier(0.83, 0, 0.17, 1)";

      content.style.opacity = "0";
      content.style.transform = "translate3d(0, 28px, 0)";
      content.style.transition =
        "opacity 0.55s ease 0.34s, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.34s";

      window.requestAnimationFrame(() => {
        background.style.height = "100%";
        content.style.opacity = "1";
        content.style.transform = "translate3d(0, 0, 0)";
      });
    };

  const closeProject = (replaceUrl = true) => {
    const wrap = wrapRef.current;
    const background = backgroundRef.current;
    const content = contentRef.current;

    if (!wrap || !background || !content) return;

    content.style.opacity = "0";
    content.style.transform = "translate3d(0, 24px, 0)";
    content.style.transition =
      "opacity 0.28s ease, transform 0.35s cubic-bezier(0.83, 0, 0.17, 1)";

    background.style.height = "0%";
    background.style.transition =
      "height 0.72s cubic-bezier(0.83, 0, 0.17, 1) 0.12s";

    window.setTimeout(() => {
      wrap.style.display = "none";
      wrap.style.pointerEvents = "none";
      document.documentElement.classList.remove("project-overlay-open");
      setActiveProject(null);
      setIsMountedOpen(false);

      if (replaceUrl) {
        window.history.pushState({}, "", "/");
      }
    }, 880);
  };

  useEffect(() => {
  setCarouselIndex(0);
}, [activeProject?.slug]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>("a[data-project-slug]");

      if (!link) return;

      const slug = link.dataset.projectSlug;
      if (!slug) return;

      const project = findLiveProjectBySlug(slug);
      if (!project) return;

      event.preventDefault();
      openProject(project, true);
    };

    const handlePopState = () => {
      const slug = getSlugFromPathname(window.location.pathname);

      if (!slug) {
        closeProject(false);
        return;
      }

      const project = findLiveProjectBySlug(slug);

      if (project) {
        openProject(project, false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("popstate", handlePopState);

    const initialSlug = getSlugFromPathname(window.location.pathname);

    if (initialSlug) {
      const project = findLiveProjectBySlug(initialSlug);

      if (project) {
        window.setTimeout(() => openProject(project, false), 120);
      }
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("popstate", handlePopState);
      document.documentElement.classList.remove("project-overlay-open");
    };
  }, [liveProjects]);

  useEffect(() => {
  let active = true;

  async function loadMlImages() {
    try {
      const response = await fetch("/api/ml/frontend-images", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (!active) return;

      setMlFrontendImages(data.images || {});
    } catch {
      // keep static fallback images
    }
  }

  loadMlImages();

  const onStorage = (event: StorageEvent) => {
    if (event.key !== "ml-frontend-images-updated") return;
    loadMlImages();
  };

  const onLoaded = (event: Event) => {
    const customEvent = event as CustomEvent<Record<string, MlFrontendImageItem>>;
    if (customEvent.detail) {
      setMlFrontendImages(customEvent.detail);
      return;
    }

    loadMlImages();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("ml-frontend-images-loaded", onLoaded);
  window.addEventListener("ml-frontend-images-updated", loadMlImages);

  return () => {
    active = false;
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("ml-frontend-images-loaded", onLoaded);
    window.removeEventListener("ml-frontend-images-updated", loadMlImages);
  };
}, []);

  return (
    <>

      <div className="lk-page-preloader" data-page-preloader="true" aria-hidden="true">
        <div className="lk-page-preloader-card">
          <img
            src="/leonkountouras-logo.png"
            alt=""
            className="lk-page-preloader-logo"
          />
          <div className="lk-page-preloader-text">Loading</div>
          <div className="lk-page-preloader-line">
            <span></span>
          </div>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="brann-project-overlay-wrap"
        aria-hidden={!isMountedOpen}
      >
        <div ref={backgroundRef} className="brann-project-overlay-background" />

        <div ref={contentRef} className="brann-project-overlay-content">
          <div className="brann-project-overlay-top">
            <a href="/" className="brann-project-logo" onClick={(event) => {
              event.preventDefault();
              closeProject(true);
            }}>
              Λέων Κουντουράς
            </a>

            <button
              type="button"
              className="brann-project-close"
              onClick={() => closeProject(true)}
            >
              Close
            </button>
          </div>

          {activeProject ? (
            <article className="brann-project-detail">
              <div className="brann-project-copy">
                <div className="brann-project-kicker">
                  ({String(activeProject.index + 1).padStart(2, "0")}) / {activeProject.year}
                </div>

                <h1 className="brann-project-title">{activeProject.title}</h1>

                <div className="brann-project-meta">{activeProject.meta}</div>

                <p className="brann-project-description">
                  {activeProject.description}
                </p>

                <div className="brann-project-actions">
                  {previousProject ? (
                    <a
                      href={"/projects/" + previousProject.slug}
                      data-project-slug={previousProject.slug}
                      className="brann-project-previous"
                    >
                      Previous project — {previousProject.title}
                    </a>
                  ) : null}

                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="brann-project-visit"
                  >
                    Visit live project
                  </a>

                  {nextProject ? (
                    <a
                      href={"/projects/" + nextProject.slug}
                      data-project-slug={nextProject.slug}
                      className="brann-project-next"
                    >
                      Next project — {nextProject.title}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="brann-project-carousel" aria-label={activeProject.title + " gallery"}>
                <ul className="brann-project-slider">
                  {carouselSlides.map((slide) => (
                    <li
                      key={slide.src + "-" + slide.index}
                      className={
                        "brann-project-slide brann-project-slide-" +
                        slide.state +
                        (slide.state === "current" ? " brann-project-slide-current" : "")
                      }
                      onClick={() => {
                        if (slide.state !== "current") setCarouselIndex(slide.index);
                      }}
                      onMouseMove={handleCarouselMouseMove}
                      onMouseLeave={handleCarouselMouseLeave}
                    >
                      <div
                        className={
                          "brann-project-slide-image-wrap" +
                          (loadedCarouselImages[slide.src] ? " is-loaded" : "")
                        }
                      >
                        <div className="brann-project-image-loader" aria-hidden="true">
                          <span className="brann-project-image-loader-bar" />
                        </div>

                        <img
                          className="brann-project-slide-image"
                          src={slide.src}
                          alt={activeProject.title + " preview " + String(slide.index + 1)}
                          loading={slide.state === "current" ? "eager" : "lazy"}
                          decoding="async"
                          onLoad={() => markCarouselImageLoaded(slide.src)}
                        />
                      </div>

                      <div className="brann-project-slide-content">
                        <div className="brann-project-slide-label">
                          {slide.state === "current"
                            ? "Project preview"
                            : "Gallery"}
                        </div>

                        <h2 className="brann-project-slide-title">
                          {activeProject.title}
                        </h2>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="brann-project-carousel-controls">
                  <button
                    type="button"
                    className="brann-project-carousel-button brann-project-carousel-button-previous"
                    onClick={goToPreviousGallerySlide}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="brann-project-carousel-button brann-project-carousel-button-next"
                    onClick={goToNextGallerySlide}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        html.project-overlay-open,
        html.project-overlay-open body {
          overflow: hidden !important;
        }

        .brann-project-overlay-wrap {
          display: none;
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 999999;
          width: 100%;
          height: 100vh;
          color: #f7f4ee;
          background: rgba(255, 255, 255, 0.02);
        }
       .brann-project-overlay-background {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 0%;
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.18), transparent 34%),
            radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.10), transparent 32%),
            linear-gradient(
              135deg,
              rgba(17, 17, 17, 0.72),
              rgba(17, 17, 17, 0.46)
            );
          backdrop-filter: blur(28px) saturate(150%);
          -webkit-backdrop-filter: blur(28px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(255, 255, 255, 0.06),
            0 24px 80px rgba(0, 0, 0, 0.35);
          transform-origin: top center;
          will-change: height;
        }

        .brann-project-overlay-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          padding: clamp(24px, 4vw, 64px);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translate3d(0, 28px, 0);
          will-change: opacity, transform;
        }

        .brann-project-overlay-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: clamp(22px, 3vw, 42px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.20);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.035),
            rgba(255, 255, 255, 0)
          );
        }
          
        .brann-project-logo,
        .brann-project-close {
          color: #f7f4ee;
          font-family: inherit;
          font-size: clamp(16px, 1.25vw, 22px);
          line-height: 1;
          text-decoration: none;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }

        .brann-project-detail {
          flex: 1;
          display: grid;
          align-content: center;
          gap: clamp(20px, 3vw, 40px);
          max-width: 1160px;
          margin: 0 auto;
          width: 100%;
        }

        .brann-project-kicker {
          color: rgba(247, 244, 238, 0.62);
          font-size: clamp(14px, 1.1vw, 18px);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .brann-project-title {
          margin: 0;
          color: #f7f4ee;
          font-size: clamp(54px, 10vw, 152px);
          line-height: 0.84;
          letter-spacing: -0.075em;
          font-weight: 500;
        }

        .brann-project-meta {
          color: rgba(247, 244, 238, 0.72);
          font-size: clamp(18px, 1.6vw, 28px);
        }

        .brann-project-description {
          max-width: 760px;
          color: rgba(247, 244, 238, 0.76);
          font-size: clamp(17px, 1.25vw, 22px);
          line-height: 1.65;
          margin: 0;
        }

        .brann-project-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 10px;
        }

        .brann-project-visit,
        .brann-project-next {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border: 1px solid rgba(247, 244, 238, 0.28);
          border-radius: 999px;
          color: #f7f4ee;
          text-decoration: none;
          transition:
            background-color 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease;
        }

        .brann-project-visit:hover,
        .brann-project-next:hover {
          background: #f7f4ee;
          color: #111111;
          border-color: #f7f4ee;
        }

        @media (max-width: 767px) {
          .brann-project-overlay-content {
            padding: 22px;
          }

          .brann-project-title {
            font-size: clamp(44px, 17vw, 82px);
          }

          .brann-project-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .brann-project-detail {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.9fr);
          align-items: center;
          gap: clamp(28px, 5vw, 86px);
        }

        .brann-project-copy {
          min-width: 0;
        }

        .brann-project-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }

        .brann-project-previous,
        .brann-project-next,
        .brann-project-visit {
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          color: #f7f4ee;
          border-radius: 999px;
          padding: 13px 20px;
          text-decoration: none;
          transition:
            transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
            background 360ms ease,
            border-color 360ms ease;
        }

        .brann-project-previous:hover,
        .brann-project-next:hover,
        .brann-project-visit:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.34);
        }

        .brann-project-carousel {
          --slide-size: min(48vw, 560px);
          --slide-margin: clamp(12px, 2vw, 26px);
          position: relative;
          width: 100%;
          min-height: var(--slide-size);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .brann-project-slider {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr;
          place-items: center;
          width: 100%;
          height: var(--slide-size);
          margin: 0;
          padding: 0;
          position: relative;
        }

        .brann-project-slide {
          --x: 0;
          --y: 0;
          --d: 50;
          position: absolute;
          width: min(100%, var(--slide-size));
          height: var(--slide-size);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f7f4ee;
          opacity: 0.25;
          cursor: pointer;
          transition:
            opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.84),
            transform 600ms cubic-bezier(0.25, 1, 0.35, 1);
        }

        .brann-project-slide-previous {
          transform: translateX(-42%) scale(0.82);
          z-index: 1;
        }

        .brann-project-slide-next {
          transform: translateX(42%) scale(0.82);
          z-index: 1;
        }

        .brann-project-slide-current {
          opacity: 1;
          transform: translateX(0) scale(1);
          z-index: 3;
          cursor: default;
        }

        .brann-project-slide-previous:hover {
          opacity: 0.48;
          transform: translateX(-46%) scale(0.84);
        }

        .brann-project-slide-next:hover {
          opacity: 0.48;
          transform: translateX(46%) scale(0.84);
        }

        .brann-project-slide-image-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 28px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04)),
            rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            0 28px 80px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(22px) saturate(150%);
          -webkit-backdrop-filter: blur(22px) saturate(150%);
          transition: transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.84);
        }

        .brann-project-slide-current:hover .brann-project-slide-image-wrap {
          transform:
            scale(1.025)
            translate(
              calc(var(--x) / var(--d) * 1px),
              calc(var(--y) / var(--d) * 1px)
            );
        }

        .brann-project-slide-image {
          --d: 20;
          position: absolute;
          inset: -5%;
          width: 110%;
          height: 110%;
          object-fit: cover;
          opacity: 1;
          pointer-events: none;
          user-select: none;
          transition:
            transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.84),
            filter 600ms ease;
        }

        .brann-project-slide-current:hover .brann-project-slide-image {
          transform:
            translate(
              calc(var(--x) / var(--d) * 1px),
              calc(var(--y) / var(--d) * 1px)
            );
        }

        .brann-project-slide-content {
          --d: 60;
          position: relative;
          z-index: 4;
          padding: clamp(24px, 4vw, 48px);
          text-align: center;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 300ms ease,
            transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.84);
        }

        .brann-project-slide-current .brann-project-slide-content {
          opacity: 1;
          visibility: visible;
        }

        .brann-project-slide-current:hover .brann-project-slide-content {
          transform:
            translate(
              calc(var(--x) / var(--d) * -1px),
              calc(var(--y) / var(--d) * -1px)
            );
        }

        .brann-project-slide-label {
          margin-bottom: 14px;
          opacity: 0.74;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .brann-project-slide-title {
          margin: 0;
          font-size: clamp(34px, 5vw, 76px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          color: #f7f4ee;
          text-shadow: 0 18px 34px rgba(0, 0, 0, 0.34);
        }

        .brann-project-carousel-controls {
          position: absolute;
          left: 50%;
          bottom: -72px;
          z-index: 8;
          display: flex;
          align-items: center;
          gap: 14px;
          transform: translateX(-50%);
        }

        .brann-project-carousel-button {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #f7f4ee;
          cursor: pointer;
          font-size: 32px;
          line-height: 1;
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          transition:
            transform 300ms ease,
            background 300ms ease,
            border-color 300ms ease;
        }

        .brann-project-carousel-button:hover {
          transform: scale(0.94);
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.38);
        }

        @media (max-width: 991px) {
          .brann-project-detail {
            grid-template-columns: 1fr;
            gap: 95px;
          }

          .brann-project-carousel {
            --slide-size: min(86vw, 480px);
            order: -1;
          }

          .brann-project-slide-previous {
            transform: translateX(-28%) scale(0.78);
          }

          .brann-project-slide-next {
            transform: translateX(28%) scale(0.78);
          }

          .brann-project-slide-title {
            font-size: clamp(28px, 9vw, 52px);
          }

          .brann-project-copy {
              display: flex;
              flex-direction: column;
              gap: 18px;
          }
        }

      .brann-project-detail {
        display: grid;
        grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.9fr);
        align-items: center;
        gap: clamp(28px, 5vw, 86px);
      }

      .brann-project-copy {
        min-width: 0;
      }

      .brann-project-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 14px;
      }

      .brann-project-previous,
      .brann-project-next,
      .brann-project-visit {
        border: 1px solid rgba(255, 255, 255, 0.22);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(18px) saturate(150%);
        -webkit-backdrop-filter: blur(18px) saturate(150%);
        color: #f7f4ee;
        border-radius: 999px;
        padding: 13px 20px;
        text-decoration: none;
        transition:
          transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
          background 360ms ease,
          border-color 360ms ease;
      }

      .brann-project-previous:hover,
      .brann-project-next:hover,
      .brann-project-visit:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.34);
      }

      .brann-project-carousel {
        --slide-size: min(48vw, 560px);
        position: relative;
        width: 100%;
        min-height: var(--slide-size);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
      }

      .brann-project-slider {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr;
        place-items: center;
        width: 100%;
        height: var(--slide-size);
        margin: 0;
        padding: 0;
        position: relative;
      }

      .brann-project-slide {
        --x: 0;
        --y: 0;
        --d: 50;
        position: absolute;
        width: min(100%, var(--slide-size));
        height: var(--slide-size);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f7f4ee;
        opacity: 0;
        pointer-events: none;
        transition:
          opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.84),
          transform 600ms cubic-bezier(0.25, 1, 0.35, 1);
      }

      .brann-project-slide-previous,
      .brann-project-slide-next,
      .brann-project-slide-current {
        opacity: 1;
        pointer-events: auto;
      }

      .brann-project-slide-previous {
        transform: translateX(-42%) scale(0.82);
        z-index: 1;
        opacity: 0.28;
        cursor: w-resize;
      }

      .brann-project-slide-next {
        transform: translateX(42%) scale(0.82);
        z-index: 1;
        opacity: 0.28;
        cursor: e-resize;
      }

      .brann-project-slide-current {
        transform: translateX(0) scale(1);
        z-index: 3;
        cursor: default;
      }

      .brann-project-slide-previous:hover {
        opacity: 0.5;
        transform: translateX(-46%) scale(0.84);
      }

      .brann-project-slide-next:hover {
        opacity: 0.5;
        transform: translateX(46%) scale(0.84);
      }

      .brann-project-slide-image-wrap {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border-radius: 28px;
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04)),
          rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.22),
          0 28px 80px rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(22px) saturate(150%);
        -webkit-backdrop-filter: blur(22px) saturate(150%);
        transition: transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.84);
      }

      .brann-project-slide-current:hover .brann-project-slide-image-wrap {
        transform:
          scale(1.025)
          translate(
            calc(var(--x) / var(--d) * 1px),
            calc(var(--y) / var(--d) * 1px)
          );
      }

      .brann-project-slide-image {
        --d: 20;
        position: absolute;
        inset: -5%;
        width: 110%;
        height: 110%;
        object-fit: cover;
        opacity: 0;
        pointer-events: none;
        user-select: none;
        transition:
          opacity 500ms ease,
          transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.84),
          filter 600ms ease;
      }

      .brann-project-slide-image-wrap.is-loaded .brann-project-slide-image {
        opacity: 1;
      }

      .brann-project-slide-current:hover .brann-project-slide-image {
        transform:
          translate(
            calc(var(--x) / var(--d) * 1px),
            calc(var(--y) / var(--d) * 1px)
          );
      }

      .brann-project-slide-content {
        --d: 60;
        position: relative;
        z-index: 4;
        padding: clamp(24px, 4vw, 48px);
        text-align: center;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 300ms ease,
          transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.84);
      }

      .brann-project-slide-current .brann-project-slide-content {
        opacity: 1;
        visibility: visible;
      }

      .brann-project-slide-current:hover .brann-project-slide-content {
        transform:
          translate(
            calc(var(--x) / var(--d) * -1px),
            calc(var(--y) / var(--d) * -1px)
          );
      }

      .brann-project-slide-label {
        margin-bottom: 14px;
        opacity: 0.74;
        font-size: 13px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .brann-project-slide-title {
        margin: 0;
        font-size: clamp(34px, 5vw, 76px);
        line-height: 0.95;
        letter-spacing: -0.06em;
        color: #f7f4ee;
        text-shadow: 0 18px 34px rgba(0, 0, 0, 0.34);
      }

      .brann-project-carousel-controls {
        position: absolute;
        left: 50%;
        bottom: -72px;
        z-index: 8;
        display: flex;
        align-items: center;
        gap: 14px;
        transform: translateX(-50%);
      }

      .brann-project-carousel-button {
        width: 48px;
        height: 48px;
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: #f7f4ee;
        cursor: pointer;
        font-size: 32px;
        line-height: 1;
        backdrop-filter: blur(18px) saturate(150%);
        -webkit-backdrop-filter: blur(18px) saturate(150%);
        transition:
          transform 300ms ease,
          background 300ms ease,
          border-color 300ms ease;
      }

      .brann-project-carousel-button:hover {
        transform: scale(0.94);
        background: rgba(255, 255, 255, 0.16);
        border-color: rgba(255, 255, 255, 0.38);
      }

      /* Shaded progress loader */
      .brann-project-image-loader {
        position: absolute;
        left: 50%;
        bottom: 28px;
        z-index: 8;
        width: min(72%, 320px);
        height: 10px;
        padding: 2px;
        border-radius: 999px;
        transform: translateX(-50%);
        overflow: hidden;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.06)),
          rgba(0, 0, 0, 0.28);
        box-shadow:
          inset 0 1px 2px rgba(255, 255, 255, 0.25),
          inset 0 -1px 2px rgba(0, 0, 0, 0.35),
          0 12px 32px rgba(0, 0, 0, 0.32);
        opacity: 1;
        transition: opacity 350ms ease, transform 350ms ease;
      }

      .brann-project-image-loader-bar {
        display: block;
        width: 0%;
        height: 100%;
        border-radius: inherit;
        background:
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.42) 0%,
            rgba(255, 255, 255, 0.10) 25%,
            rgba(255, 255, 255, 0.42) 50%,
            rgba(255, 255, 255, 0.10) 75%,
            rgba(255, 255, 255, 0.42) 100%
          ),
          linear-gradient(90deg, #d8d8d8, #ffffff);
        background-size: 42px 42px, 100% 100%;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.6),
          0 0 18px rgba(255, 255, 255, 0.28);
        animation:
          brannImageLoaderFill 1600ms cubic-bezier(0.25, 1, 0.5, 1) infinite,
          brannImageLoaderStripes 900ms linear infinite;
      }

      .brann-project-slide-image-wrap.is-loaded .brann-project-image-loader {
        opacity: 0;
        transform: translateX(-50%) translateY(8px);
        pointer-events: none;
      }

      .brann-project-slide-image-wrap.is-loaded .brann-project-image-loader-bar {
        width: 100%;
        animation: none;
      }

      @keyframes brannImageLoaderFill {
        0% {
          width: 8%;
        }

        55% {
          width: 72%;
        }

        100% {
          width: 96%;
        }
      }

      @keyframes brannImageLoaderStripes {
        from {
          background-position: 0 0, 0 0;
        }

        to {
          background-position: 42px 0, 0 0;
        }
      }

      @media (max-width: 991px) {
        .brann-project-detail {
          grid-template-columns: 1fr;
          gap: 36px;
        }

        .brann-project-carousel {
          --slide-size: min(86vw, 480px);
          order: -1;
        }

        .brann-project-slide-previous {
          transform: translateX(-28%) scale(0.78);
        }

        .brann-project-slide-next {
          transform: translateX(28%) scale(0.78);
        }

        .brann-project-slide-title {
          font-size: clamp(28px, 9vw, 52px);
        }
      }        
      ` }} />
    </>
  );
}
