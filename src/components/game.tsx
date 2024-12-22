"use client"

import { Canvas } from "@react-three/fiber"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useApi } from "@/hooks/useApi"
import { GameState } from "../types/game-state"
import { OrbitControls } from "./three/orbit"
import { Tile } from "./three/tile"

type GameProps = {
    game: GameState
}

const boardSize = 8

const Game = ({ game }: GameProps) => {
    const api = useApi()

    const [hoveredTile, setHoveredTile] = useState<[number, number] | undefined>(undefined)

    const onHover = (tile: [number, number]) => setHoveredTile(() => tile)
    const onClick = (tile: [number, number]) => {
        moveMutation.mutate({ piece: "pawn", x: tile[0], z: tile[1] })
        console.log(tile)
    }

    const moveMutation = useMutation({
        mutationFn: async (params: { piece: string; x: number; z: number }) => await api.game.move({ id: game.id, ...params }),
        onSettled: res => {
            console.log("move settled", res)
            return res
        }
    })

    return (
        <Canvas>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={10} position={[Math.floor(boardSize / 2), 10, Math.floor(boardSize / 2)]} rotateX={45} />
            {Array.from({ length: boardSize }, (_, x) =>
                Array.from({ length: boardSize }, (_, z) => (
                    <Tile key={`${x}-${z}`} x={x} z={z} onHover={onHover} onClick={onClick} isHovered={hoveredTile?.at(0) === x && hoveredTile?.at(1) === z} />
                ))
            )}
        </Canvas>
    )
}

export default Game
