"use client";

import React, { createContext, useContext, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export type SectionName =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "experience"
  | "contact";

type SectionContextType = {
  refs: Record<SectionName, React.RefObject<HTMLElement | null>>;
  scrollToSection: (name: SectionName) => void;
  registerSection: (name: SectionName, node: HTMLElement | null) => void;
};

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const SectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const refs = {
    home: homeRef,
    about: aboutRef,
    services: servicesRef,
    projects: projectsRef,
    experience: experienceRef,
    contact: contactRef,
  } as const;

  const scrollToSection = useCallback((name: SectionName) => {
    // Prefer the registered ref if it exists
    let el: HTMLElement | null = null;
    switch (name) {
      case 'home':
        el = homeRef.current;
        break;
      case 'about':
        el = aboutRef.current;
        break;
      case 'services':
        el = servicesRef.current;
        break;
      case 'projects':
        el = projectsRef.current;
        break;
      case 'experience':
        el = experienceRef.current;
        break;
      case 'contact':
        el = contactRef.current;
        break;
    }

    // fallback to DOM id lookup
    if (!el) el = (document.getElementById(name) as HTMLElement | null);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${name}`);
      return;
    }

    // Not on page — navigate to home with the hash so the section will register + scroll on mount
    const targetHash = `#${name}`;
    const isOnHome = pathname === '/' || pathname === '';
    if (!isOnHome) {
      router.push(`/${targetHash}`);
      return;
    }

    // Last-resort: update hash so registerSection can pick it up later
    history.replaceState(null, '', targetHash);
  }, [pathname, router]);

  const registerSection = useCallback((name: SectionName, node: HTMLElement | null) => {
    // store node in the corresponding ref (avoid mutating the `refs` object directly)
    switch (name) {
      case 'home':
        homeRef.current = node;
        break;
      case 'about':
        aboutRef.current = node;
        break;
      case 'services':
        servicesRef.current = node;
        break;
      case 'projects':
        projectsRef.current = node;
        break;
      case 'experience':
        experienceRef.current = node;
        break;
      case 'contact':
        contactRef.current = node;
        break;
    }

    // If the URL hash matches this section, scroll to it now that the node is registered.
    if (typeof window !== 'undefined' && window.location.hash === `#${name}` && node) {
      setTimeout(() => node.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, []);

  return (
    <SectionContext.Provider value={{ refs, scrollToSection, registerSection }}>{children}</SectionContext.Provider>
  );
};

export const useSections = () => {
  const ctx = useContext(SectionContext);
  if (!ctx) throw new Error("useSections must be used within SectionProvider");
  return ctx;
};
