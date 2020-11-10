<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
			@select="submenuSelect"
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
			items: []
            // items: [
            //     {
            //         icon: 'el-icon-s-home',
            //         index: 'dashboard',
            //         title: '系统首页'
            //     },
            //     {
            //         icon: 'el-icon-s-tools',
            //         index: '4',
            //         title: '系统管理',
            //         subs: [
			// 			{
			// 			    index: 'administrator',
			// 			    title: '管理员列表'
			// 			},
			// 			{
			// 			    index: 'administratorRole',
			// 			    title: '角色管理'
			// 			},
			// 			{
			// 			    index: 'menuList',
			// 			    title: '菜单管理'
			// 			}
            //         ]
            //     }
            // ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
		let menus = JSON.parse(localStorage.getItem('menus'));
		let items = [];
		menus.forEach((item)=>{
			if(item.parentId == 0){
				items.push({
					icon: item.icon,
					id: item.menuId,
					index: item.menuId.toString(),
					title: item.menuName,
					component: item.url,
					subs: []
				})
			}
		})
		menus.forEach((item)=>{
			if(item.parentId != 0){
				items.forEach((i,e)=>{
					if(item.parentId === i.id){
						items[e].subs.push({
							index: item.url,
							title: item.menuName
						})
					}
				})
			}
		})
		items.forEach((item)=>{
			if(item.subs.length === 0){
				item.index = item.component;
				delete item.subs;
			}
		})
		this.items = items;
    },
    methods: {
		submenuSelect(index){
			let fullPath = '/' + index;
			if(this.$route.fullPath === fullPath){
				window.location.reload();
			}
		}
	}
	
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
