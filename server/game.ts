import { SerializableResult } from "@nathanstephenson/result-ts"
import { success } from "@nathanstephenson/result-ts/dist/types"
import { GameState } from "@/types/game-state"
import { Piece } from "@/types/piece"
import { serverFunction } from "./server-function"

type MoveParams = GameState["history"][number] & { gameId: string }
export const move = async ({ index, piece, x, z, colour, moveCount, took }: MoveParams): Promise<SerializableResult<Piece>> => {
    "use server"
    return await serverFunction({ fn: () => Promise.resolve(success({ piece, index, x, z, colour, moveCount: moveCount + 1, took })) })
}
