import {
  Scene,
  Color,
  AxesHelper,
  WebGLRenderer,
  PerspectiveCamera,
  SpotLight,
  Vector2,
  AnimationMixer,
  Clock, LoopOnce,
  CubeTextureLoader
} from 'three';
import { OrbitControls } from "./extends/OrbitControls";
import { GLTFLoader } from "./extends/GLTFLoader";
import { ColorRepresentation } from "three/src/utils";
import { Ref } from "vue";
import { useUserStore } from "/@/store/modules/user";

// 变量
export interface ThingsSceneOptions{
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;

  // 场景的背景颜色
  sceneColor?: ColorRepresentation;
  // 场景背景图片
  sceneBackImages?: string [];
  // 场景背景采用颜色还是纹理图片
  enableSceneBackgroundColor: boolean;
}

export interface ThingsThreeContext{
  scene?: any;
  renderer?: any;
  controls?: any;
  camera?: any;
  spotLight?: any;
  gltfLoader?: any;
  animateMixer?: any;
  clock: Clock;
  thingsThree?: ThingsScene;
}


// 请求的权限
const userStore = useUserStore();

// 定义一个全局的Threejs 环境
export const defaultThreeContext: ThingsThreeContext = {
  'clock': new Clock()
}

const renderAnimate = () => {
  requestAnimationFrame(renderAnimate);//请求再次执行渲染函数render
  if(defaultThreeContext.animateMixer){
    defaultThreeContext.animateMixer.update(defaultThreeContext.clock.getDelta());
  }
  defaultThreeContext.renderer.render(defaultThreeContext.scene, defaultThreeContext.camera);//执行渲染操作
}

// 定义things的场景--全局一个
export class ThingsScene{
  private containerRef;
  private containerHeight;
  private containerWidth;
  private readonly options: ThingsSceneOptions | undefined;
  constructor(containerRef: Ref<HTMLElement>, openControls: boolean, opts: ThingsSceneOptions) {
    if(!containerRef.value || !opts){
      return;
    }
    this.options = opts || {};
    this.containerRef = containerRef;
    this.containerHeight = containerRef.value.clientHeight | window.innerHeight;
    this.containerWidth = containerRef.value.clientWidth | window.innerWidth;

    // Scene
    if(defaultThreeContext.scene){
      defaultThreeContext.scene.dispose();
    }else{
      defaultThreeContext.scene = new Scene();
    }

    if(opts.enableSceneBackgroundColor){
      defaultThreeContext.scene.background = new Color(opts.sceneColor);
    }else{
      // load bg texture
      if(opts.sceneBackImages && opts.sceneBackImages.length > 0){
        defaultThreeContext.scene.background = this.buildSceneTexture(opts.sceneBackImages);
      }
    }

    // renderer
    this.initRenderer();
    this.containerRef.value.appendChild(defaultThreeContext.renderer.domElement);
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
    if(!defaultThreeContext.gltfLoader){
      defaultThreeContext.gltfLoader = new GLTFLoader();
      defaultThreeContext.gltfLoader.setRequestHeader({
        'Authorization': 'Bearer ' + userStore.getToken
      });
    }

    defaultThreeContext.thingsThree = this;
  }

  // init renderer
  private initRenderer(){
    defaultThreeContext.renderer = new WebGLRenderer({antialias: true, alpha :true});
    defaultThreeContext.renderer.setClearColor( 0xffffff, 1 );
    defaultThreeContext.renderer.setSize(this.containerWidth, this.containerHeight);
    defaultThreeContext.renderer.shadowMap.enabled = true;
    defaultThreeContext.renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染器渲染sGRB纹理
    defaultThreeContext.renderer.gammaOutput = true;
    defaultThreeContext.renderer.gammaFactor = 2.2;
  }

  private initCamera(){
    if(this.options){
      defaultThreeContext.camera = new PerspectiveCamera(this.options.cameraFov, this.containerWidth / this.containerHeight, this.options.cameraNear, this.options.cameraFar);
      defaultThreeContext.camera.position.set(this.options.cameraX,this.options.cameraZ, this.options.cameraY);  // x, z, y轴位置
      defaultThreeContext.camera.lookAt(defaultThreeContext.scene.position);
    }
  }

  private initSpotLight(){
    defaultThreeContext.spotLight = new SpotLight(0xffffff);
    defaultThreeContext.spotLight.position.set(0, 1500, 1500);
    defaultThreeContext.spotLight.castShadow = true;  // 开启光源投影
    defaultThreeContext.spotLight.shadow.mapSize = new Vector2(1024,1024);
    defaultThreeContext.spotLight.shadow.camera.far = 1300;
    defaultThreeContext.spotLight.shadow.camera.near = 400;
    defaultThreeContext.scene.add(defaultThreeContext.spotLight);
  }

  private initObjControl(){
    defaultThreeContext.controls = new OrbitControls(defaultThreeContext.camera, defaultThreeContext.renderer.domElement);
    defaultThreeContext.controls.addEventListener('change', renderAnimate);
  }

  private buildSceneTexture(images:string []){
    const textureLoader = new CubeTextureLoader();
    return textureLoader.load(images);
  }

  // 显示坐标轴
  public showAxes(){
    let axesHelper = new AxesHelper(10);
    defaultThreeContext.scene.add(axesHelper);
  }

  // 加载gltf模型
  public loadGLTFModel(path:string){
    // load
    console.log('loader', defaultThreeContext);
    defaultThreeContext.gltfLoader.load(path,
      (model) => {
        this.doModelLoadSuccess(model);
        defaultThreeContext.scene.add(model.scene);
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
          defaultThreeContext.camera.aspect = this.containerWidth / this.containerHeight;
          defaultThreeContext.camera.updateProjectionMatrix();
          defaultThreeContext.renderer.setSize(this.containerWidth, this.containerHeight);
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
      defaultThreeContext.animateMixer = new AnimationMixer(gltfModel.scene);
      let animate = defaultThreeContext.animateMixer.clipAction(gltfModel.animations[0]).play();
      animate.setLoop(LoopOnce, 1);
      animate.clampWhenFinished = true;
      animate.enabled = true;
    }
  }
}
