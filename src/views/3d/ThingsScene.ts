import {
  Scene,
  Color,
  AxesHelper,
  WebGLRenderer,
  PerspectiveCamera,
  SpotLight,
  Vector2,
  AnimationMixer,
  Clock, LoopOnce
} from 'three';
import { OrbitControls } from "./extends/OrbitControls";
import { GLTFLoader } from "./extends/GLTFLoader";
import {ColorRepresentation} from "three/src/utils";
let scene, renderer, controls, camera, spotLight, gltfLoader, animateMixer;
let clock = new Clock();

const renderAnimate = () => {
  requestAnimationFrame(renderAnimate);//请求再次执行渲染函数render
  var time = clock.getDelta();
  if(animateMixer){
    animateMixer.update(time);
  }
  renderer.render(scene, camera);//执行渲染操作
}

// 定义things的场景
export class ThingsScene{
  private containerRef;
  private containerHeight;
  private containerWidth;
  constructor(containerRef:any, bgColor: ColorRepresentation, openControls: boolean) {
    this.containerRef = containerRef;
    this.containerHeight = containerRef.value.clientHeight | window.innerHeight;
    this.containerWidth = containerRef.value.clientWidth | window.innerWidth;

    // Scene
    scene = new Scene();
    scene.background = new Color(bgColor);
    // renderer
    this.initRenderer();
    this.containerRef.value.appendChild(renderer.domElement);
    // camera
    this.initCamera();
    // spot light
    this.initSpotLight();
    // controls
    if(openControls){
      this.initObjControl();
    }

    this.onContainerResize();
    // gltf loader
    gltfLoader = new GLTFLoader();
  }

  // init renderer
  private initRenderer(){
    renderer = new WebGLRenderer({antialias: true, alpha :true});
    renderer.setClearColor( 0xffffff, 1 );
    renderer.setSize(this.containerWidth, this.containerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染器渲染sGRB纹理
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
  }

  private initCamera(){
    camera = new PerspectiveCamera(65, this.containerWidth / this.containerHeight, 0.1, 1000);
    camera.position.set(0, 1, 2.8);  // x, z, y轴位置
    camera.lookAt(scene.position);
  }

  private initSpotLight(){
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(0, 1500, 1500);
    spotLight.castShadow = true;  // 开启光源投影
    spotLight.shadow.mapSize = new Vector2(1024,1024);
    spotLight.shadow.camera.far = 1300;
    spotLight.shadow.camera.near = 400;
    scene.add(spotLight);
  }

  private initObjControl(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', renderAnimate);
  }

  // 显示坐标轴
  public showAxes(){
    let axesHelper = new AxesHelper(10);
    scene.add(axesHelper);
  }


  // 加载gltf模型
  public loadGLTFModel(path:string){
    // load
    gltfLoader.load(path,
      (model) => {
        this.doModelLoadSuccess(model);
        scene.add(model.scene);
        renderAnimate();
      },
      function (progress){
        console.log( ( '加载进度'+ progress.loaded / progress.total * 100 ) );
      },
      function(err){
      console.log('load model error', err)
    });
  }

  // 浏览器变化更新
  public onContainerResize(){
      window.addEventListener('resize', () => {
          this.containerHeight = this.containerRef.value.clientHeight | window.innerHeight;
          this.containerWidth = this.containerRef.value.clientWidth | window.innerWidth;
          camera.aspect = this.containerWidth / this.containerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(this.containerWidth, this.containerHeight);
        },
        false);
  }

  // 模型加成成功后的处理
  private doModelLoadSuccess(gltfModel){
    console.log(gltfModel);
    gltfModel.scene.traverse( function (child) {
      if(child.isLight){
        child.castShadow = true;
      }else if(child.isMesh){
        child.material.emissive =  child.material.color;
        child.material.emissiveMap = child.material.map;
      }
      if(child.userData.canClick && child.userData.canClick === 'yes'){
        console.log(child);
      }
    });

    // 加载模型动画
    if(gltfModel.animations && gltfModel.animations.length > 0){
      // 加载模型动画
      animateMixer = new AnimationMixer(gltfModel.scene);
      let animate = animateMixer.clipAction(gltfModel.animations[0]).play();
      animate.setLoop(LoopOnce, 1);
      animate.clampWhenFinished = true;
      animate.enabled = true;
    }
  }
}
