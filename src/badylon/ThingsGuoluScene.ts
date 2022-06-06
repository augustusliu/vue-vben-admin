
// 锅炉场景
import {ThingsModelAbstractScene} from "/@/badylon/ThingsModelAbstractScene";
import {
  ArcRotateCamera,
  Camera,
  Color4,
  Engine,
  HemisphericLight,
  Scene,
  Vector3,CannonJSPlugin, StandardMaterial
} from "@babylonjs/core";
import {Light} from "@babylonjs/core/Lights/light";
import "./cannon.js";
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh";
import {ThingsCommonPipeFlowTexture} from "/@/badylon/tools/ThingsCommonPipeFlowTexture";

export class ThingsGuoluScene  extends ThingsModelAbstractScene{

  private engine: Engine | null | undefined;
  private readonly canvas: HTMLCanvasElement | null;
  private camera: Camera | null | undefined;
  private light: Light | null | undefined;
  constructor(canvas: HTMLCanvasElement, progressCallback: Function) {
    super(progressCallback);
    this.canvas = canvas;
    this.__initScene();
  }

  __initScene(){
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    //如果背景颜色透明，则粒子不显示
    this.scene.clearColor = new Color4(0.1, 0.1, 0.2, 0.3);

    this.scene.enablePhysics(new Vector3(0,-9.81, 0), new CannonJSPlugin());
    // camera
    this.camera = new ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 16, Vector3.Zero(), this.scene);
    this.camera.position = new Vector3(60 ,6 ,60);
    this.camera.attachControl(this.canvas, false);
    const light = new HemisphericLight('light', new Vector3(0, 50, 100), this.scene);
    light.intensity = 0.3; // 强度
    this.light?.setEnabled(true);

    const detailNames = new Set<string>();
    detailNames.add('glDetail.glb');
    this.modelNames = detailNames;
    this.LoadModel();
  }


  public loadSuccessCallback(meshes: AbstractMesh[]){
    if(!meshes || meshes.length <= 0){
      return;
    }
    if(!this.scene){
      return;
    }
    this.StartAnimate();

    const guoluWallMesh = this.scene.getMeshById("锅炉墙");
    if(guoluWallMesh){
      guoluWallMesh.visibility = 0.4;
    }

    const shuiLengBiMesh = this.scene.getMeshById("水冷壁_primitive0");
    if(shuiLengBiMesh){
      let shuiLengBiPipeMat = new StandardMaterial('pipMaterial', this.scene);
      let fireFlowTexture = new ThingsCommonPipeFlowTexture("test", 10, this.scene).buildFire();
      // fireTexture.setFloat('time', 0.5);
      shuiLengBiPipeMat.emissiveTexture = fireFlowTexture;
      shuiLengBiPipeMat.opacityTexture = fireFlowTexture;
      shuiLengBiMesh.material = shuiLengBiPipeMat;
      shuiLengBiMesh.visibility = 0.8;
    }

    const qibaoDownMesh = this.scene.getMeshById("汽包冷水管");
    if(qibaoDownMesh){
      let qibaoDownMataterial = new StandardMaterial('qibaoDownMat', this.scene);
      let waterPipeTexture = new ThingsCommonPipeFlowTexture("qibaoDown", 30, this.scene).buildWater();
      // fireTexture.setFloat('time', 0.5);
      qibaoDownMataterial.emissiveTexture = waterPipeTexture;
      qibaoDownMataterial.opacityTexture = waterPipeTexture;
      qibaoDownMesh.material = qibaoDownMataterial;
      qibaoDownMesh.visibility = 0.8;
    }
  }


}
