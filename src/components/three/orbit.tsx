"use client"

import { extend, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"
import { OrbitControls } from "three-stdlib"

extend({ OrbitControls })

const Controls = () => {
    const controls = useRef<OrbitControls>(null)

    const { camera, gl } = useThree()

    useFrame(() => (controls.current !== null ? controls.current.update() : undefined))

    useEffect(() => {
        console.log("looking", camera.getWorldDirection(new Vector3(0, 0, 0)))
        const rot = camera.getWorldDirection(new Vector3(0, 0, 0))
        camera.rotateX(-2 * rot.x)
        camera.rotateY(-2 * rot.y)
        camera.rotateZ(-2 * rot.z)
        console.log("looking", camera.getWorldDirection(new Vector3(0, 0, 0)))
        camera.updateProjectionMatrix()
    }, [camera])

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
        />
    )
}

export { Controls as OrbitControls }
