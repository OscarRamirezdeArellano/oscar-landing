/**
 * Minimal 5-row monospace ASCII font for figlet command.
 * Supports A-Z, 0-9, space, dash, period, exclamation, question.
 * Each char is 4 columns wide + 1 column padding.
 */

// Each entry is 5 rows × 4 cols. Use '#' for fill, '.' for empty.
const RAW = `
A:
.##.
#..#
####
#..#
#..#

B:
###.
#..#
###.
#..#
###.

C:
.###
#...
#...
#...
.###

D:
###.
#..#
#..#
#..#
###.

E:
####
#...
###.
#...
####

F:
####
#...
###.
#...
#...

G:
.###
#...
#.##
#..#
.##.

H:
#..#
#..#
####
#..#
#..#

I:
###.
.#..
.#..
.#..
###.

J:
..##
...#
...#
#..#
.##.

K:
#..#
#.#.
##..
#.#.
#..#

L:
#...
#...
#...
#...
####

M:
#..#
####
####
#..#
#..#

N:
#..#
##.#
####
#.##
#..#

O:
.##.
#..#
#..#
#..#
.##.

P:
###.
#..#
###.
#...
#...

Q:
.##.
#..#
#..#
#.##
.###

R:
###.
#..#
###.
#.#.
#..#

S:
.###
#...
.##.
...#
###.

T:
####
.#..
.#..
.#..
.#..

U:
#..#
#..#
#..#
#..#
.##.

V:
#..#
#..#
#..#
.##.
..#.

W:
#..#
#..#
####
####
#..#

X:
#..#
.##.
.#..
.##.
#..#

Y:
#..#
#..#
.##.
.#..
.#..

Z:
####
...#
.##.
#...
####

0:
.##.
#..#
#..#
#..#
.##.

1:
.#..
##..
.#..
.#..
###.

2:
.##.
#..#
..#.
.#..
####

3:
###.
...#
.##.
...#
###.

4:
#..#
#..#
####
...#
...#

5:
####
#...
###.
...#
###.

6:
.###
#...
###.
#..#
.##.

7:
####
...#
..#.
.#..
.#..

8:
.##.
#..#
.##.
#..#
.##.

9:
.##.
#..#
.###
...#
###.

 :
....
....
....
....
....

-:
....
....
####
....
....

.:
....
....
....
....
.#..

!:
.#..
.#..
.#..
....
.#..

?:
###.
...#
.##.
....
.#..
`;

function parse(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const blocks = RAW.split(/\n\n/);
  for (const block of blocks) {
    const lines = block.split('\n').filter(Boolean);
    if (lines.length < 6) continue;
    const header = lines[0];
    if (!header.endsWith(':')) continue;
    const char = header[0] === ' ' ? ' ' : header.slice(0, 1);
    out[char] = lines.slice(1, 6);
  }
  return out;
}

const FONT = parse();

/**
 * Render text as 5-row ASCII art. Returns a string with embedded newlines.
 */
export function figletize(text: string): string {
  const chars = text.toUpperCase().split('');
  const rows: string[] = ['', '', '', '', ''];
  for (const ch of chars) {
    const glyph = FONT[ch] ?? FONT['?'];
    for (let r = 0; r < 5; r++) {
      const line = (glyph[r] ?? '....').replace(/\./g, ' ').replace(/#/g, '█');
      rows[r] += line + ' ';
    }
  }
  return rows.join('\n');
}
