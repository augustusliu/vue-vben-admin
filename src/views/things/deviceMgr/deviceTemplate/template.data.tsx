import {BasicColumn, FormSchema} from "/@/components/Table";
import moment from "moment";
import {Tag} from "ant-design-vue";

export const templateColumn: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
    defaultHidden: true,
    width: 50,
  },
  {
    title: '模型名称',
    dataIndex: 'name',
  },
  {
    title: '启用状态',
    dataIndex: 'enabled',
    customRender: ({ record }) => {
      return record.enabled ? <Tag color="lime">启用</Tag> : <Tag color="red">禁用</Tag>;
    },
  },
  {
    title: '模型描述',
    dataIndex: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '修改时间',
    dataIndex: 'modifiedTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.modifiedTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]

export const templateSearchScheme: FormSchema[] = [
  {
    field: 'name',
    label: '模型名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'enabled',
    label: '启用状态',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
  },
]

export const templateAddOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '模型名称',
    show: false,
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'name',
    label: '模型名称',
    component: 'Input',
    required: true,
    colProps: { span: 22 },
  },
  {
    field: 'enabled',
    label: '启用状态',
    component: 'Select',
    required: true,
    defaultValue: true,
    colProps: { span: 22 },
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
  },
  {
    field: 'description',
    label: '模型描述',
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
]


export const templateTabListScheme = [
  {
    key: '1',
    name: '属性',
    component: 'EntityAttributes',
  },
  {
    key: '2',
    name: '指令',
    component: 'EntityCommand',
  },
];

