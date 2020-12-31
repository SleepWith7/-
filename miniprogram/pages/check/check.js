const app = getApp();
Page({
  data: {
    keyboard:true, // 键盘开关
    number:[[1,2,3],[4,5,6],[7,8,9],[]], // 数字键
    pass: [null, null, null, null], // 输入的密码
    passnum:0, // 输入的位数
    userpass:[], // 得到密码
    title:'',
  },

  onLoad: function (options) {
    wx.getStorage({
      key: 'user_password',
      success: res => {
        console.log("得到登录密码",res)
        this.setData({
          title: '',
          userpass: res.data
        })
      },
      fail: res => {
        console.log("得到登录密码",res)
        this.setData({
          title: '请先设置登录密码',
        })
      }
    });
    // if (app.globalData.unlock) {
    //   wx.redirectTo({
    //     url: '../home/home'
    //   })
    // } else {
    //   this.startAuth();
    // }
  },

  // 按键事件
  num(e){
    // 如果已满则返回
    if (this.data.passnum == 4) {
      return false;
    }
    // console.log(typeof(e.target.dataset.num)); 

    let pass = this.data.pass; // 已输入密码
    let passnum = this.data.passnum; // 已输入位数
    pass.splice(passnum, 1, e.target.dataset.num);
    this.setData({
      pass: pass,
      passnum: passnum + 1 
    }) 
    
    // 进行验证
    if (this.data.passnum == 4) {
      // 未设置密码
      if (this.data.userpass.length !=4 ){
        wx.setStorage({
          key: "user_password",
          data: this.data.pass
        })
        wx.showModal({
          title: '提示',
          content: '忘记密码将无法使用本程序',
          showCancel:false,
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../home/home'
              })
            } 
          }
        })
      }
      // 已设置密码
      else{
        if (this.data.pass.toString() == this.data.userpass.toString()) {
          wx.redirectTo({
            url: '../home/home'
          })
        }
        else{
          wx.showToast({
            title: '密码错误，请重新输入',
            icon: 'none',
            duration: 1000
          })
          setTimeout(()=>{
            this.setData({
              pass: [null, null, null, null],
              passnum: 0,
            })
          },1000) 
        }
      }
    }

  },

  // Del事件 清空
  del(){
    this.setData({
      pass: [null, null, null, null],
      passnum: 0,
    })
  },

  // 指纹事件 生物认证
  startAuth() {
    // 获取本机支持的 SOTER 生物认证方式
    wx.checkIsSupportSoterAuthentication({
      success: (res) => {
        console.log('本机支持指纹解锁',res)
        checkIsEnrolled()  // 检查是存在指纹
      },
      fail: (err) => {
        console.error('本机不支持指纹解锁',err)
        this.setData({
          keyboard: true // 显示键盘
        })
      }
    })

    // 检查是否存在指纹
    const checkIsEnrolled = () => {
      // 获取设备内是否录入如指纹等生物信息的接口
      wx.checkIsSoterEnrolledInDevice({
        checkAuthMode: 'fingerPrint',
        success: (res) => {
          console.log(res)
          if (parseInt(res.isEnrolled) <= 0) {
            wx.showModal({
              title: '错误',
              content: '您暂未录入指纹，请录入后使用指纹解锁',
              showCancel: false
            })
            this.setData({
              keyboard: true // 显示键盘
            })
            return
          }else{
            startSoterAuthentication(); // 进行生物认证
          }
        },
        fail: (err) => {
          console.error(err)
        }
      })
    }

    // 生物认证方法
    const startSoterAuthentication = () => {
      // 开始 SOTER 生物认证
      wx.startSoterAuthentication({
        requestAuthModes: ['fingerPrint'],
        challenge: 'password',
        authContent: '请用指纹解锁',
        success: res => {
          console.log('生物认证成功',res)
          app.globalData.fingerPrint = true;
          wx.redirectTo({
            url: '../home/home'
          })
        },
        fail: err => {
          console.error('生物认证失败',err)
          wx.showModal({
            title: '提示',
            content: '指纹认证失败',
            confirmText:'重试指纹',
            cancelText:'密码解锁',
            success: res => {
              if (res.confirm) {
                console.log('重新认证',res)
                this.startAuth();
              } 
              else if (res.cancel) {
                console.log('密码解锁',res)
                this.setData({
                  keyboard:true
                })
              }
            }
          })
        }
      })
    }

  },

})