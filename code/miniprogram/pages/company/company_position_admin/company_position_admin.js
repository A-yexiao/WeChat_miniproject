// pages/company/company_position_admin/company_position_admin.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position_list: [],
    where: '',
    page: 1,
    active: 0
  },
  remove_position(e) {
    let data = e.currentTarget.dataset
    wx.cloud.callFunction({
      name: 'fn_company',
      data: {
        fn: 'remove_position',
        data:{
          _id: data.id,  //当前职位的id
        company_id: this.data.id, //公司的id
        type:data.removetype //类型时否审核 0 未审核 1已审核
        }
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
      this.setData({
        page:1,
        position_list:[]
      })
      this.fetch(this.data.id, this.data.active, this.data.page)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id

    })
  
  },
  onChange(e) {
    this.setData({
      active: e.detail.index,
      position_list: []
    })
    if (this.data.searchValue) {
      this.onSearch()
    } else {
      this.fetch(this.data.id, this.data.active, this.data.page)
    }

  },
  // 搜索
  onSearch(e) {
    this.setData({
      total: '',
      position_list: []
    })
    let data = e ? e.detail.trim() : ''
    if (data) {
      this.setData({
        searchValue: e.detail.trim()
      })
    } else {
      return this.onCancel()
    }
    wx.cloud.callFunction({
      name: 'fn_company',
      data: {
        fn: 'search_position',
        data: {
          searchValue: this.data.searchValue,
          if_active: this.data.active,
          company_id: this.data.id,
          page: this.data.page
        }
      }
    }).then(res => {
      if (res.result.code == 200) {
        this.setData({
          total: res.result.total,
          position_list: this.data.position_list.concat(res.result.data)
        })
      } else {
        this.setData({
          total: '',
          position_list: []
        })
        wx.showToast({
          title: '未找到',
          icon: 'error'
        })
      }
    })
  },
  // 取消搜索
  onCancel() {
    this.fetch(this.data.id, this.data.active, this.data.page)
  },
  goPositionInfo(e) {
    wx.navigateTo({
      url: '../../check_position/check_postion?company_id=' + this.data.id,
    })
  },
  fetch(company_id, if_active, page) {
    // 拉去两遍，第一遍是待审核，第二遍是已审核
    // 参数，comapny_id(获取当前公司的职位),if_active(获取当前条件下的职位),page(页面数，实现下拉加载更多)
    wx.showLoading({
      title: '请稍等',
    })
    wx.cloud.callFunction({
      name: 'fn_company',
      data: {
        fn: 'get_position',
        data: {
          if_active,
          company_id,
          page
        }
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.code == 200) {
        this.setData({
          total: res.result.total,
          position_list: this.data.position_list.concat(res.result.data)
        })
      } else {
        this.setData({
          total: '',
          position_list: []
        })
        wx.showToast({
          title: '未找到',
          icon: 'error'
        })
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
    this.setData({
      position_list:[]
    })
    this.fetch(this.data.id, this.data.active, this.data.page)
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
    if (this.data.page * 10 < this.data.total) {
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