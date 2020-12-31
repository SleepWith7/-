const app = getApp()
Page({
  data: {
    ColorList: [
    {
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
  ],
  GradualColorList: [
  {
    title: '魅红',
    name: '#f43f3b - #ec008c',
    bg: 'bg-gradual-red',
    font: 'font-gradual-red'
  },
  {
    title: '鎏金',
    name: '#ff9700 - #ed1c24',
    bg: 'bg-gradual-orange',
    font: 'font-gradual-orange'
  },
  {
    title: '翠柳',
    name: '#39b54a - #8dc63f',
    bg: 'bg-gradual-green',
    font: 'font-gradual-green'
  },
  {
    title: '靛青',
    name: '#0081ff - #1cbbb4',
    bg: 'bg-gradual-blue',
    font: 'font-gradual-blue'
  },
  {
    title: '惑紫',
    name: '#9000ff - #5e00ff',
    bg: 'bg-gradual-purple',
    font: 'font-gradual-purple'
  },
  {
    title: '霞彩',
    name: '#ec008c - #6739b6',
    bg: 'bg-gradual-pink',
    font: 'font-gradual-pink'
  },]
  },

  // 纯色背景事件
  bindtapColorList(e){
    console.log(e.target.dataset.index)
    let bgColor = 'bg-' + this.data.ColorList[e.target.dataset.index].name;
    let fontColor = 'font-' + this.data.ColorList[e.target.dataset.index].name;
    console.log(bgColor,fontColor)
    this.bgColorUp(bgColor, fontColor)
  },

  // 渐变色背景事件
  bindtapGradualColorList(e){
    console.log(e.target.dataset.index)
    let bgColor = this.data.GradualColorList[e.target.dataset.index].bg;
    let fontColor = this.data.GradualColorList[e.target.dataset.index].font;
    console.log(bgColor,fontColor)
    this.bgColorUp(bgColor, fontColor)
  },

  // 记录更换设置
  bgColorUp(bgColor,fontColor){
    wx.showToast({
      title: '正在更新',
      icon: 'loading',
      duration: 60 * 1000,
      mask: true
    })
    app.globalData.userSet.bgColor = bgColor;
    app.globalData.userSet.fontColor = fontColor;

    // 调用云实现保存主题
    wx.cloud.callFunction({
      name: 'bgColor',
      data: { 
        bgColor: bgColor,
        fontColor: fontColor 
      },
      success: res => {
        console.log('主题设置成功',res)
        wx.hideToast()
        if (res.result.stats.updated == 1){
          wx.showToast({
            icon: 'none',
            title: '恭喜！更改外观成功~'
          })
          this.onShow()
        }else{
          wx.showToast({
            icon: 'none',
            title: '更改外观失败，请连接网络后再试'
          })
        }
      }
    })
    
  },

  onShow: function () {
    this.setData({
      bgColor: app.globalData.userSet.bgColor,
      fontColor: app.globalData.userSet.fontColor
    })
  }

})