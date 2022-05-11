// pages/edit_password/edit_password.js
const db = wx.cloud.database();
const userInfo = db.collection('user');
import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword:'',
    newPassword:'',
    id:'',
    OPErrorMessage:'',
    NPErrorMessage:'',
    ifOld:'',
    ifNew:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })
  },
 
  lostBlur(event){
    //获取输入框标识
    let evType = event.currentTarget.dataset.name;
    //获取输入框值
    let evValue = event.detail.value;
    //去除输入内容中的空格
    evValue = evValue.replace(/\s+/g, '');
    if(evValue){//如果有值的话
      this.checkIt(evType,evValue);
    }
  },
  checkIt(evType,evValue){
    let that = this.data
    if(evType=='oldPassword'){
      if(evValue){
        userInfo.where({
          _id:that._id,
          password:evValue
        })
        .get()
        .then(res=>{
          if(res.data.length){ //长度存在，查询有值
            this.setData({
              ifOld:true
            })
          }
          else{ //没有查询到
            this.setData({
              OPErrorMessage:'密码错误',
              ifOld:false
            })
          }
        })
      }
      else{
        this.setData({
          OPErrorMessage:'密码不能为空',
          ifOld:false
        })
      }
    }
    else if(evType == 'newPassword'){
      let res = evValue.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/);
      if(res == null||res==that.oldPassword){
        this.setData({
          NPErrorMessage:'密码格式错误',
          ifNew:false
        })
      }else{
        this.setData({
          newPassword:evValue,
          ifNew:true
        })
      }
    }
  },
  // 清除错误提示
  ifClear(res){
    let whichError = res.currentTarget.dataset.name;
    if(whichError == 'oldPassword'){
      this.setData({
        OPErrorMessage:''
      })
    }else if(whichError == 'newPassword'){
      this.setData({
        NPErrorMessage:''
      })
    }
  },
  // 修改
  edit(){
    let that = this.data
    if(that.ifOld&&that.ifNew){ //允许修改
     userInfo.doc(that.id).update({
        // data 传入需要局部更新的数据
        data: {
          password:that.newPassword
        },
        success:res=>{
          Notify({ type: 'success', message: '密码修改成功，即将前往登录页', duration: 1000 });
          setTimeout(function(){
            let pages = getCurrentPages();//当前页面
            let prevPage = pages[pages.length-2];//上一页面
            prevPage.setData({//直接给上一页面赋值
              isLogin:false,
              user:'',
              password:''
            });
            wx.navigateBack({//返回
              delta:1
            })
          },1000)
        }
      })
    }
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