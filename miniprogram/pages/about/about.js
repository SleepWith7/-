const app = getApp()
Page({
  data: {
    version:app.globalData.version
  },

  onShow: function () {
    this.setData({
      bgColor: app.globalData.userSet.bgColor,
      fontColor: app.globalData.userSet.fontColor
    })
  }

})