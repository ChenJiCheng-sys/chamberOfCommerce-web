<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i :class="crumbs.icon"></i> {{crumbs.name}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-button
				    type="primary"
				    icon="el-icon-plus"
				    class="mgr20"
				    @click="visibleTitle='新增菜单';addVisible=true;form={};"
				>新增菜单</el-button>
                <el-input v-model="query.search" placeholder="输入搜索内容" class="handle-input mgr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
				stripe
				default-expand-all
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
				row-key="menuId"
				:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
                <el-table-column prop="menuName" label="菜单名" width="180"></el-table-column>
                <el-table-column label="菜单图标" align="center" width="120">
                    <template slot-scope="scope">
						<i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="路由组件" width="180"></el-table-column>
                <el-table-column label="菜单类型">
					<template slot-scope="scope">
						{{scope.row.menuType === 'M' ? '目录' : scope.row.menuType === 'C' ? '菜单' : '按钮'}}
					</template>
				</el-table-column>
                <el-table-column prop="orderNum" label="排序" width="120"></el-table-column>
                <el-table-column label="是否隐藏" width="120">
					<template slot-scope="scope">
						<el-switch
							disabled
							v-model="scope.row.visible == '1' ? true : false">
						</el-switch>
					</template>
				</el-table-column>
                <el-table-column prop="remark" label="备注" width="180"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
				<el-table-column label="操作" width="120" align="center" fixed="right">
				    <template slot-scope="scope">
				        <el-button
				            type="text"
				            icon="el-icon-edit"
				            @click="handleEdit(scope.$index, scope.row)"
				        >编辑</el-button>
						<el-button
						    type="text"
						    icon="el-icon-delete"
						    class="red"
						    @click="handleDelete(scope.$index, scope.row)"
							v-if="scope.row.children.length === 0"
						>删除</el-button>
				    </template>
				</el-table-column>
            </el-table>
        </div>
		
		<el-dialog :title="visibleTitle" :visible.sync="addVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
		    <el-form ref="form" :model="form" label-width="80px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="菜单名">
							<el-input v-model="form.menuName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="路由组件">
							<el-input v-model="form.url"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="菜单图标">
							<el-select v-model="form.icon" placeholder="请选择图标">
							    <el-option
							      v-for="item in iconList"
							      :key="item"
							      :label="item"
							      :value="item">
							      <i :class="item"></i>
							    </el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="菜单类型">
							<el-select v-model="form.menuType" clearable placeholder="选择类型">
								<el-option key="1" label="目录" value="M"></el-option>
								<el-option key="2" label="菜单" value="C"></el-option>
								<el-option key="3" label="按钮" value="F"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级菜单">
							<el-select v-model="form.parentId" clearable placeholder="选择菜单">
								<el-option v-for="(item, index) in menus" :key="index" :label="item.menuName" :value="item.menuId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序">
							<el-input v-model="form.orderNum"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注">
							<el-input v-model="form.remark"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="菜单状态">
					  		<el-switch v-model="form.visible"></el-switch>
					  	</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveMenu">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import { getMenu, createMenu, deleteMenu, updateMenu } from '../../api/menu.js';
const icons = require('../../utils/icons.js');

export default {
    name: 'menuList',
    components: {

    },
    data() {
        return {
            query: {
				search: '',
                pageIndex: 1,
                pageSize: 10000,
				total: 0
            },
            tableData: [],
			
			addVisible: false,
			visibleTitle: '新增菜单',
			form: {},
			
			menus: [],
			
			iconList: icons.iconList
        }
    },
    created() {
		this.setCrumbs();
        this.getData();
    },
    methods: {
		setCrumbs(){
			let menus = JSON.parse(localStorage.getItem('menus'));
			menus.forEach((item)=>{
				if(item.url == this.$route.matched[1].components.default.name){
					this.crumbs = { name: item.menuName, icon: item.icon }
				}
			})
		},
        // 获取数据
        getData() {
			getMenu({
				pageNum: this.query.pageIndex,
				pageSize: this.query.pageSize,
				menuBelong: 1,
				keyword: this.query.search
			}).then((res)=>{
				let list = res.data.list;
				list.sort(function(a,b){
					return a.orderNum - b.orderNum;
				})
				let menus = [];
				let tableData = [];
				list.forEach((item)=>{
					if(item.parentId == 0){
						menus.push(item)
						item.children = [];
						tableData.push(item)
					}
				})
				this.menus = menus;
				list.forEach((item)=>{
					if(item.parentId != 0){
						tableData.forEach((i,e)=>{
							if(item.parentId == i.menuId){
								item.children = [];
								tableData[e].children.push(item)
							}
						})
					}
				})
				console.log(JSON.stringify(tableData))
				this.tableData = tableData;
			})
        },
		saveMenu() {
			if(this.visibleTitle === '新增菜单'){
				createMenu({
					menuBelong: 1,
					menuName: this.form.menuName,
					visible: this.form.visible ? 1 : 0,
					url: this.form.url,
					icon: this.form.icon,
					menuType: this.form.menuType,
					parentId: this.form.parentId ? this.form.parentId : 0,
					orderNum: Number(this.form.orderNum),
					remark: this.form.remark
				}).then((res)=>{
					this.addVisible = false;
					this.$message.success('新增成功');
					this.getData();
				})
			}else{
				updateMenu({
					menuId: this.form.menuId,
					menuName: this.form.menuName,
					visible: this.form.visible ? 1 : 0,
					url: this.form.url,
					icon: this.form.icon,
					menuType: this.form.menuType,
					parentId: this.form.parentId ? this.form.parentId : 0,
					orderNum: Number(this.form.orderNum),
					remark: this.form.remark
				}).then((res)=>{
					this.addVisible = false;
					this.$message.success('修改成功');
					this.getData();
				})
			}
		},
        // 触发搜索按钮
        handleSearch() {
			this.query.pageIndex = 1;
			this.getData();
        },
		handleDelete(index, row) {
			this.$confirm('确定要删除吗？', '提示', {
			    type: 'warning'
			}).then(() => {
				deleteMenu({
					id: row.menuId
				}).then((res)=>{
					if(res.code === 200){
						this.$message.success('删除成功');
						this.getData();
					}
				})
			}).catch(()=>{});
		},
		handleEdit(index, row) {
			this.visibleTitle = '修改菜单';
			this.form = {
				menuId: row.menuId,
				menuName: row.menuName,
				visible: row.visible == 1 ? true : false,
				url: row.url,
				icon: row.icon,
				menuType: row.menuType,
				parentId: row.parentId,
				orderNum: row.orderNum,
				remark: row.remark
			};
            this.addVisible = true;
		}
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.expand-span{
	margin-left: 20px;
	color: #409EFF;
}
</style>