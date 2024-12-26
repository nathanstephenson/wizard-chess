"use client"

import { deserializeResult } from "@nathanstephenson/result-ts"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { createContext, useContext } from "react"
import { MathUtils } from "three"
import { OrbitControls } from "three-stdlib"
import { generateInitialPieces, getLatestPieceState, isValidMove } from "@/common/pieces"
import { useApi } from "@/hooks/useApi"
import { Piece } from "@/types/piece"
import { GameState } from "../types/game-state"
import { Overlay } from "./overlay"
import { RenderGame } from "./render-game"

type GameProps = {
    game: GameState
}

type GameContext = {
    state: GameState
    pieces: Piece[]
    tile: {
        selected: Piece | undefined
        onClick: (tile: [number, number]) => void
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

    const initialPieces = generateInitialPieces(game.boardSize)
    const [moves, setMoves] = useState<GameState["history"]>(game.history)
    const currentState = getLatestPieceState(initialPieces, moves)

    const [selected, setSelected] = useState<Piece>()
    console.log("selected", selected)

    const addMove = (move: Piece) => setMoves(moves => [...moves, move])
    const translatedMoves = moves.map(move => move.piece + String.fromCharCode(97 + move.x) + (move.z + 1))
    console.log("translatedMoves", translatedMoves)

    const onClick = (tile: [number, number]) => {
        if (selected !== undefined) {
            const validMove = isValidMove(tile[0], tile[1], selected, currentState)
            if (validMove) {
                moveMutation.mutate({ ...selected, x: tile[0], z: tile[1], took: typeof validMove === "boolean" ? undefined : validMove })
            }
            setSelected(undefined)
            return
        }
        const piece = currentState.find(piece => piece.x === tile[0] && piece.z === tile[1])
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
