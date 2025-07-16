import * as THREE from 'three'

export const setupLights = (scene: THREE.Scene, house: THREE.Group) => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight('#86cdff', 0.5)
  scene.add(ambientLight)

  // Directional light
  const directionalLight = new THREE.DirectionalLight('#86cdff', 1.5)
  directionalLight.position.set(3, 2, -8)
  scene.add(directionalLight)

  //door light
  const doorLight = new THREE.PointLight('#ff7d46', 4, 10, 2)
  doorLight.position.set(0, 2.25, 2.5)
  house.add(doorLight)

  //ghost lights
  const ghost1Light = new THREE.PointLight('#8800ff', 6)
  house.add(ghost1Light)

  const ghost2Light = new THREE.PointLight('#ff0088', 6)
  house.add(ghost2Light)

  const ghost3Light = new THREE.PointLight('#ff0000', 6)
  house.add(ghost3Light)

  // Setup shadows
  directionalLight.castShadow = true
  ghost1Light.castShadow = true
  ghost2Light.castShadow = true
  ghost3Light.castShadow = true

  //mapping
  directionalLight.shadow.mapSize.set(256, 256)
  directionalLight.shadow.camera.top = 8
  directionalLight.shadow.camera.bottom = -8
  directionalLight.shadow.camera.left = -8
  directionalLight.shadow.camera.right = 8
  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 20

  ghost1Light.shadow.mapSize.set(256, 256)
  ghost1Light.shadow.camera.far = 10

  ghost2Light.shadow.mapSize.set(256, 256)
  ghost2Light.shadow.camera.far = 10

  ghost3Light.shadow.mapSize.set(256, 256)
  ghost3Light.shadow.camera.far = 10

  return { ambientLight, directionalLight, doorLight, ghost1Light, ghost2Light, ghost3Light }
} 