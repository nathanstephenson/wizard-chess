type TileProps = {
    x: number
    z: number
    onHover: (tile: [number, number]) => void
    onClick: (tile: [number, number]) => void
    isHovered: boolean
}

export const Tile = ({x, z, onHover, onClick, isHovered}: TileProps) => {

    const onTileHover = (e: PointerEvent) => {
        e.stopPropagation()
        onHover([x, z])
    }

    const onTileClick = (e: PointerEvent) => {
        e.stopPropagation()
        onClick([x, z])
    }

    return <mesh position={[x, 0, z]} onPointerOver={onTileHover} onClick={onTileClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isHovered ? "red" : "green"} />
        </mesh>
}
