import { useEffect,  useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls} from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'

/* 

Note: Performance wise, the more lights you have, the more performance you will lose.
- good performnace - ambient and hemisphere light
- moderate performnace - directional light and pointlight
- bad performnace -  rect area, spot light

- good performnace - meshstandardmaterial
- bad performnace - meshphysicalmaterial

*/

function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gui = new GUI({
    width: 300,
    title: "Lights",
  })

  useEffect(() => {

    if (!canvasRef.current) return;

    const canvas = canvasRef.current
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 6;

    // ambient light - it is come from everywhere (uniform) and it is not directional
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    gui.add(ambientLight, "intensity").min(0).max(3).step(0.001).name("ambientLightIntensity")

    //directional light - it is come from a specific direction and it is directional
    const directionalLight = new THREE.DirectionalLight(0x00fffc, 1)
    directionalLight.position.set(1, 0.25, 0)
    scene.add(directionalLight)

    gui.add(directionalLight, "intensity").min(0).max(3).step(0.001).name("directionalLightIntensity")

    //hemesphere light - like ambient light but with a different color from the sky than the color coming from the ground
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x000ff, 0.9)
    scene.add(hemisphereLight)

    gui.add(hemisphereLight, "intensity").min(0).max(3).step(0.001).name("hemisphereLightIntensity")

    //point light - it is come from a specific point and it is not directional
    const pointLight = new THREE.PointLight(0xff9000, 1.5, 10, 2)
    pointLight.position.set(1, -0.1, 1)
    scene.add(pointLight)

    gui.add(pointLight, "intensity").min(0).max(3).step(0.001).name("pointLightIntensity")
    gui.add(pointLight, "distance").min(0).max(10).step(0.001).name("pointLightDistance")

    //rect area light - works like the big rectangle light yopu can see on the photoshoot set- mix b/w directional and diffuse light
    //only work with meshstandardmaterial & mesh physical material
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1)

    rectAreaLight.position.set(-1.5, 0, 1.5)

    rectAreaLight.lookAt(new THREE.Vector3())
    rectAreaLight.castShadow = true
    scene.add(rectAreaLight)

    gui.add(rectAreaLight, "intensity").min(0).max(3).step(0.001).name("rectAreaLightIntensity")
    gui.add(rectAreaLight, "width").min(0).max(3).step(0.001).name("rectAreaLightWidth")
    gui.add(rectAreaLight, "height").min(0).max(3).step(0.001).name("rectAreaLightHeight")

    //spot light - it is like flash light - cone of light starting at a point and oriented in direction
    const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1)
    spotLight.position.set(0, 2, 3)
    scene.add(spotLight)
    spotLight.target.position.x = -1.5
    // spotLight.target.position.y = 0.5
    spotLight.target.updateMatrixWorld()
    scene.add(spotLight.target)


    gui.add(spotLight, "intensity").min(0).max(3).step(0.001).name("spotLightIntensity")
    gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.001).name("spotLightAngle")
    //sharness of the light at the objects edges
    gui.add(spotLight, "penumbra").min(0).max(1).step(0.001).name("spotLightPenumbra")
    gui.add(spotLight, "distance").min(0).max(10).step(0.001).name("spotLightDistance")
    gui.add(spotLight, "decay").min(0).max(2).step(0.001).name("spotLightDecay")

    //helpers
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
    scene.add(hemisphereLightHelper)

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
    scene.add(directionalLightHelper)

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
    scene.add(pointLightHelper)

    const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
    scene.add(spotLightHelper)

    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
    scene.add(rectAreaLightHelper)

    const material = new THREE.MeshStandardMaterial({
    })
    material.roughness = 0.4

    const spehere = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 32, 32),
      material
    )
    spehere.position.x = -2.5
    spehere.position.y = 0.5

    scene.add(spehere)

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      material
    )
    cube.position.y = 0.5

    scene.add(cube)

    const donut = new THREE.Mesh(
      new THREE.TorusGeometry(0.6, 0.3, 16, 60),
      material
    )

    scene.add(donut)

    donut.position.x = 2.5
    donut.position.y = 0.5

    const plan = new THREE.Mesh(
      new THREE.PlaneGeometry(6.75, 6.75),
      material
    )
    plan.position.y = -0.5
    plan.rotation.x = -Math.PI / 2
   
    scene.add(plan)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({canvas: canvas})
    renderer.setSize(window.innerWidth, window.innerHeight)

    const clock = new THREE.Clock()
    
    // Add animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      spehere.rotation.y = 0.3 * elapsedTime
      cube.rotation.y = 0.3 * elapsedTime
      donut.rotation.y = 0.3 * elapsedTime

      spehere.rotation.x = -0.15 * elapsedTime
      cube.rotation.x = -0.15 * elapsedTime
      donut.rotation.x = -0.15 * elapsedTime

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
