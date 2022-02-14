import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import moment from "moment";
import { listAllDevices } from '/@/api/things/device/deviceApi';
import {Tag} from "ant-design-vue";
import {h} from "vue";
import {SvgIcon} from "/@/components/Icon";

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
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(SvgIcon, { name: record.icon});
    },
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
    title: '标签',
    dataIndex: 'label',
    customRender: ({ record }) => {
      if(record.label != null && record.label.length > 0){
        let re = [];
        // @ts-ignore
        record.label.forEach(label => re.push(<Tag color="#87d068" style={"margin-right:3px"}> { label } </Tag>));
        return re;
      }
      return null;
    },
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
        { label: '普通设备', value: false },
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
    colProps: { span: 11 },
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
    colProps: { span: 11 },
  },
  {
    field: 'icon',
    label: '设备图标',
    required: true,
    component: 'IconPicker',
    componentProps: {
      mode: 'svg',
    },
    colProps: { span: 20 },
  },
  {
    field: 'label',
    label: '设备标签',
    component: 'Select',
    colProps: { span: 20 },
    componentProps: {
      mode: 'tags',
      placeholder: '请输入资产标签',
    },
  },
  {
    field: 'transportType',
    label: '传输协议',
    component: 'Select',
    required: true,
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
    colProps: { span: 11 },
  },
  {
    field: 'isGateway',
    label: '网关设备',
    component: 'Select',
    required: true,
    defaultValue: false,
    componentProps: {
      options: [
        { label: '网关设备', value: true },
        { label: '普通设备', value: false },
      ],
    },
    colProps: { span: 11 },
  },
  {
    field: 'parentId',
    label: '父设备',
    component: 'ApiSelect',
    colProps: { span: 20 },
    componentProps: {
      api: listAllDevices,
      params: {
        name: '',
        isGateway: true,
      },
      resultField: 'items',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
      immediate: false,
      showSearch: true,
    },
    show: ({ values }) => {
      return !values.isGateway;
    },
  },
  {
    field: 'description',
    label: '设备描述',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]

// 设备详情页描述信息
export const deviceDetailInfoScheme: DescItem[] = [
  {
    field: 'id',
    label: '设备ID',
  },
  {
    field: 'name',
    label: '设备名称',
  },
  {
    field: 'code',
    label: '设备编号',
  },
  {
    field: 'userId',
    label: '创建人',
  },
  {
    field: 'transportType',
    label: '传输协议',
  },
  {
    field: 'isGateway',
    label: '网关设备',
    render: ( val ) => {
      return val ? '设备网关' : '普通设备';
    },
  },
  {
    field: 'label',
    label: '设备标签',
    render: ( val ) => {
      return <Tag color="#87d068"> {val} </Tag>;;
    },
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
