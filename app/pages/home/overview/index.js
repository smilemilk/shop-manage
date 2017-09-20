/**
 * Created by gexuhui on 17/9/20.
 */
export default {
    path: '/overview.html',
    name: 'overview',
    component: () => import(/* webpackChunkName: "home.overview" */'./overview'),
};
