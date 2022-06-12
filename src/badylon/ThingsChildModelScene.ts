import {ThingsModelAbstractScene} from "/@/badylon/ThingsModelAbstractScene";
import {getChildModelApi} from "/@/api/things/baseData/modelApi";
import {ModelItem} from "/@/api/things/baseData/model/threeModel";

// 子模型通用方法
export abstract class ThingsChildModelScene extends ThingsModelAbstractScene{

  modelInfo: ModelItem | undefined | null;
  protected constructor(progressCallback: Function | null | undefined) {
    super(progressCallback);
  }
  public LoadChildModel(parentAssetCode: string, modelName: string){
    let childModelNames = new Set<string>();

    getChildModelApi(parentAssetCode, modelName).then((modelInfo) => {
      if(!modelInfo){
        return;
      }
      let modelIdArray:number[] = [];
      modelIdArray.push(modelInfo.id);

      this.modelInfo = modelInfo;
      childModelNames.add(modelInfo.modelPath);
      this.modelNames = childModelNames;
      this.LoadModel();
      this.loadAssetByModelIds({isMain: false, modelIds: modelIdArray});
    })
  }

  public getModelInfo(){
    return this.modelInfo;
  }
}
