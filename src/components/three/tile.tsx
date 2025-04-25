import { useState } from "react"
import { capture, defaultPieces, move } from "@/common/advanced-pieces"
import { useGame } from "../game"
import { useLoader } from "@react-three/fiber"
import { OBJLoader } from "three-stdlib"
import { AdvancedPiece, AdvancedPieceState } from "@/types/piece"

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

    const piece = game.pieces.find(piece => piece.position.x === x && piece.position.z === z)
    const hasPiece = piece !== undefined

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
            {piece !== undefined ? <P state={piece} /> : <></>}
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={getTileColour()} />
        </mesh>
    )
}

const P = ({ state }: { state: AdvancedPieceState }) => {
    const gltf = useLoader(OBJLoader, `../../../models/${getPieceName(state.piece)}.obj`)
    console.log(gltf)
    if (state === undefined) return null
    return <mesh position={[state.position.x, 1, state.position.z]} scale={0.03} rotateZ={Math.PI / 2}>
        <primitive object={gltf} />
    </mesh>
}

const getPieceName = (piece?: AdvancedPiece["code"]) => {
    if (piece === undefined) return ""

    switch(piece) {
        case "P":
            return "Pawn"
        case "N":
            return "Knight"
        case "R":
            return "Rook"
        case "B":
            return "Bishop"
        case "Q":
            return "Queen"
        case "K":
            return "King"
    }
} 
