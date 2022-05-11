// pages/authentication/authentication.js
const chooseLocation = requirePlugin('chooseLocation')
import Notify from '@vant/weapp/notify/notify';
let error_info = '这是必填项哦(づ￣3￣)づ╭❤～'
let error_pattn = '格式有误哦(づ￣3￣)づ╭❤～'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:'0',// 0新增/修改 1审核未通过修改 
    fileList:[],
    info:{
      logo:'',
      license:[],
      created_at:'',
      position_num:0,
      name:'',
      sex:'1'
    },
    error_message:{
      error_name:'',
      error_phone:'',
      error_address:'',
      error_desc:'',
      error_legal_name:'',
      error_legal_ID:'',
      error_legal_phone:''
    }
  },
  changeSex(e){
   this.setData({
     'info.sex':e.detail
   })
  },
  // 选点
  chooseLocation() {
    this.setData({
      'info.location':''
    })
    const key = '2MKBZ-TXDLV-ZDNPC-UMG2S-DTOO3-ZHFHY';
    const referer = 'squirrel';
    const location = JSON.stringify({
      latitude: 39.89631551,
      longitude: 116.323459711
    });
    const category = '生活服务,娱乐休闲';

    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });

    
  },
  onChangeName(e){
    this.setData({'info.name':e.detail})
  },
  authentication(e){
    // e.detail.target.dataset.id  注销按钮  == 1
    let phone_patt = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    let email_patt = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    let id_patt = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    // 形式化验证
    let flag = true
    for(let v in this.data.error_message){
      let a = 'error_message.'+v
      this.setData({
        [a]:''
      })
    }
    let data = e.detail.value;
    delete  data[0]
    delete  data[1]
    for(let v in data ){
      let a = 'error_message.error_'+v
      if(data[v]==''){
        this.setData({
          [a]:error_info
        })
        flag = false
      }
      if(v == 'phone' ||v== 'legal_phone' ){
         if(!(phone_patt.test(data[v]))){
          this.setData({
            [a]:error_pattn
          }) 
          flag = false
         }
      }
      if(v=='legal_ID'){
        if(!(id_patt.test(data.legal_ID))){
          this.setData({
            [a]:error_pattn
          }) 
          flag = false
        }
      }
      if(flag){
        let a = 'info.'+v
        this.setData({
          [a]:data[v]
        })
      }
    }
    // 图片是否上传
    if(this.data.info.logo==''||this.data.info.license.length<2){
      wx.showToast({
        title: '请上传图片',
        icon:'error'
      })
      flag = false
    }
    if(flag){
      switch(this.data.state){
        case '0' : return this.add_authentication()   //
        case '1' : return this.editInfo() 
      }
     
    }


    
  },

  add_authentication(){
    let data_info = this.data.info
    
    data_info.created_at = new Date().valueOf()
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:'add_pending_company',
        data:{
          data:data_info,
          id:this.data.id
        }
      }
    }).then(res=>{
      console.log(res);
      let code = res.result.result_data.code?res.result.result_data.code:0
      this.back(code)
    })
  },

  edit_company_Info() {

  },

  editInfo(){
    wx.cloud.callFunction({
      name:"fn_company",
      data:{
        fn:'update_fail_company',
        data:this.data.info
      }
    }).then(res=>{
      console.log(res);
      let code = res.result.code?res.result.code:0
      this.back(code)
    })
  },

  //  注销
  remove_company(){
    wx.cloud.callFunction({
      name:'fn_company',
      data:{
        fn:'remove_company',
        data:{
          company_id:this.data.info._id,
          user_id:this.data.id,
        }
      }
    }).then(res=>{
      wx.showToast({
        title: '注销成功',
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 2000);
    })
  },

  back(code){
    if(code==200||code==400){
      wx.showToast({
        title: '已申请，待审核',
        icon:'success'
      })
    }
    else{
      wx.showToast({
        title: '网络差稍后再试',
        icon:'error'
      })
    }
    setTimeout(function(){
      wx.navigateBack({//返回
        delta:1
      })
    },1000)
  },

  upload_pic(e){
    if(this.data.info.name==''){
      return wx.showToast({
        title: '请先填写公司名',
        icon:'error'
      })
    }
  
    let _this = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
       _this.uploadToCloud(res.tempFiles, e.currentTarget.dataset.id)
      }
    })
  },
  remove_pic(e){
    let id = e.currentTarget.dataset.id
    if(id == 0)
      this.setData({
        'info.logo':''
      })
    if(id == 1){
      this.setData({
        'info.license[0]':''
      })
    }
    if(id == 2){
      this.setData({
        'info.license[1]':''
      })
    }
    
  },

  // logo上传
  uploadToCloud( data,index) {
    wx.cloud.init()
    if (!data.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
    } else {
      let name = this.data.info.name+'_'+index
      const uploadTasks = data.map((file, index) => this.uploadFilePromise(new Date().valueOf() + '_' +name+'.jpg', file))
      Promise.all(uploadTasks)
        .then(data => {
          // console.log(data);
          wx.showToast({ title: '上传成功', icon: 'none' });
          if(index == 0){
            this.setData({
              'info.logo':data[0].fileID
            })
          }
          if(index == 1){
            this.setData({
              'info.license[0]':data[0].fileID
            })
          }
          if(index == 2){
            this.setData({
              'info.license[1]':data[0].fileID
            })
          }
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          console.log(e);
        });
    }
  },
  
  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.tempFilePath
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let id = options.id?options.id:''
     let type = options.type?options.type:'0'
     this.setData({
       id:id,
       state:type
     })
     
     if(id&&type==1){
      wx.showLoading({
        title: '加载中....',
      })
      wx.cloud.callFunction({
        name:'fn_company',
        data:{
          fn:"get_fail_company",
          data:{
            id
          }
        }
      }).then(res=>{
        wx.hideLoading()
        this.setData({
          info:res.result.arr.data[0]
        })
      })
     }
     if(id&&type==0){
      wx.showLoading({
        title: '加载中....',
      })
      //  获取公司信息
      wx.cloud.callFunction({
        name:'fn_company',
        data:{
          fn:'get_company_info',
          data:{
            id
          }
        }
      }).then(res=>{
        wx.hideLoading()
        if(res.result=='')  return Notify('信息若没同步，即待审核中')
        this.setData({
          info:res.result,
          type:'1'
        })
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
    // 地址赋值
    const location = chooseLocation.getLocation()
    if(location){
      this.setData({
        'info.location':location
      })
    }
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