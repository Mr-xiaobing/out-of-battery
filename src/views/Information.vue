<!--  -->
<template>
    <div class='card'>
        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-weight: bolder;">INFORMATION</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-row>
                                <el-col :span="12">
                                    <div class="message">
                                        ID:
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="message">
                                        {{ user.id }}
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="message">
                                        Integration:
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="message">
                                        {{ user.integration }}
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="message">
                                        Weight:
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="message">
                                        {{ user.recoveredWeight }}
                                    </div>
                                </el-col>
                                <div></div>
                                <el-col :span="24">
                                    <div class="message">
                                        Thank you for your contribution
                                    </div>
                                </el-col>

                            </el-row>
                        </el-col>
                        <el-col :span="12">
                            <img src="../assets/bg.png" width="200" height="200" class="image">
                        </el-col>
                        <el-col :span="20" style="text-align: center; padding-left: 8em;">
                            <el-button type="primary" @click="goRecovery('/')">
                                Home
                            </el-button>
                        </el-col>
                        <div></div>
                    </el-row>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: "Information",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            user:null
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        goRecovery:function(url){
        this.$router.push(url)
    },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素） 
    mounted() {
       
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { this.user = JSON.parse(sessionStorage.getItem("userData"))
        console.log("information");
        console.log(this.user); }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
.card {
    position: absolute;
    width: 90%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.message {
    text-align: center;
    text-align: left;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
    color: green;
    font-size: 1.2em;
}
</style>