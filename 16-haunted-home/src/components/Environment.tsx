import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/Addons.js'
import { fogSettings, skySettings } from '../utils/constants'

export const setupEnvironment = (scene: THREE.Scene) => {
  // Sky
  const sky = new Sky()
  sky.scale.setScalar(100)
  scene.add(sky)

  if (sky.material && sky.material.uniforms) {
    sky.material.uniforms['turbidity']!.value = skySettings.turbidity
    sky.material.uniforms['rayleigh']!.value = skySettings.rayleigh
    sky.material.uniforms['mieCoefficient']!.value = skySettings.mieCoefficient as any
    sky.material.uniforms['mieDirectionalG']!.value = skySettings.mieDirectionalG as any
    sky.material.uniforms['sunPosition']!.value.copy(skySettings.sunPosition)
  }

  // Fog
  const fog = new THREE.Fog(fogSettings.color, fogSettings.near, fogSettings.far)
  scene.fog = fog

  return { sky, fog }
} 