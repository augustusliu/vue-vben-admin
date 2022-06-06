import { GLTFLoader } from "/@/views/3d/extends/GLTFLoader";
import { useUserStore } from "/@/store/modules/user";
import { getModelInfoApi } from  '/@/api/things/baseData/modelApi';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import {ImportAssetItem} from "/@/api/things/common/model/commonModel";
import {importAssetsByModel} from "/@/api/things/common/commonApi";

const MODEL_LOCAL_PATH = '/models/electric/';
const IS_LOCAL = true;
export class ModelSyncAssetRequest{

   private modelLoader: GLTFLoader;
   private readonly pathPrefix: string;

   constructor() {
     this.pathPrefix = useGlobSetting().apiUrl + '/api/file/model/get/';
     this.modelLoader = new GLTFLoader();
     this.modelLoader.setRequestHeader({'Authorization': 'Bearer ' + useUserStore().getToken});
   }

   public loadModel(modelId:number, closeLoadCallback){
     getModelInfoApi(modelId).then((modelInfo) => {
       if(modelInfo){
         let modelPath = IS_LOCAL? MODEL_LOCAL_PATH + modelInfo.modelPath: this.pathPrefix + modelInfo.modelPath
         this.__remoteLoadModel(modelId, modelPath, closeLoadCallback);
       }else{
         useMessage().createMessage.error('模型不存在');
       }
     });
   }

   // 远程加载模型
   private __remoteLoadModel(modelId:number, modelPath: string, closeLoadCallback: any){
     const assets: ImportAssetItem[] = [];

     this.modelLoader.load(modelPath,
       (model) => {
          if(model){
            model.scene.traverse( child=> {
              if(child.userData.assetCode){
                assets.push({
                  name: child.name,
                  code: child.userData.assetCode,
                  icon: 'device_2',
                  disabled: false
                });
              }
            });

            // 添加资产
            if(assets && assets.length > 0){
              importAssetsByModel({
                'modelId':modelId,
                'assets':assets,
              }).then(() => {
                closeLoadCallback();
              }).catch((err) => {
                closeLoadCallback();
                console.error(err);
                useMessage().createMessage.error('模型导入异常');
              }).finally(() => {
                closeLoadCallback();
              });
            }
          }
       },
       null
       , (err) => {
         console.error(err);
         useMessage().createMessage.error('模型加载失败');
       }
       );
   }

}
