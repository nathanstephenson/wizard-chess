import { z } from "zod";

export const GameStateSchema = z.object({
    white: z.string().min(1),
    black: z.string().min(1),
    turns: z.array(z.object({
        piece: z.string(), 
        from: z.string(), 
        to: z.string()
    })),
})

export type GameState = z.infer<typeof GameStateSchema>
