import { useState, useRef, useEffect, useCallback } from "react";

/* ── FONTS ── */
const GFONTS = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;700;900&family=VT323&family=Rajdhani:wght@400;600;700&display=swap";

/* ── CSS ── */
const CSS = `
@import url('${GFONTS}');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#020805;--s0:#040c07;--s1:#061009;--s2:#0b1a0e;--s3:#112214;
  --g1:#00ff41;--g2:#00d435;--g3:#009922;--g4:#005514;--g5:#00ff9933;
  --r1:#ff3355;--r2:#ff000033;--y1:#ffcc00;--y2:#ff880080;
  --dim:#2a5c34;--dimmer:#142010;--text:#c8ffda;--muted:#4a9e5c;--ghost:#1e3d22;
  --border:rgba(0,255,65,0.12);--border2:rgba(0,255,65,0.28);--border3:rgba(0,255,65,0.5);
  --glow:0 0 18px rgba(0,255,65,0.18);--glow2:0 0 35px rgba(0,255,65,0.28);
  --rglow:0 0 18px rgba(255,51,85,0.25);
  --orb:'Orbitron',monospace;--mono:'Share Tech Mono',monospace;
  --vt:'VT323',monospace;--raj:'Rajdhani',sans-serif;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--mono);min-height:100vh;
  overflow-x:hidden;cursor:crosshair}
/* scanlines */
body::before{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)}
body::after{content:'';position:fixed;inset:0;z-index:9998;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.6) 100%)}
#mx{position:fixed;inset:0;z-index:0;opacity:0.055;pointer-events:none}
.wrap{position:relative;z-index:10;width:100%;max-width:100%;padding:0 clamp(12px,3vw,48px) 60px}

/* ── HEADER ── */
.hdr{padding:22px 0 14px;border-bottom:1px solid var(--border);margin-bottom:20px;
  display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:10px}
.hdr-l{}
.logo{font-family:var(--orb);font-size:clamp(16px,3.5vw,28px);font-weight:900;
  letter-spacing:2px;background:linear-gradient(90deg,var(--g1) 0%,var(--g2) 60%,#00ffaa 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:lp 5s ease-in-out infinite}
@keyframes lp{0%,100%{filter:brightness(1)}50%{filter:brightness(1.35) drop-shadow(0 0 8px #00ff41)}}
.logo-sub{font-family:var(--vt);font-size:15px;color:var(--muted);letter-spacing:4px;margin-top:2px}
.hdr-r{display:flex;flex-direction:column;align-items:flex-end;gap:5px}
.online{display:flex;align-items:center;gap:6px;font-size:9px;letter-spacing:2px;color:var(--muted)}
.dot{width:6px;height:6px;border-radius:50%;background:var(--g1);box-shadow:0 0 8px var(--g1);animation:blink 1.4s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}
.ver-line{font-size:8px;color:var(--dim);letter-spacing:2px}
.ver-line em{color:var(--g1);font-style:normal}

/* ── STATS STRIP ── */
.stats{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--border);margin-bottom:18px}
.st{padding:10px 6px;text-align:center;border-right:1px solid var(--border);transition:background 0.2s}
.st:last-child{border-right:none}.st:hover{background:rgba(0,255,65,0.03)}
.sv{font-family:var(--orb);font-size:17px;color:var(--g1);line-height:1;
  text-shadow:0 0 8px rgba(0,255,65,0.35)}
.sl{font-size:7px;letter-spacing:2px;color:var(--dim);text-transform:uppercase;margin-top:2px}

/* ── TABS ── */
.tabs{display:flex;border:1px solid var(--border);margin-bottom:18px;overflow:hidden}
.tab{flex:1;padding:11px 4px;border:none;background:transparent;
  font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--dim);cursor:pointer;transition:all 0.2s;border-right:1px solid var(--border);
  position:relative}
.tab:last-child{border-right:none}
.tab::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;
  background:var(--g1);transform:scaleX(0);transition:transform 0.3s}
.tab.on{background:var(--s2);color:var(--g1)}
.tab.on::after{transform:scaleX(1)}
.tab:hover:not(.on){background:rgba(0,255,65,0.03);color:var(--text)}

/* ── PANEL ── */
.pnl{background:var(--s1);border:1px solid var(--border);margin-bottom:12px;
  position:relative;overflow:hidden}
.pnl::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--g1),transparent);opacity:0.4}
.phd{padding:8px 14px;border-bottom:1px solid var(--border);background:var(--s2);
  display:flex;align-items:center;justify-content:space-between;gap:8px}
.pt{font-family:var(--orb);font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--g2)}
.pb{font-size:7px;letter-spacing:2px;padding:2px 8px;border:1px solid var(--border);color:var(--muted)}
.pbd{padding:14px}

/* ── UPLOAD ── */
.ulbl{display:block;cursor:pointer;position:relative}
.ulbl input[type=file]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:5}
.dz{border:1px dashed var(--border2);background:var(--s2);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-height:140px;transition:all 0.25s;position:relative;overflow:hidden;pointer-events:none}
.ulbl:hover .dz,.dz.drag{border-color:var(--g1);background:rgba(0,255,65,0.035);
  box-shadow:inset 0 0 25px rgba(0,255,65,0.04)}
.dz-corner{position:absolute;width:14px;height:14px;border-color:var(--g1);border-style:solid;opacity:0.5}
.dz-corner.tl{top:8px;left:8px;border-width:1px 0 0 1px}
.dz-corner.tr{top:8px;right:8px;border-width:1px 1px 0 0}
.dz-corner.bl{bottom:8px;left:8px;border-width:0 0 1px 1px}
.dz-corner.br{bottom:8px;right:8px;border-width:0 1px 1px 0}
.dz-ic{font-size:30px;margin-bottom:8px;opacity:0.45;transition:all 0.3s}
.ulbl:hover .dz-ic{opacity:0.85;transform:scale(1.07)}
.dz-main{font-size:11px;color:var(--muted);letter-spacing:2px;margin-bottom:3px;text-transform:uppercase}
.dz-sub{font-size:8px;color:var(--dim);letter-spacing:1px}
.dz-badge{position:absolute;bottom:8px;right:8px;font-size:7px;letter-spacing:2px;
  padding:2px 8px;border:1px solid var(--border2);color:var(--g3);background:rgba(2,8,5,0.85)}

/* PREVIEW */
.prev{position:relative;background:var(--s2);min-height:110px;
  display:flex;align-items:center;justify-content:center;overflow:hidden}
.prev img{max-width:100%;max-height:200px;object-fit:contain;display:block}
.prev-tags{position:absolute;top:7px;left:7px;display:flex;gap:4px;flex-wrap:wrap}
.ptag{font-size:7px;letter-spacing:2px;padding:2px 7px;
  background:rgba(2,8,5,0.9);border:1px solid var(--border2);color:var(--g1)}
.prev-clr{position:absolute;top:7px;right:7px;padding:3px 9px;
  background:rgba(255,0,50,0.1);border:1px solid rgba(255,0,50,0.28);
  font-size:8px;color:var(--r1);cursor:pointer;letter-spacing:1px;transition:all 0.2s;z-index:10}
.prev-clr:hover{background:rgba(255,0,50,0.22)}

/* CAPACITY */
.cap{display:flex;align-items:center;gap:8px;padding:8px 12px;
  background:var(--s2);border-top:1px solid var(--border);font-size:8px;letter-spacing:1px}
.cap-l{color:var(--dim);min-width:72px}
.cap-tr{flex:1;height:3px;background:var(--dimmer);overflow:hidden;position:relative}
.cap-fill{height:100%;background:linear-gradient(90deg,var(--g4),var(--g1));transition:width 0.35s}
.cap.warn .cap-fill{background:linear-gradient(90deg,#ff8800,#ffcc00)}
.cap.over .cap-fill{background:linear-gradient(90deg,var(--r1),#ff0000)}
.cap-v{color:var(--muted);min-width:90px;text-align:right}

/* INPUTS */
.fg{margin-bottom:11px}
.fl{display:block;font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.fl em{color:var(--g1);font-style:normal;margin-right:3px}
.fta{width:100%;background:var(--s2);border:1px solid var(--border);
  color:var(--text);font-family:var(--mono);font-size:12px;line-height:1.7;
  padding:10px 12px;outline:none;resize:vertical;min-height:80px;transition:all 0.2s}
.fta:focus{border-color:var(--g1);box-shadow:0 0 0 1px rgba(0,255,65,0.08)}
.fta::placeholder{color:var(--dim);font-style:italic}
.fi{width:100%;background:var(--s2);border:1px solid var(--border);
  color:var(--text);font-family:var(--mono);font-size:12px;
  padding:8px 12px;outline:none;transition:all 0.2s;letter-spacing:1px}
.fi:focus{border-color:var(--g1);box-shadow:0 0 0 1px rgba(0,255,65,0.08)}
.fi::placeholder{color:var(--dim)}
.fm{font-size:7px;color:var(--dim);letter-spacing:1px;margin-top:3px;display:flex;justify-content:space-between}

/* ── ADVANCED OPTIONS GRID ── */
.adv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;margin-bottom:11px}
.adv-sec{background:var(--s2);border:1px solid var(--border);padding:11px}
.adv-title{font-size:7px;letter-spacing:3px;text-transform:uppercase;color:var(--dim);margin-bottom:9px}
/* channel selector */
.ch-row{display:flex;gap:5px}
.ch-btn{flex:1;padding:5px 4px;border:1px solid var(--border);background:transparent;
  font-family:var(--mono);font-size:9px;letter-spacing:1px;color:var(--dim);
  cursor:pointer;transition:all 0.2s;text-align:center}
.ch-btn.on-R{border-color:#ff4455;color:#ff4455;background:rgba(255,68,85,0.08)}
.ch-btn.on-G{border-color:var(--g1);color:var(--g1);background:rgba(0,255,65,0.06)}
.ch-btn.on-B{border-color:#4488ff;color:#4488ff;background:rgba(68,136,255,0.08)}
.ch-btn.on-A{border-color:#aa66ff;color:#aa66ff;background:rgba(170,102,255,0.08)}
/* LSB depth slider */
.depth-row{display:flex;align-items:center;gap:8px}
.depth-slider{flex:1;-webkit-appearance:none;height:3px;background:var(--dimmer);outline:none;cursor:pointer}
.depth-slider::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;
  border-radius:2px;background:var(--g1);box-shadow:0 0 6px var(--g1);cursor:pointer}
.depth-val{font-family:var(--orb);font-size:14px;color:var(--g1);min-width:20px;text-align:center;
  text-shadow:0 0 8px rgba(0,255,65,0.4)}
.depth-lbl{font-size:8px;color:var(--dim);letter-spacing:1px;margin-top:4px}
/* scatter method */
.sc-row{display:flex;flex-direction:column;gap:4px}
.sc-opt{display:flex;align-items:center;gap:6px;padding:4px 7px;border:1px solid var(--border);
  cursor:pointer;transition:all 0.2s;font-size:8px;letter-spacing:1px;color:var(--dim)}
.sc-opt.on{border-color:var(--border2);color:var(--g1);background:rgba(0,255,65,0.04)}
.sc-dot{width:5px;height:5px;border-radius:50%;border:1px solid currentColor;flex-shrink:0}
.sc-opt.on .sc-dot{background:var(--g1);box-shadow:0 0 4px var(--g1)}
/* toggle */
.tog{display:flex;align-items:center;gap:8px;padding:8px 11px;
  background:var(--s2);border:1px solid var(--border);margin-bottom:10px;
  cursor:pointer;transition:all 0.2s;user-select:none}
.tog:hover{border-color:var(--border2)}
.tsw{width:30px;height:16px;background:var(--dimmer);border-radius:8px;position:relative;transition:background 0.3s;flex-shrink:0}
.tsw::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;
  border-radius:50%;background:var(--dim);transition:all 0.3s}
.tsw.on{background:rgba(0,255,65,0.15)}
.tsw.on::after{left:16px;background:var(--g1);box-shadow:0 0 5px var(--g1)}
.tl{font-size:10px;letter-spacing:2px;color:var(--muted);flex:1;text-transform:uppercase}
.tl.on{color:var(--text)}.tt{font-size:7px;letter-spacing:1px;color:var(--dim)}

/* ── EXECUTE ── */
.ebtn{width:100%;padding:13px;border:1px solid var(--g1);background:transparent;
  color:var(--g1);font-family:var(--orb);font-size:11px;font-weight:700;
  letter-spacing:4px;text-transform:uppercase;cursor:pointer;position:relative;
  overflow:hidden;transition:all 0.3s;box-shadow:var(--glow);margin-bottom:0}
.ebtn::before{content:'';position:absolute;inset:0;
  background:linear-gradient(120deg,rgba(0,255,65,0.1),transparent);
  transform:translateX(-100%);transition:transform 0.4s}
.ebtn:hover:not(:disabled)::before{transform:translateX(0)}
.ebtn:hover:not(:disabled){background:rgba(0,255,65,0.07);
  box-shadow:var(--glow2);text-shadow:0 0 8px var(--g1)}
.ebtn:disabled{opacity:0.28;cursor:not-allowed;box-shadow:none;border-color:var(--dimmer)}

/* ── PROGRESS ── */
.prog-wrap{margin-top:10px;background:var(--s1);border:1px solid var(--border);padding:12px}
.prog-bar-track{height:3px;background:var(--dimmer);overflow:hidden;margin-bottom:8px}
.prog-bar-fill{height:100%;background:linear-gradient(90deg,var(--g4),var(--g1));
  transition:width 0.15s linear}
.prog-steps{display:flex;gap:0;overflow:hidden}
.ps{flex:1;padding:4px 2px;text-align:center;font-size:7px;letter-spacing:1px;
  color:var(--dim);border-right:1px solid var(--border);transition:all 0.3s;text-transform:uppercase}
.ps:last-child{border-right:none}
.ps.done{color:var(--g1);background:rgba(0,255,65,0.05)}
.ps.active{color:var(--g1);background:rgba(0,255,65,0.1);animation:psflash 0.8s ease-in-out infinite}
@keyframes psflash{0%,100%{opacity:1}50%{opacity:0.5}}

/* ── LOG ── */
.log{background:var(--bg);border:1px solid var(--border);padding:10px;
  font-size:9px;line-height:1.9;margin-top:10px;max-height:150px;overflow-y:auto}
.ll{display:flex;gap:7px;animation:lin 0.12s ease}
@keyframes lin{from{opacity:0;transform:translateX(-2px)}to{opacity:1;transform:none}}
.lt{color:var(--dim);flex-shrink:0;font-size:8px;min-width:60px}
.lp{color:var(--g1);flex-shrink:0;font-size:8px;min-width:65px}
.lm.ok{color:var(--text)}.lm.warn{color:var(--y1)}.lm.err{color:var(--r1)}.lm.info{color:var(--muted)}

/* ── RESULT ── */
.res{border:1px solid var(--g1);background:var(--s1);padding:14px;margin-top:10px;
  box-shadow:var(--glow);animation:ri 0.4s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden}
@keyframes ri{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.res::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--g1),transparent)}
.res-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;flex-wrap:wrap;gap:6px}
.res-t{font-family:var(--orb);font-size:9px;letter-spacing:3px;color:var(--g1);text-transform:uppercase}
.res-tags{display:flex;gap:5px;flex-wrap:wrap}
.res-tag{font-size:7px;letter-spacing:2px;padding:2px 7px;border:1px solid var(--border2);color:var(--muted)}

/* ── CMP ── */
.cmp{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
@media(max-width:600px){.cmp{grid-template-columns:1fr}}
.cbox{background:var(--s2);border:1px solid var(--border);overflow:hidden}
.cbox-hd{padding:5px 9px;background:var(--s2);border-bottom:1px solid var(--border);
  font-size:7px;letter-spacing:3px;color:var(--dim);text-transform:uppercase;
  display:flex;align-items:center;justify-content:space-between}
.cbox-hd em{color:var(--g1);font-style:normal}
.cbox img,.cbox canvas{width:100%;display:block;object-fit:contain;max-height:160px}

/* ── DOWNLOAD BTN ── */
.dl-a{display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:11px;margin-top:8px;
  border:1px solid var(--border2);background:rgba(0,255,65,0.04);
  font-family:var(--mono);font-size:9px;letter-spacing:3px;
  text-transform:uppercase;color:var(--g2);cursor:pointer;
  text-decoration:none;transition:all 0.3s;box-sizing:border-box}
.dl-a:hover{border-color:var(--g1);color:var(--g1);background:rgba(0,255,65,0.08);box-shadow:var(--glow)}
.dl-fb{display:flex;align-items:center;justify-content:center;gap:6px;
  width:100%;padding:7px;margin-top:5px;
  border:1px solid var(--dimmer);background:transparent;
  font-family:var(--mono);font-size:8px;letter-spacing:2px;
  color:var(--dim);cursor:pointer;transition:all 0.2s}
.dl-fb:hover{border-color:var(--border);color:var(--muted)}

/* ── STEGANALYSIS ── */
.sa-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.sa-card{background:var(--s2);border:1px solid var(--border);padding:11px}
.sa-title{font-size:7px;letter-spacing:3px;text-transform:uppercase;color:var(--g3);margin-bottom:8px}
.sa-meter{height:3px;background:var(--dimmer);overflow:hidden;margin-bottom:4px}
.sa-fill{height:100%;transition:width 0.6s;border-radius:0}
.sa-fill.green{background:linear-gradient(90deg,var(--g4),var(--g1))}
.sa-fill.yellow{background:linear-gradient(90deg,#ff8800,var(--y1))}
.sa-fill.red{background:linear-gradient(90deg,#aa0000,var(--r1))}
.sa-label{font-size:8px;color:var(--muted);letter-spacing:1px;display:flex;justify-content:space-between}
.sa-label em{font-style:normal;color:var(--g1)}
.sa-verdict{display:flex;align-items:center;gap:8px;margin-top:8px;padding:8px;
  border:1px solid var(--border);font-size:9px;letter-spacing:2px}
.sa-v-clean{border-color:rgba(0,255,65,0.3);color:var(--g1);background:rgba(0,255,65,0.04)}
.sa-v-suspicious{border-color:rgba(255,204,0,0.3);color:var(--y1);background:rgba(255,204,0,0.04)}
.sa-v-detected{border-color:rgba(255,51,85,0.3);color:var(--r1);background:rgba(255,51,85,0.04)}

/* ── PIXEL INSPECTOR ── */
.px-wrap{margin-top:10px}
.px-canvas-row{display:flex;gap:8px}
.px-cv{border:1px solid var(--border);cursor:crosshair;image-rendering:pixelated;display:block}
.px-info{flex:1;background:var(--s2);border:1px solid var(--border);padding:10px;font-size:9px}
.px-info-title{font-size:7px;letter-spacing:3px;color:var(--g3);text-transform:uppercase;margin-bottom:8px}
.px-channels{display:flex;flex-direction:column;gap:5px}
.px-ch{display:flex;align-items:center;gap:7px}
.px-ch-lbl{width:14px;font-size:8px;font-weight:600}
.px-ch-bar{flex:1;height:5px;overflow:hidden;background:var(--dimmer)}
.px-ch-fill{height:100%;transition:width 0.2s}
.px-ch-R .px-ch-fill{background:#ff4455}
.px-ch-G .px-ch-fill{background:var(--g1)}
.px-ch-B .px-ch-fill{background:#4488ff}
.px-ch-val{font-family:var(--orb);font-size:10px;min-width:28px;text-align:right}
.px-ch-bin{font-size:8px;color:var(--dim);letter-spacing:1px;margin-left:2px}
.px-ch-bit{color:var(--r1);font-weight:700}
.px-coord{font-size:8px;color:var(--dim);letter-spacing:1px;margin-top:8px}
.px-coord em{color:var(--g1);font-style:normal}
.px-hint{font-size:7px;color:var(--dim);margin-top:6px;letter-spacing:1px}

/* ── HISTORY ── */
.hist-list{display:flex;flex-direction:column;gap:6px}
.hist-item{display:flex;align-items:center;gap:10px;padding:9px 11px;
  background:var(--s2);border:1px solid var(--border);cursor:pointer;transition:all 0.2s}
.hist-item:hover{border-color:var(--border2);background:rgba(0,255,65,0.03)}
.hist-thumb{width:40px;height:30px;object-fit:cover;border:1px solid var(--border);flex-shrink:0}
.hist-info{flex:1;min-width:0}
.hist-name{font-size:9px;color:var(--text);letter-spacing:1px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hist-meta{font-size:7px;color:var(--dim);letter-spacing:1px;margin-top:2px}
.hist-badge{font-size:7px;letter-spacing:1px;padding:2px 6px;border:1px solid;flex-shrink:0}
.hist-badge.enc{border-color:rgba(0,255,65,0.3);color:var(--g2)}
.hist-badge.dec{border-color:rgba(68,136,255,0.3);color:#4488ff}
.hist-dl{padding:4px 8px;border:1px solid var(--border);background:transparent;
  font-family:var(--mono);font-size:7px;letter-spacing:1px;color:var(--dim);
  cursor:pointer;transition:all 0.2s;text-decoration:none}
.hist-dl:hover{border-color:var(--g1);color:var(--g1)}
.empty-hist{text-align:center;padding:24px;color:var(--dim);font-size:10px;letter-spacing:2px;
  border:1px dashed var(--border)}

/* ── DECODED MSG ── */
.mout{background:var(--bg);border:1px solid var(--border);padding:11px 13px;
  font-size:12px;line-height:1.75;color:var(--g1);word-break:break-word;
  white-space:pre-wrap;min-height:45px;position:relative}
.mout::before{content:'> ';color:var(--g3)}
.cpybtn{position:absolute;top:6px;right:6px;padding:3px 8px;
  background:transparent;border:1px solid var(--border2);
  font-family:var(--mono);font-size:7px;letter-spacing:2px;
  color:var(--muted);cursor:pointer;transition:all 0.2s}
.cpybtn:hover{border-color:var(--g1);color:var(--g1)}
.cpybtn.ok{border-color:var(--g1);color:var(--g1);background:rgba(0,255,65,0.06)}

/* MSG ANALYSIS */
.msg-analysis{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:8px}
.ma-card{background:var(--s2);border:1px solid var(--border);padding:9px;text-align:center}
.ma-val{font-family:var(--orb);font-size:16px;color:var(--g1);line-height:1}
.ma-lbl{font-size:7px;letter-spacing:2px;color:var(--dim);margin-top:2px;text-transform:uppercase}

/* ── ERR ── */
.errb{background:rgba(255,0,50,0.04);border:1px solid rgba(255,0,50,0.22);
  padding:9px 12px;margin-top:8px;font-size:9px;color:var(--r1);
  letter-spacing:1px;line-height:1.7;display:flex;gap:7px}

/* ── INFO ── */
.info-hero{background:var(--s1);border:1px solid var(--border);padding:14px;margin-bottom:12px}
.info-hero p{font-size:11px;color:var(--muted);line-height:1.85}
.info-hero p+p{margin-top:8px}
.igrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(max-width:500px){.igrid{grid-template-columns:1fr}}
.icard{background:var(--s1);border:1px solid var(--border);padding:13px}
.ict{font-family:var(--orb);font-size:8px;letter-spacing:3px;color:var(--g2);
  margin-bottom:7px;text-transform:uppercase}
.ict::before{content:'[ '}.ict::after{content:' ]'}
.icb{font-size:10px;color:var(--muted);line-height:1.85}
.icb code{color:var(--g1)}
.algo-visual{background:var(--bg);border:1px solid var(--border);
  padding:12px;font-size:10px;color:var(--muted);line-height:2;margin-top:10px;font-family:var(--mono)}
.av-row{display:flex;gap:4px;align-items:center;margin-bottom:4px}
.av-byte{display:flex;gap:1px}
.av-bit{width:14px;height:20px;display:flex;align-items:center;justify-content:center;
  font-size:9px;border:1px solid var(--border);transition:all 0.3s}
.av-bit.payload{color:var(--g1);background:rgba(0,255,65,0.12);border-color:var(--border2);
  animation:bitglow 1.5s ease-in-out infinite}
@keyframes bitglow{0%,100%{box-shadow:none}50%{box-shadow:0 0 4px rgba(0,255,65,0.5)}}
.av-bit.normal{color:var(--dim)}
.av-lbl{font-size:8px;color:var(--dim);letter-spacing:1px;min-width:60px}

/* ── FOOTER ── */
.foot{text-align:center;padding:16px;border-top:1px solid var(--border);
  font-size:7px;letter-spacing:3px;color:var(--dim);margin-top:14px}
.foot em{color:var(--g1);font-style:normal}

::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--dimmer)}

/* Wide screens — use full width with two-column main layout */
@media(min-width:1200px){
  .cmp{grid-template-columns:1fr 1fr 1fr}
  .igrid{grid-template-columns:repeat(4,1fr)}
  .sa-grid{grid-template-columns:repeat(4,1fr)}
  .msg-analysis{grid-template-columns:repeat(3,1fr)}
}
@media(min-width:900px) and (max-width:1199px){
  .igrid{grid-template-columns:repeat(2,1fr)}
  .sa-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:600px){
  .stats{grid-template-columns:repeat(3,1fr)}
  .st:nth-child(4),.st:nth-child(5){border-top:1px solid var(--border)}
  .adv-grid{grid-template-columns:1fr}
  .cmp{grid-template-columns:1fr}
  .sa-grid{grid-template-columns:1fr}
  .msg-analysis{grid-template-columns:1fr 1fr}
  .igrid{grid-template-columns:1fr}
  .tabs{flex-wrap:wrap}
  .tab{flex:1 1 45%;border-bottom:1px solid var(--border)}
}
`;

/* ══════════════════════════════════════
   CRYPTO — AES-256-GCM via Web Crypto
══════════════════════════════════════ */
async function deriveKey(pass) {
  const enc = new TextEncoder();
  const raw = await crypto.subtle.importKey(
    "raw", enc.encode(pass.padEnd(32,"0").slice(0,32)),
    {name:"PBKDF2"}, false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {name:"PBKDF2",salt:enc.encode("stegacipher_v3_salt"),iterations:100000,hash:"SHA-256"},
    raw, {name:"AES-GCM",length:256}, false, ["encrypt","decrypt"]
  );
}
async function aesEncrypt(text, pass) {
  const key = await deriveKey(pass);
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const enc = await crypto.subtle.encrypt({name:"AES-GCM",iv}, key, new TextEncoder().encode(text));
  const out = new Uint8Array(12+enc.byteLength);
  out.set(iv); out.set(new Uint8Array(enc),12);
  return btoa(String.fromCharCode(...out));
}
async function aesDecrypt(b64, pass) {
  try {
    const key  = await deriveKey(pass);
    const data = Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
    const dec  = await crypto.subtle.decrypt({name:"AES-GCM",iv:data.slice(0,12)}, key, data.slice(12));
    return new TextDecoder().decode(dec);
  } catch { throw new Error("Wrong password or message was not AES-encrypted"); }
}

/* ══════════════════════════════════════
   LSB ENGINE — variable depth + channel selection
   HEADER FORMAT (always stored as R,G,B depth=1):
     byte 0:   depth (1-3)
     byte 1:   channel mask (R=8,G=4,B=2,A=1)
     bytes 2-5: message length (uint32 big-endian)
   Total header = 6 bytes = 48 bits in R,G,B LSBs = 16 pixels
══════════════════════════════════════ */
const HDR_BYTES = 6; // depth(1)+chMask(1)+len(4)

// Write bits into R,G,B channel LSBs starting at pixel 0 (depth=1 always for header)
function writeHeaderBits(px, headerBytes) {
  let bitPtr = 0;
  for (let pxI = 0; pxI < px.length/4 && bitPtr < headerBytes.length*8; pxI++) {
    const base = pxI*4;
    for (const ci of [0,1,2]) { // R,G,B only, depth=1
      if (bitPtr >= headerBytes.length*8) break;
      const bytePos = Math.floor(bitPtr/8);
      const bitPos  = 7-(bitPtr%8);
      px[base+ci] = (px[base+ci]&0xfe) | ((headerBytes[bytePos]>>bitPos)&1);
      bitPtr++;
    }
  }
  // return how many pixels the header consumed (ceil)
  return Math.ceil(headerBytes.length*8/3);
}

// Read bits from R,G,B channel LSBs (depth=1) starting at pixel 0
function readHeaderBits(px, numBytes) {
  const bits = [];
  for (let pxI=0; pxI<px.length/4 && bits.length<numBytes*8; pxI++) {
    const base=pxI*4;
    for (const ci of [0,1,2]) {
      if (bits.length>=numBytes*8) break;
      bits.push(px[base+ci]&1);
    }
  }
  const out = new Uint8Array(numBytes);
  for (let i=0;i<numBytes;i++) {
    let b=0;
    for (let j=0;j<8;j++) b=(b<<1)|(bits[i*8+j]||0);
    out[i]=b;
  }
  return out;
}

function lsbEncode(imageData, message, channels=["R","G","B"], depth=1) {
  const px  = imageData.data;
  const mb  = new TextEncoder().encode(message);
  const len = mb.length;

  const chMask = (channels.includes("R")?8:0)|(channels.includes("G")?4:0)|
                 (channels.includes("B")?2:0)|(channels.includes("A")?1:0);

  // Build 6-byte header: depth, chMask, len(4 bytes)
  const header = new Uint8Array([
    depth & 0xff,
    chMask & 0xff,
    (len>>24)&0xff,(len>>16)&0xff,(len>>8)&0xff,len&0xff
  ]);

  // How many pixels does the header consume at depth=1 RGB?
  const hdrPixels = writeHeaderBits(px, header); // writes header into pixels 0..hdrPixels-1

  // Check capacity for payload (starting after header pixels)
  const payloadPixels = Math.floor(px.length/4) - hdrPixels;
  const bitsAvail  = payloadPixels * channels.length * depth;
  const bitsNeeded = len * 8;
  if (bitsNeeded > bitsAvail) throw new Error(
    `Message too large — need ${bitsNeeded} bits, image offers ${bitsAvail} bits`
  );

  // Encode payload starting at hdrPixels
  const chIdx = {R:0,G:1,B:2,A:3};
  const depthMask = (1<<depth)-1;
  let bitPtr = 0;

  for (let pxI=hdrPixels; pxI<px.length/4 && bitPtr<bitsNeeded; pxI++) {
    const base = pxI*4;
    for (const ch of channels) {
      if (bitPtr >= bitsNeeded) break;
      const ci = base + chIdx[ch];
      let bits = 0;
      for (let d=0; d<depth; d++) {
        const bytePos = Math.floor(bitPtr/8);
        const bitPos  = 7-(bitPtr%8);
        bits = (bits<<1)|((mb[bytePos]>>bitPos)&1);
        bitPtr++;
      }
      px[ci] = (px[ci] & ~depthMask) | bits;
    }
  }
  return imageData;
}

function lsbDecode(imageData) {
  const px = imageData.data;

  // Read 6-byte header from R,G,B LSBs (depth=1) at pixels 0..15
  const hdr = readHeaderBits(px, HDR_BYTES);
  const depth  = hdr[0];
  const chMask = hdr[1];
  const msgLen = (hdr[2]<<24)|(hdr[3]<<16)|(hdr[4]<<8)|hdr[5];

  if (depth<1||depth>3)        throw new Error("No hidden message found in this image (invalid depth)");
  if (msgLen<=0||msgLen>5_000_000) throw new Error("No hidden message found in this image (invalid length)");

  const channels = [];
  if (chMask&8) channels.push("R");
  if (chMask&4) channels.push("G");
  if (chMask&2) channels.push("B");
  if (chMask&1) channels.push("A");
  if (channels.length===0) throw new Error("No hidden message found in this image (invalid channels)");

  // header pixels (same calculation as encode)
  const hdrPixels = Math.ceil(HDR_BYTES*8/3);

  // Read payload bits starting from hdrPixels
  const chIdx = {R:0,G:1,B:2,A:3};
  const depthMask = (1<<depth)-1;
  const totalBits = msgLen*8;
  const allBits = [];

  for (let pxI=hdrPixels; pxI<px.length/4 && allBits.length<totalBits; pxI++) {
    const base=pxI*4;
    for (const ch of channels) {
      if (allBits.length>=totalBits) break;
      const ci = base+chIdx[ch];
      const val = px[ci]&depthMask;
      for (let d=depth-1;d>=0;d--) allBits.push((val>>d)&1);
    }
  }

  // allBits already starts at payload (after header pixels), decode directly
  const bytes = new Uint8Array(msgLen);
  for (let i=0;i<msgLen;i++) {
    let b=0;
    for (let j=0;j<8;j++) b=(b<<1)|(allBits[i*8+j]||0);
    bytes[i]=b;
  }
  return {text:new TextDecoder().decode(bytes), depth, channels, msgLen};
}

/* ══════════════════════════════════════
   STEGANALYSIS — Chi-square + LSB uniformity
══════════════════════════════════════ */
function analyzeImage(imageData) {
  const px = imageData.data;
  const n  = px.length/4;

  // LSB histogram per channel
  const lsb = {R:[0,0],G:[0,0],B:[0,0]};
  for (let i=0;i<px.length;i+=4) {
    lsb.R[px[i]&1]++;
    lsb.G[px[i+1]&1]++;
    lsb.B[px[i+2]&1]++;
  }
  // Chi-square: if LSBs are ~50/50 → suspicious (embedded data is random)
  const chiScore = ch => {
    const e = n/2;
    return ((lsb[ch][0]-e)**2/e + (lsb[ch][1]-e)**2/e);
  };
  const rChi=chiScore("R"), gChi=chiScore("G"), bChi=chiScore("B");
  const avgChi=(rChi+gChi+bChi)/3;

  // Normalise: chi~0 suspicious, chi>100 → natural
  // Suspicion score 0-100
  const susp = Math.max(0, Math.min(100, 100 - Math.min(avgChi*0.8,100)));

  // Entropy of LSBs
  const entropy = ch => {
    const p0=lsb[ch][0]/n, p1=lsb[ch][1]/n;
    const safe = x => x>0?-x*Math.log2(x):0;
    return safe(p0)+safe(p1);
  };
  const avgEnt = (entropy("R")+entropy("G")+entropy("B"))/3;

  return {
    lsb, rChi, gChi, bChi, avgChi, susp,
    entropy:{R:entropy("R"),G:entropy("G"),B:entropy("B"),avg:avgEnt},
    pixels: n
  };
}

/* ══════════════════════════════════════
   DIFF HEATMAP
══════════════════════════════════════ */
function buildHeatmap(orig, stego, canvas) {
  const w=orig.width, h=orig.height;
  canvas.width=w; canvas.height=h;
  const ctx=canvas.getContext("2d");
  const out=ctx.createImageData(w,h);
  const od=orig.data, sd=stego.data;
  for (let i=0;i<od.length;i+=4) {
    const dr=Math.abs(od[i]-sd[i])*128;
    const dg=Math.abs(od[i+1]-sd[i+1])*128;
    const db=Math.abs(od[i+2]-sd[i+2])*128;
    const bright=Math.max(dr,dg,db);
    out.data[i]  =bright?255:0;
    out.data[i+1]=bright?0:0;
    out.data[i+2]=bright?0:0;
    out.data[i+3]=255;
  }
  ctx.putImageData(out,0,0);
}

/* ══════════════════════════════════════
   UTILS
══════════════════════════════════════ */
function readFile(f) {
  return new Promise((res,rej)=>{
    const fr=new FileReader();
    fr.onload=e=>res(e.target.result);
    fr.onerror=rej;
    fr.readAsDataURL(f);
  });
}
function loadFromDataURL(dataURL) {
  return new Promise((res,rej)=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement("canvas");
      c.width=img.naturalWidth; c.height=img.naturalHeight;
      const ctx=c.getContext("2d");
      ctx.drawImage(img,0,0);
      res({img,canvas:c,ctx,dataURL,
        data:ctx.getImageData(0,0,c.width,c.height),
        w:img.naturalWidth,h:img.naturalHeight});
    };
    img.onerror=rej;
    img.src=dataURL;
  });
}

/* ══════════════════════════════════════
   COMPONENT
══════════════════════════════════════ */
const STEPS_ENC = ["INIT","ENCRYPT","LSB","NOISE","VERIFY","DONE"];
const STEPS_DEC = ["INIT","SCAN","HEADER","EXTRACT","DECRYPT","DONE"];

export default function StegaCipherV3() {
  const [tab, setTab] = useState("encode");

  /* encode state */
  const [encImg,   setEncImg]   = useState(null);
  const [encMsg,   setEncMsg]   = useState("");
  const [encPass,  setEncPass]  = useState("");
  const [useAES,   setUseAES]   = useState(false);
  const [channels, setChannels] = useState(["R","G","B"]);
  const [depth,    setDepth]    = useState(1);
  const [scatter,  setScatter]  = useState("none"); // none | random | uniform
  const [encoding, setEncoding] = useState(false);
  const [encStep,  setEncStep]  = useState(-1);
  const [encProg,  setEncProg]  = useState(0);
  const [encLog,   setEncLog]   = useState([]);
  const [encRes,   setEncRes]   = useState(null);
  const [encDrag,  setEncDrag]  = useState(false);
  const [encErr,   setEncErr]   = useState("");
  const [encSA,    setEncSA]    = useState(null); // steganalysis of result

  /* decode state */
  const [decImg,   setDecImg]   = useState(null);
  const [decPass,  setDecPass]  = useState("");
  const [decoding, setDecoding] = useState(false);
  const [decStep,  setDecStep]  = useState(-1);
  const [decLog,   setDecLog]   = useState([]);
  const [decRes,   setDecRes]   = useState(null);
  const [decDrag,  setDecDrag]  = useState(false);
  const [decErr,   setDecErr]   = useState("");
  const [decSA,    setDecSA]    = useState(null);
  const [copied,   setCopied]   = useState(false);

  /* pixel inspector */
  const [hoverPx, setHoverPx]  = useState(null); // {x,y,r,g,b,a}

  /* history */
  const [history, setHistory]  = useState([]);

  /* stats */
  const [stats, setStats] = useState({enc:0,dec:0,chars:0,imgs:0,bits:0});

  const logRef    = useRef(null);
  const heatRef   = useRef(null);  // heatmap canvas
  const pxCanvRef = useRef(null);  // pixel inspector canvas (encode preview)
  const pxCanvDecRef = useRef(null);

  /* ── MATRIX RAIN ── */
  useEffect(()=>{
    const cv=document.getElementById("mx");
    if (!cv) return;
    const ctx=cv.getContext("2d");
    const resize=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    const cols=Math.floor(cv.width/15);
    const drops=Array(cols).fill(1);
    const chars="アイウエカ01ABCDEF∂∆Ω∑{}[]10110100".split("");
    const iv=setInterval(()=>{
      ctx.fillStyle="rgba(2,8,5,0.05)";ctx.fillRect(0,0,cv.width,cv.height);
      ctx.fillStyle="#00ff41";ctx.font="12px 'Share Tech Mono'";
      drops.forEach((y,i)=>{
        ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*15,y*15);
        if(y*15>cv.height&&Math.random()>.978) drops[i]=0;
        drops[i]++;
      });
    },60);
    return ()=>{clearInterval(iv);window.removeEventListener("resize",resize);};
  },[]);

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; });

  /* ── PIXEL INSPECTOR CANVAS ── */
  const attachPxInspector = useCallback((canvRef, imgObj) => {
    const cv = canvRef.current;
    if (!cv || !imgObj) return;
    const W=Math.min(imgObj.w,320), H=Math.min(imgObj.h,Math.round(imgObj.h*(W/imgObj.w)));
    cv.width=W; cv.height=H;
    const ctx=cv.getContext("2d");
    ctx.drawImage(imgObj.img,0,0,W,H);
    cv.onmousemove = e => {
      const rect=cv.getBoundingClientRect();
      const sx=(e.clientX-rect.left)/rect.width*imgObj.w|0;
      const sy=(e.clientY-rect.top)/rect.height*imgObj.h|0;
      const px=imgObj.data;
      const idx=(sy*imgObj.w+sx)*4;
      setHoverPx({x:sx,y:sy,r:px[idx],g:px[idx+1],b:px[idx+2],a:px[idx+3]});
    };
    cv.onmouseleave = ()=>setHoverPx(null);
  },[]);

  useEffect(()=>{
    if (encImg && pxCanvRef.current) attachPxInspector(pxCanvRef, encImg);
  },[encImg,attachPxInspector]);

  useEffect(()=>{
    if (decImg && pxCanvDecRef.current) attachPxInspector(pxCanvDecRef, decImg);
  },[decImg,attachPxInspector]);

  /* ── HELPERS ── */
  const now = ()=>new Date().toLocaleTimeString("en",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const addLog = (setter,p,msg,type="ok") => setter(l=>[...l,{ts:now(),p,msg,type}]);
  const addLogs = (setter,items) => items.forEach(({p,m,t},i)=>
    setTimeout(()=>setter(l=>[...l,{ts:now(),p,msg:m,type:t||"ok"}]),i*65));

  const toggleChannel = ch => {
    setChannels(prev=>{
      if (prev.includes(ch)) {
        if (prev.length===1) return prev; // must keep ≥1
        return prev.filter(c=>c!==ch);
      }
      return [...prev,ch];
    });
  };

  /* capacity = W*H * (channels * depth) / 8  minus 8-byte header */
  const maxBytes = encImg
    ? Math.max(0, Math.floor(encImg.w*encImg.h*channels.length*depth/8)-8)
    : 0;
  const usedPct = maxBytes>0 ? Math.min(100,Math.round((encMsg.length/maxBytes)*100)) : 0;

  /* ── FILE HANDLERS ── */
  const handleEncFile = async file => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setEncErr("Only image files (PNG, JPG, WEBP, BMP)"); return; }
    setEncErr(""); setEncRes(null); setEncLog([]); setEncSA(null);
    try {
      const dataURL=await readFile(file);
      const img=await loadFromDataURL(dataURL);
      setEncImg({...img,file,size:file.size,name:file.name});
      setStats(s=>({...s,imgs:s.imgs+1}));
    } catch(e) { setEncErr("Failed to load: "+e.message); }
  };

  const handleDecFile = async file => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setDecErr("Only image files supported"); return; }
    setDecErr(""); setDecRes(null); setDecLog([]); setDecSA(null);
    try {
      const dataURL=await readFile(file);
      const img=await loadFromDataURL(dataURL);
      setDecImg({...img,file,size:file.size,name:file.name});
      // Auto-run steganalysis
      const sa=analyzeImage(img.data);
      setDecSA(sa);
    } catch(e) { setDecErr("Failed to load: "+e.message); }
  };

  /* ── ENCODE ── */
  const doEncode = async () => {
    if (!encImg||!encMsg.trim()) return;
    setEncoding(true); setEncLog([]); setEncRes(null); setEncErr(""); setEncStep(0); setEncProg(0);

    const stepDelay = (s,pct,delay=120) => new Promise(r=>{
      setTimeout(()=>{setEncStep(s);setEncProg(pct);r();},delay);
    });

    addLogs(setEncLog,[
      {p:"[INIT]",   m:`Engine v3 — depth:${depth}bit — channels:[${channels.join(",")}]`},
      {p:"[IMG]",    m:`${encImg.name} — ${encImg.w}×${encImg.h}px — cap:${maxBytes.toLocaleString()}B`,t:"info"},
      {p:"[MSG]",    m:`Payload: ${encMsg.length} chars — ${encMsg.length*8} bits`,t:"info"},
      ...(useAES&&encPass
        ?[{p:"[AES]",m:"AES-256-GCM key derivation (PBKDF2, 100k SHA-256)...",t:"warn"},
          {p:"[IV]", m:"12-byte random nonce generated ✓",t:"warn"}]:[]),
              {p:"[HDR]",   m:"6-byte header: depth(1) + chMask(1) + length(4) stored in R,G,B LSBs"},
      {p:"[LSB]",    m:`Injecting payload into ${channels.join("+")} channels @ ${depth} bit(s) depth`},
      ...(scatter!=="none"?[{p:"[SCT]",m:`Scatter mode: ${scatter} — camouflaging ${scatter==="random"?"random":"uniform"} unused LSBs`,t:"info"}]:[]),
      {p:"[VFY]",    m:"Verifying payload integrity — read-back check..."},
      {p:"[DONE]",   m:`Injection complete — ${(encMsg.length*(useAES?1.4:1)).toFixed(0)} bytes written ✓`},
    ]);

    try {
      await stepDelay(0,5);
      let payload = encMsg;
      if (useAES && encPass) {
        await stepDelay(1,20);
        payload = await aesEncrypt(encMsg, encPass);
      }

      await stepDelay(2,40);
      const c=document.createElement("canvas");
      c.width=encImg.w; c.height=encImg.h;
      const ctx=c.getContext("2d");
      ctx.drawImage(encImg.img,0,0);
      const id=ctx.getImageData(0,0,encImg.w,encImg.h);
      const origId=ctx.getImageData(0,0,encImg.w,encImg.h); // keep clean copy

      lsbEncode(id, payload, channels, depth);

      await stepDelay(3,65);
      if (scatter!=="none") {
        const usedPixels=Math.ceil((payload.length+8)*8/(channels.length*depth));
        const px=id.data;
        for (let i=usedPixels;i<px.length/4;i++) {
          if (Math.random()<(scatter==="random"?0.005:0.01)) {
            for (const ch of channels) {
              const ci=i*4+{R:0,G:1,B:2,A:3}[ch];
              const depthMask=(1<<depth)-1;
              px[ci]=(px[ci]&~depthMask)|(Math.random()*(1<<depth)|0);
            }
          }
        }
      }
      ctx.putImageData(id,0,0);

      await stepDelay(4,85);
      // Verify: decode it back
      const verifyId=ctx.getImageData(0,0,c.width,c.height);
      const {text:verifyText}=lsbDecode(verifyId);
      const verified = useAES ? verifyText.length>0 : verifyText===encMsg;

      // Heatmap
      if (heatRef.current) buildHeatmap(origId,id,heatRef.current);

      // Steganalysis on result
      const sa=analyzeImage(id);
      const out=c.toDataURL("image/png");

      await stepDelay(5,100);
      setEncRes({
        dataURL:out, orig:encImg.dataURL,
        w:encImg.w, h:encImg.h,
        chars:encMsg.length, depth, channels:[...channels],
        aes:useAES&&!!encPass, verified,
        size:Math.round(out.length*0.75)
      });
      setEncSA(sa);
      setStats(s=>({...s,enc:s.enc+1,chars:s.chars+encMsg.length,bits:s.bits+encMsg.length*8}));
      setHistory(h=>[{
        type:"enc",
        thumb:out,
        name:encImg.name,
        chars:encMsg.length,
        depth,channels:[...channels],
        aes:useAES&&!!encPass,
        dataURL:out,
        ts:new Date().toLocaleTimeString()
      },...h].slice(0,20));
      setEncoding(false);
    } catch(e) {
      addLog(setEncLog,"[ERR]",e.message,"err");
      setEncErr(e.message);
      setEncStep(-1); setEncoding(false);
    }
  };

  /* ── DECODE ── */
  const doDecode = async () => {
    if (!decImg) return;
    setDecoding(true); setDecLog([]); setDecRes(null); setDecErr(""); setDecStep(0);

    addLogs(setDecLog,[
      {p:"[INIT]",  m:"Extraction engine v3 initialized"},
      {p:"[SCAN]",  m:`Scanning ${(decImg.w*decImg.h).toLocaleString()} pixels...`,t:"info"},
      {p:"[HDR]",   m:"Reading 6-byte header: depth + channel mask + payload length"},
      {p:"[EXT]",   m:"Extracting payload bits from encoded channels..."},
      ...(decPass?[{p:"[AES]",m:"AES-256-GCM decryption — deriving key...",t:"warn"}]:[]),
      {p:"[DONE]",  m:"Extraction complete ✓"},
    ]);

    const stepD=(s,d=100)=>new Promise(r=>setTimeout(()=>{setDecStep(s);r();},d));

    try {
      await stepD(0);
      await stepD(1);
      const c=document.createElement("canvas");
      c.width=decImg.w; c.height=decImg.h;
      const ctx=c.getContext("2d");
      ctx.drawImage(decImg.img,0,0);
      const id=ctx.getImageData(0,0,decImg.w,decImg.h);

      await stepD(2);
      await stepD(3);
      const {text:raw, depth:d, channels:ch, msgLen}=lsbDecode(id);

      await stepD(4);
      let finalMsg=raw;
      if (decPass) {
        await stepD(4,50);
        finalMsg=await aesDecrypt(raw,decPass);
      }

      await stepD(5);
      const sa=analyzeImage(id);
      setDecSA(sa);
      setDecRes({text:finalMsg, depth:d, channels:ch, msgLen,
        aes:!!decPass, entropy:sa.entropy.avg});
      setStats(s=>({...s,dec:s.dec+1}));
      setHistory(h=>[{
        type:"dec",
        thumb:decImg.dataURL,
        name:decImg.name,
        chars:finalMsg.length,
        depth:d,channels:ch,
        aes:!!decPass,
        ts:new Date().toLocaleTimeString()
      },...h].slice(0,20));
      setDecoding(false);
    } catch(e) {
      addLog(setDecLog,"[ERR]",e.message,"err");
      setDecErr(e.message);
      setDecStep(-1); setDecoding(false);
    }
  };

  const openInTab = (dataURL) => {
    const w=window.open("","_blank");
    if (!w) return;
    w.document.write(`<html><head><title>STEGA::CIPHER — Save Image</title>
    <style>body{background:#020805;color:#00ff41;font-family:monospace;text-align:center;padding:40px}
    img{max-width:90vw;max-height:75vh;border:1px solid rgba(0,255,65,0.3);display:block;margin:20px auto}
    p{letter-spacing:2px;font-size:12px;margin:8px 0}a{color:#00ff41;font-size:11px;letter-spacing:2px;display:block;margin-top:8px}
    </style></head><body>
    <p>◈ STEGO IMAGE — RIGHT-CLICK → "Save image as..." OR use link below</p>
    <img src="${dataURL}" alt="stego"/>
    <a href="${dataURL}" download="stega_encoded.png">⬇ Direct download link</a>
    </body></html>`);
    w.document.close();
  };

  const copyMsg = () => {
    if (!decRes) return;
    navigator.clipboard.writeText(decRes.text)
      .then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  };

  const mkDrag = (setDrag, handler) => ({
    onDragOver: e=>{e.preventDefault();setDrag(true);},
    onDragLeave: ()=>setDrag(false),
    onDrop: e=>{e.preventDefault();setDrag(false);handler(e.dataTransfer.files[0]);},
  });

  /* ── RENDER HELPERS ── */
  const LogBox = ({logs}) => (
    <div className="log" ref={logRef}>
      {logs.map((l,i)=>(
        <div key={i} className="ll">
          <span className="lt">{l.ts}</span>
          <span className="lp">{l.p}</span>
          <span className={`lm ${l.type}`}>{l.msg}</span>
        </div>
      ))}
    </div>
  );

  const ProgressBar = ({step, steps}) => {
    const pct=step<0?0:Math.round((step+1)/steps.length*100);
    return (
      <div className="prog-wrap">
        <div className="prog-bar-track">
          <div className="prog-bar-fill" style={{width:pct+"%"}}/>
        </div>
        <div className="prog-steps">
          {steps.map((s,i)=>(
            <div key={i} className={`ps ${i<step?"done":i===step?"active":""}`}>{s}</div>
          ))}
        </div>
      </div>
    );
  };

  const SAPanel = ({sa, label}) => {
    if (!sa) return null;
    const susp=sa.susp;
    const risk = susp<30?"low":susp<65?"medium":"high";
    const colorClass = risk==="low"?"green":risk==="medium"?"yellow":"red";
    const verdict = susp<30
      ? {cls:"sa-v-clean",icon:"◎",txt:"CLEAN — No significant LSB anomalies detected"}
      : susp<65
      ? {cls:"sa-v-suspicious",icon:"◈",txt:"SUSPICIOUS — Elevated LSB uniformity detected"}
      : {cls:"sa-v-detected",icon:"◉",txt:"ANOMALOUS — High probability of embedded payload"};

    return (
      <div className="pnl" style={{marginTop:10}}>
        <div className="phd">
          <div className="pt">Steganalysis — {label}</div>
          <div className="pb">CHI-SQUARE + ENTROPY</div>
        </div>
        <div className="pbd">
          <div className="sa-grid">
            {[
              {label:"R-channel Chi²",val:sa.rChi,max:200},
              {label:"G-channel Chi²",val:sa.gChi,max:200},
              {label:"B-channel Chi²",val:sa.bChi,max:200},
              {label:"LSB Suspicion Score",val:susp,max:100,invert:false},
            ].map((m,i)=>{
              const pct=Math.min(100,Math.round((i===3?m.val:Math.min(m.val,m.max))/m.max*100));
              const fc=i===3
                ?susp<30?"green":susp<65?"yellow":"red"
                :pct<50?"red":pct<80?"yellow":"green";
              return (
                <div key={i} className="sa-card">
                  <div className="sa-title">{m.label}</div>
                  <div className="sa-meter"><div className={`sa-fill ${fc}`} style={{width:pct+"%"}}/></div>
                  <div className="sa-label">
                    <span>{m.val.toFixed?m.val.toFixed(2):m.val}</span>
                    <em>{i===3?`${pct}% risk`:`χ²=${m.val.toFixed(1)}`}</em>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`sa-verdict ${verdict.cls}`}>
            <span style={{fontSize:16}}>{verdict.icon}</span>
            <span style={{letterSpacing:1,fontSize:9}}>{verdict.txt}</span>
          </div>
          <div style={{marginTop:8,display:"flex",gap:8}}>
            {["R","G","B"].map(ch=>(
              <div key={ch} style={{flex:1,background:"var(--s2)",border:"1px solid var(--border)",padding:"7px 8px"}}>
                <div style={{fontSize:7,letterSpacing:2,color:"var(--dim)",marginBottom:3,textTransform:"uppercase"}}>{ch}-LSB entropy</div>
                <div style={{fontFamily:"var(--orb)",fontSize:14,color:ch==="R"?"#ff4455":ch==="G"?"var(--g1)":"#4488ff"}}>
                  {sa.entropy[ch].toFixed(4)}
                </div>
                <div style={{fontSize:7,color:"var(--dim)",marginTop:2}}>max=1.0000</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PxInspector = ({canvRef,imgObj}) => {
    if (!imgObj) return null;
    const toBin = n => n.toString(2).padStart(8,"0");
    return (
      <div className="pnl" style={{marginTop:10}}>
        <div className="phd"><div className="pt">Pixel Inspector</div><div className="pb">HOVER OVER IMAGE</div></div>
        <div className="pbd">
          <div className="px-canvas-row">
            <canvas ref={canvRef} className="px-cv" style={{maxWidth:280,maxHeight:180,flexShrink:0}}/>
            <div className="px-info" style={{minHeight:120}}>
              <div className="px-info-title">Channel Values</div>
              {hoverPx ? (
                <>
                  <div className="px-channels">
                    {[
                      {ch:"R",val:hoverPx.r,color:"#ff4455"},
                      {ch:"G",val:hoverPx.g,color:"var(--g1)"},
                      {ch:"B",val:hoverPx.b,color:"#4488ff"},
                    ].map(({ch,val,color})=>{
                      const bin=toBin(val);
                      return (
                        <div key={ch} className={`px-ch px-ch-${ch}`}>
                          <span className="px-ch-lbl" style={{color}}>{ch}</span>
                          <div className="px-ch-bar"><div className="px-ch-fill" style={{width:`${val/255*100}%`}}/></div>
                          <span className="px-ch-val" style={{color,fontFamily:"var(--orb)",fontSize:12}}>{val}</span>
                          <span className="px-ch-bin">
                            {bin.slice(0,7).split("").map((b,i)=>(
                              <span key={i}>{b}</span>
                            ))}
                            <span className="px-ch-bit">{bin[7]}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-coord">X:<em>{hoverPx.x}</em> Y:<em>{hoverPx.y}</em> A:<em>{hoverPx.a}</em></div>
                  <div className="px-hint">Red digit = LSB (payload bit)</div>
                </>
              ) : (
                <div style={{color:"var(--dim)",fontSize:9,letterSpacing:2,marginTop:10}}>
                  HOVER OVER IMAGE<br/>TO INSPECT PIXELS
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── JSX ── */
  return (
    <>
      <style>{CSS}</style>
      <canvas id="mx"/>
      <div className="wrap">

        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-l">
            <div className="logo">STEGA::CIPHER <span style={{fontSize:"0.55em",color:"var(--g3)"}}>v3</span></div>
            <div className="logo-sub">LSB STEGANOGRAPHY · AES-256 · STEGANALYSIS</div>
          </div>
          <div className="hdr-r">
            <div className="online"><div className="dot"/>ENGINE ONLINE</div>
            <div className="ver-line">build <em>2025.03</em> · depth 1-3bit · multi-channel</div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          {[
            {v:stats.enc,   l:"Encoded"},
            {v:stats.dec,   l:"Decoded"},
            {v:stats.chars.toLocaleString(), l:"Chars Hidden"},
            {v:(stats.bits/1000).toFixed(1)+"k",l:"Bits Written"},
            {v:history.length,l:"History"},
          ].map((s,i)=>(
            <div key={i} className="st">
              <div className="sv">{s.v}</div>
              <div className="sl">{s.l}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="tabs">
          {[
            {k:"encode",label:"◈ ENCODE"},
            {k:"decode",label:"◉ DECODE"},
            {k:"history",label:"◷ HISTORY"},
            {k:"info",label:"§ HOW IT WORKS"},
          ].map(t=>(
            <button key={t.k} className={`tab ${tab===t.k?"on":""}`} onClick={()=>setTab(t.k)}>{t.label}</button>
          ))}
        </div>

        {/* ════════ ENCODE ════════ */}
        {tab==="encode" && (<>
          {/* UPLOAD */}
          <div className="pnl">
            <div className="phd"><div className="pt">01 — Carrier Image</div><div className="pb">PNG · JPG · WEBP · BMP</div></div>
            <div className="pbd">
              {!encImg ? (
                <label className="ulbl" {...mkDrag(setEncDrag,handleEncFile)}>
                  <input type="file" accept="image/*" onChange={e=>handleEncFile(e.target.files[0])}/>
                  <div className={`dz ${encDrag?"drag":""}`}>
                    <div className="dz-corner tl"/><div className="dz-corner tr"/>
                    <div className="dz-corner bl"/><div className="dz-corner br"/>
                    <div className="dz-ic">🖼️</div>
                    <div className="dz-main">Click or drag image here</div>
                    <div className="dz-sub">PNG recommended — lossless pixel preservation</div>
                    <div className="dz-badge">CLICK TO BROWSE</div>
                  </div>
                </label>
              ) : (
                <div className="prev" {...mkDrag(setEncDrag,handleEncFile)}>
                  <img src={encImg.dataURL} alt="carrier"/>
                  <div className="prev-tags">
                    <div className="ptag">{encImg.w}×{encImg.h}</div>
                    <div className="ptag">{(encImg.size/1024).toFixed(0)} KB</div>
                    <div className="ptag">Cap: {maxBytes.toLocaleString()} B</div>
                    <div className="ptag">Pix: {(encImg.w*encImg.h).toLocaleString()}</div>
                  </div>
                  <div className="prev-clr" onClick={()=>{setEncImg(null);setEncRes(null);setEncLog([]);setEncErr("");setEncSA(null);}}>✕</div>
                </div>
              )}
              {encImg && (
                <div className={`cap ${usedPct>80?"warn":""} ${usedPct>95?"over":""}`}>
                  <div className="cap-l">CAPACITY</div>
                  <div className="cap-tr"><div className="cap-fill" style={{width:usedPct+"%"}}/></div>
                  <div className="cap-v">{encMsg.length} / {maxBytes.toLocaleString()} bytes ({usedPct}%)</div>
                </div>
              )}
              {encErr && <div className="errb">⚠ {encErr}</div>}
            </div>
          </div>

          {/* MESSAGE */}
          <div className="pnl">
            <div className="phd">
              <div className="pt">02 — Secret Payload</div>
              <div className="pb">{encMsg.length} chars · {encMsg.length*8} bits</div>
            </div>
            <div className="pbd">
              <div className="fg">
                <label className="fl"><em>▸</em> Message</label>
                <textarea className="fta" value={encMsg} onChange={e=>setEncMsg(e.target.value)}
                  placeholder={"Type your secret message...\n\nExample: OPERATION BLACKOUT — key=7X$9Qa — target@23:00"}
                  maxLength={maxBytes||undefined}/>
                <div className="fm">
                  <span>{encMsg.length} chars · {encMsg.length*8} bits</span>
                  <span>{maxBytes>0?`max ${maxBytes.toLocaleString()} B available`:"upload image first"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ADVANCED OPTIONS */}
          <div className="pnl">
            <div className="phd"><div className="pt">03 — Advanced Options</div><div className="pb">CHANNELS · DEPTH · SCATTER</div></div>
            <div className="pbd">

              {/* AES toggle */}
              <div className="tog" onClick={()=>setUseAES(v=>!v)}>
                <div className={`tsw ${useAES?"on":""}`}/>
                <div className={`tl ${useAES?"on":""}`}>AES-256-GCM Encryption</div>
                <div className="tt">{useAES?"ACTIVE — payload encrypted before hiding":"DISABLED"}</div>
              </div>
              {useAES && (
                <div className="fg" style={{marginBottom:12}}>
                  <label className="fl"><em>▸</em> Password (PBKDF2 · 100,000 iter · SHA-256)</label>
                  <input type="password" className="fi" value={encPass} onChange={e=>setEncPass(e.target.value)}
                    placeholder="Enter strong password..."/>
                </div>
              )}

              <div className="adv-grid">
                {/* CHANNEL SELECTOR */}
                <div className="adv-sec">
                  <div className="adv-title">Carrier Channels</div>
                  <div className="ch-row">
                    {["R","G","B","A"].map(ch=>(
                      <div key={ch} className={`ch-btn ${channels.includes(ch)?`on-${ch}`:""}`}
                        onClick={()=>toggleChannel(ch)}>
                        {ch}
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:7,color:"var(--dim)",marginTop:6,letterSpacing:1}}>
                    Active: [{channels.join(",")}] — {channels.length*depth} bits/pixel
                  </div>
                </div>

                {/* LSB DEPTH */}
                <div className="adv-sec">
                  <div className="adv-title">LSB Depth (bits/channel)</div>
                  <div className="depth-row">
                    <input type="range" min={1} max={3} value={depth}
                      onChange={e=>setDepth(+e.target.value)} className="depth-slider"/>
                    <div className="depth-val">{depth}</div>
                  </div>
                  <div className="depth-lbl">
                    {depth===1?"Invisible (±1/255)":depth===2?"Subtle (±3/255 — may shift light colors)":"Visible risk (±7/255 — detectable on smooth areas)"}
                  </div>
                </div>

                {/* SCATTER */}
                <div className="adv-sec">
                  <div className="adv-title">Unused Bit Scatter</div>
                  <div className="sc-row">
                    {[
                      {k:"none",label:"None — leave unused bits clean"},
                      {k:"random",label:"Random — noise on 0.5% unused pixels"},
                      {k:"uniform",label:"Uniform — noise on 1% unused pixels"},
                    ].map(o=>(
                      <div key={o.k} className={`sc-opt ${scatter===o.k?"on":""}`}
                        onClick={()=>setScatter(o.k)}>
                        <span className="sc-dot"/>
                        <span>{o.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INFO BOX */}
                <div className="adv-sec">
                  <div className="adv-title">Estimated Capacity</div>
                  {encImg ? (
                    <>
                      <div style={{fontFamily:"var(--orb)",fontSize:22,color:"var(--g1)",lineHeight:1,textShadow:"0 0 8px rgba(0,255,65,0.4)"}}>
                        {(maxBytes/1024).toFixed(1)} <span style={{fontSize:10,color:"var(--muted)"}}>KB</span>
                      </div>
                      <div style={{fontSize:8,color:"var(--dim)",marginTop:4,letterSpacing:1}}>
                        {maxBytes.toLocaleString()} bytes max<br/>
                        {channels.length} ch × {depth}bit = {channels.length*depth} bits/px<br/>
                        {(encImg.w*encImg.h*channels.length*depth/8).toFixed(0)} raw bytes
                      </div>
                    </>
                  ) : (
                    <div style={{fontSize:8,color:"var(--dim)",letterSpacing:1}}>Upload image to calculate</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* EXECUTE */}
          <button className="ebtn" onClick={doEncode}
            disabled={encoding||!encImg||!encMsg.trim()}>
            {encoding?"◈ INJECTING PAYLOAD...":"◈ EXECUTE — HIDE MESSAGE IN IMAGE"}
          </button>

          {encoding && <ProgressBar step={encStep} steps={STEPS_ENC}/>}
          {encLog.length>0 && <LogBox logs={encLog}/>}

          {/* RESULT */}
          {encRes && (
            <div className="res">
              <div className="res-hd">
                <div className="res-t">{encRes.verified?"◈ PAYLOAD VERIFIED & INJECTED":"◈ PAYLOAD INJECTED"}</div>
                <div className="res-tags">
                  <div className="res-tag">{encRes.w}×{encRes.h}</div>
                  <div className="res-tag">[{encRes.channels.join(",")}]</div>
                  <div className="res-tag">{encRes.depth}BIT DEPTH</div>
                  {encRes.aes && <div className="res-tag" style={{borderColor:"rgba(255,204,0,0.3)",color:"var(--y1)"}}>AES-256</div>}
                  {encRes.verified && <div className="res-tag" style={{borderColor:"rgba(0,255,65,0.4)",color:"var(--g1)"}}>✓ VERIFIED</div>}
                </div>
              </div>

              {/* 3-panel compare: orig | stego | heatmap */}
              <div className="cmp">
                <div className="cbox">
                  <div className="cbox-hd"><em>ORIGINAL</em></div>
                  <img src={encRes.orig} alt="original"/>
                </div>
                <div className="cbox">
                  <div className="cbox-hd"><em>STEGO</em> — {encRes.chars} chars hidden</div>
                  <img src={encRes.dataURL} alt="stego"/>
                </div>
                <div className="cbox">
                  <div className="cbox-hd"><em>DIFF HEATMAP</em> — modified pixels</div>
                  <canvas ref={heatRef} style={{width:"100%",maxHeight:160,objectFit:"contain",display:"block"}}/>
                </div>
              </div>
              <div style={{marginTop:7,padding:"6px 10px",background:"var(--bg)",border:"1px solid var(--border)",
                fontSize:8,color:"var(--dim)",letterSpacing:1,lineHeight:1.7}}>
                ✓ Images visually identical — LSB changes ≤{(1/255*(1<<(depth-1))).toFixed(4)} per channel.
                Heatmap shows modified pixels (red = changed bit).
                {encRes.chars} chars embedded across ~{Math.ceil(encRes.chars*8/(encRes.channels.length*encRes.depth)).toLocaleString()} pixels.
              </div>
              <a href={encRes.dataURL} download="stega_encoded.png" className="dl-a">
                ⬇ DOWNLOAD STEGO IMAGE — PNG LOSSLESS
              </a>
              <button className="dl-fb" onClick={()=>openInTab(encRes.dataURL)}>
                ↗ CAN'T DOWNLOAD? OPEN IN NEW TAB → RIGHT-CLICK → SAVE
              </button>
            </div>
          )}

          {/* Steganalysis of encoded result */}
          {encSA && <SAPanel sa={encSA} label="Encoded Image"/>}

          {/* Pixel Inspector */}
          <PxInspector canvRef={pxCanvRef} imgObj={encImg}/>
        </>)}

        {/* ════════ DECODE ════════ */}
        {tab==="decode" && (<>
          <div className="pnl">
            <div className="phd"><div className="pt">01 — Upload Stego Image</div><div className="pb">ENCODED PNG REQUIRED</div></div>
            <div className="pbd">
              {!decImg ? (
                <label className="ulbl" {...mkDrag(setDecDrag,handleDecFile)}>
                  <input type="file" accept="image/*" onChange={e=>handleDecFile(e.target.files[0])}/>
                  <div className={`dz ${decDrag?"drag":""}`}>
                    <div className="dz-corner tl"/><div className="dz-corner tr"/>
                    <div className="dz-corner bl"/><div className="dz-corner br"/>
                    <div className="dz-ic">🔍</div>
                    <div className="dz-main">Click or drag stego image here</div>
                    <div className="dz-sub">Must be the PNG output from ENCODE mode</div>
                    <div className="dz-badge">CLICK TO BROWSE</div>
                  </div>
                </label>
              ) : (
                <div className="prev">
                  <img src={decImg.dataURL} alt="stego"/>
                  <div className="prev-tags">
                    <div className="ptag">{decImg.w}×{decImg.h}</div>
                    <div className="ptag">{(decImg.size/1024).toFixed(0)} KB</div>
                    {decSA && <div className="ptag" style={{
                      borderColor:decSA.susp<30?"rgba(0,255,65,0.3)":decSA.susp<65?"rgba(255,204,0,0.3)":"rgba(255,51,85,0.3)",
                      color:decSA.susp<30?"var(--g1)":decSA.susp<65?"var(--y1)":"var(--r1)"
                    }}>
                      {decSA.susp<30?"◎ CLEAN":decSA.susp<65?"◈ SUSPICIOUS":"◉ DETECTED"}
                    </div>}
                  </div>
                  <div className="prev-clr" onClick={()=>{setDecImg(null);setDecRes(null);setDecLog([]);setDecErr("");setDecSA(null);}}>✕</div>
                </div>
              )}
              {decErr && <div className="errb">⚠ {decErr}</div>}
            </div>
          </div>

          <div className="pnl">
            <div className="phd"><div className="pt">02 — Decryption Key</div><div className="pb">OPTIONAL — IF AES USED</div></div>
            <div className="pbd">
              <div className="fg">
                <label className="fl"><em>▸</em> Password (leave empty if no AES encryption)</label>
                <input type="password" className="fi" value={decPass}
                  onChange={e=>setDecPass(e.target.value)}
                  placeholder="Enter password if AES-256 was used during encoding..."/>
              </div>
            </div>
          </div>

          <button className="ebtn" onClick={doDecode} disabled={decoding||!decImg}>
            {decoding?"◉ EXTRACTING PAYLOAD...":"◉ EXECUTE — REVEAL HIDDEN MESSAGE"}
          </button>

          {decoding && <ProgressBar step={decStep} steps={STEPS_DEC}/>}
          {decLog.length>0 && <LogBox logs={decLog}/>}

          {decRes && (
            <div className="res">
              <div className="res-hd">
                <div className="res-t">◉ MESSAGE EXTRACTED</div>
                <div className="res-tags">
                  <div className="res-tag">{decRes.msgLen} bytes</div>
                  <div className="res-tag">[{decRes.channels.join(",")}]</div>
                  <div className="res-tag">{decRes.depth}BIT</div>
                  {decRes.aes && <div className="res-tag" style={{borderColor:"rgba(255,204,0,0.3)",color:"var(--y1)"}}>AES-256 ✓</div>}
                </div>
              </div>
              <div className="mout">
                {decRes.text}
                <button className={`cpybtn ${copied?"ok":""}`} onClick={copyMsg}>
                  {copied?"✓ COPIED":"COPY"}
                </button>
              </div>
              {/* MSG ANALYSIS */}
              <div className="msg-analysis">
                {[
                  {v:decRes.text.length,l:"Characters"},
                  {v:decRes.text.split(/\s+/).filter(Boolean).length,l:"Words"},
                  {v:decRes.entropy.toFixed(4),l:"LSB Entropy"},
                ].map((m,i)=>(
                  <div key={i} className="ma-card">
                    <div className="ma-val">{m.v}</div>
                    <div className="ma-lbl">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {decSA && <SAPanel sa={decSA} label="Uploaded Image"/>}
          <PxInspector canvRef={pxCanvDecRef} imgObj={decImg}/>
        </>)}

        {/* ════════ HISTORY ════════ */}
        {tab==="history" && (
          <div className="pnl">
            <div className="phd"><div className="pt">Session History</div><div className="pb">LAST 20 OPERATIONS</div></div>
            <div className="pbd">
              {history.length===0 ? (
                <div className="empty-hist">NO OPERATIONS YET — encode or decode something first</div>
              ) : (
                <div className="hist-list">
                  {history.map((h,i)=>(
                    <div key={i} className="hist-item">
                      <img src={h.thumb} alt="" className="hist-thumb"/>
                      <div className="hist-info">
                        <div className="hist-name">{h.name}</div>
                        <div className="hist-meta">
                          {h.ts} · {h.chars} chars · [{h.channels.join(",")}] · {h.depth}bit{h.aes?" · AES-256":""}
                        </div>
                      </div>
                      <div className={`hist-badge ${h.type}`}>{h.type.toUpperCase()}</div>
                      {h.type==="enc" && h.dataURL && (
                        <a href={h.dataURL} download="stega_encoded.png" className="hist-dl">⬇ DL</a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════ HOW IT WORKS ════════ */}
        {tab==="info" && (<>
          <div className="info-hero">
            <p>
              <strong style={{color:"var(--g1)"}}>Steganography</strong> hides data <em style={{fontStyle:"normal",color:"var(--g1)"}}>inside</em> data.
              Unlike encryption (scrambles data into ciphertext), steganography makes data <strong style={{color:"var(--g1)"}}>invisible</strong> —
              the carrier image looks perfectly normal while secretly carrying a hidden payload.
            </p>
            <p>
              This tool uses <strong style={{color:"var(--g1)"}}>LSB (Least Significant Bit)</strong> substitution with
              variable depth (1–3 bits) across selectable channels (R, G, B, Alpha), optional
              <strong style={{color:"var(--g1)"}}> AES-256-GCM</strong> encryption, and built-in
              <strong style={{color:"var(--g1)"}}> chi-square steganalysis</strong> to measure detectability.
            </p>
          </div>

          {/* ANIMATED BIT VISUALIZER */}
          <div className="pnl">
            <div className="phd"><div className="pt">LSB Substitution — Visual Demo</div><div className="pb">DEPTH=1, CHANNEL=R</div></div>
            <div className="pbd">
              <div className="algo-visual">
                {[
                  {lbl:"Original R",bits:"10110110",msg:null},
                  {lbl:"Message bit",bits:"_______1",msg:true},
                  {lbl:"Modified R",bits:"1011011",last:"1",msg:null},
                ].map((row,i)=>(
                  <div key={i} className="av-row">
                    <span className="av-lbl">{row.lbl}</span>
                    <div className="av-byte">
                      {row.last
                        ? <>
                            {"1011011".split("").map((b,j)=>(
                              <div key={j} className="av-bit normal">{b}</div>
                            ))}
                            <div className="av-bit payload">{row.last}</div>
                          </>
                        : row.bits.split("").map((b,j)=>(
                            <div key={j} className={`av-bit ${b==="1"||b==="0"?"normal":""} ${row.msg&&j===7?"payload":""}`}>{b}</div>
                          ))
                      }
                    </div>
                    {i===0 && <span style={{fontSize:8,color:"var(--dim)",marginLeft:8}}>= 182 decimal</span>}
                    {i===2 && <span style={{fontSize:8,color:"var(--g1)",marginLeft:8}}>= 183 (Δ=1/255)</span>}
                  </div>
                ))}
              </div>
              <div style={{fontSize:9,color:"var(--dim)",marginTop:8,letterSpacing:1,lineHeight:1.8}}>
                With <strong style={{color:"var(--g1)"}}>depth=2</strong>, the last 2 bits carry payload → 2× capacity but ±3/255 shift.
                With <strong style={{color:"var(--g1)"}}>depth=3</strong>, the last 3 bits → 3× capacity but ±7/255 shift (may affect smooth gradients).
              </div>
            </div>
          </div>

          <div className="igrid">
            {[
              {t:"Capacity Formula",b:<>
                <code>Bytes = W × H × Channels × Depth / 8</code><br/><br/>
                1920×1080 · 3ch · 1bit:<br/><code>= 777,600 bytes ≈ 759 KB</code><br/><br/>
                1920×1080 · 3ch · 3bit:<br/><code>= 2,332,800 bytes ≈ 2.2 MB</code>
              </>},
              {t:"AES-256-GCM",b:<>
                Encryption <em style={{color:"var(--g1)",fontStyle:"normal"}}>before</em> hiding:<br/><br/>
                <code>Key: PBKDF2(pass,salt,100k,SHA256)</code><br/>
                <code>IV:  12-byte random nonce</code><br/>
                <code>Tag: 128-bit GCM auth tag</code><br/><br/>
                Even if detected, payload is unreadable ciphertext without the password.
              </>},
              {t:"Chi-Square Analysis",b:<>
                If LSBs are ~50% 0s and ~50% 1s → suspicious (embedded random data).
                Natural images have biased LSBs.<br/><br/>
                <code>χ² = Σ (observed-expected)² / expected</code><br/><br/>
                Low χ² → uniform → suspicious.<br/>
                High χ² → biased → likely clean.
              </>},
              {t:"Real-World Use",b:<>
                • <code>Steghide</code> — hide files in JPEGs<br/>
                • <code>zsteg</code> — CTF PNG analysis<br/>
                • <code>StegSolve</code> — bit plane viewer<br/>
                • <code>Binwalk</code> — firmware analysis<br/><br/>
                This project demonstrates all core concepts used in digital forensics & CTF steganography challenges.
              </>},
            ].map((c,i)=>(
              <div key={i} className="icard">
                <div className="ict">{c.t}</div>
                <div className="icb">{c.b}</div>
              </div>
            ))}
          </div>
        </>)}

        <div className="foot">
          STEGA::CIPHER <em>v3.0</em> · LSB+AES256+Steganalysis · Cybersecurity Portfolio · <em>Mano</em> · 2025
        </div>
      </div>
    </>
  );
}
