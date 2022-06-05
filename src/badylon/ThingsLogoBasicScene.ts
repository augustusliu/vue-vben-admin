import {
  Scene, Engine, FreeCamera, Vector3, Camera,
  HemisphericLight, SceneLoader, PointsCloudSystem, Mesh, PointColor, CloudPoint
} from '@babylonjs/core';
import "@babylonjs/loaders/glTF";
import {Light} from "@babylonjs/core/Lights/light";
// 模型跟路径
const BASH_MODEL_PATH = '/models/';


export class ThingsLogoBasicScene{
  private scene?: Scene | null;
  private engine?: Engine | null;
  private canvas?: HTMLCanvasElement;

  private camera?: Camera | null;
  private light?: Light | null;
  public pointsCloudSystem?: PointsCloudSystem | null;

  constructor(canvas?: HTMLCanvasElement){
    if(!canvas){
      return ;
    }
    this.canvas = canvas;
    this.init(this.canvas);
  }

  public init(canvas: HTMLCanvasElement){
    this.canvas = canvas;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor.a = 0;

    // camera
    this.camera = new FreeCamera("", new Vector3(1, 1, 4), this.scene);
    // This targets the camera to scene origin
    (this.camera as FreeCamera).setTarget(Vector3.Zero());
    this.camera.attachControl(true);

    // light
    this.light = new HemisphericLight('light', new Vector3(0, 20, 1000), this.scene);
    // 光源强度
    this.light.intensity = 1;
  }


  public startAnimate(){
    this.engine?.runRenderLoop(() => this.animateRender());
  }

  public stopAnimate(){
    this.engine?.stopRenderLoop();
  }

  animateRender(){
    this.scene?.render();
  }

  public dispose(){
    if(this.scene){
      this.scene.dispose();
      this.scene = null;
    }

    if(this.engine){
      this.engine.dispose();
      this.engine = null;
    }

    if(this.camera){
      this.camera.dispose();
      this.camera = null;
    }

    if(this.light){
      this.light.dispose();
      this.light = null;
    }
    if(this.pointsCloudSystem){
      this.pointsCloudSystem.dispose();
      this.pointsCloudSystem = null;
    }
  }

  // 加载模型
  public loadLogoModel(logoModel: string){
    SceneLoader.ImportMesh(undefined, BASH_MODEL_PATH ,logoModel , this.scene,
      function(meshes:Mesh[]){
        // 将logo转化为粒子系统
        if(!meshes || meshes.length <= 0 || !thingsLogoBabylon.scene){
          return;
        }
        meshes[0].setEnabled(false); //系统默认加的根mesh，所以不处理
        let pcs = new PointsCloudSystem("pcs", 1, thingsLogoBabylon.scene, {updatable: true});

        for (let i = 1; i < meshes.length; i ++ ){
          pcs.addVolumePoints(meshes[i], 400, PointColor.Random);
        }

        thingsLogoBabylon.buildPointsCloudSystemAnimate(pcs, meshes.length);
        pcs.buildMeshAsync();
        thingsLogoBabylon.pointsCloudSystem = pcs;

        // 开始
        thingsLogoBabylon.startAnimate();
      },undefined,undefined, '.glb');
  }


  // 随机分批执行动画
  public buildPointsCloudSystemAnimate(pcs: PointsCloudSystem, mashLength: number){
    if(!this.canvas || !thingsLogoBabylon.scene){
      return;
    }
    // 需要缓存粒子当前的位置，
    pcs.particles.forEach((item:any) => {
      item.originPosition = item.position //尝试添加一个自定义属性，保存原来的位置
    });
    let moveFactor = 0;

    // 更新每个粒子的位置
    pcs.updateParticle = (particle:any):CloudPoint => {
      particle.position.z = particle.originPosition.z + 0.02 * Math.sin(moveFactor + particle.position.y * Math.PI * 2);
      return particle
    }

    let batchParticle = mashLength; // 分批执行粒子动画，按照mesh个数分批，代表一个字母一个字母运动
    let firstParticle = 0; // 第一个粒子
    let endParticle = pcs.nbParticles; // 最后一个粒子的索引
    let ps = Math.floor(endParticle / batchParticle) - 1;
    let updated = false;
    thingsLogoBabylon.scene.registerBeforeRender(function () {
      pcs.setParticles(firstParticle, firstParticle + ps, updated);
      firstParticle = firstParticle + ps;
      updated = false;
      if (firstParticle >= pcs.nbParticles) {
        firstParticle = 0 ;
        moveFactor += 0.01;
        updated = true;
      };
    });
  }
}

export const thingsLogoBabylon = new ThingsLogoBasicScene();
