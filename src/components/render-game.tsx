"use client"

import { Canvas } from "@react-three/fiber"
import { useGame } from "./game"
import { OrbitControls } from "./three/orbit"
import { Tile } from "./three/tile"

export const RenderGame = () => {
    const game = useGame()

    return (
        <Canvas shadows camera={{ fov: 10, position: [-10, 0, 10], zoom: 0.2 }}>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={10} position={[Math.floor(game.state.boardSize / 2), 10, Math.floor(game.state.boardSize / 2)]} />
            <Tiles />
            <OrbitControls />
        </Canvas>
    )
}

const Tiles = () => {
    const {
        state: { boardSize }
    } = useGame()

    return Array.from({ length: boardSize }, (_, x) => Array.from({ length: boardSize }, (_, z) => <Tile key={`${x}-${z}`} x={x} z={z} />))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OriginBlock = () => (
    <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="blue" />
    </mesh>
)
