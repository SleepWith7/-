const app = getApp();
Page({
  data: {
    name:'',
    nicename:'',
    password:'',
    remarks:'',
    passwordnum:null,
    title:'添加账户',
  },

  onLoad: function (options) {
    console.log("得到传入信息",options)
    if(options.data != null){
      let data = JSON.parse(options.data);
      this.setData({
        title:'修改信息',
        name: data.name,
        nicename: data.nicename,
        password: data.password,
        remarks: data.remarks,
        passwordnum: options.passwordnum
      })
    }
  },

  onShow: function () {
    this.setData({
      bgColor: app.globalData.userSet.bgColor,
      fontColor: app.globalData.userSet.fontColor
    })
  },

  /**
   * 获取输入框数据
   */
  name(e){
    // console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  nicename(e) {
    this.setData({
      nicename: e.detail.value
    })
  },
  password(e) {
    this.setData({
      password: e.detail.value
    })
  },
  remarks(event) {
    this.setData({
      remarks: event.detail.value
    })
  },

  /**
   * 保存数据
   * 保存账户-触发函数
   */
  up(){
    if (!this.data.name || !this.data.nicename || !this.data.password){
      wx.showToast({
        title: '星号字段不允许为空',
        image:'../../images/err.png',
        duration: 1000
      })
    }
    else{
      if(this.data.passwordnum == null){
        // 加入变量
        app.globalData.password.unshift({ 
          name: this.data.name, 
          nicename: this.data.nicename, 
          password: this.data.password, 
          remarks: this.data.remarks == '' ? '' : this.data.remarks 
        });
      }
      else{
        // 更新变量
        let password = { 
          name: this.data.name, 
          nicename: this.data.nicename, 
          password: this.data.password, 
          remarks: this.data.remarks == '' ? '' : this.data.remarks }
        app.globalData.password.splice(this.data.passwordnum, 1, password);
        
      }

      // 同步数据至缓存
      wx.setStorage({
        key: "password",
        data: app.globalData.password
      })

      //下一步操作
      if(this.data.passwordnum == null){
        wx.showModal({
          content: '添加成功',
          cancelText:'返回首页',
          confirmText:'继续添加',
          confirmColor:'#000000',
          success: res=>  {
            if (res.confirm)  {
              this.setData({
                name: '',
                nicename: '',
                password: '',
                remarks: ''
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
      else{
        wx.showModal({
          title: '提示',
          content: '更新成功~',
          showCancel:false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } 
          }
        })
      }
    }

  }
  
})