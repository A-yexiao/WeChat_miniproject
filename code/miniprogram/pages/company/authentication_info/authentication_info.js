// pages/authentication_info/authentication_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let active = options.active?options.active:'1'
    if(active==1){
      this.setData({
        btn:1
      })
    }
    this.get_authentication_info(options.id,active)
  },
  get_authentication_info(id,active){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:'get_pending_company_id',
        data:{
          id,
          active
        }
      }
    }).then(res=>{
      wx.hideLoading()
      this.setData({
        info: res.result.arr.data[0]
      })
    })
  },
  // 审核成功
  onResolve(){
    wx.showLoading({
      title: '请稍后...',
    })
    wx.cloud.callFunction({
      name:'fn_admin',
      data:{
        fn:'add_company',
        data:{
          data:this.data.info
        }
      }
    }).then(res=>{
      wx.hideLoading()
      if(res.result.result_data.code==200){
        wx.showToast({
          title: '已处理',
          icon:'success'
        })
      }
      else{
        wx.showToast({
          title: '网络错误',
          icon:'error'
        })
      }
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1000)
    })
  },
  // 未通过
  onReject(e){
    wx.showLoading({
      title: '请稍后...',
    })
    let comment = e.detail.value.comment
    if(comment==''){
      return wx.showToast({
        title: '留下意见',
        icon:'error'
      })
    }
    let newData = this.data.info
    newData.comment = comment
    wx.cloud.callFunction({
      name:'fn_admin',
      data:{
        fn:'add_fail_company',
        data:{
          data:newData
        }
      }
    }).then(res=>{
      wx.hideLoading()
      if(res.result.result_data.code==200){
        wx.showToast({
          title: '已处理',
          icon:'success'
        })
      }
      else{
        wx.showToast({
          title: '网络错误',
          icon:'error'
        })
      }
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1000)
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