import { useState, useRef, useEffect } from "react";

const STATIONS = [
  { id: 1, name: "Символи України", emoji: "🇺🇦", color: "#1565C0" },
  { id: 2, name: "Карта України", emoji: "🗺️", color: "#E65100" },
  { id: 3, name: "Пазл-Карта", emoji: "🧩", color: "#2E7D32" },
  { id: 4, name: "Прислів'я", emoji: "📜", color: "#388E3C" },
  { id: 5, name: "Області", emoji: "🗾", color: "#6D4C41" },
  { id: 6, name: "Слова", emoji: "🔍", color: "#D84315" },
  { id: 7, name: "Природа", emoji: "🌲", color: "#2E7D32" },
  { id: 8, name: "Пісні", emoji: "🎵", color: "#7B1FA2" },
];

// Реальні SVG шляхи областей України
// viewBox="0 0 900 640"

const PUZZLE_PIECES = [
  { id: 1, name: "Захід", color: "#1565C0", correctZone: { x: 0, y: 0 }, emoji: "🌲" },
  { id: 2, name: "Північ", color: "#0277BD", correctZone: { x: 1, y: 0 }, emoji: "🌊" },
  { id: 3, name: "Центр", color: "#F9A825", correctZone: { x: 1, y: 1 }, emoji: "🌻" },
  { id: 4, name: "Схід", color: "#1B5E20", correctZone: { x: 2, y: 0 }, emoji: "⚒️" },
  { id: 5, name: "Південь", color: "#E65100", correctZone: { x: 1, y: 2 }, emoji: "🌊" },
  { id: 6, name: "Крим", color: "#4A148C", correctZone: { x: 2, y: 2 }, emoji: "🏔️" },
];

function stationPct(id) {
  return 4 + (id - 1) * (90 / (STATIONS.length - 1));
}

export default function App() {
  const [currentStation, setCurrentStation] = useState(null);
  const [completedStations, setCompletedStations] = useState(new Set());
  const [showStation, setShowStation] = useState(false);
  const [mapVideoOpen, setMapVideoOpen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [puzzleState, setPuzzleState] = useState({ placed: {} });
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState(null);

  const trainPct = currentStation ? stationPct(currentStation.id) : stationPct(1);

  const openStation = (s) => {
    setCurrentStation(s);
    setShowStation(true);
  };
  const closeStation = () => {
    setShowStation(false);
    setCurrentStation(null);
    setMapVideoOpen(false);
  };
  const completeStation = (id) => {
    setCompletedStations((p) => new Set([...p, id]));
    closeStation();
  };

  const handlePieceDragStart = (e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleZoneDragOver = (e) => e.preventDefault();
  const handleZoneDrop = (e, zx, zy) => {
    e.preventDefault();
    if (!draggedPiece) return;
    const correct = draggedPiece.correctZone.x === zx && draggedPiece.correctZone.y === zy;
    const newPlaced = { ...puzzleState.placed, [`${zx}-${zy}`]: { ...draggedPiece, correct } };
    setPuzzleState({ placed: newPlaced });
    if (Object.values(newPlaced).filter((p) => p.correct).length === PUZZLE_PIECES.length) setTimeout(() => setPuzzleSolved(true), 400);
    setDraggedPiece(null);
  };

  const progressPct = Math.round((completedStations.size / STATIONS.length) * 100);

  return (
    <div style={S.root}>
      <div style={S.skyBg} />
      <Clouds />
      <SunEl />

      <header style={S.header}>
        <div style={S.headerRow}>
          <span style={S.headerEmoji}>🚂</span>
          <div>
            <h1 style={S.title}>Захоплююча подорож Україною</h1>
            <p style={S.subtitle}>Пройди всі 10 станцій і дізнайся більше про нашу країну!</p>
          </div>
        </div>
        <div style={S.progressRow}>
          <div style={S.progressTrack}>
            <div style={{ ...S.progressFill, width: `${progressPct}%` }} />
          </div>
          <span style={S.progressLabel}>{completedStations.size} / 8 ✅</span>
        </div>
      </header>

      <div style={S.contentOuter}>
        <div style={S.contentInner}>
          {!showStation && (
            <div style={S.card}>
              <h2 style={S.cardTitle}>🗺️ Обери станцію!</h2>
              <div style={S.grid}>
                {STATIONS.map((s) => (
                  <StationBtn key={s.id} station={s} available={s.id <= 8} done={completedStations.has(s.id)} onClick={() => s.id <= 8 && openStation(s)} />
                ))}
              </div>
            </div>
          )}

          {showStation && currentStation && (
            <div style={S.modal}>
              <div style={{ ...S.modalHead, background: currentStation.color }}>
                <span style={S.modalTitle}>
                  {currentStation.emoji} Станція {currentStation.id}: {currentStation.name}
                </span>
                <button style={S.closeBtn} onClick={closeStation}>
                  ✕
                </button>
              </div>
              <div style={S.modalBody}>
                {currentStation.id === 1 && <Station1 onComplete={() => completeStation(1)} />}
                {currentStation.id === 2 && <Station2 mapVideoOpen={mapVideoOpen} setMapVideoOpen={setMapVideoOpen} hoveredRegion={hoveredRegion} setHoveredRegion={setHoveredRegion} onComplete={() => completeStation(2)} />}
                {currentStation.id === 3 && <Station3 puzzleState={puzzleState} setPuzzleState={setPuzzleState} puzzleSolved={puzzleSolved} setPuzzleSolved={setPuzzleSolved} onDragStart={handlePieceDragStart} onDragOver={handleZoneDragOver} onDrop={handleZoneDrop} onComplete={() => completeStation(3)} />}
                {currentStation.id === 4 && <Station4 onComplete={() => completeStation(4)} />}
                {currentStation.id === 5 && <Station5 onComplete={() => completeStation(5)} />}
                {currentStation.id === 6 && <Station6 onComplete={() => completeStation(6)} />}
                {currentStation.id === 7 && <Station7 onComplete={() => completeStation(7)} />}
                {currentStation.id === 8 && <Station8 onComplete={() => completeStation(8)} />}
              </div>
            </div>
          )}
        </div>
      </div>

      <TrainTrack completedStations={completedStations} trainPct={trainPct} onStationClick={(s) => s.id <= 8 && openStation(s)} />
      <style>{globalCSS}</style>
    </div>
  );
}

function Clouds() {
  const data = [
    { top: "5%", left: "3%", size: 1.1, dur: 18 },
    { top: "11%", left: "25%", size: 0.75, dur: 23 },
    { top: "4%", left: "48%", size: 1.3, dur: 27 },
    { top: "14%", left: "68%", size: 0.85, dur: 21 },
    { top: "7%", left: "87%", size: 1.0, dur: 25 },
  ];
  return (
    <>
      {data.map((c, i) => (
        <div key={i} style={{ position: "fixed", top: c.top, left: c.left, zIndex: 1, pointerEvents: "none", fontSize: `${2.2 * c.size}rem`, animation: `cloudDrift ${c.dur}s ease-in-out infinite alternate`, animationDelay: `${i * 0.9}s`, filter: "drop-shadow(0 4px 10px rgba(255,255,255,0.6))", opacity: 0.9 }}>
          ☁️
        </div>
      ))}
    </>
  );
}

function SunEl() {
  return <div style={{ position: "fixed", top: "2.5%", right: "3.5%", zIndex: 1, fontSize: "3.2rem", pointerEvents: "none", animation: "sunSpin 25s linear infinite", filter: "drop-shadow(0 0 18px #FFD700aa)" }}>☀️</div>;
}

function StationBtn({ station, available, done, onClick }) {
  const [hov, setHov] = useState(false);
  const bg = done ? "linear-gradient(145deg,#F9A825,#EF6C00)" : available ? `linear-gradient(145deg,${station.color},${station.color}bb)` : "linear-gradient(145deg,#9E9E9E,#757575)";
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: bg, border: `3px solid ${done ? "#FFF9C4" : available ? "rgba(255,255,255,0.55)" : "transparent"}`, borderRadius: 22, padding: "18px 10px", cursor: available ? "pointer" : "not-allowed", color: "white", fontWeight: 800, fontSize: "0.95rem", textAlign: "center", lineHeight: 1.3, fontFamily: "inherit", transition: "transform .18s, box-shadow .18s", transform: hov && available ? "translateY(-5px) scale(1.07)" : "scale(1)", boxShadow: hov && available ? `0 12px 28px ${station.color}77` : available ? `0 4px 14px ${station.color}44` : "none", opacity: available ? 1 : 0.52 }}>
      <div style={{ fontSize: "2.4rem", marginBottom: 6 }}>{done ? "✅" : station.emoji}</div>
      <div style={{ background: "rgba(0,0,0,0.22)", borderRadius: 12, padding: "2px 9px", display: "inline-block", fontSize: "0.78rem", marginBottom: 5 }}>{station.id}</div>
      <div>{station.name}</div>
      {!available && <div style={{ fontSize: "0.72rem", marginTop: 5, opacity: 0.8 }}>🔒 Незабаром</div>}
    </button>
  );
}

function CompleteBtn({ color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: `linear-gradient(145deg,${color},${color}cc)`, color: "white", border: "3px solid rgba(255,255,255,0.5)", borderRadius: 24, padding: "12px 36px", fontSize: "1.05rem", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", letterSpacing: ".02em", boxShadow: hov ? `0 10px 28px ${color}66` : `0 4px 14px ${color}44`, transform: hov ? "translateY(-3px) scale(1.04)" : "scale(1)", transition: "all .18s" }}>
      ✅ Молодець! Далі →
    </button>
  );
}

function Station1({ onComplete }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg" alt="Прапор України" style={{ width: 220, borderRadius: 14, border: "5px solid #1565C0", boxShadow: "0 8px 24px rgba(21,101,192,0.35)" }} />
        <div style={{ background: "#EEF2FF", borderRadius: 12, padding: "8px 16px", fontSize: "0.92rem", color: "#333", fontWeight: 600 }}>
          <span style={{ color: "#1565C0", fontWeight: 900 }}>Синій</span> — небо та водойми &nbsp;|&nbsp;
          <span style={{ color: "#E6A817", fontWeight: 900 }}>Жовтий</span> — пшеничні поля
        </div>
      </div>
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", border: "3px solid rgba(255,255,255,0.8)", marginBottom: 14 }}>
        <iframe width="100%" height="280" src="https://www.youtube.com/embed/Aa0Wvoi-mVo" title="Україна для дітей" frameBorder="0" allowFullScreen style={{ display: "block" }} />
      </div>
      <p style={{ color: "#555", fontWeight: 600, margin: "0 0 16px" }}>📺 Переглянь відео і дізнайся більше про нашу країну!</p>
      <CompleteBtn color="#1565C0" onClick={onComplete} />
    </div>
  );
}

/* ─────────────────────────────────────────
   STATION 2 — КАРТА УКРАЇНИ
───────────────────────────────────────── */
function Station2({ mapVideoOpen, setMapVideoOpen, hoveredRegion, setHoveredRegion, onComplete }) {
  const containerRef = useRef(null);
  const KHMEL = "278,245 318,218 350,285 362,318 328,352 332,368 278,372 270,325";
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#333", fontWeight: 700, fontSize: "1rem", marginBottom: 14 }}>
        🗺️ Знайди <strong style={{ color: "#E65100" }}>Хмельницьку область</strong> і клікни на неї!
      </p>
      <div ref={containerRef} style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: 720 }}>
        <img src="https://harni.news/wp-content/uploads/2025/11/oblasti-ukrayini-1.webp" alt="Карта України з областями" draggable={false} style={{ width: "100%", display: "block", borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "3px solid rgba(255,255,255,0.9)", userSelect: "none" }} />
        <svg viewBox="0 0 1000 670" style={{ position: "absolute", top: -30, left: -25, width: "100%", height: "100%" }}>
          <polygon points={KHMEL} fill={mapVideoOpen ? "rgba(76,175,80,0.35)" : hoveredRegion === "khmel" ? "rgba(255,87,34,0.55)" : "rgba(255,87,34,0.22)"} stroke="#FF5722" strokeWidth="3.5" strokeLinejoin="round" style={{ cursor: "pointer", transition: "fill .15s" }} onClick={() => setMapVideoOpen(true)} onMouseEnter={() => setHoveredRegion("khmel")} onMouseLeave={() => setHoveredRegion(null)} />
          <text x="305" y="325" textAnchor="middle" fontSize="13" fontWeight="900" fill="white" stroke="#BF360C" strokeWidth="3" paintOrder="stroke" style={{ pointerEvents: "none", userSelect: "none" }}>
            Хмельницька
          </text>
          {!mapVideoOpen && (
            <g style={{ pointerEvents: "none" }}>
              <circle cx="305" cy="298" r="10" fill="none" stroke="#FF5722" strokeWidth="3">
                <animate attributeName="r" values="6;20;6" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
          {mapVideoOpen && (
            <text x="305" y="307" textAnchor="middle" fontSize="28" style={{ pointerEvents: "none", userSelect: "none" }}>
              ✅
            </text>
          )}
        </svg>
      </div>
      {!mapVideoOpen && <p style={{ color: "#E65100", fontWeight: 800, marginTop: 14, fontSize: "1rem", animation: "pulse 1.5s infinite" }}>👆 Клікни на Хмельницьку область!</p>}
      {mapVideoOpen && (
        <div style={{ marginTop: 18 }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 24px rgba(230,81,0,0.28)", border: "3px solid #E65100" }}>
            <div style={{ background: "#E65100", color: "white", padding: "10px 16px", fontWeight: 800, fontSize: "1rem" }}>🏙️ Хмельницький — твоє місто!</div>
            <iframe width="100%" height="260" src="https://www.youtube.com/embed/WS57zHQc_KE" title="Хмельницький" frameBorder="0" allowFullScreen />
          </div>
          <div style={{ marginTop: 16 }}>
            <CompleteBtn color="#E65100" onClick={onComplete} />
          </div>
        </div>
      )}
    </div>
  );
}

function Station3({ puzzleState, setPuzzleState, puzzleSolved, setPuzzleSolved, onDragStart, onDragOver, onDrop, onComplete }) {
  const reset = () => {
    setPuzzleState({ placed: {} });
    setPuzzleSolved(false);
  };
  const available = PUZZLE_PIECES.filter((p) => !puzzleState.placed[`${p.correctZone.x}-${p.correctZone.y}`]);
  return (
    <div>
      <p style={{ textAlign: "center", color: "#333", fontWeight: 700, marginBottom: 12 }}>🧩 Склади карту України! Перетягни частини на правильні місця.</p>
      {puzzleSolved && (
        <div style={{ background: "linear-gradient(135deg,#FFF9C4,#FFF176)", borderRadius: 18, padding: "16px 20px", textAlign: "center", marginBottom: 16, border: "3px solid #F9A825", boxShadow: "0 6px 20px rgba(249,168,37,.3)", animation: "popIn .4s ease" }}>
          <div style={{ fontSize: "2.8rem" }}>🎉🇺🇦🎉</div>
          <h3 style={{ margin: "8px 0 12px", color: "#1a1a1a" }}>Чудово! Ти склав карту України!</h3>
          <CompleteBtn color="#2E7D32" onClick={onComplete} />
        </div>
      )}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center" }}>
        <div>
          <div style={{ fontSize: "0.82rem", color: "#555", fontWeight: 700, marginBottom: 6 }}>📍 Карта (постав сюди):</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,100px)", gridTemplateRows: "repeat(3,76px)", gap: 4, background: "#E3F2FD", padding: 8, borderRadius: 14, border: "2px dashed #90CAF9" }}>
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 3 }).map((_, col) => {
                const key = `${col}-${row}`;
                const placed = puzzleState.placed[key];
                const isSlot = PUZZLE_PIECES.some((p) => p.correctZone.x === col && p.correctZone.y === row);
                return (
                  <div key={key} onDrop={(e) => onDrop(e, col, row)} onDragOver={onDragOver} style={{ width: 100, height: 76, borderRadius: 12, border: placed ? `3px solid ${placed.correct ? "#4CAF50" : "#EF5350"}` : isSlot ? "3px dashed #90CAF9" : "3px dashed transparent", background: placed ? placed.color + "33" : isSlot ? "rgba(255,255,255,0.55)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontSize: "0.72rem", fontWeight: 700, color: "#333", transition: "all .2s" }}>
                    {placed ? (
                      <>
                        <span style={{ fontSize: "1.8rem" }}>{placed.emoji}</span>
                        <span style={{ fontSize: "0.68rem" }}>{placed.name}</span>
                        <span>{placed.correct ? "✅" : "❌"}</span>
                      </>
                    ) : isSlot ? (
                      <span style={{ color: "#90CAF9", fontSize: "1.6rem" }}>+</span>
                    ) : null}
                  </div>
                );
              }),
            )}
          </div>
        </div>
        <div style={{ minWidth: 260 }}>
          <div style={{ fontSize: "0.82rem", color: "#555", fontWeight: 700, marginBottom: 6 }}>🧩 Частини карти:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {available.map((p) => (
              <PieceTile key={p.id} piece={p} onDragStart={onDragStart} />
            ))}
            {available.length === 0 && !puzzleSolved && <p style={{ color: "#888", fontSize: "0.85rem" }}>Всі частини розміщено!</p>}
          </div>
          <div style={{ background: "#F3E5F5", borderRadius: 12, padding: "10px 14px", fontSize: "0.78rem", color: "#7B1FA2", lineHeight: 1.7, marginBottom: 10 }}>
            <strong>Підказка 🗺️:</strong>
            <br />
            Захід | Північ | Схід
            <br />
            &nbsp;&nbsp;&nbsp; Центр
            <br />
            &nbsp;&nbsp;&nbsp; Південь / Крим
          </div>
          <button onClick={reset} style={{ background: "#f5f5f5", border: "2px solid #ddd", borderRadius: 12, padding: "8px 20px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, color: "#555", fontFamily: "inherit" }}>
            🔄 Почати знову
          </button>
        </div>
      </div>
    </div>
  );
}

function PieceTile({ piece, onDragStart }) {
  const [hov, setHov] = useState(false);
  return (
    <div draggable onDragStart={(e) => onDragStart(e, piece)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ width: 92, height: 72, background: `linear-gradient(145deg,${piece.color},${piece.color}bb)`, borderRadius: 14, border: "3px solid rgba(255,255,255,.7)", boxShadow: hov ? `0 8px 20px ${piece.color}66` : "0 4px 10px rgba(0,0,0,.18)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", cursor: "grab", userSelect: "none", color: "white", fontWeight: 800, fontSize: "0.75rem", transition: "transform .18s, box-shadow .18s", transform: hov ? "scale(1.1) translateY(-3px)" : "scale(1)" }}>
      <span style={{ fontSize: "1.9rem" }}>{piece.emoji}</span>
      {piece.name}
    </div>
  );
}

const PROVERB_CARDS = [
  { id: 1, emoji: "🌿", symbol: "Верба", proverb: "Без верби і калини — нема України" },
  { id: 2, emoji: "🌺", symbol: "Калина", proverb: "Калина — краса рідного краю" },
  { id: 3, emoji: "🌻", symbol: "Соняшник", proverb: "Де сонце світить, там соняшник цвіте" },
  { id: 4, emoji: "🧵", symbol: "Рушник", proverb: "Рушник — доля, вишита руками матері" },
  { id: 5, emoji: "👕", symbol: "Вишиванка", proverb: "Вишиванка — то душа народу нашого" },
  { id: 6, emoji: "🌾", symbol: "Хліб", proverb: "Хліб — усьому голова" },
  { id: 7, emoji: "🌸", symbol: "Мак", proverb: "Де мак цвіте, там краса живе" },
  { id: 8, emoji: "🕊️", symbol: "Голуб", proverb: "Голуб — вісник миру і злагоди" },
  { id: 9, emoji: "🐦", symbol: "Зозуля", proverb: "Зозуля кує — літа лічить" },
];

function Station4({ onComplete }) {
  const [flipped, setFlipped] = useState(new Set());

  const toggle = (id) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allFlipped = flipped.size === PROVERB_CARDS.length;

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#333", fontWeight: 700, fontSize: "1rem", marginBottom: 18 }}>
        🃏 Клікни на кожну картку, щоб дізнатися <strong style={{ color: "#388E3C" }}>українське прислів'я</strong> про народний символ!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {PROVERB_CARDS.map((card) => {
          const isFlipped = flipped.has(card.id);
          return (
            <div key={card.id} onClick={() => toggle(card.id)} style={{ perspective: 600, height: 130, cursor: "pointer" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.55s cubic-bezier(.4,0,.2,1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: 18,
                    background: "linear-gradient(145deg,#1B5E20,#388E3C)",
                    border: "3px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 6px 18px rgba(56,142,60,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    color: "white",
                    fontWeight: 800,
                  }}
                >
                  <span style={{ fontSize: "2.6rem" }}>{card.emoji}</span>
                  <span style={{ fontSize: "0.9rem", letterSpacing: "0.02em" }}>{card.symbol}</span>
                </div>
                {/* Back */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: 18,
                    background: "linear-gradient(145deg,#FFF9C4,#FFF176)",
                    border: "3px solid #F9A825",
                    boxShadow: "0 6px 18px rgba(249,168,37,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 12px",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{card.emoji}</span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#4E342E",
                      lineHeight: 1.4,
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    «{card.proverb}»
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {allFlipped && (
        <div style={{ animation: "popIn .4s ease" }}>
          <CompleteBtn color="#388E3C" onClick={onComplete} />
        </div>
      )}
      {!allFlipped && (
        <p style={{ color: "#888", fontSize: "0.85rem", marginTop: 0 }}>
          Відкрито: {flipped.size} / {PROVERB_CARDS.length}
        </p>
      )}
    </div>
  );
}

const REGION_PAIRS = [
  { id: 1, region: "Вінницька", center: "Вінниця" },
  { id: 2, region: "Закарпатська", center: "Ужгород" },
  { id: 3, region: "Київська", center: "Київ" },
  { id: 4, region: "Одеська", center: "Одеса" },
  { id: 5, region: "Львівська", center: "Львів" },
  { id: 6, region: "Харківська", center: "Харків" },
  { id: 7, region: "Дніпропетровська", center: "Дніпро" },
  { id: 8, region: "Хмельницька", center: "Хмельницький" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Station5({ onComplete }) {
  const [connections, setConnections] = useState({}); // regionId -> centerId
  const [draggingId, setDraggingId] = useState(null);
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  const [leftItems] = useState(() => shuffle(REGION_PAIRS.map((p) => ({ id: p.id, label: p.region }))));
  const [rightItems] = useState(() => shuffle(REGION_PAIRS.map((p) => ({ id: p.id, label: p.center }))));

  const isCorrect = (regionId, centerId) => regionId === centerId;

  const calcLines = () => {
    if (!containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const next = Object.entries(connections)
      .map(([rId, cId]) => {
        const lEl = leftRefs.current[rId];
        const rEl = rightRefs.current[cId];
        if (!lEl || !rEl) return null;
        const lr = lEl.getBoundingClientRect();
        const rr = rEl.getBoundingClientRect();
        return {
          x1: lr.right - box.left,
          y1: lr.top + lr.height / 2 - box.top,
          x2: rr.left - box.left,
          y2: rr.top + rr.height / 2 - box.top,
          correct: isCorrect(Number(rId), Number(cId)),
        };
      })
      .filter(Boolean);
    setLines(next);
  };

  useEffect(() => {
    calcLines();
    window.addEventListener("resize", calcLines);
    return () => window.removeEventListener("resize", calcLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections]);

  const handleDrop = (e, centerId) => {
    e.preventDefault();
    if (draggingId == null) return;
    // Remove any previous mapping that used this centerId
    const cleaned = Object.fromEntries(Object.entries(connections).filter(([, v]) => Number(v) !== centerId));
    setConnections({ ...cleaned, [draggingId]: centerId });
    setDraggingId(null);
  };

  const removeConnection = (regionId) => {
    const next = { ...connections };
    delete next[regionId];
    setConnections(next);
  };

  const allDone = Object.keys(connections).length === REGION_PAIRS.length;
  const allCorrectDone = allDone && Object.entries(connections).every(([r, c]) => isCorrect(Number(r), Number(c)));

  const reset = () => {
    setConnections({});
    setLines([]);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#333", fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>
        🗾 З'єднай <strong style={{ color: "#6D4C41" }}>область</strong> з її <strong style={{ color: "#1565C0" }}>обласним центром</strong>! Перетягни назву.
      </p>

      <div ref={containerRef} style={{ position: "relative", display: "flex", gap: 0, justifyContent: "space-between", alignItems: "flex-start" }}>
        {/* SVG lines overlay */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
          {lines.map((l, i) => (
            <g key={i}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.correct ? "#4CAF50" : "#EF5350"} strokeWidth="3" strokeDasharray={l.correct ? "none" : "6 4"} strokeLinecap="round" />
              <circle cx={l.x1} cy={l.y1} r="5" fill={l.correct ? "#4CAF50" : "#EF5350"} />
              <circle cx={l.x2} cy={l.y2} r="5" fill={l.correct ? "#4CAF50" : "#EF5350"} />
            </g>
          ))}
        </svg>

        {/* Left column — regions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "44%" }}>
          <div style={{ fontSize: "0.78rem", color: "#6D4C41", fontWeight: 800, marginBottom: 4, textAlign: "left" }}>🗺️ Область</div>
          {leftItems.map((item) => {
            const connected = connections[item.id] != null;
            const correct = connected && isCorrect(item.id, connections[item.id]);
            return (
              <div
                key={item.id}
                ref={(el) => {
                  leftRefs.current[item.id] = el;
                }}
                draggable
                onDragStart={() => setDraggingId(item.id)}
                onDragEnd={() => setDraggingId(null)}
                onClick={() => connected && removeConnection(item.id)}
                style={{
                  padding: "9px 14px",
                  borderRadius: 12,
                  border: connected ? `2.5px solid ${correct ? "#4CAF50" : "#EF5350"}` : "2.5px solid #A1887F",
                  background: connected ? (correct ? "#E8F5E9" : "#FFEBEE") : "linear-gradient(145deg,#6D4C41,#8D6E63)",
                  color: connected ? (correct ? "#2E7D32" : "#C62828") : "white",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  cursor: connected ? "pointer" : "grab",
                  userSelect: "none",
                  textAlign: "left",
                  transition: "all .18s",
                  boxShadow: connected ? "none" : "0 3px 10px rgba(109,76,65,.35)",
                  opacity: draggingId === item.id ? 0.45 : 1,
                  title: connected ? "Клікни, щоб скасувати" : "",
                }}
              >
                {connected ? (correct ? "✅ " : "❌ ") : "⠿ "}
                {item.label}
                {connected && <span style={{ fontSize: "0.7rem", marginLeft: 4, opacity: 0.7 }}>(клік — скасувати)</span>}
              </div>
            );
          })}
        </div>

        {/* Right column — centers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "44%" }}>
          <div style={{ fontSize: "0.78rem", color: "#1565C0", fontWeight: 800, marginBottom: 4, textAlign: "right" }}>🏙️ Обласний центр</div>
          {rightItems.map((item) => {
            const isTarget = Object.values(connections).includes(item.id);
            return (
              <div
                key={item.id}
                ref={(el) => {
                  rightRefs.current[item.id] = el;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, item.id)}
                style={{
                  padding: "9px 14px",
                  borderRadius: 12,
                  border: isTarget ? "2.5px solid #90CAF9" : "2.5px dashed #90CAF9",
                  background: isTarget ? "#E3F2FD" : "linear-gradient(145deg,#1565C0,#1976D2)",
                  color: isTarget ? "#0D47A1" : "white",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  userSelect: "none",
                  textAlign: "right",
                  transition: "all .18s",
                  boxShadow: isTarget ? "none" : "0 3px 10px rgba(21,101,192,.35)",
                  cursor: "default",
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        {allCorrectDone ? (
          <div style={{ animation: "popIn .4s ease" }}>
            <div style={{ marginBottom: 10, fontSize: "1.1rem", fontWeight: 800, color: "#2E7D32" }}>🎉 Всі пари правильні!</div>
            <CompleteBtn color="#6D4C41" onClick={onComplete} />
          </div>
        ) : (
          <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>
            З'єднано: {Object.keys(connections).length} / {REGION_PAIRS.length}
            {allDone && !allCorrectDone && <span style={{ color: "#EF5350", marginLeft: 8 }}>— є помилки, виправ!</span>}
          </p>
        )}
        <button onClick={reset} style={{ background: "#f5f5f5", border: "2px solid #ddd", borderRadius: 12, padding: "7px 18px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "#555", fontFamily: "inherit" }}>
          🔄 Скинути
        </button>
      </div>
    </div>
  );
}

function Station7({ onComplete }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#333", fontWeight: 700, fontSize: "1rem", marginBottom: 14 }}>
        🌲 Переглянь відео і дізнайся більше про <strong style={{ color: "#2E7D32" }}>природу України</strong>!
      </p>
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 24px rgba(46,125,50,0.28)", border: "3px solid #2E7D32", marginBottom: 14 }}>
        <iframe width="100%" height="300" src="https://www.youtube.com/embed/xrwBUIyq0WU" title="Природа України" allowFullScreen style={{ display: "block", border: 0 }} />
      </div>
      <p style={{ color: "#555", fontWeight: 600, margin: "0 0 16px" }}>📺 Яка гарна природа нашої країни!</p>
      <CompleteBtn color="#2E7D32" onClick={onComplete} />
    </div>
  );
}

const SONG_TASKS = [
  {
    id: 1,
    song: "Ой у лузі червона калина",
    emoji: "🌺",
    lines: ["Ой у лузі червона ___,", "Похилилася..."],
    answer: "КАЛИНА",
    hint: "Символ України, червона ягода",
  },
  {
    id: 2,
    song: "Щедрик",
    emoji: "🎶",
    lines: ["Щедрик, щедрик, ___,", "Прилетіла ластівочка..."],
    answer: "ЩЕДРІВОЧКА",
    hint: "Маленька щедра пісенька",
  },
  {
    id: 3,
    song: "Два кольори",
    emoji: "🎨",
    lines: ["Два кольори мої, два ___,", "Оба на полотні..."],
    answer: "КОЛЬОРИ",
    hint: "Перше слово пісні повторюється двічі",
  },
  {
    id: 4,
    song: "Зозуля",
    emoji: "🐦",
    lines: ["Зозуле, зозуле,", "Скільки мені ___?"],
    answer: "ЖИТИ",
    hint: "Питання про довжину життя",
  },
];

function Station8({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showHint, setShowHint] = useState({});

  const handleCheck = (id, answer) => {
    const task = SONG_TASKS.find((t) => t.id === id);
    const correct = answer.trim().toUpperCase() === task.answer;
    setChecked((prev) => ({ ...prev, [id]: correct ? "correct" : "wrong" }));
    if (!correct) setTimeout(() => setChecked((prev) => ({ ...prev, [id]: null })), 1200);
  };

  const solvedCount = SONG_TASKS.filter((t) => checked[t.id] === "correct").length;
  const allSolved = solvedCount === SONG_TASKS.length;

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#333", fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>
        🎵 Вгадай пропущене слово в українській <strong style={{ color: "#7B1FA2" }}>народній пісні</strong>!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 16 }}>
        {SONG_TASKS.map((task) => {
          const status = checked[task.id];
          const solved = status === "correct";
          const wrong = status === "wrong";
          return (
            <div
              key={task.id}
              style={{
                borderRadius: 16,
                border: `3px solid ${solved ? "#4CAF50" : wrong ? "#EF5350" : "#CE93D8"}`,
                background: solved ? "#E8F5E9" : wrong ? "#FFEBEE" : "linear-gradient(145deg,#F3E5F5,#EDE7F6)",
                padding: "14px 12px",
                transition: "all .2s",
                animation: wrong ? "shake .4s ease" : "none",
              }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: 4 }}>{task.emoji}</div>
              <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "#7B1FA2", marginBottom: 6 }}>{task.song}</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333", lineHeight: 1.5, marginBottom: 10, fontStyle: "italic" }}>
                {task.lines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              {solved ? (
                <div style={{ fontWeight: 900, color: "#2E7D32", fontSize: "0.95rem" }}>✅ {task.answer}</div>
              ) : (
                <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
                  <input
                    value={answers[task.id] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [task.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck(task.id, answers[task.id] ?? "")}
                    placeholder="твоя відповідь..."
                    style={{
                      border: `2px solid ${wrong ? "#EF5350" : "#CE93D8"}`,
                      borderRadius: 10,
                      padding: "6px 10px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      fontFamily: "inherit",
                      width: "100%",
                      outline: "none",
                      background: "white",
                    }}
                  />
                  <button
                    onClick={() => handleCheck(task.id, answers[task.id] ?? "")}
                    style={{
                      background: "#7B1FA2",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </button>
                </div>
              )}
              <button onClick={() => setShowHint((prev) => ({ ...prev, [task.id]: !prev[task.id] }))} style={{ marginTop: 6, background: "none", border: "none", color: "#9C27B0", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit" }}>
                {showHint[task.id] ? "▲ сховати" : "💡 підказка"}
              </button>
              {showHint[task.id] && <div style={{ marginTop: 4, fontSize: "0.75rem", color: "#6A1B9A", fontStyle: "italic" }}>{task.hint}</div>}
            </div>
          );
        })}
      </div>
      <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 12px" }}>
        Відгадано: {solvedCount} / {SONG_TASKS.length}
      </p>
      {allSolved && (
        <div style={{ animation: "popIn .4s ease" }}>
          <div style={{ marginBottom: 10, fontSize: "1.1rem", fontWeight: 800, color: "#7B1FA2" }}>🎉 Всі пісні відгадані!</div>
          <CompleteBtn color="#7B1FA2" onClick={onComplete} />
        </div>
      )}
    </div>
  );
}

const GRID_SIZE = 12;
const UA_LETTERS = "АБВГДЕЄЖЗИІЇКЛМНОПРСТУФХЦЧШЩЬЮЯ";
const FOUND_COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#00BCD4", "#8BC34A", "#FF5722", "#3F51B5"];

const WORDS_TO_FIND = [
  { word: "ТРИЗУБ", row: 0, col: 1, dir: "H" },
  { word: "ПРАПОР", row: 2, col: 4, dir: "H" },
  { word: "ГЕРБ", row: 3, col: 0, dir: "V" },
  { word: "ГІМН", row: 5, col: 6, dir: "D" },
  { word: "КАЛИНА", row: 1, col: 11, dir: "V" },
  { word: "ВЕРБА", row: 7, col: 2, dir: "H" },
  { word: "ВИШИВАНКА", row: 9, col: 0, dir: "H" },
  { word: "ХЛІБ", row: 4, col: 10, dir: "V" },
  { word: "СОНЯШНИК", row: 1, col: 1, dir: "V" },
];

function buildWordGrid() {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  WORDS_TO_FIND.forEach(({ word, row, col, dir }) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + (dir !== "H" ? i : 0);
      const c = col + (dir !== "V" ? i : 0);
      grid[r][c] = word[i];
    }
  });
  for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) if (!grid[r][c]) grid[r][c] = UA_LETTERS[Math.floor(Math.random() * UA_LETTERS.length)];
  return grid;
}

function getLineCells(start, end) {
  if (!start) return [];
  if (!end || (start.row === end.row && start.col === end.col)) return [start];
  const dr = end.row - start.row;
  const dc = end.col - start.col;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [start];
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const sr = Math.sign(dr),
    sc = Math.sign(dc);
  return Array.from({ length: steps + 1 }, (_, i) => ({ row: start.row + i * sr, col: start.col + i * sc }));
}

function Station6({ onComplete }) {
  const [grid] = useState(buildWordGrid);
  const [sel, setSel] = useState({ start: null, end: null, active: false });
  const [foundWords, setFoundWords] = useState([]);
  const [shake, setShake] = useState(false);

  const selectedCells = getLineCells(sel.start, sel.end);
  const cellKey = (r, c) => `${r}-${c}`;

  const foundCellMap = {};
  foundWords.forEach(({ cells, color }) =>
    cells.forEach(({ row, col }) => {
      foundCellMap[cellKey(row, col)] = color;
    }),
  );

  const checkWord = (cells) => {
    if (cells.length < 2) return false;
    const str = cells.map(({ row, col }) => grid[row][col]).join("");
    const rev = str.split("").reverse().join("");
    const hit = WORDS_TO_FIND.find(({ word }) => !foundWords.find((fw) => fw.word === word) && (word === str || word === rev));
    if (hit) {
      setFoundWords((prev) => [...prev, { word: hit.word, cells, color: FOUND_COLORS[prev.length % FOUND_COLORS.length] }]);
      return true;
    }
    return false;
  };

  const handleMouseDown = (r, c, e) => {
    e.preventDefault();
    setSel({ start: { row: r, col: c }, end: { row: r, col: c }, active: true });
  };
  const handleMouseEnter = (r, c) => {
    if (!sel.active) return;
    setSel((prev) => ({ ...prev, end: { row: r, col: c } }));
  };
  const handleMouseUp = () => {
    if (!sel.active) return;
    const cells = getLineCells(sel.start, sel.end);
    if (!checkWord(cells)) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
    setSel({ start: null, end: null, active: false });
  };

  const allFound = foundWords.length === WORDS_TO_FIND.length;

  return (
    <div style={{ textAlign: "center" }} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <p style={{ color: "#333", fontWeight: 700, fontSize: "1rem", marginBottom: 14 }}>
        🔍 Знайди всі <strong style={{ color: "#D84315" }}>9 слів</strong> — державні символи України! Виділи букви мишкою.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, 34px)`,
            gap: 2,
            background: "#E3F2FD",
            padding: 8,
            borderRadius: 14,
            border: "2px solid #90CAF9",
            userSelect: "none",
            animation: shake ? "shake .4s ease" : "none",
          }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = cellKey(r, c);
              const foundColor = foundCellMap[key];
              const selected = selectedCells.some((sc) => sc.row === r && sc.col === c);
              return (
                <div
                  key={key}
                  onMouseDown={(e) => handleMouseDown(r, c, e)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  style={{
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "background .1s, transform .1s",
                    background: foundColor ?? (selected ? "#FF9800" : "white"),
                    color: foundColor || selected ? "white" : "#1a1a1a",
                    boxShadow: selected ? "0 2px 8px rgba(255,152,0,.5)" : "0 1px 3px rgba(0,0,0,.1)",
                    transform: selected ? "scale(1.12)" : "scale(1)",
                  }}
                >
                  {letter}
                </div>
              );
            }),
          )}
        </div>

        <div style={{ minWidth: 160 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#555", marginBottom: 8 }}>📋 Слова для пошуку:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {WORDS_TO_FIND.map(({ word }) => {
              const found = foundWords.find((fw) => fw.word === word);
              return (
                <div
                  key={word}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 10,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    background: found ? found.color : "#f5f5f5",
                    color: found ? "white" : "#555",
                    border: found ? "none" : "2px dashed #ddd",
                    textDecoration: found ? "line-through" : "none",
                    transition: "all .3s",
                    textAlign: "left",
                  }}
                >
                  {found ? "✅ " : "○ "}
                  {word}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: "0.8rem", color: "#888" }}>
            Знайдено: {foundWords.length} / {WORDS_TO_FIND.length}
          </div>
        </div>
      </div>

      {allFound && (
        <div style={{ marginTop: 16, animation: "popIn .4s ease" }}>
          <div style={{ marginBottom: 10, fontSize: "1.1rem", fontWeight: 800, color: "#D84315" }}>🎉 Всі слова знайдено!</div>
          <CompleteBtn color="#D84315" onClick={onComplete} />
        </div>
      )}
    </div>
  );
}

function Wagon({ color }) {
  return (
    <div style={{ width: 42, height: 26, background: color, borderRadius: "4px 4px 0 0", border: "2px solid rgba(255,255,255,0.55)", boxShadow: "0 2px 6px rgba(0,0,0,.28)", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 4, left: 5, width: 9, height: 8, background: "rgba(255,255,255,0.75)", borderRadius: 2 }} />
      <div style={{ position: "absolute", top: 4, right: 5, width: 9, height: 8, background: "rgba(255,255,255,0.75)", borderRadius: 2 }} />
      <div style={{ position: "absolute", bottom: -5, left: 4, width: 8, height: 8, background: "#222", borderRadius: "50%", border: "1.5px solid #555" }} />
      <div style={{ position: "absolute", bottom: -5, right: 4, width: 8, height: 8, background: "#222", borderRadius: "50%", border: "1.5px solid #555" }} />
    </div>
  );
}

const WAGON_COLORS = ["#1565C0", "#1976D2", "#0277BD", "#01579B", "#006064", "#00695C", "#2E7D32", "#388E3C", "#1B5E20", "#33691E"];

function TrainTrack({ completedStations, trainPct, onStationClick }) {
  const trackRef = useRef(null);
  const [wagonCount, setWagonCount] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!trackRef.current) return;
      const trackW = trackRef.current.offsetWidth;
      const locoLeftPx = (trainPct / 100) * trackW;
      const locoWidth = 50;
      const wagonW = 44;
      const totalWidth = locoLeftPx - locoWidth + 100;
      const count = Math.max(0, Math.ceil(totalWidth / wagonW));
      setWagonCount(count);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [trainPct]);

  return (
    <div ref={trackRef} style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 170, zIndex: 20 }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 30, background: "linear-gradient(180deg,#66BB6A,#388E3C)" }} />
      <div style={{ position: "absolute", bottom: 25, left: 0, right: 0, height: 16 }}>
        {Array.from({ length: 55 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", bottom: "-2px", left: `${i * 1.9}%`, width: 3, height: 20, background: "#5D4037", borderRadius: 2 }} />
        ))}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#9E9E9E,#BDBDBD,#9E9E9E)", borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#9E9E9E,#BDBDBD,#9E9E9E)", borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
      </div>
      <div style={{ position: "absolute", bottom: 30, left: -100, width: `calc(${trainPct}% + 100px)`, transition: "width 1.1s cubic-bezier(.25,.46,.45,.94)", display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end", gap: 2, paddingRight: 4, overflow: "hidden", zIndex: 22, pointerEvents: "none" }}>
        {Array.from({ length: wagonCount }).map((_, i) => (
          <Wagon key={i} color={WAGON_COLORS[i % WAGON_COLORS.length]} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 30, left: `${trainPct}%`, transition: "left 1.1s cubic-bezier(.25,.46,.45,.94)", fontSize: "3.2rem", lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,.35))", transform: "translateX(-50%) scaleX(-1)", zIndex: 22, pointerEvents: "none" }}>🚂</div>
      {STATIONS.map((s) => {
        const pct = stationPct(s.id);
        const avail = s.id <= 8;
        const done = completedStations.has(s.id);
        return (
          <div key={s.id} onClick={() => onStationClick(s)} style={{ position: "absolute", bottom: 80, left: `${pct}%`, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", cursor: avail ? "pointer" : "default", zIndex: 35 }}>
            <div style={{ background: done ? "#F9A825" : avail ? s.color : "#bbb", color: "white", borderRadius: 10, padding: "4px 7px", fontSize: "0.7rem", fontWeight: 900, border: "2.5px solid white", boxShadow: "0 3px 10px rgba(0,0,0,.3)", textAlign: "center", lineHeight: 1.25, minWidth: 48, transition: "transform .18s" }}>
              <div style={{ fontSize: "1.3rem" }}>{done ? "✅" : s.emoji}</div>
              <div style={{ fontSize: "0.65rem" }}>{s.id}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const S = {
  root: { minHeight: "100vh", fontFamily: "'Segoe UI',Tahoma,'Comic Sans MS',cursive,sans-serif", position: "relative", overflowX: "hidden", paddingBottom: 200, display: "flex", flexDirection: "column", alignItems: "center" },
  skyBg: { position: "fixed", inset: 0, zIndex: 0, background: "linear-gradient(180deg,#42A5F5 0%,#90CAF9 38%,#E3F2FD 65%,#C8E6C9 100%)" },
  header: { position: "relative", zIndex: 10, background: "linear-gradient(135deg,#1565C0f0,#0D47A1f0)", backdropFilter: "blur(14px)", borderBottom: "4px solid #F9A825", padding: "14px 20px 10px", width: "100%", boxSizing: "border-box", boxShadow: "0 4px 24px rgba(21,101,192,.45)" },
  headerRow: { display: "flex", alignItems: "center", gap: 14, maxWidth: 1440, margin: "0 auto" },
  headerEmoji: { fontSize: "3rem", flexShrink: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))", animation: "trainBounce 2s ease-in-out infinite" },
  title: { margin: 0, color: "#FFD600", fontWeight: 900, fontSize: "clamp(1.1rem,3.5vw,2rem)", textShadow: "0 2px 8px rgba(0,0,0,.35)", letterSpacing: "-.5px", lineHeight: 1.2 },
  subtitle: { margin: "4px 0 0", fontWeight: 600, color: "rgba(255,255,255,.88)", fontSize: "clamp(.72rem,2vw,.9rem)" },
  progressRow: { maxWidth: 1440, margin: "10px auto 0", display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 10, borderRadius: 20, background: "rgba(255,255,255,.25)", overflow: "hidden", border: "2px solid rgba(255,255,255,.3)" },
  progressFill: { height: "100%", borderRadius: 20, background: "linear-gradient(90deg,#FFD600,#FF6F00)", transition: "width .6s ease", boxShadow: "0 0 8px #FFD60055" },
  progressLabel: { color: "white", fontWeight: 700, fontSize: ".82rem", whiteSpace: "nowrap" },
  contentOuter: { position: "relative", zIndex: 10, width: "100%", padding: "20px 40px 0", boxSizing: "border-box" },
  contentInner: { maxWidth: 1100, margin: "0 auto" },
  card: { background: "rgba(255,255,255,.84)", backdropFilter: "blur(18px)", borderRadius: 24, padding: "24px", border: "3px solid rgba(255,255,255,.92)", boxShadow: "0 8px 36px rgba(21,101,192,.18)" },
  cardTitle: { margin: "0 0 14px", color: "#1565C0", fontSize: "1.25rem", fontWeight: 900, textAlign: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 16 },
  modal: { background: "rgba(255,255,255,.97)", backdropFilter: "blur(20px)", borderRadius: 24, overflow: "hidden", boxShadow: "0 16px 52px rgba(0,0,0,.24)", border: "3px solid rgba(255,255,255,.9)", animation: "slideIn .35s ease" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", color: "white" },
  modalTitle: { fontWeight: 900, fontSize: "clamp(.88rem,2.5vw,1.1rem)" },
  closeBtn: { background: "rgba(0,0,0,.25)", color: "white", border: "2px solid rgba(255,255,255,.5)", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: "1rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, flexShrink: 0, fontFamily: "inherit" },
  modalBody: { padding: "18px 16px 22px", maxHeight: "65vh", overflowY: "auto" },
};

const globalCSS = `
  *{box-sizing:border-box}
  body{margin:0;padding:0}
  @keyframes cloudDrift{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(-14px) translateX(10px)}}
  @keyframes sunSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes trainBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes popIn{0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#f0f0f0;border-radius:10px}
  ::-webkit-scrollbar-thumb{background:#90CAF9;border-radius:10px}
`;
