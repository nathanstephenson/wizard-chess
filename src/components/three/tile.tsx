import { useState } from "react"
import { capture, defaultPieces, move } from "@/common/advanced-pieces"
import { useGame } from "../game"

type TileProps = {
    x: number
    z: number
}

export const Tile = ({ x, z }: TileProps) => {
    const game = useGame()

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
        console.log("clicked", x, z)
        const piece = game.pieces.find(piece => piece.position.x === x && piece.position.z === z)
        if (piece !== undefined) console.log("piece", piece)
        game.tile.onClick({ x, z })
    }

    const offset = -game.state.boardSize / 2 + (game.state.boardSize % 2 === 0 ? 0.5 : 0)

    const hasPiece = game.pieces.find(piece => piece.position.x === x && piece.position.z === z) !== undefined

    const validTake =
        game.tile.selected !== undefined &&
        capture({ to: { x, z }, from: game.tile.selected.position, boardSize: game.state.boardSize, pieces: defaultPieces, piecesState: game.pieces })

    const validMove =
        game.tile.selected !== undefined &&
        move({ to: { x, z }, from: game.tile.selected.position, boardSize: game.state.boardSize, pieces: defaultPieces, piecesState: game.pieces })

    const isClickable = (game.tile.selected === undefined && hasPiece) || validMove || validTake !== undefined

    const isSelected = game.tile.selected?.position.x === x && game.tile.selected?.position.z === z

    const getTileColour = () => {
        if (isSelected) return "yellow"
        if (game.tile.selected === undefined && !hasPiece) return "black"
        if (isClickable && !isHovered) return "white"
        if (validMove) return "green"
        if (validTake) return "blue"
        if (game.tile.selected === undefined && isHovered && hasPiece) return "blue"
        return "black"
    }

    return (
        <mesh position={[offset + x, -1, -offset - z]} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={getTileColour()} />
        </mesh>
    )
}
