// pages/special/special.js
var time = require('../../utils/time.js');
// var url = app.globalData.h5url;
var app = getApp();
var url = app.globalData.h5url;
let imgurl = require("../api/config").imgurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      // url: 'http://192.168.66.102:8080/grow-yzyy',
      special: [],
      bg: false,
      imgurl: imgurl,
      src: '',
      currentPage: 1,
      pageCount: 0
  },
    specialDetails(e) {
      let id = e.currentTarget.dataset.id
        wx.navigateTo({url:`../specialDetails/specialDetails?id=${id}`})
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.request({
          url: `${url}/getOilNjtKyjzNewsMesList.do`,
          data: {
              pageIndex: this.data.currentPage
          },
          header: {
              'content-type': 'application/json'
          },
          success: (res) => {
              // console.log(res)
              if(res.data.model.list) {
                  res.data.model.list.forEach( item => {
                      item.tixi = '油料产业体系';
                      item.num = '';
                      item.time = time.toDate(item.startTime.time / 1000)
                  })
                  this.setData({
                      special: res.data.model.list,
                      src: res.data.model.imagePath,
                      pageCount: res.data.model.totalPages
                  })
              } else {
                  this.setData({
                      bg: true
                  })
              }
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
      if(this.data.pageCount >= this.data.currentPage+1) {
          this.data.currentPage ++
          wx.request({
              url: `${url}/getOilNjtKyjzNewsMesList.do`,
              data: {
                  pageIndex: this.data.currentPage
              },
              success: (res) => {
                  let arr = this.data.special
                  res.data.model.list.forEach( item => {
                      item.tixi = '油料产业体系';
                      item.num = '';
                      item.time = time.toDate(item.startTime.time / 1000)
                      arr.push(item)
                  })
                  this.setData({special: arr})
              }
          })
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {

          title: '农技一点通',

          desc: '云种养油料专题',

          path: '/pages/special/special'

      }
  }
})