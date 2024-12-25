import { z } from "zod"

const DEFAULT_GRID_SIZE = 8

export const GameStateSchema = z.object({
    id: z.string(),
    white: z.string().min(1),
    black: z.string().min(1),
    boardSize: z.number().optional().default(DEFAULT_GRID_SIZE),
    moves: z.array(
        z.object({
            piece: z.string(),
            x: z.number(),
            z: z.number()
        })
    )
})

export type GameState = z.infer<typeof GameStateSchema>
