import {BasicColumn, FormSchema} from '/@/components/Table';
import moment from "moment";

// 指令列表
export const commandColumn: BasicColumn[] = [

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
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]

// 指令创建form
export const createOrUpdateCommandSchema: FormSchema[] = [
  {
    field: 'id',
    label: '指令id',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'name',
    label: '指令名称',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'code',
    label: '指令编码',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'valueType',
    label: '指令值类型',
    component: 'Select',
    defaultValue: 'STR_V',
    componentProps: {
      options: [
        { label: '布尔型', value: 'BOOL_V' },
        { label: '长整形', value: 'LONG_V' },
        { label: '浮点型', value: 'DOUBLE_V' },
        { label: '字符型', value: 'STR_V' },
        { label: 'JSON', value: 'JSON_V' },
      ],
    },
    colProps: { span: 22 },
  },
]
