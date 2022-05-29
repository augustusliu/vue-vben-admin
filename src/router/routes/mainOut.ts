/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '/@/router/types';
import {t} from "/@/hooks/web/useI18n";

// test--- 位于主框架外的页面
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  {
    path: '/main-out',
    name: 'MainOut',
    component: () => import('/@/views/demo/main-out/index.vue'),
    meta: {
      title: 'MainOut',
      ignoreAuth: true,
    },
  },
  {
    path: '/dt_child/:id',
    name: 'ThreeModelDetail',
    component: () => import('/@/views/dashboard/threeModel/ThreeChildModel.vue'),
    meta: {
      title: t('routes.dashboard.digitalTwinChild'),
    },
  }
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
