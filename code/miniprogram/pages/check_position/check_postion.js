// pages/check_position/check_postion.js
const chooseLocation = requirePlugin('chooseLocation');
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one: {},
    // company_id: 'o5aVL46SkM8sygCyWJlM5jbFCtMk',
    is_admin:''
  },

  // 选择地理位置
  chooseLocation() {
    const key = '2MKBZ-TXDLV-ZDNPC-UMG2S-DTOO3-ZHFHY';
    const referer = '松鼠招聘';
    const location = JSON.stringify({
      latitude: 39.89631551,
      longitude: 116.323459711
    });
    const category = '生活服务,娱乐休闲';
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },

  select_area() {
    wx.navigateTo({
      url: '../check_area/check_area?select=true',
      events: {
        area_selected: data => {
          this.setData({
            'one.area': data[0]
          })
        }
      }
    })
  },

  select_label() {
    wx.navigateTo({
      url: '../check_label/check_label?select=true',
      events: {
        label_selected: data => {
          this.setData({
            'one.label': data[0]
          })
        }
      }
    })
  },

  select_type() {
    wx.navigateTo({
      url: '../check_type/check_type?select=true',
      events: {
        type_selected: data => {
          this.setData({
            'one.type': data[0]
          })
        }
      }
    })
  },

  select_salary() {
    wx.navigateTo({
      url: '../check_salary/check_salary?select=true',
      events: {
        salary_selected: data => {
          this.setData({
            'one.salary': data[0]
          })
        }
      }
    })
  },

  select_company() {
    wx.navigateTo({
      url: '../check_company/check_company?select=true',
      events: {
        company_selected: data => {
          this.setData({
            'one.company': data[0]
          })
        }
      }
    })
  },

  // 保存单条
  save(e) {
    // 由传过来的 type 来决定是对哪一个集合进行操作
    //  type：0 pending_position, type:1 position 
    // 保存分两阶段，一种是待审核的修改，一种是已审核后的修改，无论哪一种修改，均要进入待审核集合中
    // 因此 出现两种情况，第一种，待审核修改，这样就直接修改pending_position集合中_id匹配当前的待审核职位的数据更新
    // 第二种，已经进行审核后职位进行修改，
    // 针对第二种情况，有两种方案，
    //  （1）没有更新保存按钮，只能删除后重新发布职位，管理员审核
    //   （2）有更新按钮，那就需要先从position 集合中将当前的职位进行删除，然后在pending_position集合中添加这个刚刚提交的职位，然后管理员审核
    // 从交互体验来说 选择第二种的（2）
    if (!this.data.one.name) {
      wx.showToast({
        title: '请填写职位名称',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.salary) {
      wx.showToast({
        title: '请选择薪资范围',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.phone) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.weixin) {
      wx.showToast({
        title: '请填写微信号',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.company) {
      wx.showToast({
        title: '请选择公司',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.area) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.label) {
      wx.showToast({
        title: '请选择标签',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.type) {
      wx.showToast({
        title: '请选择职位类型',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.desc) {
      wx.showToast({
        title: '请填写职位描述',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.location) {
      wx.showToast({
        title: '请选择地理位置',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在保存',
      icon: 'none'
    })
    let one = this.data.one;
    if(this.data.type == '0'){  //
      wx.cloud.callFunction({
        name:'fn_company',
        data:{
          fn:'update_pending_position',
          data:one
        }
      }).then(res=>{
        wx.hideLoading()
        if(res.result.code==200){
          wx.showToast({
            title: '已修改，待审核',
          })
        }
      })
    }
    if(this.data.type  == '1'){
      wx.cloud.callFunction({
        name: 'fn_company',
        data: {
          fn: 'update_position',
          data:{
            one: one,
            company_id:this.data.company_id,
          }
        }
      }).then(res => {
        if(res.result.code==200){
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
        }
        else{
          wx.hideLoading();
          wx.showToast({
            title: '网络错误',
            icon: 'error'
          })
        }
        setTimeout(()=>{
          wx.navigateBack({
            delta: -1,
          })
        },1000)
      })
    }
    if(this.fail_position){
      wx.cloud.callFunction({
        name: 'fn_company',
        data: {
          fn: 'update_fail_position',
          data:{
            one: one,
            company_id:this.data.company_id,
          }
        }
      }).then(res => {
        if(res.result.code==200){
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
        }
        else{
          wx.hideLoading();
          wx.showToast({
            title: '网络错误',
            icon: 'error'
          })
        }
        setTimeout(()=>{
          wx.navigateBack({
            delta: -1,
          })
        },1000)
      })
    }
  },
  // 删除单条
  remove(e) {
    //删除分两阶段  一种是未审核的删除，一种是已审核的删除
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: res => {
        if (res.confirm) {
          let _id = e.currentTarget.dataset._id;
          wx.showLoading({
            title: '正在删除',
          })
          // 删除分两种，已审核的职位删除和未审核的职位删除
          wx.cloud.callFunction({
            name: 'fn_company',
            data: {
              fn: 'remove_position',
              data:{
                _id: _id,  //当前职位的id
              company_id: this.data.one.company._id, //公司的id
              type:this.data.type //类型时否审核 0 未审核 1已审核
              }
            }
          }).then(res => {
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
          console.log('用户点击取消')
        }
      }
    })
  },

  // 添加
  set_add_name(e) {
    this.setData({
      'one.name': e.detail.value
    })
  },
  set_add_desc(e) {
    this.setData({
      'one.desc': e.detail.value
    })
  },
  set_add_phone(e) {
    this.setData({
      'one.phone': e.detail.value
    })
  },
  set_add_weixin(e) {
    this.setData({
      'one.weixin': e.detail.value
    })
  },

  // 新增
  add() {
    if (!this.data.one.name) {
      wx.showToast({
        title: '请填写职位名称',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.salary) {
      wx.showToast({
        title: '请选择薪资范围',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.phone) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.weixin) {
      wx.showToast({
        title: '请填写微信号',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.area) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.label) {
      wx.showToast({
        title: '请选择标签',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.type) {
      wx.showToast({
        title: '请选择职位类型',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.desc) {
      wx.showToast({
        title: '请填写职位描述',
        icon: 'none'
      })
      return;
    }
    if (!this.data.one.location) {
      wx.showToast({
        title: '请选择地理位置',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在加载',
      icon: 'none'
    })
    let one = this.data.one;
    one.created_at = new Date().valueOf();
    // console.log(one);
    wx.cloud.callFunction({
      name: 'fn_company',
      data: {
        fn: 'add_pending_position',
        data: {
          one,
          company_id:this.data.company_id
        }
      }
    }).then(res => {
      wx.hideLoading();
      if(res.result.result_data.code == 200){
        wx.showToast({
          title: '已添加，待审核',
          icon: 'none'
        })
        this.setData({
          'one.name': '',
          'one.desc': ''
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },1000)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 此时的type为0时，证明是对未审核的职位进行修改
    wx.showLoading({
      title: '加载中...',
    })
   
    let state = options.state?options.state:''
    this.setData({
      state
    })
    if (options._id&&options.type=='0') {
      this.setData({
        type:options.type
      })
      const db = wx.cloud.database();
      return db.collection('pending_position').doc(options._id).get()
        .then(res => {
          wx.hideLoading()
          this.setData({
            one: res.data
          })
        })
    }
    if (options._id&&options.type=='1') {  //对已经审核通过后的修改
      this.setData({
        type:options.type
      })
      const db = wx.cloud.database();
      return db.collection('position').doc(options._id).get()
        .then(res => {
          wx.hideLoading()
          this.setData({
            one: res.data
          })
        })
    }
    if (options._id&&options.fail_position) { //对审核未通过的修改
      this.setData({
        type:options.type,
        fail_position:options.fail_position
      })
      const db = wx.cloud.database();
      return db.collection('fail_position').doc(options._id).get()
        .then(res => {
          wx.hideLoading()
          this.setData({
            one: res.data
          })
        })
    }
    // company_id存在证明是公司对职位的
    if (options.company_id) {
      this.setData({
        company_id: options.company_id
      })
    }
    wx.hideLoading()
    
    

  },

  // 分角色 管理员 审核通过 、 退回
  // 审核通过
  pass_position(e){
    wx.showLoading({
      title: '请稍后',
    })
    let id = e.currentTarget.dataset._id
    let newData = this.data.one
    newData.delivered=[]
    newData.deliveredTotal=0
    newData.info_readTotal=0
    //调用，将该数据添加到已经审核通过的表中
    // return 
    wx.cloud.callFunction({
      name:'fn_admin',
      data:{
        fn:'add_position',
        data:this.data.one
      }
    }).then(res=>{
      wx.hideLoading()
      if(res.result.result_data.code==200){
        wx.showToast({
          title: '已处理',
          icon:'success'
        })
      }
      else{
        wx.showToast({
          title: '网络错误',
          icon:'error'
        })
      }
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1000)
    })
  },

  // 退回
  async fail_position(e){
    let id = e.currentTarget.dataset._id
    let comment  = ''
    comment = await wx.showModal({
      title:'备注',
      editable:true,
    }).then(res=>{
      if(res.confirm){ //用户点了确定
        if(!res.content){  //如果为备注内容为空 提示
          wx.showToast({
            title: '备注内容不能为空',
            icon:'error'
          })
          return ''
        }
        return res.content
      }
      else if(res.cancel){ //点了取消
        console.log('取消');
      }
    })
    if(comment){  //当有备注时，调用云函数，讲此数据添加到审核未通过的表中
      let data = this.data.one
      data.comment = comment
      wx.cloud.callFunction({
      name:'fn_admin',
      data:{
        fn:'add_fail_position',
        data:data
      }
    }).then(res=>{
      if(res.result.result_data.code==200){
        wx.showToast({
          title: '已处理',
          icon:'success'
        })
      }
      else{
        wx.showToast({
          title: '网络错误',
          icon:'error'
        })
      }
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1000)
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
    const location = chooseLocation.getLocation();
    if (location) {
      this.setData({
        'one.location': location,
        
      })
    }
    this.setData({
      is_admin:App.globalData.is_admin
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