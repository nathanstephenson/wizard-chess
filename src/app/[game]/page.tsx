import Game from "@/components/game"

type PageProps = { 
    params: Promise<{
        game: string
    }>
}

const Page = async ({ params }: PageProps) => {
    const awaitedParams = await params
    return (
        <div>
            <h1>Hi! You are in game {awaitedParams.game}</h1>
            <Game id={awaitedParams.game} state={{white: "a", black: "b", turns: []}}/>
        </div>
    )
}

export default Page
