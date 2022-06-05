import {DescItem} from "/@/components/Description";
import moment from "moment";

export const modelAssetInfoScheme: DescItem[] = [
  {
    field: 'id',
    label: '资产ID',
    span: 11,
  },
  {
    field: 'name',
    label: '资产名称',
    span: 11,
  },
  {
    field: 'code',
    label: '资产编号',
    span: 11,
  },
  {
    field: 'userId',
    label: '创建人',
    span: 11,
  },
  {
    field: 'tenantName',
    label: '所属租户',
    span: 11,
  },
  {
    field: 'customerName',
    label: '所属客户',
    span: 11,
  },
  {
    field: 'modifiedTime',
    label: '修改时间',
    span: 11,
    render: (val) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'createdTime',
    label: '创建时间',
    span: 11,
    render: (val) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'description',
    label: '资产描述',
    span: 22,
  },
]
