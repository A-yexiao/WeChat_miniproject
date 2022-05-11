// pages/my_record_list/my_record_list.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftShow: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是哪一个页面过来的  type
    if (options.type) {
      this.setData({
        leftShow: '1'
      })
    }
    if (options.position_id) {
      this.setData({
        position_id: options.position_id
      })
    }
  },
  // 添加简历
  add() {
    wx.navigateTo({
      url: '../edit_personal/edit_personal',
    })
  },
  // 选择简历
  async select(e) {
    let resume_id =  e.currentTarget.dataset.id
    let position_id = this.data.position_id
    // 弹出简历选择框，然后选择简历表
    // 简历表 resume_id
    await wx.cloud.callFunction({
      name: "fn_user",
      data: {
        fn: 'update_DeliveryRecord',
        data: {
          openid:App.globalData.openid,
          position_id: position_id,
          resume_id:resume_id
        }
      }
    }).then(res => {
      if (res.result.code == 200) {
        wx.showToast({
          title: res.result.msg,
          icon:'success'
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1000)
      }
    })
  },
  // 删除简历
  remove(e) {
    let removeid = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'fn_user',
      data: {
        fn: 'remove_record',
        id: removeid
      }
    }).then(res => {
      this.getRecordList(App.globalData.openid)
    })
  },
  getRecordInfo(e) {
    wx.navigateTo({
      url: '../edit_personal/edit_personal?id=' + e.currentTarget.dataset.id,
    })
  },

  // 获取用户所有简历
  getRecordList(openid) {
    wx.cloud.callFunction({
      name: "fn_user",
      data: {
        fn: 'get_record_list',
        data: {
          openid
        }
      }
    }).then(res => {
      res.result.data.map(v => {
        let d = new Date(v.created_at);
        v.time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();  //时间格式化
      })
      this.setData({
        recordList: res.result.data
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
    this.getRecordList(App.globalData.openid)
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