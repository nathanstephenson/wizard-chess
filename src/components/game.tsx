"use client"

import { deserializeResult } from "@nathanstephenson/result-ts"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { createContext, useContext } from "react"
import { MathUtils } from "three"
import { OrbitControls } from "three-stdlib"
import { buildInitialPieceState, capture, defaultPieces, getLatestPieceState, move } from "@/common/advanced-pieces"
import { useApi } from "@/hooks/useApi"
import { AdvancedPieceState, Piece, TileCoord } from "@/types/piece"
import { GameState, NewGameState } from "../types/game-state"
import { Overlay } from "./overlay"
import { RenderGame } from "./render-game"

type GameProps = {
    game: GameState
}

type GameContext = {
    state: NewGameState
    pieces: AdvancedPieceState[]
    tile: {
        selected: AdvancedPieceState | undefined
        onClick: (tile: TileCoord) => void
    }
    camera: {
        set: (camera: OrbitControls | undefined) => void
        reset: () => void
    }
}

const GameContext = createContext<GameContext | undefined>(undefined)

export const useGame = () => {
    const game = useContext(GameContext)
    if (game === undefined) {
        throw new Error("Couldn't find game from context")
    }
    return game
}

const Game = ({ game }: GameProps) => {
    const api = useApi()

    const [camera, setCamera] = useState<OrbitControls>()

    const resetCamera = () => {
        camera?.setPolarAngle(Math.PI / 4)
        camera?.setAzimuthalAngle(MathUtils.degToRad(0))
    }

    useEffect(resetCamera, [camera])

    const initialPieces = buildInitialPieceState(defaultPieces, game.boardSize)
    const [moves, setMoves] = useState<GameState["history"]>(game.history)
    const currentState = getLatestPieceState(initialPieces, moves)

    const [selected, setSelected] = useState<AdvancedPieceState>()
    console.log("selected", selected)

    const addMove = (move: Piece) => setMoves(moves => [...moves, move])
    const translatedMoves = moves.map(move => move.piece + String.fromCharCode(97 + move.x) + (move.z + 1))
    console.log("translatedMoves", translatedMoves)

    const onClick = (tile: TileCoord) => {
        if (selected !== undefined) {
            const validationParams = { to: tile, from: selected.position, boardSize: game.boardSize, pieces: defaultPieces, piecesState: currentState }
            const validMove = move(validationParams)
            const validTake = capture(validationParams)
            if (validMove || validTake !== undefined) {
                moveMutation.mutate({ ...selected, ...tile, took: validTake })
            }
            setSelected(undefined)
            return
        }
        const piece = currentState.find(piece => piece.position.x === tile.x && piece.position.z === tile.z)
        if (piece === undefined) {
            setSelected(undefined)
            return
        }
        setSelected(piece)
        return
    }

    const moveMutation = useMutation({
        mutationFn: async (piece: GameState["history"][number]) => await api.game.move({ gameId: game.id, ...piece }),
        onSettled: res => {
            console.log("move settled", res)
            if (res === undefined) return
            const result = deserializeResult(res)
            return result.map(addMove).flatMap(() => result)
        }
    })

    const ctx = {
        state: { ...game, moves },
        pieces: currentState,
        tile: { selected, onClick },
        camera: {
            set: setCamera,
            reset: resetCamera
        }
    }

    return (
        <GameContext.Provider value={ctx}>
            <div className="w-full h-full flex flex-row">
                <Overlay />
                <RenderGame />
            </div>
        </GameContext.Provider>
    )
}

export default Game
