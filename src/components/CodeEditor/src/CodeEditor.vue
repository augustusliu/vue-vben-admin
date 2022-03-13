<template>
  <div class="h-full">
    <CodeMirrorEditor
      :value="getValue"
      :mode="mode"
      :readonly="readonly"
      @change="handleValueChange"
    />
  </div>
</template>
<script lang="ts">
  import {computed, defineComponent} from 'vue';
  import CodeMirrorEditor from './codemirror/CodeMirror.vue';
  import { isString } from '/@/utils/is';

  const MODE = {
    JSON: 'application/json',
    html: 'htmlmixed',
    js: 'javascript',
  };

  const props = {
    value: { type: [Object, String] as PropType<Record<string, any> | string> },
    mode: { type: String, default: MODE.JSON },
    readonly: { type: Boolean, default: false },
  };

  export default defineComponent({
    name: 'CodeEditor',
    components: { CodeMirrorEditor },
    props,
    emits: ['change', 'update:value'],
    setup(props, {emit}) {
      const getValue = computed(() => {
        const { value, mode } = props;
        if(value){
          if (mode !== MODE.JSON) {
            return value as string;
          }
          if (isString(props.value)) {
            return value as string;
          }else{
            try {
              return JSON.stringify(JSON.parse(value as string));
            } catch (e) {
              console.log('json format', e)
            }
          }
        }else{
          return '';
        }
      });
      function handleValueChange(v) {
        let result = v;
        if(v){
          if (props.mode === MODE.JSON) {
            try {
              result = (v && isString(v)) ? JSON.stringify(JSON.parse(v)) : JSON.stringify(v)
            }catch (e) {
            }
          }
        }else{
          result = '';
        }
        emit('change', result);
        emit('update:value', result);
      }

      return {
        getValue,
        handleValueChange};
    },
  });
</script>
