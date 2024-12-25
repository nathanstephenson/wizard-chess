import { useThree } from "@react-three/fiber"
import { useState } from "react"
import { Vector3 } from "three"
import { useGame } from "../game"

type TileProps = {
    x: number
    z: number
}

export const Tile = ({ x, z }: TileProps) => {
    const game = useGame()
    const { camera } = useThree()

    const [isHovered, setIsHovered] = useState(false)

    const onOver = (e: PointerEvent) => {
        e.stopPropagation()
        setIsHovered(true)
    }

    const onOut = (e: PointerEvent) => {
        e.stopPropagation()
        setIsHovered(false)
    }

    const onClick = (e: PointerEvent) => {
        e.stopPropagation()
        console.log("clicked", camera.getWorldDirection(new Vector3(x, 0, z)))
        game.tile.onClick([x, z])
    }

    //const isHovered = game.tile.current?.at(0) === x && game.tile.current?.at(1) === z

    const offset = -game.state.boardSize / 2 + (game.state.boardSize % 2 === 0 ? 0.5 : 0)

    return (
        <mesh position={[offset + x, -1, offset + z]} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isHovered ? "red" : "green"} />
        </mesh>
    )
}
