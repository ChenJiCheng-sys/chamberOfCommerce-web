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
				    @click="visibleTitle='新增管理员';userVisible=true;form={status:true};"
				>新增管理员</el-button>
                <el-input v-model="query.search" placeholder="输入搜索内容" class="handle-input mgr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
				stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="index" width="55" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
                <el-table-column prop="sysRole.roleName" label="角色" width="120"></el-table-column>
                <el-table-column prop="phone" label="电话" width="120"></el-table-column>
                <el-table-column prop="createBy" label="创建者"></el-table-column>
                <el-table-column prop="updateBy" label="更新者"></el-table-column>
                <el-table-column label="头像" align="center" width="120">
                    <template slot-scope="scope">
                        <el-image
							v-if="scope.row.avatar"
                            class="table-td-thumb"
                            :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"
                        >
						</el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="loginName" label="账号" width="150"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                <el-table-column label="状态" width="120">
					<template slot-scope="scope">
						<el-switch
							disabled
							v-model="scope.row.status">
						</el-switch>
					</template>
				</el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="loginDate" label="最后登录时间" width="180"></el-table-column>
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
						>删除</el-button>
				    </template>
				</el-table-column>
            </el-table>

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
		
		<el-dialog :title="visibleTitle" :visible.sync="userVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
		    <el-form ref="form" :model="form" label-width="60px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="用户名">
							<el-input v-model="form.userName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="电话">
							<el-input v-model="form.phone"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱">
							<el-input v-model="form.email"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="角色">
							<el-select v-model="form.roleId" clearable placeholder="选择角色">
								<el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName" :value="item.roleId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账号">
							<el-input v-model="form.loginName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="密码">
							<el-input v-model="form.password"></el-input>
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
				<el-button @click="userVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveUser">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import { getSysUser, createSysUser, deleteSysUser, updateSysUser } from '../../api/administrator.js';
import { getSysRole } from '../../api/administratorRole.js';

export default {
    name: 'administrator',
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
			roleList: [],
			
			userVisible: false,
			visibleTitle: '新增管理员',
			form: {}
        }
    },
    created() {
		this.setCrumbs();
        this.getData();
		this.getRoleList();
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
		// 获取角色列表
		getRoleList() {
			getSysRole({
				pageNum: 1,
				pageSize: 10000
			}).then((res)=>{
				this.roleList = res.data.list;
			})
		},
        // 获取数据
        getData() {
			getSysUser({
				pageNum: this.query.pageIndex,
				pageSize: this.query.pageSize,
				keyword: this.query.search
			}).then((res)=>{
				this.tableData = res.data.list;
				this.query.total = res.data.total;
			})
        },
		handleDelete(index, row) {
			this.$confirm('确定要删除吗？', '提示', {
			    type: 'warning'
			}).then(() => {
				deleteSysUser({
					id: row.userId
				}).then((res)=>{
					if(res.code === 200){
						this.$message.success('删除成功');
						this.tableData.splice(index, 1);
					}
				})
			}).catch(()=>{});
		},
		handleEdit(index, row) {
			this.form = {
				userId: row.userId,
				loginName: row.loginName,
				userName: row.userName,
				roleName: row.sysRole.roleName,
				roleId: row.sysRole.roleId,
				phone: row.phone,
				avatar: row.avatar,
				status: row.status == 1 ? true : false,
				createTime: row.createTime,
				loginDate: row.loginDate,
				email: row.email
			};
			this.visibleTitle = '编辑管理员';
            this.userVisible = true;
		},
		saveUser() {
			if(this.visibleTitle === '新增管理员'){
				createSysUser({
					userName: this.form.userName,
					roleId: this.form.roleId,
					phone: this.form.phone,
					avatar: this.form.avatar,
					status: this.form.status ? 1 : 0,
					email: this.form.email,
					loginName: this.form.loginName,
					password: this.form.password
				}).then((res)=>{
					this.userVisible = false;
					this.$message.success('新增成功');
					this.getData();
				})
			}else{
				updateSysUser({
					userId: this.form.userId,
					userName: this.form.userName,
					roleId: this.form.roleId,
					phone: this.form.phone,
					avatar: this.form.avatar,
					status: this.form.status ? 1 : 0,
					email: this.form.email,
					loginName: this.form.loginName,
					password: this.form.password
				}).then((res)=>{
					this.userVisible = false;
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
        // 触发搜索按钮
        handleSearch() {
			this.query.pageIndex = 1;
			this.getData();
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