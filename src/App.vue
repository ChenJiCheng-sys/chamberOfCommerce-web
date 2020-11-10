<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    data() {
        return {
			screen: false
        }
    },
    created() {
		if(window.screen.height > window.screen.width){
			this.screen = true;
		}
    },
    methods: {

    }
}
</script>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";
	@import './assets/css/icon.css';
</style>