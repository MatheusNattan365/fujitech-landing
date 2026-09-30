"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import TechText from "@/components/craft/TechText";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

export function ScrollStages({ locale, messages }: { locale: Locale; messages: Messages }) {
  const steps = messages.stages.steps;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progress = { p1: 0, p2: 0, p3: 0, p4: 0, time: 0 };
    const heroCanvas = root.querySelector<HTMLCanvasElement>("[data-canvas='hero']");
    const curveCanvas = root.querySelector<HTMLCanvasElement>("[data-canvas='curve']");
    const moltenCanvas = root.querySelector<HTMLCanvasElement>("[data-canvas='molten']");
    const readout = root.querySelector<HTMLElement>("[data-readout]");
    const rows = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    let frame = 0;

    const apply = () => {
      root.style.setProperty("--p1", String(progress.p1));
      root.style.setProperty("--p2", String(progress.p2));
      root.style.setProperty("--p3", String(progress.p3));
      root.style.setProperty("--p4", String(progress.p4));
      const index = Math.min(steps.length - 1, Math.floor(progress.p3 * steps.length));
      if (readout) readout.textContent = `0${index + 1}`;
      rows.forEach((row, rowIndex) => {
        row.style.opacity = progress.p3 >= rowIndex / steps.length ? "1" : "0.35";
      });
    };

    if (reduce) {
      progress.p1 = 1;
      progress.p2 = 1;
      progress.p3 = 1;
      progress.p4 = 1;
      apply();
      return;
    }

    const heroCtx = heroCanvas?.getContext("2d") ?? null;
    const curveCtx = curveCanvas?.getContext("2d") ?? null;
    const moltenCtx = moltenCanvas?.getContext("2d") ?? null;
    let blobs: { x: number; y: number; radius: number; phase: number }[] = [];

    const fit = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return { w: 0, h: 0 };
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      return { w: canvas.width, h: canvas.height };
    };

    const initHero = () => {
      if (!heroCanvas) return;
      const { w, h } = fit(heroCanvas);
      blobs = Array.from({ length: 5 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: (Math.random() * 0.22 + 0.16) * w,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const drawHero = () => {
      if (!heroCanvas || !heroCtx) return;
      if (heroCanvas.width < 2) initHero();
      const { width: w, height: h } = heroCanvas;
      heroCtx.clearRect(0, 0, w, h);
      heroCtx.globalCompositeOperation = "screen";
      blobs.forEach((blob) => {
        const x = blob.x + Math.sin(progress.time * 0.001 + blob.phase) * 80;
        const y = blob.y + Math.cos(progress.time * 0.0012 + blob.phase) * 80;
        const gradient = heroCtx.createRadialGradient(x, y, 0, x, y, blob.radius);
        const alpha = 0.16 + Math.sin(progress.time * 0.0005 + blob.phase) * 0.1;
        gradient.addColorStop(0, `rgba(86, 126, 187, ${alpha})`);
        gradient.addColorStop(1, "rgba(86, 126, 187, 0)");
        heroCtx.fillStyle = gradient;
        heroCtx.beginPath();
        heroCtx.arc(x, y, blob.radius, 0, Math.PI * 2);
        heroCtx.fill();
      });
    };

    const drawCurve = () => {
      if (!curveCanvas || !curveCtx) return;
      const { w, h } = fit(curveCanvas);
      const pad = 48;
      const points = [0, 0.33, 0.66, 1];
      const values = [0.92, 0.7, 0.42, 0.18];
      const xAt = (p: number) => pad + p * (w - pad * 2);
      const yAt = (v: number) => pad + (1 - v) * (h - pad * 2);
      curveCtx.clearRect(0, 0, w, h);
      curveCtx.strokeStyle = "rgba(220, 224, 230, 0.22)";
      curveCtx.lineWidth = 1.5;
      curveCtx.beginPath();
      points.forEach((point, index) => {
        const x = xAt(point);
        const y = yAt(values[index] ?? 0);
        if (index === 0) curveCtx.moveTo(x, y);
        else curveCtx.lineTo(x, y);
      });
      curveCtx.stroke();
      curveCtx.strokeStyle = "#567ebb";
      curveCtx.lineWidth = 2.4;
      curveCtx.beginPath();
      const segments = 80;
      for (let i = 0; i <= segments; i += 1) {
        const p = (i / segments) * progress.p3;
        const slot = Math.min(points.length - 2, Math.floor(p * (points.length - 1)));
        const start = points[slot] ?? 0;
        const end = points[slot + 1] ?? 1;
        const t = end === start ? 0 : (p - start) / (end - start);
        const value = (values[slot] ?? 0) * (1 - t) + (values[slot + 1] ?? 0) * t;
        const x = xAt(p);
        const y = yAt(value);
        if (i === 0) curveCtx.moveTo(x, y);
        else curveCtx.lineTo(x, y);
      }
      curveCtx.stroke();
      const headSlot = Math.min(points.length - 2, Math.floor(progress.p3 * (points.length - 1)));
      const start = points[headSlot] ?? 0;
      const end = points[headSlot + 1] ?? 1;
      const t = end === start ? 0 : (progress.p3 - start) / (end - start);
      const head = (values[headSlot] ?? 0) * (1 - t) + (values[headSlot + 1] ?? 0) * t;
      const hx = xAt(progress.p3);
      const hy = yAt(head);
      curveCtx.fillStyle = "#567ebb";
      curveCtx.beginPath();
      curveCtx.arc(hx, hy, 5, 0, Math.PI * 2);
      curveCtx.fill();
    };

    const drawMolten = () => {
      if (!moltenCanvas || !moltenCtx) return;
      const { w, h } = fit(moltenCanvas);
      const cx = w / 2;
      const cy = h / 2;
      moltenCtx.clearRect(0, 0, w, h);
      moltenCtx.globalCompositeOperation = "screen";
      [0.6, 0.8, 1].forEach((scale, index) => {
        const base = w * 0.16 * scale;
        moltenCtx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.08) {
          const offset =
            Math.sin(angle * 3 + progress.time * 0.001 + index) * 18 +
            Math.sin(angle * 5 - progress.time * 0.0008) * 10;
          const radius = base + offset;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          if (angle === 0) moltenCtx.moveTo(x, y);
          else moltenCtx.lineTo(x, y);
        }
        moltenCtx.closePath();
        const gradient = moltenCtx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.5);
        gradient.addColorStop(0, "rgba(86, 126, 187, 0.16)");
        gradient.addColorStop(1, "rgba(86, 126, 187, 0)");
        moltenCtx.fillStyle = gradient;
        moltenCtx.fill();
        moltenCtx.strokeStyle = "rgba(86, 126, 187, 0.34)";
        moltenCtx.stroke();
      });
    };

    const onScroll = () => {
      const vh = window.innerHeight;
      const read = (id: string) => {
        const el = root.querySelector<HTMLElement>(`#${id}`);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - vh)));
      };
      progress.p1 = read("hero");
      progress.p2 = Math.min(1, read("wipe") * 1.2);
      progress.p3 = read("metodo");
      progress.p4 = read("proxima");
      apply();
    };

    const loop = (time: number) => {
      progress.time = time;
      drawHero();
      drawCurve();
      drawMolten();
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      initHero();
      onScroll();
    };

    initHero();
    onScroll();
    frame = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={rootRef}>
      <section id="hero" className="craft-stage">
        <div className="craft-pin bg-craft-ink">
          <canvas data-canvas="hero" className="craft-canvas pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
          <div
            className="relative z-10 flex w-full flex-col items-center px-6 text-center"
            style={{ transform: "translateY(calc(var(--p1) * -40px))", opacity: "max(0, calc(1 - var(--p1) * 1.15))" }}
          >
            <p className="furniture mb-6 text-craft-mist">{messages.hero.places}</p>
            <h1 className="flex w-full max-w-5xl flex-col items-center text-craft-bone">
              <span className="sr-only">{messages.hero.sr}</span>
              <span aria-hidden="true" className="flex w-full flex-col items-center">
                <span className="h-24 w-full sm:h-32 lg:h-40">
                  <TechText
                    text={messages.hero.word}
                    fontWeight={600}
                    fontSize={150}
                    letterSpacing={-0.04}
                    color="#dce0e6"
                    accentColor="#567ebb"
                    reveal="letter"
                    dashLength={4}
                    dashGap={2}
                    specks={15}
                    style={{ width: "100%", height: "100%" }}
                  />
                </span>
                <span className="font-display text-2xl uppercase tracking-[-0.04em] sm:text-4xl">{messages.hero.line}</span>
              </span>
            </h1>
            <p className="mt-8 max-w-[42ch] text-base leading-relaxed text-craft-mist sm:text-lg">
              {messages.hero.text}
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" variant="ember" className="focus-visible:ring-offset-craft-ink">
                <Link href={localePath(locale, "/#contato")}>{messages.nav.talk}</Link>
              </Button>
              <Button asChild size="lg" variant="emberGhost" className="focus-visible:ring-offset-craft-ink">
                <Link href={localePath(locale, "/#servicos")}>{messages.hero.services}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="wipe" className="craft-stage">
        <div className="craft-pin bg-craft-ink-alt px-5 md:px-8">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="relative">
              <h2 className="wipe-base max-w-[18ch] text-[1.75rem] md:text-5xl lg:text-6xl">
                {messages.stages.wipe}
              </h2>
              <h2 className="wipe-overlay absolute top-0 left-0 max-w-[18ch] text-[1.75rem] text-craft-bone md:text-5xl lg:text-6xl" aria-hidden="true">
                {messages.stages.wipe}
              </h2>
            </div>
            <div className="relative mt-10 h-px overflow-hidden bg-craft-bone/10">
              <div className="absolute inset-y-0 left-0 bg-craft-ember" style={{ width: "calc(var(--p2) * 100%)" }} />
            </div>
            <div className="furniture mt-6 flex justify-between text-craft-mist">
              <span>01 / {messages.stages.method}</span>
              <span>{messages.stages.stepsLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="metodo" className="craft-stage scroll-mt-24">
        <div className="craft-pin bg-craft-ink-accent px-5 md:px-8">
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-[1.75rem] md:text-5xl">
                {messages.stages.methodTitle} <span className="text-craft-ember">{messages.stages.methodAccent}</span>
              </h2>
              <ol className="mt-8">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    data-step={index}
                    className="hairline-b flex items-end justify-between gap-6 py-5"
                  >
                    <div>
                      <p className="furniture text-craft-mist">0{index + 1}</p>
                      <h3 className="mt-2 text-lg normal-case tracking-normal text-craft-bone">{step.title}</h3>
                      <p className="mt-1 max-w-[42ch] text-sm leading-relaxed text-craft-mist">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hairline relative aspect-square w-full bg-craft-ink p-6">
              <canvas data-canvas="curve" className="craft-canvas h-full w-full" aria-hidden="true" />
              <div className="absolute right-8 bottom-8 text-right">
                <p className="furniture text-craft-mist">{messages.stages.stepLabel}</p>
                <p data-readout className="mt-2 font-display text-5xl text-craft-ember">
                  01
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proxima" className="craft-stage">
        <div className="craft-pin bg-craft-ink">
          <canvas data-canvas="molten" className="craft-canvas pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" style={{ transform: "scale(calc(0.8 + var(--p4) * 0.35))" }} />
          <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-start justify-end gap-8 px-5 pb-16 md:flex-row md:items-end md:justify-between md:px-8">
            <h2 className="text-5xl md:text-7xl">
              {messages.stages.ctaTitle}
              <br />
              <span className="text-craft-ember">{messages.stages.ctaAccent}</span>
            </h2>
            <div className="max-w-sm">
              <p className="text-lg leading-relaxed text-craft-mist">{messages.stages.ctaText}</p>
              <Button asChild size="lg" variant="ember" className="mt-8 focus-visible:ring-offset-craft-ink">
                <Link href={localePath(locale, "/#contato")}>{messages.nav.talk}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
