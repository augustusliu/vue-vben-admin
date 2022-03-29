<template>
  <Select
    @dropdownVisibleChange="handleFetch"
    v-bind="attrs"
    @change="handleChange"
    @search="handleSearch"
    :showSearch="true"
    :showArrow="false"
    :filterOption="false"
    :options="getOptions"
    v-model:value="state"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, computed, unref, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { get, omit } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { propTypes } from '/@/utils/propTypes';

  type OptionsItem = { label: string; value: string; disabled?: boolean };

  export default defineComponent({
    name: 'SingleSearchSelect',
    components: {
      Select,
      LoadingOutlined,
    },
    inheritAttrs: false,
    props: {
      value: propTypes.oneOfType([
        propTypes.object,
        propTypes.number,
        propTypes.string,
        propTypes.array,
      ]),
      numberToString: propTypes.bool,
      api: {
        type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
        default: null,
      },
      // api params
      params: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      // support xxx.xxx.xx
      resultField: propTypes.string.def('items'),
      labelField: propTypes.string.def('labelField'),
      valueField: propTypes.string.def('valueField'),
      immediate: propTypes.bool.def(true),
    },
    emits: ['options-change', 'change'],
    setup(props, { emit }) {
      const options = ref<OptionsItem[]>([]);
      const loading = ref(false);
      const isFirstLoad = ref(true);
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const { t } = useI18n();

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      const getOptions = computed(() => {
        const { labelField, valueField, numberToString } = props;

        return unref(options).reduce((prev, next: Recordable) => {
          if (next) {
            const value = next[valueField];
            prev.push({
              label: next[labelField],
              value: numberToString ? `${value}` : value,
              ...omit(next, [labelField, valueField]),
            });
          }
          return prev;
        }, [] as OptionsItem[]);
      });

      watchEffect(() => {
        props.immediate && fetch(props.params);
      });

      watch(
        () => props.params,
        () => {
          !unref(isFirstLoad) && fetch(props.params);
        },
        { deep: true }
      );


      // 这里的bug,未替换对应的字段名称
      async function fetch(params: any) {
        const api = props.api;
        if (!api || !isFunction(api)) return;
        options.value = [];
        try {
          loading.value = true;
          const res = await api(params);

          if (Array.isArray(res)) {
            options.value = formatData(res);
            emitChange();
            return;
          }
          if (props.resultField) {
            options.value = formatData(get(res, props.resultField)) || [];
          }
          emitChange();
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      async function handleFetch() {
        if (!props.immediate && unref(isFirstLoad)) {
          await fetch(props.params);
          isFirstLoad.value = false;
        }
      }

      function emitChange() {
        emit('options-change', unref(getOptions));
      }

      function handleChange(_, ...args) {
        emitData.value = args;
      }

      function handleSearch(value: any){
        const params = props.params;
        params.name = value;
        fetch(params);
      }

      // 格式化数据
      function formatData(records: any[]): OptionsItem[]{
        if(!records || records.length <= 0){
          return [] as OptionsItem[];
        }
        const data: OptionsItem[] = [];
        records.forEach(item => {
          data.push({
            label: item[props.labelField],
            value:  item[props.valueField],
          })
        })
        return data;
      }


      return { state, attrs, getOptions, loading, t, handleFetch, handleChange, handleSearch };
    },
  });
</script>
