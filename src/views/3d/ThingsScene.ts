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
  CubeTextureLoader, GridHelper, Raycaster
} from 'three';

import Nebula, { SpriteRenderer } from "three-nebula";
import { OrbitControls } from "./extends/OrbitControls";
import { GLTFLoader } from "./extends/GLTFLoader";
import { ColorRepresentation } from "three/src/utils";
import { Ref} from "vue";
import * as THREE from 'three';
import { Sky } from './extends/Sky.js';

import { useUserStore } from "/@/store/modules/user";

// 请求的权限
const userStore = useUserStore();
// 加载nebula动画
import SMOKEJSON from '/@/views/3d/animates/smoke.json';

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
  showGrid?: boolean;
  canControls: boolean;
  enableSky: boolean;
}

// 全局上线文缓存
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
  objsIdSet: Set<string>;
  objs?: any[];
  labelObjects: any[];
  raycaster?: Raycaster;
  mouse?: Vector2;
  // 模型全局事件
  progressCallback?: any;
  clickCallback?: any;
}

// 全局Threejs的定义
export const defaultThreeContext: ThingsThreeContext = {
  'clock': new Clock(),
  'objsIdSet': new Set(),
  'labelObjects': []
}

const renderAnimate = (nebulaParticle?:any) => {
  if(defaultThreeContext.scene){
    requestAnimationFrame(() => renderAnimate(nebulaParticle)); //请求再次执行渲染函数render
    if(defaultThreeContext.animateMixer){
      defaultThreeContext.animateMixer.update(defaultThreeContext.clock.getDelta());
    }
    if(nebulaParticle && nebulaParticle.update){
      nebulaParticle.update();
    }
    if(defaultThreeContext.renderer){
      defaultThreeContext.renderer.render(defaultThreeContext.scene, defaultThreeContext.camera);//执行渲染操作
    }
  }
}

// 定义things的场景--全局一个
export class ThingsScene{
  private containerRef;
  private containerHeight;
  private containerWidth;
  private readonly options: ThingsSceneOptions | undefined;
  constructor(containerRef: Ref<HTMLElement>, opts: ThingsSceneOptions,
              progressCallback: any, clickCallback: any) {
    if(!containerRef.value || !opts){
      return;
    }

    // 如果背景是纹理，则废弃掉，放置内存溢出
    if(this.options && !this.options.enableSceneBackgroundColor){
      defaultThreeContext.scene.background.dispose();
    }

    this.options = opts || {};
    this.containerRef = containerRef;
    this.containerHeight = containerRef.value.clientHeight | window.innerHeight;
    this.containerWidth = containerRef.value.clientWidth | window.innerWidth;

    if(opts.showGrid){
      this.__showGrid();
    }
    defaultThreeContext.raycaster = new Raycaster();
    defaultThreeContext.mouse = new Vector2();
    // 事件
    defaultThreeContext.progressCallback = progressCallback;
    defaultThreeContext.clickCallback = clickCallback;
    // Scene
    if(!defaultThreeContext.scene){
      defaultThreeContext.scene = new Scene();
    }

    // renderer
    if(!defaultThreeContext.renderer){
      this.initRenderer();
    }
    this.containerRef.value.appendChild(defaultThreeContext.renderer.domElement);


    // camera
    this.initCamera();
    this.initSpotLight();

    if(opts.enableSky){
      this.__initSky();
    }else{
      if(opts.enableSceneBackgroundColor){
        defaultThreeContext.scene.background = new Color(opts.sceneColor);
      }else{
        // load bg texture
        if(opts.sceneBackImages && opts.sceneBackImages.length > 0){
          defaultThreeContext.scene.background = this.__buildSceneTexture(opts.sceneBackImages);
        }
      }
    }

    // controls
    if(opts.canControls){
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

    window.addEventListener( 'click', this.__mouseClick, false );
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
    // defaultThreeContext.controls.maxPolarAngle = 0;
    // defaultThreeContext.controls.addEventListener('change', renderAnimate);
  }

  private __buildSceneTexture(images:string []){
    let skyBoxCubeMap = new CubeTextureLoader().load(images);
    skyBoxCubeMap.format = THREE.RGBFormat;
    return skyBoxCubeMap;
  }

  // 显示坐标轴
  public showAxes(){
    let axesHelper = new AxesHelper(10);
    defaultThreeContext.scene.add(axesHelper);
  }

  // 加载gltf模型
  public loadGLTFModel(path:string){
    // load
    defaultThreeContext.gltfLoader.load(path,
      (model) => {
        this.doModelLoadSuccess(model);
        defaultThreeContext.scene.add(model.scene);
        renderAnimate();
      },
      (progress) => {
        if(defaultThreeContext.progressCallback){
          defaultThreeContext.progressCallback(progress.loaded / progress.total * 100);
        }
      },
      (err) => {
      console.log('load model error', err)
      },
    );
  }

  public disposeSceneObjs(){
    if(defaultThreeContext.objs && defaultThreeContext.objs.length > 0){
      defaultThreeContext.objs.forEach(item => {
        defaultThreeContext.scene.remove(item);
      })
    }
    defaultThreeContext.objs = [];
    defaultThreeContext.labelObjects = [];
    if(defaultThreeContext.animateMixer){
      defaultThreeContext.animateMixer = null;
    }
    if(defaultThreeContext.raycaster){
      defaultThreeContext.raycaster = undefined;
    }
    if(defaultThreeContext.mouse){
      defaultThreeContext.mouse = undefined;
    }
    if(defaultThreeContext.progressCallback){
      defaultThreeContext.progressCallback = undefined;
    }
    if(defaultThreeContext.clickCallback){
      defaultThreeContext.clickCallback = undefined;
    }
    defaultThreeContext.scene = null;
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
    gltfModel.scene.traverse( child=>  {
        if(child.isLight){
          child.castShadow = true;
        }else if(child.isMesh){
          child.material.emissive =  child.material.color;
          child.material.emissiveMap = child.material.map;
        }
        // 缓存带标签的模型
        if(child.userData.canclick && child.userData.canclick === 'yes'){

          const text = child.name;
          const color = new Date().getTime() % 2 == 1 ? 'rgba(234, 42, 6, 1)' : 'rgba(0, 0, 0, 1.0)'
          let sprite = this.__makeTextLabelSprite(text, {
            color: color
          });
          if(sprite){
            sprite.position.set(child.position.x, child.position.y + 8, child.position.z);
            defaultThreeContext.scene.add(sprite);
            defaultThreeContext.labelObjects.push({'labelId':sprite.uuid, 'obj': child});
          }
        }
        if(child.userData.smoker){
          let smoker = SMOKEJSON;
          smoker.particleSystemState.emitters[0].position.x = child.position.x;
          smoker.particleSystemState.emitters[0].position.y = child.position.y;
          smoker.particleSystemState.emitters[0].position.z = child.position.z;
          this.__loadNebulaAnimate(smoker);
        }
        defaultThreeContext.objsIdSet.add(child.uuid);
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


  // 基于mesh创建其标签
  private __makeTextLabelSprite(message, parameters) {
    if ( parameters === undefined ) parameters = {};
    let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 30;
    let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 8;
    let borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:0.5 };
    let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:0.5 };
    let textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:0.5 };

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
    defaultThreeContext.scene.add(gridHelper);
  }

  private __mouseClick(ev){
    if(!defaultThreeContext.mouse || !defaultThreeContext.raycaster){
      return ;
    }
    defaultThreeContext.mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
    defaultThreeContext.mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;
    // 通过鼠标点的地位和以后相机的矩阵计算出raycaster
    defaultThreeContext.raycaster.setFromCamera(defaultThreeContext.mouse, defaultThreeContext.camera );

    // 获取raycaster直线和所有模型相交的数组汇合
    if(defaultThreeContext.scene && defaultThreeContext.scene.children){
      let intersects = defaultThreeContext.raycaster.intersectObjects( defaultThreeContext.scene.children );
      if(intersects && intersects.length > 0 && defaultThreeContext.clickCallback){
        // 查找点击的标签
        defaultThreeContext.labelObjects.forEach(item => {
          if(intersects[0].object && item.labelId === intersects[0].object.uuid){
            defaultThreeContext.clickCallback(item.obj);
          }
        })
      }
    }
  }

  private __loadNebulaAnimate(nebulaJsons: any){
    Nebula.fromJSONAsync(nebulaJsons.particleSystemState, THREE).then(loaded => {
      const nebulaRenderer = new SpriteRenderer(defaultThreeContext.scene, THREE);
      const nebula = loaded.addRenderer(nebulaRenderer);
      renderAnimate(nebula);
    });
  }



  private __initSky(){
    const sky = new Sky();
    sky.scale.setScalar( 450000 );
    if(defaultThreeContext.scene){
      defaultThreeContext.scene.add( sky );
    }else{
      return ;
    }

    let sun = new THREE.Vector3();
    const effectController = {
      turbidity: 0,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
    };

    const guiChanged = () => {
      const uniforms = sky.material.uniforms;
      uniforms[ 'turbidity' ].value = effectController.turbidity;
      uniforms[ 'rayleigh' ].value = effectController.rayleigh;
      uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
      uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;
      const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
      const theta = THREE.MathUtils.degToRad( effectController.azimuth );
      sun.setFromSphericalCoords( 1, phi, theta );
      uniforms[ 'sunPosition' ].value.copy( sun );
      defaultThreeContext.renderer.render( defaultThreeContext.scene, defaultThreeContext.camera );
    }
    guiChanged();

  }

}
