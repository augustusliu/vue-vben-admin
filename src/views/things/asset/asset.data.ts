import {BasicColumn, FormSchema} from '/@/components/Table';

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
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
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
