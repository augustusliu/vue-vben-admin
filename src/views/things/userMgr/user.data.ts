import { BasicColumn, FormSchema } from '/@/components/Table';
import moment from "moment";

export const userColumn: BasicColumn[] = [
  {
    title: '用户id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '租户id',
    dataIndex: 'tenantId',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '客户id',
    dataIndex: 'customerId',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '用户名称',
    dataIndex: 'username',
  },
  {
    title: '所属租户',
    dataIndex: 'tenantName',
  },
  {
    title: '所属客户',
    dataIndex: 'customerName',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '真实名称',
    dataIndex: 'realName',
  },
  {
    title: '描述',
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
    title: '更新时间',
    dataIndex: 'modifiedTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.modifiedTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '用户名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'realName',
    label: '真实姓名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    colProps: { span: 8 },
  },
];

// 创建用户
export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '用户id',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'username',
    label: '用户名',
    required: true,
    component: 'Input',
    colProps: { span: 11 },
    componentProps: {
      placeholder: '请输入用户名',
    },
  },
  {
    field: 'realName',
    label: '真实名称',
    required: true,
    component: 'Input',
    colProps: { span: 11 },
    componentProps: {
      placeholder: '用户真实姓名',
    },
  },
  {
    field: 'phone',
    label: '手机号码',
    required: true,
    component: 'Input',
    colProps: { span: 11 },
    componentProps: {
      placeholder: '用户手机号码',
    },
  },
  {
    field: 'email',
    label: '邮箱地址',
    required: true,
    component: 'Input',
    colProps: { span: 11 },
    componentProps: {
      placeholder: '邮箱地址',
    },
  },
  {
    field: 'description',
    label: '描述',
    component: 'InputTextArea',
    colProps: { span: 22 },
    componentProps: {
      placeholder: '用户描述信息',
    },
  },
  {
    field: 'avatar',
    label: '用户头像',
    component: 'Input',
    colProps: { span: 22 },
  },
];
