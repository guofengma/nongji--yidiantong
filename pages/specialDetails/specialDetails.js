// pages/specialDetails/specialDetails.js
var time = require('../../utils/time.js');
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
var url = app.globalData.h5url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      url: url,
      title: '',
      tixi: '油料产业体系',
      time: '',
      img: '',
      content: '',
      ss: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */



    onLoad: function (options) {
      wx.request({
          url: `${url}/getYdtNewsMesDetail.do`, //仅为示例，并非真实的接口地址
          data: {
              newsUuid: options.id
          },
          header: {
              'content-type': 'application/json' // 默认值
          },
          success: (res) => {
              let article = res.data.model.newsMes.content
              this.setData({
                  title: res.data.model.newsMes.title,
                  time: time.toDate((res.data.model.newsMes.startTime.time) / 1000),
                  img: this.data.url+res.data.model.newsMes.titleImg,
                  content: WxParse.wxParse('article', 'html', article, this)
              })
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {

          title: '农技一点通',

          desc: '云种养油料专题详情',

          path: '/pages/specialDetails/specialDetails'

      }
  }
})