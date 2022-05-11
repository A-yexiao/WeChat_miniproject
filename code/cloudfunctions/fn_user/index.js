// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID;

  switch (event.fn) {
    case 'edit_record':{
      return edit_record(event,_openid)
    }
    case 'remove_record':{
      return remove_record(event,_openid)
    }
    case 'get_f_label':{
      return get_f_lable(event,_openid)
    }
    case 'get_record':{
      return get_record(event,_openid)
    }
    case 'get_DeliveryRecord':{
      return get_DeliveryRecord(event,_openid)
    }
    case 'update_DeliveryRecord':{
      return update_DeliveryRecord(event,_openid)
    }
    case 'add_user': {
      return add_user(event, _openid)
    }
    case 'remove_user': {
      return remove_user(event)
    }
    case 'update_user': {
      return update_user(event)
    }
    case 'get_user_info': {
      return get_user_info(event, _openid)
    }
    case 'get_MyConllection' : {
      return get_MyConllection(event,_openid)
    }
    case 'update_MyConllection':{
      return update_MyConllection(event,_openid)
    }
    case 'get_record_list':{
      return get_record_list(event,_openid)
    }
    
  }
  
}

async function get_user_info(event, _openid) {
  let field = event.field || {};
  let user = await db.collection('user')
    .where({
      _openid
    })
    .get();

  return {
    user: user
  }
}

async function edit_record(event,_openid){
  let id = event.data._id?event.data._id:''
  // 有id 证明是修改
  if(id){
    delete event.data._id;
    await db.collection('resume').doc(id).update({
      data : event.data
    })
  }
  // 没有id 证明是添加
  else{
    event.data.openid = _openid
    await db.collection('resume').add({
      data : event.data
    })
  }
  
  return {
    code:'200',
    data:event.data,
    message:'ok'
  }
}
async function remove_record(event,_openid){
  await db.collection('resume').doc(event.id).remove()
}
async function get_record(event,_openid){
  return await db.collection('resume').doc(event.id).get()
}
async function add_user(event, _openid) {
  let one = event.one;
  one._openid = _openid;
  one.created_at = new Date().valueOf();
  try {
    var o = await db.collection('user').add({
      data: one
    });
    return o;
  } catch (e) {
    return e;
  }
}
async function remove_user(event) {
  return await db.collection('user').doc(event._id).remove();
}
async function update_user(event) {
  let one = event.one;
  let _id = one._id;
  delete one._id;
  return await db.collection('user').doc(_id).update({
    data: one
  });
}
async function get_f_lable(event,_openid){
   return await db.collection('f_label').get()
}
// 获取收藏信息
async function get_MyConllection(event,_openid){
  let get_Conllection = await db.collection('user')
    .where({
      _openid
    })
    .get();

  return {
    get_Conllection : get_Conllection.data[0].my_conllections
  }
}
// 更新收藏信息
async function update_MyConllection(event,_openid){
  return await db.collection('user').where({
    _openid:event.openid
  }).update({
    data:{
      my_conllections:event.conllectionList
    }
  })
}


async function get_DeliveryRecord(event,_openid){
  let arr = []
  // let  data = []
  arr = await db.collection('resume').where({
    openid:_openid
  }).get().then(res=>{
    let a = res.data
    let data = []
    if(a.length>0){
        a.map(v1=>{
        v1.deliveryRecord.map(v2=>{
          data.push(v2)
        })
      })
    }
    return data
  })
  return arr
}
async function update_DeliveryRecord(event,_openid){
  const _ = db.command
  // 将职位id 添加到 当前选中的简历集合的 投递 字段中
  await db.collection('resume').doc(event.data.resume_id).update({
    data:{
      deliveryRecord:_.push(event.data.position_id)
    }
  })
  // 将当前职位的 被投递 字段添加本 简历id
  let info = {
    userid:event.data.openid,
    resume_id:event.data.resume_id,
    created_at:new Date().valueOf()
  }
  await db.collection('position').doc(event.data.position_id).update({
    data:{
      delivered:_.push(info),
      deliveredTotal:_.inc(1)
    }
  })
  return {
    code:200,
    msg:'投递成功'
  }
}

async function get_record_list(event){
  let data = await db.collection('resume').where({
    openid:event.data.openid
  }).orderBy('created_at','desc').get()

  return data
}