import "@babylonjs/loaders/glTF";
import { SceneLoader, Scene, ISceneLoaderProgressEvent, ISceneLoaderAsyncResult } from '@babylonjs/core';
import {useGlobSetting} from "/@/hooks/setting";
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh";
import {registerLoaderPlugin} from "/@/badylon/tools/ExtrasAsMetadataPlugin";
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
    // 注册扩展提取类
    registerLoaderPlugin();
  }

  public Init(modelNames: Set<string> | null,
              progressCallback: Function,scene: Scene){
    this.scene = scene;
    this.modelNames = modelNames;
    this.progressCallback = progressCallback;
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

  __appendModel(models: Set<string>){
    let successCount: number = 0;
    models.forEach((model) => {
      // 如果本地存在，则从本地加载
      let localOrRemoteBasePath = this.__isLocal() ? MODEL_LOCAL_PATH: MODEL_REMOTE_PATH;
      try{
        SceneLoader.AppendAsync(localOrRemoteBasePath, model, this.scene,
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
          }, '.glb').then((result: Scene) => {
          if(this.loadSuccessCallback){
            this.loadSuccessCallback(result.meshes);
          }
          this.StartAnimate();
        });
      }catch (e) {

      }
    })
  }


  __isLocal(){
    return true;
  }

  public abstract loadSuccessCallback(meshes: AbstractMesh[]);

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
