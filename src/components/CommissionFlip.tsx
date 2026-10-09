import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

/**
 * Police matricielle 5×7 — chaque glyphe est une ligne de 7 bits.
 * Les bits sont lus de gauche à droite via `(1 << (4 - x))`.
 */
const GLYPHS: Record<string, number[]> = {
  '0': [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  '3': [0b01110, 0b10001, 0b00001, 0b00110, 0b00001, 0b10001, 0b01110],
  '4': [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  '5': [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  '6': [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

const GLYPH_W = 5;
const GLYPH_H = 7;
const ADVANCE = GLYPH_W + 1;

/**
 * Convertit une chaîne en matrice de cellules allumées.
 * Le texte est centré dans la grille.
 */
const renderText = (text: string, cols: number, rows: number): boolean[][] => {
  const grid = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));
  const chars = text.toUpperCase().split('');
  const totalW = chars.length * ADVANCE - 1;

  let ox = Math.max(0, Math.floor((cols - totalW) / 2));
  const oy = Math.max(0, Math.floor((rows - GLYPH_H) / 2));

  for (const char of chars) {
    const bits = GLYPHS[char] ?? GLYPHS[' '];
    for (let y = 0; y < GLYPH_H; y++) {
      for (let x = 0; x < GLYPH_W; x++) {
        const cy = oy + y;
        const cx = ox + x;
        if (cy < rows && cx < cols) {
          grid[cy][cx] = Boolean(bits[y] & (1 << (GLYPH_W - 1 - x)));
        }
      }
    }
    ox += ADVANCE;
  }

  return grid;
};

const gridsEqual = (a: boolean[][], b: boolean[][]): boolean =>
  a.every((row, y) => row.every((cell, x) => cell === b[y][x]));

/** Un disque qui bascule de 0° à 180° en 3D. */
const FlipDisk = memo(({ on, delay }: { on: boolean; delay: number }) => (
  <div className="flip-disk" style={{ transitionDelay: `${delay}ms` }}>
    <div className="flip-disk-inner" style={{ transform: on ? 'rotateX(180deg)' : 'rotateX(0deg)' }}>
      <span className="flip-disk-face is-front" />
      <span className="flip-disk-face is-back" />
    </div>
  </div>
));
FlipDisk.displayName = 'FlipDisk';

interface CommissionFlipProps {
  /** Valeur finale à afficher. */
  value: number;
  /** Durée du comptage, en secondes. */
  duration?: number;
  cols?: number;
  rows?: number;
}

/**
 * Afficheur à disques basculants (split-flap).
 *
 * Le compteur part de 0 et progresse jusqu'à la valeur, chaque chiffre
 * changeant disque par disque. L'information reste lisible même si
 * l'animation ne se joue pas (le rendu final est déjà correct).
 */
const CommissionFlip: React.FC<CommissionFlipProps> = ({
  value,
  duration = 2.4,
  cols = 37,
  rows = 9,
}) => {
  const [digits, setDigits] = useState<string>('0'.repeat(String(value).length));
  const previous = useRef<string>(digits);

  // Comptage déterministe piloté par rAF : rejouable et interruptible,
  // contrairement à un simple setTimeout.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = String(value);

    if (reduce) {
      previous.current = target;
      setDigits(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const ms = duration * 1000;
    const from = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      // easeOutExpo : l'essentiel du trajet se fait tôt, la fin est lisible
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -9 * p);
      const current = Math.round(from + (value - from) * eased);
      const text = String(current).padStart(target.length, '0');

      if (text !== previous.current) {
        previous.current = text;
        setDigits(text);
      }

      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  // Grille du montant courant. « FCFA » est rendu à côté en HTML :
  // l'inscrire dans la grille exigerait 65 colonnes et rendrait les
  // disques trop petits pour être lus.
  const current = useCallback(
    (text: string) => renderText(text, cols, rows),
    [cols, rows]
  );

  const bits = current(digits);

  // Les positions qui changent basculent ; les autres restent immobiles.
  const prevBits = useRef<boolean[][]>(bits);
  const prevText = useRef<string>(digits);

  const flipped: boolean[][] = bits.map((row, y) =>
    row.map((on, x) => (prevBits.current[y]?.[x] !== on ? true : false))
  );

  useEffect(() => {
    prevBits.current = bits;
    prevText.current = digits;
  }, [bits, digits]);

  void prevText;

  return (
    <div className="flip-display">
      <div className="flip-board" aria-live="off">
        <div
          className="flip-board-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 'clamp(1px, 0.45vw, 4px)',
          }}
        >
          {bits.map((row, y) =>
            row.map((on, x) => (
              <FlipDisk
                key={`${x}-${y}`}
                on={on}
                delay={flipped[y][x] ? (x % 7) * 12 : 0}
              />
            ))
          )}
        </div>
      </div>
      <span className="flip-currency">FCFA</span>
    </div>
  );
};

export default CommissionFlip;