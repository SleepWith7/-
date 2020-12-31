const app = getApp();
const sign = require("../../utils/sign.js")
Page({
  data: {
    hasUserInfo: false,  // 用户信息是否存在
    userInfo: {},  // 用户数据
    avatarUrl: '',  // 用户头像链接
    passwordCiphertext: false,  // 首页是否明文显示
    userAutomaticCloud: false,  // 是否自动上传云端
    canIUse: wx.canIUse('button.open-type.getUserInfo'),  
    
    modal: false,  // 弹窗界面显示
    focus:false,  // 是否为焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        avatarUrl: app.globalData.userInfo.avatarUrl,
      })
    } 
    else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          avatarUrl: res.userInfo.avatarUrl,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            avatarUrl: res.userInfo.avatarUrl,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      bgColor: app.globalData.userSet.bgColor,
      passwordCiphertext: app.globalData.userSet.passwordCiphertext,
      userAutomaticCloud: app.globalData.userSet.userAutomaticCloud
    })
  },
  /**
   * 获取用户信息--头像
   */
  onGetUserInfo: function (e) {
    var that = this;
    console.log(e.detail)
     if (e.detail.userInfo) {
      this.setData({
        hasUserInfo: true,
        // avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = e.detail.userInfo
      wx.showToast({
        title: '正在更新',
        icon: 'loading',
        duration: 60 * 1000,
        mask: true
      })
      // 调用app.js getUserSet的方法
      app.getUserSet().then(res => {
        wx.hideToast()// 隐藏消息提示框
        this.onShow()
      })
    }
  },

  /**
   * 弹窗功能
   */
  //弹窗取消按钮
  hidemodal(){
    this.setData({
      modal: false,
      focus: false
    })
  },
  // 获取输入数据
  bindmodalinput(e) {
    console.log(e.detail.value)
    this.setData({
      modalinput: e.detail.value,
    })
  },

  /**
   * 设置或修改密码
   */
  // 弹出对话框
  binduser_password() {
    // 弹窗
    this.setData({
      modal: true,
      focus: true,
      modalinput: '',
      modalobj: {
        title: '设置登陆密码',
        placeholder: '请输入4位登陆密码',
        maxlength: 4,
        type: 'number',
        bindtap: 'user_password',
        bindtaptext: '确定'
      }
    })
  },
  // 弹窗确定事件
  user_password() {
    let pass = this.data.modalinput.split('');
    if (pass.length != 4) {
      wx.showToast({
        title: '--请检查位数--',
        icon: 'none'
      })
    } else {
      console.log(pass)
      wx.setStorage({
        key: "user_password",
        data: pass
      })
      this.hidemodal()
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
    } 
  },

  /**
   * 首页密码显示明文
   */
  ciphertext() {
    this.setData({
      passwordCiphertext: !this.data.passwordCiphertext
    })
    console.log(this.data.passwordCiphertext)
    let data = {
      passwordCiphertext: this.data.passwordCiphertext,
      userAutomaticCloud: this.data.userAutomaticCloud
    }
    console.log(data)
    // 写入缓存
    wx.setStorage({
      key: "userSet",
      data: data
    })
    // 写入全局变量
    app.globalData.userSet.passwordCiphertext = this.data.passwordCiphertext;
  },

  /**
   * 保存或更新账号自动上传
   */ 
  // // 弹出对话框
  // automaticCloud() {
  //   if (!this.data.hasUserInfo) {
  //     wx.showToast({
  //       title: '请先点击头像授权~~',
  //       icon: 'none',
  //     })
  //     return false;
  //   }

  //   let that = this
  //   console.log(this.data.userAutomaticCloud)
  //   // 已开启自动上传上传
  //   if (this.data.userAutomaticCloud) {
  //     this.autoCloud();
  //     return false;
  //   }
  //   // 弹窗
  //   this.setData({
  //     modal: true,
  //     focus: true,
  //     modalinput: '',
  //     modalobj: {
  //       title: '开启自动上传',
  //       placeholder: '请设置6位云端密码',
  //       type: 'text',
  //       maxlength: 6,
  //       bindtap: 'autoCloud',
  //       bindtaptext: '开启'
  //     }
  //   })
  // },
  //   //自动上传
  //   autoCloud() {
  //     var that = this;

  //     let key = that.data.modalinput;
  //     let pass = that.data.modalinput;
  //     if (!that.data.userAutomaticCloud) {
  //       if (key.length != 6) {
  //         wx: wx.showToast({
  //           title: '--请检查位数--',
  //           icon: 'none'
  //         })
  //         return false;
  //       }
  //       wx.setStorage({
  //         key: "passwordCloud",
  //         data: pass
  //       })
  //       console.log(9999999999);
  //     } else (
  //       wx.removeStorage({
  //         key: 'passwordCloud',
  //         success(res) {
  //           console.log(99988899999);
  //         }
  //       })
  //     )
  //     that.setData({
  //       userAutomaticCloud: !that.data.userAutomaticCloud,
  //       modal: false
  //     })
  //     wx.setStorage({
  //       key: "userSet",
  //       data: {
  //         passwordCiphertext: that.data.passwordCiphertext,
  //         userAutomaticCloud: that.data.userAutomaticCloud
  //       }
  //     })
  //     app.globalData.userSet.userAutomaticCloud = that.data.userAutomaticCloud;
  //   },

  /**
   * 本地账号上传到云端
   */ 
  // 弹出对话框
  bindUploadCloud() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先点击头像授权~~',
        icon: 'none',
      })
      return false;
    }
    // 弹窗
    this.setData({
      modal: true,
      focus: true,
      modalinput: '',
      modalobj: {
        title: '上传到云端',
        placeholder: '请设置6位云端密码',
        type: 'text',
        maxlength: 6,
        bindtap: 'uploadCloud',
        bindtaptext: '上传'
      }
    })
  },
  // 弹窗uploadCloud事件
  uploadCloud() {
    let key = this.data.modalinput;
    if (key.length != 6) {
      wx.showToast({
        title: '--请检查位数--',
        icon: 'none'
      })
      return false;
    }
    wx.showToast({
      title: '上传中',
      icon: 'loading'
    })
    // json --> 字符串
    let pass = JSON.stringify(app.globalData.password)
    // console.log(pass)
    // 加密
    pass = sign.encrypt(pass, key)
    // console.log(pass)

    // 调用app.js的方法
    app.uploadCloud(pass)
    .then( res => {
      this.hidemodal()
      console.log("调用app.js的uploadCloud返回值",res)
      if (res) { 
        // res = true
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 云端账号下载到本地
   */ 
  // 弹出对话框
  bindDownCloud() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先点击头像授权~~',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //弹窗
    this.setData({
      modal: true,
      focus: true,
      modalinput: '',
      modalobj: {
        title: '恢复到本地',
        placeholder: '请输入6位云端密码',
        type: 'text',
        maxlength: 6,
        bindtap: 'downCloud',
        bindtaptext: '恢复'
      }
    })
  },
  // 弹窗downCloud事件
  downCloud() {
    let key = this.data.modalinput;
    if (key.length != 6) {
      wx.showToast({
        title: '--请检查位数--',
        icon: 'none'
      })
      return false;
    }
    this.hidemodal();
    wx.showToast({
      title: '下载中',
      icon: 'loading'
    })
    // 调用云实现下载
    wx.cloud.callFunction({
      name: 'downCloud',
      data: {},
      success: res => {
        console.log("获得云端账号加密数据",res)
        // 解密
        if(res.result.password==null){
          // 弹窗提示
          wx.showToast({
            title: '下载失败，云端无数据',
            icon: 'none',
            duration: 2000
          })
        }
        else{
          let pass = sign.decrypt(res.result.password, key);
          console.log("解密后数据-字符串",pass)
          if (!pass) {
            // 弹窗提示失败
            wx.showToast({
              title: '密码错误',
              image: '../../images/err.png'
            })
          } 
          else {
            // 字符串 --> json
            app.globalData.password = JSON.parse(pass)
            console.log("转换后得数据",JSON.parse(pass))
            // 写入缓存
            wx.setStorage({
              key: "password",
              data: app.globalData.password
            })
            // 弹窗提示成功
            wx.showToast({
              title: '恢复成功',
              icon: 'success'
            })
          }
        }
      }
    })
  },

  /**
   * 清除云端账号数据
   */ 
  bindDeleteCloud() {
    wx.showModal({
      title: '提示',
      content: '清除后数据无法恢复',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '清除',
      confirmColor: '',
      success: res =>  {
        if (res.confirm) {
          wx.showToast({
            title: '清除中~',
            icon: 'loading'
          })
          app.uploadCloud(null)
          .then( res => {
            this.hidemodal()
            console.log("调用app.js的getUserSet返回值",res)
            if (res) {
              wx.showToast({
                title: '清除成功',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '清除失败',
                image: '../images/err.png'
              })
            }
          })
        }
      }
    })
  },

  /**
   * 清除本地账号数据
   */ 
  bindDeleteLocal(){
    wx.showModal({
      title: '注意',
      content: '您本地保存的数据将会被清空',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          // 从本地缓存中移除指定 key
          wx.removeStorage({
            key: 'password',
            success(res) {
              app.globalData.password = []
              wx.showToast({
                title: '清除成功',
                icon: 'success'
              })
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 更换主题
   */ 
  bgcolorSet() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先点击头像授权~~',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: '../bgColor/bgColor',
    })
  },
  
})