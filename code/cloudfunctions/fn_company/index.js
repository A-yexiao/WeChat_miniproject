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
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID;
  switch (event.fn) {
    case 'add_pending_company': {
      return add_pending_company(event.data, result_data, _openid)
    }
    case 'get_pending_company_id': {
      return get_pending_company_id(event.data, result_data, _openid)
    }
    case 'get_company_info': {
      return get_company_info(event.data, result_data, _openid)
    }
    case 'get_pending_company': {
      return get_pending_company()
    }
    case 'get_fail_company': {
      return get_fail_company(_openid)
    }
    case 'get_fail_postion': {
      return get_fail_postion(_openid)
    }
    
    case 'get_position': {
      return get_position(event.data, result_data, _openid)
    }
    case 'search_position': {
      return search_position(event.data, result_data, _openid)
    }
    case 'add_pending_position': {
      return add_pending_position(event.data, result_data, _openid)
    }
    case 'update_fail_company': {
      return update_fail_company(event.data, result_data, _openid)
    }

    case 'update_fail_position': {
      return update_fail_position(event.data, result_data, _openid)
    }

    

    case 'update_pending_position': {
      return update_pending_position(event.data, result_data, _openid)
    }
    case 'update_position': {
      return update_position(event.data, result_data, _openid)
    }

    case 'remove_position': {
      return remove_position(event.data, result_data, _openid)
    }
    case 'get_deliveredALL': {
      return get_deliveredALL(event.data, result_data, _openid)
    }
    case 'remove_company': {
      return  remove_company(event.data)
    }
  }
  return {}
}

async function add_pending_company(newData, result_data, _openid) {
  let one = newData.data
  let id = newData.id ? newData.id : ''  //不存在即新增
  one.id = _openid
  let data = await db.collection('pending_company').where({
    id: _openid
  }).get().then(res => { return res.data[0] })
  if (id) {  //已经审核通过了然后修改信息
    one.created_at = new Date().valueOf()  //时间更新
    // pending_company 里存在
    if (data) {
      delete one._id
      await db.collection('pending_company').doc(data._id).update({
        data:one
      }).then(res => {
        result_data = {
          code: 200,
          message: 'pending_company 修改成功'
        }
      })
    }
    else {//  pending_company 里不存在
      // 删除原来的_id
      delete one._id
      // 时间更新
      await db.collection('pending_company').add({
        data: one
      }).then(res => {
        if (res._id != '') {
          result_data = {
            code: 200,
            message: 'OK',
          }
        } else {
          result_data = {
            code: 500,
            message: 'ERROR',
          }
        }
      })
    }
  }
  else if (data) {  //未审核通过直接来修改
    result_data = {
      code: 400,
      message: '已申请，请稍后',
    }
  }
  else {  //未审核通过，也不是修改，直接添加
    await db.collection('pending_company').add({
      data: one
    }).then(res => {
      if (res._id != '') {
        result_data = {
          code: 200,
          message: 'OK',
        }
      } else {
        result_data = {
          code: 500,
          message: 'ERROR',
        }
      }
    })
  }

  return {
    result_data
  }
}

async function update_fail_company(data,result_data){
  let _id = data._id
  // 1、先将fail_company 集合中将本数据删除
  await db.collection('fail_company').doc(_id).remove()
  // 2、将新数据添加到pending_company集合中
  delete data._id
  delete data.comment
  // 4、添加至 pending_position集合中
  await db.collection('pending_company').add({
    data: data
  }).then(res => {
    result_data = {
      code: 200,
      message: 'ok'
    }
  })
  return result_data
}


async function get_company_info(newData, result_data, _openid) {
  let arr = []
  arr = await db.collection('company').where({
    id: newData.id
  }).get().then(res => { return res.data[0] })
  return arr
}

async function get_pending_company_id(newData, result_data, _openid) {
  let id = newData ? newData.id : ''
  let arr = []
  if (id) {
    if (newData.active == '0')
      arr = await db.collection('pending_company').where({
        _id: id
      }).get()
    else {
      arr = await db.collection('company').where({
        _id: id
      }).get()
    }
  } else {
    arr = await db.collection('pending_company').where({
      id: _openid
    }).get()
  }
  return {
    arr
  }
}

async function get_pending_company() {
  let arr = await db.collection('pending_company').get()
  return {
    arr
  }
}

async function get_fail_company(_openid) {
  let arr = await db.collection('fail_company').where({
    id:_openid
  }).get()
  return {
    arr
  }
}

async function get_fail_postion(_openid) {
  let arr = await db.collection('fail_position').where({
    id:_openid
  }).get()
  return {
    arr
  }
}

async function get_position(data, result_data, _openid) {
  let where = {
    id: data.company_id
  }
  let total //
  let r
  // 第一遍获取，pending_position表里面的
  if (data.if_active == 0) {
    await db.collection('pending_position')
      .where(where)
      .count().then(res => {
        total = res.total
      })
    if (total == 0) {
      result_data = {
        code: 400,
        message: "no",
        data: []
      }
      return result_data
    } else {
      result_data.total = total
    }
    r = await db.collection('pending_position')
      .where(where)
      .skip((data.page - 1) * 10).limit(10)
      .orderBy('created_at', 'desc')
      .get()
    r.data.map(v => {
      let d = new Date(v.created_at);
      v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
    })
  }

  // 第二遍获取，position表里面的
  if (data.if_active == 1) {
    await db.collection('position')
      .where(where)
      .count().then(res => {
        total = res.total
      })
    if (total == 0) {
      result_data = {
        code: 400,
        message: "no",
        data: []
      }
      return result_data
    } else {
      result_data.total = total
    }
    r = await db.collection('position')
      .where(where)
      .skip((data.page - 1) * 10).limit(10)
      .orderBy('created_at', 'desc')
      .get()
    r.data.map(v => {
      let d = new Date(v.created_at);
      v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
    })
  }
  result_data.code = 200,
    result_data.message = 'ok'
  result_data.data = r.data
  return result_data
}

async function search_position(data, result_data, _openid) {
  let total // 计数
  let r  //结果
  // 第一遍获取，pending_position表里面的
  if (data.if_active == 0) {
    await db.collection('pending_position')
      .where({
        id: data.company_id,
        name: db.RegExp({
          regexp: data.searchValue,
          options: 'i'
        })
      })
      .count().then(res => {
        total = res.total
      })

    if (total == 0) {
      result_data = {
        code: 400,
        message: "no",
        data: []
      }
      return result_data
    } else {
      result_data.total1 = total
    }
    r = await db.collection('pending_position')
      .where({
        id: data.company_id,
        name: db.RegExp({
          regexp: data.searchValue,
          options: 'i'
        })
      })
      .skip((data.page - 1) * 10).limit(10)
      .orderBy('created_at', 'desc')
      .get()
    r.data.map(v => {
      let d = new Date(v.created_at);
      v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
    })
  }

  // 第二遍获取，position表里面的
  if (data.if_active == 1) {
    await db.collection('position')
      .where({
        id: data.company_id,
        name: db.RegExp({
          regexp: data.searchValue,
          options: 'i'
        })
      })
      .count().then(res => {
        total = res.total
      })
    if (total == 0) {
      result_data = {
        code: 400,
        message: "no",
        data: []
      }
      return result_data
    } else {
      result_data.total2 = total
    }
    r = await db.collection('position')
      .where({
        id: data.company_id,
        name: db.RegExp({
          regexp: data.searchValue,
          options: 'i'
        })
      })
      .skip((data.page - 1) * 10).limit(10)
      .orderBy('created_at', 'desc')
      .get()
    r.data.map(v => {
      let d = new Date(v.created_at);
      v.time = (d.getMonth() + 1) + '月' + d.getDate() + '号';
    })
  }
  result_data.code = 200,
    result_data.message = 'ok'
  result_data.data = r.data
  return result_data
}

async function add_pending_position(data, result_data, _openid) {
  // return data
  // 先根据ID（注册时的openID）去获取公司的信息，需要logo、name、_id
  let company = {}
  await db.collection('company').where({
    id: data.company_id
  }).get().then(res => {
    company = {
      _id: res.data[0]._id,
      name: res.data[0].name,
      logo: res.data[0].logo
    }
  })
  // 将获取的值添加至欲添加到表的字段
  data.one.company = company
  data.one.id = data.company_id
  await db.collection('pending_position').add({
    data: data.one
  }).then(res => {
    if (res._id != '') {
      result_data = {
        code: 200,
        message: 'OK',
      }
    } else {
      result_data = {
        code: 500,
        message: 'ERROR',
      }
    }
  })
  return {
    result_data
  }
}




async function update_fail_position(data,result_data){
  let _id = data.one._id
  // 1、先将fail_company 集合中将本数据删除
  await db.collection('fail_position').doc(_id).remove()
  // 2、将新数据添加到pending_company集合中
  delete data.one._id
  delete data.one.comment
  // 4、添加至 pending_position集合中
  await db.collection('pending_position').add({
    data: data.one
  }).then(res => {
    result_data = {
      code: 200,
      message: 'ok'
    }
  })
  return result_data
}


async function update_pending_position(data, result_data, _openid) {
  let _id = data._id
  delete data._id
  await db.collection('pending_position').doc(_id).update({
    data: data
  }).then(res => {
    result_data = {
      code: 200,
      message: 'ok'
    }
  })
  return result_data
}


// 更新职位
async function update_position(data, result_data, _openid) {
  let _id = data.one._id
  // // 1、先在position集合中将本数据删除，
  // await db.collection('position').doc(_id).remove()
  // // 2、将本公司的position_num 自减1
  // const _ = db.command;
  // await db.collection('company').where({
  //   id: data.id
  // }).update({
  //   data: {
  //     position_number: _.inc(-1)
  //   }
  // })
  // 3、删除当前的 _id 字段
  delete data.one._id
  data.one.old_id = _id
  // 4、添加至 pending_position集合中
  await db.collection('pending_position').add({
    data: data.one
  }).then(res => {
    result_data = {
      code: 200,
      message: 'ok'
    }
  })
  return result_data
}

async function remove_position(data, _openid) {
  // data.type = 0 时 pending_position 集合删除
  if (data.type == '0') {
    await db.collection('pending_position').doc(data._id).remove();
  }
  // data.type = 1 时 position 集合删除
  if (data.type == '1') {
    await db.collection('position').doc(data._id).remove();
    // 更新公司职位数
    const _ = db.command;
    await db.collection('company').where({
      id: data.company_id
    }).update({
      data: {
        position_number: _.inc(-1)
      }
    })
  }

  return 'ok'
}

async function get_deliveredALL(data, _openid) {
  // 获取自己有哪些职位
  let r1 = await db.collection('position').where({
    id: data.company_id
  }).get()
  let arr = []
  r1.data.map(v => {
    if (v.delivered.length > 0) {  //如果当前职位存在被投递
      v.delivered.map(v2 => {
        v2.name = v.name
      })
      arr = arr.concat(v.delivered)
    }
  })
  return arr
}

async function remove_company(data){
  // 获取公司id
  let company_id = data.company_id
  let user_id = data.user_id
  // 删除公司
  await db.collection('company').doc(company_id).remove()
  // 删除职位
  await db.collection('position').where({
    'company._id':company_id
  }).remove()
  // 用户信息企业修改
  await db.collection('user').where({
    _openid:user_id
  }).update({
    data:{
      is_company:false
    }
  })
  return 200
}