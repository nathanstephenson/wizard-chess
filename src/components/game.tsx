"use client"

import { Canvas } from "@react-three/fiber"
import { GameState } from "../types/game-state"
import { OrbitControls } from "./three/orbit"
import { useState } from "react"
import { Tile } from "./three/tile"

type GameProps = {
    game: GameState
}

const boardSize = 8

const Game = ({}: GameProps) => {
    const [hoveredTile, setHoveredTile] = useState<[number, number] | undefined>(undefined)

    const onHover = (tile: [number, number]) => setHoveredTile(() => tile)
    const onClick = (tile: [number, number]) => console.log(tile)

    return (<Canvas> 
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={10} position={[Math.floor(boardSize / 2), 10, Math.floor(boardSize / 2)]} rotateX={45} />
        {Array.from({length: boardSize}, (_, x) => (
            Array.from({length: boardSize}, (_, z) => (
                <Tile key={`${x}-${z}`} x={x} z={z} onHover={onHover} onClick={onClick} isHovered={hoveredTile?.at(0) === x && hoveredTile?.at(1) === z} />
            ))
        ))}
    </Canvas>)
}

export default Game
