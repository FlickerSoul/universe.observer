import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const CAMERA_POSITION = [0, 0, 3] as const

function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  return scene
}

function createGUI(anchor: HTMLElement) {
  const gui = new GUI(
    { name: 'Spin Control', autoPlace: false, width: anchor.clientWidth },
  )
  gui.domElement.style.margin = 'auto'
  anchor.parentElement?.appendChild(gui.domElement)

  return gui
}

function createCamera(anchor: HTMLElement, pan: HTMLCanvasElement): [THREE.PerspectiveCamera, OrbitControls] {
  const cam = new THREE.PerspectiveCamera(75, anchor.clientWidth / anchor.clientHeight, 0.1, 100)
  cam.position.set(...CAMERA_POSITION)

  const control = new OrbitControls(cam, pan)
  control.enablePan = true
  control.update()

  return [cam, control]
}

function createRenderer(anchor: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  renderer.physicallyCorrectLights = true
  renderer.setSize(anchor.clientWidth, anchor.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  anchor.appendChild(renderer.domElement)
  return renderer
}

function createCylinder(
  color: number,
  geoOptions: ConstructorParameters<typeof THREE.CylinderGeometry> = [],
) {
  const geo = createCylinderGeometry(geoOptions)
  const matUp = createPhysicalMaterial({
    color,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    alphaMap: createFaceAlphaTexture(),
    roughness: 0.8,
    // reflectivity: 0.5,
    vertexColors: false,
    emissive: color,
    side: THREE.DoubleSide,
  })
  const matDown = createPhysicalMaterial({
    color,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    opacity: 0,
    roughness: 0.2,
    reflectivity: 0.5,
    vertexColors: false,
    emissive: 1,
    side: THREE.DoubleSide,
  })
  const matSide = createPhysicalMaterial({
    color,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    opacity: 0.1,
    roughness: 0.2,
    reflectivity: 0.5,
    side: THREE.DoubleSide,
  })
  const cyl = new THREE.Mesh(geo, [matSide, matUp, matDown])
  return cyl
}

function createAmbientLight(scene: THREE.Scene) {
  const light = new THREE.AmbientLight(0xFFFFFF, 2)
  scene.add(light)
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
  const radius = Math.max(midCol, midRow) + 32

  const size = width * height
  const data = new Uint8Array(4 * size)
  const START_ALPHA = Math.floor(
    255 * 2 / 3,
  )

  function ratioPipeline(radius: number, dist: number) {
    const x = ((radius - dist) / radius)
    return x
  }

  for (let i = 0; i < size; i++) {
    const stride = i * 4
    const col = i % height
    const row = Math.floor(i / width)
    const dist = Math.sqrt(
      (midCol - col) ** 2 + (midRow - row) ** 2,
    )

    data[stride] = START_ALPHA * ratioPipeline(radius, dist)
    data[stride + 1] = START_ALPHA * ratioPipeline(radius, dist)
    data[stride + 2] = START_ALPHA * ratioPipeline(radius, dist)
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

function addAxis(scene: THREE.Scene) {
  const axis = new THREE.AxesHelper(5)
  scene.add(axis)
}

let time = 0
const SPIN_INFO = {
  maxAngle: 10,
  speedCoef: 1 / 10,
  timeStep: 0.2,
} as const
const ANGLE_PLACEMENT_RANGE = [0, Math.PI * 2, 0.01] as const

enum Colors {
  blue = 'blue',
  red = 'red',
  yellow = 'yellow',
}

const START_ANGLE: { [key in Colors]: number } = {
  [Colors.blue]: Math.random() * Math.PI * 2,
  [Colors.red]: Math.random() * Math.PI * 2,
  [Colors.yellow]: Math.random() * Math.PI * 2,
} as const
const rotateRadius = 3

function degreeToRadian(angle: number) {
  return angle * Math.PI / 180
}

function computeAngle(time: number, color: Colors) {
  return SPIN_INFO.maxAngle * Math.cos(Math.PI / 2 + time * Math.PI * SPIN_INFO.speedCoef + START_ANGLE[color])
}

function computePosition(cyls: { [key in Colors]: THREE.Mesh }) {
  time += SPIN_INFO.timeStep

  Object.entries(cyls).forEach(([color, cyl]) => {
    const angle = computeAngle(time, color as Colors)
    cyl.position.setX(rotateRadius * Math.sin(degreeToRadian(angle)))
    cyl.position.setY(rotateRadius - rotateRadius * Math.cos(degreeToRadian(angle)))
  })
}

function windowResize(anchor: HTMLElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, gui: GUI) {
  return () => {
    camera.aspect = anchor.clientWidth / anchor.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(anchor.clientWidth, anchor.clientHeight)
    gui.width = anchor.clientWidth
  }
}

export function main(anchor: HTMLElement) {
  const stats = createStats(anchor)
  const scene = createScene()
  const renderer = createRenderer(anchor)
  const [cam, control] = createCamera(anchor, renderer.domElement)
  const light = createAmbientLight(scene)
  const gui = createGUI(anchor)
  // addAxis(scene)

  const GLASS_SIZE = [1, 1, 0.01, 128, 5] as Parameters<typeof createCylinder>[1]
  const greenCyl = createCylinder(0x00FF00, GLASS_SIZE)
  const redCyl = createCylinder(0xFF0000, GLASS_SIZE)
  const blueCyl = createCylinder(0x0000FF, GLASS_SIZE)

  const cyls = { [Colors.blue]: blueCyl, [Colors.red]: redCyl, [Colors.yellow]: greenCyl }
  const GLASS_DISTANCE = 0.01
  const GLASS_SHIFT = 0.1

  Object.values(cyls).forEach((cyl, i) => {
    scene.add(cyl)
    i = i + 1
    cyl.translateY(GLASS_DISTANCE * i)
    cyl.translateZ(GLASS_SHIFT * i)
    cyl.rotateX(Math.PI / 2)
    cyl.updateMatrix()
  })

  window.addEventListener('resize', windowResize(anchor, cam, renderer, gui))

  // make gui
  const positionFolder = gui.addFolder('Angle')
  positionFolder.open()
  positionFolder.add(START_ANGLE, Colors.yellow as any as string, ...ANGLE_PLACEMENT_RANGE)
  positionFolder.add(START_ANGLE, Colors.red as any as string, ...ANGLE_PLACEMENT_RANGE)
  positionFolder.add(START_ANGLE, Colors.blue as any as string, ...ANGLE_PLACEMENT_RANGE)

  const spinFolder = gui.addFolder('Spin Control')
  spinFolder.open()
  spinFolder.add(SPIN_INFO, 'maxAngle', 0, 360)
  spinFolder.add(SPIN_INFO, 'speedCoef', 0, 1, 0.001)
  spinFolder.add(SPIN_INFO, 'timeStep', 0, 2, 0.01)

  const lightFolder = gui.addFolder('Light')
  lightFolder.open()
  lightFolder.add(light, 'intensity', 0, 10)
  lightFolder.addColor(light, 'color')

  function animate() {
    requestAnimationFrame(animate)

    // required if controls.enableDamping or controls.autoRotate are set to true
    control.update()
    stats.update()
    computePosition(cyls)

    renderer.render(scene, cam)
  }

  animate()
}
