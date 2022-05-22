import type { App } from 'vue';
import { Button } from './Button';
import {
  Input,
  Layout,
} from 'ant-design-vue';

export function registerGlobComp(app: App) {
  // compList.forEach((comp) => {
  //   app.component(comp.name || comp.displayName, comp);
  // });

  app.use(Input).use(Button).use(Layout);
}
