export type Cell = 'black' | 'white' | null
export type Board = Cell[][]

export function createBoard(size: number): Board {
  return Array.from({ length: size }, () => Array(size).fill(null))
}

function getNeighbors(row: number, col: number, size: number): [number, number][] {
  return ([
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ] as [number, number][]).filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size)
}

function getGroup(
  board: Board,
  row: number,
  col: number,
  size: number,
): { stones: [number, number][]; liberties: [number, number][] } {
  const color = board[row][col]
  if (!color) return { stones: [], liberties: [] }

  const visited = new Set<string>()
  const liberties = new Set<string>()
  const stones: [number, number][] = []
  const queue: [number, number][] = [[row, col]]

  while (queue.length > 0) {
    const [r, c] = queue.pop()!
    const key = `${r},${c}`
    if (visited.has(key)) continue
    visited.add(key)
    stones.push([r, c])

    for (const [nr, nc] of getNeighbors(r, c, size)) {
      const nkey = `${nr},${nc}`
      if (board[nr][nc] === null) {
        liberties.add(nkey)
      } else if (board[nr][nc] === color && !visited.has(nkey)) {
        queue.push([nr, nc])
      }
    }
  }

  return {
    stones,
    liberties: [...liberties].map((k) => k.split(',').map(Number) as [number, number]),
  }
}

export function applyMove(
  board: Board,
  row: number,
  col: number,
  player: Cell,
  size: number,
  prevBoardJson: string | null,
): { nextBoard: Board; captured: number } | null {
  if (!player || board[row][col] !== null) return null

  const next = board.map((r) => [...r])
  next[row][col] = player

  const opponent: Cell = player === 'black' ? 'white' : 'black'
  let captured = 0

  for (const [nr, nc] of getNeighbors(row, col, size)) {
    if (next[nr][nc] === opponent) {
      const group = getGroup(next, nr, nc, size)
      if (group.liberties.length === 0) {
        captured += group.stones.length
        for (const [sr, sc] of group.stones) {
          next[sr][sc] = null
        }
      }
    }
  }

  const myGroup = getGroup(next, row, col, size)
  if (myGroup.liberties.length === 0) return null

  // 패 규칙
  if (prevBoardJson && JSON.stringify(next) === prevBoardJson) return null

  return { nextBoard: next, captured }
}

export function calculateScore(
  board: Board,
  size: number,
  capturedBlack: number,
  capturedWhite: number,
  komi: number,
): { black: number; white: number } {
  const territory = { black: 0, white: 0 }
  const visited = new Set<string>()

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== null || visited.has(`${r},${c}`)) continue

      const queue: [number, number][] = [[r, c]]
      const region: [number, number][] = []
      const borders = new Set<Cell>()

      while (queue.length > 0) {
        const [cr, cc] = queue.pop()!
        const key = `${cr},${cc}`
        if (visited.has(key)) continue
        visited.add(key)
        region.push([cr, cc])

        for (const [nr, nc] of getNeighbors(cr, cc, size)) {
          if (board[nr][nc] === null && !visited.has(`${nr},${nc}`)) {
            queue.push([nr, nc])
          } else if (board[nr][nc] !== null) {
            borders.add(board[nr][nc])
          }
        }
      }

      if (borders.size === 1) {
        const owner = [...borders][0]!
        territory[owner] += region.length
      }
    }
  }

  return {
    black: territory.black + capturedWhite,
    white: territory.white + capturedBlack + komi,
  }
}