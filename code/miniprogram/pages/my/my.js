// pages/my/my.js
const db = wx.cloud.database();
import Notify from '@vant/weapp/notify/notify';
const App = getApp()
Page({
  data: {
    
  },
  onLoad(event){
    
  },
  // 登录
  onShow(){
    this.get_user_info();
  },
  
  login(){
    this.get_user_info()
  },

  // 注册
  auth() {
    wx.showLoading({
      title: '正在加载',
    })
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
            res.userInfo.is_company=false
            res.userInfo.my_conllections = []
            wx.cloud.callFunction({
            name: 'fn_user',
              data: {
                fn: 'add_user',
                one: res.userInfo
              }
            }).then(res => {
              wx.hideLoading();
              this.get_user_info();
            })
        },
        fail:(res)=>{
          wx.showToast({
            title: '未授权',
            icon: 'none'
          })
          console.log(res)
        },
      })
      wx.hideLoading()
  },
  go_authentication(){
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:'get_pending_company_id'
      }
    }).then(res=>{
      if(res.result.arr.data.length!=0){
        return wx.showToast({
          title: '已申请，待审核',
          icon:'success'
        })
      }
      wx.navigateTo({
        url: '../company/authentication/authentication',
      })
    })
  },
  // 获取用户信息
  async get_user_info() {
    await wx.cloud.callFunction({
      name: 'fn_user',
      data: {
        fn: 'get_user_info',
        field: {
          is_admin: true
        }
      }
    }).then(res => {
      // console.log(res)
      if (res.result.user.data.length) {
        this.setData({
          user: res.result.user.data[0],
          existence:1
        })
        App.globalData.openid = res.result.user.data[0]._openid
        App.globalData.is_admin = res.result.user.data[0].is_admin
        return 1
      } else {
        this.setData({
          user: '',
          existence:0
        })
        return 0
      }
    })
  },
  // 预览图片
  prv(){
    wx.previewImage({
      // current: , // 当前显示图片的http链接
      urls: [this.data.user.avatarUrl], // 需要预览的图片http链接列表
      showmenu:true
    })
  },
  // 退出登录
  loginOut(){
    this.setData({
      user:'',
      existence:1
    })
  }
})