App({
  onLaunch: function(){
    //初始化云环境
    if (wx.cloud) {
      wx.cloud.init({
        env: 'test-cloud-merelydust',
        traceUser: true,
      })
    } else {
      console.error('请使用最新版微信才能使用云备份')
    }

    // 获取用户openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.globalData.openid = res.result.openid
        console.log("初始化-云-成功获取用户openid",res)
      }
    })

    // 获取用户的当前授权设置
    wx.getSetting({
      success: res => {
        // 已经授权，获取用户信息
        console.log("获取用户的当前授权设置1/2",res)
        if (res.authSetting['scope.userInfo']) {
          this.getUserSet()
          wx.getUserInfo({
            success: res => {
              console.log("获取用户的当前授权设置2/2",res)
              this.globalData.userInfo = res.userInfo
              wx.setStorage({
                key: "hasUserInfo",
                data: true
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //获取本地账号缓存
    wx.getStorage({
      key: 'password',
      success: res => {
        console.log("初始化-获取缓存中账号",res)
        this.globalData.password = res.data;
      },
      fail: res => {
        console.log("初始化-获取缓存中账号",res)
        this.globalData.password = [];
      }
    })

    // 获取本地设置缓存
    wx.getStorage({
      key: 'userSet',
      success: res => {
        this.globalData.userSet.passwordCiphertext = res.data.passwordCiphertext;
        this.globalData.userSet.userAutomaticCloud = res.data.userAutomaticCloud;
        console.log("初始化-获取缓存中设置",res)
      },
      fail: res=>{
        this.globalData.userSet.passwordCiphertext = false;
        this.globalData.userSet.userAutomaticCloud = false;
        console.log("初始化-获取缓存中设置",res)
      }
    })

    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        console.log("初始化-获取系统信息",res);
        // 状态栏的高度
        this.globalData.StatusBar = res.statusBarHeight;
        // 获取菜单按钮（右上角胶囊按钮）的布局位置信息
        let capsule = wx.getMenuButtonBoundingClientRect(); 
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - res.statusBarHeight + 3;
        } else {
        	this.globalData.CustomBar = res.statusBarHeight + 50;
        }
      }
    })

    /**
     * 云端获取主题设置
     */
    this.getUserSet = async () => {
      const result = await new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'getUserSet',
          data: {},
          success: res => {
            console.log("成功调用app.js的getUserSet",res);
            resolve(true)
            if (res.result) {
              getApp().globalData.userSet.bgColor = res.result.bgColor;
              getApp().globalData.userSet.fontColor = res.result.fontColor;
            }
          }
        })
      })
      return result; 
    } 

    /**
     * 上传云端账号数据
     */
    this.uploadCloud = async (pass) => {
      const result = await new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'uploadCloud',
          data: { password: pass },
          success: res => {
            console.log("成功调用app.js的uploadCloud",res);
            if (res.result.stats.updated == 1) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      })
      return result;
    } 

  },

  globalData: {
    userInfo: null,
    version: "1.0.0",
    userSet: {
      // 👇存放在缓存
      passwordCiphertext:false,
      userAutomaticCloud:false,
      // 👇存放在云端
      bgColor: 'bg-gradual-blue',
      fontColor: 'font-black'
    }
  }

})
