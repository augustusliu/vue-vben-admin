
// 电厂3D模型操作类
import {ThingsScene} from "/@/views/3d/ThingsScene";
// import {useGlobSetting} from "/@/hooks/setting";
import {Ref} from "vue";

// const modelPathPrefix = useGlobSetting().apiUrl + '/api/file/model/get/';

export class ElectricPowerPlant{
  // private modelPath: string;
  private readonly containerRef: Ref<HTMLElement>;
  private electricScene: ThingsScene;
  /**
   *
   * @param modelPath     3D模型路径
   * @param containerRef  挂载的容器地址
   */
  constructor(containerRef: Ref<HTMLElement>) {
    // this.modelPath = modelPath;
    this.containerRef = containerRef;
    this.electricScene = new ThingsScene(this.containerRef, true, {
      cameraX: 15,
      cameraY: 180,
      cameraZ: 80,
      cameraFov: 65,
      cameraNear: 0.1,
      cameraFar: 1000,
      enableSceneBackgroundColor: true,
      sceneColor: 0x2d3152,
      sceneBackImages: [
        'resource/electricImg/posx.jpg',
        'resource/electricImg/negx.jpg',
        'resource/electricImg/posy.jpg',
        'resource/electricImg/negy.jpg',
        'resource/electricImg/posz.jpg',
        'resource/electricImg/negz.jpg',
      ]
    });
  }

  public start(){
    this.electricScene.loadGLTFModel('models/dc.glb');
  }
}
