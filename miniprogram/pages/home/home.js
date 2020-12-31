const app = getApp();
Page({
  data: {
    list: [],//主页显示数据
    version: app.globalData.version//版本信息
  },

  onLoad: function() {
    let _this=this;
    //获取小程序新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // console.log(res.hasUpdate)
      if (res.hasUpdate){
        wx.showModal({
          title: '版本' + _this.data.version + '已更新',
          content: '点击版本号查看更新日志',
          showCancel: false
        })
      }
    })


  },

  onShow: function () {
    this.setData({
      list: app.globalData.password,
      bgColor: app.globalData.userSet.bgColor,
      passwordCiphertext: app.globalData.userSet.passwordCiphertext
    })
  },
  // 添加
  addpassword() {
    wx.navigateTo({
      url: '../add/add',
    })
  },
  // 我的
  setting() {
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  // 关于
  about(){
    wx.navigateTo({
      url: '../about/about',
    })
   },

  // 搜索功能
  bindinput(e){
    let keyWord = e.detail.value;
    let arr = [];
    for (var i = 0; i < app.globalData.password.length; i++) {
      //如果字符串中不包含目标字符会返回-1
      if (app.globalData.password[i].name.indexOf(keyWord) >= 0) {
        arr.push(app.globalData.password[i]);
      }
    }
    this.setData({
      list:arr
    })
  },

  // 复制名称
  copyname(e){
    console.log(e)
    wx.setClipboardData({
      data: e.target.dataset.copy,
      success(res) {
      }
    })
  },
  //复制账号
  copynicename(e){
    wx.setClipboardData({
      data: e.target.dataset.copy,
      success(res) {
      }
    })
  },
  //复制密码
  copypassword(e){
    wx.setClipboardData({
      data: e.target.dataset.copy,
      success(res) {
      }
    })
  },
  /**
   * 数据右上角管理菜单
   */
  menu(e) {
    //解决安卓无取消按钮
    let system = wx.getSystemInfoSync()
    let itemList = ['编辑', '删除']
    if (/android/i.test(system.platform)) {
      itemList.push('取消')
    }
    //调用API显示操作菜单
    wx.showActionSheet({
      itemList,
      success: res => {
        console.log('点击的索引',e)
        if (res.tapIndex === 0) {
          // 执行page的update函数
          this.update(e.target.dataset.index)
        } else if (res.tapIndex === 1) {
          // 执行page的delete函数
          this.delete(e.target.dataset.index)
        }
      }
    })
  },
  //编辑
  update(num) {
    wx.navigateTo({
      url: '../add/add?data=' + JSON.stringify(app.globalData.password[num]) + '&passwordnum=' + num,
    })
  },
  
  //删除
  delete(num) {
    let that = this;
    this.setData({
      moda: false
    })
    //调用API显示模态对话框
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      confirmColor: '#ce0532',
      success(res){
        // 选择确定
        if (res.confirm) {
          app.globalData.password.splice(that.data.num, 1);
          wx.setStorage({
            key: "password",
            data: app.globalData.password
          });
          that.onShow();
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这是一个帮助您记录密码的小工具，安全简洁，支持指纹验证噢，呐 ~',
      path: '../check/check',
      imageUrl: '../../images/fx.png',
    }
  }
})