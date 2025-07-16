import { type JSX, useEffect, useRef } from 'react'
import './App.css'
import GUI from 'lil-gui'
import { setupScene } from './components/Scene'
import { loadTextures } from './components/TextureLoader'
import { createHouse } from './components/House'
import { setupLights } from './components/Lighting'
import { setupEnvironment } from './components/Environment'
import { setupAnimation } from './components/Animation'

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Canvas
    const canvas = canvasRef.current
    
    // Debug GUI
    const gui = new GUI()

    // Setup scene, camera, and renderer
    const { scene, camera, renderer, controls, cleanup, sizes } = setupScene({ canvas })
    
    // Load textures
    const textures = loadTextures()
    
    // Create house and environment elements
    const { house, floor, walls, roof, graves } = createHouse(scene, textures, gui)
    
    // Setup lights
    const { directionalLight, ghost1Light, ghost2Light, ghost3Light } = setupLights(scene, house)
    
    // Setup environment (sky, fog)
    setupEnvironment(scene)
    
    // Setup shadows
    walls.castShadow = true
    walls.receiveShadow = true
    roof.castShadow = true
    floor.receiveShadow = true

    graves.children.forEach((child : any) => {
      child.castShadow = true
      child.receiveShadow = true
    })
    
    // Setup animation
    setupAnimation(camera, scene, renderer, controls, { ghost1Light, ghost2Light, ghost3Light })

    // Clean up
    return () => {
      cleanup()
      gui.destroy()
      floor.geometry.dispose()
      floor.material.dispose()
    }
  }, [])

  return (
    <div className='hero'>
      <canvas ref={canvasRef} className='webgl'></canvas>
    </div>
  )
}

export default App