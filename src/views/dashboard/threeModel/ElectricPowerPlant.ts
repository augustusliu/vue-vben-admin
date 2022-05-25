
// 电厂3D模型操作类
import {ThingsScene} from "/@/views/3d/ThingsScene";
// import {useGlobSetting} from "/@/hooks/setting";
import {Ref} from "vue";

// const modelPathPrefix = useGlobSetting().apiUrl + '/api/file/model/get/';


const electricModels = [
  'models/electric/plant.glb',
  'models/electric/byq.glb',
  'models/electric/house.glb',
  'models/electric/smoker.glb',
  'models/electric/momei.glb',
  'models/electric/gl.glb',
  'models/electric/coolpower.glb',
  'models/electric/gl.glb',
  'models/electric/house.glb',
  'models/electric/meichang.glb',
  'models/electric/momei.glb',
  'models/electric/smoker.glb',
]

export class ElectricPowerPlant{
  // private modelPath: string;
  private readonly containerRef: Ref<HTMLElement>;
  private readonly electricScene: ThingsScene;

  // use container to instance
  constructor(containerRef: Ref<HTMLElement>, progressCallback: any, clickCallback: any) {
    // this.modelPath = modelPath;
    this.containerRef = containerRef;
    this.electricScene = new ThingsScene(this.containerRef, {
      cameraX: -20,
      cameraY: 280,
      cameraZ: 45,
      cameraFov: 65,
      cameraNear: 0.1,
      cameraFar: 1000,
      canControls: true,
      sceneBackTransport:true,
      sceneColor: 0x2d3152,
    }, progressCallback, clickCallback);
  }

  public start(){
    electricModels.forEach(item => {
      this.electricScene.loadGLTFModel(item);
    });
  }

  public getScene(){
    return this.electricScene;
  }

  public dispose(){
    this.electricScene.disposeSceneObjs();
  }

  public cancelAnimate(){
    if(this.electricScene){
      this.electricScene.stopAnimate();
    }
  }
}
