<template>
    <div style="text-align: center;">
        <el-alert :title="httpsAlert" type="info" :closable="false" v-show="httpsAlert !== ''">
        </el-alert>
        <div class="videoImage" ref="faceBox">
            <video ref="video" style="display: none;"></video>
            <canvas ref="canvas" width="800" height="400" v-show="videoShow"></canvas>
            <img ref="image" :src="picture" alt="" v-show="pictureShow">
        </div>
        <img id="Img1" src="../assets/z/z1.png" hidden />
        <img id="Img2" src="../assets/z/z2.png" hidden />
        <img id="Img3" src="../assets/z/z3.jpg" hidden />
    </div>
</template>

<script>
import * as faceApi from 'face-api.js'
export default {
    name: 'Recognize',
    data() {
        return {
            videoShow: false,
            pictureShow: false,
            // 图片地址
            picture: '',
            // 用于视频识别的节点
            canvas: null,
            video: null,
            image: null,
            timeout: 0,
            // 模型识别的条件
            options: '',
            distance: null,
            // 提示控制
            noOne: '',
            moreThanOne: '',
            // 不是通过Https访问提示
            httpsAlert: '',
            timer: null

        }
    },
    mounted() {
        // 初始化
        this.init()
        clearInterval(this.timer);
    },
    beforeDestroy() {
        clearTimeout(this.timeout);
    },
    methods: {
        async init() {
            await faceApi.nets.ssdMobilenetv1.loadFromUri("/models");
            await faceApi.loadFaceLandmarkModel("/models");
            await faceApi.loadFaceRecognitionModel("/models");
            this.options = new faceApi.SsdMobilenetv1Options({
                minConfidence: 0.5, // 0.1 ~ 0.9
            });
            // 视频中识别使用的节点
            this.video = this.$refs.video
            this.canvas = this.$refs.canvas
            this.image = this.$refs.image
            this.useCamera()
        },
        /**
         * 使用视频来成像摄像头
         */
        useCamera() {
            this.videoShow = true
            this.pictureShow = false
            this.cameraOptions()
            this.timer = null;
            this.timer = setInterval(() => {
                this.photoShoot()
            }, 5000)
        },
        /**
         * 使用摄像头
         */
        cameraOptions() {
            let constraints = {
                video: {
                    width: 800,
                    height: 400
                }
            }
            // 如果不是通过loacalhost或者通过https访问会将报错捕获并提示
            try {
                let promise = navigator.mediaDevices.getUserMedia(constraints);
                promise.then((MediaStream) => {
                    // 返回参数
                    this.video.srcObject = MediaStream;
                    this.video.play();
                    this.recognizeFace()
                }).catch((error) => {
                    console.log(error);
                });
            } catch (err) {
                this.httpsAlert = `您现在在使用非Https访问，
                请先在chrome://flags/#unsafely-treat-insecure-origin-as-secure中修改配置,
                添将当前链接${window.location.href}添加到列表,
                并且将Insecure origins treated as secure修改为enabled,
                修改完成后请重启浏览器后再次访问！`
            }
        },
        /**
         * 人脸识别方法
         * 通过canvas节点识别
         * 节点对象执行递归识别绘制
         */
        async recognizeFace() {
            if (this.video.paused) return clearTimeout(this.timeout);
            this.canvas.getContext('2d', { willReadFrequently: true }).drawImage(this.video, 0, 0, 800, 400);
            const results = await faceApi.detectAllFaces(this.canvas, this.options).withFaceLandmarks();
            if (results.length === 0) {
                if (this.moreThanOne !== '') {
                    this.moreThanOne.close()
                    this.moreThanOne = ''
                }
                if (this.noOne === '') {
                    // this.noOne = this.$message({
                    //     message: '未识别到人脸',
                    //     type: 'warning',
                    //     duration: 0
                    // });
                }
            } else if (results.length > 1) {
                if (this.noOne !== '') {
                    this.noOne.close()
                    this.noOne = ''
                }
                if (this.moreThanOne === '') {
                    this.moreThanOne = this.$message({
                        message: '检测到镜头中有多个人',
                        type: 'warning',
                        duration: 0
                    });
                }
            } else {
                if (this.noOne !== '') {
                    this.noOne.close()
                    this.noOne = ''
                }
                if (this.moreThanOne !== '') {
                    this.moreThanOne.close()
                    this.moreThanOne = ''
                }
            }
            // 通过canvas显示video信息
            this.timeout = setTimeout(() => {
                return this.recognizeFace()
            });
        },
        /**
         * 拍照上传
         */
        async photoShoot() {
            // 拿到图片的base64
            let canvas = this.canvas.toDataURL("image/png");
            // 拍照以后将video隐藏
            this.videoShow = true
            this.pictureShow = false
            // 停止摄像头成像
            // this.video.srcObject.getTracks()[0].stop()
            // this.video.pause()
            if (canvas) {
                // 拍照将base64转为file流文件
                let blob = this.dataURLtoBlob(canvas);
                console.log(blob)
                let file = this.blobToFile(blob, "imgName");
                console.info(file);
                // 将blob图片转化路径图片
                let image = window.URL.createObjectURL(file)
                var newImg = new Image()
                newImg.id = "imgBox"
                newImg.src = image
                for (let index = 1; index < 4; index++) {
                    let img = document.getElementById("Img" + index)
                    let orgImg = await faceApi.computeFaceDescriptor(img)
                    let detImg = await faceApi.computeFaceDescriptor(newImg)
                    this.distance = faceApi.euclideanDistance(orgImg, detImg).toFixed(2);
                    console.log("检测结果:" + this.distance + "." + index);
                    if (this.distance <= 0.3) {
                        clearInterval(this.timer);
                        this.video.srcObject.getTracks()[0].stop()
                        this.video.pause()
                        this.$notify({
                            title: '成功',
                            message: '登录成功',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.$router.push("/")
                        }, 3000)

                    }
                }

            }
        },
        /**
         * 将图片转为blob格式
         * dataurl 拿到的base64的数据
         */
        dataURLtoBlob(dataurl) {
            let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            });
        },
        /**
         * 生成文件信息
         * theBlob 文件
         * fileName 文件名字
         */
        blobToFile(theBlob, fileName) {
            theBlob.lastModifiedDate = new Date().toLocaleDateString();
            theBlob.name = fileName;
            return theBlob;
        },

    }
}
</script>
  
<style scoped>
.option {
    padding-bottom: 20px;
}

.option div {
    padding: 10px;
    border-bottom: 2px #42b983 solid;
}

.option div label {
    margin-right: 20px;
}
</style>
  
  