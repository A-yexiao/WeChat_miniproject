// pages/delivered_info/delivered_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecord(options.id)
    // this.getRecord('5b049cc861dd42e8047acc940a4cc8e2')
  },
  getRecord(id){
    wx.cloud.callFunction({
      name:'fn_user',
      data:{
        fn:'get_record',
        id,
      }
    }).then(res=>{
      // 剔除最后一个值为 ''的元素
      // let  i = res.result.data.winnings.indexOf('')
      // console.log(i);
      // let a = res.result.data.winnings.splice(i,0);
      // console.log(a);
      // console.log(res.result.data.winnings);
      // i = res.result.data.workExps.indexOf('')
      // res.result.data.workExps.splice(i,0);
      this.setData({
        resume_info:res.result.data
      })
    })
  },
  // 根据传过来的职业id，对其获取，然后显示，排版未定
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