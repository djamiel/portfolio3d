import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import SplitTextJS from "split-text-js";

const loader = new GLTFLoader();

//preload animation
const titles = gsap.utils.toArray(".title");
const tl = gsap.timeline();
titles.forEach((title) => {
  const splitTitle = new SplitTextJS(title);
  tl.from(
    splitTitle.chars,
    {
      opacity: 0,
      y: 80,
      rotateX: -90,
      stagger: 0.02,
    },
    "<"
  ).to(
    splitTitle.chars,
    {
      opacity: 0,
      y: -80,
      rotateX: -90,
      stagger: 0.02,
    },
    "<1"
  );
});

function changeCSSProperty() {
  setTimeout(function () {
    var body = document.querySelector("body");
    var loader = document.querySelector(".loader-container");
    body.style.overflow = "auto";
    body.style.overflowX = "hidden";
    loader.style.zIndex = "-10";
  }, 5500); // 5000 milliseconds = 5 seconds
}

window.addEventListener("load", changeCSSProperty);

loader.load(
  "./assets/rocket.glb",
  function (rocket) {
    rocket.scene.scale.set(10, 10, 10);
    rocket.scene.position.set(-20, -5, 10);
    rocket.scene.rotation.set(0.5, 0, 0);
    scene.add(rocket.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

loader.load(
  "./assets/earth.glb",
  function (earth) {
    earth.scene.scale.set(0.6, 0.6, 0.4);
    earth.scene.position.set(13, -10, 10);
    scene.add(earth.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

loader.load(
  "./assets/low_poly_moon.glb",
  function (moon) {
    moon.scene.scale.set(0.2, 0.2, 0.2);
    moon.scene.position.set(-10, 5, 10);
    moon.scene.rotation.set(0, 5, 0);
    scene.add(moon.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// light
const pointLight = new THREE.PointLight(0xffffff, 1000, 100);
pointLight.position.set(0, 5, 30);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

//randomly generated stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x * 3, y * 3, z - 50);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//randomly generated planetes
// function addPlanet1() {
//   const geometryPlanet1 = new THREE.SphereGeometry(4, 24, 24);
//   const materialPlanet1 = new THREE.MeshStandardMaterial({ color: 0xff312e });
//   const Planet1 = new THREE.Mesh(geometryPlanet1, materialPlanet1);

//   const [x, y, z] = Array(3)
//     .fill()
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   Planet1.position.set(x * 1, y * 1, (z + 20) * 2);
//   scene.add(Planet1);
// }

// function addPlanet2() {
//   const geometryPlanet2 = new THREE.SphereGeometry(4, 24, 24);
//   const materialPlanet2 = new THREE.MeshStandardMaterial({ color: 0xf9dc5c });
//   const Planet2 = new THREE.Mesh(geometryPlanet2, materialPlanet2);

//   const [x, y, z] = Array(3)
//     .fill()
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   Planet2.position.set(x * 1, y * 1, (z + 20) * 2);
//   scene.add(Planet2);
// }

// function addPlanet3() {
//   const geometryPlanet3 = new THREE.SphereGeometry(4, 24, 24);
//   const materialPlanet3 = new THREE.MeshStandardMaterial({ color: 0xbcedf6 });
//   const Planet3 = new THREE.Mesh(geometryPlanet3, materialPlanet3);

//   const [x, y, z] = Array(3)
//     .fill()
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   Planet3.position.set(x * 1, y * 1, (z + 20) * 2);
//   scene.add(Planet3);
// }

// Array(5).fill().forEach(addPlanet1);
// Array(5).fill().forEach(addPlanet2);
// Array(5).fill().forEach(addPlanet3);

//avatar
const avatarTexture = new THREE.TextureLoader().load("./assets/avatar.png");

const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);

scene.add(avatar);

avatar.position.setX(7);
avatar.position.setZ(20);
avatar.position.setY(3);

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
}

document.body.onscroll = moveCamera;
moveCamera();

//animate function
function animate() {
  requestAnimationFrame(animate);

  avatar.rotation.x += 0.01;
  avatar.rotation.y += 0.005;
  avatar.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
