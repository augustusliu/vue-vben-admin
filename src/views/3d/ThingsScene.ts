import {
  Scene,
  Color,
  WebGLRenderer,
  PerspectiveCamera,
  SpotLight,
  Vector2,
  AnimationMixer,
  GridHelper,
  Raycaster,
  Clock
} from 'three';
import * as THREE from 'three';
import Nebula, { SpriteRenderer , System} from "three-nebula";
import { OrbitControls } from "./extends/OrbitControls";
import { GLTFLoader } from "./extends/GLTFLoader";
import { ColorRepresentation } from "three/src/utils";
import { useUserStore } from "/@/store/modules/user";
// 请求的权限
const userStore = useUserStore();


// 冷却塔及烟囱动画
import yancongSmoke from '/@/assets/bebula/yancongSmoke.json';

// 锅炉房动画集合
// 锅炉点火动画
import glFireUp from '/@/assets/bebula/fireUp.json';
import glSmokeRight from '/@/assets/bebula/smokeRight.json';
import glSmokeDown from '/@/assets/bebula/smokeDown.json';
// 锅炉烟道向右动画
import glYdSmokeRight from '/@/assets/bebula/ydSmokeRight.json';
// 氨气烟道的烟气动画
import anQiSmokeUp from '/@/assets/bebula/aqSmokeUp.json';
// 氨气喷水动画
import anQiWater from '/@/assets/bebula/anqiWater.json';
// 脱销装置烟气动画
import tuoxiaoSmoke from '/@/assets/bebula/txSmokeRightDown.json';

// 保存动画的map,方便模型获取
const nebulaAnimateJsonMap = new Map();

nebulaAnimateJsonMap.set("yancongSmoke", yancongSmoke);
nebulaAnimateJsonMap.set("glFireUp", glFireUp);
nebulaAnimateJsonMap.set("glSmokeRight", glSmokeRight);
nebulaAnimateJsonMap.set("glSmokeDown", glSmokeDown);
nebulaAnimateJsonMap.set("glYdSmokeRight", glYdSmokeRight);
nebulaAnimateJsonMap.set("anQiSmokeUp", anQiSmokeUp);
nebulaAnimateJsonMap.set("anQiWater", anQiWater);
nebulaAnimateJsonMap.set("tuoxiaoSmoke", tuoxiaoSmoke);

// 变量
export interface ThingsSceneOptions{
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  // 场景透明
  sceneBackTransport: boolean;
  // 场景的背景颜色
  sceneColor?: ColorRepresentation;
  showGrid?: boolean;
  canControls: boolean;
  animateInterval?: number;
  openAutoRotate?: boolean;

  // 模型资产的缓存数据
  assetsOfModelMap?: Map<string, any>;
}


// 定义things的场景--全局一个
export class ThingsScene{
  private containerRef: any;
  private containerHeight;
  private containerWidth;
  private options: ThingsSceneOptions | undefined;

  private scene: any;
  private renderer: any;
  private controls: any;
  public camera: PerspectiveCamera | null;
  private spotLight: any;
  private gltfLoader: any;
  private progressCallback: any;
  public clickCallback: any;
  private animateMixer: any;

  private objs: any[];
  public labelChildModels: Map<string,any>;

  private clock: any;
  // 当前动画的关键帧
  public animateFrameId: any;
  // // 模型自带的动画AnimationAction
  private animationActions: any[];

  // 粒子系统动画渲染器
  private nebulasSystem: System[];

  // 停止动画的flag，停止动画必须采用这种方式
  public animateRunningEnd: boolean;

  public assetsOfModelMap: Map<string, any> | undefined | null;

  constructor() {
    this.objs = [];
    this.camera = null;
    this.labelChildModels = new Map();
    this.nebulasSystem = [];
    this.animationActions = [];
    this.animateRunningEnd = true;
    this.assetsOfModelMap = new Map();
  }

  // 初始化
  init(containerRef: HTMLElement|null, opts: ThingsSceneOptions,
              progressCallback: any, clickCallback: any) {

    if(!containerRef){
      return;
    }
    this.assetsOfModelMap = opts.assetsOfModelMap;

    this.containerRef = containerRef;
    this.containerHeight = containerRef.clientHeight | window.innerHeight;
    this.containerWidth = containerRef.clientWidth | window.innerWidth;
    this.objs = [];
    this.labelChildModels = new Map();
    this.nebulasSystem = [];
    this.animationActions = [];
    this.animateRunningEnd = true;
    // settings
    this.options = opts || {};

    // Scene
    if(!this.scene){
      this.scene = new Scene();
    }
    if(!opts.sceneBackTransport){
      this.scene.background = new Color(opts.sceneColor);
    }else{
      this.scene.background = null;
    }

    // renderer
    if(!this.renderer){
      this.initRenderer();
    }
    this.containerRef.appendChild(this.renderer.domElement);

    // camera
    this.initCamera();
    this.initSpotLight();

    if(opts.showGrid){
      this.__showGrid();
    }
    this.clock = new Clock();
    // controls
    if(opts.canControls){
      this.initObjControl();
    }

    // gltf loader
    if(!this.gltfLoader){
      this.gltfLoader = new GLTFLoader();
      this.gltfLoader.setRequestHeader({
        'Authorization': 'Bearer ' + userStore.getToken
      });
    }

    // 事件
    this.progressCallback = progressCallback;
    this.clickCallback = clickCallback;
  }

  // init renderer
  private initRenderer(){
    if(!this.renderer){
      this.renderer = new WebGLRenderer({antialias: true, alpha :true});
    }
    this.renderer.clearColor();
    if(this.options?.sceneBackTransport){
      this.renderer.setClearAlpha(0.0);
    }else{
      this.renderer.setClearColor( 0xffffff, 1 );
    }

    this.renderer.setSize(this.containerWidth, this.containerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染器渲染sGRB纹理
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
  }

  private initCamera(){
    if(!this.camera){
      this.camera = new PerspectiveCamera(this.options?.cameraFov, this.containerWidth / this.containerHeight, this.options?.cameraNear, this.options?.cameraFar);
      this.camera.position.set(this.options?.cameraX as number, this.options?.cameraZ as number,  this.options?.cameraY as number);  // x, z, y轴位置
      this.camera.lookAt(this.scene.position);
    }
  }

  private initSpotLight(){
    if(!this.spotLight){
      this.spotLight = new SpotLight(0xffffff);
    }
    if(this.options){
      this.spotLight.position.set(0, 1500, 1500);
      this.spotLight.castShadow = true;  // 开启光源投影
      this.spotLight.shadow.mapSize = new Vector2(1024,1024);
      this.spotLight.shadow.camera.far = 1300;
      this.spotLight.shadow.camera.near = 400;
      this.scene.add(this.spotLight);
    }

  }

  private initObjControl(){
    if(!this.controls){
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    if(this.options?.openAutoRotate){
      this.controls.autoRotate = true;
    }

    // defaultThreeContext.controls.maxPolarAngle = 0;
    // defaultThreeContext.controls.addEventListener('change', renderAnimate);
  }


  // 加载gltf模型
  public loadGLTFModel(path:string){
    // load
    this.gltfLoader.load(path,
      (model) => {
        this.doModelLoadSuccess(model);
        this.scene.add(model.scene);
        // 加载成功后，启动监听事件
        this.onContainerResize();
        // 只能容器绑定对应的点击事件
        this.containerRef.addEventListener( 'click', this.__mouseClick, false );
        this.startAnimate(); // 开启动画
      },
      (progress) => {
        if(this.progressCallback){
          this.progressCallback(progress.loaded / progress.total * 100);
        }
      },
      (err) => {
      console.log('load model error', err)
      },
    );
  }

  public loadGltfBatch(paths:any[]){

    let successCount: number = 0;

    paths.forEach((path, idx) => {
      this.gltfLoader.load(path,
        (model) => {
          this.doModelLoadSuccess(model);
          this.scene.add(model.scene);
        },
        (progress) => {
          if(this.progressCallback){
            this.progressCallback((idx/paths.length) * progress.loaded / progress.total * 100);
          }
          let curProgress = progress.loaded / progress.total * 100;
          if( curProgress === 100){
            successCount = successCount + 1;
          }
          if(successCount === paths.length){
            if(this.progressCallback){
              this.progressCallback(100);
            }
          }
        },
        (err) => {
          console.log('load model error', err)
        },
      );
    });

    // 加载成功后，启动监听事件
    this.onContainerResize();
    // 只能容器绑定对应的点击事件
    if(this.camera){
      this.containerRef.addEventListener( 'click', this.__mouseClick, false );
    }

    this.startAnimate(); // 开启动画
  }

  public disposeSceneObjs(){
    // 优先停止动画
    this.animateRunningEnd = true;
    this.stopAnimate();
    if(this.objs && this.objs.length > 0){
      this.objs.forEach(item => {
        this.scene.remove(item);
      })
    }
    if(this.scene && this.scene.background){
      this.scene.background = null;
    }

    this.assetsOfModelMap = null;
    this.scene = null;
    this.objs = [];
    this.labelChildModels = new Map();
    this.nebulasSystem = [];
    this.animationActions = [];
    if(this.animateMixer){
      this.animateMixer.stopAllAction();
      this.animateMixer = null;
    }

    if(this.progressCallback){
      this.progressCallback = undefined;
    }
    if(this.clickCallback){
      this.clickCallback = undefined;
    }
    if(this.camera){
      this.camera = null;
    }
    if(this.renderer){
      this.renderer.dispose();
      this.renderer = null;
    }
  }

  // 浏览器变化更新
  public onContainerResize(){
    window.addEventListener('resize', () => {
        if(this.containerRef && this.containerRef.clientHeight){
          this.containerHeight = this.containerRef.clientHeight | window.innerHeight;
          this.containerWidth = this.containerRef.clientWidth | window.innerWidth;

          if(this.camera){
            this.camera.aspect = this.containerWidth / this.containerHeight;
            this.camera.updateProjectionMatrix();
          }
          this.renderer.setSize(this.containerWidth, this.containerHeight);
        }
      },
      false);

  }

  // 模型加成成功后的处理
  private doModelLoadSuccess(gltfModel){
    gltfModel.scene.traverse(child => {
        if(child.isLight){
          child.castShadow = true;
        }else if(child.isMesh){
          child.material.emissive =  child.material.color;
          child.material.emissiveMap = child.material.map;
        }

        let thingsAssetId : any = null;
        // 1、解析并绑定模型中的资产与平台中的资产, 绑定平台对应的资产信息
        if(child.userData && child.userData.assetId){
          const modelAssetCode = child.userData.assetId;
          const thingsAsset = this.assetsOfModelMap?.get(modelAssetCode);
          if(thingsAsset){
            thingsAssetId = thingsAsset.id;
          }
        }

        // 缓存带标签的模型-- 修改，只有存在子模型才可以点击
        if(child.userData && child.userData.childModel){
          // if(child.userData.canclick && child.userData.canclick === 'yes'){
          const childModelPath = child.userData.childModel;
          if(!childModelPath){
            return ;
          }
          const text = child.name;
          const color = new Date().getTime() % 2 == 1 ? 'rgba(234, 42, 6, 1)' : 'rgba(0, 0, 0, 1.0)'
          let sprite = this.__makeTextLabelSprite(text, {
            color: color
          });
          if(sprite){
            sprite.position.set(child.position.x, child.position.y + 8, child.position.z);
            this.scene.add(sprite);
            this.objs.push(sprite);
            this.labelChildModels.set(sprite.uuid, {
              assetModelUuid: child.uuid,
              thingsAssetId: thingsAssetId,
              childModelPath: childModelPath
            });
          }
        }
        // 如果组件存在发射器，则加载发射器动画
        if(child.userData && child.userData.emmiter){
          let nebulaAnimate = nebulaAnimateJsonMap.get(child.userData.emmiter);
          if(nebulaAnimate){
            nebulaAnimate.particleSystemState.emitters[0].position.x = child.position.x;
            nebulaAnimate.particleSystemState.emitters[0].position.y = child.position.y;
            nebulaAnimate.particleSystemState.emitters[0].position.z = child.position.z;
            this.__loadNebulaAnimate(nebulaAnimate);
          }
        }
        this.objs.push(child);
    });

    // 加载模型动画
    if(gltfModel.animations && gltfModel.animations.length > 0){
      // 加载模型动画
      this.animateMixer = new AnimationMixer(gltfModel.scene);
      let animate = this.animateMixer.clipAction(gltfModel.animations[0]);
      animate.clampWhenFinished = true;
      animate.enabled = true;
      this.animationActions.push(animate);
    }
  }


  // 基于mesh创建其标签
  private __makeTextLabelSprite(message, parameters) {
    if ( parameters === undefined ) parameters = {};
    let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 50;
    let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 8;
    let borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:244, g:210, b:10, a:0.9 };
    let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:1, g:23, b:92, a:0.2 };
    let textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:244, g:210, b:10, a:0.9 };

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    if(context){
      context.font = "Bold " + fontsize + "px " + fontface;
      let metrics = context.measureText( message );
      let textWidth = metrics.width;

      context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
      context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

      context.lineWidth = borderThickness;
      this.__roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

      context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
      context.fillText( message, borderThickness, fontsize + borderThickness);

      let texture = new THREE.Texture(canvas)
      texture.needsUpdate = true;

      let spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
      let sprite = new THREE.Sprite( spriteMaterial );
      sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
      return sprite;
    }
  };

  // 绘制标签的椭圆型
  private __roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private __showGrid(){
    let gridHelper = new GridHelper( 800, 30, 0x2C2C2C, 0x404466 );
    this.scene.add(gridHelper);
  }

  // 注意闭包问题，不能用this.camera
  private __mouseClick(ev){
    if(!digitalTwinScene.camera){
      return ;
    }
    // ev.preventDefault();
    const mouse = new Vector2();
    const raycaster = new Raycaster();
    mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;
    // 通过鼠标点的地位和以后相机的矩阵计算出raycaster
    raycaster.setFromCamera(mouse, digitalTwinScene.camera);
    // 获取raycaster直线和所有模型相交的数组汇合
    if(digitalTwinScene.scene && digitalTwinScene.scene.children){
      let intersects = raycaster.intersectObjects(digitalTwinScene.scene.children );
      if(intersects && intersects.length > 0 && digitalTwinScene.clickCallback){
        digitalTwinScene.clickCallback(digitalTwinScene.labelChildModels.get(intersects[0].object.uuid));
      }
    }
  }

  private __loadNebulaAnimate(nebulaJsons: any){
    Nebula.fromJSONAsync(nebulaJsons.particleSystemState, THREE).then(loaded => {
      let nebulaRenderer = new SpriteRenderer(this.scene, THREE);
      loaded.addRenderer(nebulaRenderer);
      const nebula = loaded.addRenderer(nebulaRenderer);
      this.nebulasSystem.push(nebula);
    });
  }

  // 停止动画
  public stopAnimate(){
    this.animateRunningEnd = true;
    if(this.animateFrameId){
      cancelAnimationFrame(this.animateFrameId);
    }
    if(this.animationActions && this.animationActions.length > 0){
      this.animationActions.forEach(item => item.stop());
    }
    if(this.nebulasSystem){
      this.nebulasSystem.forEach(item => {
        item.canUpdate = false;
      });
    }
  }

  // 开始动画
  public startAnimate(){
    this.animateRunningEnd = false;

    if(this.animationActions && this.animationActions.length > 0){
      this.animationActions.forEach(item => item.play());
    }
    this.nebulasSystem.forEach(item => {
      item.canUpdate = true;
    });
    this.renderSceneAnimation();
  }

  public renderSceneAnimation(){
    if(this.animateRunningEnd === true){
      cancelAnimationFrame(this.animateFrameId);
    }

    if(this.scene && this.camera){
      if(this.animateMixer){
        this.animateMixer.update(this.clock.getDelta());
      }
      if(this.nebulasSystem){
        this.nebulasSystem.forEach(item => {
          if(item.update){
            item.update();
          }
        });
      }

      // 场景自转
      if(this.controls){
        this.controls.update(this.clock.getDelta());
      }

      if(this.renderer){
        this.renderer.render(this.scene, this.camera);//执行渲染操作
      }
      this.animateFrameId = requestAnimationFrame(() => this.renderSceneAnimation()); //请求再次执行渲染函数render
    }
  }
}


// 全局场景
export const digitalTwinScene = new ThingsScene();
