// pages/check_company_info/check_company_info.js
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
              pic: this.data.one.logo
            }
          }).then(res => {
            this.setData({
              'one.logo': ''
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
                    'one.logo': o.fileID
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
    if (!this.data.one.logo) {
      wx.showToast({
        title: 'logo不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.name) {
      wx.showToast({
        title: '公司名不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.desc) {
      wx.showToast({
        title: '公司描述不能为空',
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
        fn: 'update_company',
        one: one
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'none'
      })
    })

  },

  // 删除单条
  remove(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: res => {
        if (res.confirm) {
          let _id = e.currentTarget.dataset._id;
          wx.showLoading({
            title: '正在删除',
          })
          wx.cloud.callFunction({
            name: 'eval',
            data: {
              fn: 'remove_company',
              _id: _id,
              logo: this.data.one.logo
            }
          }).then(res => {
            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
            setTimeout(res => {
              wx.navigateBack({
                delta: 2,
              })
            }, 200)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  set_add_name(e) {
    this.setData({
      'one.name': e.detail.value
    })
  },
  set_add_desc(e) {
    this.setData({
      'one.desc': e.detail.value
    })
  },
  add() {
    if (!this.data.one.logo) {
      wx.showToast({
        title: '请上传logo',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.name) {
      wx.showToast({
        title: '请填写公司名',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.desc) {
      wx.showToast({
        title: '请填写公司描述',
        icon: 'none'
      })
      return;
    }

    wx.showLoading({
      title: '正在加载',
      icon: 'none'
    })
    let one = this.data.one;
    one.created_at = new Date().valueOf();
    one.position_number = 0;
    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'add_company',
        one: one
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })
      this.setData({
        'one.name': '',
        'one.desc': '',
        'one.logo': ''
      })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options._id) {
      const db = wx.cloud.database();
      db.collection('company').doc(options._id).get()
        .then(res => {

          this.setData({
            one: res.data
          })
        })
    }
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