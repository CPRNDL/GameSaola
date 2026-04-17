import type { Board, Cell } from './OmokGame'
import { BOARD_SIZE } from './OmokGame'

interface OmokBoardProps {
  board: Board
  onPlace: (row: number, col: number) => void
  disabled: boolean
  lastMove: [number, number] | null
}

const CELL_SIZE = 36

export default function OmokBoard({ board, onPlace, disabled, lastMove }: OmokBoardProps) {
  const size = CELL_SIZE * (BOARD_SIZE - 1)

  return (
    <div className="overflow-auto">
      <div
        style={{
          position: 'relative',
          width: size + CELL_SIZE,
          height: size + CELL_SIZE,
          background: '#C8956B',
          borderRadius: 8,
          padding: CELL_SIZE / 2,
          cursor: disabled ? 'not-allowed' : 'crosshair',
        }}
      >
        {/* 격자선 */}
        <svg
          style={{ position: 'absolute', top: CELL_SIZE / 2, left: CELL_SIZE / 2 }}
          width={size}
          height={size}
        >
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <g key={i}>
              <line
                x1={i * CELL_SIZE} y1={0}
                x2={i * CELL_SIZE} y2={size}
                stroke="#8B5E3C" strokeWidth={0.8}
              />
              <line
                x1={0} y1={i * CELL_SIZE}
                x2={size} y2={i * CELL_SIZE}
                stroke="#8B5E3C" strokeWidth={0.8}
              />
            </g>
          ))}
          {/* 화점 */}
          {[[3,3],[3,11],[7,7],[11,3],[11,11]].map(([r, c]) => (
            <circle key={`${r}-${c}`} cx={c * CELL_SIZE} cy={r * CELL_SIZE} r={3} fill="#8B5E3C" />
          ))}
        </svg>

        {/* 돌 */}
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
                    width: 8, height: 8, borderRadius: '50%',
                    background: cell === 'black' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                  }} />
                )}
              </div>
            )
          })
        )}

        {/* 클릭 영역 */}
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