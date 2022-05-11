// pages/admin/admin_position/admin_position.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    position_list:[],
    position_listALL:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPositionList()
  },
  
  onSearch(e){
    let searchValue = e.detail.trim()
    if(searchValue){
       wx.cloud.callFunction({
        name:'fn_admin',
        data:{
          fn:'search_positionALL',
          data:{
            searchValue
          }
        }
      }).then(res=>{
        this.setData({
          position_listALL:res.result
        })
        this.showList(this.data.active)
      })
    }
    else{
      this.getPositionList()
    }
  },
  onCancel(){
    this.getPositionList()
  },
  onChange(e){
    this.setData({
      active:e.detail.index
    })
    this.showList(e.detail.index)
  },
  showList(id){
    let arr = [] 
    this.data.position_listALL.map(v=>{
      if(v.state==id){
        arr.push(v)
      }
    })
    this.setData({
      position_list:arr
    })
  },
  // 获取所有职位列表
  getPositionList(){
    wx.cloud.callFunction({
      name:'fn_admin',
      data:{
        fn:"get_positionALL"
      }
    }).then(res=>{
      this.setData({
        position_listALL:res.result
      })
      this.showList(this.data.active)
    })
  },
  remove_position(e){
    // 只是针对已经审核的进行删除
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: res => {
        if (res.confirm) {
          let _id = e.currentTarget.dataset.id;
          let company_id = e.currentTarget.dataset.company_id
          wx.showLoading({
            title: '正在删除',
          })
          // 删除分两种，已审核的职位删除和未审核的职位删除
          wx.cloud.callFunction({
            name: 'fn_admin',
            data: {
              fn: 'remove_position',
              data:{
                _id: _id,  //当前职位的id
                company_id:company_id
              }
            }
          }).then(res => {
            // return console.log(res);
            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
            setTimeout(res => {
              wx.navigateBack({
                delta: 1,
              })
            }, 200)
          })
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
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
    this.getPositionList()
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