import { SerializableResult } from "@nathanstephenson/result-ts"
import { success } from "@nathanstephenson/result-ts/dist/types"
import { serverFunction } from "./server-function"

type MoveParams = {
    id: string
    piece: string
    x: number
    z: number
}

export const move = async ({ id, piece, x, z }: MoveParams): Promise<SerializableResult<MoveParams>> => {
    "use server"
    return await serverFunction({ fn: () => Promise.resolve(success({ id, piece, x, z })) })
}
