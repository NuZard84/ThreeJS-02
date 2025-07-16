import * as THREE from 'three'
import { houseMessurments } from '../utils/constants'
import GUI from 'lil-gui'

export const createHouse = (
  scene: THREE.Scene, 
  textures: any,
  gui: GUI
) => {
  //floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({ 
      alphaMap: textures.floor.alpha,
      transparent: true, 
      map: textures.floor.color, 
      aoMap: textures.floor.aoRoughnessMetalness,
      roughnessMap: textures.floor.aoRoughnessMetalness,
      metalnessMap: textures.floor.aoRoughnessMetalness,
      displacementMap: textures.floor.displacement,
      displacementScale: 0.3,
      displacementBias: -0.2,
      normalMap: textures.floor.normal,
    }) //for realistic look
  )
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

  const floorFolder = gui.addFolder('Floor')
  floorFolder.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Displacement Scale')
  floorFolder.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Displacement Bias')

  //house container
  const house = new THREE.Group()
  scene.add(house)

  //house walls
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseMessurments.walls.width, houseMessurments.walls.height, houseMessurments.walls.depth),
    new THREE.MeshStandardMaterial({
      aoMap: textures.wall.aoRoughnessMetalness,
      roughnessMap: textures.wall.aoRoughnessMetalness,
      metalnessMap: textures.wall.aoRoughnessMetalness,
      normalMap: textures.wall.normal,
      map: textures.wall.color,
    })
  )
  walls.position.y = houseMessurments.walls.height/2
  house.add(walls)

  //house roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(houseMessurments.roof.radius, houseMessurments.roof.height, 4),
    new THREE.MeshStandardMaterial({
      aoMap: textures.roof.aoRoughnessMetalness,
      roughnessMap: textures.roof.aoRoughnessMetalness,
      metalnessMap: textures.roof.aoRoughnessMetalness,
      normalMap: textures.roof.normal,
      map: textures.roof.color,
    })
  )

  roof.position.y = houseMessurments.walls.height + ( houseMessurments.roof.height / 2 )
  roof.rotation.y = Math.PI * 0.25
  house.add(roof)

  //door 
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(houseMessurments.door.width, houseMessurments.door.height, 100, 100),
    new THREE.MeshStandardMaterial({
      aoMap: textures.door.aoOcclusion,
      roughnessMap: textures.door.roughness,
      metalnessMap: textures.door.metalness,
      normalMap: textures.door.normal,
      map: textures.door.color,
      alphaMap: textures.door.alpha,
      transparent: true,
      displacementMap: textures.door.height,
      displacementScale: 0.15,
      displacementBias: -0.04,
    })
  )
  door.position.y = (houseMessurments.door.height / 2) - 0.1 //for elevation isssue
  door.position.z =  ( houseMessurments.walls.depth / 2 ) + 0.01
  house.add(door)

  //bushes 
  const bushGeo = new THREE.SphereGeometry(1, 16, 16)
  const bushMat = new THREE.MeshStandardMaterial({ 
    aoMap: textures.bush.aoRoughnessMetalness,
    roughnessMap: textures.bush.aoRoughnessMetalness,
    metalnessMap: textures.bush.aoRoughnessMetalness,
    normalMap: textures.bush.normal,
    map: textures.bush.color,
    color: '#ccffcc'
  })
  
  const bush1 = new THREE.Mesh(bushGeo, bushMat)
  const bush2 = new THREE.Mesh(bushGeo, bushMat)
  const bush3 = new THREE.Mesh(bushGeo, bushMat)
  const bush4 = new THREE.Mesh(bushGeo, bushMat)

  bush1.scale.setScalar(0.5)
  bush1.position.set(0.8, 0.2, 2.2)
  bush1.rotation.x = -0.75

  bush2.scale.setScalar(0.25)
  bush2.position.set(1.4, 0.1, 2.1)
  bush2.rotation.x = -0.75

  bush3.scale.setScalar(0.4)
  bush3.rotation.x = -0.75
  bush3.position.set(-0.8, 0.1, 2.2)
  
  bush4.scale.setScalar(0.15)
  bush4.position.set(-1, 0.05, 2.6)
  bush4.rotation.x = -0.75

  house.add(bush1, bush2, bush3, bush4)

  //graves
  const graveGeo = new THREE.BoxGeometry(houseMessurments.graves.width, houseMessurments.graves.height, houseMessurments.graves.depth)
  const graveMat = new THREE.MeshStandardMaterial({ 
    aoMap: textures.grave.aoRoughnessMetalness,
    roughnessMap: textures.grave.aoRoughnessMetalness,
    metalnessMap: textures.grave.aoRoughnessMetalness,
    normalMap: textures.grave.normal,
    map: textures.grave.color,
  })

  const graves = new THREE.Group()
  scene.add(graves)

  for (let i = 0; i < houseMessurments.graves.amount; i++) {
    const angle = Math.random() * Math.PI * 2 //(0 to 360)
    const radius = (Math.random() * 4) + 3
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = Math.random() * (houseMessurments.graves.height * 0.5)
    const randomRotation = (Math.random() - 0.5) * 0.4

    const grave = new THREE.Mesh(graveGeo, graveMat)

    grave.position.set(x, y, z)
    grave.rotation.set(randomRotation, randomRotation, randomRotation)

    graves.add(grave)
  }

  return { house, floor, walls, roof, graves }
} 