import { useState, useEffect, useRef } from "react";
import { ORCHESTRAS, ALL_PLAYERS, ALL_PLAYERS_FLAT } from "./data/players";

/* ── DESIGN TOKENS ── */
const S = {
  gold: "#C8A96E", dark: "#1A1410", cream: "#FAF7F2",
  cardBg: "#FFFFFF", border: "#EDE6D8", borderHover: "#D4C8B4",
  textPrimary: "#1A1410", textSecondary: "#8C7B6A", textMuted: "#B09A7A",
  accent: "#F5EDD8", accentBorder: "#E8D9BC",
  surface: "#F8F5EF", surfaceAlt: "#F0EBE2",
};

const SERIF = "'Cormorant Garamond', Georgia, serif";
const LABEL_STYLE = { fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B09070" };
const LEADERSHIP_ROLES = ["Principal Bass", "Associate Principal Bass", "Assistant Principal Bass", "First Assistant Principal Bass"];
const MAX_W = 860;

/* ── HELPERS ── */
function getPlayerMap(players) {
  const map = {};
  for (const p of players) map[p.id] = p;
  return map;
}

function getAllInstruments(players) {
  return players.flatMap(p =>
    p.instruments.map(inst => ({ ...inst, owner: p.name, ownerId: p.id, ownerInitials: p.initials, ownerColor: p.color, ownerRole: p.role }))
  ).filter(i => i.maker || i.story);
}

function isRich(player) {
  return player.instruments.some(i => i.story || i.maker) || player.highlights.length > 1;
}

/* ── SHARED COMPONENTS ── */
function Avatar({ initials, color, size = 48 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "20", border: `1.5px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SERIF, fontSize: size * 0.32, fontWeight: 600, color, letterSpacing: "0.02em" }}>
      {initials}
    </div>
  );
}

function SectionLabel({ children, style = {} }) {
  return <div style={{ ...LABEL_STYLE, marginBottom: 12, ...style }}>{children}</div>;
}

function InstrumentCard({ inst }) {
  return (
    <div style={{ background: S.surface, borderRadius: 10, padding: "14px 16px", marginBottom: 10, borderLeft: `3px solid ${inst.story ? S.gold : S.border}` }}>
      <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: S.textPrimary, marginBottom: 2 }}>{inst.name}</div>
      {inst.maker && <div style={{ fontSize: 12, color: S.textSecondary, marginBottom: 6, fontStyle: "italic" }}>{inst.maker}{inst.era ? ` · ${inst.era}` : ""}</div>}
      {inst.story && inst.storyTitle && <div style={{ fontSize: 11, color: S.gold, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{inst.storyTitle}</div>}
      <div style={{ fontSize: 13, color: "#5C4F42", lineHeight: 1.6 }}>{inst.detail}</div>
    </div>
  );
}

/* ── PLAYER DETAIL (profile view) ── */
function PlayerDetail({ player, orchestra, onBack }) {
  const isMobile = window.innerWidth < 768;
  return (
    <div style={{ padding: "0 0 48px" }}>
      <div style={{ display: "flex", gap: isMobile ? 14 : 20, alignItems: "flex-start", marginBottom: 20 }}>
        <Avatar initials={player.initials} color={player.color} size={isMobile ? 52 : 72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: isMobile ? 24 : 30, fontWeight: 700, color: S.textPrimary, margin: 0, lineHeight: 1.1, marginBottom: 5 }}>{player.name}</h2>
          <div style={{ fontSize: 13, color: S.textSecondary, marginBottom: 8 }}>{player.role}</div>
          {player.chair && <div style={{ display: "inline-block", fontSize: 11, color: "#8C6B3A", background: S.accent, border: `1px solid ${S.accentBorder}`, borderRadius: 20, padding: "3px 10px", fontStyle: "italic" }}>{player.chair}</div>}
        </div>
      </div>

      <div style={{ height: 1, background: S.border, marginBottom: 20 }} />
      <div style={{ fontFamily: SERIF, fontSize: isMobile ? 15 : 17, lineHeight: 1.8, color: "#2C231A", marginBottom: 24 }}>
        {player.bio.split("\n\n").map((para, i) => (
          <p key={i} style={{ margin: i === 0 ? "0 0 1em" : "0 0 1em" }}>{para}</p>
        ))}
      </div>

      {player.highlights.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginBottom: 28 }}>
          {player.highlights.map((h, i) => <span key={i} style={{ fontSize: 12, color: S.textSecondary }}>· {h}</span>)}
        </div>
      )}

      <SectionLabel>Instruments</SectionLabel>
      {player.instruments.map((inst, i) => <InstrumentCard key={i} inst={inst} />)}
    </div>
  );
}

/* ── PLAYER CARDS ── */
function LeadershipCard({ player, onClick }) {
  const [hov, setHov] = useState(false);
  const isMobile = window.innerWidth < 768;
  return (
    <div onClick={() => onClick(player)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: "100%", boxSizing: "border-box", background: hov ? "#F8F4EE" : S.cardBg, border: `1px solid ${hov ? S.borderHover : S.border}`, borderRadius: 14, padding: isMobile ? "14px 14px" : "20px 22px", cursor: "pointer", transition: "all 0.18s ease", transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "0 6px 24px rgba(100,80,50,0.10)" : "none", borderLeft: `4px solid ${player.color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 16, marginBottom: isMobile ? 10 : 14 }}>
        <Avatar initials={player.initials} color={player.color} size={isMobile ? 40 : 52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: isMobile ? 17 : 20, fontWeight: 700, color: S.textPrimary, marginBottom: 2, lineHeight: 1.1 }}>{player.name}</div>
          <div style={{ fontSize: 12, color: S.textSecondary, marginBottom: player.chair ? 6 : 0 }}>{player.role}{player.since ? ` · since ${player.since}` : ""}</div>
          {player.chair && <div style={{ fontSize: 11, color: "#8C6B3A", fontStyle: "italic" }}>{player.chair}</div>}
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#7A6A58", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word", marginBottom: 12 }}>{player.bio.split(". ")[0] + "."}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <span style={{ fontSize: 12, color: player.color, fontWeight: 500 }}>View profile →</span>
      </div>
    </div>
  );
}

function SectionMemberCard({ player, onClick }) {
  const [hov, setHov] = useState(false);
  const rich = isRich(player);
  const hasInfo = player.highlights.length > 0 || player.since;
  return (
    <div onClick={() => onClick(player)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? "#F8F4EE" : S.cardBg, border: `1px solid ${hov ? S.borderHover : S.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s ease", transform: hov ? "translateY(-1px)" : "none", boxShadow: hov ? "0 4px 16px rgba(100,80,50,0.08)" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar initials={player.initials} color={player.color} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: S.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{player.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            {player.since && <span style={{ fontSize: 11, color: S.textMuted }}>since {player.since}</span>}
            {player.chair && <span style={{ fontSize: 11, color: "#8C6B3A", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.chair.split(" ").slice(0, 3).join(" ")}…</span>}
            {!hasInfo && <span style={{ fontSize: 11, color: S.textMuted }}>Section Bass</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          {rich && <span style={{ fontSize: 10, color: S.gold, fontWeight: 600 }}>◆</span>}
        </div>
      </div>
    </div>
  );
}

/* ── BASSISTS TAB ── */
function BassistsTab({ players, orchestra, globalSearch, onGlobalSearchChange, selectedPlayer, onSelectPlayer, onClearSelected, subView, onSubViewChange, isMobile, onGoHome }) {
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [selectedPlayer]);

  const isSearching = globalSearch.trim() !== "";
  const searchTerm = globalSearch.toLowerCase();

  const directMatches = isSearching
    ? ALL_PLAYERS_FLAT.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.role.toLowerCase().includes(searchTerm)
      )
    : null;

  const bioMentions = isSearching
    ? ALL_PLAYERS_FLAT.filter(p =>
        !directMatches.find(d => d.id === p.id) &&
        p.bio && p.bio.toLowerCase().includes(searchTerm)
      )
    : null;

  const globalFiltered = isSearching ? [...directMatches, ...bioMentions] : null;

  const groupByOrch = (arr) => Object.entries(
    arr.reduce((acc, p) => {
      if (!acc[p.orchestraId]) acc[p.orchestraId] = [];
      acc[p.orchestraId].push(p);
      return acc;
    }, {})
  ).map(([orchId, ps]) => ({ orchestra: ORCHESTRAS[orchId], players: ps }));

  const directGrouped = isSearching && directMatches.length ? groupByOrch(directMatches) : [];
  const mentionGrouped = isSearching && bioMentions.length ? groupByOrch(bioMentions) : [];

  const leadership = players.filter(p => !p.status && LEADERSHIP_ROLES.includes(p.role));
  const section = players.filter(p => !p.status && p.role === "Section Bass");
  const alumni = players.filter(p => p.status === "alumni");

  if (selectedPlayer) {
    const playerOrchestra = ORCHESTRAS[selectedPlayer.orchestraId];
    return (
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: isMobile ? "8px 14px" : "10px 24px", borderBottom: `1px solid ${S.border}`, background: S.cream, flexShrink: 0 }}>
          <div style={{ maxWidth: MAX_W, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={onClearSelected} style={{ background: "none", border: `1px solid ${S.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 12, color: S.textSecondary, fontFamily: "inherit", cursor: "pointer" }}>← Back</button>
            {playerOrchestra && (
              <>
                <span style={{ fontSize: 12, color: S.textMuted }}>/</span>
                <span style={{ fontSize: 12, color: S.textMuted, fontStyle: "italic" }}>{playerOrchestra.shortName} · {playerOrchestra.name}</span>
              </>
            )}
          </div>
        </div>
        <div ref={scrollRef} style={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden", padding: isMobile ? "16px 14px 48px" : "24px 24px 48px" }}>
          <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
            <PlayerDetail player={selectedPlayer} orchestra={playerOrchestra} onBack={onClearSelected} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: isMobile ? "8px 14px" : "10px 24px", borderBottom: `1px solid ${S.border}`, background: S.cream, flexShrink: 0 }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onGoHome} style={{ background: "none", border: `1px solid ${S.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 12, color: S.textSecondary, fontFamily: "inherit", cursor: "pointer" }}>← Orchestras</button>
          {orchestra && (
            <>
              <span style={{ fontSize: 12, color: S.textMuted }}>/</span>
              <span style={{ fontSize: 12, color: S.textMuted, fontStyle: "italic" }}>{orchestra.shortName} · {orchestra.name}</span>
            </>
          )}
        </div>
      </div>
      <div style={{ padding: isMobile ? "10px 12px 8px" : "12px 20px 10px", borderBottom: `1px solid ${S.border}`, flexShrink: 0 }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <input
          type="text"
          placeholder="Search for a bassist by name…"
          value={globalSearch}
          onChange={e => onGlobalSearchChange(e.target.value)}
          style={{ width: "100%", padding: "9px 13px", fontSize: 16, fontFamily: "inherit", background: S.cardBg, border: `1px solid ${isSearching ? S.gold : S.border}`, borderRadius: 10, color: S.textPrimary, outline: "none", transition: "border-color 0.15s" }}
        />
        {isSearching && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: S.textMuted, fontStyle: "italic" }}>
              {globalFiltered.length} bassist{globalFiltered.length !== 1 ? "s" : ""} found across all orchestras
            </span>
            <button onClick={() => onGlobalSearchChange("")} style={{ fontSize: 12, color: S.textSecondary, background: "none", border: `1px solid ${S.border}`, borderRadius: 20, padding: "2px 10px", fontFamily: "inherit", cursor: "pointer" }}>Clear</button>
          </div>
        )}
        </div>
      </div>

      {/* View toggle — Bassists / Historical Instruments */}
      <div style={{ padding: isMobile ? "8px 12px 4px" : "10px 20px 4px", borderBottom: `1px solid ${S.border}`, flexShrink: 0 }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", display: "flex", gap: 4 }}>
          {[{ key: "bassists", label: "Bassists" }, { key: "instruments", label: "Historical Instruments" }].map(sv => (
            <button key={sv.key} onClick={() => onSubViewChange(sv.key)}
              style={{ fontSize: 11, padding: "4px 14px", borderRadius: 20, fontFamily: "inherit", fontWeight: subView === sv.key ? 600 : 400, background: subView === sv.key ? "rgba(200,169,110,0.15)" : "transparent", color: subView === sv.key ? S.gold : S.textMuted, border: `1px solid ${subView === sv.key ? "rgba(200,169,110,0.55)" : S.border}`, transition: "all 0.15s", cursor: "pointer" }}>
              {sv.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden", padding: isMobile ? "12px 12px 24px" : "18px 20px 32px" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        {isSearching ? (
          globalFiltered.length === 0
            ? <div style={{ textAlign: "center", padding: "48px 0", color: S.textMuted, fontSize: 14 }}>No bassists match your search.</div>
            : <>
                {directGrouped.map(({ orchestra: orch, players: ps }) => (
                  <div key={orch.id} style={{ marginBottom: 28 }}>
                    <SectionLabel style={{ marginBottom: 14 }}>
                      {orch.name} <span style={{ fontWeight: 400, color: S.textMuted, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>· {ps.length} result{ps.length !== 1 ? "s" : ""}</span>
                    </SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {ps.map(p => <LeadershipCard key={p.id} player={p} onClick={onSelectPlayer} />)}
                    </div>
                  </div>
                ))}
                {mentionGrouped.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 1, background: S.border, marginBottom: 16 }} />
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: S.textMuted, marginBottom: 16 }}>Also mentioned in bios</div>
                    {mentionGrouped.map(({ orchestra: orch, players: ps }) => (
                      <div key={orch.id} style={{ marginBottom: 24, opacity: 0.75 }}>
                        <SectionLabel style={{ marginBottom: 12 }}>{orch.name}</SectionLabel>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {ps.map(p => <LeadershipCard key={p.id} player={p} onClick={onSelectPlayer} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
        ) : subView === "instruments" ? (
          <InstrumentsTab players={players} onGoToRoster={onSelectPlayer} isMobile={isMobile} />
        ) : (
          <>
            {leadership.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel>Leadership</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {leadership.map(p => <LeadershipCard key={p.id} player={p} onClick={onSelectPlayer} />)}
                </div>
              </div>
            )}

            {section.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel>Section members</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "160px" : "220px"}, 1fr))`, gap: 8 }}>
                  {section.map(p => <SectionMemberCard key={p.id} player={p} onClick={onSelectPlayer} />)}
                </div>
              </div>
            )}

            {alumni.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div style={{ height: 1, background: S.border, marginBottom: 20 }} />
                <SectionLabel>Distinguished Alumni</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {alumni.map(p => (
                    <div key={p.id} onClick={() => onSelectPlayer(p)}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = S.borderHover; e.currentTarget.style.background = "#F8F4EE"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.background = S.cardBg; }}
                      style={{ background: S.cardBg, border: `1px solid ${S.border}`, borderLeft: `4px solid ${p.color}50`, borderRadius: 14, padding: "16px 20px", cursor: "pointer", transition: "all 0.15s", opacity: 0.88 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                        <Avatar initials={p.initials} color={p.color} size={44} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: S.textPrimary, lineHeight: 1.1, marginBottom: 2 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: S.textSecondary }}>{p.role} · {p.since}–{p.retiredYear}</div>
                          {p.chair && <div style={{ fontSize: 11, color: "#8C6B3A", fontStyle: "italic", marginTop: 2 }}>{p.chair}</div>}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: S.textMuted }}>Retired</div>
                          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: S.textMuted }}>{p.retiredYear}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "#7A6A58", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 10 }}>{p.bio.split(". ")[0] + "."}</div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 12, color: p.color, fontWeight: 500 }}>View profile →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 28, padding: "13px 16px", background: S.surfaceAlt, borderRadius: 12, fontSize: 12, color: S.textSecondary, lineHeight: 1.6 }}>
              <strong style={{ color: "#5C4F42" }}>2025–26 season note:</strong> {orchestra.seasonNote}
            </div>

            {(() => {
              const currentYear = new Date().getFullYear();
              const active = players.filter(p => !p.status);
              const tenured = active.filter(p => p.since).sort((a, b) => a.since - b.since);
              const maxYears = tenured.length > 0 ? currentYear - tenured[0].since : 1;
              return tenured.length > 0 ? (
                <div style={{ marginTop: 24 }}>
                  <SectionLabel>Tenure at a glance</SectionLabel>
                  <div style={{ background: S.cardBg, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
                    {tenured.map((p, i) => {
                      const yrs = currentYear - p.since;
                      const pct = (yrs / maxYears) * 100;
                      return (
                        <div key={p.id} style={{ padding: "10px 16px", borderBottom: i < tenured.length - 1 ? `1px solid ${S.border}` : "none" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: S.textPrimary }}>{p.name}</span>
                            <span style={{ fontSize: 12, color: S.textMuted }}>{yrs} yr{yrs !== 1 ? "s" : ""} · since {p.since}</span>
                          </div>
                          <div style={{ height: 4, background: S.surfaceAlt, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 2 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null;
            })()}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

/* ── INSTRUMENTS TAB ── */
function InstrumentsTab({ players, onGoToRoster, isMobile }) {
  const playerMap = getPlayerMap(players);
  const instruments = getAllInstruments(players);
  const notable = instruments.filter(i => i.story);
  const known = instruments.filter(i => i.maker && !i.story);

  if (notable.length === 0 && known.length === 0) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: S.textMuted }}>
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>♩</div>
        <div style={{ fontSize: 15, marginBottom: 6, color: S.textSecondary }}>No historical instruments documented for this orchestra</div>
        <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>Bassists rarely publicize instrument provenance. Information is added as it becomes available.</div>
      </div>
    );
  }

  const InstBlock = ({ inst }) => (
    <div onClick={() => onGoToRoster(playerMap[inst.ownerId])}
      onMouseEnter={e => e.currentTarget.style.borderColor = S.borderHover}
      onMouseLeave={e => e.currentTarget.style.borderColor = S.border}
      style={{ background: S.cardBg, border: `1px solid ${S.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", marginBottom: 12, transition: "border-color 0.15s" }}>
      {inst.story && (
        <div style={{ background: S.dark, padding: "7px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: S.gold }}>Notable history</span>
          {inst.storyTitle && <span style={{ fontSize: 11, color: "#6B5D52" }}>· {inst.storyTitle}</span>}
        </div>
      )}
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: S.textPrimary, marginBottom: 3 }}>{inst.name}</div>
            {inst.maker && <div style={{ fontSize: 12, color: S.textSecondary, fontStyle: "italic" }}>{inst.maker}{inst.era ? ` · ${inst.era}` : ""}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Avatar initials={inst.ownerInitials} color={inst.ownerColor} size={30} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: S.textPrimary, whiteSpace: "nowrap" }}>{inst.owner}</div>
              <div style={{ fontSize: 11, color: S.textSecondary }}>{inst.ownerRole}</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#5C4F42", lineHeight: 1.65, borderLeft: `3px solid ${inst.story ? S.gold : S.border}`, paddingLeft: 12, marginBottom: 10 }}>{inst.detail}</div>
        <div style={{ fontSize: 12, color: inst.ownerColor, fontWeight: 500 }}>View {inst.owner.split(" ")[0]}'s full profile →</div>
      </div>
    </div>
  );

  return (
    <div style={{ overflowY: "auto", padding: isMobile ? "16px 12px 32px" : "24px 24px 40px" }}>
      {notable.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>Instruments with notable histories</SectionLabel>
          {notable.map((inst, i) => <InstBlock key={i} inst={inst} />)}
        </div>
      )}
      {known.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>Known instruments</SectionLabel>
          {known.map((inst, i) => <InstBlock key={i} inst={inst} />)}
        </div>
      )}
      <div style={{ padding: "13px 16px", background: S.surfaceAlt, borderRadius: 12, fontSize: 12, color: S.textSecondary, lineHeight: 1.7 }}>
        <strong style={{ color: "#5C4F42" }}>Data note:</strong> Orchestral musicians rarely publicize instrument provenance. Data sourced from orchestra press releases, musician websites, faculty profiles, and interviews as of the 2025–26 season.
      </div>
    </div>
  );
}

/* ── HOME ICON ── */
function HomeIcon({ size = 16, color = S.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
      <path d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* ── LANDING PAGE ── */
function LandingPage({ onSelectOrchestra, globalSearch, onGlobalSearchChange, onSelectPlayer, sortOrder, onSortChange, isMobile }) {
  const isSearching = globalSearch.trim() !== "";
  const searchTerm = globalSearch.toLowerCase();
  const [hoveredId, setHoveredId] = useState(null);

  const directMatches = isSearching
    ? ALL_PLAYERS_FLAT.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.role.toLowerCase().includes(searchTerm)
      )
    : null;

  const bioMentions = isSearching
    ? ALL_PLAYERS_FLAT.filter(p =>
        !directMatches.find(d => d.id === p.id) &&
        p.bio && p.bio.toLowerCase().includes(searchTerm)
      )
    : null;

  const globalFiltered = isSearching ? [...directMatches, ...bioMentions] : null;

  const groupByOrch = (arr) => Object.entries(
    arr.reduce((acc, p) => {
      if (!acc[p.orchestraId]) acc[p.orchestraId] = [];
      acc[p.orchestraId].push(p);
      return acc;
    }, {})
  ).map(([orchId, ps]) => ({ orchestra: ORCHESTRAS[orchId], players: ps }));

  const directGrouped = isSearching && directMatches.length ? groupByOrch(directMatches) : [];
  const mentionGrouped = isSearching && bioMentions.length ? groupByOrch(bioMentions) : [];

  const SORT_OPTIONS = [
    { key: "name", label: "Orchestra Name" },
    { key: "size", label: "Section Size" },
  ];

  const rawOrchList = Object.values(ORCHESTRAS);
  const orchList = [...rawOrchList].sort((a, b) => {
    if (sortOrder === "name")    return a.name.localeCompare(b.name);
    if (sortOrder === "city")    return a.city.localeCompare(b.city);
    if (sortOrder === "size")    return (ALL_PLAYERS[b.id]?.length ?? 0) - (ALL_PLAYERS[a.id]?.length ?? 0);
    return a.founded - b.founded; // default: founded
  });

  const orchCount = orchList.length;
  const animDelays = Array.from({ length: orchCount }, (_, i) =>
    `.idx-row:nth-child(${i + 1}) { animation-delay: ${(0.04 + i * 0.06).toFixed(2)}s; }`
  ).join("\n        ");

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .idx-row { animation: slideIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        ${animDelays}
        .idx-name  { transition: color 0.2s ease, letter-spacing 0.3s ease; }
        .idx-row:hover .idx-name { letter-spacing: 0.01em; }
        .idx-bottom { transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1), max-height 0.25s ease; }
        .idx-row:not(:hover) .idx-bottom { opacity: 0; transform: translateY(-6px); pointer-events: none; max-height: 0; overflow: hidden; padding-top: 0 !important; padding-bottom: 0 !important; }
        .idx-row:hover .idx-bottom { opacity: 1; transform: translateY(0); max-height: 120px; }
        @media (hover: none) {
          .idx-row:not(:hover) .idx-bottom { opacity: 1; transform: none; pointer-events: auto; max-height: 200px; padding-top: 8px !important; }
        }
        .idx-arrow { transition: opacity 0.2s ease, transform 0.2s ease; }
        .idx-number { transition: color 0.2s ease; }
        .idx-bar { transition: height 0.28s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      {/* Search bar */}
      <div style={{ padding: isMobile ? "10px 12px 8px" : "14px 20px 12px", background: S.cream, borderBottom: `1px solid ${S.border}`, flexShrink: 0 }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <div style={{ position: "relative" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }}>
              <circle cx="8.5" cy="8.5" r="5.5" stroke={S.textPrimary} strokeWidth="1.6"/>
              <path d="M13 13l3.5 3.5" stroke={S.textPrimary} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search for a bassist by name…"
              value={globalSearch}
              onChange={e => onGlobalSearchChange(e.target.value)}
              style={{ width: "100%", padding: "10px 13px 10px 34px", fontSize: 16, fontFamily: "inherit", background: S.cardBg, border: `1.5px solid ${isSearching ? S.gold : S.borderHover}`, borderRadius: 10, color: S.textPrimary, outline: "none", boxShadow: "0 2px 10px rgba(26,20,16,0.08)" }}
            />
          </div>
          {isSearching && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 12, color: S.textMuted, fontStyle: "italic" }}>
                {globalFiltered.length} bassist{globalFiltered.length !== 1 ? "s" : ""} found
              </span>
              <button onClick={() => onGlobalSearchChange("")} style={{ fontSize: 12, color: S.textSecondary, background: "none", border: `1px solid ${S.border}`, borderRadius: 20, padding: "2px 10px", fontFamily: "inherit", cursor: "pointer" }}>Clear</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden" }}>
        {isSearching ? (
          <div style={{ padding: isMobile ? "12px 12px 24px" : "18px 20px 32px" }}>
          <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
            {globalFiltered.length === 0
              ? <div style={{ textAlign: "center", padding: "48px 0", color: S.textMuted, fontSize: 14 }}>No bassists match your search.</div>
              : <>
                  {directGrouped.map(({ orchestra: orch, players: ps }) => (
                    <div key={orch.id} style={{ marginBottom: 28 }}>
                      <SectionLabel style={{ marginBottom: 14 }}>
                        {orch.name} <span style={{ fontWeight: 400, color: S.textMuted, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>· {ps.length} result{ps.length !== 1 ? "s" : ""}</span>
                      </SectionLabel>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {ps.map(p => <LeadershipCard key={p.id} player={p} onClick={onSelectPlayer} />)}
                      </div>
                    </div>
                  ))}
                  {mentionGrouped.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 1, background: S.border, marginBottom: 16 }} />
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: S.textMuted, marginBottom: 16 }}>Also mentioned in bios</div>
                      {mentionGrouped.map(({ orchestra: orch, players: ps }) => (
                        <div key={orch.id} style={{ marginBottom: 24, opacity: 0.75 }}>
                          <SectionLabel style={{ marginBottom: 12 }}>{orch.name}</SectionLabel>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {ps.map(p => <LeadershipCard key={p.id} player={p} onClick={onSelectPlayer} />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
            }
          </div>
          </div>
        ) : (
          <div style={{ padding: "0 0 48px" }}>

            {/* ── SORT CONTROL ── */}
            <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
            <div style={{ padding: isMobile ? "10px 20px 4px" : "10px 36px 4px", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: S.textMuted, marginRight: 4 }}>Sort by</span>
              {SORT_OPTIONS.map(o => (
                <button key={o.key} onClick={() => onSortChange(o.key)}
                  style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontFamily: "inherit", background: sortOrder === o.key ? S.accent : "transparent", color: sortOrder === o.key ? "#7A5C1E" : S.textSecondary, border: `1px solid ${sortOrder === o.key ? S.accentBorder : S.border}`, cursor: "pointer", fontWeight: sortOrder === o.key ? 600 : 400, transition: "all 0.15s", whiteSpace: "nowrap" }}>
                  {o.label}
                </button>
              ))}
            </div>
            </div>

            {/* ── TYPOGRAPHIC INDEX ── */}
            <div style={{ padding: "4px 0 0" }}>
              {orchList.map((orch, idx) => {
                const players = ALL_PLAYERS[orch.id];
                const principal = players.find(p => p.role === "Principal Bass");
                const isHovered = hoveredId === orch.id;
                const playerCount = players.length;

                return (
                  <div key={orch.id} className="idx-row"
                    onClick={() => onSelectOrchestra(orch.id)}
                    onMouseEnter={() => setHoveredId(orch.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      cursor: "pointer",
                      borderBottom: `1px solid ${isHovered ? S.accentBorder : S.border}`,
                      background: isHovered ? S.accent : "transparent",
                      transition: "background 0.2s ease, border-color 0.2s ease",
                    }}>
                  <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: isMobile ? "14px 20px" : "20px 36px 20px" }}>

                    {/* ROW 1 — orchestra name · arrow */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                      <div className="idx-name" style={{
                        flex: 1,
                        fontFamily: SERIF, fontSize: isMobile ? 22 : 34, fontWeight: 700,
                        lineHeight: 1.15, letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: S.textPrimary,
                        textAlign: "left",
                        wordBreak: "break-word",
                      }}>
                        {orch.name}
                      </div>

                      <div style={{ flexShrink: 0, paddingLeft: 10, paddingTop: 4 }}>
                        <svg className="idx-arrow" width="16" height="16" viewBox="0 0 20 20" fill="none"
                          style={{ opacity: isHovered ? 1 : 0.45, transform: isHovered ? "translateX(3px)" : "none", display: "block" }}>
                          <path d="M7 5l5 5-5 5" stroke={S.textPrimary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* ROW 2 — slides in on hover: single meta strip */}
                    <div className="idx-bottom" style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "4px 10px",
                      paddingTop: 8,
                    }}>
                      <span style={{ fontFamily: SERIF, fontSize: 16, color: S.textPrimary }}>Est. {orch.founded}</span>
                      <span style={{ color: S.borderHover, fontSize: 13 }}>·</span>
                      <span style={{ fontFamily: SERIF, fontSize: 16, color: S.textPrimary }}>{playerCount} bassists</span>
                      {principal && (
                        <>
                          <span style={{ color: S.borderHover, fontSize: 13 }}>·</span>
                          <span style={{ fontFamily: SERIF, fontSize: 16, color: S.textPrimary }}>
                            {principal.name}
                            <span style={{ fontSize: 15, color: S.textPrimary }}>, Principal Bass</span>
                            {principal.since && <span style={{ fontSize: 15, color: S.textPrimary }}> · since {principal.since}</span>}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  </div>
                );
              })}
            </div>

            {/* ── FOOTER ── */}
            <div style={{ padding: "20px 24px", borderTop: `1px solid ${S.border}` }}>
              <div style={{ maxWidth: MAX_W, margin: "0 auto", fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: S.textMuted, textAlign: "center" }}>
                Data reviewed weekly from orchestra press materials, musician profiles, and season rosters
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function App() {
  const [view, setView] = useState("landing");
  const [orchestraId, setOrchestraid] = useState("sfs");
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sortOrder, setSortOrder] = useState("name");
  const [subView, setSubView] = useState("bassists");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const orchestra = ORCHESTRAS[orchestraId];
  const players = ALL_PLAYERS[orchestraId];

  const handleSelectOrchestra = (id) => {
    setOrchestraid(id);
    setGlobalSearch("");
    setSelectedPlayer(null);
    setSubView("bassists");
    setView("orchestra");
  };

  const handleGoHome = () => {
    setView("landing");
    setGlobalSearch("");
    setSelectedPlayer(null);
  };

  const handleSelectPlayer = (player) => {
    setOrchestraid(player.orchestraId);
    setSelectedPlayer(player);
    setGlobalSearch("");
    setView("orchestra");
  };

  const superLabel = selectedPlayer
    ? `${ORCHESTRAS[selectedPlayer.orchestraId].shortName} · ${ORCHESTRAS[selectedPlayer.orchestraId].name}`
    : "Catalog of Professional Symphony Bassists";

  const headerTitle = selectedPlayer ? selectedPlayer.name : orchestra.name;
  const headerSub = selectedPlayer
    ? selectedPlayer.role + (selectedPlayer.since ? ` · since ${selectedPlayer.since}` : "")
    : `${orchestra.venue} · Est. ${orchestra.founded} · ${players.length} bassists`;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", height: "100%", background: S.cream, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 2px; }
        button { cursor: pointer; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: S.dark, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 40%, rgba(200,169,110,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ padding: isMobile ? "8px 12px 0" : "14px 20px 0", position: "relative" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isMobile ? 8 : 12, flexWrap: "nowrap", minWidth: 0 }}>

            {/* Home button */}
            <button onClick={handleGoHome}
              style={{ display: "flex", alignItems: "center", gap: 5, background: view === "landing" ? "transparent" : "rgba(200,169,110,0.15)", border: `1px solid ${view === "landing" ? "rgba(200,169,110,0.25)" : "rgba(200,169,110,0.55)"}`, borderRadius: 20, padding: "4px 12px 4px 8px", fontSize: 11, fontFamily: "inherit", fontWeight: 500, color: view === "landing" ? "#7A6A58" : S.gold, cursor: view === "landing" ? "default" : "pointer", flexShrink: 0, transition: "all 0.15s" }}>
              <HomeIcon size={13} color={view === "landing" ? "#7A6A58" : "#F0C97A"} />
              Home
            </button>

            {/* Pipe */}
            <div style={{ width: 1.5, height: 18, background: "rgba(200,169,110,0.4)", flexShrink: 0 }} />

            <span style={{ fontSize: isMobile ? 10 : 11, fontWeight: 500, color: S.gold, letterSpacing: "0.04em" }}>The people beneath the sound</span>
          </div>

          {view === "landing" ? (
            <>
              <h1 style={{ fontFamily: SERIF, fontSize: isMobile ? 30 : 44, fontWeight: 700, color: "#F0E8DC", lineHeight: 1.1, marginBottom: isMobile ? 8 : 12 }}>
                The Bass Section: {Object.keys(ORCHESTRAS).length} American Orchestras
              </h1>
            </>
          ) : (
            <>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9A8878", marginBottom: 4 }}>{superLabel}</div>
              <h1 style={{ fontFamily: SERIF, fontSize: isMobile ? 28 : 40, fontWeight: 700, color: "#F0E8DC", lineHeight: 1.1, marginBottom: 6 }}>{headerTitle}</h1>
              <div style={{ fontSize: 13, color: "#9A8878", marginBottom: isMobile ? 8 : 12 }}>{headerSub}</div>
            </>
          )}
        </div>
        </div>

      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {view === "landing" && (
          <LandingPage
            onSelectOrchestra={handleSelectOrchestra}
            globalSearch={globalSearch}
            onGlobalSearchChange={setGlobalSearch}
            onSelectPlayer={handleSelectPlayer}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            isMobile={isMobile}
          />
        )}
        {view === "orchestra" && (
          <BassistsTab
            players={players}
            orchestra={orchestra}
            globalSearch={globalSearch}
            onGlobalSearchChange={setGlobalSearch}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={handleSelectPlayer}
            onClearSelected={() => setSelectedPlayer(null)}
            subView={subView}
            onSubViewChange={setSubView}
            isMobile={isMobile}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </div>
  );
}
