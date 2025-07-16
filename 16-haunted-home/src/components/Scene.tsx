import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

type SceneProps = {
  canvas: HTMLCanvasElement
}

export const setupScene = ({ canvas }: SceneProps) => {
  // Scene
  const scene = new THREE.Scene()
  
  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 4
  camera.position.y = 2
  camera.position.z = 5
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  // Shadows
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Event handlers
  const handleResize = () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  const handleDoubleClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      canvas.requestFullscreen()
    }
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('dblclick', handleDoubleClick)

  // Cleanup function
  const cleanup = () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener("dblclick", handleDoubleClick)
    controls.dispose()
    renderer.dispose()
  }

  return { 
    scene, 
    camera, 
    renderer, 
    controls,
    cleanup,
    sizes
  }
} 