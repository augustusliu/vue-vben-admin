import { useGlobSetting } from "/@/hooks/setting";
import { getToken } from "/@/utils/auth";
import { useWebSocket } from '@vueuse/core';
import {ref, unref, watchEffect} from "vue";
const WS_BASE_API = '/api/ws/telemetry';
// websocket 监听的topic(不能携带空格)
const topics: string ='ruleDebugInfo,ruleDebugNodeInfo,deviceAttrTelemetry,deviceCommandTelemetry,assetAttrTelemetry,assetCommandTelemetry';

const WS_API_PATH = useGlobSetting().wsUrl + WS_BASE_API + '?token=' + getToken() +'&subTopic='+topics;

// ws 返回的数据结构
export interface WebResponse {
  topic: string,
  entityId: string,
  entityType: string,
  assetId: string,
  data: any,
}

// web可以接受的回调函数
export interface WebSocketCallbackOptions{
  debugNodeCallbackFunc?: any,
  debugChainCallbackFunc?: any,
  deviceAttributeCallbackFunc?:any,
  deviceCommandCallbackFunc?:any,
}


// 全局唯一websocket
class ThingsWebSocket{

  private wsStateRef: any;
  private closeFunc: any;
  private connected: boolean;
  private debugNodeCallbackFunc: any;
  private debugChainCallbackFunc: any;
  private deviceAttributeCallbackFunc: any;
  private deviceCommandCallbackFunc: any;

  constructor(opts?:WebSocketCallbackOptions) {
    this.connected = false;
    this.debugNodeCallbackFunc = opts?.debugNodeCallbackFunc;
    this.debugChainCallbackFunc = opts?.debugChainCallbackFunc;
    this.deviceAttributeCallbackFunc = opts?.deviceAttributeCallbackFunc;
    this.deviceCommandCallbackFunc = opts?.deviceCommandCallbackFunc;

    this.wsStateRef = ref({
      server: WS_API_PATH,
      sendValue: '',
      receiveRecord: {} as WebResponse,
    });
  }

  public init(){
    if(!getToken()){
      return;
    }
    const {data, close, open } = useWebSocket(unref(this.wsStateRef).server, {
      autoReconnect: false,
      heartbeat: true,
      immediate: false,
      autoClose: false,
    });

    if(!this.connected){
      open();
      this.closeFunc = close;
      this.connected = true;
    }

    watchEffect(() => {
      if (data.value) {
        try {
          const responseData = JSON.parse(data.value) as WebResponse;
          if('ruleDebugInfo' === responseData.topic && this.debugChainCallbackFunc){
            this.debugChainCallbackFunc(responseData);
          }else if('ruleDebugNodeInfo' === responseData.topic && this.debugNodeCallbackFunc){
            this.debugNodeCallbackFunc(responseData);
          }else if('deviceAttrTelemetry' === responseData.topic && this.deviceAttributeCallbackFunc){
            this.deviceAttributeCallbackFunc(responseData);
          }else if('deviceCommandTelemetry' === responseData.topic && this.deviceCommandCallbackFunc){
            this.deviceCommandCallbackFunc(responseData);
          }
          data.value = null;
        } catch (error) {
          console.log('ws parse error', error)
        }
      }
    });
  }

  public reOpen(){
    if(this.connected){
      return;
    }
    if(this.closeFunc){
      this.closeFunc();
    }
    this.connected = false;
    return this.init();
  }

  public closeWs(){
    this.closeFunc();
    this.connected = false;
  }

  public isConnected(){
    return this.connected;
  }

  // 更新不同界面的回调函数
  public updateCallback(opts?:WebSocketCallbackOptions){
    this.debugNodeCallbackFunc = opts?.debugNodeCallbackFunc;
    this.debugChainCallbackFunc = opts?.debugChainCallbackFunc;
    this.deviceAttributeCallbackFunc = opts?.deviceAttributeCallbackFunc;
    this.deviceCommandCallbackFunc = opts?.deviceCommandCallbackFunc;
  }

}

export const thingsWebSocket = new ThingsWebSocket();
