/**
 * Desenhos (ícones) usados nos cards, feitos à mão para não depender
 * de biblioteca externa. Para usar um novo, adicione aqui e cite o
 * nome no campo `icone` de src/areas.js.
 */

const base = {
  width: 21,
  height: 21,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const ICONES = {
  mercado: (
    <svg {...base}>
      <path d="M3 21h18" />
      <path d="M5 21V9l7-5 7 5v12" />
      <path d="M9.5 21v-5h5v5" />
    </svg>
  ),

  pessoas: (
    <svg {...base}>
      <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
      <circle cx="10" cy="8" r="3.4" />
      <path d="M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4" />
      <path d="M15.5 4.9a3.4 3.4 0 0 1 0 6.2" />
    </svg>
  ),

  projetos: (
    <svg {...base}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M8 13h3.5M8 16h6" />
    </svg>
  ),

  presidencia: (
    <svg {...base}>
      <path d="M3.5 8l3.8 3.2L12 5l4.7 6.2L20.5 8l-1.6 10H5.1z" />
      <path d="M5.1 21h13.8" />
    </svg>
  ),

  diretoria: (
    <svg {...base}>
      <path d="M12 3l8 4v5.2c0 4.3-3.2 7.6-8 8.8-4.8-1.2-8-4.5-8-8.8V7z" />
      <path d="M9.2 12.2l2 2 3.6-3.8" />
    </svg>
  ),

  grafico: (
    <svg {...base}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 15l4-5 3.5 3L21 6" />
    </svg>
  ),

  megafone: (
    <svg {...base}>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l6 4.2V5.8L8 10z" />
      <path d="M17.5 8.5a5 5 0 0 1 0 7" />
    </svg>
  ),

  engrenagem: (
    <svg {...base}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),

  aperto: (
    <svg {...base}>
      <path d="M11 6.5l-2-1.4a2 2 0 0 0-2.3.1L3 8v7l2 1.6" />
      <path d="M13 6.5l2-1.4a2 2 0 0 1 2.3.1L21 8v7l-2 1.6" />
      <path d="M8 15.5l2.6 2.2a1.7 1.7 0 0 0 2.3-.1l3.6-3.7" />
      <path d="M8 11.8l2.4-2.2a1.6 1.6 0 0 1 2 -.1l2.2 1.6" />
    </svg>
  ),

  relogio: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
}
