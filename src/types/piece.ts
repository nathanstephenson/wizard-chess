import { z } from "zod"

const PieceCode = z.union([z.literal("P"), z.literal("R"), z.literal("N"), z.literal("B"), z.literal("Q"), z.literal("K")])
export const PieceIdSchema = z.object({
    piece: PieceCode,
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

export const TileCoordSchema = z.object({ x: z.number(), z: z.number() })
export type TileCoord = z.infer<typeof TileCoordSchema>

export const MoveSchema = PieceIdSchema.and(
    z.object({
        position: TileCoordSchema,
        timestamp: z.number(),
        took: PieceIdSchema.optional()
    })
)
export type Move = z.infer<typeof MoveSchema>

export const AdvancedPieceStateSchema = PieceIdSchema.and(z.object({ position: TileCoordSchema, moveCount: z.number() }))
export type AdvancedPieceState = z.infer<typeof AdvancedPieceStateSchema>

export const CanMoveParamsSchema = z.object({ piece: AdvancedPieceStateSchema, to: TileCoordSchema })
export type CanMoveParams = z.infer<typeof CanMoveParamsSchema>

export const AdvancedPieceSchema = z
    .object({
        name: z.string().min(1),
        code: PieceCode,
        zOffset: z.number().default(0),
        xOffsets: z.array(z.number()).default([]).or(z.literal("row")),
        movesStraight: z.boolean().default(false),
        movesDiagonal: z.boolean().default(false),
        canMoveToSquare: z.function(z.tuple([CanMoveParamsSchema]), z.boolean())
    })
    .and(
        z.discriminatedUnion("takesSameAsMove", [
            z.object({ takesSameAsMove: z.literal(true) }),
            z.object({ takesSameAsMove: z.literal(false), canTakeFromSquare: z.function(z.tuple([CanMoveParamsSchema]), z.boolean()) })
        ])
    )
export type AdvancedPiece = z.infer<typeof AdvancedPieceSchema>
