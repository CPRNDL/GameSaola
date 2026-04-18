import type { Board, Position } from './JanggiGame'

interface JanggiBoardProps {
  board: Board
  selected: Position | null
  legalMoves: Position[]
  lastMove: [Position, Position] | null
  onSelect: (pos: Position) => void
}

const PIECE_LABEL: Record<string, Record<string, string>> = {
  cho: { king: '楚', guard: '士', elephant: '象', horse: '馬', chariot: '車', cannon: '包', soldier: '卒' },
  han: { king: '漢', guard: '士', elephant: '象', horse: '馬', chariot: '車', cannon: '砲', soldier: '兵' },
}

const CELL_W = 64
const CELL_H = 64

export default function JanggiBoard({ board, selected, legalMoves, lastMove, onSelect }: JanggiBoardProps) {
  const width = CELL_W * 8
  const height = CELL_H * 9

  function isSelected(r: number, c: number) {
    return selected?.row === r && selected?.col === c
  }

  function isLegal(r: number, c: number) {
    return legalMoves.some((m) => m.row === r && m.col === c)
  }

  function isLast(r: number, c: number) {
    return lastMove && (
      (lastMove[0].row === r && lastMove[0].col === c) ||
      (lastMove[1].row === r && lastMove[1].col === c)
    )
  }

  return (
    <div className="overflow-auto">
      <div
        style={{
          position: 'relative',
          width: width + CELL_W,
          height: height + CELL_H,
          background: '#C8956B',
          borderRadius: 8,
          padding: `${CELL_H / 2}px ${CELL_W / 2}px`,
        }}
      >
        <svg
          style={{ position: 'absolute', top: CELL_H / 2, left: CELL_W / 2 }}
          width={width}
          height={height}
        >
          {/* 격자 */}
          {Array.from({ length: 10 }).map((_, r) => (
            <line key={`h${r}`} x1={0} y1={r * CELL_H} x2={width} y2={r * CELL_H} stroke="#8B5E3C" strokeWidth={0.8} />
          ))}
          {Array.from({ length: 9 }).map((_, c) => (
            <line key={`v${c}`} x1={c * CELL_W} y1={0} x2={c * CELL_W} y2={height} stroke="#8B5E3C" strokeWidth={0.8} />
          ))}
          {/* 궁 대각선 */}
          {[
            [0,3,2,5],[0,5,2,3],
            [7,3,9,5],[7,5,9,3],
          ].map(([r1,c1,r2,c2], i) => (
            <line key={`palace${i}`}
              x1={c1*CELL_W} y1={r1*CELL_H}
              x2={c2*CELL_W} y2={r2*CELL_H}
              stroke="#8B5E3C" strokeWidth={0.8}
            />
          ))}
        </svg>

        {board.map((row, r) =>
          row.map((piece, c) => {
            const x = CELL_W / 2 + c * CELL_W
            const y = CELL_H / 2 + r * CELL_H
            const sel = isSelected(r, c)
            const legal = isLegal(r, c)
            const last = isLast(r, c)

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onSelect({ row: r, col: c })}
                style={{
                  position: 'absolute',
                  width: CELL_W,
                  height: CELL_H,
                  top: y - CELL_H / 2,
                  left: x - CELL_W / 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: piece ? 1 : 0,
                }}
              >
                {legal && !piece && (
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.25)',
                  }} />
                )}
                {piece && (
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: sel
                      ? '#aed481'
                      : last
                      ? '#f6f669'
                      : piece.player === 'cho' ? '#FFF8F0' : '#3D1F08',
                    border: legal ? '3px solid #aed481' : '2px solid rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}>
                    <span style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: piece.player === 'cho' ? '#8B0000' : '#E8C9A8',
                      userSelect: 'none',
                      fontFamily: 'serif',
                    }}>
                      {PIECE_LABEL[piece.player][piece.type]}
                    </span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}