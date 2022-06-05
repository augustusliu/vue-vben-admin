import {ThingsModelAbstractScene} from "/@/badylon/ThingsModelAbstractScene";
import {Scene, Engine, Camera, ArcRotateCamera, Vector3, HemisphericLight, Color3} from '@babylonjs/core';
import {Light} from "@babylonjs/core/Lights/light";
import {AssetListItem} from "/@/api/things/asset/model/assetModel";
import {searchModelList} from "/@/api/things/baseData/modelApi";
import { ModelItem } from "/@/api/things/baseData/model/threeModel";
import {listAssetAllThreeModelsAssets} from "/@/api/things/asset/assetApi";

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
  private engine: Engine | null | undefined;
  private readonly canvas: HTMLCanvasElement | null;
  private camera: Camera | null | undefined;
  private light: Light | null | undefined;
  private opts: ThingsDashboardSceneOpts;

  constructor(options: ThingsDashboardSceneOpts) {
    super(options.progressCallback, options.loadSuccessCallback);
    this.canvas = options.canvas;
    this.assetsOfModelMap = options.assetsOfModelMap;
    this.opts = options;
    this.__initScene();
    this.__initModels();
  }

  __initScene(){
      this.engine = new Engine(this.canvas, true);
      this.scene = new Scene(this.engine);
      this.scene.clearColor.a = 0;

      // camera
      this.camera = new ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 16, Vector3.Zero(), this.scene);
      this.camera.position = new Vector3(this.opts.cameraX ,this.opts.cameraY ,this.opts.cameraZ);
      // This targets the camera to scene origin
      // (this.camera as FreeCamera).setTarget(Vector3.Zero());
      this.camera.attachControl(this.canvas, false);
      // light
      this.light = new HemisphericLight('light', new Vector3(0, 10, 10), this.scene);
      // 光源强度
      this.light.intensity = 1;
      this.light.diffuse = new Color3(1,1,1);
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


    public Destory(){
      this.StopAnimate();
      this.assetsOfModelMap = null;
      this.engine = null;
      this.camera = null;
      this.light = null;
      this.scene = null;
    }
}
