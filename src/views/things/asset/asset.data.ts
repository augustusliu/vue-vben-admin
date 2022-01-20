import {BasicColumn, FormSchema} from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import moment from 'moment'

export const assetColumn: BasicColumn[] = [
  {
    title: '资产id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '资产名称',
    dataIndex: 'name',
  },
  {
    title: '资产编号',
    dataIndex: 'code',
  },
  {
    title: '资产标签',
    dataIndex: 'label',
  },
  {
    title: '创建人',
    dataIndex: 'userId',
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
    title: '修改时间',
    dataIndex: 'modifiedTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.modifiedTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]

// 用于资产详情页信息展示
export const assetInfoScheme: DescItem[] = [
  {
    field: 'id',
    label: '资产ID',
  },
  {
    field: 'name',
    label: '资产名称',
  },
  {
    field: 'code',
    label: '资产编号',
  },
  {
    field: 'userId',
    label: '创建人',
  },
  {
    field: 'tenantName',
    label: '所属租户',
  },
  {
    field: 'customerName',
    label: '所属客户',
  },
  {
    field: 'label',
    label: '资产标签',
  },
  {
    field: 'modifiedTime',
    label: '修改时间',
    render: ( val ) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'createdTime',
    label: '创建时间',
    render: ( val ) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'description',
    label: '资产描述',
  },
]

// 搜索域的字段
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '资产名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '资产编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'label',
    label: '资产标签',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '资产id',
    component: 'Input',
    colProps: { span: 20 },
    show: false,
  },
  {
    field: 'name',
    label: '资产名称',
    component: 'Input',
    colProps: { span: 20 },
    required: true,
    helpComponentProps: {
      text: '必填，长度不超过100个字符'
    },
  },
  {
    field: 'code',
    label: '资产编号',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'label',
    label: '资产标签',
    component: 'AutoComplete',
    colProps: { span: 20 },
  },
  {
    field: 'description',
    label: '资产描述',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]
