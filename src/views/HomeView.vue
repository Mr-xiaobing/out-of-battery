<template>
  <div class="home">
    <el-row :gutter="20" style="margin-bottom: 10px;">
      <el-col :span="12">
        <el-button type="warning" class="recovery" @click="goRecovery('/recovery')">
          RECOVERY
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" class="information" @click="goRecovery('/information')">
          INFORMATION
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="danger" class="login" @click="goRecovery('/login')">Account Login</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.home {
  position: absolute;
  width: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.recovery {
  font-size: 3em;
  border: 1px solid black;
  line-height: 100px;
  height: 100px;
  width: 100%;
}

.login {
  border: 1px solid black;
  height: 100px;
  font-size: 3em;
  width: 100%;
  line-height: 100px;
}

.information {
  height: 100px;
  line-height: 100px;
  width: 100%;
  font-size: 3em;
  border: 1px solid black;
}
</style>
<script>
// @ is an alias to /src

export default {
  name: 'HomeView',

  data() {
    return {
      path: "ws://127.0.0.1:8080/api/websocket/1",
    }
  },
  methods: {
    goRecovery: function (url) {
      this.$router.push(url)
    },
    initWebSocket: function () {
      this.path = this.path
      this.socket = new WebSocket(this.path)
      this.socket.onopen = this.open
      this.socket.onerror = this.error
      this.socket.onmessage = this.getMessage
      this.socket.onclose = this.close
    },
    open: function () {
      console.log("socket连接成功")
    },
    error: function () {
      console.log("连接错误")
    },
    getMessage: function (msg) {
      console.log(msg);
      if (this.isJSON(msg.data)) {
        let data = JSON.parse(msg.data)
        if (data != undefined) {
          console.log(data);
          sessionStorage.setItem("userData", JSON.stringify(data));
          sessionStorage.setItem("user", JSON.stringify(data))
          this.$router.push("/information")
        }
      }


    },
    isJSON: function (str) {
      if (typeof str == 'string') {
        try {
          JSON.parse(str);
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
      console.log('It is not a string!')
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initWebSocket()
  },
}
</script>
