import { BasicColumn, FormSchema } from '/@/components/Table';
import moment from "moment";
import {Tag} from "ant-design-vue";
import {searchModelList} from "/@/api/things/baseData/modelApi";


// 模型列表
export const modelsColumns: BasicColumn[] = [
  {
    title: '模型Id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '物模型Id',
    dataIndex: 'parentId',
    defaultHidden: true,
  },
  {
    title: '模型名称',
    dataIndex: 'modelName',
    align: 'left',
  },
  {
    title: '模型路径',
    dataIndex: 'modelPath',
  },
  {
    title: '主模型',
    dataIndex: 'isMain',
    customRender: ({ record }) => {
      return record.isMain ? <Tag color="lime">主模型</Tag> : <Tag color="cyan">子模型</Tag>;
    },
  },
  {
    title: '启用',
    dataIndex: 'isEnabled',
    customRender: ({ record }) => {
      return record.isEnabled ? <Tag color="lime">启用</Tag> : <Tag color="cyan">停用</Tag>;
    },
  },
  {
    title: '父模型',
    dataIndex: 'parentName',
  },
  {
    title: '与资产同步',
    dataIndex: 'boolean',
    customRender: ({ record }) => {
      return record.syncAsset ? <Tag color="lime">已同步</Tag> : <Tag color="cyan">未同步</Tag>;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.createTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'modelName',
    label: '模型名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'isMain',
    label: '模型类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '主模型', value: true },
        { label: '子模型', value: false },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'isEnabled',
    label: '是否启用',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
    colProps: { span: 6 },
  },
]

export const modelUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '模型Id',
    component: 'Input',
    show: false,
    colProps: { span: 20 },
  },
  {
    field: 'modelName',
    label: '模型名称',
    component: 'Input',
    colProps: { span: 20 },
    componentProps:{
      disabled: true
    }
  },
  {
    field: 'modelPath',
    label: '模型路径',
    component: 'Input',
    colProps: { span: 20 },
    componentProps:{
      disabled: true
    }
  },
  {
    field: 'parentId',
    label: '父模型',
    colProps: { span: 20 },
    component: 'ApiSelect',
    componentProps: {
      params:{isMain:true},
      api: searchModelList,
      labelField: 'modelName',
      valueField: 'id',
      resultField: 'items',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'isMain',
    label: '模型类型',
    colProps: { span: 20 },
    component: 'RadioButtonGroup',
    defaultValue: false,
    required: true,
    componentProps: {
      options: [
        { label: '主模型', value: true },
        { label: '子模型', value: false },
      ],
    },
  },
  {
    field: 'isEnabled',
    label: '有效性',
    colProps: { span: 20 },
    component: 'RadioButtonGroup',
    defaultValue: false,
    required: true,
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '停用', value: false },
      ],
    },
  },
]



