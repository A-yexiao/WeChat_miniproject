// page/check_user/check_user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    users: [],
  },
  cancel_admin(e) {
    wx.showLoading({
      title: '正在设置',
    })
    let _id = e.currentTarget.dataset._id;
    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'update_user',
        one: {
          _id: _id,
          is_admin: 0
        }
      }
    }).then(res => {
      wx.hideLoading();
      let users = this.data.users;
      users = users.map(v => {
        if (v._id == _id) {
          v.is_admin = 0
        }
        return v;
      })
      this.setData({
        users: users
      })
    })
  },

  set_admin(e) {
    wx.showLoading({
      title: '正在设置',
    })
    let _id = e.currentTarget.dataset._id;
    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'update_user',
        one: {
          _id: _id,
          is_admin: 1
        }
      }
    }).then(res => {
      wx.hideLoading();
      let users = this.data.users;
      users = users.map(v => {
        if (v._id == _id) {
          v.is_admin = 1
        }
        return v;
      })
      this.setData({
        users: users
      })
    })
  },
  fetch() {
    wx.showLoading({
      title: '正在加载',
    })
    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'get_user',
        page: this.data.page,
      }
    }).then(res => {
      wx.hideLoading();
      this.setData({
        total_number: res.result.total,
        users: this.data.users.concat(res.result.users)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetch();
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
    if (this.data.page * 20 < this.data.total_number) {
      this.setData({
        page: this.data.page + 1
      })
      this.fetch();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})