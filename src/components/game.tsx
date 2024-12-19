"use client"

import { Canvas } from "@react-three/fiber"
import { GameState } from "../types/game-state"

type GameProps = {
    id: string
    state: GameState
}

const Game = ({}: GameProps) => {
    return (<Canvas> 
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} rotateX={96} />
        <mesh rotation={[22, 34, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial />
        </mesh> 
    </Canvas>)
}

export default Game
