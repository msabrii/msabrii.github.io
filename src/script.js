import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
//Texture loader
const loader = new THREE.TextureLoader()
const cross = loader.load('./cross.png')

// Debug
const gui = new dat.GUI()
gui.hide()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereGeometry( .7, .2, 100, 100 );

const particlesGeometry = new THREE.BufferGeometry
const particlesCount = 50000

// const textGeo = new THREE.TextGeometry('Hi, This is Ameer!')
const posArray = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount * 3; i++){
    // posArray[i] = Math.random()
    posArray[i] = (Math.random() - 0.5 )* 10
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
// Materials

const material = new THREE.PointsMaterial({
    size: 0.005,
    map: null,
    transparent: true,
    color: 0x3477a7
    // blending: THREE.MultiplyBlending
})
// material.color = new THREE.Color(0xffffff)
const mat = new THREE.MeshBasicMaterial()
// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, material)
// const text = new THREE.Mesh(textGeo, mat)
// text.position.set(1 , 1, 1)
scene.add(particlesMesh)

//Colors and datGUI setup
let showGui = false
  document.addEventListener("keyup", function(event){
      if(event.keyCode == 18){
        if(!showGui){
            gui.show()
            showGui = true
        }
        else{
            gui.hide()
            showGui = false
        }
      }
});

let palette = {
    color: '#3477a7',
    color2: [ 0, 128, 255 ] // CSS string
  };
let size = {
    size: 50
}
let particleTexture = {texture:false}

 
let colorControl = gui.addColor(palette, 'color')
let sizeControl = gui.add(size, 'size', 1, 100)
let particleTextureControl = gui.add(particleTexture, 'texture')


colorControl.onChange(changeColor)

particleTextureControl.onChange(changeTexture)
function changeTexture(){
    let bool = particleTextureControl.getValue()
    if(bool){
        particlesMesh.material.map = cross
    }
    else{
        particlesMesh.material.map = null
    }
    particlesMesh.material.needsUpdate = true
}
function changeColor(){
    let title = document.getElementById('name')
    let color = colorControl.getValue('color')
    title.style.color = color

    color = color.slice(1, color.length)
    color = '0x' +  color
    particlesMesh.material.color.setHex(color)
}

sizeControl.onChange(changeSize)
function changeSize(){
    let cur_size = sizeControl.getValue('size')
    cur_size = cur_size / 10000
    particlesMesh.material.size = (cur_size)
}

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#212121'), 1)

//Mouse
document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseX = event.clientX
    mouseY = event.clientY
}

/**
 * Animate
 */

let clock = new THREE.Clock()
let time = Date.now()
const Time = 5
const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    // console.log(deltaTime)
    // Update objects
    // sphere.rotation.y = .5 * deltaTime
    particlesMesh.rotation.y = -0.1 * (elapsedTime)

    if(mouseX > 0){
        particlesMesh.rotation.x = (-mouseY * (elapsedTime * 0.0001))
        // particlesMesh.scale.z = -mouseY * 0.001 * mouseX
        particlesMesh.rotation.y = (-mouseX * (elapsedTime * 0.0001)) 
    }

    // console.log(elapsedTime)

    if(elapsedTime > 30){
        console.log("yo")
        clock = new THREE.Clock()
    }
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()