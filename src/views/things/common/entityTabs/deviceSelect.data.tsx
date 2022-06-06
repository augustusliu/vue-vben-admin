import {BasicColumn} from "/@/components/Table";
import {Tag} from "ant-design-vue";

export const selectDeviceColumn: BasicColumn[] = [
  {
    title: '设备id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '设备名称',
    dataIndex: 'name',
  },
  {
    title: '设备编号',
    dataIndex: 'code',
  },
  {
    title: '传输协议',
    dataIndex: 'transportType',
  },
  {
    title: '网关设备',
    dataIndex: 'isGateway',
    customRender: ({ record }) => {
      return record.isGateway ? <Tag color="cyan">网关设备</Tag> : <Tag color="purple">普通设备</Tag>;
    },
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
];
