import Game from "@/components/game"

type PageProps = { 
    params: Promise<{
        game: string
    }>
}

const Page = async ({ params }: PageProps) => {
    const awaitedParams = await params
    return (
        <div className="flex w-full h-dvh">
            <Game id={awaitedParams.game} state={{white: "a", black: "b", turns: []}}/>
        </div>
    )
}

export default Page
