import { z } from "zod"

export const PieceIdSchema = z.object({
    piece: z.union([z.literal("P"), z.literal("R"), z.literal("N"), z.literal("B"), z.literal("Q"), z.literal("K")]),
    index: z.number(),
    colour: z.union([z.literal("white"), z.literal("black")])
})
export type PieceId = z.infer<typeof PieceIdSchema>

export const PieceSchema = PieceIdSchema.and(
    z.object({
        x: z.number(),
        z: z.number(),
        moveCount: z.number().default(0)
    })
)
export type Piece = z.infer<typeof PieceSchema>
