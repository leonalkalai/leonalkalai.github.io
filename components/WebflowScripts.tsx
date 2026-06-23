"use client";

      import { useEffect } from "react";

      const scripts = [
        "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
        "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=699bf5529ae9a99a06373c58",
        "https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js",
        "https://cdn.prod.website-files.com/699bf5529ae9a99a06373c58/js/webflow.schunk.36b8fb49256177c8.js",
        "https://cdn.prod.website-files.com/699bf5529ae9a99a06373c58/js/webflow.schunk.61afb3c5374b8905.js",
        "https://cdn.prod.website-files.com/699bf5529ae9a99a06373c58/js/webflow.ce3f0089.9044588ed18fa579.js",
      ];

      type WebflowRuntime = unknown[] & {
        destroy?: () => void;
        ready?: () => void;
        require?: (module: string) => {
          init?: () => void;
        };
      };

      declare global {
        interface Window {
          Webflow?: WebflowRuntime;
        }
      }

      function loadScript(src: string) {
        return new Promise<void>((resolve, reject) => {
          if (!src) {
            resolve();
            return;
          }

          const existingScript = document.querySelector<HTMLScriptElement>(
            'script[data-webflow-script="' + src + '"], script[src="' + src + '"]',
          );

          if (existingScript) {
            resolve();
            return;
          }

          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.defer = false;
          script.type = "text/javascript";
          script.dataset.webflowScript = src;

          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load " + src));

          document.body.appendChild(script);
        });
      }

      export default function WebflowScripts() {
        useEffect(() => {
          let cancelled = false;

          async function bootWebflow() {
            window.Webflow = window.Webflow || ([] as unknown as WebflowRuntime);

            for (const src of scripts) {
              if (cancelled) return;
              await loadScript(src);
            }

            if (cancelled) return;

            const webflow = window.Webflow;

            if (!webflow) return;

            webflow.destroy?.();
            webflow.ready?.();
            webflow.require?.("ix2")?.init?.();
          }

          bootWebflow().catch((error) => {
            console.error(error);
          });

          return () => {
            cancelled = true;
          };
        }, []);

        return null;
      }

