export type Player = 'cho' | 'han'
export type PieceType = 'king' | 'guard' | 'elephant' | 'horse' | 'chariot' | 'cannon' | 'soldier'

export interface Piece {
  type: PieceType
  player: Player
}

export type Board = (Piece | null)[][]

export interface Position {
  row: number
  col: number
}

export function createBoard(): Board {
  const board: Board = Array.from({ length: 10 }, () => Array(9).fill(null))

  const backRow: PieceType[] = ['chariot', 'elephant', 'horse', 'guard', null as any, 'guard', 'elephant', 'horse', 'chariot']

  backRow.forEach((type, col) => {
    if (!type) return
    board[0][col] = { type, player: 'han' }
    board[9][col] = { type, player: 'cho' }
  })

  board[1][4] = { type: 'king', player: 'han' }
  board[8][4] = { type: 'king', player: 'cho' }

  board[2][1] = { type: 'cannon', player: 'han' }
  board[2][7] = { type: 'cannon', player: 'han' }
  board[7][1] = { type: 'cannon', player: 'cho' }
  board[7][7] = { type: 'cannon', player: 'cho' }

  const soldierCols = [0, 2, 4, 6, 8]
  soldierCols.forEach((col) => {
    board[3][col] = { type: 'soldier', player: 'han' }
    board[6][col] = { type: 'soldier', player: 'cho' }
  })

  return board
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < 10 && col >= 0 && col < 9
}

const PALACE: Record<Player, { rowMin: number; rowMax: number }> = {
  han: { rowMin: 0, rowMax: 2 },
  cho: { rowMin: 7, rowMax: 9 },
}

function inPalace(row: number, col: number, player: Player): boolean {
  const { rowMin, rowMax } = PALACE[player]
  return row >= rowMin && row <= rowMax && col >= 3 && col <= 5
}

export function getLegalMoves(board: Board, row: number, col: number): Position[] {
  const piece = board[row][col]
  if (!piece) return []

  const moves: Position[] = []

  function canLand(r: number, c: number): boolean {
    if (!inBounds(r, c)) return false
    const target = board[r][c]
    return target === null || target.player !== piece!.player
  }

  switch (piece.type) {
    case 'king':
    case 'guard': {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]
      for (const [dr, dc] of dirs) {
        const nr = row + dr
        const nc = col + dc
        if (inPalace(nr, nc, piece.player) && canLand(nr, nc)) {
          moves.push({ row: nr, col: nc })
        }
      }
      break
    }

    case 'chariot': {
      // 직선 이동
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]]
      for (const [dr, dc] of dirs) {
        let nr = row + dr
        let nc = col + dc
        while (inBounds(nr, nc)) {
          const target = board[nr][nc]
          if (target !== null) {
            if (target.player !== piece.player) moves.push({ row: nr, col: nc })
            break
          }
          moves.push({ row: nr, col: nc })
          nr += dr
          nc += dc
        }
      }
      // 궁 대각선
      const palaceDiags: [number, number, number, number, number, number][] = [
        [0,3,1,4,2,5],[2,5,1,4,0,3],
        [0,5,1,4,2,3],[2,3,1,4,0,5],
        [7,3,8,4,9,5],[9,5,8,4,7,3],
        [7,5,8,4,9,3],[9,3,8,4,7,5],
      ]
      for (const [r1,c1,mr,mc,r2,c2] of palaceDiags) {
        if (row === r1 && col === c1) {
          if (board[mr][mc] === null && canLand(r2, c2)) {
            moves.push({ row: r2, col: c2 })
          }
        }
      }
      break
    }

    case 'cannon': {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]]
      for (const [dr, dc] of dirs) {
        let nr = row + dr
        let nc = col + dc
        let jumped = false

        while (inBounds(nr, nc)) {
          const target = board[nr][nc]
          if (!jumped) {
            if (target !== null) {
              // 포는 포를 넘을 수 없음
              if (target.type === 'cannon') break
              jumped = true
            }
          } else {
            if (target !== null) {
              // 포는 포를 잡을 수 없음
              if (target.type === 'cannon') break
              if (target.player !== piece.player) {
                moves.push({ row: nr, col: nc })
              }
              break
            }
            moves.push({ row: nr, col: nc })
          }
          nr += dr
          nc += dc
        }
      }
      break
    }

    case 'horse': {
      const steps: [number, number, number, number][] = [
        [-1,0,-2,-1],[-1,0,-2,1],
        [1,0,2,-1],[1,0,2,1],
        [0,-1,-1,-2],[0,-1,1,-2],
        [0,1,-1,2],[0,1,1,2],
      ]
      for (const [dr1, dc1, dr2, dc2] of steps) {
        const mr = row + dr1, mc = col + dc1
        if (!inBounds(mr, mc) || board[mr][mc] !== null) continue
        const nr = row + dr2, nc = col + dc2
        if (canLand(nr, nc)) moves.push({ row: nr, col: nc })
      }
      break
    }

    case 'elephant': {
      const steps: [number, number, number, number, number, number][] = [
        [-1,0,-2,-1,-3,-2],[-1,0,-2,1,-3,2],
        [1,0,2,-1,3,-2],[1,0,2,1,3,2],
        [0,-1,-1,-2,-2,-3],[0,-1,1,-2,2,-3],
        [0,1,-1,2,-2,3],[0,1,1,2,2,3],
      ]
      for (const [dr1,dc1,dr2,dc2,dr3,dc3] of steps) {
        const m1r = row+dr1, m1c = col+dc1
        const m2r = row+dr2, m2c = col+dc2
        const nr = row+dr3, nc = col+dc3
        if (!inBounds(m1r,m1c) || board[m1r][m1c] !== null) continue
        if (!inBounds(m2r,m2c) || board[m2r][m2c] !== null) continue
        if (canLand(nr, nc)) moves.push({ row: nr, col: nc })
      }
      break
    }

    case 'soldier': {
      const forward = piece.player === 'cho' ? -1 : 1
      const dirs: [number, number][] = [[forward, 0],[0, 1],[0, -1]]
      // 궁 안에서 대각선
      const opponent: Player = piece.player === 'cho' ? 'han' : 'cho'
      if (inPalace(row, col, opponent)) {
        dirs.push([forward, 1], [forward, -1])
      }
      for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc
        if (canLand(nr, nc)) moves.push({ row: nr, col: nc })
      }
      break
    }
  }

  return moves
}

export function isInCheck(board: Board, player: Player): boolean {
  let kingPos: Position | null = null
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.type === 'king' && board[r][c]?.player === player) {
        kingPos = { row: r, col: c }
      }
    }
  }
  if (!kingPos) return false

  const opponent: Player = player === 'cho' ? 'han' : 'cho'
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.player !== opponent) continue
      const moves = getLegalMoves(board, r, c)
      if (moves.some((m) => m.row === kingPos!.row && m.col === kingPos!.col)) return true
    }
  }
  return false
}

export function applyMove(board: Board, from: Position, to: Position): Board {
  const next = board.map((r) => [...r])
  next[to.row][to.col] = next[from.row][from.col]
  next[from.row][from.col] = null
  return next
}

export function isCheckmate(board: Board, player: Player): boolean {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.player !== player) continue
      const moves = getLegalMoves(board, r, c)
      for (const move of moves) {
        const next = applyMove(board, { row: r, col: c }, move)
        if (!isInCheck(next, player)) return false
      }
    }
  }
  return true
}