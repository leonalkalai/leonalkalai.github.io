import FirmoAboutEffects from "@/components/FirmoAboutEffects";

export const metadata = {
  title: "About | Leon Kountouras",
  description:
    "About Leon Kountouras, Software Engineer and Full-Stack Developer focused on modern web applications, responsive interfaces, backend APIs, databases, SEO, and performance.",
};

export default function AboutPage() {
  return (
    <>
      <FirmoAboutEffects />

      <main className="lk-about-page">
        <section className="lk-about-hero">
          <div className="lk-about-container lk-about-hero-grid">
            <div className="lk-about-copy">
              <p className="lk-about-eyebrow" data-about-reveal data-reveal="text-left">
                About me
              </p>

              <h1 data-about-reveal data-reveal="text-left">
                I build modern web applications, clean interfaces, and practical digital products.
              </h1>

              <p className="lk-about-lead" data-about-reveal data-reveal="text-left">
                I combine long-term IT experience with modern full-stack development,
                focusing on React, Next.js, TypeScript, Node.js, Supabase, databases,
                performance, SEO, and responsive user interfaces.
              </p>

              <a href="mailto:koundouras@gmail.com" className="lk-about-button" data-about-reveal data-reveal="text-left">
                Contact me
              </a>
            </div>

            <div className="lk-about-image-card" data-about-reveal data-reveal="image-down">
              <img src="/profile.png" alt="Leon Kountouras" />
            </div>
          </div>
        </section>

        <section className="lk-about-overview">
          <div className="lk-about-container lk-about-overview-grid">
            <div className="lk-about-copy">
              <p className="lk-about-eyebrow" data-about-reveal data-reveal="text-left">
                Leon Kountouras
              </p>

              <h2 data-about-reveal data-reveal="text-left">
                For over 25 years, I have worked across IT support, systems,
                web development, infrastructure, and full-stack application development.
              </h2>

              <p className="lk-about-muted" data-about-reveal data-reveal="text-left">
                My goal is to turn ideas into clear, maintainable, responsive, and scalable
                digital products with clean structure, practical features, performance,
                accessibility, and real project outcomes.
              </p>

              <a href="mailto:koundouras@gmail.com" className="lk-about-button" data-about-reveal data-reveal="text-left">
                Contact me
              </a>
            </div>

            <div>
              <div className="lk-about-image-card lk-about-placeholder-card" data-about-reveal data-reveal="image-up">
                <img src="/about-placeholder-1.svg" alt="Selected digital work" />
              </div>

              <div className="lk-about-stats">
                <div data-about-reveal data-reveal="text-up">
                  <strong>25+</strong>
                  <span>Years IT experience</span>
                </div>

                <div data-about-reveal data-reveal="text-up">
                  <strong>17+</strong>
                  <span>Portfolio projects</span>
                </div>

                <div data-about-reveal data-reveal="text-up">
                  <strong>Full-stack</strong>
                  <span>Current focus</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lk-about-selected-work">
          <div className="lk-about-container lk-about-work-grid">
            <p className="lk-about-eyebrow" data-about-reveal data-reveal="text-left">
              Selected work
            </p>

            <div className="lk-about-work-list">
              {[
                {
                  image: "/about-placeholder-2.svg",
                  title: "Hotels Finder: PHP booking-style web application",
                  text: "A practical hotel search and booking-style application with authentication, room pages, PHP logic, and database-driven structure.",
                  href: "/projects/hotels-finder",
                },
                {
                  image: "/about-placeholder-3.svg",
                  title: "Next.js Finance App: dashboard, invoices, customers, and charts",
                  text: "A modern finance dashboard built with Next.js, React, TypeScript, TailwindCSS, forms, validation, charts, and deployment-ready structure.",
                  href: "/projects/next-js-finance-app",
                },
                {
                  image: "/about-placeholder-4.svg",
                  title: "Phidiashouse Apartments: multilingual rental website and automation",
                  text: "A real rental website enhanced with multilingual content, SEO, comments automation, analytics, weather integration, and customer-focused UX.",
                  href: "/projects/phidiashouse-apartments",
                },
              ].map((item, index) => (
                <a href={item.href} className="lk-about-work-card" key={item.title} data-about-reveal data-reveal={index % 2 === 0 ? "text-right" : "text-left"}>
                  <div className="lk-about-work-image" data-about-reveal data-reveal={index % 2 === 0 ? "image-down" : "image-up"}>
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="lk-about-work-content">
                    <div className="lk-about-tags">
                      <span>Project</span>
                      <span>Web app</span>
                      <span>Case study</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>

                  <span className="lk-about-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="lk-about-strengths-section">
          <div className="lk-about-container">
            <p className="lk-about-eyebrow" data-about-reveal data-reveal="text-left">
              Core strengths
            </p>

            <h2 className="lk-about-section-title" data-about-reveal data-reveal="text-left">
              How I approach software engineering and digital product development.
            </h2>

            <div className="lk-about-strengths-grid">
              <article className="lk-about-strength-card" data-about-reveal data-reveal="text-up">
                <h3>Frontend engineering</h3>
                <p>Responsive interfaces with React, Next.js, TypeScript, TailwindCSS, accessibility, and clean component structure.</p>
              </article>

              <article className="lk-about-strength-card" data-about-reveal data-reveal="text-up">
                <h3>Backend & databases</h3>
                <p>REST APIs, Node.js, authentication, dashboards, Supabase, MySQL, MongoDB, PostgreSQL, and Prisma-based structures.</p>
              </article>

              <article className="lk-about-strength-card" data-about-reveal data-reveal="text-up">
                <h3>Real project delivery</h3>
                <p>SEO, performance, deployments, debugging, automation, analytics, content workflows, and maintainable project organization.</p>
              </article>
            </div>
          </div>
        </section>

                <section className="lk-about-team section_team">
          <div className="lk-about-container">
            <p className="lk-about-eyebrow" data-about-reveal data-reveal="text-left">
              Core team style
            </p>

            <h2 className="lk-about-section-title" data-about-reveal data-reveal="text-left">
              A focused software engineering profile built around real project delivery.
            </h2>

            <div className="lk-about-team-grid">
              {[
                {
                  image: "/profile.png",
                  name: "Leon Kountouras",
                  role: "Software Engineer / Full-Stack Developer",
                },
                {
                  image: "/about-placeholder-2.svg",
                  name: "Frontend Engineering",
                  role: "React · Next.js · TypeScript · TailwindCSS",
                },
                {
                  image: "/about-placeholder-3.svg",
                  name: "Backend & Data",
                  role: "Node.js · APIs · Supabase · MySQL · PostgreSQL",
                },
                {
                  image: "/about-placeholder-4.svg",
                  name: "SEO & Performance",
                  role: "PageSpeed · Accessibility · Structured content",
                },
                {
                  image: "/about-placeholder-5.svg",
                  name: "Automation",
                  role: "AI-assisted workflows · dashboards · integrations",
                },
                {
                  image: "/about-placeholder-6.svg",
                  name: "Deployment",
                  role: "Vercel · Netlify · Git · production fixes",
                },
              ].map((member, index) => (
                <article className="lk-about-team-card" key={member.name}>
                  <div className="lk-about-team-image" data-about-reveal data-reveal={index % 2 === 0 ? "image-down" : "image-up"}>
                    <img src={member.image} alt={member.name} />
                  </div>

                <div className="lk-about-team-info" data-about-reveal data-reveal="text-up">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>

                <span className="lk-about-team-arrow" data-about-reveal data-reveal="text-up">→</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lk-about-locations">
          <div className="lk-about-container">
            <div className="lk-about-location-heading">
              <p className="lk-about-eyebrow" data-about-reveal data-reveal="text-left">
                Work availability
              </p>

              <div>
                <h2 data-about-reveal data-reveal="text-right">
                  Available for remote collaboration and web development projects.
                </h2>

                <p className="lk-about-muted" data-about-reveal data-reveal="text-right">
                  Based in Greece, working with modern frontend, backend, deployment,
                  content, and SEO workflows.
                </p>

                <a href="mailto:koundouras@gmail.com" className="lk-about-button" data-about-reveal data-reveal="text-right">
                  Contact me
                </a>
              </div>
            </div>

            <div className="lk-about-location-cards">
              <article data-about-reveal data-reveal="text-up">
                <span>⌂</span>
                <h3>Thessaloniki</h3>
                <p>Greece · Local work and collaboration</p>
              </article>

              <article data-about-reveal data-reveal="text-up">
                <span>⌘</span>
                <h3>Remote</h3>
                <p>Frontend, backend, dashboards, websites</p>
              </article>

              <article data-about-reveal data-reveal="text-up">
                <span>↗</span>
                <h3>Project based</h3>
                <p>Landing pages, web apps, migrations, SEO</p>
              </article>
            </div>
          </div>
        </section>

        <section className="lk-about-contact">
          <div className="lk-about-container lk-about-contact-grid">
            <div className="lk-about-image-card" data-about-reveal data-reveal="image-down">
              <img src="/about-placeholder-6.svg" alt="Contact Leon Kountouras" />
            </div>

            <div className="lk-about-copy">
              <p className="lk-about-eyebrow" data-about-reveal data-reveal="text-right">
                Contact
              </p>

              <h2 data-about-reveal data-reveal="text-right">
                Connect with me
              </h2>

              <p className="lk-about-muted" data-about-reveal data-reveal="text-right">
                Share your project idea, website problem, migration need, or application
                concept and I will help you organize the next technical steps.
              </p>

              <div className="lk-about-contact-actions" data-about-reveal data-reveal="text-right">
                <a href="mailto:koundouras@gmail.com" className="lk-about-button">
                  Contact me
                </a>

                <a href="https://www.linkedin.com/in/leon-koundouras" target="_blank" rel="noopener noreferrer" className="lk-about-secondary-link">
                  LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
