<template>
  <div>
    <CardsTable @register="registerTable"
                @fetch-success="onFetchSuccess"
                :onExpand="handleOnExpand">
<!--      1、定义 toolbar slots，  #toolbar 等价与slot='toolbar'-->
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增物模型 </a-button>
      </template>
<!--      2、定义 action slots,,,  #action 等价与slot='action', 同时 该插槽接收一个参数 record 必须要传递进去参数才可以-->
      <template #action="{ record }" >
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'clarity:info-standard-line',
              tooltip: '物模型详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>

     <!--   3、为CardList定义card的内容  -->
      <template #cardContent="{ record }">
        <TemplateCardContentSlot :dataInfo="record"/>
      </template>

      <!--   4、为CardList定义事件插槽  ， # 是v-slot的简写, 子组件传递的参数都会放入到data中 -->
      <template #cardAction="{ record }">
        <Row style="height: 30px; border-top: 1px solid #f0f0f0">
          <Col :span="8" style="text-align: center;line-height: 30px; border-right: 1px solid #f0f0f0;">
            <EditOutlined style="color:#3076c6" :onClick="handleEdit.bind(null, record)"/>
          </Col>
          <Col :span="8" style="text-align: center; line-height: 30px; border-right: 1px solid #f0f0f0;">
            <InfoCircleOutlined style="color:#3076c6" :onClick="handleView.bind(null, record)"/>
          </Col>
          <Col :span="8" style="text-align: center; line-height: 30px">
            <DeleteOutlined style="color:#3076c6" :onClick="handleDelete.bind(null, record)"/>
          </Col>
        </Row>
      </template>
    </CardsTable>

    <DeviceTemplateModel @register="registerModel" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Row, Col} from 'ant-design-vue';
  import { EditOutlined, InfoCircleOutlined,DeleteOutlined } from '@ant-design/icons-vue';
  import TemplateCardContentSlot from './TemplateCardContentSlot.vue';
  import { BasicTable, useTable, TableAction, CardsTable } from '/@/components/Table';
  import { listTemplateWithPager, delTemplate } from '/@/api/things/asset/templateApi';
  import DeviceTemplateModel from './DeviceTemplateModel.vue';
  import { templateColumn, templateSearchScheme } from './template.data';
  import {useModal} from "/@/components/Modal";
  import {useGo} from "/@/hooks/web/usePage";

  export default defineComponent({
    name: 'EntityGroupManagement',
    components: { BasicTable, DeviceTemplateModel, TableAction, CardsTable, EditOutlined,InfoCircleOutlined,DeleteOutlined,
      TemplateCardContentSlot, Row, Col},
    setup() {
      const go = useGo();
      const [registerModel, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '物模型列表',
        api: listTemplateWithPager,
        columns: templateColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 80,
          schemas: templateSearchScheme,
        },
        showTableSetting: true,
        tableSetting: {
          redo: true,
          size: false,
          setting: false,
          fullScreen: false,
        },
        bordered: true,
        showIndexColumn: true,
        canResize: true, // 调整表格自动高度
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record: record,
          isUpdate: true,
        });
      }

      // 查看详情
      function handleView(record: Recordable){
        go('/template_info/' + record.id );
      }
      async function handleDelete(record: Recordable) {
        await delTemplate(record.id)
        reload();
      }

      function handleSuccess(){
        reload();
      }

      return {
        registerTable,
        registerModel,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleView,

      };
    },
  });
</script>
