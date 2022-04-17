import { BasicColumn, FormSchema } from '/@/components/Table';
import moment from "moment";
import {Tag} from "ant-design-vue";
import {listDictionaryByTypeWthParam} from "/@/api/things/dictionary/dictionaryApi";

// 告警查询form
export const alarmSearchFormSchema: FormSchema[] = [
  {
    field: 'alarmName',
    label: '告警名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'dealStatus',
    label: '当前状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '已处理', value: true },
        { label: '未处理', value: false },
      ],
    },
  },
  {
    label: "报警类型：",
    field: "alarmTypeId",
    component: "ApiTreeSelect",
    required: false,
    colProps: {span: 6},
    componentProps: {
      placeholder: "报警类型",
      params: {
        dictionaryType: '报警类型',
      },
      api: listDictionaryByTypeWthParam,
      resultField: 'items',
      replaceFields: {
        title: 'name',
        children: 'children',
        value: 'id',
        key: 'code',
      },
      getPopupContainer: () => document.body,
    }
  },
]


// 未处理结果列表
export const alarmUnDealColumn: BasicColumn[] = [
  {
    title: '告警Id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '名称',
    dataIndex: 'alarmName',
  },
  {
    title: '告警类型',
    dataIndex: 'alarmType',
  },
  {
    title: '处理状态',
    dataIndex: 'dealStatus',
    customRender: ({ record }) => {
      return record.dealStatus ? <Tag color="cyan">已处理</Tag> : <Tag color="purple">未处理</Tag>;
    },
  },
  {
    title: '指定处理人',
    dataIndex: 'belongUserName',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  }
]

// 已处理结果列表
export const alarmDealedColumn: BasicColumn[] = [
  {
    title: '告警Id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '名称',
    dataIndex: 'alarmName',
  },
  {
    title: '告警类型',
    dataIndex: 'alarmType',
  },
  {
    title: '处理状态',
    dataIndex: 'dealStatus',
    customRender: ({ record }) => {
      return record.dealStatus ? <Tag color="cyan">已处理</Tag> : <Tag color="purple">未处理</Tag>;
    },
  },
  {
    title: '指定处理人',
    dataIndex: 'belongUserId',
  },
  {
    title: '实际处理人',
    dataIndex: 'dealUserId',
  },
  {
    title: '处理时间',
    dataIndex: 'dealTime',
    customRender: ({ record }) => {
      return moment(Number(record.dealTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  }
]
