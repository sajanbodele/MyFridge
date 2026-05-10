import React from 'react';

/* ─── Style definitions ────────────────────────────────────────────────── */
const FRIDGE_STYLES = {
  glossy_white: {
    /* door surface */
    doorBg: 'linear-gradient(160deg,  #f9f9f9 0%,  #ffffff 30%,  #f2f2f2 60%,  #e8e8e8 100%)',
    borderColor: ' rgba(180,180,180,0.55)',
    /* top lighting */
    topLight: 'radial-gradient(ellipse 90% 35% at 50% 0%,  rgba(255,255,255,0.95) 0%,  rgba(255,255,255,0.3) 50%, transparent 100%)',
    /* subtle left column light catch */
    leftLight: 'linear-gradient(to right,  rgba(255,255,255,0.55) 0%,  rgba(255,255,255,0.08) 40%, transparent 100%)',
    /* right edge darkens gently */
    rightDark: 'linear-gradient(to left,  rgba(0,0,0,0.06) 0%, transparent 100%)',
    /* bottom floor shadow */
    bottomShadow: 'linear-gradient(to top,  rgba(0,0,0,0.07) 0%, transparent 100%)',
    /* inset bevel */
    insetShadow: 'inset 0 2px 4px  rgba(255,255,255,0.85), inset 0 -3px 8px  rgba(0,0,0,0.06), inset 3px 0 6px  rgba(255,255,255,0.4)',
    /* outer drop shadow */
    outerShadow: '10px 0 50px  rgba(0,0,0,0.14), -6px 0 30px  rgba(0,0,0,0.08), 0 8px 40px  rgba(0,0,0,0.10)',
    /* handle */
    handleBg: 'linear-gradient(to right,  #b0b0b0 0%,  #e8e8e8 25%,  #ffffff 45%,  #d4d4d4 70%,  #909090 100%)',
    handleInset: 'inset 0 1px 3px  rgba(255,255,255,0.9), inset 0 -1px 3px  rgba(0,0,0,0.25), inset 3px 0 6px  rgba(255,255,255,0.5)',
    handleShadow: '4px 0 18px  rgba(0,0,0,0.28), -2px 0 8px  rgba(0,0,0,0.12)',
    brushed: false,
    grain: true,