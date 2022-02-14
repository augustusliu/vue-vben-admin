import { BasicColumn, FormSchema } from '/@/components/Table';

export const industryColumn: BasicColumn[] = [
  {
    title: '行业名称',
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: '行业编码',
    dataIndex: 'code',
  },
]

export const industrySearchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '行业名称',
    component: 'Input',
    colProps: { span: 11 },
  },
]

export const industryCreateOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '行业名称',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'code',
    label: '行业编码',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'parentCode',
    label: '父节点',
    colProps: { span: 24 },
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
