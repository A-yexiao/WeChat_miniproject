// pages/check_swiper/check_swiper.js
const md5 = require('../../vendor/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 删除图片
  delete_pic(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除图片？',
      success: res => {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index;
          let arr = this.data.one.pics;
          let one = arr.splice(index, 1);
          this.setData({
            'one.pics': arr
          })
          console.log(one);
          //网络清除图片
          wx.showLoading({
            title: '正在删除',
          })
          wx.cloud.callFunction({
            name: 'eval',
            data: {
              fn: 'delete_file',
              fileList: [one[0].image]
            }
          }).then(res => {
            wx.hideLoading();
          })
        } else {}
      }
    })
  },

  // 图片上移
  up(e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.one.pics;
    let tmp = arr[index - 1];
    arr[index - 1] = arr[index];
    arr[index] = tmp;
    this.setData({
      'one.pics': arr
    })
  },
  // 图片下移
  down(e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.one.pics;
    let tmp = arr[index + 1];
    arr[index + 1] = arr[index];
    arr[index] = tmp;
    this.setData({
      'one.pics': arr
    })
  },

  // 自定义上传图片
  upload_pic(e) {
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: res => {
        wx.showLoading({
          title: '正在上传',
          mask: true
        })
        var num = 0;
        if (res.tempFilePaths.length > 0) {

          var pics = this.data.one.pics || [];

          for (let i = 0; i < res.tempFilePaths.length; i++) {
            //向网络发送
            wx.cloud.uploadFile({
              cloudPath: md5(new Date().valueOf() + '_' + Math.random()),
              filePath: res.tempFilePaths[i], // 文件路径
              success: o => {
                console.log(o.fileID);
                pics.push(o.fileID)
                num = num + 1;
                if (num == res.tempFilePaths.length) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '全部上传成功',
                  })
                  this.setData({
                    'one.pics': pics
                  })
                }
              }
            })
          }
        }
      }
    })
  },




  // 保存单条
  save() {
    if (!this.data.one.pics.length) {
      wx.showToast({
        title: '不能为空',
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
        fn: 'update_swiper',
        one: one
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../index/index',
        })
      },1000)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('swiper').get()
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