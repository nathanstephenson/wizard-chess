import { AdvancedPiece, AdvancedPieceState, TileCoord } from "@/types/piece"

const getPieceOnSquare = (to: TileCoord, pieces: AdvancedPieceState[]) => {
    return pieces.find(p => p.position.x === to.x && p.position.z === to.z)
}
const getTakingPiece = (to: TileCoord, piece: AdvancedPieceState, pieces: AdvancedPieceState[]) => {
    const targetPiece = getPieceOnSquare(to, pieces)
    if (targetPiece === undefined) return undefined
    if (piece.colour === targetPiece.colour) return undefined
    return targetPiece
}

const getStraightBlockingPiece = (from: TileCoord, to: TileCoord, pieces: AdvancedPieceState[]) => {
    const xD = from.x - to.x
    const absXd = Math.abs(xD)
    const zD = from.z - to.z
    const absZd = Math.abs(zD)
    if (absXd > 0 && absZd > 0) return undefined
    const direction = absXd > absZd ? "x" : "z"
    const max = direction === "x" ? xD : zD
    const maxD = max > 0 ? 1 : -1
    for (let i = 1; i < Math.abs(max); max > 0 ? i++ : i--) {
        const x = direction === "x" ? from.x + i * maxD : from.x
        const z = direction === "z" ? from.z + i * maxD : from.z
        const blocking = pieces.find(p => p.position.x === x && p.position.z === z)
        if (blocking !== undefined) return blocking
    }
}

const getDiagonalBlockingPiece = (from: TileCoord, to: TileCoord, pieces: AdvancedPieceState[]) => {
    const xD = from.x - to.x
    const absXd = Math.abs(xD)
    const xDir = xD > 0 ? 1 : -1
    const zD = from.z - to.z
    const absZd = Math.abs(zD)
    const zDir = zD > 0 ? 1 : -1
    if (absXd !== absZd) return undefined
    for (let i = 1; i < absXd; i++) {
        const x = from.x + i * xDir
        const z = from.z + i * zDir
        const blocking = pieces.find(p => p.position.x === x && p.position.z === z)
        if (blocking !== undefined) return blocking
    }
}

type ValidationParams = {
    to: TileCoord
    from: TileCoord
    boardSize: number
    pieces: AdvancedPiece[]
    piecesState: AdvancedPieceState[]
}

const validationBase = ({ boardSize, from, to, pieces, piecesState }: ValidationParams) => {
    if (to.x > boardSize || to.z > boardSize || to.x < 0 || to.z < 0) return undefined
    const piece = piecesState.find(p => p.position.x === from.x && p.position.z === from.z && p.piece === "P")
    if (piece === undefined) return undefined
    const pieceInfo = pieces.find(p => p.code === piece.piece)
    if (pieceInfo === undefined) return undefined
    if (pieceInfo.movesStraight && getStraightBlockingPiece(from, to, piecesState) !== undefined) return undefined
    if (pieceInfo.movesDiagonal && getDiagonalBlockingPiece(from, to, piecesState) !== undefined) return undefined
    return piece
}

export const move = (params: ValidationParams) => {
    const piece = validationBase(params)
    if (piece === undefined) return false
    const canMove = params.pieces.find(p => p.code === piece.piece)?.canMoveToSquare({ piece, to: params.to }) ?? false
    return canMove && getPieceOnSquare(params.to, params.piecesState) === undefined
}

export const capture = (params: ValidationParams) => {
    const piece = validationBase(params)
    if (piece === undefined) return undefined
    const pieceInfo = params.pieces.find(p => p.code === piece.piece)
    const canCapture =
        (pieceInfo?.takesSameAsMove ? pieceInfo?.canMoveToSquare({ piece, to: params.to }) : pieceInfo?.canTakeFromSquare({ piece, to: params.to })) ?? false
    return canCapture ? getTakingPiece(params.to, piece, params.piecesState) : undefined
}

export const defaultPieces: AdvancedPiece[] = [
    {
        name: "Pawn",
        code: "P",
        zOffset: 1,
        xOffsets: "row",
        canJump: false,
        movesStraight: false,
        movesDiagonal: false,
        takesSameAsMove: false,
        canMoveToSquare: ({ to, piece }) => {
            if (piece.moveCount > 0 && Math.abs(to.z - piece.position.z) > 1) return false
            if (Math.abs(to.x - piece.position.x) > 0) return false
            return true
        },
        canTakeFromSquare: ({ piece, to }) => {
            return Math.abs(to.x - piece.position.x) === 1 && Math.abs(to.z - piece.position.z) === 1
        }
    },
    {
        name: "King",
        code: "K",
        zOffset: 0,
        xOffsets: [1],
        canJump: false,
        movesStraight: false,
        movesDiagonal: false,
        takesSameAsMove: true,
        canMoveToSquare: ({ piece, to }) => {
            return Math.abs(to.z - piece.position.z) <= 1 && Math.abs(to.x - piece.position.x) <= 1
        }
    },
    {
        name: "Queen",
        code: "Q",
        zOffset: 0,
        xOffsets: [-1],
        canJump: false,
        movesStraight: true,
        movesDiagonal: true,
        takesSameAsMove: true,
        canMoveToSquare: ({ piece, to }) => {
            const zD = Math.abs(to.z - piece.position.z)
            const xD = Math.abs(to.x - piece.position.x)
            return !(xD > 0 && zD > 0 && xD !== zD)
        }
    },
    {
        name: "Bishop",
        code: "B",
        zOffset: 0,
        xOffsets: [2, -2],
        canJump: false,
        movesStraight: false,
        movesDiagonal: true,
        takesSameAsMove: true,
        canMoveToSquare: ({ piece, to }) => {
            return Math.abs(to.x - piece.position.x) === Math.abs(to.z - piece.position.z)
        }
    },
    {
        name: "Knight",
        code: "N",
        zOffset: 0,
        xOffsets: [3, -3],
        canJump: true,
        movesStraight: false,
        movesDiagonal: false,
        takesSameAsMove: true,
        canMoveToSquare: ({ piece, to }) => {
            const zD = Math.abs(to.z - piece.position.z)
            const xD = Math.abs(to.x - piece.position.x)
            return Math.max(xD, zD) === 2 && Math.min(xD, zD) === 1
        }
    },
    {
        name: "Rook",
        code: "R",
        zOffset: 0,
        xOffsets: [4, -4],
        canJump: false,
        movesStraight: true,
        movesDiagonal: false,
        takesSameAsMove: true,
        canMoveToSquare: ({ piece, to }) => {
            const zD = Math.abs(to.z - piece.position.z)
            const xD = Math.abs(to.x - piece.position.x)
            return !(xD > 1 && zD > 1)
        }
    }
]

const colour = {
    white: "white",
    black: "black"
} as const
export const buildInitialPieceState = (pieces: AdvancedPiece[], boardSize: number): AdvancedPieceState[] =>
    pieces
        .map(piece =>
            (piece.xOffsets === "row"
                ? [...(boardSize % 2 === 0 ? [] : [0]), ...Array.from({ length: Math.floor(boardSize / 2) }, (_, i) => [i + 1, -(i + 1)]).flat()]
                : piece.xOffsets
            )
                .sort((a, b) => a - b)
                .map((x, i) => [
                    { piece: piece.code, index: i, colour: colour.white, position: { x: x + boardSize / 2, z: piece.zOffset }, moveCount: 0 },
                    { piece: piece.code, index: i, colour: colour.black, position: { x: (x + boardSize / 2) * -1, z: boardSize - piece.zOffset }, moveCount: 0 }
                ])
                .flat()
        )
        .flat()