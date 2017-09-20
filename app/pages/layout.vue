<template>
    <Row type="flex" class-name="layout" :class="layoutClass">
        <Col :span="6" class="layout-menu-left" :class="{'print-hide': printHide}">
        <purview-menu :class="menuClass"></purview-menu>
        </Col>
        <Col :span="18" class="layout-menu-right">
        <layout-user-info @menu-trigger="menuTrigger" :class="userClass" @shop-change="shopChange"></layout-user-info>
        <div class="layout-breadcrumb" :class="{'print-hide': printHide}">
            <breadcrumbs @menu-trigger="menuTrigger" :class="breadClass"></breadcrumbs>
        </div>
        <div class="layout-content" >
            <router-view v-if="reload"></router-view>
        </div>
        <div class="layout-copy" :class="{'print-hide': printHide}">
            Copyright &copy; 2017-2020 YOHO集团 All rights reserved
        </div>
        </Col>
    </Row>
</template>

<script>
    import cache from 'util/cache';

    export default {
        name: 'layout',
        data() {
            return {
                printHide: false,
                layoutClass: {
                    collapse: false
                },
                menuClass: {
                    'menu-collapse': false
                },
                breadClass: {
                    'bread-collapse': false
                },
                userClass: {
                    'user-collapse': false,
                    'print-hide': false
                },
                reload: true
            };
        },
        created() {
            this.$root.$on('layout-print', () => {
                this.printHide = true;
            this.userClass['print-hide'] = true;
            this.layoutClass.print = true;
        });
        },
        methods: {
            menuTrigger() {
                this.menuClass['menu-collapse'] = !this.menuClass['menu-collapse'];
                this.userClass['user-collapse'] = !this.userClass['user-collapse'];
                this.breadClass['bread-collapse'] = !this.breadClass['bread-collapse'];
                this.layoutClass.collapse = !this.layoutClass.collapse;
                setTimeout(() => {
                    let evtStart = document.createEvent('UIEvent');

                evtStart.initUIEvent('resize', true, true);
                window.dispatchEvent(evtStart);
            }, 500);
            },
            shopChange() {
                cache.clear();
                this.reload = false;
                this.$nextTick(() => {
                    this.reload = true;
            });
            },
        },
        watch: {
            $route() {
                document.querySelector('.layout-content').scrollTop = 0;
            }
        }
    };
</script>

<style lang="scss">
    $menuBg: #495060;

    body {
        color: #444;
    }

    .layout {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        min-width: 1200px;

    .print-hide {
        display: none;
    }

    &.print {
    .layout-content {
        overflow: auto;
    }
    }

    &.collapse {
    .layout-menu-left {
        width: 50px;
        min-width: initial;
    }
    }

    .layout-menu-left {
        background: $menuBg;
        min-width: 170px;
        max-width: 200px;
    }

    .layout-menu-right {
        flex: auto;
        display: flex;
        flex-flow: column;

    .layout-breadcrumb {
        padding: 10px 15px;
    }

    .layout-content {
        min-height: 200px;
        padding: 25px;
        padding-top: 10px;
        overflow-y: scroll;
        background: #fff;
        border-radius: 4px;
        flex: auto;
        position: relative;
    }

    .layout-copy {
        text-align: center;
        padding: 5px;
        color: #9ea7b4;
    }
    }

    .clear-fixed {
        clear: both;
    }
    }

    .layout-menu-left {
        transition: width 0.1s ease-in-out;
    }

    .layout-logo-left {
        width: 90%;
        height: 30px;
        border-radius: 3px;
        background-image: url(../statics/images/logo.png);
        background-repeat: no-repeat;
        margin: 15px auto;
    }

    .layout-ceiling-main a {
        color: #9ba7b5;
    }

    .layout-hide-text .layout-text {
        display: none;
    }

    .iconfont {
        display: initial !important;
    }

    div[contenteditable] {
    img {
        vertical-align: bottom;
    }
    }

    .table-header {
        border-bottom: 1px solid #e3e8ee;
        background-color: #f5f7f9;

    td {
        background-color: #f5f7f9;
        white-space: nowrap;
        overflow: hidden;
        font-weight: bold;
        text-align: center;
    }
    }

</style>