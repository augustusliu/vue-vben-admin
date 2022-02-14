import { BasicColumn, FormSchema } from '/@/components/Table';

export const areaColumn: BasicColumn[] = [
  {
    title: '区域名称',
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: '区域编码',
    dataIndex: 'code',
  },
  {
    title: '邮编',
    dataIndex: 'zipCode',
  },
  {
    title: '经度',
    dataIndex: 'longitude',
  },
  {
    title: '纬度',
    dataIndex: 'latitude',
  },
]

export const areaSearchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '区域名称',
    component: 'Input',
    colProps: { span: 10 },
  },
]

export const areaCreateOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '地区名称',
    component: 'Input',
    colProps: { span: 16 },
    required: true,
  },
  {
    field: 'code',
    label: '地区编码',
    component: 'Input',
    colProps: { span: 16 },
    required: true,
  },
  {
    field: 'zipCode',
    label: '地区邮编',
    component: 'Input',
    colProps: { span: 16 },
    required: true,
  },
  {
    field: 'nameEn',
    label: '地区拼音',
    component: 'Input',
    colProps: { span: 16 },
    required: true,
  },
  {
    field: 'longitude',
    label: '地区经度',
    component: 'Input',
    colProps: { span: 16 },
  },
  {
    field: 'latitude',
    label: '地区纬度',
    component: 'Input',
    colProps: { span: 16 },
  },
  {
    field: 'parent',
    label: '父节点',
    colProps: { span: 16 },
    component: 'TreeSelect',
    componentProps: {
      // 用户适配前后端接口数据
      replaceFields: {
        title: 'name',
        key: 'code',
        value: 'code',
      },
      getPopupContainer: () => document.body,
    },

  },
]
