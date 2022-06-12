import "@babylonjs/loaders/glTF";
import { SceneLoader, Scene, ISceneLoaderProgressEvent, ISceneLoaderAsyncResult } from '@babylonjs/core';
import {useGlobSetting} from "/@/hooks/setting";
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh";
import {registerLoaderPlugin} from "/@/badylon/tools/ExtrasAsMetadataPlugin";
import * as GUI from "@babylonjs/gui/2D";
import '@babylonjs/inspector';
import {listAssetsOfThreeModels} from "/@/api/things/asset/assetApi";
import {ModelAssetSearch} from "/@/api/things/asset/model/assetModel";

// local path
const MODEL_LOCAL_PATH = '/models/electric/';
// remote path
const MODEL_REMOTE_PATH = useGlobSetting().apiUrl + '/fs/getModel?modelName=';

export abstract class ThingsModelAbstractScene {
  modelNames: Set<string> | null | undefined;
  scene: Scene | null | undefined;
  progressCallback: Function | null | undefined;
  protected constructor(progressCallback: Function | null | undefined) {
    this.progressCallback = progressCallback;
    this.modelNames = new Set<string>();
    // 注册扩展提取类
    registerLoaderPlugin();
  }

  public Init(modelNames: Set<string> | null,
              progressCallback: Function,scene: Scene){
    this.scene = scene;
    this.modelNames = modelNames;
    this.progressCallback = progressCallback;
  }


  // 批量加载模型
  __batchModels(models: Set<string>){
    let successCount: number = 0;
    models.forEach((model) => {
      // 如果本地存在，则从本地加载
      let localOrRemoteBasePath = this.__isLocal() ? MODEL_LOCAL_PATH: MODEL_REMOTE_PATH;
      try{
        SceneLoader.ImportMeshAsync(undefined, localOrRemoteBasePath, model, this.scene,
          (event: ISceneLoaderProgressEvent) => {
            if(this.progressCallback){
              this.progressCallback(event.loaded / event.total * 100);
              let curProgress = event.loaded / event.total * 100;
              if( curProgress === 100){
                successCount = successCount + 1;
              }
              if(successCount === models.size){
                if(this.progressCallback){
                  this.progressCallback(100);
                }
              }
            }
          }, '.glb').then((result: ISceneLoaderAsyncResult) => {
          if(this.loadSuccessCallback){
            this.loadSuccessCallback(result.meshes);
          }
          this.StartAnimate();
        });
      }catch (e) {
      }

    })
  }
  // 是否本地加载
  __isLocal(){
    return true;
  }

  // 加载模型
  public LoadModel(){
    if(!this.modelNames){
      return;
    }
    if(this.modelNames.size > 0) {
      this.__batchModels(this.modelNames);
    }
  }
  // 为mesh添加文字标注
  public addLabelForMesh(mesh: AbstractMesh, assetName: string | undefined){
    if(this.scene && assetName){
      let adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI(assetName);
      let rect = new GUI.Rectangle();
      // 基于文字长度，定义标注的宽度，每个字10px,
      rect.width = (assetName.length + 1) * 10 + "px";
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
      textLabel.text = assetName;
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

      // 事件
      rect.onPointerDownObservable.add(() => {
         this.clickMeshCallback(mesh);
      });
    }
  }
  // 加载模型对应的所有资产
  loadAssetByModelIds(params: ModelAssetSearch){
    listAssetsOfThreeModels(params).then(assets => {
      if(!assets || assets.length > 0){
        this.assetsLoadSuccess(assets);
      }
    })
  }


  public abstract loadSuccessCallback(meshes: AbstractMesh[]);
  public abstract clickMeshCallback(mesh: AbstractMesh);
  public abstract getAssetName(assetCode: string);
  public abstract assetsLoadSuccess(assets);
  public StartAnimate(){
    if(this.scene){
      this.scene.getEngine().runRenderLoop(() => this.animateRender());
    }
  }

  public StopAnimate(){
    if(this.scene){
      this.scene.getEngine().stopRenderLoop();
    }
  }

  animateRender(){
    this.scene?.render();
  }
}
