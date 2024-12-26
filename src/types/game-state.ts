import { z } from "zod"
import { DEFAULT_BOARD_SIZE } from "@/common/constants"
import { PieceIdSchema, PieceSchema } from "./piece"

export const GameStateSchema = z.object({
    id: z.string(),
    white: z.string().min(1),
    black: z.string().min(1),
    boardSize: z.number().optional().default(DEFAULT_BOARD_SIZE),
    history: z.array(PieceSchema.and(z.object({ took: PieceIdSchema.optional() })))
})
export type GameState = z.infer<typeof GameStateSchema>
