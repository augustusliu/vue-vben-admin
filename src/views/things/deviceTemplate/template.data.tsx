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
    title: '是否启用',
    dataIndex: 'enabled',
    customRender: ({ record }) => {
      return record.enabled ? <Tag color="lime">启用</Tag> : <Tag color="red">禁用</Tag>;
    },
  },
  {
    title: '模型描述',
    dataIndex: 'desc',
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
    label: '是否启用',
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
    field: 'name',
    label: '模型名称',
    component: 'Input',
    required: true,
    colProps: { span: 11 },
  },
  {
    field: 'enabled',
    label: '启用',
    component: 'Select',
    required: true,
    defaultValue: true,
    colProps: { span: 11 },
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
  },
  {
    field: 'desc',
    label: '模型描述',
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
]
