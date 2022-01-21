import { BasicColumn, FormSchema } from '/@/components/Table';
import moment from "moment";

export const deviceTableColumn: BasicColumn[] = [
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
      return record.isGateway ? '设备网关' : '非网关设备';
    },
  },
  {
    title: '标签',
    dataIndex: 'label',
  },
  {
    title: '所属用户',
    dataIndex: 'userId',
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
];

export const deviceSearchScheme: FormSchema[] = [
  {
    field: 'name',
    label: '设备名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '设备编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'label',
    label: '标签',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'isGateway',
    label: '网关设备',
    component: 'Select',
    componentProps: {
      options: [
        { label: '网关设备', value: true },
        { label: '非网关设备', value: false },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '传输协议',
    field: 'transportType',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'HTTP', value: 'HTTP' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'CoAP', value: 'CoAP' },
        { label: 'ModBus', value: 'ModBus' },
        { label: 'ZigBee', value: 'ZigBee' },
        { label: 'LoRaWAN', value: 'LoRaWAN' },
        { label: 'BACNet', value: 'BACNet' },
        { label: 'CAN', value: 'CAN' },
        { label: 'BLE', value: 'BLE' },
        { label: 'OPC_UA', value: 'OPC_UA' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '设备id',
    component: 'Input',
    colProps: { span: 20 },
    show: false,
  },
  {
    field: 'name',
    label: '设备名称',
    component: 'Input',
    colProps: { span: 10 },
    required: true,
    helpComponentProps: {
      text: '必填，长度不超过100个字符'
    },
  },
  {
    field: 'code',
    label: '设备编号',
    component: 'Input',
    required: true,
    colProps: { span: 10 },
  },
  {
    field: 'label',
    label: '设备标签',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'isGateway',
    label: '网关设备',
    component: 'Select',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '网关设备', value: true },
        { label: '非网关设备', value: false },
      ],
    },
    colProps: { span: 20 },
  },
  {
    field: 'transportType',
    label: '传输协议',
    component: 'Select',
    defaultValue: 'HTTP',
    componentProps: {
      options: [
        { label: 'HTTP', value: 'HTTP' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'CoAP', value: 'CoAP' },
        { label: 'ModBus', value: 'ModBus' },
        { label: 'ZigBee', value: 'ZigBee' },
        { label: 'LoRaWAN', value: 'LoRaWAN' },
        { label: 'BACNet', value: 'BACNet' },
        { label: 'CAN', value: 'CAN' },
        { label: 'BLE', value: 'BLE' },
        { label: 'OPC_UA', value: 'OPC_UA' },
      ],
    },
    colProps: { span: 20 },
  },

  {
    field: 'description',
    label: '设备描述',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]
