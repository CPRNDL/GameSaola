// 게임 공통 타입과 상수는 여기서 export 함니다

export const SOCKET_EVENTS = {
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    GAME_STATE: 'game_state',
    PLAYER_MOVE: 'player_move',
} as const;

export type GameId = 'omok' | 'chess' | 'baduk' | 'janggi' | 'checker' | 'yacht' | 'onecard' | 'through-the-ages';

export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface Player {
    id: string;
    nickname: string;
}

export interface Room {
    code: string;
    gameId: GameId;
    status: RoomStatus;
    players: Player[];
    maxPlayers: number;
}
