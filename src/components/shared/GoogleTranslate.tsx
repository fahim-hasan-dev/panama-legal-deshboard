/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __gtReady?: boolean;
    __applyTranslate?: (lang: string) => void;
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

// Function to translate only a specific element container (e.g. dynamic modal)
async function translateContainerContent(container: HTMLElement, targetLang: string) {
  if (!container || targetLang === "en") return;

  // Find all text nodes inside container that are NOT inside .notranslate or [translate="no"]
  const textNodes: Text[] = [];
  const walk = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (
          parent.closest(".notranslate") ||
          parent.closest('[translate="no"]') ||
          parent.tagName === "SCRIPT" ||
          parent.tagName === "STYLE" ||
          parent.tagName === "SVG"
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        const text = node.nodeValue?.trim();
        if (!text || /^[\d\s\W]+$/.test(text)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let currentNode: Node | null;
  while ((currentNode = walk.nextNode())) {
    textNodes.push(currentNode as Text);
  }

  if (textNodes.length === 0) return;

  const textsToTranslate = textNodes.map((n) => n.nodeValue!.trim());
  const uniqueTexts = Array.from(new Set(textsToTranslate));

  try {
    const translationMap = new Map<string, string>();

    await Promise.all(
      uniqueTexts.map(async (text) => {
        try {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data && data[0]) {
            const translated = data[0].map((item: any) => item[0]).join("");
            if (translated) {
              translationMap.set(text, translated);
            }
          }
        } catch {
          // ignore single text error
        }
      })
    );

    textNodes.forEach((node) => {
      const original = node.nodeValue!.trim();
      const translated = translationMap.get(original);
      if (translated) {
        node.nodeValue = node.nodeValue!.replace(original, translated);
      }
    });
  } catch (err) {
    console.debug("[Modal Translate Error]", err);
  }
}

export function GoogleTranslate() {
  // Patch DOM methods to handle NotFoundError from Google Translate conflicts with React DOM
  useEffect(() => {
    const origRemove = Node.prototype.removeChild;
    const origAppend = Node.prototype.appendChild;
    const origInsert = Node.prototype.insertBefore;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      try {
        return origRemove.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return child;
        throw e;
      }
    };

    Node.prototype.appendChild = function <T extends Node>(child: T): T {
      try {
        return origAppend.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return child;
        throw e;
      }
    };

    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      ref: Node | null
    ): T {
      try {
        return origInsert.call(this, newNode, ref) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return newNode;
        throw e;
      }
    };
  }, []);

  // Initialize Google Translate for EN and ES only
  useEffect(() => {
    let container = document.getElementById("google-translate-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "google-translate-container";
      container.style.display = "none";
      document.body.insertBefore(container, document.body.firstChild);
    }

    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      try {
        if (!window.google?.translate?.TranslateElement) return;
        const target = document.getElementById("google_translate_element");
        if (!target) return;
        target.innerHTML = "";
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es",
            autoDisplay: false,
          },
          "google_translate_element"
        );
        window.__gtReady = true;
      } catch (error) {
        console.debug("[Google Translate] Initialization error", error);
      }
    };

    // Define the apply function for English & Spanish switching
    window.__applyTranslate = (targetLang: string) => {
      const setCookie = (lang: string) => {
        const domain = window.location.hostname.split(".").slice(-2).join(".");
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        const expires = date.toUTCString();
        document.cookie = `googtrans=/en/${lang}; expires=${expires}; path=/; SameSite=Lax`;
        if (domain.includes(".")) {
          document.cookie = `googtrans=/en/${lang}; expires=${expires}; path=/; domain=.${domain}; SameSite=Lax`;
        }
      };

      setCookie(targetLang);

      const tryChange = () => {
        const combo = document.querySelector(
          ".goog-te-combo"
        ) as HTMLSelectElement | null;
        if (combo) {
          if (combo.value !== targetLang) {
            combo.value = targetLang;
            combo.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return true;
        }
        return false;
      };

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const found = tryChange();
        if ((found && attempts > 3) || attempts > 15) {
          clearInterval(interval);
          if (attempts > 15 && !found) {
            window.location.reload();
          }
        }
      }, 250);
    };

    // Load Google Translate Script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Smooth MutationObserver for Modals (translates ONLY the modal, zero full-page reset/flicker)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const modalElements: HTMLElement[] = [];
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (
              el.getAttribute("role") === "dialog" ||
              el.querySelector?.('[role="dialog"]') ||
              el.getAttribute("data-state") === "open" ||
              el.hasAttribute("data-radix-portal")
            ) {
              modalElements.push(el);
            }
          }
        }
      }

      if (modalElements.length > 0) {
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/i);
        const activeLang = match ? match[1].toLowerCase() : null;
        if (activeLang && activeLang !== "en") {
          modalElements.forEach((modalEl) => {
            translateContainerContent(modalEl, activeLang);
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
      className="notranslate"
    />
  );
}

export default GoogleTranslate;
