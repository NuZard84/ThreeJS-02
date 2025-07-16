import * as THREE from 'three'

/* 
Notes: AO (ambient occlusion): Prevents the ambient light being applied to crevices

Diffuse: The actual color

Displacement: Will move the vertices up and down to create elevations

Normal: Will fake the orientation to create details. DX and GL are different ways of orienting the normals and we need to go for GL.

Rough: How smooth or rough the material is
*/

export const loadTextures = () => {
  const textureLoader = new THREE.TextureLoader()
  
  //floor texture
  const floorAlphaTexture = textureLoader.load("./resources/floor/alpha.webp")
  const floorColorTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp")
  const floorNormalTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp")
  const floorAORoughnessMetalnessTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp")
  const floorDisplacementTexture = textureLoader.load("./resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp")

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
  const wallAORoughnessMetalnessTexture = textureLoader.load("./resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp")
  const wallNormalTexture = textureLoader.load("./resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp")
  const wallColorTexture = textureLoader.load("./resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp")

  wallColorTexture.colorSpace = THREE.SRGBColorSpace

  //roof texture
  const roofAORoughnessMetalnessTexture = textureLoader.load("./resources/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp")
  const roofNormalTexture = textureLoader.load("./resources/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp")
  const roofColorTexture = textureLoader.load("./resources/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp")

  roofColorTexture.colorSpace = THREE.SRGBColorSpace
  roofColorTexture.repeat.set(3, 1)
  roofColorTexture.wrapS = THREE.RepeatWrapping

  roofAORoughnessMetalnessTexture.repeat.set(3, 1)
  roofAORoughnessMetalnessTexture.wrapS = THREE.RepeatWrapping

  roofNormalTexture.repeat.set(3, 1)
  roofNormalTexture.wrapS = THREE.RepeatWrapping
  
  //bush texture
  const bushAORoughnessMetalnessTexture = textureLoader.load("./resources/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp")
  const bushNormalTexture = textureLoader.load("./resources/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp")
  const bushColorTexture = textureLoader.load("./resources/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp")

  bushColorTexture.colorSpace = THREE.SRGBColorSpace

  bushAORoughnessMetalnessTexture.repeat.set(2, 1)
  bushAORoughnessMetalnessTexture.wrapS = THREE.RepeatWrapping

  bushNormalTexture.repeat.set(2, 1)
  bushNormalTexture.wrapS = THREE.RepeatWrapping
  
  bushColorTexture.repeat.set(2, 1)
  bushColorTexture.wrapS = THREE.RepeatWrapping

  //grave texture
  const graveAORoughnessMetalnessTexture = textureLoader.load("./resources/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp")
  const graveNormalTexture = textureLoader.load("./resources/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp")
  const graveColorTexture = textureLoader.load("./resources/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp")

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
  const doorAlphaTexture = textureLoader.load("./resources/door/alpha.webp")
  const doorColorTexture = textureLoader.load("./resources/door/color.webp")
  const doorNormalTexture = textureLoader.load("./resources/door/normal.webp")
  const doorAORoughnessMetalnessTexture = textureLoader.load("./resources/door/ambientOcclusion.webp")
  const doorRoughnessTexture = textureLoader.load("./resources/door/roughness.webp")
  const doorMetalnessTexture = textureLoader.load("./resources/door/metalness.webp")
  const doorHeightTexture = textureLoader.load("./resources/door/height.webp")

  doorColorTexture.colorSpace = THREE.SRGBColorSpace

  return {
    floor: {
      alpha: floorAlphaTexture,
      color: floorColorTexture,
      normal: floorNormalTexture,
      aoRoughnessMetalness: floorAORoughnessMetalnessTexture,
      displacement: floorDisplacementTexture
    },
    wall: {
      color: wallColorTexture,
      normal: wallNormalTexture,
      aoRoughnessMetalness: wallAORoughnessMetalnessTexture
    },
    roof: {
      color: roofColorTexture,
      normal: roofNormalTexture,
      aoRoughnessMetalness: roofAORoughnessMetalnessTexture
    },
    bush: {
      color: bushColorTexture,
      normal: bushNormalTexture,
      aoRoughnessMetalness: bushAORoughnessMetalnessTexture
    },
    grave: {
      color: graveColorTexture,
      normal: graveNormalTexture,
      aoRoughnessMetalness: graveAORoughnessMetalnessTexture
    },
    door: {
      alpha: doorAlphaTexture,
      color: doorColorTexture,
      normal: doorNormalTexture,
      aoOcclusion: doorAORoughnessMetalnessTexture,
      roughness: doorRoughnessTexture,
      metalness: doorMetalnessTexture,
      height: doorHeightTexture
    }
  }
} 