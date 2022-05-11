// pages/admin/admin_company/admin_company.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list:[]
  },
  // 搜索
  onSearch(e){
    let sear = e.detail.trim();
    if(sear==''){
      return this.onCancel()
    }
    this.getCompany(sear).then(res=>{
      let arr = this.showList(res,this.data.active)
      this.setData({
        list:arr,
        listArr:res
      })
    })
  },
  onCancel(){
    this.get_pending_company().then(res1=>{
      this.get_company().then(res2=>{
        res2.map(v=>{
          res1.push(v)
        })
        let data = this.showList(res1,0)
       this.setData({
          listArr:res1,
          list:data
        })
      })
    })
  },
  // 关键词搜索
  getCompany(searchData){
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'eval',
        data:{
          fn:'get_search_company',
          searchData,
          is_admin:1
        }
      }).then(res=>{
        resolve(res.result)
      })
    })
  },
  // 页面跳转
  goCompanyInfo(e){
    let id =  e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../company/authentication_info/authentication_info?id='+id+'&active='+this.data.active,
    })
  },
  // 标签切换
  onChange(e){
    let data = this.showList(this.data.listArr,e.detail.index)
    this.setData({
      list:data,
      active:e.detail.index
    })
    if(data.length==0){
      this.setData({
        content:'暂无内容'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 获取待审核的公司
  get_pending_company(){
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'fn_admin',
        data:{
          fn:'get_pending_company'
        }
      }).then(res=>{
        resolve(res.result)
        // let data = this.showList(res.result.arr.data,0)
        // this.setData({
        //   listArr:res.result.arr.data,
        //   list:data
        // })
      })
    })
  },
  // 获取公司
  get_company(){
    return new Promise((resolve,reject)=>[
      wx.cloud.callFunction({
        name:'fn_admin',
        data:{
          fn:'get_company'
        }
      }).then(res=>{
        resolve(res.result)
      })
    ])
  },
  // 处理显示内容
  showList(data,index){
    let arr  = []
    data.map(v=>{
      if(v.state==index){
        let d = new Date(v.created_at);
        v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
        arr.unshift(v)
      }
    })
    return arr
  },
  // 删除公司
  remove(e){
    let company_id = e.currentTarget.dataset._id
    let user_id = e.currentTarget.dataset.id
    // 删除公司 删除职位
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:'remove_company',
        data:{
          company_id,
          user_id
        }
      }
    }).then(res=>{
      let list = this.data.list
      let listArr = this.data.listArr
      let index1 = list.findIndex(v=>v._id == company_id)
      let index2 = listArr.findIndex(v=>v._id == company_id)
      list.splice(index1,1)
      listArr.splice(index2,1)
      this.setData({
        list,
        listArr
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
    this.get_pending_company().then(res1=>{
      res1.map(v=>{
        v.state = 0
      })
      this.get_company().then(res2=>{
        res2.map(v=>{
          v.state = 1
          res1.push(v)
        })
        let data = this.showList(res1,0)
       this.setData({
          listArr:res1,
          list:data
        })
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})