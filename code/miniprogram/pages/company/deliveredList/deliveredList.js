// pages/company/deliveredList/deliveredList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDeliveredList(options.id)
  },
  getDeliveredList(id){
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:'get_deliveredALL',
        data:{
          company_id:id
        }
      }
    }).then(res=>{
      let data = res.result
      data.map(v=>{ //进行遍历 
        db.collection('resume').doc(v.resume_id).get().then(res=>{ //将其对应在resume集合中的简历信息
          v.resume = res.data;  //挂到当前项
          let d = new Date(v.created_at);
          v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';  //时间格式化
          this.setData({  //追加当前值
            list : this.data.list.concat(v)
          })
        })
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