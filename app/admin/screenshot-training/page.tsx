"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./screenshot-training.css";

type SourceUrl = { label: string; url: string };

type AuthSettings = {
  type?: string;
  loginUrl?: string;
  loginLinkSelector?: string;
  username?: string;
  password?: string;
  verificationCode?: string;
  usernameSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  expectedUrlIncludes?: string;
  expectedContentIncludes?: string;
};

type MlProject = {
  slug: string;
  title: string;
  url: string;
  prompt: string;
  personal?: boolean;
  ownership?: string;
  company?: string;
  companyUrl?: string;
  roleContext?: string;
  displayInTraining?: boolean;
  useForMl?: boolean;
  disabled?: boolean;
  sourceUrls?: SourceUrl[];
  screenshotMin?: number;
  screenshotMax?: number;
  auth?: AuthSettings;
};

type CandidateMeta = {
  publicPath: string;
  score: number;
  basicScore: number;
  cropScore: number;
  sourceType: "section" | "viewport";
  selector?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
};

type RankingItem = {
  slug: string;
  title: string;
  cover: string | null;
  slides: string[];
  candidates: string[];
  candidateMeta?: CandidateMeta[];
  status:
    | "idle"
    | "processing"
    | "ready"
    | "error"
    | "unavailable"
    | "login-required"
    | "auth-required"
    | "verification-required"
    | "skipped";
  message?: string;
  unavailableReason?: string;
  updatedAt?: string;
  authDetection?: {
    method?: string;
    loginUrl?: string;
    detectedSelector?: string;
  };
  authSession?: {
    loggedIn: boolean;
    userLabel?: string;
    reason?: string;
  };
};

type Preference = {
  projectSlug: string;
  image: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  rejected?: boolean;
  source?: "manual" | "auto";
  createdAt: string;
};

type JobConfig = {
  useGlobalScreenshotLimits?: boolean;
  globalMinScreenshots?: number;
  globalMaxScreenshots?: number;
  autoSmartSelections?: boolean;
  targetProjectSlug?: string;
  forceProject?: boolean;
};

type JobStatus = {
  status?: string;
  phase?: "next-phase-completed" | string;
  startedAt?: string | null;
  updatedAt?: string | null;
  message?: string;
  config?: JobConfig;
};

type ScreenshotStatusResponse = {
  rankings: Record<string, RankingItem>;
  job: JobStatus | null;
};

type FrontendImageItem = {
  cover: string | null;
  images: string[];
  updatedAt?: string;
};

type FrontendImagesResponse = {
  images: Record<string, FrontendImageItem>;
};

type ScreenshotPreviewItem = {
  projectSlug: string;
  projectTitle: string;
  image: string;
  meta?: CandidateMeta;
  rating?: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  rejected?: boolean;
  source?: "manual" | "auto";
};

type ScreenshotLightboxState = {
  projectSlug: string;
  projectTitle: string;
  items: ScreenshotPreviewItem[];
  index: number;
} | null;

const MIN_ACCEPTABLE_APPLY_SCORE = 2.8;
const MIN_ACCEPTED_FRONTEND_IMAGES = 3;

const ratingItems = [
  { value: 1, label: "1", text: "Bad", background: "#ef4444" },
  { value: 2, label: "2", text: "Weak", background: "#f97316" },
  { value: 3, label: "3", text: "Okay", background: "#facc15" },
  { value: 4, label: "4", text: "Good", background: "#84cc16" },
  { value: 5, label: "5", text: "Best", background: "#22c55e" },
] as const;

const trainingTags = [
  { id: "full-section-visible", label: "Full section visible", positive: true },
  { id: "elements-cut-off", label: "Elements cut off", positive: false },
  { id: "good-composition", label: "Good composition", positive: true },
  { id: "bad-crop", label: "Bad crop", positive: false },
  {
    id: "important-content-visible",
    label: "Important content visible",
    positive: true,
  },
  {
    id: "important-content-not-visible",
    label: "Important content not visible",
    positive: false,
  },
  {
    id: "not-relative-content",
    label: "Not relative content",
    positive: false,
  },
  { id: "not-desired-content", label: "Not desired content", positive: false },
  { id: "popup-overlay", label: "Popup / cookie banner", positive: false },
  { id: "too-empty", label: "Too empty", positive: false },
  { id: "too-zoomed", label: "Too zoomed", positive: false },
] as const;

function buildPreferenceKey(projectSlug: string, image: string) {
  return projectSlug + "__" + image;
}

function isTrainingDisabled(status: RankingItem["status"]) {
  return (
    status === "unavailable" ||
    status === "login-required" ||
    status === "auth-required" ||
    status === "verification-required" ||
    status === "skipped"
  );
}

function parseSourceUrlsText(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length >= 2) {
        return { label: parts[0] || "Page " + (index + 1), url: parts[1] };
      }
      return { label: "Page " + (index + 1), url: parts[0] };
    })
    .filter((item) => item.url);
}

function stringifySourceUrls(sourceUrls: SourceUrl[] = []) {
  return sourceUrls
    .map((item) => (item.label || "Page") + " | " + item.url)
    .join("\n");
}

async function safeJsonFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) return fallback;

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

function AuthToggle({ session }: { session?: RankingItem["authSession"] }) {
  const logged = Boolean(session?.loggedIn);

  return (
    <div
      className={"ml-login-switch " + (logged ? "is-logged" : "is-not-logged")}
    >
      <div className="ml-login-switch-track">
        <span className="ml-login-switch-knob">{logged ? "✓" : "×"}</span>
      </div>

      <div className="ml-login-switch-content">
        <strong>{logged ? "Logged" : "Not logged"}</strong>
        <small>
          {logged
            ? session?.userLabel || "Authenticated user"
            : session?.reason || "Login not detected"}
        </small>
      </div>
    </div>
  );
}

function AuthSettingsEditor({
  project,
  ranking,
  onSaved,
}: {
  project: MlProject;
  ranking?: RankingItem;
  onSaved: () => Promise<void>;
}) {
  const detectedLoginUrl = ranking?.authDetection?.loginUrl || "";
  const detectedSelector = ranking?.authDetection?.detectedSelector || "";

  const [authType, setAuthType] = useState(project.auth?.type || "none");
  const [loginUrl, setLoginUrl] = useState(
    project.auth?.loginUrl || detectedLoginUrl || "",
  );
  const [loginLinkSelector, setLoginLinkSelector] = useState(
    project.auth?.loginLinkSelector ||
      detectedSelector ||
      "a#Login, a[href*='login'], a:has-text('Login'), a:has-text('Σύνδεση')",
  );
  const [username, setUsername] = useState(project.auth?.username || "");
  const [password, setPassword] = useState(project.auth?.password || "");
  const [verificationCode, setVerificationCode] = useState(
    project.auth?.verificationCode || "",
  );
  const [usernameSelector, setUsernameSelector] = useState(
    project.auth?.usernameSelector ||
      "input[name='email'], input[type='email'], input[name='username'], input[type='text']",
  );
  const [passwordSelector, setPasswordSelector] = useState(
    project.auth?.passwordSelector ||
      "input[name='password'], input[type='password']",
  );
  const [submitSelector, setSubmitSelector] = useState(
    project.auth?.submitSelector ||
      "button[type='submit'], input[type='submit'], button:has-text('Login'), button:has-text('Sign in'), button:has-text('Σύνδεση')",
  );
  const [expectedUrlIncludes, setExpectedUrlIncludes] = useState(
    project.auth?.expectedUrlIncludes || "",
  );
  const [expectedContentIncludes, setExpectedContentIncludes] = useState(
    project.auth?.expectedContentIncludes || "",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!project.auth?.loginUrl && detectedLoginUrl)
      setLoginUrl(detectedLoginUrl);
    if (!project.auth?.loginLinkSelector && detectedSelector)
      setLoginLinkSelector(detectedSelector);
  }, [
    detectedLoginUrl,
    detectedSelector,
    project.auth?.loginUrl,
    project.auth?.loginLinkSelector,
  ]);

  async function saveAuthAndRun() {
    setSaving(true);

    const nextDisabled = Boolean(
      project.disabled || project.useForMl === false,
    );

    try {
      await fetch("/api/ml/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: project.slug,
          disabled: nextDisabled,
          useForMl: !nextDisabled,
          personal: Boolean(project.personal),
          ownership:
            project.ownership || (project.personal ? "personal" : "employer"),
          company: project.company || "",
          companyUrl: project.companyUrl || "",
          roleContext: project.roleContext || "",
          screenshotMin: Number(project.screenshotMin || 0),
          screenshotMax: Number(project.screenshotMax || 0),
          sourceUrls: project.sourceUrls || [
            { label: "Main page", url: project.url },
          ],
          auth: {
            type: authType,
            loginUrl,
            loginLinkSelector,
            username,
            password,
            verificationCode,
            usernameSelector,
            passwordSelector,
            submitSelector,
            expectedUrlIncludes,
            expectedContentIncludes,
          },
        }),
      });

      await fetch("/api/ml/run-screenshot-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: project.slug,
          forceProject: true,
        }),
      });
      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ml-auth-box">
      <h4>Auth / Login setup</h4>

      <AuthToggle session={ranking?.authSession} />

      {ranking?.authDetection?.loginUrl ? (
        <p className="ml-auth-detected">
          Detected login URL: {ranking.authDetection.loginUrl}
        </p>
      ) : null}

      <div className="ml-form-grid">
        <select
          value={authType}
          onChange={(event) => setAuthType(event.target.value)}
        >
          <option value="none">none</option>
          <option value="form">form</option>
          <option value="login-link-form">login-link-form</option>
          <option value="google">google</option>
          <option value="manual-session">manual-session</option>
        </select>

        <input
          value={loginUrl}
          onChange={(event) => setLoginUrl(event.target.value)}
          placeholder="Login URL"
        />
        <input
          value={loginLinkSelector}
          onChange={(event) => setLoginLinkSelector(event.target.value)}
          placeholder="Login link selector"
        />
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username / Email"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
        />

        {authType === "google" || authType === "manual-session" ? (
          <input
            value={verificationCode}
            onChange={(event) => setVerificationCode(event.target.value)}
            placeholder="Verification code, if needed"
          />
        ) : null}

        <details>
          <summary>Advanced selectors / verification</summary>
          <div className="ml-form-grid">
            <input
              value={usernameSelector}
              onChange={(event) => setUsernameSelector(event.target.value)}
              placeholder="Username selector"
            />
            <input
              value={passwordSelector}
              onChange={(event) => setPasswordSelector(event.target.value)}
              placeholder="Password selector"
            />
            <input
              value={submitSelector}
              onChange={(event) => setSubmitSelector(event.target.value)}
              placeholder="Submit selector"
            />
            <input
              value={expectedUrlIncludes}
              onChange={(event) => setExpectedUrlIncludes(event.target.value)}
              placeholder="Expected URL includes, e.g. room-page.php"
            />
            <input
              value={expectedContentIncludes}
              onChange={(event) =>
                setExpectedContentIncludes(event.target.value)
              }
              placeholder="Expected content includes, e.g. room"
            />
          </div>
        </details>

        <button
          onClick={saveAuthAndRun}
          disabled={saving}
          className="ml-dark-button"
        >
          {saving
            ? "Saving auth & running..."
            : "Save auth/settings & run screenshots"}
        </button>
      </div>
    </div>
  );
}

function ProjectEnableSwitch({
  id,
  label,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  disabled: boolean;
  onChange: (nextDisabled: boolean) => void | Promise<void>;
}) {
  const inputId = "project-enable-switch-" + id;

  return (
    <ol className="ml-switches">
      <li>
        <input
          type="checkbox"
          id={inputId}
          checked={!disabled}
          onChange={async (event) => {
            await onChange(!event.target.checked);
          }}
        />
        <label htmlFor={inputId}>
          <span>{label}</span>
          <span aria-hidden="true"></span>
        </label>
      </li>
    </ol>
  );
}

function ProjectSettingsEditor({
  project,
  ranking,
  job,
  globalLimitsEnabled,
  settingsDisabled,
  onSaved,
  onMessage,
}: {
  project: MlProject;
  ranking?: RankingItem;
  job?: JobStatus | null;
  globalLimitsEnabled: boolean;
  settingsDisabled: boolean;
  onSaved: () => Promise<void>;
  onMessage: (message: string) => void;
}) {
  const [disabled, setDisabled] = useState(
    Boolean(project.disabled || project.useForMl === false),
  );
  const [personal, setPersonal] = useState(Boolean(project.personal));
  const [company, setCompany] = useState(project.company || "");
  const [companyUrl, setCompanyUrl] = useState(project.companyUrl || "");
  const [roleContext, setRoleContext] = useState(project.roleContext || "");
  const [screenshotMin, setScreenshotMin] = useState(
    Number(project.screenshotMin || 0),
  );
  const [screenshotMax, setScreenshotMax] = useState(
    Number(project.screenshotMax || 0),
  );
  const [sourceUrlsText, setSourceUrlsText] = useState(
    stringifySourceUrls(
      project.sourceUrls || [{ label: "Main page", url: project.url }],
    ),
  );
  const [saving, setSaving] = useState(false);
  const [rerunRequestedAt, setRerunRequestedAt] = useState<number | null>(null);

  const isLoading = ranking?.status === "processing";
  const isReady = ranking?.status === "ready";

  const jobStartedAt = job?.startedAt ? new Date(job.startedAt).getTime() : 0;

  const jobUpdatedAt = job?.updatedAt ? new Date(job.updatedAt).getTime() : 0;

  const latestJobTime = Math.max(jobStartedAt, jobUpdatedAt);

  const jobTargetProjectSlug = job?.config?.targetProjectSlug || "";
  const isThisProjectJob =
    !jobTargetProjectSlug || jobTargetProjectSlug === project.slug;

  const jobHasRespondedAfterRequest =
    rerunRequestedAt !== null &&
    isThisProjectJob &&
    latestJobTime >= rerunRequestedAt - 1000;

  const isProjectJobProcessing =
    job?.status === "processing" &&
    isThisProjectJob &&
    jobHasRespondedAfterRequest;

  const isProjectJobFinished =
    (job?.status === "ready" || job?.status === "error") &&
    isThisProjectJob &&
    jobHasRespondedAfterRequest;

  const isWaitingForWorker =
    rerunRequestedAt !== null &&
    !isLoading &&
    !isProjectJobProcessing &&
    !isProjectJobFinished;

  const isStartingWorker =
    rerunRequestedAt !== null && isProjectJobProcessing && !isLoading;

  useEffect(() => {
    if (rerunRequestedAt === null) return;
    if (jobHasRespondedAfterRequest || isLoading) return;

    const timer = window.setTimeout(() => {
      setRerunRequestedAt(null);
      onMessage(
        "Screenshot worker did not respond in time. Check data/ml/worker.log.",
      );
    }, 90000);

    return () => window.clearTimeout(timer);
  }, [rerunRequestedAt, jobHasRespondedAfterRequest, isLoading, onMessage]);

  useEffect(() => {
    if (rerunRequestedAt === null) return;

    if (isLoading || isProjectJobFinished) {
      setRerunRequestedAt(null);
    }
  }, [isLoading, isProjectJobFinished, rerunRequestedAt]);

  useEffect(() => {
    if (!globalLimitsEnabled) return;

    setScreenshotMin(Number(project.screenshotMin || 0));
    setScreenshotMax(Number(project.screenshotMax || 0));
  }, [globalLimitsEnabled, project.screenshotMin, project.screenshotMax]);

  async function save() {
    const requestStartedAt = Date.now();

    setSaving(true);
    setRerunRequestedAt(requestStartedAt);

    try {
      await fetch("/api/ml/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: project.slug,
          disabled,
          useForMl: !disabled,
          personal,
          ownership: personal ? "personal" : "employer",
          company: personal ? "" : company,
          companyUrl: personal ? "" : companyUrl,
          roleContext: personal ? "" : roleContext,
          screenshotMin,
          screenshotMax,
          sourceUrls: parseSourceUrlsText(sourceUrlsText),
          auth: project.auth || { type: "none" },
        }),
      });

      const runResponse = await fetch("/api/ml/run-screenshot-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: project.slug,
          forceProject: true,
        }),
      });

      const runData = await runResponse.json().catch(() => null);

      if (!runResponse.ok || runData?.status === "already-running") {
        setRerunRequestedAt(null);

        onMessage(
          "Screenshot worker did not start because another job is still marked as running. Check data/ml/jobs.json and data/ml/worker.log.",
        );

        await onSaved();
        return;
      }

      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={
        settingsDisabled
          ? "ml-settings-card is-settings-disabled"
          : "ml-settings-card"
      }
    >
      <fieldset disabled={settingsDisabled} className="ml-settings-fieldset">
        <div className="ml-row">
          <button
            type="button"
            onClick={() => setPersonal(!personal)}
            className={personal ? "ml-personal-button" : "ml-employer-button"}
          >
            {personal ? "Personal project" : "Employer / client project"}
          </button>

          <span className="ml-small-muted">
            Auth type: {project.auth?.type || "none"}
          </span>

          <label className="ml-number-label">
            Min
            <input
              type="number"
              min={0}
              max={50}
              disabled={globalLimitsEnabled}
              value={screenshotMin}
              onChange={(event) => setScreenshotMin(Number(event.target.value))}
            />
          </label>

          <label className="ml-number-label">
            Max
            <input
              type="number"
              min={1}
              max={80}
              disabled={globalLimitsEnabled}
              value={screenshotMax}
              onChange={(event) => setScreenshotMax(Number(event.target.value))}
            />
          </label>
        </div>

        {!personal ? (
          <div className="ml-form-grid">
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company name"
            />
            <input
              value={companyUrl}
              onChange={(event) => setCompanyUrl(event.target.value)}
              placeholder="Company URL"
            />
            <textarea
              value={roleContext}
              onChange={(event) => setRoleContext(event.target.value)}
              placeholder="Role context"
              rows={2}
            />
          </div>
        ) : null}

        <label className="ml-field-label">Screenshot URLs</label>
        <textarea
          value={sourceUrlsText}
          onChange={(event) => setSourceUrlsText(event.target.value)}
          rows={4}
          placeholder={
            "Home | https://example.com/\nServices | https://example.com/services"
          }
          className="ml-mono-textarea"
        />

        <button
          type="button"
          onClick={save}
          disabled={
            isLoading || saving || isWaitingForWorker || isStartingWorker
          }
          className={
            isWaitingForWorker || isStartingWorker
              ? "ml-progress-button is-waiting-worker"
              : "ml-progress-button"
          }
        >
          <span
            aria-hidden="true"
            style={{
              width: isLoading
                ? "65%"
                : saving
                  ? "35%"
                  : isWaitingForWorker
                    ? "45%"
                    : isStartingWorker
                      ? "55%"
                      : isReady
                        ? "100%"
                        : "0%",
            }}
          />
          <b>
            {saving
              ? "Sending rerun request..."
              : isWaitingForWorker
                ? "Waiting for screenshot worker..."
                : isStartingWorker
                  ? "Screenshot worker started..."
                  : isLoading
                    ? "Capturing new screenshots..."
                    : isReady
                      ? "Rerun screenshots from scratch"
                      : "Save settings & run screenshots"}
          </b>
        </button>

        <AuthSettingsEditor
          project={project}
          ranking={ranking}
          onSaved={onSaved}
        />
      </fieldset>
    </div>
  );
}

function PowerRunSwitch({ checked }: { checked: boolean }) {
  return (
    <div className="ml-power-run-wrap">
      <div
        className="ml-power-run-visual"
        aria-label={checked ? "Power on" : "Power off"}
      >
        <span className="power-switch" aria-hidden="true">
          <input type="checkbox" checked={checked} readOnly />
          <span className="button">
            <svg className="power-off" viewBox="0 0 150 150">
              <line className="line" x1="75" y1="34" x2="75" y2="58" />
              <circle className="circle" cx="75" cy="80" r="35" />
            </svg>
            <svg className="power-on" viewBox="0 0 150 150">
              <line className="line" x1="75" y1="34" x2="75" y2="58" />
              <circle className="circle" cx="75" cy="80" r="35" />
            </svg>
          </span>
        </span>
      </div>

      <div className="ml-power-run-text">
        <strong>{checked ? "Power on" : "Power off"}</strong>
        <span>
          {checked
            ? "Screenshot worker active / ready"
            : "Press Run background screenshot ML job"}
        </span>
      </div>
    </div>
  );
}

function ScreenshotFrontendSelector({
  projectSlug,
  candidates,
  orderedImages,
  onSelectPosition,
  onDragMove,
  onApply,
}: {
  projectSlug: string;
  candidates: string[];
  orderedImages: string[];
  onSelectPosition: (image: string, nextPosition: number) => void;
  onDragMove: (fromImage: string, toImage: string) => void;
  onApply: () => void | Promise<void>;
}) {
  const [dragImage, setDragImage] = useState<string | null>(null);

  const candidateSet = new Set(candidates);

  const cleanOrderedImages = orderedImages.filter((image: string) => {
    return candidateSet.has(image);
  });

  const missingCandidates = candidates.filter((image: string) => {
    return !cleanOrderedImages.includes(image);
  });

  const orderedCandidates = [...cleanOrderedImages, ...missingCandidates];

  if (orderedCandidates.length === 0) {
    return null;
  }

  return (
    <div className="ml-frontend-selector">
      <div className="ml-frontend-selector-head">
        <div>
          <strong>Frontend screenshot order</strong>
          <p>
            #1 becomes the image for Take a look at my works, Project case
            studies, and the first image of the project page slider.
          </p>
        </div>

        <button type="button" className="ml-dark-button" onClick={onApply}>
          Apply selected order to frontend
        </button>
      </div>

      <div className="ml-selected-strip">
        {orderedCandidates.map((image, index) => {
          const currentPosition = index + 1;

          return (
            <article
              key={image}
              className="ml-order-card"
              draggable
              onDragStart={() => setDragImage(image)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (!dragImage) return;
                onDragMove(dragImage, image);
                setDragImage(null);
              }}
            >
              <div className="ml-order-number">{index + 1}</div>

              <img
                src={image}
                alt={projectSlug + " selected screenshot " + (index + 1)}
              />

              <label>
                Order
                <select
                  value={currentPosition}
                  onChange={(event) => {
                    onSelectPosition(image, Number(event.target.value));
                  }}
                >
                  {orderedCandidates.map((_, optionIndex) => {
                    const position = optionIndex + 1;

                    return (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    );
                  })}
                </select>
              </label>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ScreenshotLightbox({
  state,
  onClose,
  onMove,
}: {
  state: ScreenshotLightboxState;
  onClose: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const [closing, setClosing] = useState(false);
  const current = state?.items[state.index] || null;

  useEffect(() => {
    setClosing(false);
  }, [state?.projectSlug, state?.index]);

  useEffect(() => {
    if (!state) return;

    const previousOverflow = document.body.style.overflow;

    function requestClose() {
      setClosing(true);
      window.setTimeout(() => {
        onClose();
      }, 180);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestClose();
      }

      if (event.key === "ArrowLeft") {
        onMove(-1);
      }

      if (event.key === "ArrowRight") {
        onMove(1);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state, onClose, onMove]);

  if (!state || !current) return null;
  if (typeof document === "undefined") return null;

  const total = state.items.length;

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 180);
  }

  return createPortal(
    <div
      className={
        closing
          ? "ml-screenshot-lightbox is-closing"
          : "ml-screenshot-lightbox is-open"
      }
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot preview"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div className="ml-screenshot-lightbox-shell">
        <button
          type="button"
          className="ml-lightbox-close"
          onClick={requestClose}
          aria-label="Close preview"
        >
          ×
        </button>

        <div className="ml-screenshot-lightbox-header">
          <div>
            <strong>{state.projectTitle}</strong>
            <span>
              Screenshot {state.index + 1} / {total}
            </span>
          </div>
        </div>

        <div className="ml-screenshot-lightbox-body">
          <button
            type="button"
            className="ml-lightbox-arrow ml-lightbox-arrow-left"
            onClick={() => onMove(-1)}
            aria-label="Previous screenshot"
            disabled={total <= 1}
          >
            ‹
          </button>

          <div className="ml-lightbox-image-wrap">
            <img src={current.image} alt={state.projectTitle + " screenshot"} />
          </div>

          <button
            type="button"
            className="ml-lightbox-arrow ml-lightbox-arrow-right"
            onClick={() => onMove(1)}
            aria-label="Next screenshot"
            disabled={total <= 1}
          >
            ›
          </button>
        </div>

        <div className="ml-screenshot-lightbox-footer">
          <div>
            <strong>Image</strong>
            <code>{current.image}</code>
          </div>

          <div className="ml-lightbox-info-grid">
            {current.meta?.sourceLabel ? (
              <span>Source: {current.meta.sourceLabel}</span>
            ) : null}

            {current.meta?.sourceType ? (
              <span>
                Type:{" "}
                {current.meta.sourceType === "section"
                  ? "Section crop"
                  : "Viewport crop"}
              </span>
            ) : null}

            {typeof current.meta?.score === "number" ? (
              <span>Score: {current.meta.score.toFixed(2)}</span>
            ) : null}

            {current.rating ? <span>Rating: {current.rating}/5</span> : null}

            {current.rejected ? <span>Rejected</span> : null}

            {current.source ? <span>Saved by: {current.source}</span> : null}
          </div>

          {current.tags.length > 0 ? (
            <div className="ml-lightbox-tags">
              {current.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : (
            <small>No training tags yet.</small>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ScreenshotTrainingPage() {
  const [rankings, setRankings] = useState<Record<string, RankingItem>>({});
  const [projects, setProjects] = useState<MlProject[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState("");
  const [job, setJob] = useState<JobStatus | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [nextPhaseMessage, setNextPhaseMessage] = useState("");
  const [nextPhaseLoading, setNextPhaseLoading] = useState(false);
  const [useGlobalScreenshotLimits, setUseGlobalScreenshotLimits] =
    useState(false);
  const [globalMinScreenshots, setGlobalMinScreenshots] = useState(2);
  const [globalMaxScreenshots, setGlobalMaxScreenshots] = useState(6);
  const [autoSmartSelections, setAutoSmartSelections] = useState(true);
  const globalSettingsTouchedRef = useRef(false);
  const [powerEffectOn, setPowerEffectOn] = useState(false);
  const nextPhaseRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const wasPhaseOneCompleteRef = useRef(false);
  const [frontendImageMap, setFrontendImageMap] = useState<
    Record<string, FrontendImageItem>
  >({});
  const [screenshotLightbox, setScreenshotLightbox] =
    useState<ScreenshotLightboxState>(null);

  const [orderedSelections, setOrderedSelections] = useState<
    Record<string, string[]>
  >({});

  const visibleProjects = projects.filter(
    (project) => project.displayInTraining !== false,
  );

  const preferenceMap = useMemo(() => {
    const map = new Map<string, Preference>();
    for (const preference of preferences) {
      map.set(
        buildPreferenceKey(preference.projectSlug, preference.image),
        preference,
      );
    }
    return map;
  }, [preferences]);

  function openScreenshotLightbox(
    project: MlProject,
    ranking: RankingItem | undefined,
    startIndex: number,
  ) {
    const candidates = ranking?.candidates || [];

    const items = candidates.map((candidateImage) => {
      const key = buildPreferenceKey(project.slug, candidateImage);
      const savedPreference = preferenceMap.get(key);
      const meta = ranking?.candidateMeta?.find(
        (item) => item.publicPath === candidateImage,
      );

      return {
        projectSlug: project.slug,
        projectTitle: project.title,
        image: candidateImage,
        meta,
        rating: savedPreference?.rating,
        tags: savedPreference?.tags || [],
        rejected: Boolean(savedPreference?.rejected),
        source: savedPreference?.source,
      };
    });

    if (items.length === 0) return;

    const safeIndex = Math.max(0, Math.min(startIndex, items.length - 1));

    setScreenshotLightbox({
      projectSlug: project.slug,
      projectTitle: project.title,
      items,
      index: safeIndex,
    });
  }

  function moveScreenshotLightbox(direction: -1 | 1) {
    setScreenshotLightbox((current) => {
      if (!current || current.items.length === 0) return current;

      const nextIndex =
        (current.index + direction + current.items.length) %
        current.items.length;

      return {
        ...current,
        index: nextIndex,
      };
    });
  }

  function isImageRejected(projectSlug: string, image: string) {
    return Boolean(
      preferenceMap.get(buildPreferenceKey(projectSlug, image))?.rejected,
    );
  }

  function getUsableCandidates(projectSlug: string, candidates: string[]) {
    return candidates.filter((image) => !isImageRejected(projectSlug, image));
  }

  function getApplyTagScore(tags: string[] = []) {
    let score = 0;

    if (tags.includes("good-composition")) score += 0.65;
    if (tags.includes("full-section-visible")) score += 0.45;
    if (tags.includes("important-content-visible")) score += 0.65;

    if (tags.includes("bad-crop")) score -= 0.75;
    if (tags.includes("elements-cut-off")) score -= 0.65;
    if (tags.includes("popup-overlay")) score -= 1.2;
    if (tags.includes("important-content-not-visible")) score -= 0.85;
    if (tags.includes("not-relative-content")) score -= 0.9;
    if (tags.includes("not-desired-content")) score -= 0.9;
    if (tags.includes("too-empty")) score -= 0.45;
    if (tags.includes("too-zoomed")) score -= 0.45;

    return score;
  }

  function getApplyCandidateScore(projectSlug: string, image: string) {
    const ranking = rankings[projectSlug];
    const meta = ranking?.candidateMeta?.find(
      (item) => item.publicPath === image,
    );
    const preference = preferenceMap.get(
      buildPreferenceKey(projectSlug, image),
    );

    const storedScore = typeof meta?.score === "number" ? meta.score : 0;
    const basicScore =
      typeof meta?.basicScore === "number" ? meta.basicScore : 0;
    const cropScore = typeof meta?.cropScore === "number" ? meta.cropScore : 0;
    const sourceBonus = meta?.sourceType === "section" ? 0.2 : 0;
    const ratingScore =
      typeof preference?.rating === "number" ? preference.rating * 0.35 : 0;
    const tagScore = getApplyTagScore(preference?.tags || []);

    return (
      storedScore +
      basicScore +
      cropScore * 0.35 +
      sourceBonus +
      ratingScore +
      tagScore
    );
  }

  function getBestApplyScore(projectSlug: string, images: string[]) {
    if (images.length === 0) return null;

    return images.reduce<number | null>((bestScore, image) => {
      const score = getApplyCandidateScore(projectSlug, image);

      if (bestScore === null) return score;

      return Math.max(bestScore, score);
    }, null);
  }

  async function setImageRejected(
    projectSlug: string,
    image: string,
    nextRejected: boolean,
  ) {
    const key = buildPreferenceKey(projectSlug, image);
    const current = preferenceMap.get(key);
    const currentTags = current?.tags || [];

    const negativeTags = ["not-desired-content"];

    const nextTags = nextRejected
      ? Array.from(new Set([...currentTags, ...negativeTags]))
      : currentTags;

    await savePreference(
      projectSlug,
      image,
      nextRejected ? 1 : current?.rating || 3,
      nextTags,
      nextRejected,
    );

    setOrderedSelections((previous) => {
      const currentOrder = previous[projectSlug] || [];

      return {
        ...previous,
        [projectSlug]: nextRejected
          ? currentOrder.filter((item: string) => item !== image)
          : currentOrder,
      };
    });

    await load();
  }

  async function markProjectNoSuitable(
    projectSlug: string,
    candidates: string[],
  ) {
    if (candidates.length === 0) {
      setNextPhaseMessage("No screenshots found for " + projectSlug + ".");
      return;
    }

    setSavingKey(projectSlug + "__no-suitable");

    try {
      for (const image of candidates) {
        const key = buildPreferenceKey(projectSlug, image);
        const current = preferenceMap.get(key);
        const currentTags = current?.tags || [];

        const nextTags = Array.from(
          new Set([
            ...currentTags,
            "not-desired-content",
            "important-content-not-visible",
          ]),
        );

        await fetch("/api/ml/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectSlug,
            image,
            rating: 1,
            tags: nextTags,
            rejected: true,
            source: "manual",
            notes: "Marked as no suitable screenshot for this project.",
          }),
        });
      }

      setOrderedSelections((previous) => ({
        ...previous,
        [projectSlug]: [],
      }));

      setNextPhaseMessage(
        "Marked all screenshots as not suitable for " + projectSlug + ".",
      );

      await load();
    } finally {
      setSavingKey(null);
    }
  }

  async function load() {
    const [
      statusData,
      preferencesData,
      projectsData,
      snapshotsData,
      frontendImagesData,
    ] = await Promise.all([
      safeJsonFetch<ScreenshotStatusResponse>("/api/ml/screenshots-status", {
        rankings: {},
        job: null,
      }),
      safeJsonFetch<{ preferences: Preference[] }>("/api/ml/preferences", {
        preferences: [],
      }),
      safeJsonFetch<{ projects: MlProject[] }>("/api/ml/projects", {
        projects: [],
      }),
      safeJsonFetch<{ files: string[] }>("/api/ml/preferences-files", {
        files: [],
      }),
      safeJsonFetch<FrontendImagesResponse>("/api/ml/frontend-images", {
        images: {},
      }),
    ]);

    setRankings(statusData.rankings || {});
    setJob(statusData.job || null);
    setPreferences(preferencesData.preferences || []);
    setProjects(projectsData.projects || []);
    setSnapshots(snapshotsData.files || []);
    setFrontendImageMap(frontendImagesData.images || {});

    if (statusData.job?.config && !globalSettingsTouchedRef.current) {
      setUseGlobalScreenshotLimits(
        Boolean(statusData.job.config.useGlobalScreenshotLimits),
      );
      setGlobalMinScreenshots(
        Number(statusData.job.config.globalMinScreenshots || 2),
      );
      setGlobalMaxScreenshots(
        Number(statusData.job.config.globalMaxScreenshots || 6),
      );
      setAutoSmartSelections(
        statusData.job.config.autoSmartSelections !== false,
      );
    }

    const freshPreferences = preferencesData.preferences || [];

    function isRejectedFromFreshPreferences(
      projectSlug: string,
      image: string,
    ) {
      return Boolean(
        freshPreferences.find((preference) => {
          return (
            preference.projectSlug === projectSlug &&
            preference.image === image &&
            preference.rejected
          );
        }),
      );
    }

    setOrderedSelections((current) => {
      const next = { ...current };

      for (const [slug, rankingValue] of Object.entries(
        statusData.rankings || {},
      )) {
        const ranking = rankingValue as RankingItem;
        const candidates = ranking.candidates || [];

        const usableCandidatesForOrder = candidates.filter((image: string) => {
          return !isRejectedFromFreshPreferences(slug, image);
        });

        if (candidates.length === 0) continue;

        const existing = frontendImagesData.images?.[slug]?.images;

        if (Array.isArray(existing) && existing.length > 0) {
          const cleanExisting = existing.filter((image: string) => {
            return usableCandidatesForOrder.includes(image);
          });

          const missing = usableCandidatesForOrder.filter((image: string) => {
            return !cleanExisting.includes(image);
          });

          next[slug] = [...cleanExisting, ...missing];
          continue;
        }

        if (next[slug]) {
          const cleanCurrent = next[slug].filter((image: string) => {
            return usableCandidatesForOrder.includes(image);
          });

          const missing = usableCandidatesForOrder.filter((image: string) => {
            return !cleanCurrent.includes(image);
          });

          next[slug] = [...cleanCurrent, ...missing];
          continue;
        }

        const cover = ranking.cover;
        const slides = ranking.slides || [];

        const autoOrder = Array.from(
          new Set(
            [cover, ...slides, ...usableCandidatesForOrder].filter(
              (image): image is string => {
                return (
                  Boolean(image) &&
                  usableCandidatesForOrder.includes(String(image))
                );
              },
            ),
          ),
        );

        next[slug] = autoOrder;
      }

      return next;
    });
  }

  async function updateProjectDisabled(
    project: MlProject,
    nextDisabled: boolean,
  ) {
    await fetch("/api/ml/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: project.slug,
        disabled: nextDisabled,
        useForMl: !nextDisabled,
        personal: Boolean(project.personal),
        ownership:
          project.ownership || (project.personal ? "personal" : "employer"),
        company: project.company || "",
        companyUrl: project.companyUrl || "",
        roleContext: project.roleContext || "",
        screenshotMin: Number(project.screenshotMin || 0),
        screenshotMax: Number(project.screenshotMax || 0),
        sourceUrls: project.sourceUrls || [
          { label: "Main page", url: project.url },
        ],
        auth: project.auth || { type: "none" },
      }),
    });

    await load();
  }

  async function setAllProjectsDisabled(nextDisabled: boolean) {
    await Promise.all(
      visibleProjects.map((project) =>
        fetch("/api/ml/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: project.slug,
            disabled: nextDisabled,
            useForMl: !nextDisabled,
            personal: Boolean(project.personal),
            ownership:
              project.ownership || (project.personal ? "personal" : "employer"),
            company: project.company || "",
            companyUrl: project.companyUrl || "",
            roleContext: project.roleContext || "",
            screenshotMin: Number(project.screenshotMin || 0),
            screenshotMax: Number(project.screenshotMax || 0),
            sourceUrls: project.sourceUrls || [
              { label: "Main page", url: project.url },
            ],
            auth: project.auth || { type: "none" },
          }),
        }),
      ),
    );

    await load();
  }

  async function applyGlobalScreenshotLimitsToProjects(
    nextMin: number,
    nextMax: number,
  ) {
    const normalizedMin = Math.max(0, Math.min(50, Number(nextMin) || 0));
    const normalizedMax = Math.max(1, Math.min(80, Number(nextMax) || 1));

    const finalMin = Math.min(normalizedMin, normalizedMax);
    const finalMax = Math.max(normalizedMax, finalMin || 1);

    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.displayInTraining === false) return project;

        return {
          ...project,
          screenshotMin: finalMin,
          screenshotMax: finalMax,
        };
      }),
    );

    const currentProjects = projects.filter(
      (project) => project.displayInTraining !== false,
    );

    await Promise.all(
      currentProjects.map((project) =>
        fetch("/api/ml/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: project.slug,
            disabled: Boolean(project.disabled || project.useForMl === false),
            useForMl: !Boolean(project.disabled || project.useForMl === false),
            personal: Boolean(project.personal),
            ownership:
              project.ownership || (project.personal ? "personal" : "employer"),
            company: project.company || "",
            companyUrl: project.companyUrl || "",
            roleContext: project.roleContext || "",
            screenshotMin: finalMin,
            screenshotMax: finalMax,
            sourceUrls: project.sourceUrls || [
              { label: "Main page", url: project.url },
            ],
            auth: project.auth || { type: "none" },
          }),
        }),
      ),
    );

    await load();
  }

  async function startJob() {
    setPowerEffectOn(true);

    if (useGlobalScreenshotLimits) {
      await applyGlobalScreenshotLimitsToProjects(
        globalMinScreenshots,
        globalMaxScreenshots,
      );
    }

    await fetch("/api/ml/run-screenshot-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        useGlobalScreenshotLimits,
        globalMinScreenshots,
        globalMaxScreenshots,
        autoSmartSelections,
      }),
    });

    await load();
    globalSettingsTouchedRef.current = false;
  }

  async function savePreference(
    projectSlug: string,
    image: string,
    rating: 1 | 2 | 3 | 4 | 5,
    tags: string[],
    rejected = false,
  ) {
    const key = buildPreferenceKey(projectSlug, image);
    setSavingKey(key);

    await fetch("/api/ml/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectSlug,
        image,
        rating,
        tags,
        rejected,
        source: "manual",
      }),
    });

    await load();
    setSavingKey(null);
  }

  async function rate(
    projectSlug: string,
    image: string,
    rating: 1 | 2 | 3 | 4 | 5,
  ) {
    const key = buildPreferenceKey(projectSlug, image);
    const current = preferenceMap.get(key);
    await savePreference(
      projectSlug,
      image,
      rating,
      current?.tags || [],
      Boolean(current?.rejected),
    );
  }

  function getExclusiveTags(tag: string) {
    const groups = [
      ["important-content-visible", "important-content-not-visible"],
      ["full-section-visible", "elements-cut-off"],
      ["good-composition", "bad-crop"],
    ];

    return groups.find((group) => group.includes(tag)) || [];
  }

  async function toggleTag(projectSlug: string, image: string, tag: string) {
    const key = buildPreferenceKey(projectSlug, image);
    const current = preferenceMap.get(key);
    const currentTags = current?.tags || [];

    const exclusiveTags = getExclusiveTags(tag);

    let nextTags = currentTags.filter((item) => {
      if (item === tag) return false;
      if (exclusiveTags.includes(item)) return false;
      return true;
    });

    if (!currentTags.includes(tag)) {
      nextTags = [...nextTags, tag];
    }

    await savePreference(
      projectSlug,
      image,
      current?.rating || 3,
      nextTags,
      Boolean(current?.rejected),
    );
  }

  async function resetProjectSelections(projectSlug: string) {
    await fetch("/api/ml/preferences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectSlug }),
    });
    await load();
  }

  async function resetAllSelections() {
    await fetch("/api/ml/preferences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    await load();
  }

  async function saveSnapshot() {
    await fetch("/api/ml/preferences-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save" }),
    });
    await load();
  }

  async function loadSnapshot(fileName: string) {
    if (!fileName) return;

    await fetch("/api/ml/preferences-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "load", fileName }),
    });

    await load();
  }

  async function clearSnapshotsFolder() {
    await fetch("/api/ml/preferences-files", { method: "DELETE" });
    await load();
  }

  async function importSelectionsFromLocalFile(file: File) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const preferences = Array.isArray(parsed.preferences)
      ? parsed.preferences
      : Array.isArray(parsed)
        ? parsed
        : [];

    await fetch("/api/ml/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences }),
    });

    await load();
  }

  function getMissingRatingsCount() {
    let missing = 0;
    for (const ranking of Object.values(rankings)) {
      if (ranking.status !== "ready") continue;
      for (const image of ranking.candidates || []) {
        if (!preferenceMap.has(buildPreferenceKey(ranking.slug, image)))
          missing += 1;
      }
    }
    return missing;
  }

  function getReadyScreenshotsCount() {
    let count = 0;
    for (const ranking of Object.values(rankings)) {
      if (ranking.status !== "ready") continue;
      count += (ranking.candidates || []).length;
    }
    return count;
  }

  function isAnyProjectProcessing() {
    return Object.values(rankings).some(
      (ranking) => ranking.status === "processing",
    );
  }

  const missingRatingsCount = getMissingRatingsCount();
  const readyScreenshotsCount = getReadyScreenshotsCount();
  const phaseOneComplete =
    readyScreenshotsCount > 0 &&
    missingRatingsCount === 0 &&
    !isAnyProjectProcessing();

  const phaseTwoPrepared = job?.phase === "next-phase-completed";

  function getProjectOrderedImages(projectSlug: string, candidates: string[]) {
    const candidateSet = new Set(candidates);
    const current = orderedSelections[projectSlug] || [];

    const cleanCurrent = current.filter((image: string) => {
      return candidateSet.has(image) && !isImageRejected(projectSlug, image);
    });

    const missing = candidates.filter((image: string) => {
      return (
        !cleanCurrent.includes(image) && !isImageRejected(projectSlug, image)
      );
    });

    return [...cleanCurrent, ...missing];
  }

  function reorderProjectImage(
    projectSlug: string,
    image: string,
    nextPosition: number,
    candidates: string[],
  ) {
    const current = getProjectOrderedImages(projectSlug, candidates);
    const withoutImage = current.filter((item) => item !== image);
    const safeIndex = Math.max(
      0,
      Math.min(nextPosition - 1, withoutImage.length),
    );

    withoutImage.splice(safeIndex, 0, image);

    setOrderedSelections((previous) => ({
      ...previous,
      [projectSlug]: withoutImage,
    }));
  }

  function moveProjectImageByDrag(
    projectSlug: string,
    fromImage: string,
    toImage: string,
    candidates: string[],
  ) {
    if (fromImage === toImage) return;

    const current = getProjectOrderedImages(projectSlug, candidates);
    const fromIndex = current.indexOf(fromImage);
    const toIndex = current.indexOf(toImage);

    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...current];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    setOrderedSelections((previous) => ({
      ...previous,
      [projectSlug]: next,
    }));
  }

  async function applyProjectImagesToFrontend(
    projectSlug: string,
    candidates: string[],
  ) {
    const images = getProjectOrderedImages(projectSlug, candidates).filter(
      (image) => !isImageRejected(projectSlug, image),
    );

    if (images.length < MIN_ACCEPTED_FRONTEND_IMAGES) {
      setNextPhaseMessage(
        "Cannot apply frontend screenshots for " +
          projectSlug +
          ": accepted screenshots are " +
          images.length +
          "/" +
          MIN_ACCEPTED_FRONTEND_IMAGES +
          ". Rerun this project to generate more acceptable screenshots.",
      );
      return;
    }

    if (images.length === 0) {
      setNextPhaseMessage(
        "Cannot apply frontend screenshots for " +
          projectSlug +
          ": all screenshots are rejected or no screenshots are selected.",
      );
      return;
    }

    const bestScore = getBestApplyScore(projectSlug, images);

    if (bestScore === null || bestScore < MIN_ACCEPTABLE_APPLY_SCORE) {
      setNextPhaseMessage(
        "Cannot apply frontend screenshots for " +
          projectSlug +
          ": best score is " +
          (bestScore === null ? "none" : bestScore.toFixed(2)) +
          ", minimum required is " +
          MIN_ACCEPTABLE_APPLY_SCORE +
          ".",
      );
      return;
    }

    const response = await fetch("/api/ml/frontend-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectSlug,
        images,
        minimumScore: MIN_ACCEPTABLE_APPLY_SCORE,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setNextPhaseMessage(
        data?.message ||
          "Could not apply screenshots to frontend for " + projectSlug + ".",
      );
      return;
    }

    localStorage.setItem("ml-frontend-images-updated", String(Date.now()));
    window.dispatchEvent(new Event("ml-frontend-images-updated"));

    setNextPhaseMessage(
      "Applied selected screenshots to frontend for " +
        projectSlug +
        ". Best score: " +
        Number(data?.bestScore || bestScore).toFixed(2) +
        ".",
    );

    await load();
  }

  async function applyAllSelectedImagesToFrontend() {
    const readyRankings = Object.values(rankings).filter(
      (ranking) => ranking.status === "ready",
    );

    let appliedCount = 0;
    let skippedCount = 0;

    for (const ranking of readyRankings) {
      const candidates = getUsableCandidates(
        ranking.slug,
        ranking.candidates || [],
      );

      if (candidates.length === 0) {
        skippedCount += 1;
        continue;
      }

      const images = getProjectOrderedImages(ranking.slug, candidates).filter(
        (image) => !isImageRejected(ranking.slug, image),
      );

      if (images.length === 0) {
        skippedCount += 1;
        continue;
      }

      const bestScore = getBestApplyScore(ranking.slug, images);

      if (bestScore === null || bestScore < MIN_ACCEPTABLE_APPLY_SCORE) {
        skippedCount += 1;
        continue;
      }

      const response = await fetch("/api/ml/frontend-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: ranking.slug,
          images,
          minimumScore: MIN_ACCEPTABLE_APPLY_SCORE,
        }),
      });

      if (response.ok) {
        appliedCount += 1;
      } else {
        skippedCount += 1;
      }
    }

    if (appliedCount > 0) {
      localStorage.setItem("ml-frontend-images-updated", String(Date.now()));
      window.dispatchEvent(new Event("ml-frontend-images-updated"));
    }

    setNextPhaseMessage(
      "Applied selected screenshots to frontend for " +
        appliedCount +
        " ready project(s). Skipped " +
        skippedCount +
        " project(s) because all screenshots were rejected or below threshold.",
    );

    await load();
  }

  async function runNextPhase() {
    if (missingRatingsCount > 0) {
      setNextPhaseMessage(
        "You must rate all screenshots first. Missing ratings: " +
          missingRatingsCount,
      );
      return;
    }

    if (readyScreenshotsCount === 0) {
      setNextPhaseMessage(
        "Phase 1 is not ready yet. Generate screenshots first.",
      );
      return;
    }

    setNextPhaseLoading(true);
    setNextPhaseMessage("");

    try {
      const response = await fetch("/api/ml/next-phase", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        setNextPhaseMessage(data.message || "Next phase failed.");
        return;
      }

      setNextPhaseMessage(
        "Phase 2 prepared. Choose screenshot order below, then press Apply selected order to frontend.",
      );
      await load();
    } finally {
      setNextPhaseLoading(false);
    }
  }

  useEffect(() => {
    if (job?.status !== "ready") return;

    setNextPhaseMessage((current) => {
      if (
        current.includes("Screenshot worker did not switch") ||
        current.includes("Screenshot worker did not respond")
      ) {
        return "";
      }

      return current;
    });
  }, [job?.status]);

  useEffect(() => {
    let mounted = true;
    let timer: number | null = null;

    async function loadSafely() {
      if (!mounted) return;

      if (
        typeof document !== "undefined" &&
        document.visibilityState === "hidden"
      ) {
        return;
      }

      await load();
    }

    loadSafely();

    const intervalMs = job?.status === "processing" ? 2500 : 12000;

    timer = window.setInterval(loadSafely, intervalMs);

    return () => {
      mounted = false;

      if (timer !== null) {
        window.clearInterval(timer);
      }
    };
  }, [job?.status]);

  useEffect(() => {
    if (phaseOneComplete && !wasPhaseOneCompleteRef.current) {
      wasPhaseOneCompleteRef.current = true;
      setTimeout(
        () =>
          nextPhaseRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        350,
      );
    }
    if (!phaseOneComplete) wasPhaseOneCompleteRef.current = false;
  }, [phaseOneComplete]);

  return (
    <main className="ml-page">
      <ScreenshotLightbox
        state={screenshotLightbox}
        onClose={() => setScreenshotLightbox(null)}
        onMove={moveScreenshotLightbox}
      />
      <div className="background-circuit" aria-hidden="true" />

      <section className="ml-panel">
        <h1>ML Screenshot Training</h1>

        <div className="ml-intro-power-panel">
          <div className="ml-intro-text">
            <h2>What to do</h2>
            <ol>
              <li>
                Press <strong>Run background screenshot ML job</strong> once.
              </li>
              <li>
                When a project needs login, fill the Auth / Login setup fields.
              </li>
              <li>
                Use login-link-form when the page has a Login link, such as
                a#Login.
              </li>
              <li>
                Auto smart selections run automatically when screenshots are
                produced.
              </li>
              <li>
                Manual selections override auto selections and stay saved.
              </li>
              <li>
                Use reset/save/load controls to manage training selections.
              </li>
              <li>When Phase 2 turns green, press Next phase.</li>
            </ol>
          </div>

          <PowerRunSwitch
            checked={
              powerEffectOn ||
              job?.status === "processing" ||
              job?.status === "ready"
            }
          />
        </div>

        <div className="ml-toolbar">
          <button onClick={startJob} className="ml-dark-button">
            Run background screenshot ML job
          </button>

          <label className="ml-global-limit-enable">
            <input
              type="checkbox"
              checked={useGlobalScreenshotLimits}
              onChange={async (event) => {
                const checked = event.target.checked;

                globalSettingsTouchedRef.current = true;
                setUseGlobalScreenshotLimits(checked);

                if (checked) {
                  await applyGlobalScreenshotLimitsToProjects(
                    globalMinScreenshots,
                    globalMaxScreenshots,
                  );
                }
              }}
            />
            Use Global Min / Max
          </label>

          <label
            className={
              !useGlobalScreenshotLimits ? "ml-disabled-global-field" : ""
            }
          >
            Global Min
            <input
              type="number"
              min={0}
              max={50}
              disabled={!useGlobalScreenshotLimits}
              value={globalMinScreenshots}
              onChange={async (event) => {
                const nextValue = Number(event.target.value);

                globalSettingsTouchedRef.current = true;
                setGlobalMinScreenshots(nextValue);

                if (useGlobalScreenshotLimits) {
                  await applyGlobalScreenshotLimitsToProjects(
                    nextValue,
                    globalMaxScreenshots,
                  );
                }
              }}
            />
          </label>

          <label
            className={
              !useGlobalScreenshotLimits ? "ml-disabled-global-field" : ""
            }
          >
            Global Max
            <input
              type="number"
              min={1}
              max={80}
              disabled={!useGlobalScreenshotLimits}
              value={globalMaxScreenshots}
              onChange={async (event) => {
                const nextValue = Number(event.target.value);

                globalSettingsTouchedRef.current = true;
                setGlobalMaxScreenshots(nextValue);

                if (useGlobalScreenshotLimits) {
                  await applyGlobalScreenshotLimitsToProjects(
                    globalMinScreenshots,
                    nextValue,
                  );
                }
              }}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={autoSmartSelections}
              onChange={(event) => {
                globalSettingsTouchedRef.current = true;
                setAutoSmartSelections(event.target.checked);
              }}
            />
            Auto smart selections
          </label>

          <div className="ml-project-switch-panel">
            <div className="ml-project-switch-panel-head">
              <ProjectEnableSwitch
                id="all-projects"
                label={
                  visibleProjects.every((project) =>
                    Boolean(project.disabled || project.useForMl === false),
                  )
                    ? "All Projects Disabled"
                    : "All Projects Enabled"
                }
                disabled={visibleProjects.every((project) =>
                  Boolean(project.disabled || project.useForMl === false),
                )}
                onChange={async (nextDisabled) => {
                  await setAllProjectsDisabled(nextDisabled);
                }}
              />
            </div>

            <div className="ml-project-switch-list">
              {visibleProjects.map((project) => {
                const itemDisabled = Boolean(
                  project.disabled || project.useForMl === false,
                );

                return (
                  <ProjectEnableSwitch
                    key={project.slug}
                    id={"quick-" + project.slug}
                    label={project.title}
                    disabled={itemDisabled}
                    onChange={async (nextDisabled) => {
                      await updateProjectDisabled(project, nextDisabled);
                    }}
                  />
                );
              })}
            </div>
          </div>

          <button onClick={resetAllSelections} className="ml-danger-button">
            Reset all training selections
          </button>

          <button onClick={saveSnapshot} className="ml-soft-button">
            Save selections snapshot
          </button>

          <select
            value={selectedSnapshot}
            onChange={(event) => setSelectedSnapshot(event.target.value)}
          >
            <option value="">Select saved selections</option>
            {snapshots.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>

          <button
            onClick={() => loadSnapshot(selectedSnapshot)}
            className="ml-soft-button"
          >
            Load selected
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              await importSelectionsFromLocalFile(file);
              event.target.value = "";
            }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="ml-soft-button"
          >
            Load local file
          </button>

          <button onClick={clearSnapshotsFolder} className="ml-danger-button">
            Clear snapshots folder
          </button>

          <button
            ref={nextPhaseRef}
            onClick={runNextPhase}
            disabled={!phaseOneComplete || nextPhaseLoading || phaseTwoPrepared}
            className={phaseOneComplete ? "ml-dark-button" : "ml-soft-button"}
            style={{
              opacity: !phaseOneComplete || nextPhaseLoading ? 0.65 : 1,
              boxShadow: phaseOneComplete
                ? "0 0 0 4px rgba(34,197,94,0.18), 0 0 28px rgba(34,197,94,0.75)"
                : "none",
            }}
          >
            {nextPhaseLoading
              ? "Preparing screenshot order..."
              : phaseTwoPrepared
                ? "Phase 2 prepared - choose order below"
                : phaseOneComplete
                  ? "Phase 2 ready - Choose screenshot order"
                  : "Phase 2 locked"}
          </button>
          {phaseTwoPrepared ? (
            <button
              type="button"
              onClick={applyAllSelectedImagesToFrontend}
              className="ml-dark-button"
            >
              Apply selected screenshots to all frontend project pages
            </button>
          ) : null}
        </div>

        <p
          style={{
            color: phaseOneComplete ? "#166534" : "#92400e",
            fontWeight: 900,
          }}
        >
          Ready screenshots: {readyScreenshotsCount}. Missing ratings:{" "}
          {missingRatingsCount}.
        </p>

        {nextPhaseMessage ? (
          <p
            style={{
              color: nextPhaseMessage.includes("completed")
                ? "#166534"
                : "#991b1b",
              fontWeight: 900,
            }}
          >
            {nextPhaseMessage}
          </p>
        ) : null}

        <pre
          style={{
            marginTop: 16,
            padding: 16,
            background: "#111827",
            color: "#fff",
            overflow: "auto",
            borderRadius: 14,
          }}
        >
          {JSON.stringify(job, null, 2)}
        </pre>
      </section>

      <div>
        {visibleProjects.map((project) => {
          const ranking = rankings[project.slug];
          const projectDisabled = Boolean(
            project.disabled || project.useForMl === false,
          );
          const status = projectDisabled
            ? "skipped"
            : ranking?.status || "idle";
          const isProcessing = status === "processing";
          const appliedFrontendImages =
            frontendImageMap[project.slug]?.images || [];
          const rankingCandidates = ranking?.candidates || [];
          const usableCandidates = getUsableCandidates(
            project.slug,
            rankingCandidates,
          );
          const rejectedCount =
            rankingCandidates.length - usableCandidates.length;

          const hasEnoughFrontendScreenshots =
            usableCandidates.length >= MIN_ACCEPTED_FRONTEND_IMAGES;

          return (
            <section
              key={project.slug}
              className={
                projectDisabled
                  ? "ml-project-section is-project-disabled"
                  : "ml-project-section"
              }
            >
              <div className="ml-panel">
                <h2 style={{ marginBottom: 4 }}>{project.title}</h2>

                <p style={{ marginTop: 0 }}>
                  Status: <span className="ml-status-badge">{status}</span>{" "}
                  <span
                    style={{
                      marginLeft: 8,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: project.personal ? "#dcfce7" : "#fee2e2",
                      color: project.personal ? "#166534" : "#991b1b",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    {project.personal ? "Personal" : "Employer / client"}
                  </span>
                  {project.company ? (
                    <span
                      style={{ marginLeft: 8, fontSize: 12, color: "#555" }}
                    >
                      {project.company}
                    </span>
                  ) : null}
                </p>

                {appliedFrontendImages.length > 0 ? (
                  <p
                    style={{ marginTop: 6, color: "#166534", fontWeight: 900 }}
                  >
                    Applied to frontend: {appliedFrontendImages.length}{" "}
                    screenshot
                    {appliedFrontendImages.length === 1 ? "" : "s"}. Cover is #
                    {1}.
                  </p>
                ) : null}

                <ProjectEnableSwitch
                  id={"section-" + project.slug}
                  label={
                    projectDisabled ? "Project Disabled" : "Project Enabled"
                  }
                  disabled={projectDisabled}
                  onChange={async (nextDisabled) => {
                    await updateProjectDisabled(project, nextDisabled);
                  }}
                />

                <ProjectSettingsEditor
                  project={project}
                  ranking={ranking}
                  job={job}
                  globalLimitsEnabled={useGlobalScreenshotLimits}
                  settingsDisabled={projectDisabled}
                  onSaved={load}
                  onMessage={setNextPhaseMessage}
                />

                {projectDisabled ? (
                  <div className="ml-project-disabled-content">
                    <h2>Project Disabled</h2>
                  </div>
                ) : (
                  <>
                    <AuthToggle session={ranking?.authSession} />

                    {ranking?.message ? <p>{ranking.message}</p> : null}

                    {ranking?.unavailableReason ? (
                      <p style={{ color: "#991b1b", fontWeight: 900 }}>
                        Reason: {ranking.unavailableReason}
                      </p>
                    ) : null}

                    <div className="ml-toolbar">
                      <button
                        onClick={() => resetProjectSelections(project.slug)}
                        className="ml-danger-button"
                      >
                        Reset selections for this project
                      </button>

                      {rankingCandidates.length > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            markProjectNoSuitable(
                              project.slug,
                              rankingCandidates,
                            )
                          }
                          className="ml-danger-button"
                          disabled={
                            savingKey === project.slug + "__no-suitable"
                          }
                        >
                          {savingKey === project.slug + "__no-suitable"
                            ? "Marking no suitable..."
                            : "Mark all as no suitable"}
                        </button>
                      ) : null}

                      {rejectedCount > 0 ? (
                        <span className="ml-rejected-count">
                          Rejected screenshots: {rejectedCount}/
                          {rankingCandidates.length}
                        </span>
                      ) : null}
                    </div>

                    {isTrainingDisabled(status) ? (
                      <div
                        className="ml-panel"
                        style={{ marginTop: 16, borderColor: "#fecaca" }}
                      >
                        {ranking?.cover ? (
                          <img
                            src={ranking.cover}
                            alt={project.title + " placeholder"}
                            style={{
                              width: "100%",
                              maxWidth: 560,
                              aspectRatio: "16 / 10",
                              objectFit: "cover",
                              borderRadius: 14,
                              display: "block",
                              background: "#f3f4f6",
                            }}
                          />
                        ) : null}

                        <p
                          style={{
                            marginTop: 14,
                            color: "#991b1b",
                            fontWeight: 900,
                          }}
                        >
                          Screenshot training is disabled until auth/settings
                          are fixed.
                        </p>
                      </div>
                    ) : null}

                    {isProcessing ? (
                      <div
                        style={{
                          marginTop: 16,
                          padding: 18,
                          borderRadius: 16,
                          background: "#ecfdf5",
                          color: "#166534",
                          fontWeight: 900,
                        }}
                      >
                        Loading screenshots...
                      </div>
                    ) : null}

                    {phaseTwoPrepared &&
                    ranking?.status === "ready" &&
                    hasEnoughFrontendScreenshots ? (
                      <ScreenshotFrontendSelector
                        projectSlug={project.slug}
                        candidates={usableCandidates}
                        orderedImages={getProjectOrderedImages(
                          project.slug,
                          usableCandidates,
                        )}
                        onSelectPosition={(image, nextPosition) => {
                          reorderProjectImage(
                            project.slug,
                            image,
                            nextPosition,
                            usableCandidates,
                          );
                        }}
                        onDragMove={(fromImage, toImage) => {
                          moveProjectImageByDrag(
                            project.slug,
                            fromImage,
                            toImage,
                            usableCandidates,
                          );
                        }}
                        onApply={() => {
                          applyProjectImagesToFrontend(
                            project.slug,
                            usableCandidates,
                          );
                        }}
                      />
                    ) : null}

                    {phaseTwoPrepared &&
                    ranking?.status === "ready" &&
                    rankingCandidates.length > 0 &&
                    !hasEnoughFrontendScreenshots ? (
                      <div className="ml-no-suitable-box">
                        <strong>Not enough acceptable screenshots.</strong>
                        <span>
                          Accepted screenshots: {usableCandidates.length}/
                          {MIN_ACCEPTED_FRONTEND_IMAGES}. Reject feedback was
                          saved. Rerun this project to generate better
                          screenshots or unreject enough valid screenshots.
                        </span>
                      </div>
                    ) : null}

                    {!isTrainingDisabled(status) && !isProcessing ? (
                      <div className="ml-image-grid">
                        {(ranking?.candidates || []).length > 1 ? (
                          <svg
                            className="ml-neural-svg"
                            viewBox="0 0 1200 600"
                            preserveAspectRatio="none"
                          >
                            <path d="M20 80 C 220 20, 280 180, 440 120 S 720 20, 860 130 S 1040 260, 1180 120" />
                            <path d="M30 360 C 220 480, 320 300, 500 420 S 740 520, 940 390 S 1080 260, 1190 420" />
                            <path d="M100 240 C 260 120, 420 300, 600 210 S 850 90, 1100 250" />
                            <circle cx="120" cy="90" r="5" />
                            <circle cx="450" cy="120" r="5" />
                            <circle cx="760" cy="105" r="5" />
                            <circle cx="1040" cy="260" r="5" />
                          </svg>
                        ) : null}

                        {(ranking?.candidates || []).map(
                          (image, imageIndex) => {
                            const key = buildPreferenceKey(project.slug, image);
                            const savedPreference = preferenceMap.get(key);
                            const activeRating = savedPreference?.rating;
                            const activeTags = savedPreference?.tags || [];
                            const isRejected = Boolean(
                              savedPreference?.rejected,
                            );
                            const meta = ranking?.candidateMeta?.find(
                              (item) => item.publicPath === image,
                            );

                            return (
                              <article
                                key={image}
                                className={
                                  isRejected ? "ml-card is-rejected" : "ml-card"
                                }
                              >
                                <button
                                  type="button"
                                  className="ml-preview-button"
                                  onClick={() =>
                                    openScreenshotLightbox(
                                      project,
                                      ranking,
                                      imageIndex,
                                    )
                                  }
                                  aria-label={
                                    "Open screenshot preview for " +
                                    project.title
                                  }
                                >
                                  <img src={image} alt="candidate" />
                                </button>

                                <button
                                  type="button"
                                  className={
                                    isRejected
                                      ? "ml-unreject-button"
                                      : "ml-reject-button"
                                  }
                                  onClick={() =>
                                    setImageRejected(
                                      project.slug,
                                      image,
                                      !isRejected,
                                    )
                                  }
                                >
                                  {isRejected
                                    ? "Unreject screenshot"
                                    : "Reject screenshot"}
                                </button>

                                <div className="ml-meta-row">
                                  {meta?.sourceLabel ? (
                                    <span>{meta.sourceLabel}</span>
                                  ) : null}
                                  {meta?.sourceType ? (
                                    <span>
                                      {meta.sourceType === "section"
                                        ? "Section crop"
                                        : "Viewport crop"}
                                    </span>
                                  ) : null}
                                  {savedPreference?.source ? (
                                    <span>{savedPreference.source}</span>
                                  ) : null}
                                </div>

                                <div className="ml-rating-grid">
                                  {ratingItems.map((item) => {
                                    const selected =
                                      activeRating === item.value;

                                    return (
                                      <button
                                        key={item.value}
                                        onClick={() =>
                                          rate(
                                            project.slug,
                                            image,
                                            item.value as 1 | 2 | 3 | 4 | 5,
                                          )
                                        }
                                        title={item.text}
                                        style={{
                                          background: item.background,
                                          outline: selected
                                            ? "4px solid #111827"
                                            : "none",
                                          outlineOffset: -4,
                                          opacity: selected ? 1 : 0.82,
                                        }}
                                      >
                                        {item.label}
                                      </button>
                                    );
                                  })}
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: 6,
                                    fontSize: 12,
                                    color: "#555",
                                  }}
                                >
                                  <span>Bad</span>
                                  <span>Good</span>
                                </div>

                                <div className="ml-tag-row">
                                  {trainingTags.map((tag) => {
                                    const selected = activeTags.includes(
                                      tag.id,
                                    );

                                    return (
                                      <button
                                        key={tag.id}
                                        onClick={() =>
                                          toggleTag(project.slug, image, tag.id)
                                        }
                                        className={
                                          selected
                                            ? tag.positive
                                              ? "is-selected-positive"
                                              : "is-selected-negative"
                                            : ""
                                        }
                                      >
                                        {tag.label}
                                      </button>
                                    );
                                  })}
                                </div>

                                <div
                                  style={{
                                    marginTop: 8,
                                    minHeight: 22,
                                    fontSize: 13,
                                    color: "#333",
                                  }}
                                >
                                  {isRejected ? (
                                    <strong className="ml-rejected-label">
                                      Rejected screenshot
                                    </strong>
                                  ) : activeRating ? (
                                    <strong>
                                      Selected rating: {activeRating}/5
                                    </strong>
                                  ) : (
                                    <span>No rating yet</span>
                                  )}
                                  {savingKey === key ? (
                                    <span> - saving...</span>
                                  ) : null}
                                </div>
                              </article>
                            );
                          },
                        )}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
