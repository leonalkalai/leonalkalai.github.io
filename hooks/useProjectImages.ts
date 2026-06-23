"use client";

import { useEffect, useState } from "react";

type ProjectImageState = {
  cover: string | null;
  slides: string[];
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
};

type ResponseShape = {
  rankings: Record<string, ProjectImageState>;
  job: unknown;
};

async function safeFetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function useProjectImages(pollMs = 4000) {
  const [rankings, setRankings] = useState<Record<string, ProjectImageState>>({});
  const [job, setJob] = useState<unknown>(null);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      const data = await safeFetchJson<ResponseShape>("/api/ml/screenshots-status", {
        rankings: {},
        job: null,
      });

      if (!active) return;

      setRankings(data.rankings || {});
      setJob(data.job || null);
    }

    load();
    timer = setInterval(load, pollMs);

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, [pollMs]);

  return { rankings, job };
}
