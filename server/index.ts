import { move } from "./game"

export const getApi = () => ({
    game: {
        move
    }
})

export type Api = ReturnType<typeof getApi>
