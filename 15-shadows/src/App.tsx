import { useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

/*
  Note: point light
  directional light
  spot light - only these light support the shadows

  Note: Different types of algorithms can be applied to shadow maps

      THREE.BasicShadowMap — Very performant but lousy quality

      THREE.PCFShadowMap — Less performant but smoother edges (default)

      THREE.PCFSoftShadowMap — Less performant but even softer edges

      THREE.VSMShadowMap — Less performant, more constraints, can have unexpected results
*/

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current
    const scene = new THREE.Scene()

    const textureLoader = new THREE.TextureLoader()
    const backedShadow = textureLoader.load('./textures/bakedShadow.jpg')
    backedShadow.colorSpace = THREE.SRGBColorSpace
    const simpleShadow = textureLoader.load('./textures/simpleShadow.jpg')
    simpleShadow.colorSpace = THREE.SRGBColorSpace


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 6;

    //ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Directional light from right side
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(2, 2, -1) // Right side positioning
    scene.add(directionalLight)

    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 6
    directionalLight.shadow.camera.left = -2
    directionalLight.shadow.camera.right = 2
    directionalLight.shadow.camera.top = 2
    directionalLight.shadow.camera.bottom = -2
    directionalLight.shadow.radius = 10 // for PCFSoftShadowMap not supported
    directionalLight.shadow.camera.updateProjectionMatrix()
    directionalLight.shadow.mapSize.set(1024, 1024)
    // directionalLight.shadow.bias = -0.001

    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    directionalLightCameraHelper.visible = false
    scene.add(directionalLightCameraHelper)

    const spotLight = new THREE.SpotLight(0xffffff, 8, 19, Math.PI / 4, 0.3)
    spotLight.position.set(0,3, 3)
    spotLight.castShadow = true
    spotLight.shadow.camera.near = 1
    spotLight.shadow.camera.far = 6.5
    spotLight.shadow.mapSize.set(1024, 1024)
    // spotLight.shadow.camera.fov = 30
   

    scene.add(spotLight)
    scene.add(spotLight.target)

    const spotlightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    spotlightHelper.visible = false
    scene.add(spotlightHelper)

    const pointLight = new THREE.PointLight(0xffffff, 24, 19)
    pointLight.position.set(0, 3.5, 0.3)
    pointLight.castShadow = true
    pointLight.shadow.camera.near = 1
    pointLight.shadow.camera.far = 4
    pointLight.shadow.mapSize.set(1024, 1024)
    scene.add(pointLight)

    const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
    pointLightCameraHelper.visible = false
    scene.add(pointLightCameraHelper)


    const material = new THREE.MeshStandardMaterial({})
    material.roughness = 0.4

    // Sphere at center
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 32, 32),
      material
    )
    sphere.position.y = 0.5
    sphere.castShadow = true
    
    scene.add(sphere)

    const plan = new THREE.Mesh(
      new THREE.PlaneGeometry(6.75, 6.75),
   material
    )
    plan.position.y = -0.5
    plan.rotation.x = -Math.PI / 2
    plan.receiveShadow = true
   
    scene.add(plan)

    const spehereShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x00000,
        // side: THREE.DoubleSide
        transparent: true,
        alphaMap: simpleShadow
      })
    )
    spehereShadow.position.y = plan.position.y + 0.01
    spehereShadow.rotation.x = -Math.PI / 2
    scene.add(spehereShadow)


    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({canvas: canvas})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = false
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const clock = new THREE.Clock()
    
    // Add animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      sphere.position.z = Math.sin(elapsedTime)  
      sphere.position.x = Math.cos(elapsedTime) 
      sphere.position.y = Math.abs(Math.sin(elapsedTime * 4 )) 

      spehereShadow.position.y = sphere.position.y + 0.01
      spehereShadow.position.z = sphere.position.z + 0.01
   spehereShadow.material.opacity =(1 - sphere.position.y) * 0.5



      
      controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(animate)
    }
    
    animate()
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
    }
   
  }, [])

  return (
    <>
     <div className='container'>
      <canvas className='webgl' ref={canvasRef}></canvas>
     </div>
    </>
  )
}

export default App
