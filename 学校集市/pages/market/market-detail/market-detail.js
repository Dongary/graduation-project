var postsData = require("../../../data/posts-data.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.setData({
      postId:postId
    })
    var postData = postsData.postList[postId];
    this.setData({
      postData:postData
    }) 

   var postsCollected = wx.getStorageSync("posts_collected")
   var postCollected = postsCollected[postId];
   if(postsCollected){
      if (postCollected){
        this.setData({
          collected:postCollected
        })
      }
   }  
   else {
     var postsCollected = {};
     postsCollected[postId] = false;
     wx.setStorageSync('posts_collected', postsCollected);
   }

   wx.playBackgroundAudio({
     dataUrl: postData.music.url,
     title: postData.music.title,
     coverImgUrl: postData.music.coverImg
   })

   var that = this;
   wx.onBackgroundAudioPlay(function(){
     that.setData({
       isPlayingMusic: true
     })
   })
   wx.onBackgroundAudioPause(function(){
     that.setData({
       isPlayingMusic: false
     })
   })
   wx.onBackgroundAudioStop(function(){
     that.setData({
       isPlayingMusic: false
     })
   })
  },
  onUnload(options){
    wx.pauseBackgroundAudio();
    this.setData({
      isPlayingMusic: false
    })
  },
  
  onMusicTap:function(event){
    var postId = this.data.postId;
    var postData = postsData.postList[postId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData ({
        isPlayingMusic:false
      })
    }
    else {
    
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayingMusic:true
      })
    }
  },

  onCollectionTap:function(event){
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;  
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData ({
      collected:postCollected
    })
    wx.showToast({
      title:postCollected?'收藏成功':'取消成功'
    })
  },

  onShareTap:function(event){
    wx.showActionSheet({
      itemList: [
        '分享到微信好友',
        '分享朋友圈',
        '分享到微博'
      ],
      itemColor:'#405f80',
      success:function(res){
        res.cancel
        res.tapIndex
      }
    })
  }  
  
})

