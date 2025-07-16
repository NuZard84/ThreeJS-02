/**
 * House Measurements and other constants
 */
import * as THREE from 'three'

export const houseMessurments = {
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

export const fogSettings = {
  color: 0x02343f,
  near: 0.1,
  far: 22
}

export const skySettings = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.1,
  mieDirectionalG: 0.95,
  sunPosition: new THREE.Vector3(0.3, -0.038, -0.95)
} 