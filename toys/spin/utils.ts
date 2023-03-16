import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const CAMERA_POSITION = [0, 0, 3] as const

function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  scene.add(createAmbientLight())
  return scene
}

function createGUI(anchor: HTMLElement) {
  const gui = new GUI(
    { name: 'Spin Control', autoPlace: false, width: anchor.clientWidth },
  )
  anchor.appendChild(gui.domElement)

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
    emissive: 1,
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

function createAmbientLight() {
  const light = new THREE.AmbientLight(0xFFFFFF, 0.5)
  return light
}

function createPointLight() {
  const light = new THREE.PointLight(0xFFFFFF, 20, 0, 1)
  const helper = new THREE.PointLightHelper(light, 0.1, 0xFF0000)
  light.position.set(0, 0, 5)
  return [light, helper]
}

function createSpotLight() {
  const light = new THREE.SpotLight(0xFFFFFF, 20, 0, Math.PI / 3, 0, 2)
  light.castShadow = true
  light.position.set(0, 0, 5)
  light.target.position.set(0, 0, 0)
  const helper = new THREE.SpotLightHelper(light, 0xFF0000)
  return [light, helper]
}

function createDirectionalLight(
  position: [number, number, number],
  target: THREE.Object3D,
): [THREE.DirectionalLight, THREE.DirectionalLightHelper] {
  const light = new THREE.DirectionalLight(0xFFFFFF, 1.5)
  light.position.set(...position)
  light.target = target
  const helper = new THREE.DirectionalLightHelper(light, 1)
  return [light, helper]
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

function spin(cyls: THREE.Mesh[], axis: THREE.Vector3, speed: number) {
  cyls.forEach((cyl) => {
    cyl.rotateOnAxis(axis, speed)
  })
}

function addAxis(scene: THREE.Scene) {
  const axis = new THREE.AxesHelper(5)
  scene.add(axis)
}

const ANGLE_PLACEMENT_RANGE = [-30, 30] as const
const LIGHT_PLACEMENT_RANGE = [-10, 10] as const
const INTENSITY_RANGE = [0, 100000] as const

enum Colors {
  blue = 'blue',
  red = 'red',
  yellow = 'yellow',
}

const angles: { [key in Colors]: number } = {
  [Colors.blue]: 0,
  [Colors.red]: 0,
  [Colors.yellow]: 0,
}

const rotateRadius = 3

function degreeToRadian(angle: number) {
  return angle * Math.PI / 180
}

function computePosition(cyls: { [key in Colors]: THREE.Mesh }) {
  Object.entries(cyls).forEach(([color, cyl]) => {
    const angle = angles[color as Colors]
    cyl.position.setX(rotateRadius * Math.sin(degreeToRadian(angle)))
    cyl.position.setY(rotateRadius - rotateRadius * Math.cos(degreeToRadian(angle)))
  })
}

export function main(anchor: HTMLElement) {
  const stats = createStats(anchor)
  const scene = createScene()
  addAxis(scene)
  const renderer = createRenderer(anchor)
  const [cam, control] = createCamera(anchor, renderer.domElement)

  const gui = createGUI(anchor)

  const GLASS_SIZE = [1, 1, 0.01, 128, 5] as Parameters<typeof createCylinder>[1]
  const yellowCyl = createCylinder(0xFFFF00, GLASS_SIZE)
  const redCyl = createCylinder(0xFF0000, GLASS_SIZE)
  const blueCyl = createCylinder(0x0000FF, GLASS_SIZE)

  const cyls = { [Colors.blue]: blueCyl, [Colors.red]: redCyl, [Colors.yellow]: yellowCyl }
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

  // const [directionalLight, directionalLightHelper] = createDirectionalLight([0, 0, 2], blueCyl)
  // scene.add(directionalLight, directionalLightHelper)

  const [light, lightHelper] = createSpotLight()
  scene.add(light, lightHelper)

  // make gui
  const positionFolder = gui.addFolder('Angle')
  positionFolder.add(angles, Colors.yellow as any as string, ...ANGLE_PLACEMENT_RANGE)
  positionFolder.add(angles, Colors.red as any as string, ...ANGLE_PLACEMENT_RANGE)
  positionFolder.add(angles, Colors.blue as any as string, ...ANGLE_PLACEMENT_RANGE)

  const lightFolder = gui.addFolder('Light')
  lightFolder.add(light, 'intensity', ...INTENSITY_RANGE)
  lightFolder.add(light.position, 'x', ...LIGHT_PLACEMENT_RANGE)
  lightFolder.add(light.position, 'y', ...LIGHT_PLACEMENT_RANGE)
  lightFolder.add(light.position, 'z', ...LIGHT_PLACEMENT_RANGE)
  lightFolder.add(light, 'distance', ...LIGHT_PLACEMENT_RANGE)
  lightFolder.add(light, 'decay', 0, 5, 0.1)
  lightFolder.add(light, 'penumbra', 0, 1, 0.1)
  lightFolder.add(light, 'angle', 0, Math.PI / 2, 0.1)
  lightFolder.addColor(light, 'color')

  // blueCyl.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2)

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
