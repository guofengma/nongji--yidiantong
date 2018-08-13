// //index.js
// //获取应用实例
// var app = getApp()
// //var core = require("../api/core");
// let imgurl = require("../api/config").imgurl;
// const ImageUploader = require('../common/image_uploader.js');
// var wetoast = require("../../utils/toast/wetoast.js");
// var validate = require("../../utils/validate").validate
// var formatdate = require("../../utils/util").formatDate;
// var url = app.globalData.h5url;
// Page({
//     data: {
//       userpic: imgurl+"1.png",
//       username:'点击登录',
//       imgurl: imgurl
//     },
//     bindgetuserinfo(e) {
//         wx.setStorageSync("user", e.detail);
//         this.setData({
//             username: e.detail.userInfo.nickName,
//             userpic: e.detail.userInfo.avatarUrl
//         });
//         wx.login({
//             success: (res) => {
//                 app.httppost(app.globalData.h5url + "accountspydt/login.do", { code: res.code }, (res) => {
//                     wx.setStorageSync("sessionId", res.sessionKey);
//                     /*
//                     * 判断是否绑定手机号
//                     * */
//                     app.httpget(app.globalData.h5url +"/wxydt/checkBindUnionid.do",{},(res) => {
//                         if(res.code==100){//已经绑定 登录
//                             app.storeUserInfo(res.data);
//                             // wx.navigateTo({url: `../sign/sign`})
//                         }else if(res.code==301){//未绑定
//                             wx.navigateTo({
//                                 url: "/pages/bphone/bphone?bindId="+res.data.bindId
//                             });
//                         }else if(res.code==302){//未保存用户
//                             console.log(res.code, 302)
//                             let data = { encryptedData: wx.getStorageSync("user").encryptedData, iv:wx.getStorageSync("user").iv };
//                             app.httppost(app.globalData.h5url +"/wxspydt/decryData.do", data, (res) => {
//                                 if(res.code == 100) {
//                                     wx.navigateTo({
//                                         url: "/pages/bphone/bphone?bindId="+res.data.bindId
//                                     });
//                                 }
//                             });
//                         } else if (res.code == 102){
//                             wx.showToast({
//                                 title: '账号异常',
//                                 icon: 'none'
//                             })
//                         }
//                     })
//
//
//                 })
//             },
//             fail: (erro) => {
//                 wx.showToast({ title: '微信登录失败', icon: 'none', duration: 2000 })
//             }
//         })
//     },
//     onShow() {
//         if(wx.getStorageSync("user")){
//             let user = wx.getStorageSync("user")
//             this.setData({
//                 username: user.userInfo.nickName,
//                 userpic: user.userInfo.avatarUrl
//             });
//         }
//     }
// })

//index.js
//获取应用实例
var app = getApp()
let imgurl = require("../api/config").imgurl;
var API = require("../api/api")
var url = app.globalData.h5url;
Page({
    data: {
        userpic: imgurl + "1.png",
        username: '点击登录',
        imgurl: imgurl
    },
    conHander() {
        API.API.checkuserStatus(url, (res) => {
            if(res.data.code === 100 && wx.getStorageSync("uuid")) {
                wx.hideLoading()
                wx.navigateTo({
                    url: `../questionslist/questionslist`
                })
            } else {
                API.API.getBind(url, (res) => {
                    wx.setStorageSync("uuid", res.data.data.uuid)
                    wx.hideLoading()
                    wx.navigateTo({
                        url: `../questionslist/questionslist`
                    })
                })
            }
        })
    },
    /*
    * 跳转到我的提问列表
    * */
    skipQuestionlist(e) {
        // 先判断是否登录
        if (wx.getStorageSync("user")) {
            wx.showLoading({
                title: '加载中',
            })
            if (wx.getStorageSync("sessionId")) {
                this.conHander()
            } else {
                API.API.getSessionId(url, () => {
                    this.conHander()
                })
            }
        } else {
            wx.showToast({
                title: '您还没有登录',
                icon: 'none',
                duration: 2000
            })
        }
    },
    monHander() {
        API.API.checkuserStatus(url, (res) => {
            if( res.data.code === 100 && wx.getStorageSync("uuid")){
                return;
            } else {
                API.API.getBind(url, (res) => {
                    wx.setStorageSync("uuid", res.data.data.uuid)
                })
            }
        })
    },
    /*
    * 登录获取用户信息
    * */
    bindgetuserinfo(e) {
        wx.setStorageSync("user", e.detail);
        this.setData({
            username: e.detail.userInfo.nickName,
            userpic: e.detail.userInfo.avatarUrl
        });
        if (wx.getStorageSync("user")) {
            if (wx.getStorageSync("sessionId")) {
                this.monHander()
            } else {
                API.API.getSessionId(url, () => {
                    this.monHander()
                })
            }
        }
    },
    onShow: function () {
        if (wx.getStorageSync("user")) {
            let user = wx.getStorageSync("user")
            this.setData({
                username: user.userInfo.nickName,
                userpic: user.userInfo.avatarUrl
            });
        }
    }
})