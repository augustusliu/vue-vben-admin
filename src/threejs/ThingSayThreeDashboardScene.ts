// 企业全景
import {ThingSayThreeBaseModelScene} from "/@/threejs/ThingSayThreeBaseModelScene";
import {Clock, PerspectiveCamera, Scene, SpotLight, Vector2, WebGLRenderer} from "three";
import {OrbitControls} from "/@/views/3d/extends/OrbitControls";
import {searchModelList} from "/@/api/things/baseData/modelApi";
import {ModelItem} from "/@/api/things/baseData/model/threeModel";

export class ThingSayThreeDashboardScene extends ThingSayThreeBaseModelScene{

  public scene: Scene | null;
  private renderer: any | null;
  private camera: PerspectiveCamera | null;
  private light: SpotLight | null;
  private controls: OrbitControls | null;
  private clock: Clock;
  private modelPaths: Set<string>;

  constructor(options: ThingSayOptions) {
    super(options.progressCallback);

    this.modelPaths = new Set<string>();
    // 场景
    let scene = new Scene();
    this.scene = scene;
    this.clock = new Clock();
    let canvasWidth = options.canvas.clientWidth;
    let canvasHeight = options.canvas.clientHeight;

    // 渲染器
    this.renderer = new WebGLRenderer({antialias: true, alpha :true});
    this.renderer.clearColor();
    this.renderer.setClearAlpha(0.0);
    this.renderer.setSize(options.canvas.clientWidth, options.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
    options.canvas.appendChild(this.renderer.domElement);

    // 相机
    this.camera = new PerspectiveCamera(options.cameraFov, canvasWidth / canvasHeight, options.cameraNear, options.cameraFar);
    this.camera.position.set(options.cameraX as number, options.cameraZ as number,  options.cameraY as number);  // x, z, y轴位置
    this.camera.lookAt(this.scene.position);

    // 光源
    this.light = new SpotLight(0xffffff);
    this.light.position.set(0, 1500, 1500);
    this.light.castShadow = true;  // 开启光源投影
    this.light.shadow.mapSize = new Vector2(1024,1024);
    this.light.shadow.camera.far = 1300;
    this.light.shadow.camera.near = 400;
    this.scene.add(this.light);

    // 控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;


    // 从平台获取模型列表
    searchModelList({isMain: true}).then((models: ModelItem[]) => {
      if (!models ||  models.length <= 0) {
        return;
      }
      models.forEach(model => {
        this.modelPaths.add(model.modelPath);
      })
      this.loadModelBatch(scene, this.modelPaths);
      this.startScene();
    });
  }

  // 用于模型加成完毕后的处理
  public doModelLoadSuccessBefore(_model) {
    // 模型数据
    _model.scene.traverse(child => {
      // 采用颜色自发光，
      if(child.isMesh){
        child.material.emissive =  child.material.color;
        child.material.emissiveMap = child.material.map;
      }

      // 含子模型的数据
      if(child.userData && child.userData.childModel){
        console.log(child);
      }
    })
  }

  // 用于加载完成后的后续处理
  public doModelLoadSuccessAfter(_model) {
    // 初始化模型动画

  }


  //
  public startScene(){
    this.__renderSceneAnimation();
  }


  __renderSceneAnimation(){
    if(this.renderer){
      this.renderer.render(this.scene, this.camera);//执行渲染操作
    }
    requestAnimationFrame(() => this.__renderSceneAnimation()); //请求再次执行渲染函数render
  }

  // 废弃场景
  public disposeScene(){
    if(this.camera){
      this.camera = null;
    }

    if(this.renderer){
      this.renderer = null;
    }

    if(this.light){
      this.light = null;
    }

    if(this.controls){
      this.controls = null;
    }
    if(this.modelLoader){
      this.modelLoader = null;
    }

    if(this.scene){
      this.scene = null;
    }
  }
}



export interface ThingSayOptions{
  canvas: HTMLCanvasElement;
  progressCallback: Function;
  meshClickCallback: Function;

  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
}
