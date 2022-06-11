import {ThingsModelAbstractScene} from "/@/badylon/ThingsModelAbstractScene";
import {
  Scene,
  Engine,
  Camera,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Color4, AbstractMesh, Color3
} from '@babylonjs/core';
import '@babylonjs/inspector';
import * as GUI from '@babylonjs/gui/2D';
import { Light } from "@babylonjs/core/Lights/light";
import { AssetListItem } from "/@/api/things/asset/model/assetModel";
import { searchModelList } from "/@/api/things/baseData/modelApi";
import { ModelItem } from "/@/api/things/baseData/model/threeModel";
import { listAssetAllThreeModelsAssets } from "/@/api/things/asset/assetApi";
import { CommonParticlesType, ThingsCommonParticles } from "/@/badylon/tools/ThingsCommonParticles";
import {applyLeaveTransition} from "echarts/types/src/animation/customGraphicTransition";

// options
export interface ThingsDashboardSceneOpts{
  assetsOfModelMap: Map<string, AssetListItem> | null;
  canvas:HTMLCanvasElement;
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  progressCallback: Function | null | undefined;
  loadSuccessCallback: Function | null | undefined;
}

// 孪生看板的全景图
export class ThingsDashboardScene extends ThingsModelAbstractScene{

  private assetsOfModelMap: Map<string, AssetListItem> | null; // 资产列表
  public engine: Engine | null | undefined;
  private readonly canvas: HTMLCanvasElement | null;
  private camera: Camera | null | undefined;
  private light: Light | null | undefined;
  private opts: ThingsDashboardSceneOpts;

  constructor(options: ThingsDashboardSceneOpts) {
    super(options.progressCallback);
    this.canvas = options.canvas;
    this.assetsOfModelMap = options.assetsOfModelMap;
    this.opts = options;
    this.__initScene();
    this.__initModels();
  }

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
      let loadedModelNames: Set<string> = new Set<string>();
      let loadedModelIds: Set<number> = new Set<number>();
      searchModelList({isMain: true}).then((models: ModelItem[]) => {
        if (!models ||  models.length <= 0) {
          return;
        }
        models.forEach(model => {
          loadedModelNames.add(model.modelPath);
          loadedModelIds.add(model.id);
        })
        this.modelNames = loadedModelNames;
        this.LoadModel();
        this.__loadAssetOfModels(loadedModelIds);
        this.StartAnimate();
      });
    }

    // assets of models
    __loadAssetOfModels(modelIdSet: Set<number>){
      let modelIds:number[] = [];
      modelIdSet.forEach(item => modelIds.push(item));

      listAssetAllThreeModelsAssets({
        isMain: true,
        modelIds: modelIds
      }).then(assets => {
        if(!assets || assets.length > 0){
          assets.forEach(asset => {
            this.assetsOfModelMap?.set(String(asset.modelId), asset);
          })
        }
      })
    }

    async __buildMeshSmoke(mesh: AbstractMesh){
      if(!this.scene){
        return;
      }
      const smokeParticleSystem = new ThingsCommonParticles("ycSmokeParticle", 200, mesh, this.scene);
      smokeParticleSystem.buildParticle({
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
      }).start();

    }

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
           this.__addLabelForMesh(item, item.name)
         }
       })
    }

    // 为mesh添加文字标注
    __addLabelForMesh(mesh: AbstractMesh, labelText: string){
      if(this.scene){

        let adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI(labelText);
        let rect = new GUI.Rectangle();
        rect.width = "50px";
        rect.height = "18px";
        rect.cornerRadius = 5;
        rect.color = "Orange";
        rect.thickness = 2;
        rect.background = "green";
        rect.alpha = 0.5;
        rect.color ="white";
        rect.fontSize = 10;
        adt.addControl(rect);
        rect.linkWithMesh(mesh);
        rect.linkOffsetY = -30;

        let textLabel = new GUI.TextBlock();
        textLabel.text = labelText;
        rect.addControl(textLabel);


        let target = new GUI.Ellipse();
        target.width = "1px";
        target.height = "1px";
        target.color = "Orange";
        target.thickness = 1;
        target.background = "green";
        adt.addControl(target);
        target.linkWithMesh(mesh);

        let line = new GUI.Line();
        line.lineWidth = 1.4;
        line.color = "Orange";
        line.y2 = 30;
        line.linkOffsetY = -30;
        adt.addControl(line);
        line.linkWithMesh(mesh);
        line.connectedControl = rect;
      }
    }


    public Destory(){
      this.StopAnimate();
      this.assetsOfModelMap = null;
      this.engine = null;
      this.camera = null;
      this.light = null;
      this.scene = null;
    }
}
