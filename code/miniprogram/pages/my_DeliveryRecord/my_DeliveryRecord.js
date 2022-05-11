// pages/my_collection/my_conllection.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page: 1,
    errorMssage:''
  },

  // 获取投递的职位
  async get_DeliveryRecord(){
    await wx.cloud.callFunction({
      name:'fn_user',
      data:{
        fn:'get_DeliveryRecord'
      }
    })
    .then(res=>{
      let list = res.result
      if(list.length == 0){
        this.setData({
          errorMssage:'暂无收藏'
        })
      }
      else{
        for(let i=0;i<list.length;i++){
          wx.showLoading({
            title: '正在加载',
          })
          db.collection('position').where({
            _id:list[i]}).get().then(r=>{
            let data = r.data
            wx.hideLoading();
            let list = data.map(v => {
                let d = new Date(v.created_at);
                v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
                return v;
              })
            this.setData({
              list: this.data.list.concat(list)
            })
          })
        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options)
      this.get_DeliveryRecord()
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