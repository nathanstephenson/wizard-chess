import { GameState } from "@/types/game-state"
import { Piece, PieceId } from "@/types/piece"
import { DEFAULT_BOARD_SIZE } from "./constants"

const pieceCodes = {
    pawn: "P",
    rook: "R",
    knight: "N",
    bishop: "B",
    queen: "Q",
    king: "K"
} as const

const colour = {
    white: "white",
    black: "black"
} as const

export const generateInitialPieces = (boardSize: number) => {
    //adjust for larger boards
    const pieces: Piece[] = defaultPieces.map(piece => ({
        ...piece,
        x: piece.x + Math.floor((boardSize - DEFAULT_BOARD_SIZE) / 2),
        z: piece.z + (piece.colour === colour.white ? 0 : Math.floor(boardSize - DEFAULT_BOARD_SIZE))
    }))
    return pieces
}

const isMatchingPiece = (a: PieceId, b: PieceId) => a.piece === b.piece && a.colour === b.colour && a.index === b.index

export const getLatestPieceState = (pieces: Piece[], moves: GameState["history"]): Piece[] =>
    pieces
        .map(piece => {
            const takenMove = moves.find(move => move.took !== undefined && isMatchingPiece(move.took, piece))
            if (takenMove !== undefined) return undefined
            const lastMove = moves
                .filter(move => isMatchingPiece(move, piece))
                .sort((a, b) => a.moveCount - b.moveCount)
                .at(-1)
            if (lastMove === undefined) return piece
            console.log("lastMove", lastMove)
            return { ...piece, x: lastMove.x, z: lastMove.z, moveCount: lastMove.moveCount + 1 }
        })
        .filter(p => p !== undefined)

const isBlockedDiagonal = (destination: { x: number; z: number }, piece: Piece, pieces: Piece[]) => {
    let hasReachedEnemy = false
    const xDiff = destination.x - piece.x
    const zDiff = destination.z - piece.z
    const xDir = xDiff > 0 ? 1 : -1
    const zDir = zDiff > 0 ? 1 : -1
    const xSteps = Math.abs(xDiff)
    const zSteps = Math.abs(zDiff)
    const steps = Math.max(xSteps, zSteps)
    for (let i = 1; i < steps; i++) {
        const blockingPiece = pieces.find(p => p.x === piece.x + i * xDir && p.z === piece.z + i * zDir)
        if (blockingPiece !== undefined && (hasReachedEnemy || blockingPiece.colour === piece.colour)) return true
        if (blockingPiece !== undefined && blockingPiece.colour !== piece.colour) hasReachedEnemy = true
    }
    return false
}

const isBlockedStraight = (destination: { x: number; z: number }, piece: Piece, pieces: Piece[]) => {
    let hasReachedEnemy = false
    const xDiff = destination.x - piece.x
    const zDiff = destination.z - piece.z
    const xDir = xDiff > 0 ? 1 : -1
    const zDir = zDiff > 0 ? 1 : -1
    const xSteps = Math.abs(xDiff)
    const zSteps = Math.abs(zDiff)
    const steps = Math.max(xSteps, zSteps)
    for (let i = 1; i < steps; i++) {
        const blockingPiece = pieces.find(p => (xDir > zDir ? p.x === piece.x + i * xDir && p.z === piece.z : p.x === piece.x + i * xDir && p.z === piece.z))
        if (blockingPiece !== undefined && (hasReachedEnemy || blockingPiece.colour === piece.colour)) return true
        if (blockingPiece !== undefined && blockingPiece.colour !== piece.colour) hasReachedEnemy = true
    }
    return false
}

const isValidPawnMove = (x: number, z: number, piece: Piece, pieces: Piece[]) => {
    const maxDistance = piece.moveCount === 0 ? 2 : 1
    const blockingPiece = pieces.find(p => p.x === x && p.z === z)
    const isTaking = z - piece.z === 1 && Math.abs(piece.x - x) === 1 && blockingPiece !== undefined && blockingPiece.colour !== piece.colour
    const isBlocked = !isTaking && blockingPiece !== undefined
    if (piece.x - x !== 0 && !isTaking) return false
    if (piece.z > z || z - piece.z > maxDistance) return false
    if (isTaking && z - piece.z === 2) return false
    if (isTaking) return blockingPiece
    if (isBlocked) return false
    return true
}

const isValidRookMove = (x: number, z: number, piece: Piece, pieces: Piece[]) => {
    const blockingPiece = pieces.find(p => p.x === x && p.z === z)
    const isTaking = blockingPiece !== undefined && blockingPiece.colour !== piece.colour
    const isBlocked = !isTaking && (blockingPiece !== undefined || isBlockedStraight({ x, z }, piece, pieces))
    if ((Math.abs(piece.x - x) > 0 && Math.abs(piece.z - z) > 0) || isBlocked) return false
    if (isTaking) return blockingPiece
    return true
}

const isValidKnightMove = (x: number, z: number, piece: Piece, pieces: Piece[]) => {
    const blockingPiece = pieces.find(p => p.x === x && p.z === z)
    const isTaking = blockingPiece !== undefined && blockingPiece.colour !== piece.colour
    const isBlocked = !isTaking && blockingPiece !== undefined
    const xD = Math.abs(piece.x - x)
    const zD = Math.abs(piece.z - z)
    const validMove = Math.abs(xD - zD) === 1 && xD >= 1 && xD <= 2 && zD >= 1 && zD <= 2
    if (!validMove || isBlocked) return false
    if (isTaking) return blockingPiece
    return true
}

const isValidBishopMove = (x: number, z: number, piece: Piece, pieces: Piece[]) => {
    const blockingPiece = pieces.find(p => p.x === x && p.z === z)
    const isTaking = blockingPiece !== undefined && blockingPiece.colour !== piece.colour
    const isBlocked = !isTaking && (blockingPiece !== undefined || isBlockedDiagonal({ x, z }, piece, pieces))
    if (Math.abs(Math.abs(piece.x - x) - Math.abs(piece.z - z)) !== 0 || isBlocked) return false
    if (isTaking) return blockingPiece
    return true
}

const isValidQueenMove = (x: number, z: number, piece: Piece, pieces: Piece[]) => {
    const blockingPiece = pieces.find(p => p.x === x && p.z === z)
    const isTaking = blockingPiece !== undefined && blockingPiece.colour !== piece.colour
    const isBlocked = !isTaking && (blockingPiece !== undefined || isBlockedDiagonal({ x, z }, piece, pieces) || isBlockedStraight({ x, z }, piece, pieces))
    const isDiagonal = Math.abs(Math.abs(piece.x - x) - Math.abs(piece.z - z)) !== 0
    const isStraight = Math.abs(piece.x - x) > 0 && Math.abs(piece.z - z) > 0
    if ((!isDiagonal && !isStraight) || (isDiagonal && isStraight) || isBlocked) return false
    if (isTaking) return blockingPiece
    return true
}

const isValidKingMove = (x: number, z: number, piece: Piece, pieces: Piece[]) => {
    const blockingPiece = pieces.find(p => p.x === x && p.z === z)
    const isTaking = blockingPiece !== undefined && blockingPiece.colour !== piece.colour
    const isBlocked = !isTaking && blockingPiece !== undefined
    const isTooFar = Math.abs(piece.x - x) > 1 || Math.abs(piece.z - z) > 1
    const isDiagonal = Math.abs(Math.abs(piece.x - x) - Math.abs(piece.z - z)) !== 0
    const isStraight = Math.abs(piece.x - x) > 0 && Math.abs(piece.z - z) > 0
    if ((!isDiagonal && !isStraight) || isTooFar || isBlocked) return false
    if (isTaking) return blockingPiece
    return true
}

//TODO: check if we're blocked from moving along the lines (all except pawn, knight and king) by any piece,
//      then we can also add castling and en passant
export const isValidMove = (x: number, z: number, piece: Piece, pieces: Piece[]) => {
    switch (piece.piece) {
        case pieceCodes.pawn:
            return isValidPawnMove(x, z, piece, pieces)
        case pieceCodes.rook:
            return isValidRookMove(x, z, piece, pieces)
        case pieceCodes.knight:
            return isValidKnightMove(x, z, piece, pieces)
        case pieceCodes.bishop:
            return isValidBishopMove(x, z, piece, pieces)
        case pieceCodes.queen:
            return isValidQueenMove(x, z, piece, pieces)
        case pieceCodes.king:
            return isValidKingMove(x, z, piece, pieces)
    }
}

const defaultPieces: Piece[] = [
    { piece: pieceCodes.rook, x: 0, z: 0, colour: colour.white, index: 0, moveCount: 0 },
    { piece: pieceCodes.knight, x: 1, z: 0, colour: colour.white, index: 0, moveCount: 0 },
    { piece: pieceCodes.bishop, x: 2, z: 0, colour: colour.white, index: 0, moveCount: 0 },
    { piece: pieceCodes.queen, x: 3, z: 0, colour: colour.white, index: 0, moveCount: 0 },
    { piece: pieceCodes.king, x: 4, z: 0, colour: colour.white, index: 0, moveCount: 0 },
    { piece: pieceCodes.bishop, x: 5, z: 0, colour: colour.white, index: 1, moveCount: 0 },
    { piece: pieceCodes.knight, x: 6, z: 0, colour: colour.white, index: 1, moveCount: 0 },
    { piece: pieceCodes.rook, x: 7, z: 0, colour: colour.white, index: 1, moveCount: 0 },
    ...Array.from({ length: 8 }, (_, i) => ({ piece: pieceCodes.pawn, x: i, z: 1, colour: colour.white, index: i, moveCount: 0 })),
    { piece: pieceCodes.rook, x: 0, z: 7, colour: colour.black, index: 0, moveCount: 0 },
    { piece: pieceCodes.knight, x: 1, z: 7, colour: colour.black, index: 0, moveCount: 0 },
    { piece: pieceCodes.bishop, x: 2, z: 7, colour: colour.black, index: 0, moveCount: 0 },
    { piece: pieceCodes.queen, x: 3, z: 7, colour: colour.black, index: 0, moveCount: 0 },
    { piece: pieceCodes.king, x: 4, z: 7, colour: colour.black, index: 0, moveCount: 0 },
    { piece: pieceCodes.bishop, x: 5, z: 7, colour: colour.black, index: 1, moveCount: 0 },
    { piece: pieceCodes.knight, x: 6, z: 7, colour: colour.black, index: 1, moveCount: 0 },
    { piece: pieceCodes.rook, x: 7, z: 7, colour: colour.black, index: 1, moveCount: 0 },
    ...Array.from({ length: 8 }, (_, i) => ({ piece: pieceCodes.pawn, x: i, z: 6, colour: colour.black, index: i, moveCount: 0 }))
] as const
