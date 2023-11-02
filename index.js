import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import model from "./model.glb?url";

import './index.css';

class Sketch {
  onResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
  };

  constructor() {
    // Elements
    this.canvas = document.getElementById('webgl');
    
    // Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize( this.width, this.height ); 
    this.renderer.setPixelRatio( Math.min( 2, window.devicePixelRatio ) );
    this.renderer.setClearColor(0xeeeeee, 1);

    // Camera
    this.camera = new THREE.PerspectiveCamera( 85, this.width / this.height, 0.1, 1000 );
    this.camera.position.set(0, 0, 2);
    this.scene.add(this.camera);

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableDamping = true
    this.controls.minPolarAngle = Math.PI/3;
    this.controls.maxPolarAngle = Math.PI/3;
    this.controls.enableKeys = false;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = false;

    // Timer
    this.time = 0;

    // File loader
    this.loader = new GLTFLoader();
    Promise.all([
      this.loader.loadAsync(model),
    ]).then(([model]) => {
      this.model = model.scene;

      // Center the model
      this.model.scale.set( 10, 10, 10 );
      this.model.rotation.x = Math.PI / 2;
      this.box = new THREE.Box3().setFromObject( this.model );
      this.center = new THREE.Vector3();
      this.box.getCenter( this.center );
      this.model.position.sub( this.center );

      this.group = new THREE.Group();
      this.group.add( this.model );
      this.scene.add( this.group );
    });

    /**
     * Lights
     */
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.camera.left = - 7
    this.directionalLight.shadow.camera.top = 7
    this.directionalLight.shadow.camera.right = 7
    this.directionalLight.shadow.camera.bottom = - 7
    this.directionalLight.position.set(5, 5, 5)
    this.scene.add(this.directionalLight)

    // Initializing
    this.setupResize();
    this.render();
  }

  setupResize() {
    window.addEventListener('resize', this.onResize);
  }

  render() {
    this.time += 0.02;

    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    if (this.model) this.group.rotation.y += 0.005;
  }
}

new Sketch();