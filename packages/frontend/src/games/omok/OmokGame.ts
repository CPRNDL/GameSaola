export const BOARD_SIZE = 15

export type Cell = 'black' | 'white' | null
export type Board = Cell[][]

export function createBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null))
}

export function checkWinner(board: Board, row: number, col: number, player: Cell): boolean {
  if (!player) return false

  const directions = [
    [0, 1],   // 가로
    [1, 0],   // 세로
    [1, 1],   // 대각선 ↘
    [1, -1],  // 대각선 ↙
  ]

  for (const [dr, dc] of directions) {
    let count = 1

    // 정방향
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break
      if (board[r][c] !== player) break
      count++
    }

    // 역방향
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i
      const c = col - dc * i
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break
      if (board[r][c] !== player) break
      count++
    }

    if (count >= 5) return true
  }

  return false
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null))
}