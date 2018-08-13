// pages/recognition/recognition.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      img: '',
      name: '',
      width: '',
      height: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      wx.getImageInfo({
          src: options.img,
          success:  (res) => {
              let str = res.width / res.height;//图片的宽高比
              let c = 750 / 600
              if(str > c){//横版图片
                  this.setData({
                      width: 750,
                      height: 750 / str
                  })

              }else{//竖版图片
                  this.setData({
                      height: 600,
                      width: str * 600
                  })
              }
          }
      })
      this.setData({
          img: options.img,
          name: options.name
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
  onShareAppMessage(){
    console.log(this.data)
    return {
      title: '农技一点通',
      desc: '拍照识物',
      path: `/pages/recognition/recognition?img=${this.data.img}&status=${this.data.status}`
    }
  }
})