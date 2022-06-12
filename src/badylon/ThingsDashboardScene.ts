import {ThingsModelAbstractScene} from "/@/badylon/ThingsModelAbstractScene";
import {
  Scene,
  Engine,
  Camera,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Color4, AbstractMesh, Color3, ParticleSystem
} from '@babylonjs/core';
import { Light } from "@babylonjs/core/Lights/light";
import { AssetListItem } from "/@/api/things/asset/model/assetModel";
import { searchModelList } from "/@/api/things/baseData/modelApi";
import { ModelItem } from "/@/api/things/baseData/model/threeModel";
import { CommonParticlesType, ThingsCommonParticles } from "/@/badylon/tools/ThingsCommonParticles";

// options
export interface ThingsDashboardSceneOpts{
  canvas:HTMLCanvasElement;
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  progressCallback: Function | null | undefined;
  loadSuccessCallback: Function | null | undefined;
  clickCallback: Function | null | undefined;
}

// 孪生看板的全景图
export class ThingsDashboardScene extends ThingsModelAbstractScene{
  private assetsOfMainModelMap: Map<string, AssetListItem> | null; // 资产列表
  private assetCodeNameMap: Map<string, string> | null;
  public engine: Engine | null | undefined;
  private readonly canvas: HTMLCanvasElement | null;
  private camera: Camera | null | undefined;
  private light: Light | null | undefined;
  private opts: ThingsDashboardSceneOpts;
  private readonly particleSystem: ParticleSystem[] | null;
  private readonly clickCallbackFn : Function | null | undefined;

  constructor(options: ThingsDashboardSceneOpts) {
    super(options.progressCallback);
    this.canvas = options.canvas;
    this.clickCallbackFn = options.clickCallback;
    this.particleSystem = [];
    this.assetsOfMainModelMap = new Map<string, AssetListItem>();
    this.assetCodeNameMap = new Map<string, string>();
    this.opts = options;
    this.__initScene();
    this.__initModels();
  }

  // 初始化场景
  __initScene(){
      this.engine = new Engine(this.canvas, true);
      this.scene = new Scene(this.engine);
      this.scene.ambientColor = new Color3(1, 1, 1);
      //如果背景颜色透明，则粒子不显示
      this.scene.clearColor = new Color4(0.1, 0.1, 0.2, 0.3);

      // camera
      this.camera = new ArcRotateCamera("Camera", 1, 0.8, 20, Vector3.Zero(), this.scene);
      this.camera.position = new Vector3(this.opts.cameraX ,this.opts.cameraY ,this.opts.cameraZ);
      // This targets the camera to scene origin
      // (this.camera as FreeCamera).setTarget(Vector3.Zero());
      this.camera.attachControl(this.canvas, false);
      // light
      this.light = new HemisphericLight('plight', new Vector3(0, 0, 200), this.scene);
      // 光源强度
      this.light.intensity = 1.6;
      this.light.diffuse = new Color3(1,1,1);
      // this.light.specular = new Color3(1,1,1);
      this.light.setEnabled(true);
    }

  // 当资产为空时，也可以加载模型,所以只需要加载对应的3d模型即可
  __initModels() {
      let loadedMainModelNames: Set<string> = new Set<string>();
      let loadedMainModelIds: Set<number> = new Set<number>();
      searchModelList({isMain: true}).then((models: ModelItem[]) => {
        if (!models ||  models.length <= 0) {
          return;
        }
        // 处理模型及子模型
        models.forEach(model => {
          loadedMainModelNames.add(model.modelPath);
          loadedMainModelIds.add(model.id);
        })
        this.modelNames = loadedMainModelNames;
        // 加载资产及模型
        this.__loadAssetOfModels(loadedMainModelIds).then(() => this.LoadModel());
        this.StartAnimate();
      });
    }

  // assets of models
  async __loadAssetOfModels(modelIdSet: Set<number>){
      let modelIds:number[] = [];
      modelIdSet.forEach(item => modelIds.push(item));
      this.loadAssetByModelIds({
        isMain: true,
        modelIds: modelIds
      });
    }

  // 资产中的烟雾动画
  async __buildMeshSmoke(mesh: AbstractMesh){
      if(!this.scene){
        return;
      }
      const smokeParticleSystem = new ThingsCommonParticles("ycSmokeParticle", 200, mesh, this.scene);
      const sps = smokeParticleSystem.buildParticle({
        particleMode: CommonParticlesType.SMOKE_MODE,
        minEmitterBox: new Vector3(-0.5, 1, 0.5),
        maxEmitterBox: new Vector3(1, 2, 1),
        particleMinSize: 4,
        particleMaxSize: 9,
        particleMinLifeTime: 4,
        particleMaxLifeTime: 60,
        particleEmitterRate: 500,
        particleSystemGravity: new Vector3(0, 0, 0),
        // 调整烟雾的扩散
        direction1: new Vector3(-0.5, 1, 0.2),
        direction2: new Vector3(0.3, 1, -0.2),
        minEmitPower: 10,
        maxEmitPower: 40,
        updateSpeed:0.005
      });
      sps.start();
      this.particleSystem?.push(sps);
    }

  // 资产编号与资产名称映射关系
  public getAssetName(assetCode: string) {
    return this.assetCodeNameMap?.get(assetCode);
  }

  // 加载成功后的回调函数
  public async loadSuccessCallback(meshes: AbstractMesh[]){
      if(this.opts.loadSuccessCallback){
        this.opts.loadSuccessCallback(meshes);
      }
      //处理电厂的场景
      if(!meshes || meshes.length <= 0){
        return;
      }
      if(!this.scene){
        return;
      }
      // 烟冲
      const yancongEmitterMesh = this.scene?.getLastMeshByID("ycSmokeEmitter");
      if(yancongEmitterMesh){
        await this.__buildMeshSmoke(yancongEmitterMesh);
      }

      // 冷却塔
      const cpEmitterMesh = this.scene?.getLastMeshByID("coolpowerEmitter");
      if(cpEmitterMesh){
        await this.__buildMeshSmoke(cpEmitterMesh);
      }

       meshes.forEach(item => {
         if(item.metadata && item.metadata.gltf && item.metadata.gltf.extras && item.metadata.gltf.extras.childModel){
           const assetName = this.getAssetName(item.metadata.gltf.extras?.currentAssetCode);
           this.addLabelForMesh(item, assetName);
         }
       })
    }

  // 废弃场景
  public disposeScene(){
      this.StopAnimate();
      if(this.particleSystem){
        this.particleSystem.forEach(ps => ps.dispose())
      }
      this.assetsOfMainModelMap = null;
      this.assetCodeNameMap = null;
      this.engine = null;
      this.camera = null;
      this.light = null;
      this.scene = null;
    }
  // 资产点击回调函数
  clickMeshCallback(mesh: AbstractMesh) {
    // 获取其子模型
    if(mesh.metadata && mesh.metadata.gltf && mesh.metadata.gltf.extras){
      const childName = mesh.metadata.gltf.extras.childModel;
      const currentAssetCode = mesh.metadata.gltf.extras?.currentAssetCode;
      if(this.clickCallbackFn){
        this.clickCallbackFn(childName, currentAssetCode);
      }
    }
  }

  assetsLoadSuccess(assets) {
    assets.forEach(asset => {
      this.assetsOfMainModelMap?.set(String(asset.modelId), asset);
      this.assetCodeNameMap?.set(String(asset.code), String(asset.name));
    })
  }
}
