import { type JSX, useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { Timer } from 'three/examples/jsm/Addons.js'
import type { Group } from 'three/examples/jsm/libs/tween.module.js'


/* 

Notes: AO (ambient occlusion): Prevents the ambient light being applied to crevices

Diffuse: The actual color

Displacement: Will move the vertices up and down to create elevations

Normal: Will fake the orientation to create details. DX and GL are different ways of orienting the normals and we need to go for GL.

Rough: How smooth or rough the material is

*/

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Canvas
    const canvas = canvasRef.current
    
    // Scene
    const scene = new THREE.Scene()

    // Debug
    const gui = new GUI()

    const textureLoader = new THREE.TextureLoader()

    //floor texture
    const floorAlphaTexture = textureLoader.load("./resources/floor/alpha.jpg")
    const floorColorTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg")
    const floorNormalTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg")
    const floorAORoughnessMetalnessTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg")
    const floorDisplacementTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg")

    /*
    Note: First issue, the texture is too big
          We are going to play with the repeat property of the texture, and we need to do that for all 4 textures

          repeat is a Vector2 and will control how many times we want the texture to repeat for the same surface

          A higher value will result in a smaller repeating pattern
    */
    floorColorTexture.repeat.set(8, 8)
    floorColorTexture.wrapS = THREE.RepeatWrapping
    floorColorTexture.wrapT = THREE.RepeatWrapping
    floorColorTexture.colorSpace = THREE.SRGBColorSpace

    floorNormalTexture.repeat.set(8, 8)
    floorNormalTexture.wrapS = THREE.RepeatWrapping
    floorNormalTexture.wrapT = THREE.RepeatWrapping

    floorAORoughnessMetalnessTexture.repeat.set(8, 8)
    floorAORoughnessMetalnessTexture.wrapS = THREE.RepeatWrapping
    floorAORoughnessMetalnessTexture.wrapT = THREE.RepeatWrapping

    floorDisplacementTexture.repeat.set(8, 8)
    floorDisplacementTexture.wrapS = THREE.RepeatWrapping
    floorDisplacementTexture.wrapT = THREE.RepeatWrapping

    //wall texture
    const wallAORoughnessMetalnessTexture = textureLoader.load("./resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg")
    const wallNormalTexture = textureLoader.load("./resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg")
    const wallColorTexture = textureLoader.load("./resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg")

    wallColorTexture.colorSpace = THREE.SRGBColorSpace

    //roof texture
    const roofAORoughnessMetalnessTexture = textureLoader.load("./resources/roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg")
    const roofNormalTexture = textureLoader.load("./resources/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg")
    const roofColorTexture = textureLoader.load("./resources/roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg")

    roofColorTexture.colorSpace = THREE.SRGBColorSpace
    roofColorTexture.repeat.set(3, 1)
    roofColorTexture.wrapS = THREE.RepeatWrapping
  
    roofAORoughnessMetalnessTexture.repeat.set(3, 1)
    roofAORoughnessMetalnessTexture.wrapS = THREE.RepeatWrapping
   

    roofNormalTexture.repeat.set(3, 1)
    roofNormalTexture.wrapS = THREE.RepeatWrapping
    
    //bush texture

    const bushAORoughnessMetalnessTexture = textureLoader.load("./resources/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg")
    const bushNormalTexture = textureLoader.load("./resources/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg")
    const bushColorTexture = textureLoader.load("./resources/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg")

    bushColorTexture.colorSpace = THREE.SRGBColorSpace

    bushAORoughnessMetalnessTexture.repeat.set(2, 1)
    bushAORoughnessMetalnessTexture.wrapS = THREE.RepeatWrapping
  
    bushNormalTexture.repeat.set(2, 1)
    bushNormalTexture.wrapS = THREE.RepeatWrapping
   
    bushColorTexture.repeat.set(2, 1)
    bushColorTexture.wrapS = THREE.RepeatWrapping

    //grave texture
    const graveAORoughnessMetalnessTexture = textureLoader.load("./resources/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg")
    const graveNormalTexture = textureLoader.load("./resources/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg")
    const graveColorTexture = textureLoader.load("./resources/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg")

    graveColorTexture.colorSpace = THREE.SRGBColorSpace

    graveAORoughnessMetalnessTexture.repeat.set(0.3, 0.4)
    graveAORoughnessMetalnessTexture.wrapS = THREE.RepeatWrapping
    graveAORoughnessMetalnessTexture.wrapT = THREE.RepeatWrapping

    graveNormalTexture.repeat.set(0.3, 0.4)
    graveNormalTexture.wrapS = THREE.RepeatWrapping
    graveNormalTexture.wrapT = THREE.RepeatWrapping

    graveColorTexture.repeat.set(0.3, 0.4)
    graveColorTexture.wrapS = THREE.RepeatWrapping
    graveColorTexture.wrapT = THREE.RepeatWrapping

    //door texture
    const doorAlphaTexture = textureLoader.load("./resources/door/alpha.jpg")
    const doorColorTexture = textureLoader.load("./resources/door/color.jpg")
    const doorNormalTexture = textureLoader.load("./resources/door/normal.jpg")
    const doorAORoughnessMetalnessTexture = textureLoader.load("./resources/door/ambientOcclusion.jpg")
    const doorRoughnessTexture = textureLoader.load("./resources/door/roughness.jpg")
    const doorMetalnessTexture = textureLoader.load("./resources/door/metalness.jpg")
    const doorHeightTexture = textureLoader.load("./resources/door/height.jpg")

    doorColorTexture.colorSpace = THREE.SRGBColorSpace
    
    
    /**
     * House
     */

    const houseMessurments = {
      walls : {
        width: 4,
        height: 2.5,
        depth: 4
      },
      roof : {
        height: 1.5,
        radius: 3.5
      },
      door : {
        width: 2.2,
        height: 2.2
      },
      graves : {
        amount: 30,
        height: 0.8,
        width: 0.6,
        depth: 0.2
      }
    }
    //floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 100, 100),
      new THREE.MeshStandardMaterial({ 
        alphaMap: floorAlphaTexture,
        transparent: true , 
        map: floorColorTexture, 
        aoMap: floorAORoughnessMetalnessTexture,
        roughnessMap: floorAORoughnessMetalnessTexture,
        metalnessMap: floorAORoughnessMetalnessTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2,
        normalMap: floorNormalTexture,
      }) //for realistic look
    )
    floor.rotation.x = -Math.PI * 0.5
    scene.add(floor)

    const floorFolder = gui.addFolder('Floor')
    floorFolder.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Displacement Scale')
    floorFolder.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Displacement Bias')

    //house contianer
    const house = new THREE.Group()
    scene.add(house)

    //house walls
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(houseMessurments.walls.width, houseMessurments.walls.height, houseMessurments.walls.depth),
      new THREE.MeshStandardMaterial({
        aoMap: wallAORoughnessMetalnessTexture,
        roughnessMap: wallAORoughnessMetalnessTexture,
        metalnessMap: wallAORoughnessMetalnessTexture,
        normalMap: wallNormalTexture,
        map: wallColorTexture,
      })
    )
    walls.position.y = houseMessurments.walls.height/2
    house.add(walls)

    //house roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(houseMessurments.roof.radius, houseMessurments.roof.height, 4),
      new THREE.MeshStandardMaterial({
        aoMap: roofAORoughnessMetalnessTexture,
        roughnessMap: roofAORoughnessMetalnessTexture,
        metalnessMap: roofAORoughnessMetalnessTexture,
        normalMap: roofNormalTexture,
        map: roofColorTexture,
      })
    )

    roof.position.y = houseMessurments.walls.height + ( houseMessurments.roof.height / 2 )
    roof.rotation.y = Math.PI * 0.25
    house.add(roof)

    //door 

    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(houseMessurments.door.width, houseMessurments.door.height, 100, 100),
      new THREE.MeshStandardMaterial({
        aoMap: doorAORoughnessMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
      })
    )
    // door.position.y = houseMessurments.door.height / 2
    // door.position.x = (houseMessurments.walls.width / 2 ) + 0.01
    // door.rotation.y = Math.PI * 0.5

    door.position.y = (houseMessurments.door.height / 2) - 0.1 //for elevation isssue
    door.position.z =  ( houseMessurments.walls.depth / 2 ) + 0.01
    house.add(door)

    //bushes 
    const bushGeo = new THREE.SphereGeometry(1, 16, 16)
    const bushMat = new THREE.MeshStandardMaterial({ 
      aoMap: bushAORoughnessMetalnessTexture,
      roughnessMap: bushAORoughnessMetalnessTexture,
      metalnessMap: bushAORoughnessMetalnessTexture,
      normalMap: bushNormalTexture,
      map: bushColorTexture,
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


    house.add(bush1, bush2, bush3, bush4, )

    //graves

    const graveGeo = new THREE.BoxGeometry(houseMessurments.graves.width, houseMessurments.graves.height, houseMessurments.graves.depth)
    const graveMat = new THREE.MeshStandardMaterial({ 
      aoMap: graveAORoughnessMetalnessTexture,
      roughnessMap: graveAORoughnessMetalnessTexture,
      metalnessMap: graveAORoughnessMetalnessTexture,
      normalMap: graveNormalTexture,
      map: graveColorTexture,
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


    // // Temporary sphere
    // const sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(1, 32, 32),
    //   new THREE.MeshStandardMaterial({ roughness: 0.7 })
    // )
    // scene.add(sphere)

    /**
     * Lights
     */
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

    //ghost light

    const ghost1Light = new THREE.PointLight('#8800ff', 6, )
    house.add(ghost1Light)

    const ghost2Light = new THREE.PointLight('#ff0088', 6)
    house.add(ghost2Light)

    const ghost3Light = new THREE.PointLight('#ff0000', 6)
    house.add(ghost3Light)

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 4
    camera.position.y = 2
    camera.position.z = 5
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

    /**
     * Animate
     */
    const timer = new Timer()

    const tick = () => {
      // Get elapsed time
      timer.update()
      const elapsedTime = timer.getElapsed()
      // console.log(elapsedTime)

      const ghost1Angle = elapsedTime * 0.5
      ghost1Light.position.x = Math.cos(ghost1Angle) * 4
      ghost1Light.position.z = Math.sin(ghost1Angle) * 4
      ghost1Light.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45) 

      const ghost2Angle = - elapsedTime * 0.38
      ghost2Light.position.x = Math.cos(ghost2Angle) * 5
      ghost2Light.position.z = Math.sin(ghost2Angle) * 5
      ghost2Light.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45) 

      const ghost3Angle = elapsedTime * 0.23 
      ghost3Light.position.x = Math.cos(ghost3Angle) * 6
      ghost3Light.position.z = Math.sin(ghost3Angle) * 6
      ghost3Light.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45) 


      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener("dblclick", handleDoubleClick)

      gui.destroy()
      controls.dispose()
      renderer.dispose()
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