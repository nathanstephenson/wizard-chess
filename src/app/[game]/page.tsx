import Game from "@/components/game"

type PageProps = {
    params: Promise<{
        game: string
    }>
}

const Page = async ({ params }: PageProps) => {
    const _params = await params
    return (
        <div className="flex w-full h-dvh">
            <Game game={{ id: _params.game, white: "a", black: "b", boardSize: 8, history: [] }} />
        </div>
    )
}

export default Page
