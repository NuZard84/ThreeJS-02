import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Timer } from 'three/examples/jsm/Addons.js'

export const setupAnimation = (
  camera: THREE.Camera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  ghostLights: {
    ghost1Light: THREE.PointLight,
    ghost2Light: THREE.PointLight,
    ghost3Light: THREE.PointLight
  }
) => {
  const timer = new Timer()

  const tick = () => {
    // Get elapsed time
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Animate ghost lights
    const ghost1Angle = elapsedTime * 0.5
    ghostLights.ghost1Light.position.x = Math.cos(ghost1Angle) * 4
    ghostLights.ghost1Light.position.z = Math.sin(ghost1Angle) * 4
    ghostLights.ghost1Light.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45) 

    const ghost2Angle = - elapsedTime * 0.38
    ghostLights.ghost2Light.position.x = Math.cos(ghost2Angle) * 5
    ghostLights.ghost2Light.position.z = Math.sin(ghost2Angle) * 5
    ghostLights.ghost2Light.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45) 

    const ghost3Angle = elapsedTime * 0.23 
    ghostLights.ghost3Light.position.x = Math.cos(ghost3Angle) * 6
    ghostLights.ghost3Light.position.z = Math.sin(ghost3Angle) * 6
    ghostLights.ghost3Light.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45) 

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  // Start the animation loop
  tick()
} 