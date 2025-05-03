import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Model = () => {
  const earthRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 14;
    const sunlight = new THREE.DirectionalLight(0xffffff, 20);
    sunlight.position.set(-90, 20, 10);
    sunlight.castShadow = true;

    sunlight.shadow.mapSize.width = 1024;
    sunlight.shadow.mapSize.height = 1024;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 40;

    sunlight.shadow.camera.left = -20;
    sunlight.shadow.camera.right = 20;
    sunlight.shadow.camera.top = 20;
    sunlight.shadow.camera.bottom = -20;

    scene.add(sunlight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    if (earthRef.current) earthRef.current.appendChild(renderer.domElement);

    // const modelPath = "./earth/main page vid.gltf";
    const modelPath = "./earth/main-page-vid.glb";
    const loader = new GLTFLoader();
    let earth: any;

    loader.load(
      modelPath,
      (gltf) => {
        console.log("model is :", gltf);
        earth = gltf.scene;
        earth.scale.set(5, 5, 5);
        scene.add(earth);
        animate();
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the model:", error);
      }
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.enableZoom = false;

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      if (earth) earth.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={earthRef} style={{ width: "50vw", height: "50vh" }} />;
};

export default Model;
