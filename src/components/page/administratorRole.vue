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
				    @click="visibleTitle='新增角色';addVisible=true;form={};"
				>新增角色</el-button>
                <el-input v-model="query.search" placeholder="输入搜索内容" class="handle-input mgr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
			
			<el-row :gutter="20">
				<el-col :span="18">
					<el-table
					    :data="tableData"
					    border
						stripe
					    class="table"
					    ref="multipleTable"
					    header-cell-class-name="table-header"
						highlight-current-row
						@current-change="handleCurrentChange"
					>
					    <el-table-column type="index" width="55" align="center"></el-table-column>
					    <el-table-column prop="roleName" label="角色名称"></el-table-column>
					    <el-table-column prop="dataScope" label="数据范围"></el-table-column>
					    <el-table-column prop="roleSort" label="排序"></el-table-column>
					    <el-table-column prop="remark" label="备注"></el-table-column>
						<el-table-column label="状态" width="120">
							<template slot-scope="scope">
								<el-switch
									disabled
									v-model="scope.row.status == '1' ? false : true">
								</el-switch>
							</template>
						</el-table-column>
					    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
						<el-table-column label="操作" width="120" align="center">
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
								>删除</el-button>
						    </template>
						</el-table-column>
					</el-table>
				</el-col>
				<el-col :span="6">
					<el-card class="box-card">
					  <div slot="header" class="clearfix">
						<span>菜单分配</span>
						<el-button type="primary" style="float: right;" @click="editMenuList()">保存</el-button>
					  </div>
					  <el-tree
						:data="menuList"
					    ref="tree"
						show-checkbox
						default-expand-all
						node-key="menuId"
						:default-checked-keys="checkedKeys"
						:props="menuProps">
					  </el-tree>
					</el-card>
				</el-col>
			</el-row>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
					:page-sizes="[10, 15, 20, 30, 50]"
					@size-change="handleSizeChange"
                    :total="query.total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
		
		<el-dialog :title="visibleTitle" :visible.sync="addVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
		    <el-form ref="form" :model="form" label-width="80px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="角色名称">
							<el-input v-model="form.roleName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据范围">
							<el-input v-model="form.dataScope"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序">
							<el-input v-model="form.roleSort"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注">
							<el-input v-model="form.remark"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-switch v-model="form.status"></el-switch>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveRole">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import { getSysRole, createSysRole, deleteSysRole, updateSysRole } from '../../api/administratorRole.js';
import { getMenu } from '../../api/menu.js';

export default {
    name: 'administratorRole',
    components: {

    },
    data() {
        return {
            query: {
				search: '',
                pageIndex: 1,
                pageSize: 10,
				total: 0
            },
            tableData: [],
			
			addVisible: false,
			addUserId: null,
			form: {},
			visibleTitle: '新增角色',
			
			menuList: [],
			menuProps: {
			  children: 'children',
			  label: 'menuName'
			},
			idx: '-1',
			
			checkedKeys: [],
			checkedKeys_all: []
        }
    },
    created() {
		this.setCrumbs();
		this.getMenu();
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
		// 获取菜单
		getMenu() {
			getMenu({
				pageNum: 1,
				pageSize: 10000,
				menuBelong: 1
			}).then((res)=>{
				let list = res.data.list;
				list.sort(function(a,b){
					return a.orderNum - b.orderNum;
				})
				let menuList = [];
				list.forEach((item)=>{
					if(item.parentId == 0){
						item.children = [];
						menuList.push(item)
					}
				})
				list.forEach((item)=>{
					if(item.parentId != 0){
						menuList.forEach((i,e)=>{
							if(item.parentId == i.menuId){
								menuList[e].children.push(item)
							}
						})
					}
				})
				
				this.menuList = menuList;
			})
		},
        // 获取数据
        getData() {
			getSysRole({
				pageNum: this.query.pageIndex,
				pageSize: this.query.pageSize,
				keyword: this.query.search
			}).then((res)=>{
				this.tableData = res.data.list;
				this.query.total = res.data.total;
			})
        },
		saveRole() {
			if(this.visibleTitle == '新增角色'){
				createSysRole({
					dataScope: Number(this.form.dataScope),
					roleSort: Number(this.form.roleSort),
					roleName: this.form.roleName,
					remark: this.form.remark,
					status: this.form.status ? 0 : 1,
				}).then((res)=>{
					this.addVisible = false;
					this.$message.success('新增成功');
					this.getData();
				})
			}else{
				updateSysRole({
					roleId: this.form.roleId,
					dataScope: Number(this.form.dataScope),
					roleSort: Number(this.form.roleSort),
					roleName: this.form.roleName,
					remark: this.form.remark,
					status: this.form.status ? 0 : 1,
				}).then((res)=>{
					this.addVisible = false;
					this.$message.success('修改成功');
					this.getData();
				})
			}
		},
        // 分页导航
        handlePageChange(val) {
			this.query.pageIndex = val;
            this.getData();
        },
		handleSizeChange(val) {
			this.query.pageIndex = 1;
			this.query.pageSize = val;
            this.getData();
		},
		handleCurrentChange(row) {
			if(row){
				this.idx = row.roleId;
				let checkedKeys = [];
				let checkedKeys_all = [];
				if(row.menus){
					row.menus.forEach((item)=>{
						checkedKeys_all.push(item.menuId)
						if(item.parentId != 0){
							checkedKeys.push(item.menuId)
						}else{
							if(item.url != ''){
								checkedKeys.push(item.menuId)
							}
						}
					})
				}
				this.checkedKeys_all = checkedKeys_all;
				this.checkedKeys = checkedKeys;
				this.$refs.tree.setCheckedNodes(checkedKeys);
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
				deleteSysRole({
					id: row.roleId
				}).then((res)=>{
					if(res.code === 200){
						this.$message.success('删除成功');
						this.tableData.splice(index, 1);
					}
				})
			})
		},
		handleEdit(index, row) {
			this.form = {
				roleId: row.roleId,
				dataScope: Number(row.dataScope),
				roleSort: Number(row.roleSort),
				roleName: row.roleName,
				remark: row.remark,
				status: row.status == 1 ? false : true
			};
			this.visibleTitle = '修改角色';
            this.addVisible = true;
		},
		editMenuList() {
			if(this.idx === '-1') {
				this.$message.error('请选者要修改的角色');
			} else {
				let deleteIds = [];
				let insertIds = [];
				let checkedKeys = this.checkedKeys_all;
				let checkedNodes = this.$refs.tree.getCheckedNodes(false,true);
						
				let checkedKeys_new = [];
				checkedNodes.forEach((item)=>{
					checkedKeys_new.push(item.menuId)
				})
				
				checkedKeys.forEach((item)=>{
					if(checkedKeys.includes(item)&&!checkedKeys_new.includes(item)) deleteIds.push(item)
				})
				checkedKeys_new.forEach((item)=>{
					if(checkedKeys_new.includes(item)&&!checkedKeys.includes(item)) insertIds.push(item)
				})
				
				updateSysRole({
					roleId: this.idx,
					deleteIds: deleteIds,
					insertIds: insertIds
				}).then((res)=>{
					this.$message.success('修改成功');
					this.getData();
				})
			}
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