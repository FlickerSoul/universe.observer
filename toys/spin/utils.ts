import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFDFDFD)
  scene.add(createLight())
  return scene
}

function createCamera(anchor: HTMLElement, pan: HTMLCanvasElement): [THREE.PerspectiveCamera, OrbitControls] {
  const cam = new THREE.PerspectiveCamera(75, anchor.clientWidth / anchor.clientHeight, 0.1, 100)
  cam.position.set(0, 0, 5)

  const control = new OrbitControls(cam, pan)
  control.enablePan = true
  control.update()

  return [cam, control]
}

function createRenderer(anchor: HTMLElement) {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(anchor.clientWidth, anchor.clientHeight)
  anchor.appendChild(renderer.domElement)
  return renderer
}

function createCylinder(
  geoOptions: ConstructorParameters<typeof THREE.CylinderGeometry> = [],
  upMaterialOptions: THREE.MeshPhysicalMaterialParameters = {},
  downMaterialOptions: THREE.MeshPhysicalMaterialParameters = {},
  sideMaterialOptions: THREE.MeshPhysicalMaterialParameters = {},
) {
  const geo = createCylinderGeometry(geoOptions)
  const matUp = createPhysicalMaterial({
    color: 0x0000FF,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    alphaMap: createFaceAlphaTexture(),
    roughness: 0.1,
    clearcoat: 0.5,
    reflectivity: 0.5,
    vertexColors: false,
    side: THREE.DoubleSide,
    ...upMaterialOptions,
  })
  const matDown = createPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    opacity: 0,
    roughness: 0.2,
    reflectivity: 0.5,
    vertexColors: false,
    side: THREE.DoubleSide,
    ...upMaterialOptions,
    ...downMaterialOptions,
  })
  const matSide = createPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    opacity: 0,
    roughness: 0.2,
    reflectivity: 0.5,
    side: THREE.DoubleSide,
    ...sideMaterialOptions,
  })
  const cyl = new THREE.Mesh(geo, [matSide, matUp, matDown])
  return cyl
}

function createLight() {
  const light = new THREE.AmbientLight(0x404040)
  return light
}

function createCylinderGeometry(options: ConstructorParameters<typeof THREE.CylinderGeometry> = []) {
  const geometry = new THREE.CylinderGeometry(...options)
  return geometry
}

function createPhysicalMaterial(options: THREE.MeshPhysicalMaterialParameters = {}) {
  const material = new THREE.MeshPhysicalMaterial({ ...options })
  return material
}

function createFaceAlphaTexture(options = { width: 1028, height: 1028 }) {
  const { width, height } = options

  const midCol = Math.round(width / 2)
  const midRow = Math.round(height / 2)
  const radius = Math.max(midCol, midRow)

  const size = width * height
  const data = new Uint8Array(4 * size)

  for (let i = 0; i < size; i++) {
    const stride = i * 4
    const col = i % height
    const row = Math.floor(i / width)
    const dist = Math.sqrt(
      (midCol - col) ** 2 + (midRow - row) ** 2,
    )

    data[stride] = 255 * (radius - dist) / radius
    data[stride + 1] = 255 * (radius - dist) / radius
    data[stride + 2] = 255 * (radius - dist) / radius
    data[stride + 3] = 255
  }

  // used the buffer to create a DataTexture
  const texture = new THREE.DataTexture(data, width, height)
  texture.needsUpdate = true

  return texture
}

function createStats(anchor: HTMLElement) {
  const stats = Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.top = '0px'
  anchor.appendChild(stats.domElement)
  return stats
}

function spin(cyls: THREE.Mesh[], axis: THREE.Vector3, speed: number) {
  cyls.forEach((cyl) => {
    cyl.rotateOnAxis(axis, speed)
  })
}

export function main(anchor: HTMLElement) {
  const stats = createStats(anchor)
  const scene = createScene()
  const renderer = createRenderer(anchor)
  const [cam, control] = createCamera(anchor, renderer.domElement)

  const yellowCyl = createCylinder([1, 1, 0.001, 128, 5], { color: 0xFFFF00 })
  const redCyl = createCylinder([1, 1, 0.001, 128, 5], { color: 0xFF0000 })
  const blueCyl = createCylinder([1, 1, 0.001, 128, 5], { color: 0x0000FF })

  const cyls = [yellowCyl, redCyl, blueCyl]

  cyls.forEach((cyl, i) => {
    scene.add(cyl)
    cyl.translateY(0.1 * i)
    cyl.translateZ(0.3 * i)
    cyl.rotateX(Math.PI / 2)
  })

  function animate() {
    requestAnimationFrame(animate)

    // required if controls.enableDamping or controls.autoRotate are set to true
    control.update()
    stats.update()
    renderer.render(scene, cam)
  }

  animate()
}
