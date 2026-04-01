import { useEffect, useState } from "react";
import "./IntroOverlay.css";

/**
 * Obsidian Pulse — Açılış Animasyonu (Alternatif A)
 *
 * Sekans:
 *   phase 0 → tagline + başlık fade-in (ortada, büyük)
 *   phase 1 → alt çizgi genişler
 *   phase 2 → her şey scale-down + yukarı çekilip kaybolur
 *   phase 3 → overlay opacity 0 → onDone() çağrılır
 *
 * sessionStorage.setItem YALNIZCA onDone() çağrılmadan hemen önce
 * yazılır — böylece animasyon tamamlanmadan "görüldü" işaretlenmez.
 *
 * Üst component (App.jsx veya benzeri) şu şekilde kullanmalı:
 *
 *   const [showIntro, setShowIntro] = useState(
 *     () => !sessionStorage.getItem("introSeen")
 *   );
 *
 *   return showIntro
 *     ? <IntroOverlay onDone={() => setShowIntro(false)} />
 *     : <MainApp />;
 *
 * Bu sayede sessionStorage kontrolü yalnızca ilk render'da yapılır
 * ve animasyon tamamlanmadan state güncellenmez.
 */

function IntroOverlay({ onDone }) {
  // phase 0: başlangıç — tüm elemanlar gizli
  // phase 1: tagline + başlık beliriyor (fade-in-up)
  // phase 2: alt çizgi genişliyor
  // phase 3: her şey scale-down ile yukarı kaçıyor
  // phase 4: overlay solar, onDone tetiklenir
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Elemanları sırayla ortaya çıkar
    const t1 = setTimeout(() => setPhase(1), 100);   // tagline belirsin
    const t2 = setTimeout(() => setPhase(2), 900);   // çizgi genişlesin
    const t3 = setTimeout(() => setPhase(3), 3200);  // scale-down başlasın
    const t4 = setTimeout(() => setPhase(4), 4000);  // overlay solsun

    const t5 = setTimeout(() => {
      onDone();
    }, 4400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onDone]);

  return (
    <div className={`intro-overlay${phase >= 4 ? " intro-overlay--out" : ""}`}>
      <div className={`intro-center${phase >= 3 ? " intro-center--exit" : ""}`}>
        <p className={`intro-tagline${phase >= 1 ? " intro-tagline--visible" : ""}`}>
          Üretim Tahmin Sistemi'ne Hoş Geldiniz
        </p>
        <h1 className={`intro-title${phase >= 1 ? " intro-title--visible" : ""}`}>
          Enerji Yönetim ve<br />
          <span className="intro-title-accent">Karar Destek</span> Sistemi
        </h1>
        <div className={`intro-divider${phase >= 2 ? " intro-divider--expanded" : ""}`} />
      </div>
    </div>
  );
}

export default IntroOverlay;
