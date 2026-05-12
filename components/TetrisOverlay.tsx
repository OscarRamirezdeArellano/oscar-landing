'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '@/lib/types';

/**
 * `tetris` — playable Tetris.
 *
 * Standard rules: 10×20 grid, 7 piece types, line clears, scoring by
 * Nintendo's NES table, increasing fall speed by level.
 *
 * Controls:
 *   ← →  move
 *   ↓    soft drop
 *   ↑ X  rotate clockwise
 *   Z    rotate counter-clockwise
 *   Space hard drop
 *   P    pause
 *   ESC  exit
 */

const COLS = 10;
const ROWS = 20;

// 0 = empty cell. Otherwise a "color id" 1-7.
type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Board = Cell[][];

type PieceKey = 'I' | 'O' | 'T' | 'S' | 'Z' | 'L' | 'J';

// Each piece is defined by its base shape (rotation 0). Rotations computed.
const PIECES: Record<PieceKey, { color: Cell; shape: number[][] }> = {
  I: { color: 1, shape: [[1, 1, 1, 1]] },
  O: { color: 2, shape: [[1, 1], [1, 1]] },
  T: { color: 3, shape: [[0, 1, 0], [1, 1, 1]] },
  S: { color: 4, shape: [[0, 1, 1], [1, 1, 0]] },
  Z: { color: 5, shape: [[1, 1, 0], [0, 1, 1]] },
  L: { color: 6, shape: [[0, 0, 1], [1, 1, 1]] },
  J: { color: 7, shape: [[1, 0, 0], [1, 1, 1]] },
};

const COLORS: Record<Cell, string> = {
  0: 'transparent',
  1: '#00d9ff', // I — cyan
  2: '#ffd700', // O — yellow/gold
  3: '#bb9af7', // T — purple
  4: '#9ece6a', // S — green
  5: '#f7768e', // Z — pink/red
  6: '#ff9e64', // L — orange
  7: '#7aa2f7', // J — blue
};

const PIECE_KEYS: PieceKey[] = ['I', 'O', 'T', 'S', 'Z', 'L', 'J'];

// NES scoring per line clear x level
const SCORE_PER_LINES: Record<number, number> = { 1: 40, 2: 100, 3: 300, 4: 1200 };

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
}

function rotateCW(shape: number[][]): number[][] {
  const r = shape.length;
  const c = shape[0].length;
  const out: number[][] = Array.from({ length: c }, () => Array(r).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      out[j][r - 1 - i] = shape[i][j];
    }
  }
  return out;
}

function rotateCCW(shape: number[][]): number[][] {
  return rotateCW(rotateCW(rotateCW(shape)));
}

type ActivePiece = {
  key: PieceKey;
  shape: number[][];
  x: number;
  y: number;
  color: Cell;
};

function spawnPiece(key: PieceKey): ActivePiece {
  const def = PIECES[key];
  return {
    key,
    shape: def.shape.map((row) => row.slice()),
    x: Math.floor((COLS - def.shape[0].length) / 2),
    y: 0,
    color: def.color,
  };
}

function randomKey(): PieceKey {
  return PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
}

function collides(board: Board, piece: ActivePiece, dx = 0, dy = 0, shape?: number[][]): boolean {
  const s = shape ?? piece.shape;
  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j < s[0].length; j++) {
      if (!s[i][j]) continue;
      const x = piece.x + j + dx;
      const y = piece.y + i + dy;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && board[y][x] !== 0) return true;
    }
  }
  return false;
}

function lockPiece(board: Board, piece: ActivePiece): Board {
  const out = board.map((row) => row.slice() as Cell[]);
  for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[0].length; j++) {
      if (!piece.shape[i][j]) continue;
      const x = piece.x + j;
      const y = piece.y + i;
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
        out[y][x] = piece.color;
      }
    }
  }
  return out;
}

function clearLines(board: Board): { board: Board; lines: number } {
  const kept = board.filter((row) => row.some((c) => c === 0));
  const cleared = ROWS - kept.length;
  const empties = Array.from({ length: cleared }, () => Array(COLS).fill(0) as Cell[]);
  return { board: [...empties, ...kept], lines: cleared };
}

export default function TetrisOverlay({ lang, onExit }: { lang: Lang; onExit: () => void }) {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [piece, setPiece] = useState<ActivePiece>(() => spawnPiece(randomKey()));
  const [next, setNext] = useState<PieceKey>(() => randomKey());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const level = Math.floor(lines / 10) + 1;
  const fallSpeed = Math.max(70, 700 - (level - 1) * 60);

  // Refs to read latest state inside event handlers
  const stateRef = useRef({ board, piece, next, score, lines, gameOver, paused });
  stateRef.current = { board, piece, next, score, lines, gameOver, paused };

  const newGame = useCallback(() => {
    setBoard(emptyBoard());
    setPiece(spawnPiece(randomKey()));
    setNext(randomKey());
    setScore(0);
    setLines(0);
    setGameOver(false);
    setPaused(false);
  }, []);

  const drop = useCallback((soft = false): boolean => {
    const { board: b, piece: p, gameOver: go, paused: pa } = stateRef.current;
    if (go || pa) return false;
    if (!collides(b, p, 0, 1)) {
      setPiece({ ...p, y: p.y + 1 });
      if (soft) setScore((s) => s + 1);
      return true;
    }
    // Lock piece
    const newBoard = lockPiece(b, p);
    const { board: cleared, lines: nLines } = clearLines(newBoard);
    setBoard(cleared);
    if (nLines > 0) {
      setLines((l) => l + nLines);
      setScore((s) => s + (SCORE_PER_LINES[nLines] ?? 0) * level);
    }
    // Spawn next piece
    const nextKey = stateRef.current.next;
    const nextPiece = spawnPiece(nextKey);
    if (collides(cleared, nextPiece)) {
      setGameOver(true);
      return false;
    }
    setPiece(nextPiece);
    setNext(randomKey());
    return false;
  }, [level]);

  const move = useCallback((dx: number) => {
    const { board: b, piece: p, gameOver: go, paused: pa } = stateRef.current;
    if (go || pa) return;
    if (!collides(b, p, dx, 0)) setPiece({ ...p, x: p.x + dx });
  }, []);

  const rotate = useCallback((dir: 1 | -1) => {
    const { board: b, piece: p, gameOver: go, paused: pa } = stateRef.current;
    if (go || pa) return;
    if (p.key === 'O') return; // O doesn't rotate
    const newShape = dir === 1 ? rotateCW(p.shape) : rotateCCW(p.shape);
    // Wall-kick attempts
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!collides(b, p, kick, 0, newShape)) {
        setPiece({ ...p, shape: newShape, x: p.x + kick });
        return;
      }
    }
  }, []);

  const hardDrop = useCallback(() => {
    const { board: b, piece: p, gameOver: go, paused: pa } = stateRef.current;
    if (go || pa) return;
    let dy = 0;
    while (!collides(b, p, 0, dy + 1)) dy++;
    setScore((s) => s + dy * 2);
    setPiece({ ...p, y: p.y + dy });
    // Trigger drop on next tick to lock
    setTimeout(() => drop(false), 16);
  }, [drop]);

  // === Drop loop ===
  useEffect(() => {
    if (gameOver || paused) return;
    const id = setInterval(() => drop(false), fallSpeed);
    return () => clearInterval(id);
  }, [gameOver, paused, fallSpeed, drop]);

  // === Keyboard ===
  useEffect(() => {
    let armed = false;
    const arm = setTimeout(() => { armed = true; }, 200);
    const handler = (e: KeyboardEvent) => {
      if (!armed) return;
      // Always allow ESC + restart
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }
      if (stateRef.current.gameOver) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          newGame();
        }
        return;
      }
      if (e.key === 'p' || e.key === 'P') { e.preventDefault(); setPaused((v) => !v); return; }
      if (stateRef.current.paused) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); move(-1); break;
        case 'ArrowRight': e.preventDefault(); move(1); break;
        case 'ArrowDown': e.preventDefault(); drop(true); break;
        case 'ArrowUp':
        case 'x':
        case 'X': e.preventDefault(); rotate(1); break;
        case 'z':
        case 'Z': e.preventDefault(); rotate(-1); break;
        case ' ': e.preventDefault(); hardDrop(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(arm);
      window.removeEventListener('keydown', handler);
    };
  }, [move, rotate, drop, hardDrop, newGame, onExit]);

  // Render board with current piece overlaid
  const display = useMemo(() => {
    const out = board.map((row) => row.slice() as Cell[]);
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[0].length; j++) {
        if (!piece.shape[i][j]) continue;
        const x = piece.x + j;
        const y = piece.y + i;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) out[y][x] = piece.color;
      }
    }
    return out;
  }, [board, piece]);

  // Ghost piece (preview where it lands)
  const ghost = useMemo(() => {
    let dy = 0;
    while (!collides(board, piece, 0, dy + 1)) dy++;
    return { ...piece, y: piece.y + dy };
  }, [board, piece]);

  const ghostCells = useMemo(() => {
    const cells: { x: number; y: number }[] = [];
    for (let i = 0; i < ghost.shape.length; i++) {
      for (let j = 0; j < ghost.shape[0].length; j++) {
        if (!ghost.shape[i][j]) continue;
        const x = ghost.x + j;
        const y = ghost.y + i;
        // Only show ghost where current piece isn't
        const isCurrent = piece.shape[i] && piece.shape[i][j] && piece.x + j === x && piece.y + i === y;
        if (!isCurrent && y < ROWS) cells.push({ x, y });
      }
    }
    return cells;
  }, [ghost, piece]);

  const nextDef = PIECES[next];

  return (
    <div className="tetris-overlay">
      <div className="tetris-titlebar">
        <span className="tetris-logo">▣ T E T R I S</span>
        <span className="tetris-subtitle">{lang === 'en' ? 'oscar.iqsit.com edition' : 'edición oscar.iqsit.com'}</span>
        <button className="tetris-exit-btn" onClick={onExit}>✕ ESC</button>
      </div>

      <div className="tetris-stage">
        <div className="tetris-board-wrap">
          <div className="tetris-board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {display.map((row, i) =>
              row.map((cell, j) => {
                const isGhost = cell === 0 && ghostCells.some((g) => g.x === j && g.y === i);
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`tetris-cell${cell ? ' filled' : ''}${isGhost ? ' ghost' : ''}`}
                    style={{
                      background: cell ? COLORS[cell] : 'transparent',
                      borderColor: isGhost ? 'rgba(0, 217, 255, 0.3)' : undefined,
                    }}
                  />
                );
              }),
            )}
          </div>
          {paused && !gameOver && (
            <div className="tetris-overlay-msg">
              <div>⏸ {lang === 'en' ? 'PAUSED' : 'PAUSA'}</div>
              <div className="tetris-msg-hint">{lang === 'en' ? 'Press P to resume' : 'P para continuar'}</div>
            </div>
          )}
          {gameOver && (
            <div className="tetris-overlay-msg">
              <div className="tetris-msg-big">GAME OVER</div>
              <div className="tetris-msg-stats">
                {lang === 'en' ? 'Score:' : 'Puntos:'} <span className="c-accent">{score}</span>
              </div>
              <div className="tetris-msg-stats">
                {lang === 'en' ? 'Lines:' : 'Líneas:'} <span className="c-accent">{lines}</span>
              </div>
              <button className="tetris-restart-btn" onClick={newGame}>
                ▸ {lang === 'en' ? 'Play again (Enter)' : 'Jugar otra vez (Enter)'}
              </button>
            </div>
          )}
        </div>

        <div className="tetris-sidebar">
          <div className="tetris-sidebar-section">
            <div className="tetris-label">{lang === 'en' ? 'SCORE' : 'PUNTOS'}</div>
            <div className="tetris-value tetris-value-big">{score.toLocaleString()}</div>
          </div>
          <div className="tetris-sidebar-row">
            <div className="tetris-sidebar-section">
              <div className="tetris-label">{lang === 'en' ? 'LEVEL' : 'NIVEL'}</div>
              <div className="tetris-value">{level}</div>
            </div>
            <div className="tetris-sidebar-section">
              <div className="tetris-label">{lang === 'en' ? 'LINES' : 'LÍNEAS'}</div>
              <div className="tetris-value">{lines}</div>
            </div>
          </div>
          <div className="tetris-sidebar-section">
            <div className="tetris-label">{lang === 'en' ? 'NEXT' : 'SIGUIENTE'}</div>
            <div
              className="tetris-next"
              style={{
                gridTemplateColumns: `repeat(${nextDef.shape[0].length}, 1fr)`,
                gridTemplateRows: `repeat(${nextDef.shape.length}, 1fr)`,
              }}
            >
              {nextDef.shape.flatMap((row, i) =>
                row.map((c, j) => (
                  <div
                    key={`n-${i}-${j}`}
                    className={`tetris-next-cell${c ? ' filled' : ''}`}
                    style={{ background: c ? COLORS[nextDef.color] : 'transparent' }}
                  />
                )),
              )}
            </div>
          </div>
          <div className="tetris-sidebar-section tetris-controls">
            <div className="tetris-label">{lang === 'en' ? 'CONTROLS' : 'CONTROLES'}</div>
            <div className="tetris-control-row"><kbd>←</kbd><kbd>→</kbd><span>{lang === 'en' ? 'move' : 'mover'}</span></div>
            <div className="tetris-control-row"><kbd>↑</kbd> / <kbd>X</kbd><span>{lang === 'en' ? 'rotate' : 'rotar'}</span></div>
            <div className="tetris-control-row"><kbd>Z</kbd><span>{lang === 'en' ? 'rotate ccw' : 'rotar ccw'}</span></div>
            <div className="tetris-control-row"><kbd>↓</kbd><span>{lang === 'en' ? 'soft drop' : 'caída suave'}</span></div>
            <div className="tetris-control-row"><kbd>space</kbd><span>{lang === 'en' ? 'hard drop' : 'caída total'}</span></div>
            <div className="tetris-control-row"><kbd>P</kbd><span>{lang === 'en' ? 'pause' : 'pausa'}</span></div>
            <div className="tetris-control-row"><kbd>ESC</kbd><span>{lang === 'en' ? 'exit' : 'salir'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
