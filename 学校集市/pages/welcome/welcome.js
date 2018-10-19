Page({
  
  onLoad:function() {
    var that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var userName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            that.setData({
              userName: userName,
              avatarUrl: avatarUrl
            })
          }
        })
      }
    })
  },

  onTap:function(event){
    wx.switchTab({
      url: '../posts/post'
    })
  }
})