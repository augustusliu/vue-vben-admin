import {BasicColumn} from "/@/components/Table";
import moment from "moment";

export const commandColumnWithDevice: BasicColumn[] = [

  {
    title: '属性id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '设备Id',
    dataIndex: 'entityId',
    defaultHidden: true,
  },
  {
    title: '设备名称',
    dataIndex: 'entityName',
  },
  {
    title: '指令名称',
    dataIndex: 'name',
  },
  {
    title: '指令编码',
    dataIndex: 'code',
  },
  {
    title: '属性值',
    dataIndex: 'lastValue',
  },
  {
    title: '上传时间',
    dataIndex: 'lastValueTs',
    width:200,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss.SSS');
    },
  },
  {
    title: '值类型',
    dataIndex: 'valueType',
    customRender: ({ record }) => {
      if(record.valueType === 'BOOL_V'){
        return '真假';
      }else if(record.valueType === 'LONG_V'){
        return '长整形';
      }else if(record.valueType === 'DOUBLE_V'){
        return '浮点型';
      }else if(record.valueType === 'STR_V'){
        return '字符型';
      }else if(record.valueType === 'JSON_V'){
        return 'JSON';
      }
      return 'Nan';
    }
  },
  {
    title: '来源',
    dataIndex: 'commandSrc',
    customRender: ({ record }) => {
      if (record.commandSrc === 'CREATED') {
        return '用户定义';
      } else if (record.commandSrc === 'THINGS') {
        return '物模型';
      } else if (record.commandSrc === 'TRANSPORT') {
        return '设备声明';
      }
      return 'NaN';
    }
  },
]

export const commandColumnWithoutDevice: BasicColumn[] = [

  {
    title: '属性id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '指令名称',
    dataIndex: 'name',
  },
  {
    title: '指令编码',
    dataIndex: 'code',
  },
  {
    title: '属性值',
    dataIndex: 'lastValue',
  },
  {
    title: '上传时间',
    dataIndex: 'lastValueTs',
    width:200,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss.SSS');
    },
  },
  {
    title: '值类型',
    dataIndex: 'valueType',
    customRender: ({ record }) => {
      if(record.valueType === 'BOOL_V'){
        return '真假';
      }else if(record.valueType === 'LONG_V'){
        return '长整形';
      }else if(record.valueType === 'DOUBLE_V'){
        return '浮点型';
      }else if(record.valueType === 'STR_V'){
        return '字符型';
      }else if(record.valueType === 'JSON_V'){
        return 'JSON';
      }
      return 'Nan';
    }
  },
  {
    title: '来源',
    dataIndex: 'commandSrc',
    customRender: ({ record }) => {
      if (record.commandSrc === 'CREATED') {
        return '用户定义';
      } else if (record.commandSrc === 'THINGS') {
        return '物模型';
      } else if (record.commandSrc === 'TRANSPORT') {
        return '设备声明';
      }
      return 'NaN';
    }
  },
]
