import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { GUI } from 'lil-gui'

function Starfield() {
  const pointsRef = useRef()

  useEffect(() => {
    const stars = new THREE.BufferGeometry()
    const count = 15000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Full spherical distribution for true outer space feel
      const r = 400 + Math.random() * 1200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI - Math.PI / 2 // Full hemisphere

      positions[i * 3] = r * Math.cos(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi)
      positions[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta)

      // Varied star colors (white, blue-white, yellow-white)
      const starType = Math.random()
      if (starType < 0.7) {
        colors[i * 3] = 1.0 // R
        colors[i * 3 + 1] = 1.0 // G
        colors[i * 3 + 2] = 1.0 // B
      } else if (starType < 0.9) {
        colors[i * 3] = 0.8 // R
        colors[i * 3 + 1] = 0.9 // G
        colors[i * 3 + 2] = 1.0 // B
      } else {
        colors[i * 3] = 1.0 // R
        colors[i * 3 + 1] = 0.95 // G
        colors[i * 3 + 2] = 0.8 // B
      }
    }

    stars.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    stars.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    pointsRef.current.geometry = stars
  }, [])

  return (
    <points ref={pointsRef}>
      <pointsMaterial
        size={1.5}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        vertexColors
      />
    </points>
  )
}

function CentralCube() {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = 0
      meshRef.current.rotation.y = 0
      meshRef.current.rotation.z = 0
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005
        meshRef.current.rotation.y += 0.008
        meshRef.current.rotation.z += 0.003
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[45, 45, 45]} />
      <meshStandardMaterial
        roughness={0.0}
        metalness={0.8}
        emissive={new THREE.Color(0x00aaff)}
        emissiveIntensity={3.0}
        color={new THREE.Color(0x002244)}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function ElectricCubes() {
  const instRef = useRef()
  const dummy = new THREE.Object3D()

  // Create a circular path around the nebula
  const curve = useMemo(() => {
    const points = []
    const radius = 120
    const heightVariation = 40
    for (let i = 0; i <= 200; i++) {
      const angle = (i / 200) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = Math.sin(angle * 3) * heightVariation + Math.cos(angle * 2) * heightVariation * 0.5
      points.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [])

  useEffect(() => {
    for (let i = 0; i < 100; i++) {
      const t = i / 100
      const position = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t)

      dummy.position.copy(position)
      dummy.scale.setScalar(0.6 + Math.sin(i * 0.3) * 0.4)
      dummy.lookAt(position.clone().add(tangent))
      dummy.rotateX(Math.PI / 2)
      dummy.updateMatrix()

      instRef.current.setMatrixAt(i, dummy.matrix)

      // Electric blue colors
      const hue = 0.55 + Math.sin(i * 0.1) * 0.1
      const col = new THREE.Color().setHSL(hue, 0.9, 0.7)
      instRef.current.setColorAt(i, col)
    }
    instRef.current.instanceMatrix.needsUpdate = true
    if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true
  }, [curve])

  useEffect(() => {
    let time = 0
    const animate = () => {
      const dt = Math.min(0.016, 0.05)
      time += dt

      for (let i = 0; i < 100; i++) {
        const speed = 0.2 + Math.sin(i * 0.05) * 0.1
        const t = ((time * speed + i * 0.01) % 1)
        const position = curve.getPointAt(t)
        const tangent = curve.getTangentAt(t)

        dummy.position.copy(position)
        dummy.scale.setScalar(0.6 + Math.sin(time * 3 + i * 0.5) * 0.3)
        dummy.lookAt(position.clone().add(tangent))
        dummy.rotateX(Math.PI / 2)
        dummy.rotateZ(time * 0.8 + i * 0.2)
        dummy.updateMatrix()

        instRef.current.setMatrixAt(i, dummy.matrix)
      }
      instRef.current.instanceMatrix.needsUpdate = true
      requestAnimationFrame(animate)
    }
    animate()
  }, [curve])

  return (
    <instancedMesh ref={instRef} args={[null, null, 100]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.02}
        metalness={0.5}
        emissive={new THREE.Color(0x00d4ff)}
        emissiveIntensity={2.2}
        color={new THREE.Color(0x001133)}
        transparent
        opacity={0.95}
      />
    </instancedMesh>
  )
}

function PurpleCubesAbove() {
  const instRef = useRef()
  const dummy = new THREE.Object3D()

  // Create a circular path above the blue cubes
  const curve = useMemo(() => {
    const points = []
    const radius = 120
    const heightVariation = 40
    const heightOffset = 35 // Above the blue cubes
    for (let i = 0; i <= 200; i++) {
      const angle = (i / 200) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = heightOffset + Math.sin(angle * 3) * heightVariation + Math.cos(angle * 2) * heightVariation * 0.5
      points.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [])

  useEffect(() => {
    for (let i = 0; i < 80; i++) {
      const t = i / 80
      const position = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t)

      dummy.position.copy(position)
      dummy.scale.setScalar(0.5 + Math.sin(i * 0.4) * 0.3)
      dummy.lookAt(position.clone().add(tangent))
      dummy.rotateX(Math.PI / 2)
      dummy.updateMatrix()

      instRef.current.setMatrixAt(i, dummy.matrix)

      // Electric purple colors
      const hue = 0.75 + Math.sin(i * 0.15) * 0.1
      const col = new THREE.Color().setHSL(hue, 0.9, 0.7)
      instRef.current.setColorAt(i, col)
    }
    instRef.current.instanceMatrix.needsUpdate = true
    if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true
  }, [curve])

  useEffect(() => {
    let time = 0
    const animate = () => {
      const dt = Math.min(0.016, 0.05)
      time += dt

      for (let i = 0; i < 80; i++) {
        const speed = 0.25 + Math.sin(i * 0.06) * 0.08
        const t = ((time * speed + i * 0.0125) % 1)
        const position = curve.getPointAt(t)
        const tangent = curve.getTangentAt(t)

        dummy.position.copy(position)
        dummy.scale.setScalar(0.5 + Math.sin(time * 3.5 + i * 0.6) * 0.25)
        dummy.lookAt(position.clone().add(tangent))
        dummy.rotateX(Math.PI / 2)
        dummy.rotateZ(time * 1.0 + i * 0.25)
        dummy.updateMatrix()

        instRef.current.setMatrixAt(i, dummy.matrix)
      }
      instRef.current.instanceMatrix.needsUpdate = true
      requestAnimationFrame(animate)
    }
    animate()
  }, [curve])

  return (
    <instancedMesh ref={instRef} args={[null, null, 80]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.02}
        metalness={0.5}
        emissive={new THREE.Color(0x8a2be2)}
        emissiveIntensity={2.0}
        color={new THREE.Color(0x1a0033)}
        transparent
        opacity={0.95}
      />
    </instancedMesh>
  )
}

function PurpleCubesBelow() {
  const instRef = useRef()
  const dummy = new THREE.Object3D()

  // Create a circular path below the blue cubes
  const curve = useMemo(() => {
    const points = []
    const radius = 120
    const heightVariation = 40
    const heightOffset = -35 // Below the blue cubes
    for (let i = 0; i <= 200; i++) {
      const angle = (i / 200) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = heightOffset + Math.sin(angle * 3) * heightVariation + Math.cos(angle * 2) * heightVariation * 0.5
      points.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [])

  useEffect(() => {
    for (let i = 0; i < 80; i++) {
      const t = i / 80
      const position = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t)

      dummy.position.copy(position)
      dummy.scale.setScalar(0.5 + Math.sin(i * 0.4) * 0.3)
      dummy.lookAt(position.clone().add(tangent))
      dummy.rotateX(Math.PI / 2)
      dummy.updateMatrix()

      instRef.current.setMatrixAt(i, dummy.matrix)

      // Electric purple colors (slightly different hue for variety)
      const hue = 0.8 + Math.sin(i * 0.15) * 0.08
      const col = new THREE.Color().setHSL(hue, 0.9, 0.7)
      instRef.current.setColorAt(i, col)
    }
    instRef.current.instanceMatrix.needsUpdate = true
    if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true
  }, [curve])

  useEffect(() => {
    let time = 0
    const animate = () => {
      const dt = Math.min(0.016, 0.05)
      time += dt

      for (let i = 0; i < 80; i++) {
        const speed = 0.22 + Math.sin(i * 0.06) * 0.06
        const t = ((time * speed + i * 0.0125) % 1)
        const position = curve.getPointAt(t)
        const tangent = curve.getTangentAt(t)

        dummy.position.copy(position)
        dummy.scale.setScalar(0.5 + Math.sin(time * 3.2 + i * 0.6) * 0.25)
        dummy.lookAt(position.clone().add(tangent))
        dummy.rotateX(Math.PI / 2)
        dummy.rotateZ(time * 0.9 + i * 0.25)
        dummy.updateMatrix()

        instRef.current.setMatrixAt(i, dummy.matrix)
      }
      instRef.current.instanceMatrix.needsUpdate = true
      requestAnimationFrame(animate)
    }
    animate()
  }, [curve])

  return (
    <instancedMesh ref={instRef} args={[null, null, 80]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.02}
        metalness={0.5}
        emissive={new THREE.Color(0x9932cc)}
        emissiveIntensity={2.0}
        color={new THREE.Color(0x1a0033)}
        transparent
        opacity={0.95}
      />
    </instancedMesh>
  )
}

function Scene() {
  const cameraRef = useRef()
  const controlsRef = useRef()

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 20, 80)
      cameraRef.current.lookAt(0, 0, 0)
    }
  }, [])

  // Camera orbits around the nebula center
  useEffect(() => {
    let time = 0
    const animate = () => {
      const dt = Math.min(0.016, 0.05)
      time += dt
      if (cameraRef.current) {
        const radius = 80 + Math.sin(time * 0.1) * 10
        const height = 20 + Math.cos(time * 0.15) * 5
        const angle = time * 0.05
        cameraRef.current.position.set(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        )
        cameraRef.current.lookAt(0, 0, 0)
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <>
      <perspectiveCamera ref={cameraRef} fov={50} near={0.1} far={2000} />
      <OrbitControls ref={controlsRef} enableDamping minDistance={50} maxDistance={200} />
      <ambientLight intensity={0.2} color={0x2a2a4e} />
      <directionalLight position={[50, 30, 20]} intensity={0.6} color={0x8bb8ff} />
      <pointLight position={[0, 0, 0]} intensity={2.0} color={0xaaccff} distance={200} />
      <Starfield />
      <CentralCube />
      <ElectricCubes />
      <PurpleCubesAbove />
      <PurpleCubesBelow />
      <EffectComposer>
        <Bloom intensity={1.8} radius={0.9} luminanceThreshold={0.4} />
        <SMAA />
      </EffectComposer>
    </>
  )
}

function App() {
  const [gui, setGui] = useState(null)

  useEffect(() => {
    const g = new GUI()
    const params = { bloom: 1.6, trail: 0.88 }
    g.add(params, 'bloom', 0, 3).onChange(v => {
      // Note: GUI controls need to be handled differently in React Three Fiber
      console.log('Bloom:', v)
    })
    g.add(params, 'trail', 0, 0.995).onChange(v => {
      console.log('Trail:', v)
    })
    g.add({ download: () => console.log('Download screenshot') }, 'download').name('Download image')
    setGui(g)

    return () => g.destroy()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'r') {
        // Reset camera logic
        console.log('Reset camera')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <Scene />
      </Canvas>
      <div className="ui">
        <strong>Electric Cubes — WebGL</strong><br />
        <small>Press R to reset camera • Drag to orbit</small>
      </div>
    </>
  )
}

export default App
