"use client"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useLayoutEffect, useRef } from "react"
import { extend, useFrame, useThree } from '@react-three/fiber'

extend({ OrbitControls })

const Controls = () => {
    const controls = useRef<OrbitControls>(null)
    const { camera, gl } = useThree()
    useLayoutEffect(() => {
        camera.position.setY(3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useFrame(() => controls.current !== null ? controls.current.update() : undefined)
    return <orbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
}

export { Controls as OrbitControls }
