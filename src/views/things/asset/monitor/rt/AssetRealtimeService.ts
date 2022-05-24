import {getAllAttributesByEntity} from "/@/api/things/attribute/attrApi";
import {AttributeListItem} from "/@/api/things/attribute/model/attributeModel";
const entityType = 'ASSET';

export class AssetRealtimeService{
  private assetId: number;
  // 存储无重复设备编号
  private deviceIds: any;
  // 缓存属性code与名称的映射关系
  private attributeMap: any;

  // 数值类型属性
  private numberAttributes: AttributeListItem[];
  // 保存每个设备下对应的属性集合
  private attributeOfDeviceMap : any;
  // callback
  private readonly deviceUpdateCallback: Fn;

  constructor(assetId:number, deviceUpdateCallback:Fn) {
    this.assetId = assetId;
    this.numberAttributes = [];
    this.attributeOfDeviceMap = new Map();
    this.deviceIds = new Map();
    this.deviceUpdateCallback = deviceUpdateCallback;
    this.loadAttribute();
  }

  // 加载资产对应的属性和设备信息
  private loadAttribute(){
    getAllAttributesByEntity(this.assetId, entityType).then((attributeItems) => {
      this.attributeMap = [];
      this.deviceIds = new Map();
      this.attributeOfDeviceMap = new Map();
      // 过滤掉非数字类型的字段
      if(attributeItems && attributeItems.length > 0){
        this.numberAttributes = attributeItems.filter(item => (item.valueType === 'LONG_V' || item.valueType === 'DOUBLE_V'));
        this.numberAttributes.forEach(attribute => {
          this.attributeMap.push({
            deviceId: attribute.entityId,
            attrCode: attribute.code,
            attrName: attribute.name
          });

          this.deviceIds.set(attribute.entityId, attribute.entityName);

          let attrs = this.attributeOfDeviceMap.get(attribute.entityId);
          if(!attrs){
            attrs = [];
          }
          attrs.push({
            'label': attribute.name,
            'value': attribute.code
          });
          this.attributeOfDeviceMap.set(attribute.entityId, attrs);
        });
      }
      this.deviceUpdateCallback(this.getDeviceListOptions());
    })
  }

  public getDeviceListOptions(){
    let deviceOpts:any[] = [];
    this.deviceIds.forEach((value, key) => {
      deviceOpts.push({
        'label': value,
        'value': key
      });
    })
    return deviceOpts;
  }

  public getFieldsByDeviceId(deviceId: any){
    return this.attributeOfDeviceMap.get(deviceId);
  }

  // 获取某个设备下所有属性名称的集合
  public getFieldNamesByDevice(deviceId: any){
    let fieldNames:any[] = [];
    let fields = this.attributeOfDeviceMap.get(deviceId);
    if(fields && fields.length > 0){
      fields.forEach(field => {
        fieldNames.push(field.label);
      })
    }
    return fieldNames;
  }

  public getFieldCodesByDevice(deviceId){
    let fieldCodes:any[] = [];
    let fields = this.attributeOfDeviceMap.get(deviceId);
    if(fields && fields.length > 0){
      fields.forEach(field => {
        fieldCodes.push(field.value)
      });
    }
    return fieldCodes;
  }

  public getFieldNameMapByDevice(deviceId){
    let attrMap = new Map();
    this.attributeMap.forEach(item => {
      if(item.deviceId === deviceId){
        attrMap.set(item.attrCode, item.attrName);
      }
    })
    return attrMap;
  }
}
