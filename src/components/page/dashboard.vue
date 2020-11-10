<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-home"></i> 系统首页
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
			<el-row :gutter="40">
				<el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in cardList" :key="index">
					<el-card shadow="always" class="card">
						<div class="card-box">
							<img class="card-left" :src="item.icon">
							<div class="card-right">
								<p class="card-name">{{item.name}}</p>
								<p class="card-value">{{item.value}}</p>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			<el-row :gutter="40">
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
					<div ref="chart" style="width:100%;height:376px;"></div>
				</el-col>
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
					<div ref="chart2" style="width:100%;height:376px;"></div>
				</el-col>
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
					<div ref="chart3" style="width:100%;height:376px;"></div>
				</el-col>
			</el-row>
			
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
let avatar = require('@/assets/img/dataIcon.png');

export default {
    name: 'dashboard',
    components: {

    },
    data() {
        return {
			fullscreenLoading: false,
			cardList: [
				{icon: avatar, name: '会员总数', value: 10154},
				{icon: avatar, name: '订单总数', value: 4213},
				{icon: avatar, name: '总金额', value: 39590},
				{icon: avatar, name: '商品总数', value: 3},
				{icon: avatar, name: '今日订单数', value: 2},
				{icon: avatar, name: '昨日订单数', value: 12},
				{icon: avatar, name: '近七天订单数', value: 46},
				{icon: avatar, name: '本月订单数', value: 269},
			]
        }
    },
    created() {
		
    },
	mounted(){
	    this.getEchartData(); 
	},
    methods: {
		getEchartData() {
			const chart = this.$refs.chart;
			const chart2 = this.$refs.chart2;
			const chart3 = this.$refs.chart3;
			
			const myChart = echarts.init(chart);
			const myChart2 = echarts.init(chart2);
			const myChart3 = echarts.init(chart3);
			
			const option = {
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					data: [820, 932, 901, 934, 1290, 1330, 1320],
					type: 'line',
					itemStyle: {
						normal: {
							color: '#3888fa',
							lineStyle: {
								color: '#3888fa',
								width: 2
							},
							areaStyle: {
								color: '#f3f8ff'
							}
						}
					}
				}]
			}
			
			myChart.setOption(option);
			myChart2.setOption(option);
			myChart3.setOption(option);
			
			window.addEventListener("resize", function() {
				myChart.resize();
				myChart2.resize();
				myChart3.resize();
			})
			this.$on('hook:destroyed',()=>{
				window.removeEventListener("resize", function() {
					myChart.resize();
					myChart2.resize();
					myChart3.resize();
				});
			})
		}
	}
};
</script>

<style scoped>
	.card{
		margin: 20px 0;
	}
	.card-box{
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.card-box > .card-left{
		width: 60px;
		height: 60px;
	}
	.card-box > .card-right{
		height: 60px;
		color: #f3f8ff;
	}
	.card-box > .card-right > .card-name{
		height: 30px;
		line-height: 30px;
		font-size: 16px;
		color: #aaaaaa;
		text-align: right;
	}
	.card-box > .card-right > .card-value{
		height: 30px;
		line-height: 30px;
		font-size: 20px;
		color: #666666;
		text-align: right;
	}
</style>