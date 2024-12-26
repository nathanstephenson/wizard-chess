import { useThree } from "@react-three/fiber"
import { useState } from "react"
import { Vector3 } from "three"
import { isValidMove } from "@/common/pieces"
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
        const piece = game.pieces.find(piece => piece.x === x && piece.z === z)
        if (piece !== undefined) console.log("piece", piece)
        game.tile.onClick([x, z])
    }

    const offset = -game.state.boardSize / 2 + (game.state.boardSize % 2 === 0 ? 0.5 : 0)

    const hasPiece = game.pieces.find(piece => piece.x === x && piece.z === z) !== undefined

    const isValid = game.tile.selected !== undefined && isValidMove(x, z, game.tile.selected, game.pieces)

    const isClickable = (game.tile.selected === undefined && hasPiece) || isValid

    const isSelected = game.tile.selected?.x === x && game.tile.selected?.z === z

    const getTileColour = () => {
        if (!isClickable) return isSelected ? "yellow" : "blue"
        if (!isHovered) return "white"
        if (typeof isValid === "boolean") return "green"
        return "red"
    }

    return (
        <mesh position={[offset + x, -1, -offset - z]} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={getTileColour()} />
        </mesh>
    )
}
