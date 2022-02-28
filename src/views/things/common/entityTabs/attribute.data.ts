import {BasicColumn, FormSchema} from '/@/components/Table';
import moment from "moment";

export const attributeColumn: BasicColumn[] = [
  {
    title: '属性id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '设备名称',
    dataIndex: 'entityName',
  },
  {
    title: '属性名称',
    dataIndex: 'name',
  },
  {
    title: '属性编码',
    dataIndex: 'code',
  },
  {
    title: '读写类型',
    dataIndex: 'readWrite',
    customRender: ({ record }) => {
      if (record.readWrite === 'READ_ONLY') {
        return '只读';
      } else if (record.readWrite === 'WRITE_ONLY') {
        return '只写';
      } else if (record.readWrite === 'READ_WRITE') {
        return '读写';
      }
      return 'NaN';
    }
  },
  {
    title: '属性类型',
    dataIndex: 'attributeScope',
    customRender: ({ record }) => {
      if(record.attributeScope === 'STATIC'){
        return '固有属性';
      }else if(record.attributeScope === 'TELEMETRY'){
        return '上传属性';
      }
      return 'Nan';
    }
  },
  {
    title: '属性值类型',
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
    title: '创建时间',
    dataIndex: 'createdTime',
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]

export const createOrUpdateAttrSchema: FormSchema[] = [
  {
    field: 'id',
    label: '资产Id',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'name',
    label: '属性名称',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'code',
    label: '属性编码',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'attributeScope',
    label: '属性类型',
    component: 'Select',
    defaultValue: 'TELEMETRY',
    componentProps: {
      options: [
        { label: '固有属性', value: 'STATIC' },
        { label: '上传属性', value: 'TELEMETRY' },
      ],
    },
    colProps: { span: 22 },
  },
  {
    field: 'readWrite',
    label: '读写类型',
    component: 'Select',
    defaultValue: 'READ_WRITE',
    componentProps: {
      options: [
        { label: '只读', value: 'READ_ONLY' },
        { label: '只写', value: 'WRITE_ONLY' },
        { label: '读写', value: 'READ_WRITE' },
      ],
    },
    colProps: { span: 22 },
  },
  {
    field: 'valueType',
    label: '属性值类型',
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
];
