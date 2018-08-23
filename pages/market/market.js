var postsData = require("../../data/posts-data.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    over: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      postList: postsData.postList
    })
    var that = this;
    wx.getStorage({
      key: 'heritage',

      success: function (res) {
        var postdata = res.data;
        postdata = postdata.slice(0, 3)
        that.setData({
          postdata: postdata
        })
      },

      fail: function (res) {
      }

    })
  },
  
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })

  },

  onSwiperTap:function(event){
    var postId = event.target.dataset.postid;

    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  onPullDownRefresh: function (event) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.getStorage({
      key: 'lostProperty',

      success: function (res) {
        console.log("success");
        var postdata = res.data;
        postdata = postdata.slice(0, 3)
        that.setData({
          postdata: postdata,
          over: 3
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },

      fail: function (res) {
        console.log("fail")
      }

    })

  },

  glideTap: function (event) {
    wx.showNavigationBarLoading()
    var over = this.data.over;
    var that = this;
    console.log(over)
    wx.getStorage({
      key: 'lostProperty',

      success: function (res) {
        var postdata = res.data;
        if (over >= postdata.length) {
          wx.showToast({
            title: '没有更多了',
            icon: 'loading',
            duration: 2000
          })
        } else {
          postdata = postdata.slice(0, over);
          that.setData({
            postdata: postdata,
            over: over + 3
          })
          wx.hideNavigationBarLoading();
        }

      },

      fail: function (res) {
      }

    })
  },

})