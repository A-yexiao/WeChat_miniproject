// pages/check_type/check_type.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
  },

  // 选中
  active(e) {
    let _id = e.currentTarget.dataset._id;
    let list = this.data.list.map(v => {
      if (v._id == _id) {
        v.active = true
      } else {
        v.active = false
      }
      return v;
    })
    this.setData({
      list: list
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
              fn: 'remove_type',
              _id: _id
            }
          }).then(res => {
            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
            let list = this.data.list;
            this.setData({
              list: list.filter(v => v._id !== _id),
              total: this.data.total - 1
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 添加
  set_add_name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  add() {
    if (!this.data.name) {
      wx.showToast({
        title: '名称不能为空',
      })
      return;
    }
    wx.showLoading({
      title: '正在加载',
    })
    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'add_type',
        one: {
          name: this.data.name.trim(),
          created_at: new Date().valueOf()
        }
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })
      this.setData({
        name: '',
        list: []
      })
      this.fetch();
    })

  },
  // 获取列表
  fetch() {
    wx.showLoading({
      title: '正在加载',
    })
    db.collection('f_type').count().then(res => {
      this.setData({
        total: res.total
      })
    })
    db.collection('f_type')
      .skip((this.data.page - 1) * 20).limit(20)
      .orderBy('created_at', 'desc')
      .get().then(res => {
        wx.hideLoading();
        let list = res.data.map(v => {
          v.active = false
          return v;
        })
        this.setData({
          list: this.data.list.concat(list)
        })
      })
  },
  // 选好返回
  back() {
    let selected = [];
    this.data.list.forEach(v => {
      if (v.active) {
        let o = {}
        o._id = v._id;
        o.name = v.name
        selected.push(o)
      }
    })
    if (!selected.length) {
      wx.showToast({
        title: '选择为空',
        icon: 'none'
      })
      return;
    }
    const eventChannel = this.getOpenerEventChannel();
    wx.navigateBack({
      delta: 1,
      success: res => {
        eventChannel.emit('type_selected', selected);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.select) {
      this.setData({
        select: true
      })
    }
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
    if (this.data.page * 20 < this.data.total) {
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