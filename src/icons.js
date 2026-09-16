// SVG Icon helper for HTML templates with built-in safe default dimensions
export function icon(name, className = 'w-4 h-4') {
  let size = 20;
  if (className.includes('w-3') || className.includes('h-3')) size = 12;
  else if (className.includes('w-4') || className.includes('h-4')) size = 16;
  else if (className.includes('w-5') || className.includes('h-5')) size = 20;
  else if (className.includes('w-6') || className.includes('h-6')) size = 24;
  else if (className.includes('w-8') || className.includes('h-8')) size = 32;

  const baseSvg = (innerSvg) => `<svg class="${className}" width="${size}" height="${size}" style="display:inline-block;vertical-align:middle;flex-shrink:0;max-width:100%;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${innerSvg}</svg>`;

  switch (name) {
    case 'heart-pulse':
      return baseSvg(`<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>`);
    case 'calendar':
      return baseSvg(`<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>`);
    case 'file-text':
      return baseSvg(`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`);
    case 'pill':
      return baseSvg(`<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>`);
    case 'credit-card':
      return baseSvg(`<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`);
    case 'building':
      return baseSvg(`<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>`);
    case 'search':
      return baseSvg(`<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`);
    case 'bell':
      return baseSvg(`<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`);
    case 'chevron':
      return baseSvg(`<path d="m6 9 6 6 6-6"/>`);
    case 'user':
      return baseSvg(`<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`);
    case 'stethoscope':
      return baseSvg(`<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>`);
    case 'logout':
      return baseSvg(`<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>`);
    case 'menu':
      return baseSvg(`<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`);
    case 'clock':
      return baseSvg(`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`);
    case 'map-pin':
      return baseSvg(`<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`);
    case 'check':
      return baseSvg(`<polyline points="20 6 9 17 4 12"/>`);
    case 'eye':
      return baseSvg(`<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`);
    case 'dashboard':
    default:
      return baseSvg(`<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>`);
  }
}
