// pages/company/company.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: [{
      image: ''
    }],
    where:{},
    list: [],
    page: 1
  },
  
  // 获取列表
  // fetch() {
  //   wx.showLoading({
  //     title: '正在加载',
  //   })
  //   db.collection('company').count().then(res => {
  //     this.setData({
  //       total: res.total
  //     })
  //   })
  //   db.collection('company')
  //     .skip((this.data.page - 1) * 20).limit(20)
  //     .orderBy('created_at', 'desc')
  //     .get().then(res => {
  //       wx.hideLoading();//隐藏加载框
  //       let list = res.data.map(v => {
  //         let d = new Date(v.created_at);//转换成标准时间
  //         v.time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '';//格式化时间年月日
  //         return v;
  //       })
  //       this.setData({
  //         list: this.data.list.concat(list)
  //       })
  //       // console.log(this.data.list)
  //     })

  //     db.collection('join').get().then(res =>{
  //       this.setData({
  //         swiper:res.data
  //       })
  //       // console.log(res)
  //     })
  // },

//  查询
  onSearch(e){
    // console.log(e)
    let that = this
    let searchValue=e.detail
    wx.cloud.callFunction({
      name:'eval',
      data:{
        fn:'get_search',
        searchData:searchValue
      }
    }).then(function(e){
      if(e.result.data.length==0) return  wx.showToast({
        title: '未查询到',
        icon:'error'
      })
      that.setData({
        list:e.result.data,
        page: 1,
        show: '',
        // isSearch:1
      })
    })
  },
  onCancel(){
    this.setData({
      list: [],
      page: 1,
      show: '',
      isSearch:0
    })
  },
  show_area() {
    this.setData({
      show: this.data.show == 'area' ? false : 'area'
    })
  },
  show_label() {
    this.setData({
      show: this.data.show == 'label' ? false : 'label'
    })
  },
  show_type() {
    this.setData({
      show: this.data.show == 'type' ? false : 'type'
    })
  },
  show_salary() {
    this.setData({
      show: this.data.show == 'salary' ? false : 'salary'
    })
  },
  close() {
    this.setData({
      show: ''
    })
  },
  // 选择地区
  set_area(e) {
    let v = e.currentTarget.dataset.v
    let where = {}

    if (v == '不限') {
      delete where['area._id']
    } else {
      where['area._id'] = v
    }
    this.setData({
      list: [],
      page: 1,
      show: '',
      where: where
    })
    this.fetchData();
  },
  // 选择标签
  set_label(e) {
    let v = e.currentTarget.dataset.v
    let where = {}
    if (v == '不限') {
      delete where['label._id']
    } else {
      where['label._id'] = v
    }
    this.setData({
      list: [],
      page: 1,
      show: '',
      where: where
    })
    // console.log(this.data.where);
    this.fetchData();
  },
  // 选择类型
  set_type(e) {
    let v = e.currentTarget.dataset.v
    let where = {}

    if (v == '不限') {
      delete where['type._id']
    } else {
      where['type._id'] = v
    }

    this.setData({
      list: [],
      page: 1,
      show: '',
      where: where
    })
    this.fetchData();
  },
  // 选择工资范围
  set_salary(e) {
    let v = e.currentTarget.dataset.v
    let where = {}

    if (v == '不限') {
      delete where['salary._id']
    } else {
      where['salary._id'] = v
    }

    this.setData({
      list: [],
      page: 1,
      show: '',
      where: where
    })
    this.fetchData();
  },

  fetchData() {
    wx.showLoading({
      title: '正在加载',
    })
    db.collection('position')
      .where(this.data.where)
      .count().then(res => {
        if (res.total == 0) {
          wx.showToast({
            title: '该检索条件下无数据',
            icon: 'none'
          })
        }
        this.setData({
          total: res.total
        })
      })
    db.collection('position')
      .where(this.data.where)
      .skip((this.data.page - 1) * 20).limit(10)
      .orderBy('created_at', 'desc')
      .get().then(res => {
        wx.hideLoading();
        let list = res.data.map(v => {
          let d = new Date(v.created_at);
          v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
          return v;
        })
        this.setData({
          list: this.data.list.concat(list)
        })
        // console.log(this.data.list)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // h获取标签筛选条件
    wx.cloud.callFunction({
      name: 'eval',
      data: {
        fn: 'get_filter'
      }
    })
    .then(res => {
      this.setData({
        filter: res.result
      })
      // this.fetchData()
    });
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
    // this.setData({
    //   list: [],
    //   page: 1,
    //   show: '',
    //   where: ''
    // })
    // this.fetchData()
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
      this.fetchData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})