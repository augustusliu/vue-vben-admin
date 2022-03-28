import {BasicColumn, FormSchema} from "/@/components/Table";
import moment from "moment";
import {Tag} from "ant-design-vue";

export const authorityColumn: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色编码',
    dataIndex: 'code',
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    customRender: ({ record }) => {
      return record.enabled ? <Tag color="gold">启用</Tag> : <Tag color="red">禁用</Tag>;
    },
  },
  {
    title: '系统角色',
    dataIndex: 'systemDefault',
    customRender: ({ record }) => {
      return record.systemDefault ? <Tag color="purple">系统默认</Tag> : <Tag color="cyan">用户定义</Tag>;
    },
  },
  {
    title: '角色描述',
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


export const authoritySearchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'enabled',
    label: '状态',
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

export const createOrUpdateAuthorityFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '权限id',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'name',
    label: '权限名称',
    component: 'Input',
    colProps: { span: 22 },
    required: true,
    componentProps: {
      placeholder: '角色编码,长度不能30字符',
    },
  },
  {
    field: 'code',
    label: '权限编码',
    component: 'Input',
    colProps: { span: 11 },
    required: true,
    componentProps: {
      placeholder: '角色编码,长度不能20字符',
    },
  },
  {
    field: 'enabled',
    label: '状态',
    component: 'RadioButtonGroup',
    colProps: { span: 11 },
    defaultValue: true,
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
  },
  {
    field: 'description',
    label: '权限描述',
    component: 'InputTextArea',
    colProps: { span: 22 },
    componentProps: {
      placeholder: '角色描述，最大长度不得超过200个字符',
    },
  },
  // 采用插槽渲染
  {
    label: ' ',
    field: 'menus',
    slot: 'roleMenu',
    component: 'Input',
    required: true,
    colProps: { span: 18 },
  },
]
