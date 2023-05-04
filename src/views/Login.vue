<!--  -->
<template>
    <div class='' style="text-align: center;">
        <article>
            <section>
                <video id="video" style=" width: 800px; height: 400px;"></video>
            </section>
            <section>
                <canvas id="canvas" style=" width: 800px; height: 400px;"></canvas>
            </section>
            <section> <img id="orgImg" src="../assets/z/z1.png" hidden />
                <img id="detImg" src="../assets/z/z2.png" hidden />
            </section>
        </article>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import * as faceapi from "face-api.js";
export default {
    name: "Login",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            timer: null,
            distance:""
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        opening() {
            let convas = document.querySelector('#canvas') //
            let video = document.querySelector('#video')
            let btn = document.querySelector('button')
            let context = canvas.getContext('2d')
            let width = 320 // 视频和canvas的宽度
            let height = 0 //
            let streaming = false // 是否开始捕获媒体
            // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
            if (navigator.mediaDevices == undefined) {
                navigator.mediaDevices = {}
            }

            // 获取用户媒体,包含视频和音频
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    video.srcObject = stream // 将捕获的视频流传递给video  放弃window.URL.createObjectURL(stream)的使用
                    video.play() //  播放视频
                })

        },

        async fnInit() {
        await faceapi.loadFaceRecognitionModel("/models");
        // 节点属性化
        this.orgImgEl = document.getElementById("orgImg");
        this.detImgEl = document.getElementById("detImg");
        //转图片矩阵数据
        this.desc = [
          await faceapi.computeFaceDescriptor(this.orgImgEl),
          await faceapi.computeFaceDescriptor(this.detImgEl),
        ];
        // 图片误差值，越小越精确
        this.distance = faceapi
          .euclideanDistance(this.desc[0], this.desc[1])
          .toFixed(2);
      },


    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

        this.$nextTick(() => {
            this.fnInit();
        });
        this.opening()
        // clearInterval(this.timer); //删除定时器
        //     this.timer = null;
        //     this.timer = setTimeout(() => {
        //         this.$router.push("/")
        //     }, 6000)
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style  scoped></style>