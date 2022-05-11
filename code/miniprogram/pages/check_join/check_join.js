// pages/check_join/check_join.js
const md5 = require('../../vendor/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one: {}
  },
  // 删除图片
  remove_pic() {
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'eval',
            data: {
              fn: 'remove_pic',
              pic: this.data.one.poster
            }
          }).then(res => {
            this.setData({
              'one.poster': ''
            })
          })
        } else {}
      }
    })

  },
  //上传图片
  upload_pic(e) {
    wx.chooseImage({
      count: 1, // 选一张  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: res => {
        wx.showLoading({
          title: '正在上传',
          mask: true
        })
        var num = 0;
        if (res.tempFilePaths.length > 0) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            wx.cloud.uploadFile({
              cloudPath: md5(new Date().valueOf() + '_' + Math.random()),
              filePath: res.tempFilePaths[i], // 文件路径
              success: o => {
                console.log(o.fileID);
                num = num + 1;
                if (num == res.tempFilePaths.length) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '上传成功，稍候页面显示',
                    icon: 'none'
                  })
                  this.setData({
                    'one.poster': o.fileID
                  })
                }
              }
            })
          }
        }
      }
    })
  },
  set_phone(e) {

    this.setData({
      'one.phone': e.detail.value
    })
  },
  set_weixin(e) {
    console.log(e)
    this.setData({
      'one.weixin': e.detail.value
    })
    
  },

  // 保存单条
  save() {
    if (!this.data.one.poster) {
      wx.showToast({
        title: '海报不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.phone) {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.weixin) {
      wx.showToast({
        title: '微信不能为空',
        icon: 'none'
      })
      return;
    }

    wx.showLoading({
      title: '正在加载',
      icon: 'none'
    })
    let one = this.data.one;

    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'update_join',
        one: one
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../company/company',
        })
      }, 1000);
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('join').get()
      .then(res => {
        this.setData({
          one: res.data[0]
        })
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

  }
})