//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userid:'',
    array: '[{"name": "试卷", "tname": "张si" }]'
  },
  onLoad: function (options) {
    this.setData({
       userid:options.user
    })
 var that=this;
    wx.request({
      url: 'http://localhost:8090/paper/searchpaper', // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        user: that.data.userid
      },
      success(res) {
         that.setData({
           array:res.data
         })
        console.log(that.data.array)
      }
    })
  },
  gopaper:function(e){
    var bean=e.currentTarget.dataset.id;
    var uid=this.data.userid;
    wx.navigateTo({
      url: '/pages/paper/paper?paperid=' +bean+"&userid="+uid
    })
   
  }

})
