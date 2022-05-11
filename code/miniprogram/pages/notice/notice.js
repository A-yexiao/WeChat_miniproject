// pages/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyInfo:'',
    positionInfo:'',
  },


  // 获取企业是否审核失败
  getFailCompanyInfo(){
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:"get_fail_company"
      }
    }).then(res=>{
      let data = res.result.arr.data
      if(data.length==0){

      }
      else{
        let d = new Date(data[0].created_at);
        data[0].time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
        this.setData({
          companyInfo:data[0]
        })
      }
    })
  },
  getFailPositionInfo(){
   
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:"get_fail_postion"
      }
    }).then(res=>{
      let data = res.result.arr.data
      if(data.length==0){

      }
      else{
        let positionInfo = []
        data.map(v=>{
          let d = new Date(v.created_at);
          v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
          positionInfo = positionInfo.concat(v)
          this.setData({
            positionInfo
          })
        })
      }
      
    })
  },

  // 修改公司信息
  goCompanyInfo(){
    wx.navigateTo({
      url: '../company/authentication/authentication?id='+this.data.companyInfo.id+'&type=1',
    })
  },
  // 修改职位信息
  goPositionInfo(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../check_position/check_postion?_id='+id+'&fail_position=1',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
onLoad:  function (options) {
    
  },
  // 公司的职位或者公司申请 审核未通过的情况，
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      companyInfo:'',
      positionInfo:''
    })
    await this.getFailCompanyInfo()
    await this.getFailPositionInfo()
    wx.hideLoading()
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