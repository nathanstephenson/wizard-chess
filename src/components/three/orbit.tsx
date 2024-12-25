"use client"

import { extend, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { OrbitControls } from "three-stdlib"
import { useGame } from "../game"

extend({ OrbitControls })

const Controls = () => {
    const game = useGame()

    const controls = useRef<OrbitControls>(null)

    const { camera, gl } = useThree()

    useFrame(() => {
        if (controls.current === null) return
        controls.current.update()
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (controls.current === null) return
        game.camera.set(controls.current)
    }, [controls.current])

    return (
        <orbitControls
            ref={controls}
            args={[camera, gl.domElement]}
            enableDamping
            enablePan={false}
            dampingFactor={0.1}
            rotateSpeed={0.5}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2}
            minDistance={1}
            maxDistance={25}
        />
    )
}

export { Controls as OrbitControls }
