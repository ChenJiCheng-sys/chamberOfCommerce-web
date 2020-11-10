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
				    @click="visibleTitle='新增商会';userVisible=true;form={status:true};"
				>新增商会</el-button>
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
					    <el-table-column prop="name" label="商会名称" width="180"></el-table-column>
					    <el-table-column prop="phone" label="联系人手机号" width="150"></el-table-column>
					    <el-table-column prop="phone" label="地区" width="150"></el-table-column>
					    <el-table-column prop="addressDetail" label="详细地址"></el-table-column>
					    <el-table-column prop="smsQuantity" label="短信发送数量" width="120"></el-table-column>
						<el-table-column label="状态" width="120">
							<template slot-scope="scope">
								<el-switch
									disabled
									v-model="scope.row.status">
								</el-switch>
							</template>
						</el-table-column>
					    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
						<el-table-column label="操作" width="120" align="center" fixed="right">
						    <template slot-scope="scope">
						        <el-button
									type="text"
									icon="el-icon-edit"
									@click="handleEdit(scope.$index, scope.row)"
						        >编辑</el-button>
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
		
		<el-dialog :title="visibleTitle" :visible.sync="userVisible" width="700px" :close-on-click-modal="false" :close-on-press-escape="false">
		    <el-form ref="form" :model="form" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="商会名">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系人手机号">
							<el-input v-model="form.phone"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="选择省市区">
							<el-cascader
								:options="options"
								v-model="form.selectedOptions"
								@change="handleChange"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="详细地址">
							<el-input v-model="form.addressDetail"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="短信发送数量">
							<el-input v-model="form.smsQuantity"></el-input>
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
				<el-button type="primary" @click="saveCommerce">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import { getCommerce, getCommerceDetail, createCommerce, updateCommerce } from '../../api/commerce.js';
import { getMenu } from '../../api/menu.js';

export default {
    name: 'commerceList',
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
			
			userVisible: false,
			visibleTitle: '新增商会',
			form: {},
			
			options: regionData,
			
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
		handleChange() {},
		// 获取菜单
		getMenu() {
			getMenu({
				pageNum: 1,
				pageSize: 10000,
				menuBelong: 2
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
			getCommerce({
				pageNum: this.query.pageIndex,
				pageSize: this.query.pageSize,
				keyword: this.query.search
			}).then((res)=>{
				this.tableData = res.data.list;
				this.query.total = res.data.total;
			})
        },
		handleEdit(index, row) {
			let selectedOptions = [];
			if(row.province){
				selectedOptions.push(TextToCode[row.province].code)
				let cityName = ['北京市','上海市','天津市'];
				if(cityName.indexOf(row.city) != '-1' ){
					selectedOptions.push(TextToCode[row.province]['市辖区'].code)
					selectedOptions.push(TextToCode[row.province]['市辖区'][row.area].code)
				}else{
					selectedOptions.push(TextToCode[row.province][row.city].code)
					selectedOptions.push(TextToCode[row.province][row.city][row.area].code)
				}
			}
			this.form = {
				id: row.id,
				name: row.name,
				phone: row.phone,
				addressDetail: row.addressDetail,
				smsQuantity: row.smsQuantity,
				status: row.status == 1 ? true : false,
				selectedOptions: selectedOptions
			};
			this.visibleTitle = '编辑商会';
            this.userVisible = true;
		},
		saveCommerce() {
			if(this.visibleTitle === '新增商会'){
				createCommerce({
					name: this.form.name,
					phone: this.form.phone,
					addressDetail: this.form.addressDetail,
					smsQuantity: this.form.smsQuantity,
					status: this.form.status ? 1 : 0,
					province: CodeToText[this.form.selectedOptions[0]],
					city: CodeToText[this.form.selectedOptions[1]] === '市辖区' ? CodeToText[this.form.selectedOptions[0]] : CodeToText[this.form.selectedOptions[1]],
					area: CodeToText[this.form.selectedOptions[2]]
				}).then((res)=>{
					this.userVisible = false;
					this.$message.success('新增成功');
					this.getData();
				})
			}else{
				updateCommerce({
					id: this.form.id,
					name: this.form.name,
					phone: this.form.phone,
					addressDetail: this.form.addressDetail,
					smsQuantity: this.form.smsQuantity,
					status: this.form.status ? 1 : 0,
					province: CodeToText[this.form.selectedOptions[0]],
					city: CodeToText[this.form.selectedOptions[1]] === '市辖区' ? CodeToText[this.form.selectedOptions[0]] : CodeToText[this.form.selectedOptions[1]],
					area: CodeToText[this.form.selectedOptions[2]]
				}).then((res)=>{
					this.userVisible = false;
					this.$message.success('修改成功');
					this.getData();
				})
			}
		},
		handleCurrentChange(row) {
			if(row){
				this.idx = row.id;
				let checkedKeys = [];
				let checkedKeys_all = [];
				if(row.menuList){
					row.menuList.forEach((item)=>{
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
        },
		editMenuList() {
			if(this.idx === '-1') {
				this.$message.error('请选者要修改的商会');
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
				updateCommerce({
					id: this.idx,
					deleteIds: deleteIds,
					insertIds: insertIds,
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