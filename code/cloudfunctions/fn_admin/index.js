// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

let result_data = {
  code: '',
  message: '',
  data: ''
}
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.fn) {
    case 'get_pending_company': {
      return get_pending_company()
    }
    case 'get_company': {
      return get_company()
    }
    case 'add_company': {
      return add_company(event.data)
    }
    case 'add_fail_company': {
      return add_fail_company(event.data)
    }
    case 'add_position': {
      return add_position(event.data)
    }
    case 'add_fail_position': {
      return add_fail_position(event.data)
    }
    case 'get_positionALL': {
      return get_positionALL(event.data)
    }
    case 'search_positionALL': {
      return search_positionALL(event.data)
    }
    case "remove_position": {
      return remove_position(event.data)
    }
  }
  return {}
}

async function get_pending_company() {
  let arr = []
  let obj = {
    _id:'',
    name:'',
    desc:'',
    created_at:'',
    state:'',
    id:''
  }
  let accessToken = await db.collection('pending_company').get()
  accessToken.data.map(v=>{
    obj._id = v._id
    obj.name = v.name
    obj.desc = v.desc
    obj.created_at = v.created_at
    obj.state = v.state
    obj.id = v.id
    arr.push(obj)
    obj = {}
  })
  return arr
}

async function get_company() {
  let arr = []
  let obj = {
    _id:'',
    name:'',
    desc:'',
    created_at:'',
    id:'',
    state:''
  }
  let accessToken = await db.collection('company').get()
  accessToken.data.map(v=>{
    obj._id = v._id
    obj.name = v.name
    obj.desc = v.desc
    obj.created_at = v.created_at
    obj.state = v.state
    obj.id=v.id
    arr.push(obj)
    obj = {}
  })
  return arr
}

async function add_company(newData) {
  let result_data = {}
  // 先找 company 表里是否有这个公司，如果有 那就把数据更新
  let r = await db.collection('company').where({
    id:newData.data.id
  }).get().then(res=>{return res.data[0]})
 
  if(r){
    await db.collection('pending_company').doc(newData.data._id).remove()
    delete newData.data._id
    await db.collection('company').doc(r._id).update({
      data:newData.data
    }).then(res=>{
      result_data = {
        code:200,
        message:'OK',
      }
    })
    
    return {
      result_data
    }
  }
  // 先删除
  await db.collection('pending_company').doc(newData.data._id).remove()
  delete newData.data._id
  // 让user集合中，改openid的用户的字段is_company = 1
  await db.collection('user').where({
    _openid:newData.data.id
  }).update({
    data:{
      is_company:true
    }
  })
  newData.data.position_number  = 0
  await db.collection('company').add({
    data: newData.data
  }).then(res=>{
    if(res._id!=''){
      result_data = {
        code:200,
        message:'OK',
      }
    }
    else{
      result_data = {
        code:500,
        message:'ERROR',
      }
    }
  })
  return {
    result_data
  }
}

async function add_fail_company(newData) {
  let result_data = {}
  await db.collection('pending_company').doc(newData.data._id).remove()
  delete newData.data._id
  await db.collection('fail_company').add({
    data: newData.data
  }).then(res=>{
    if(res._id!=''){
      result_data = {
        code:200,
        message:'OK',
      }
    }
    else{
      result_data = {
        code:500,
        message:'ERROR',
      }
    }
  })
  return {
    result_data
  }
}

async function add_position(newData) {
  let result_data = {}
  // 先删除
  await db.collection('pending_position').doc(newData._id).remove()
  delete newData._id
  // 设置状态为已审核，然后增加到position集合中
  await db.collection('position').add({
    data: newData
  }).then(res=>{
    if(res._id!=''){
      result_data = {
        code:200,
        message:'OK',
      }
    }
    else{
      result_data = {
        code:500,
        message:'ERROR',
      }
    }
  })
  // 更新公司职位数
  const _ = db.command;
  await db.collection('company').doc(newData.company._id).update({
    data: {
      position_number: _.inc(1)
    }
  })
  return {
    result_data
  }
}

async function add_fail_position(newData) {
  let result_data = {}
  await db.collection('pending_position').doc(newData._id).remove()
  delete newData._id
  await db.collection('fail_position').add({
    data: newData
  }).then(res=>{
    if(res._id!=''){
      result_data = {
        code:200,
        message:'OK',
      }
    }
    else{
      result_data = {
        code:500,
        message:'ERROR',
      }
    }
  })
  return {
    result_data
  }
}


async function get_positionALL() {
  let arr = []
  let r1 = await db.collection('position').orderBy('created_at', 'desc').get()
  r1.data.map(v=>{
    v.state = 1
    let d = new Date(v.created_at);
      v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
  })
  let r2 = await db.collection('pending_position').orderBy('created_at', 'desc').get()
  r2.data.map(v=>{
    v.state = 0
    let d = new Date(v.created_at);
      v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
  })
  let data = r1.data.concat(r2.data)
  return data
}

async function search_positionALL(data, result_data, _openid) {
  let sear = data.searchValue
  let r1 
  let r2
  r1 = await db.collection('position').where({
    name:db.RegExp({
      regexp:sear,
      options:'i'
    })
  }).get()
  r2 = await db.collection('pending_position').where({
    name:db.RegExp({
      regexp:sear,
      options:'i'
    })
  }).get()
  // 两条数据合并
  let arr = []
  r1.data.map(v=>{
    v.state=1
    let d = new Date(v.created_at);
    v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
    arr.push(v)
  })
  r2.data.map(v=>{
    v.state = 0
    let d = new Date(v.created_at);
    v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
    arr.push(v)
  })
  return arr
}


async function remove_position(data) {
  await db.collection('position').doc(data._id).remove();
  // 更新公司职位数
  const _ = db.command;
  await db.collection('company').doc(data.company_id).update({
    data: {
      position_number: _.inc(-1)
    }
  })
  return 'ok'
}
