var COS = require('../../utils/cos-wx-sdk-v5')
var config = require('../../utils/config')

var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数


    // 方法二（适用于前端调试）
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});

var requestCallback = function (err, data) {
  console.log(err || data);
  if (err && err.error) {
    wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
  } else if (err) {
    wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
  } else {
    wx.showToast({ title: '请求成功', icon: 'success', duration: 3000 });
  }
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    diuBtnShow: false,
    jianBtnShow: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  lostProperty: function() {
    this.setData({
      diuBtnShow: true,
      jianBtnShow: false,
      userdatakey: "lostProperty"
    })
  },
  heritage:function() {
    this.setData({
      diuBtnShow: false,
      jianBtnShow: true,
      userdatakey: "heritage"
    })
  },
  formSubmit: function (event) {
    var that = this;
    var userdata = [];
    var myDate = new Date();
    var year = myDate.getFullYear().toString();
    var month = myDate.getMonth();
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var Key = this.data.Key;
    Key = "	https://secondary-market-1256334789.cos.ap-beijing.myqcloud.com/" + Key
    month = month + 1;
    month = month.toString();
    var date = myDate.getDate().toString();
    var time = year + "年" + month + "月" + date + "日" + hours + "时" + minutes + "分";
    var location = event.detail.value.location;
    var title = event.detail.value.title;
    var content = event.detail.value.content;
    var diuBtnShow = this.data.diuBtnShow;
    var jianBtnShow = this.data.jianBtnShow;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var userName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var userdatakey = that.data.userdatakey
        var temp = {
          userName: userName,
          avatarUrl: avatarUrl,
          time: time,
          location: location,
          title: title,
          Key: Key,
          content: content,
        }
        if (userdatakey === undefined) {
          wx.showToast({
            title: '领域没有选择',
            icon: 'loading',
            duration: 2000
          })
        } else if (diuBtnShow === true) {
          if (location.length === 0) {
            wx.showToast({
              title: '位置没有填写',
              icon: 'loading',
              duration: 2000
            })
          } else {
            if (content.length === 0) {
              wx.showToast({
                title: '描述没有填写',
                icon: 'loading',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '请稍后',
                icon: 'loading',
                duration: 4000
              })
              wx.getStorage({
                key: 'lostProperty',
                success: function (res) {

                  if (userdatakey == "lostProperty") {
                    userdata = res.data;
                    userdata.unshift(temp);
                    wx.setStorageSync("lostProperty", userdata);
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success',
                      duration: 3000
                    })
                    that.webimgurl();
                    wx.switchTab({
                      url: '../posts/post'
                    })
                  }
                },
                fail: function (res) {

                  if (userdatakey == "lostProperty") {
                    userdata.unshift(temp);
                    wx.setStorageSync("lostProperty", userdata);
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success',
                      duration: 3000
                    })
                    that.webimgurl();
                    wx.switchTab({
                      url: '../posts/post'
                    })
                  }
                }
              })
            }
          }
        } else if (jianBtnShow === true) {
          if (title.length === 0) {
            wx.showToast({
              title: '主题没有填写',
              icon: 'loading',
              duration: 2000
            })
          } else {
            if (content.length === 0) {
              wx.showToast({
                title: '描述没有填写',
                icon: 'loading',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '请稍后',
                icon: 'loading',
                duration: 4000
              })
              wx.getStorage({
                key: 'heritage',
                success: function (res) {

                  if (userdatakey == "heritage") {
                    userdata = res.data;
                    userdata.unshift(temp);
                    wx.setStorageSync("heritage", userdata);
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success',
                      duration: 3000
                    })
                    that.webimgurl();
                    wx.switchTab({
                      url: '../market/market'
                    })
                  }
                },
                fail: function (res) {

                  if (userdatakey == "heritage") {
                    userdata.unshift(temp);
                    wx.setStorageSync("heritage", userdata);
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success',
                      duration: 3000
                    })
                    that.webimgurl();
                    wx.switchTab({
                      url: '../market/market'
                    })
                  }
                }
              })
            }
          }
        }
      }
    })
  },
  reset: function () {
    this.setData({
      diuBtnShow: false,
      jianBtnShow: false,
      imglist: []
    })

  },

  checkimg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var filePath = res.tempFilePaths[0]
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1);
        that.setData({
          imglist: tempFilePaths,
          filePath: filePath,
          Key: Key
        })
      }
    })
  },

  webimgurl: function () {
    var Key = this.data.Key;
    var filePath = this.data.filePath;
    cos.postObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: Key,
      FilePath: filePath,
      onProgress: function (info) {
        console.log(JSON.stringify(info));
      }
    }, requestCallback);
  }

})