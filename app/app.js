/**
 * Created by gexuhui on 17/9/20.
 */
import Vue from 'vue';
import App from './pages/app';
import yohoPluginRouter from './plugins/yoho-plugin-router';

Vue.use(yohoPluginRouter);

Vue.render({
    el: '#app',
    template: '<App/>',
    components: {App}
});
