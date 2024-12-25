import { useGame } from "./game"

export const Overlay = () => {
    const game = useGame()
    return (
        <div className="absolute w-full h-full z-50 p-5 gap-5 flex flex-col pointer-events-none" onClick={e => e.stopPropagation()}>
            <button className="pointer-events-auto w-min" onClick={game.camera.reset}>
                Reset Camera
            </button>
        </div>
    )
}
