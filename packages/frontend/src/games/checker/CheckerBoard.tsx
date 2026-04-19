import type { Board, Move, Position } from './CheckerGame'

interface CheckerBoardProps {
  board: Board
  legalMoves: Move[]
  selectedFrom: Position | null
  onSelect: (pos: Position) => void
  lastMove: Move | null
}

const CELL = 72

export default function CheckerBoard({ board, legalMoves, selectedFrom, onSelect, lastMove }: CheckerBoardProps) {
  const selectablePieces = new Set(legalMoves.map((m) => `${m.from.row},${m.from.col}`))
  const reachable = selectedFrom
    ? legalMoves
        .filter((m) => m.from.row === selectedFrom.row && m.from.col === selectedFrom.col)
        .map((m) => `${m.to.row},${m.to.col}`)
    : []

  return (
    <div className="overflow-auto">
      <div style={{ display: 'inline-block', border: '3px solid #6B3A1F', borderRadius: 8, overflow: 'hidden' }}>
        {Array.from({ length: 8 }).map((_, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {Array.from({ length: 8 }).map((_, c) => {
              const isDark = (r + c) % 2 === 1
              const piece = board[r][c]
              const posKey = `${r},${c}`
              const isSelectable = selectablePieces.has(posKey)
              const isSelected = selectedFrom?.row === r && selectedFrom?.col === c
              const isReachable = reachable.includes(posKey)
              const isLastFrom = lastMove && lastMove.from.row === r && lastMove.from.col === c
              const isLastTo = lastMove && lastMove.to.row === r && lastMove.to.col === c

              const bgColor = isDark
                ? isSelected
                  ? '#aed481'
                  : isLastFrom || isLastTo
                  ? '#baca2b'
                  : '#6B3A1F'
                : '#F5EFE6'

              return (
                <div
                  key={c}
                  onClick={() => onSelect({ row: r, col: c })}
                  style={{
                    width: CELL,
                    height: CELL,
                    background: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: (isSelectable || isReachable) ? 'pointer' : 'default',
                    position: 'relative',
                  }}
                >
                  {isReachable && !piece && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.4)',
                    }} />
                  )}
                  {piece && (
                    <div style={{
                      width: CELL - 16,
                      height: CELL - 16,
                      borderRadius: '50%',
                      background: piece.player === 'red' ? '#C0392B' : '#2C2C2A',
                      border: isSelectable
                        ? '3px solid #aed481'
                        : isReachable
                        ? '3px solid rgba(255,255,255,0.6)'
                        : '3px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {piece.kind === 'king' && (
                        <span style={{ fontSize: 24, color: '#FFD700', userSelect: 'none' }}>♛</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}