import { BasicColumn, FormSchema } from '/@/components/Table';
import moment from "moment";


// 模型列表
export const modelsColumns: BasicColumn[] = [
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
    edit: true,
    editComponent: 'Select',
    editComponentProps: {
      options: [
        {
          label: '主模型',
          value: true,
        },
        {
          label: '子模型',
          value: false,
        },
      ],
    },
  },
  {
    title: '启用',
    dataIndex: 'isEnabled',
    edit: true,
    editComponent: 'Select',
    editComponentProps: {
      options: [
        {
          label: '启用',
          value: true,
        },
        {
          label: '禁用',
          value: false,
        },
      ],
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
    colProps: { span: 8 },
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
    colProps: { span: 8 },
  },
]



