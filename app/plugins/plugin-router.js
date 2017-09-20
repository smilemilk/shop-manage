/**
 * Created by gexuhui on 17/9/20.
 */
import Router from 'vue-router';
import pageRoutes from '../pages';
import layout from '../pages/layout';
import _ from 'lodash';

export default {
    loadRouters(rous, paths, children) {
        if (_.has(rous, 'path')) {
            let ps = _.flattenDeep(paths).filter(p => p);

            if (_.last(ps) === rous.name) {
                ps = _.dropRight(ps);
            }
            if (!children) {
                if (rous.path) {
                    rous.path = _.join(ps, '/') + (rous.path[0] === '/' ? '' : '/') + rous.path;
                } else {
                    rous.path = _.join(ps, '/') + '.html';
                }
            }
            rous.name = _.join(_.concat(ps, [rous.name]), '.');

            if (rous.children) {
                _.each(rous.children, child => this.loadRouters(child, [paths, child.name], true));
                return [rous];
            }
            return [rous];
        }
        if (rous.length) {
            return _.map(rous, r => {
                    return this.loadRouters(r, [paths]);
        });
        } else {
            return _.map(rous, (rou, k) => {
                    return this.loadRouters(rou, [paths, k]);
        });
        }
    },
    install(Vue) {
        let childRouters = _.flattenDeep(this.loadRouters(pageRoutes));

        if (Vue.$config.homePage) {
            let homePage = _.find(childRouters, router => router.name === Vue.$config.homePage);

            homePage && (homePage.path = '/');
        }

        let routes = [{
            path: '/',
            component: layout,
            children: childRouters
        }];

        routes = routes.concat(common);
        Vue.$router = new Router({
            routes: routes,
            mode: Vue.$config.historyMode
        });
    }
};