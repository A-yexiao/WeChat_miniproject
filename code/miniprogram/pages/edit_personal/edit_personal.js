// pages/edit_personal/edit_personal.js
const db =  wx.cloud.database()
import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';
let {
  areaList
} = require('../../vendor/area-data')

let {schoolList} = require('../../vendor/school_list')
let identify = ''
 let error = '这是必填项哦(づ￣3￣)づ╭❤～'

let city = []
schoolList.zone.map(v=>{
  city.push(v.name)
})
let uni = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    zone:[city,uni],
    areaList: areaList,
    show: false,
    radio: 1,
    active: 0,
    personal:{
      remarks:'',
      name:'',
      sex:'',
      age:'',
      phone:'',
      origin:'',
      email:'',
      introduction:'',
      degree:'',
      school:'',
      entrance_time:'',
      graduation_time:'',
      hobbies:'',
      winnings:[''],
      workExps:['']     
    },
    error_message:{
      error_remarks:'',
      error_name:'',
      error_age:'',
      error_phone:'',
      error_email:'',
      error_degree:'',
      error_school:'',
      error_time1:'',
      error_time2:'',
      error_position:'',
      error_salary:'',
      error_location:''
    },

    steps: [{
        text: '1/4',
        desc: '基本信息',
      },
      {
        text: '2/4',
        desc: '个人优势',
      },
      {
        text: '3/4',
        desc: '工作经验',
      },
      {
        text: '4/4',
        desc: '期望岗位',
      },
    ],
    personal_degreeType:['博士','硕士','本科','大专','其他'],
   
    SalaryType:[['1000','2000','3000','4000','5000','6000','7000','8000'],['6000','7000','8000','以上']],
  },
  // 获取
  getRecord(e){
    let data = this.data.personal
    wx.cloud.callFunction({
      name:'fn_user',
      data:{
        fn:'get_record',
        id:e
      }
    }).then(res=>{
      this.setData({
        personal:res.result.data?res.result.data:data
      })
    })
  },

  // 第一步
  form_one(e){
    // // 验证
    let phone_patt = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    let email_patt = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    let info = e.detail.value
    this.setData({
      'error_message.error_remarks':'',
      'error_message.error_name':'',
      'error_message.error_age':'',
      'error_message.error_phone':'',
      'error_message.error_email':''
    })
    if(info.remarks.trim()==''){
      return this.setData({
        'error_message.error_remarks':error
      })
    }
    if(info.name.trim()==''){
      return this.setData({
        'error_message.error_name':error
      })
    }
    if(info.age.trim()==''){
      return this.setData({
        'error_message.error_age':error
      })
    }
    if(info.phone.trim()==''){
      return this.setData({
        'error_message.error_phone':error
      })
    }
    else if(!(phone_patt.test(info.phone))){
      return this.setData({
        'error_message.error_phone':'格式有误哦(づ￣3￣)づ╭❤～'
      })
    }
    if(info.email.trim()==''){
      return this.setData({
        'error_message.error_email':error
      })
    }
    else if(!(email_patt.test(info.email))){
      return this.setData({
        'error_message.error_email':'格式有误哦(づ￣3￣)づ╭❤～'
      })
    }

    this.setData({
      'personal.remarks':info.remarks,
      'personal.name':info.name,
      'personal.age':info.age,
      'personal.sex':info.sex,
      'personal.phone':info.phone,
      'personal.email':info.email,
      'personal.introduction':info.self_intro,
    })

    this.nextBtn()
  },

  // 第二步
  changeCity(e){
    if(e.detail.column!=0)return
    let zone_id = ''
    schoolList.zone.map(v=>{
      if(v.name == city[e.detail.value])
        zone_id = v.id
    })
    let uni = []
    schoolList.university.map(v=>{
      if(v.zone == zone_id){
        uni.push(v.name)
      }
    })
    this.setData({
      'zone[1]':uni
    })
  },
// 学校选择
  school_event(e){
    // let arr = e.detail.value
    // let data = this.data.zone[1][arr[1]]
    // this.setData({
    //   'personal.school':data
    // })
    this.setData({
      'personal.school':e.detail
    })
  },

  select_degree(e){
    this.setData({
      show:!this.data.show,
      'personal.degree':e.detail.value
    })
  },
  cancel_degree(){
    this.setData({
      show:!this.data.show,
    })
  },
  entrance_event(e){
    this.setData({
      'personal.entrance_time':e.detail.value
    })
  },
  graduation_event(e){
    this.setData({
      'personal.graduation_time':e.detail.value
    })
  },
  form_two(e){
    let data = this.data
    this.setData({
      'error_message.error_degree':'',
      'error_message.error_school':'',
      'error_message.error_time1':'',
      'error_message.error_time2':''
    })
    if(data.personal.degree == ""){
      return this.setData({
        'error_message.error_degree':error
      })
    }
    if(data.personal.school == ""){
      return this.setData({
        'error_message.error_school':error
      })
    }
    if(data.personal.entrance_time == ""){
      return this.setData({
        'error_message.error_time1':error
      })
    }
    if(data.personal.graduation_time == ""){
      return this.setData({
        'error_message.error_time2':error
      })
    }
    let form_data = e.detail.value
    let hobbies = form_data.hobbies
    delete form_data.hobbies
    let arr = []
    for(let i in  form_data){
      if(form_data[i]!='') arr.push(form_data[i])
    }
    if(arr.length<1) arr=['']
    this.nextBtn()
    this.setData({
      'personal.hobbies':hobbies,
      'personal.winnings':arr
    })
  },
  form_winnings(e){
    let data  = e.detail.value
    let arr = []
    for(let i in  data){
      if(data[i]!='') arr.push(data[i])
    }
    if(arr.length<1) arr=[]
    this.setData({
      'personal.winnings':arr
    })
    let winnings = this.data.personal.winnings
    if (winnings.length < 5)
      winnings.push('')
    else
      Toast('最多添加5个');
    this.setData({
      'personal.winnings': winnings
    })
  },
  

  // d第三步
  form_workExps(e){
    let data = e.detail.value
    let arr = []
    for(let i in  data){
      if(data[i]!='') arr.push(data[i])
    }
    if(arr.length<1) arr=[]
    this.setData({
      'personal.workExps':arr
    })
    let workExps = this.data.personal.workExps
    if (workExps.length < 5)
      workExps.push('')
    else
      Toast('最多添加5个');
    this.setData({
      'personal.workExps': workExps
    })
  },
  form_three(e){
    let form_data = e.detail.value
    let arr = []
    for(let i in  form_data){
      if(form_data[i]!='') arr.push(form_data[i])
    }
    if(arr.length<1) arr=['']
    this.nextBtn()
    this.setData({
      'personal.workExps':arr
    })
  },
  
  // 第四步
  select_options(e){
    this.setData({
      'personal.exp_Posiston':this.data.optionType[e.detail.value]
    })
  },
  select_Salary(e){
    let arr = e.detail.value
    this.setData({
      'personal.exp_Salary':this.data.SalaryType[0][arr[0]]+'——'+this.data.SalaryType[1][arr[1]]
    })
  },
  ChangeShow(e) {
    identify = e ? e.currentTarget.id: '' 
    this.setData({
      show: !this.data.show
    })
  },
  onClose() {
    this.ChangeShow()
  },
  changeArea(e) {
    let Areas = e.detail.values
    let area = ''
    Areas.map(v => {
      area += v.name + ','
    })
    area = area.substr(0, area.length - 1)
    if(identify == '1'){
      this.setData({
        'personal.origin': area
      })
    }
    if(identify == '2'){
      this.setData({
        'personal.exp_Location': area
      })
    }
    this.ChangeShow()
  },
  cancelArea() {
    this.ChangeShow()
  },

  // 提交
  form_four(e){
    this.setData({
      'error_message.error_position':'',
      'error_message.error_location':'',
      'error_message.error_salary':''
    })
    let form_data = e.detail.value
    if(form_data.position==""){
      return this.setData({
        'error_message.error_position':error
      })
    }
    if(form_data.salary==""){
      return this.setData({
        'error_message.error_salary':error
      })
    }
    if(form_data.location==""){
      return this.setData({
        'error_message.error_location':error
      })
    }
    this.setData({
      'personal.exp_Salary':form_data.salary,
      'personal.exp_Location':form_data.location,
      'personal.exp_Posiston':form_data.position,
      'personal.created_at':new Date().valueOf()
    })
    this.data.personal.deliveryRecord = []
    // return console.log(this.data.personal);
    wx.cloud.callFunction({
      name:'fn_user',
      data:{
        fn:'edit_record',
        data:this.data.personal
      }
    }).then(res=>{
      if(res.result.code == 200){
        Notify({  background: '#CCFFFF', color:'#44CCCC', type: 'success', message: '修改成功', duration: 1000 });
        setTimeout(function(){
          
          wx.navigateBack({//返回
            delta:1
          })
        },1000)
      }
    })
  },


  preBtn() {
    let active = this.data.active
    this.setData({
      active: --active
    })
  },
  nextBtn() {
    let active = this.data.active
    this.setData({
      active: ++active
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否有id过来，如果有就是修改。没有就是添加
    let id = options.id?options.id:''
    if(id){
      this.getRecord(options.id)
    }
    // 获取已添加在库里面的职业类型
    wx.cloud.callFunction({
      name:'fn_user',
      data:{
        fn:'get_f_label'
      }
    }).then(res=>{
      let arr = []
      let data = res.result.data
      data.map(v=>{
        arr.push(v.name)
      })
      this.setData({
        optionType: arr
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