export type Player = 'red' | 'black'
export type PieceKind = 'man' | 'king'

export interface Piece {
  player: Player
  kind: PieceKind
}

export type Board = (Piece | null)[][]

export interface Position {
  row: number
  col: number
}

export interface Move {
  from: Position
  to: Position
  captured: Position[]
}

export function createBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null))
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1)
        board[r][c] = { player: 'black', kind: 'man' }
  for (let r = 5; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1)
        board[r][c] = { player: 'red', kind: 'man' }
  return board
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8
}

function cloneBoard(board: Board): Board {
  return board.map((r) => [...r])
}

// 단일 말의 점프 체인을 재귀로 탐색
function findJumpChains(
  board: Board,
  row: number,
  col: number,
  piece: Piece,
  capturedSoFar: Position[],
  fromPos: Position,
): Move[] {
  const results: Move[] = []
  const allDirs: [number, number][] = [[-1,-1],[-1,1],[1,-1],[1,1]]

  for (const [dr, dc] of allDirs) {
    if (piece.kind === 'man') {
      const forward = piece.player === 'red' ? -1 : 1
      // man은 앞으로만 점프 (단, 잡기는 뒤로도 가능한 변형 규칙 있으나 표준은 앞만)
      if (dr !== forward) continue
    }

    if (piece.kind === 'man') {
      const mr = row + dr, mc = col + dc
      const lr = row + dr * 2, lc = col + dc * 2
      if (!inBounds(lr, lc)) continue
      const mid = board[mr][mc]
      if (!mid || mid.player === piece.player) continue
      // 이미 잡은 말인지 확인
      if (capturedSoFar.some((p) => p.row === mr && p.col === mc)) continue
      if (board[lr][lc] !== null) continue

      const newCaptured = [...capturedSoFar, { row: mr, col: mc }]
      const tempBoard = cloneBoard(board)
      tempBoard[mr][mc] = null
      tempBoard[lr][lc] = piece
      tempBoard[row][col] = null

      const further = findJumpChains(tempBoard, lr, lc, piece, newCaptured, fromPos)
      if (further.length > 0) {
        results.push(...further)
      } else {
        results.push({ from: fromPos, to: { row: lr, col: lc }, captured: newCaptured })
      }
    } else {
      // king: 대각선 여러 칸 너머 점프
      let step = 1
      let foundEnemy: Position | null = null

      while (inBounds(row + dr * step, col + dc * step)) {
        const mr = row + dr * step
        const mc = col + dc * step
        const target = board[mr][mc]

        if (foundEnemy === null) {
          if (target !== null) {
            if (target.player === piece.player) break
            if (capturedSoFar.some((p) => p.row === mr && p.col === mc)) break
            foundEnemy = { row: mr, col: mc }
          }
        } else {
          if (target !== null) break

          const newCaptured = [...capturedSoFar, foundEnemy]
          const tempBoard = cloneBoard(board)
          tempBoard[foundEnemy.row][foundEnemy.col] = null
          tempBoard[mr][mc] = piece
          tempBoard[row][col] = null

          const further = findJumpChains(tempBoard, mr, mc, piece, newCaptured, fromPos)
          if (further.length > 0) {
            results.push(...further)
          } else {
            results.push({ from: fromPos, to: { row: mr, col: mc }, captured: newCaptured })
          }
        }
        step++
      }
    }
  }

  return results
}

export function getLegalMoves(board: Board, player: Player): Move[] {
  const jumps: Move[] = []
  const simple: Move[] = []

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (!piece || piece.player !== player) continue

      const pieceJumps = findJumpChains(board, r, c, piece, [], { row: r, col: c })
      jumps.push(...pieceJumps)

      if (piece.kind === 'man') {
        const forward = player === 'red' ? -1 : 1
        for (const dc of [-1, 1]) {
          const nr = r + forward, nc = c + dc
          if (inBounds(nr, nc) && board[nr][nc] === null)
            simple.push({ from: { row: r, col: c }, to: { row: nr, col: nc }, captured: [] })
        }
      } else {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]] as [number,number][]) {
          let nr = r + dr, nc = c + dc
          while (inBounds(nr, nc) && board[nr][nc] === null) {
            simple.push({ from: { row: r, col: c }, to: { row: nr, col: nc }, captured: [] })
            nr += dr
            nc += dc
          }
        }
      }
    }
  }

  return jumps.length > 0 ? jumps : simple
}

export function applyMove(board: Board, move: Move): Board {
  const next = cloneBoard(board)
  const piece = next[move.from.row][move.from.col]!

  const promoted =
    (piece.player === 'red' && move.to.row === 0) ||
    (piece.player === 'black' && move.to.row === 7)

  next[move.to.row][move.to.col] = promoted
    ? { player: piece.player, kind: 'king' }
    : piece
  next[move.from.row][move.from.col] = null
  move.captured.forEach(({ row, col }) => { next[row][col] = null })

  return next
}

export function checkWinner(board: Board, currentPlayer: Player): Player | null {
  const opponent: Player = currentPlayer === 'red' ? 'black' : 'red'
  return getLegalMoves(board, opponent).length === 0 ? currentPlayer : null
}