// pages/position_show/position_show.js
const db = wx.cloud.database();
import Toast from '@vant/weapp/toast/toast';
const App  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    conllectionList:[],
    ifConllection:0,
    page: 1,
  },
  // 打开位置
  openLocation() {
    wx.openLocation(this.data.data.location)
  },
  // 关闭弹出
  close: function () {
    this.setData({
      showContactDialog: false,
      showShareDialog: false
    });
  },
  // 打开联系菜单
  openContact: function () {
    this.setData({
      showContactDialog: true
    });
  },
  // 打开分享菜单
  openShare: function () {
    this.setData({
      showShareDialog: true
    });
  },
  // 拨打电话
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  // 复制微信号
  setClipboardData(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.weixin
    })
  },

  // 获取推荐列表
  getRecommList() {
    // 读取同城市的职位
    wx.showLoading({
      title: '正在加载',
    })
    db.collection('position')
      .where({
        'area._id': this.data.data.area._id
      })
      .count().then(res => {
        this.setData({
          total: res.total
        })
      })
    const _ = db.command
    db.collection('position')
      .where({
        'area._id': this.data.data.area._id,
        '_id': _.not(_.eq(this.data.data._id))
      })
      .skip((this.data.page - 1) * 20).limit(20)
      .orderBy('created_at', 'desc')
      .get().then(res => {
        wx.hideLoading();
        let list = res.data;
        list = list.map(v => {
          let d = new Date(v.created_at);
          v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
          return v;
        })
        this.setData({
          list: this.data.list.concat(list)
        })
      })
  },

  // 获取收藏列表
  getMyconllections(){
    wx.cloud.callFunction({
      name:'fn_user',
      data:{
        fn:'get_MyConllection'
      }
    }).then(res=>{
      let conllectionList = res.result.get_Conllection
      this.setData({
        conllectionList
      })
      this.check_conllection(conllectionList)
    })
  },


  // 检查当前职位编号是否在收藏中
  check_conllection(list) {
    // console.log(this.data.conllectionList.indexOf(this.data.data._id))
    if (list.indexOf(this.data.data._id) != -1) {
      this.setData({
        ifConllection: 1
      })
      return 1
    } else {
      this.setData({
        ifConllection: 0
      })
      return 0 
    }
  },
  // 添加收藏
  add_conllection() {
    if(App.globalData.openid==''){
      Toast('请先登录')
      setTimeout(()=>{
        wx.switchTab({
          url: '../my/my',
        })
      },1000)
      return
    }
    let that  = this.data
    // 添加到conllectionList 字段中 进行更新
    that.conllectionList.push(that.data._id)
    wx.cloud.callFunction({
        name: 'fn_user',
        data: {
          fn: 'update_MyConllection',
          conllectionList:that.conllectionList,
          openid:App.globalData.openid 
        }
      })
      .then(res => {
        wx.showToast({
          title: '收藏成功',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          ifConllection: 1
        })
      })
  },

  // 取消收藏
  remove_conllection() {
    let that = this.data
    // 从 My_Conllection 字段中移除
    let index = that.conllectionList.indexOf(that.data._id)
    that.conllectionList.splice(index, 1)
    wx.cloud.callFunction({
        name: 'fn_user',
        data: {
          fn: 'update_MyConllection',
          conllectionList: that.conllectionList,
          openid:App.globalData.openid 
        }
      })
      .then(res => {
        wx.showToast({
          title: '取消成功',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          ifConllection: 0
        })
      })

  },

  async check_deliverRecord() {

  },
  // 添加投递
  async add_record() {
    if(App.globalData.openid==''){
      Toast('请先登录')
      setTimeout(()=>{
        wx.switchTab({
          url: '../my/my',
        })
      },1000)
    }
    else{
      let flag = true
      this.data.data.delivered.map(v=>{
        if(v.userid==App.globalData.openid){
          flag = false
          Toast('不可重复投递')
        }
      })
      if(flag){
        wx.navigateTo({
          url: '../my_record_list/my_record_list?type='+1+'&position_id='+this.data.data._id,
        })
      }
     
    }
    return 
    

    
    // 增加 - 个人投递中
    // 公司信息中 根据职位找该公司的信息，在该公司信息中增加上一个存储消息的字段上，类型得是对象，这里uid是投递的用户，flag是状态，用于判断是否已读，{uid:，flag:0}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options._id) {
      this.setData({
        'data._id': options._id
      })
    }
    if(App.globalData.openid){
      this.getMyconllections()
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    wx.showLoading({
      title: '正在加载',
    })
    this.get()
  },
// 获取职位信息
  get() {
    wx.cloud.callFunction({
      name:'eval',
      data:{
        fn:'get_position_info',
        id:this.data.data._id
      }
    }).then(res=>{
      wx.hideLoading()
      let data = res.result.data.data
      let o = new Date(data.created_at);
      data.time = (o.getMonth() + 1) + '月' + o.getDate() + '日'
      this.setData({
        data:data
      })
      this.getRecommList()
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
    if (this.data.page * 20 < this.data.total) {
      this.setData({
        page: this.data.page + 1
      })
      this.getRecommList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {}
})