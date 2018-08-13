//index.js
//获取应用实例.
//var core = require("../api/core");
let imgurl = require("../api/config").imgurl
var app = getApp() 
var APPURL="https://wx.yzyy365.com/liteapp.html"
var url = app.globalData.h5url;
var API = require("../api/api")
var img = 'https://file.yzyy365.com'
Page({
   data: {
       login: false,
        page:1,
        loading:false,
        hasmore:true,
        queatdata: [],
        imgurl: imgurl,
        btnshow:false,
       imgUrls: [
           '../../images/bander.png'
       ],
       indicatorDots: true,
       autoplay: true,
       interval: 5000,
       duration: 1000,
       activeclor: 'rgba(0,0,0,.5)',
       color: 'eee',
       showModal: false
   },
    swiperChange(e) {
        // console.log(e)
    },
    /*
    * 轮播图点击跳转到专题
    * */
    skipDetails(e) {
        wx.navigateTo({url: `../special/special`})
    },
    /*
    * 已解答问题点击跳转到问题详情
    * */
    skipDetail(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({url: `./indexDetail?indexDetail=${id}`});
    },
    
   onLoad: function () {
       this.getDataFromServer(this.data.page);
    } ,
  loadMore: function () {
    this.setData({page: this.data.page + 1})
    // console.log("上拉拉加载更多...." + this.data.page)
    this.getDataFromServer(this.data.page)
  },
  //获取网络数据的方法
  getDataFromServer: function (page) {
    if (this.data.loading == true || this.data.hasmore==false){
      wx.showToast({
        title: '没有更多啦！',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    this.setData({
      loading: true,
    });
    let that_this = this;
    //调用网络请求
    app.httpClient(url+ '/njydt/liteapp.do' +"?page="+ page, (error, data) => {
      if (data.queryList != null && data.queryList.length!=0) {
          data.queryList.forEach( item => {
              item.askerHeadImg =`${img}${item.askerHeadImg}`
              item.images = item.images.map( iet => {
                  return [
                      `${img}${iet}`
                  ]
              })
          })
        let  quetionList = data.queryList;
        let curquedata = that_this.data.queatdata;
        if (curquedata != null && curquedata.length!=0){
          for (let j = 0; j < quetionList.length; j++){
            for (let i = curquedata.length - 1; i >= curquedata.length-10&&i>=0;i--){
                if (quetionList[j].questionUUID == curquedata[i].questionUUID){
                quetionList.splice(j,j+1);
                j--;
                break;
              }
            }
          }
        }
        curquedata.push.apply(curquedata, quetionList)
          curquedata.forEach(item => {
            if (item.location) {
              if (item.location.indexOf('区') > -1) {
                item.location = item.location.slice(0, item.location.indexOf('区') + 1)
              } else if (item.location.indexOf('县') > -1) {
                item.location = item.location.slice(0, item.location.indexOf('县') + 1)
              } else if (item.location.indexOf('市') > -1) {
                item.location = item.location.slice(0, item.location.indexOf('市') + 1)
              } else if (item.location.indexOf('省') > -1) {
                item.location = item.location.slice(0, item.location.indexOf('省') + 1)
              }
            }
          })
        that_this.setData({ queatdata: curquedata, loading: false})

          // console.log(that_this.data.queatdata, 11)
      } else {
        that_this.setData({
          loading: false,
          hasmore:false
        });
        wx.showToast({
          title: '没有更多啦！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onShareAppMessage: function () { 
      return {

        title: '农技一点通',

        desc: '云种养优质问题',

        path: '/pages/index/index'

      }

    },
    onShow() {

    },
    /*
    * 授权登录
    * */
    bindgetuserinfo(e) {
        wx.setStorageSync("user", e.detail);
        this.gonext()
    },
    comsHander() {
        API.API.checkuserStatus(url, (res) => {
            if(res.data.code === 100 && wx.getStorageSync("uuid")) {
                wx.hideLoading()
                wx.navigateTo({
                    url: `../sign/sign`
                })
            } else {
                API.API.getBind(url, (res) => {
                    wx.setStorageSync("uuid", res.data.data.uuid)
                    wx.hideLoading()
                    wx.navigateTo({
                        url: `../sign/sign`
                    })
                })
            }
        })
    },
    gonext(){
        // 先判断是否登录
        if (wx.getStorageSync("user")) {
            wx.showLoading({
                title: '加载中',
            })
            if (wx.getStorageSync("sessionId")) {
                this.comsHander()
            } else {
                API.API.getSessionId(url, () => {
                    this.comsHander()
                })
            }
        } else {
            this.setData({
                showModal : true
            })
        }
    },
    jujue() {
        this.setData({
            showModal : false
        })
    },

}) 
