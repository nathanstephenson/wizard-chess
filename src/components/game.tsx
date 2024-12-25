"use client"

import { deserializeResult } from "@nathanstephenson/result-ts"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { createContext, useContext } from "react"
import { MathUtils } from "three"
import { OrbitControls } from "three-stdlib"
import { useApi } from "@/hooks/useApi"
import { GameState } from "../types/game-state"
import { Overlay } from "./overlay"
import { RenderGame } from "./render-game"

type GameProps = {
    game: GameState
}

type GameContext = {
    state: GameState
    tile: {
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

    const [moves, setMoves] = useState<GameState["moves"]>(game.moves)
    const addMove = (move: GameState["moves"][number]) => setMoves(moves => [...moves, move])
    const translatedMoves = moves.map(move => String.fromCharCode(97 + move.x) + (move.z + 1))
    console.log("translatedMoves", translatedMoves)

    const onClick = (tile: [number, number]) => {
        moveMutation.mutate({ piece: "pawn", x: tile[0], z: tile[1] })
    }

    const moveMutation = useMutation({
        mutationFn: async (params: { piece: string; x: number; z: number }) => await api.game.move({ id: game.id, ...params }),
        onSettled: res => {
            console.log("move settled", res)
            if (res === undefined) return
            const result = deserializeResult(res)
            return result.map(addMove).flatMap(() => result)
        }
    })

    const ctx = {
        state: { ...game, moves },
        tile: { onClick },
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
