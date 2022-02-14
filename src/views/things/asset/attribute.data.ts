import {BasicColumn} from '/@/components/Table';
import moment from "moment";

export const attributeColumn: BasicColumn[] = [
  {
    title: '属性id',
    dataIndex: 'id',
    defaultHidden: true,
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
  },
  {
    title: '属性类型',
    dataIndex: 'attributeScope',
  },
  {
    title: '属性值类型',
    dataIndex: 'valueType',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]
