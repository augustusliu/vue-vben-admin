/*用于定于规则链弹框节点属性的所有定义*/

import {FormSchema} from "/@/components/Form";
import { ref } from 'vue';
import {listDeviceWithPageApi} from "/@/api/things/device/deviceApi";
import {listEntityGroupByPager} from "/@/api/things/entityGroup/entityGroupApi";
import {listTemplateWithPager} from "/@/api/things/asset/templateApi";

export interface RuleNodeDefinitionFormSchema {
  ruleNodeFixId: string;
  schemas: FormSchema[];
}

// 选择的控制方式
export const autoControlMethod:any = ref(null);
// 选择控制方式对应的id
export const autoControlEntityId :any = ref(null);

// 定义所有规则链节点的定义及交互关系，绑定时，基于节点的参数信息进行筛选绑定,
// 与rule.node.menu.json中节点对应，采用规则进行绑定匹配不同节点中的不同属性

// 2、要保证每个节点的名称不同
export const nodeFormSchema: RuleNodeDefinitionFormSchema[] = [
  {
    ruleNodeFixId: '100',
    schemas:[
    {
      label: "手工输入别名",
      field: "inputNodeName",
      component: "Input",
      defaultValue: "手工输入",
      colProps: {span: 22},
      componentProps: {
        placeholder: "定义一个节点的业务名称"
      }
    },
    {
      label: "调用方式",
      field: "scheduleType",
      component: "Select",
      required: true,
      colProps: {span: 11},
      componentProps: {
        style: { width: "90%" },
        options: [
          { label: "一次调用", value: "one" },
          { label: "循环调用", value: "round" }
        ]
      },
    },
    {
      label: "延时(秒)",
      field: "delay",
      component: "Select",
      required: true,
      colProps: {span: 11},
      componentProps:{
        options: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 }
        ],
        style: {width: "90%"}
      }
    },
    {
      label: "输入内容:",
      field: "inputContent",
      component: "CodeEditor",
      helpMessage: "请输入字符串或者JSON格式对象",
      colProps: {span: 24},
      componentProps: {
        mode: "application/json",
        lineNumbers: false,
        lineWrapping: true,
        style: {
          width: "100%",
          minHeight: "200px"
        }
      }
    },
    {
      label: "",
      field: "optTips",
      component: "OperationTips",
      colProps: {span: 20},
      componentProps: {
        header: "操作提示:",
        dataSource: [
          "1.主要用于测试规则链，可以在此手工数据相关数据模板，校验规则链的结果是否与预期一致",
          "2.数据输入统一采用JSON对象，如果是数组，请包装到JSON对象中"
        ]
      }
    },
  ]
  },{
    ruleNodeFixId: '101',
    schemas: [
      {
        label: "调试节点别名",
        field: "debugNodeName",
        component: "Input",
        colProps: {span: 22},
        defaultValue: "调试",
        componentProps: {
          placeholder: "定义一个节点的业务名称"
        }
      },
      {
        label: "打印内容",
        field: "outType",
        component: "Select",
        required: true,
        colProps: {span: 10},
        componentProps: {
          options: [
            { label: "全部", value: "All" },
            { label: "消息头", value: "Header" },
            { label: "消息体", value: "Body" }
          ]
        }
      },
      {
        field: "dividerLine",
        component: "Divider",
        colProps: {span: 22},
        label: "",
        componentProps: {
        }
      },
      {
        label: "控制台",
        field: "console",
        component: "InputTextArea",
        colProps: {span: 22},
        componentProps: {
          placeholder: "定义一个节点的业务名称",
          style: { disabled: true},
          autoSize: {
            minRows: 5,
            maxRows: 8
          }
        }
      },
      {
        label: "",
        field: "optTips",
        component: "OperationTips",
        colProps: {span: 20},
        componentProps: {
          header: "操作提示:",
          dataSource: [
            "1. 用于打印当前节点接收到的消息",
            "2. 可以选择打印全部消息内容、打印消息头、打印消息体"
          ]
        }
      },
    ]
  },{
    ruleNodeFixId: '102',
    schemas: [
      {
        label: "脚本节点别名",
        field: "scriptNodeName",
        component: "Input",
        defaultValue: "脚本处理",
        colProps: {span: 24},
        componentProps: {
          placeholder: "定义一个节点的业务名称"
        }
      },
      {
        label: "编辑脚本",
        subLabel: "(Javascript)",
        field: "scriptBody",
        component: "CodeEditor",
        helpMessage: "请输入Javascript脚本处理数据",
        colProps: {span: 24},
        componentProps: {
          mode: "javascript",
          lineNumbers: true,
          lineWrapping: true,
          style: {
            width: "100%",
            minHeight: "300px"
          }
        }
      },
      {
        label: "",
        field: "optTips",
        component: "OperationTips",
        colProps: {span: 20},
        componentProps: {
          header: "操作提示:",
          dataSource: [
            "1. 可以使用msg 获取接收到的消息，同时对消息进行处理",
            "2. return 表示将处理结果传递给下个流程节点",
            "3. 样例: ",
            "      var count = msg.count + 1; ",
            "      return count;"
          ]
        }
      },
    ]
  },{
    ruleNodeFixId: '300',
    schemas: [
      {
        label: "HTTP节点别名：",
        field: "httpNodeName",
        component: "Input",
        defaultValue: "HTTP请求",
        colProps: {span: 24},
        componentProps: {
          placeholder: "定义一个节点的业务名称"
        }
      },
      {
        label: "请求地址：",
        field: "endpoint",
        component: "Input",
        required: true,
        colProps: {span: 24},
        componentProps: {
        }
      },
      {
        label: "请求方式：",
        field: "method",
        required: true,
        component: "Select",
        colProps: {span: 10},
        componentProps: {
          options: [
            {
              label: "GET",
              value: "GET"
            },
            {
              label: "POST",
              value: "POST"
            },
            {
              label: "PUT",
              value: "PUT"
            },
            {
              label: "DELETE",
              value: "DELETE"
            }
          ]
        },
        defaultValue: "GET"
      },
      {
        label: "响应格式：",
        field: "respType",
        component: "Select",
        required: true,
        defaultValue: "JSON",
        colProps: {span: 10, offset: 2},
        componentProps: {
          options: [
            {
              label: "JSON",
              value: "JSON"
            },
            {
              label: "字符串",
              value: "TEXT"
            }
          ]
        }
      },
      {
        label: "请求头:",
        field: "headers",
        subLabel: "(application/json)",
        component: "CodeEditor",
        colProps: {span: 24},
        componentProps: {
          mode: "application/json",
          lineNumbers: false,
          lineWrapping: true,
          style: {
            width: "100%",
            minHeight: "50px"
          }
        }
      },
      {
        label: "参数:",
        subLabel: "(application/json)",
        field: "payload",
        component: "CodeEditor",
        helpMessage: "请输入JSON格式参数",
        colProps: {span: 24},
        componentProps: {
          mode: "application/json",
          lineNumbers: false,
          lineWrapping: true,
          style: {
            width: "100%",
            minHeight: "150px"
          }
        }
      },
      {
        label: "响应结果填充:",
        field: "httpRespAutoAdd",
        component: "Switch",
        defaultValue: false,
        colProps: {span: 24},
        componentProps: {
        }
      },
      {
        label: "",
        field: "optTips",
        component: "OperationTips",
        colProps: {span: 20},
        componentProps: {
          header: "操作提示:",
          dataSource: [
            "1. 请求方法为POST、PUSH方式时，参数格式：JSON格式",
            "2. 如需引用消息中数据时，请采用 ${msg.payload} 来提取消息中内容数据",
            "3. 样例：",
            "   示例1: http://www.baidu.com?key=${msg.payload.key}",
            "   示例2: { Content-Type: ${msg.header.contentType }"
          ]
        }
      },
    ]
  },{
    ruleNodeFixId: '302',
    schemas: [
      {
        label: "Kafak消费节点别名：",
        field: "kafkaConsumeNodeName",
        component: "Input",
        defaultValue: "Kafka消费",
        colProps: {span: 22},
        componentProps: {
          placeholder: "业务名称"
        }
      },
      {
        label: "地址：",
        field: "endpoint",
        component: "Input",
        required: true,
        colProps: {span: 10},
        componentProps: {
        }
      },
      {
        label: "端口：",
        field: "port",
        component: "Input",
        required: true,
        colProps: {span: 10, offset: 2},
        componentProps: {
        }
      },
      {
        label: "主题：",
        field: "topic",
        component: "Input",
        required: true,
        colProps: {span: 10},
        componentProps: {
        }
      },
      {
        label: "消费周期：",
        field: "interval",
        component: "InputNumber",
        required: true,
        colProps: {span: 10, offset: 2},
        componentProps: {
        }
      },
      {
        label: "分组Id：",
        field: "groupId",
        component: "Input",
        required: true,
        colProps: {span: 10},
        componentProps: {
        }
      },
      {
        label: "消费者Id：",
        field: "clientId",
        component: "Input",
        required: true,
        colProps: {span: 10, offset: 2},
        componentProps: {
        }
      },
      {
        label: "自动提交：",
        field: "autoCommit",
        component: "Select",
        required: true,
        colProps: {span: 10},
        defaultValue: true,
        componentProps: {
          options: [
            {
              label: "是",
              value: true
            },
            {
              label: "否",
              value: false
            }
          ]
        }
      },
      {
        label: "偏移量：",
        field: "offsetReset",
        component: "Select",
        required: true,
        colProps: {span: 10, offset: 2},
        defaultValue: "latest",
        componentProps: {
          options: [
            {
              label: "历史数据",
              value: "earliest"
            },
            {
              label: "最新数据",
              value: "latest"
            }
          ]
        }
      },
    ]
  },{
    ruleNodeFixId: '303',
    schemas: [
      {
        label: "Kafka生产节点别名：",
        field: "kafkaProducerNodeName",
        component: "Input",
        defaultValue: "Kafka生产",
        colProps: {span: 22},
        componentProps: {
          placeholder: "业务名称"
        }
      },
      {
        label: "地址：",
        field: "endpoint",
        component: "Input",
        required: true,
        colProps: {span: 10},
        componentProps: {
        }
      },
      {
        label: "端口：",
        field: "port",
        component: "Input",
        required: true,
        colProps: {span: 10, offset: 2},
        componentProps: {
        }
      },
      {
        label: "主题：",
        field: "topic",
        component: "Input",
        required: true,
        colProps: {span: 10},
        componentProps: {
        }
      },
      {
        label: "生产者Id：",
        field: "clientId",
        component: "Input",
        required: true,
        colProps: {span: 10, offset: 2},
        componentProps: {
        },
      },
      {
        label: "消息头：",
        field: "needHeader",
        component: "Select",
        defaultValue: false,
        colProps: {span: 10},
        componentProps: {
          options: [
            {
              label: "携带",
              value: true
            },
            {
              label: "不携带",
              value: true
            }
          ]
        }
      },
      {
        label: "重试次数：",
        field: "retries",
        component: "InputNumber",
        colProps: {span: 10, offset: 2},
        componentProps: {
        }
      },
      {
        label: "发送内容",
        field: "isMsgDiv",
        component: "RadioButtonGroup",
        defaultValue: false,
        colProps: {span: 12},
        componentProps: {
          options: [
            {
              label: "接收到的消息",
              value: false
            },
            {
              label: "自定义消息",
              value: true
            }
          ]
        }
      },
      {
        label: "自定义消息",
        subLabel: "(application/json)",
        field: "divPayload",
        component: "CodeEditor",
        helpMessage: "请输入JSON格式参数",
        colProps: {span: 24},
        componentProps: {
          mode: "application/json",
          lineNumbers: false,
          lineWrapping: true,
          style: {
            width: "100%",
            minHeight: "120px"
          }
        },
        show:  ({ values }) => { return values.isMsgDiv;},
      },
    ]
  },{
    ruleNodeFixId: '400',
    schemas: [
      {
        label: "设备接入节点别名：",
        field: "assetInNodeName",
        component: "Input",
        defaultValue: "设备接入",
        colProps: {span: 22},
        componentProps: {
          placeholder: "业务名称"
        }
      },
      {
        label: "接入网关：",
        field: "assetGatewayId",
        component: "Input",
        colProps: {span: 22},
        componentProps: {
          placeholder: "设备连接的网关地址"
        }
      },
      {
        label: "接入方式：",
        field: "deviceProcessType",
        component: "Select",
        colProps: {span: 18},
        componentProps: {
          options: [
            {
              label: "按设备接入",
              value: "DEVICE"
            },
            {
              label: "按设备分组接入",
              value: "GROUP"
            },
            {
              label: "按物模型接入",
              value: "THINGS"
            }
          ]
        }
      },
      {
        label: "选择设备：",
        field: "deviceId",
        component: "SingleSearchSelect",
        colProps: {span: 18},
        componentProps: {
          placeholder: "选择接入设备",
          api: listDeviceWithPageApi,
          params: {
            disabled: false,
          },
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: false,
          showSearch: true,
        },
        show:  ({ values }) => { return values.deviceProcessType === 'DEVICE';},
      },
      {
        label: "选择设备分组：",
        field: "deviceGroupId",
        component: "SingleSearchSelect",
        colProps: {span: 18},
        componentProps: {
          placeholder: "选择设备分组",
          api: listEntityGroupByPager,
          params: {
            entityType: 'DEVICE',
          },
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: false,
          showSearch: true,
        },
        show:  ({ values }) => { return values.deviceProcessType === 'GROUP';},
      },
      {
        label: "选择物模型：",
        field: "thingsId",
        component: "SingleSearchSelect",
        colProps: {span: 18},
        componentProps: {
          placeholder: "选择设备分组",
          api: listTemplateWithPager,
          params: {
            enabled: 'true',
          },
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: false,
          showSearch: true,
        },
        show:  ({ values }) => { return values.deviceProcessType === 'THINGS';},
      }]
  },{
    ruleNodeFixId: '401',
    schemas:[
      {
        label: "指令下发节点别名：",
        field: "autoControlNodeName",
        component: "Input",
        defaultValue: "指令下发",
        colProps: {span: 22},
        componentProps: {
          placeholder: "业务名称"
        }
      },
      {
        label: "When(满足的条件)",
        subLabel: "(Javascript)",
        field: "commandWhen",
        component: "CodeEditor",
        helpMessage: "采用JS编写满足指令下发的条件",
        colProps: {span: 24},
        defaultValue: "return true;",
        componentProps: {
          mode: "javascript",
          lineNumbers: true,
          lineWrapping: true,
          style: {
            width: "100%",
            minHeight: "150px"
          }
        }
      },
      {
        label: "控制方式：",
        field: "autoControlMethod",
        component: "Select",
        colProps: {span: 11},
        componentProps: {
          options: [
            {
              label: "按设备下发",
              value: "DEVICE"
            },
            {
              label: "按设备分组下发",
              value: "DEVICE_GROUP"
            },
            {
              label: "按物模型下发",
                value: "DEVICE_TEMPLATE"
            }
          ],
          onChange: function (value) {
            autoControlMethod.value = value;
          }
        },
      },
      {
        label: "选择设备：",
        field: "autoControlDeviceId",
        component: "SingleSearchSelect",
        colProps: {span: 10, offset: 1},
        componentProps: {
          placeholder: "选择接入设备",
          api: listDeviceWithPageApi,
          params: {
            disabled: false,
          },
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: false,
          showSearch: true,
          onChange: function (value) {
            autoControlEntityId.value = value;
          }
        },
        show:  ({ values }) => { return values.autoControlMethod === 'DEVICE';},
      },
      {
        label: "选择设备分组：",
        field: "autoControlGroupId",
        component: "SingleSearchSelect",
        colProps: {span: 10, offset: 1},
        componentProps: {
          placeholder: "选择设备分组",
          api: listEntityGroupByPager,
          params: {
            entityType: 'DEVICE',
          },
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: false,
          showSearch: true,
        },
        show:  ({ values }) => { return values.autoControlMethod === 'DEVICE_GROUP';},
      },
      {
        label: "选择物模型：",
        field: "autoControlThingsId",
        component: "SingleSearchSelect",
        colProps: {span: 10, offset: 1},
        componentProps: {
          placeholder: "选择物模型",
          api: listTemplateWithPager,
          params: {
            enabled: 'true',
          },
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: false,
          showSearch: true,
          onChange: function (value) {
            autoControlEntityId.value = value;
          }
        },
        show:  ({ values }) => { return values.autoControlMethod === 'DEVICE_TEMPLATE';},
      },
      {
        label: "指令列表：",
        field: "autoControlCommandList",
        component: 'Input',
        slot: "autoControlList",
      },
      {
        label: "",
        field: "optTips",
        component: "OperationTips",
        colProps: {span: 20},
        componentProps: {
          header: "操作提示:",
          dataSource: [
            "1. 只有当脚本执行结果返回True时，会执行指令的下发",
            "2. 请确保返回的执行结果为True 或者 False",
            "3. 脚本执行可以应用消息流中的数据， 例如 ",
            "      var count = ${msg.payload.count} ",
            "      return count > 5;"
          ]
        }
      }
    ]
  },{
    ruleNodeFixId: '500',
    schemas:[
      {
        label: "Postgres节点别名：",
        field: "pgInNodeName",
        component: "Input",
        defaultValue: "Postgres",
        colProps: {span: 22},
        componentProps: {
          placeholder: "节点业务名称"
        }
      },
      {
        label: "存储位置：",
        field: "isDefaultPostgres",
        component: "RadioButtonGroup",
        colProps: {span: 22},
        defaultValue: 'defaultThings',
        componentProps: {
          options: [
            {
              label: "默认存储",
              value: "defaultThings"
            },
            {
              label: "其他Postgres",
              value: "third"
            },
          ]
        }
      },
      {
        label: "Ip地址：",
        field: "pgHost",
        component: "Input",
        colProps: {span: 16},
        componentProps: {
          placeholder: "postgres连接地址"
        },
        show:  ({ values }) => { return values.isDefaultPostgres === 'third';},
      },
      {
        label: "端口：",
        field: "pgPort",
        component: "Input",
        colProps: {span: 4, offset: 2},
        componentProps: {
          placeholder: "postgres端口"
        },
        show:  ({ values }) => { return values.isDefaultPostgres === 'third';},
      },
      {
        label: "用户名：",
        field: "pgName",
        component: "Input",
        colProps: {span: 11},
        componentProps: {
          placeholder: "用户名"
        },
        show:  ({ values }) => { return values.isDefaultPostgres === 'third';},
      },
      {
        label: "密码：",
        field: "pgPwd",
        component: "InputPassword",
        colProps: { span: 10, offset: 1},
        componentProps: {
          placeholder: ""
        },
        show:  ({ values }) => { return values.isDefaultPostgres === 'third';},
      },
      {
        label: "数据库：",
        field: "pgDatabase",
        component: "Input",
        colProps: {span: 11},
        componentProps: {
          placeholder: "请数据数据存储的数据库名"
        },
        show:  ({ values }) => { return values.isDefaultPostgres === 'third';},
      },
      {
        label: "表前缀：",
        field: "tablePrefix",
        component: "Input",
        defaultValue: "iothings_",
        colProps: {span: 10, offset: 1},
        componentProps: {
          placeholder: "表的前缀"
        },
        show:  ({ values }) => { return values.isDefaultPostgres === 'third';},
      },
      {
        label: "",
        field: "pgOptTips",
        component: "OperationTips",
        colProps: {span: 22},
        componentProps: {
          header: "操作提示:",
          dataSource: [
            "1. 数据格式：请确保msg.payload中的数据为标准的Json 对象",
            "2. 存储格式：按照json对象进行KeyValue方式存储",
          ]
        }
      }
    ]
  },
  {
    ruleNodeFixId: '501',
    schemas:[
      {
        label: "Cassandra别名：",
        field: "cassandraInNodeName",
        component: "Input",
        defaultValue: "cassandra",
        colProps: {span: 22},
        componentProps: {
          placeholder: "业务名称"
        }
      },
      {
        label: "存储位置：",
        field: "cassandraDefault",
        component: "RadioButtonGroup",
        colProps: {span: 22},
        defaultValue: 'systemCassandra',
        componentProps: {
          options: [
            {
              label: "默认存储",
              value: "systemCassandra"
            },
            {
              label: "其他Cassandra",
              value: "thirdCassandra"
            },
          ]
        }
      },
      {
        label: "连接地址：",
        field: "cassandraContactPoints",
        component: "Input",
        colProps: {span: 16},
        componentProps: {
          placeholder: "cassandra连接地址"
        },
        show:  ({ values }) => { return values.cassandraDefault === 'thirdCassandra';},
      },
      {
        label: "连接地址：",
        field: "cassandraPort",
        component: "Input",
        colProps: {span: 4, offset: 2},
        componentProps: {
          placeholder: "cassandra 端口"
        },
        show:  ({ values }) => { return values.cassandraDefault === 'thirdCassandra';},
      },
      {
        label: "用户名：",
        field: "cassandraUsername",
        component: "Input",
        colProps: {span: 11},
        componentProps: {
          placeholder: "cassandra用户名"
        },
        show:  ({ values }) => { return values.cassandraDefault === 'thirdCassandra';},
      },
      {
        label: "密码：",
        field: "cassandraPassword",
        component: "InputPassword",
        colProps: { span: 10, offset: 1},
        componentProps: {
          placeholder: ""
        },
        show:  ({ values }) => { return values.cassandraDefault === 'thirdCassandra';},
      },
      {
        label: "KeySpace：",
        field: "cassandraKeySpace",
        component: "Input",
        colProps: {span: 11},
        componentProps: {
          placeholder: "连接的keySpace"
        },
        show:  ({ values }) => { return values.cassandraDefault === 'thirdCassandra';},
      },
      {
        label: "数据中心：",
        field: "cassandraDataCenter",
        component: "Input",
        colProps: { span: 10, offset: 1},
        componentProps: {
          placeholder: "连接的数据中心，不存在时会自动创建"
        },
        show:  ({ values }) => { return values.cassandraDefault === 'thirdCassandra';},
      },
      {
        label: "副本数量：",
        field: "cassandraReplicator",
        component: "Input",
        colProps: {span: 11},
        componentProps: {
          placeholder: "自动创建keySpace时使用"
        },
        show:  ({ values }) => { return values.cassandraDefault === 'thirdCassandra';},
      },
    ]
  }]

