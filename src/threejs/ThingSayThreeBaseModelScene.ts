import {Scene} from "three";
import { GLTFLoader } from "./extends/GLTFLoader";
import { useUserStore } from "/@/store/modules/user";
import {AbstractMesh} from "@babylonjs/core";
import * as THREE from "three";
import {useGlobSetting} from "/@/hooks/setting";
// 请求的权限
const userStore = useUserStore();

// local path
const MODEL_LOCAL_PATH = '/models/electric/';
// remote path
const MODEL_REMOTE_PATH = useGlobSetting().apiUrl + '/fs/getModel?modelName=';

// 抽象的场景基础类,只用于加载模型
export abstract class ThingSayThreeBaseModelScene{
  modelLoader: GLTFLoader | null;
  progressCallback: Function;

  protected constructor(progressCallback: Function) {
    this.progressCallback = progressCallback;
    this.modelLoader = new GLTFLoader();
    this.modelLoader.setRequestHeader({
      'Authorization': 'Bearer ' + userStore.getToken
    });
  }

  public abstract doModelLoadSuccessBefore(model);
  public abstract doModelLoadSuccessAfter(model);

  // 加载模型
  public loadModel(scene: Scene, path: string){
    console.log(path);
    if(!this.modelLoader){
      return;
    }
    let localOrRemoteBasePath = this.__isLocal() ? MODEL_LOCAL_PATH: MODEL_REMOTE_PATH;
    this.modelLoader.load(localOrRemoteBasePath + path,
      (model) => {
        console.log(path);
        this.doModelLoadSuccessBefore(model);
        scene.add(model.scene);
        this.doModelLoadSuccessAfter(model);
      },
      (progress) => {
        if(this.progressCallback){
          this.progressCallback(progress.loaded / progress.total * 100);
        }
      },
      (err) => {
        console.log('load model error', err)
      },
    );
  }

  // 批量加载
  public loadModelBatch(scene: Scene, paths: Set<string>) {
    paths.forEach(path => {
      this.loadModel(scene, path);
    });
  }

  // 为模型打标签
  public markedTextLabel(scene:Scene, mesh: AbstractMesh){
    // 字体颜色
    const color = new Date().getTime() % 2 == 1 ? 'rgba(234, 42, 6, 1)' : 'rgba(0, 0, 0, 1.0)';
    let sprite = this.__makeTextLabelSprite(mesh.name, {
      color: color
    });

    if(sprite){
      sprite.position.set(mesh.position.x, mesh.position.y + 8, mesh.position.z);
      scene.add(sprite);
    }
  }

  __makeTextLabelSprite(message, parameters) {
    if (parameters === undefined) parameters = {};
    let fontFace = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    let fontSize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 50;
    let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 8;
    let borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:244, g:210, b:10, a:0.9 };
    let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:1, g:23, b:92, a:0.2 };
    let textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:244, g:210, b:10, a:0.9 };

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    if(context){
      context.font = "Bold " + fontSize + "px " + fontFace;
      let metrics = context.measureText( message );
      let textWidth = metrics.width;

      context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
      context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

      context.lineWidth = borderThickness;
      this.__roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontSize * 1.4 + borderThickness, 8);

      context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
      context.fillText( message, borderThickness, fontSize + borderThickness);

      let texture = new THREE.Texture(canvas)
      texture.needsUpdate = true;

      let spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
      let sprite = new THREE.Sprite( spriteMaterial );
      sprite.scale.set(0.5 * fontSize, 0.25 * fontSize, 0.75 * fontSize);
      return sprite;
    }
  };

  __roundRect(ctx, x, y, w, h, r) {
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


  __isLocal(){
    return true;
  }
}
