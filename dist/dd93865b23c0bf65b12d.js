import"./style.css";import*as THREE from"three";import{OrbitControls}from"three/examples/jsm/controls/OrbitControls.js";import*as dat from"dat.gui";const loader=new THREE.TextureLoader,cross=loader.load("./cross.png"),gui=new dat.GUI;gui.hide();const canvas=document.querySelector("canvas.webgl"),scene=new THREE.Scene,geometry=new THREE.SphereGeometry(.7,.2,100,100),particlesGeometry=new THREE.BufferGeometry,particlesCount=5e4,posArray=new Float32Array(15e4);for(let e=0;e<15e4;e++)posArray[e]=10*(Math.random()-.5);particlesGeometry.setAttribute("position",new THREE.BufferAttribute(posArray,3));const material=new THREE.PointsMaterial({size:.005,map:null,transparent:!0,color:3438503}),mat=new THREE.MeshBasicMaterial,sphere=new THREE.Points(geometry,material),particlesMesh=new THREE.Points(particlesGeometry,material);scene.add(particlesMesh);let showGui=!1;document.addEventListener("keyup",(function(e){18==e.keyCode&&(showGui?(gui.hide(),showGui=!1):(gui.show(),showGui=!0))}));let palette={color:"#3477a7",color2:[0,128,255]},size={size:50},particleTexture={texture:!1},colorControl=gui.addColor(palette,"color"),sizeControl=gui.add(size,"size",1,100),particleTextureControl=gui.add(particleTexture,"texture");function changeTexture(){let e=particleTextureControl.getValue();particlesMesh.material.map=e?cross:null,particlesMesh.material.needsUpdate=!0}function changeColor(){let e=document.getElementById("name"),t=colorControl.getValue("color");e.style.color=t,t=t.slice(1,t.length),t="0x"+t,particlesMesh.material.color.setHex(t)}function changeSize(){let e=sizeControl.getValue("size");e/=1e4,particlesMesh.material.size=e}colorControl.onChange(changeColor),particleTextureControl.onChange(changeTexture),sizeControl.onChange(changeSize);const pointLight=new THREE.PointLight(16777215,.1);pointLight.position.x=2,pointLight.position.y=3,pointLight.position.z=4,scene.add(pointLight);const sizes={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",(()=>{sizes.width=window.innerWidth,sizes.height=window.innerHeight,camera.aspect=sizes.width/sizes.height,camera.updateProjectionMatrix(),renderer.setSize(sizes.width,sizes.height),renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))}));const camera=new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,100);camera.position.x=0,camera.position.y=0,camera.position.z=2,scene.add(camera);const renderer=new THREE.WebGLRenderer({canvas});renderer.setSize(sizes.width,sizes.height),renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),renderer.setClearColor(new THREE.Color("#212121"),1),document.addEventListener("mousemove",animateParticles);let mouseX=0,mouseY=0;function animateParticles(e){mouseX=e.clientX,mouseY=e.clientY}let clock=new THREE.Clock,time=Date.now();const Time=5,tick=()=>{const e=clock.getElapsedTime();Date.now(),particlesMesh.rotation.y=-.1*e,mouseX>0&&(particlesMesh.rotation.x=1e-4*e*-mouseY,particlesMesh.rotation.y=1e-4*e*-mouseX),e>30&&(console.log("yo"),clock=new THREE.Clock),renderer.render(scene,camera),window.requestAnimationFrame(tick)};tick();