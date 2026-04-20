import type { Card } from './OnecardGame'
import { SUIT_SYMBOL, SUIT_COLOR } from './OnecardGame'

interface CardProps {
  card: Card
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  small?: boolean
}

export default function CardComponent({ card, onClick, selected, disabled, small }: CardProps) {
  const color = SUIT_COLOR[card.suit]
  const symbol = SUIT_SYMBOL[card.suit]
  const size = small ? { width: 44, height: 62, font: 12, sym: 10 } : { width: 64, height: 90, font: 16, sym: 13 }

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: size.width,
        height: size.height,
        borderRadius: 8,
        background: '#fff',
        border: selected ? '2.5px solid #aed481' : '1.5px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4px 5px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: selected ? 'translateY(-8px)' : 'none',
        transition: 'transform 0.15s, border 0.15s',
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ fontSize: size.font, fontWeight: 700, color, lineHeight: 1 }}>
        {card.rank}
      </div>
      <div style={{ fontSize: size.sym + 4, color, textAlign: 'center', lineHeight: 1 }}>
        {symbol}
      </div>
      <div style={{ fontSize: size.font, fontWeight: 700, color, lineHeight: 1, transform: 'rotate(180deg)' }}>
        {card.rank}
      </div>
    </div>
  )
}

export function CardBack({ small }: { small?: boolean }) {
  const size = small ? { width: 44, height: 62 } : { width: 64, height: 90 }
  return (
    <div style={{
      width: size.width,
      height: size.height,
      borderRadius: 8,
      background: '#6B3A1F',
      border: '1.5px solid #8B5E3C',
      flexShrink: 0,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }} />
  )
}