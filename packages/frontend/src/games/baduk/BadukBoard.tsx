import type { Board, Cell } from './BadukGame'

interface BadukBoardProps {
  board: Board
  size: number
  onPlace: (row: number, col: number) => void
  disabled: boolean
  lastMove: [number, number] | null
}

const CELL_SIZE = 32

export default function BadukBoard({ board, size, onPlace, disabled, lastMove }: BadukBoardProps) {
  const gridSize = CELL_SIZE * (size - 1)
  const totalSize = gridSize + CELL_SIZE

  const starPoints: Record<number, [number, number][]> = {
    9:  [[2,2],[2,6],[4,4],[6,2],[6,6]],
    13: [[3,3],[3,9],[6,6],[9,3],[9,9]],
    19: [[3,3],[3,9],[3,15],[9,3],[9,9],[9,15],[15,3],[15,9],[15,15]],
  }

  return (
    <div className="overflow-auto">
      <div
        style={{
          position: 'relative',
          width: totalSize,
          height: totalSize,
          background: '#C8956B',
          borderRadius: 8,
          padding: CELL_SIZE / 2,
          cursor: disabled ? 'not-allowed' : 'crosshair',
        }}
      >
        <svg
          style={{ position: 'absolute', top: CELL_SIZE / 2, left: CELL_SIZE / 2 }}
          width={gridSize}
          height={gridSize}
        >
          {Array.from({ length: size }).map((_, i) => (
            <g key={i}>
              <line x1={i * CELL_SIZE} y1={0} x2={i * CELL_SIZE} y2={gridSize} stroke="#8B5E3C" strokeWidth={0.8} />
              <line x1={0} y1={i * CELL_SIZE} x2={gridSize} y2={i * CELL_SIZE} stroke="#8B5E3C" strokeWidth={0.8} />
            </g>
          ))}
          {(starPoints[size] ?? []).map(([r, c]) => (
            <circle key={`${r}-${c}`} cx={c * CELL_SIZE} cy={r * CELL_SIZE} r={3} fill="#8B5E3C" />
          ))}
        </svg>

        {board.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null
            const isLast = lastMove?.[0] === r && lastMove?.[1] === c
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: 'absolute',
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                  borderRadius: '50%',
                  background: cell === 'black' ? '#1a1a1a' : '#f5f5f0',
                  border: cell === 'white' ? '1px solid #ccc' : 'none',
                  top: CELL_SIZE / 2 + r * CELL_SIZE - (CELL_SIZE - 4) / 2,
                  left: CELL_SIZE / 2 + c * CELL_SIZE - (CELL_SIZE - 4) / 2,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isLast && (
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: cell === 'black' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                  }} />
                )}
              </div>
            )
          })
        )}

        {!disabled && board.map((row, r) =>
          row.map((cell, c) => {
            if (cell) return null
            return (
              <div
                key={`click-${r}-${c}`}
                onClick={() => onPlace(r, c)}
                style={{
                  position: 'absolute',
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  top: CELL_SIZE / 2 + r * CELL_SIZE - CELL_SIZE / 2,
                  left: CELL_SIZE / 2 + c * CELL_SIZE - CELL_SIZE / 2,
                }}
              />
            )
          })
        )}
      </div>
    </div>
  )
}