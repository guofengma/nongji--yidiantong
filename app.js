
var crypto = require("utils/cryptojs").Crypto;
App({ 
  data:{
    bool:true
  },
   httpClient( url, callback ) {
    wx.request( {
      url,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function( res ) {
        callback( null, res.data )
      }
      , fail: function( error ) {
        callback( error )
      }, complete:function(res){
      }
    })
  },

  getUserInfo:function(cb){
    var that = this
   
  },
  storeUserInfo:function(obj){
    var user = wx.getStorageSync('user');
    if(user==null||user==""){
      user={};
    }
    let objkeys = Object.keys(obj);
    for(var key in objkeys){
      user[objkeys[key]] = obj[objkeys[key]];
    }
    wx.setStorageSync("user",user);
  },
  getStoreUserInfo:function(){
    return wx.getStorageSync('user');
  },
  login:function(){
    let this_app = this;
    if (this_app.globalData.sessionInvalid == true){
      if (this_app.globalData.logined == false){
        this_app.checkBind();
      }
    }else{
      function login_login(){
        wx.login({
          success: function (res) {
            this_app.httppost(this_app.globalData.h5url + "accountspydt/login.do", { code: res.code }, function (res) {

              wx.setStorageSync("sessionId", res.sessionKey);
              this_app.globalData.sessionInvalid = true;
              this_app.checkBind();
            })
          },
          fail: function () {
            wx.showToast({ title: '微信登录失败', icon: 'none', duration: 2000 })
          }
        })
      }
      wx.checkSession({
        success: function () {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {

              this_app.globalData.userInfo = res.userInfo;
              this_app.httpget(this_app.globalData.h5url + "/wxspydt/checkuser.do",
              { rawData: res.rawData, signature: res.signature},
              function (res) {
                if (res.code == 100) {
                  this_app.globalData.sessionInvalid = true;
                  this_app.checkBind();
                } else {
                  wx.clearStorageSync();
                  login_login();
                }

              })
            }, fail: function () {
              wx.showToast({
                title: '无法获取用户信息',
                icon:"none"
              });
              wx.openSetting({

              });
            }
          })
        },
        fail: function () {
          this_app.globalData.sessionInvalid = false;
          wx.clearStorageSync();
          login_login();
        }
      });
    }
  },
  decrydata:function(callback){
    let this_app = this;
    wx.getUserInfo({
      withCredentials: true,
      lang: "zh_CN",
      success: function (res) {
        this_app.globalData.userInfo = res.userInfo;
        let data = { encryptedData: res.encryptedData, iv:res.iv };
        this_app.httppost(this_app.globalData.h5url +"/wxspydt/decryData.do", data, function (rdata) {
          if(callback!=null){
            callback(rdata)
          }
        });
      },
      fail:function(){
        wx.showToast({
          title: '无法获取用户信息',
          icon: "none"
        });
        wx.openSetting({

        });
      }
    })
    
  },
  checkBind:function(){
    let that_app = this;
    //是否绑定云种养
    this.httpget(that_app.globalData.h5url +"/wxydt/checkBindUnionid.do",{},function(res){
        // console.log(res.code, 77)
        if(res.code==100){//已经绑定 登录
          that_app.storeUserInfo(res.data);
          that_app.globalData.logined=true;
        }else if(res.code==301){//未绑定
          wx.navigateTo({
            url: "/pages/bphone/bphone?bindId="+res.data.bindId
          });
        }else if(res.code==302){//未保存用户
          that_app.decrydata(function(data){
            wx.navigateTo({
              url: "/pages/bphone/bphone?bindId=" + res.data.bindId
            });
          })
        } else if (res.code == 102){
          that_app.login();
        }
    })

  },
  httppost: function (url,data,callback) {
    let sessionid = wx.getStorageSync("sessionId");
    let header = { "content-type":"application/x-www-form-urlencoded"}
    if(sessionid!=null){
      header.sessionkey = sessionid;
      header.Cookie = 'JSESSIONID=' + sessionid;
    }
    wx.request({
      url: url,
      data:data,
      header: header,
      method:"POST",
      success:function(res){
        if (res.statusCode=="200"){
          if(callback!=null){
            callback(res.data);
          }
        }
      },
      fail:function(){
        wx.showToast({
          title: '请求失败',
          icon:'none'
        })
      }
    })
  },
  httpget: function (url, data,callback) {
    let sessionid = wx.getStorageSync("sessionId");
    let header = {};
    if (sessionid != null) {
      header.sessionkey = sessionid;
      header.Cookie = 'JSESSIONID=' + sessionid;
    }
    wx.request({
      url: url,
      data: data,
      header: header,
      method: "get",
      success: function (res) {
        if (res.statusCode == "200") {
          if (callback != null) {
            callback(res.data);
          }
        }
      },
      fail: function () {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    })
  },
  createSign:function(data,secret){
    if(data!=null){
      let keys = Object.keys(data).sort();
      let str = '';
      for(let i in keys){
        str=str+keys[i]+"="+data[keys[i]]+"&";
      }
      if(str.length>0){
        str = str.substring(0,str.length-1);
      }
      return crypto.HMAC(crypto.SHA256, str, secret)
    }

  },
  onShow: function (options){
    this.globalData.btnscene = options.scene
   
  },
  globalData:{
    sessionId:null,
    userInfo:null,
    sessionInvalid:false,
    logined:false,
    h5url: "https://h5.yzyy365.com/",
      // h5url: 'http://192.168.66.102:8080/grow-yzyy/',
    btnscene:'',
      typeid: '',
      name: ''

  }
})