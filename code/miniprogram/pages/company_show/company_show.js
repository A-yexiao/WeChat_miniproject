// pages/company_show/company_show.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one: {},
    list: [],
    page: 1,
  },
  // 获取公司职位列表
  fetch() {
    wx.showLoading({
      title: '正在加载',
    })
    db.collection('position')
      .where({
        'company._id': this.data.one._id
      })
      .count().then(res => {
        this.setData({
          total: res.total
        })
      })
    db.collection('position')
      .where({
        'company._id': this.data.one._id
      })
      .skip((this.data.page - 1) * 20).limit(20)
      .orderBy('created_at', 'desc')
      .get().then(res => {
        wx.hideLoading();
        let list = res.data.map(v => {
          let d = new Date(v.created_at);
          v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
          return v;
        })
        console.log(res);
        this.setData({
          list: this.data.list.concat(list)
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _id = options._id;
    this.setData({
      'one._id': _id
    })

    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'get_user_info',
        field: {
          is_admin: true
        }
      }
    }).then(res => {
      this.setData({
        user_info: res.result.user.data[0]
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
    db.collection('company').doc(this.data.one._id).get()
      .then(res => {
        console.log(res);
        this.setData({
          one: res.data,
          list: [],
          page: 1,
        })
        this.fetch();
      })
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