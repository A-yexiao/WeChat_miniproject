# 松鼠招聘说明文档

## 导入说明

1、项目设置 -> 开启增强编译、内建NPM

2、导入小程序后，在`cloudfunctions`文件夹下 `eval`文件鼠标右键上传部署

3、设置APP.js文件下的`env`属性，配置自己的环境ID

## API说明

### 云函数调用

| API名称    | 作用     |
| ---------- | -------- |
| get_search | 模糊搜索 |
| get_filter | 获取标签 |
| add_area   | 增加地区 |
|remove_area | 删除地区 |
|update_area | 更新地区 |
|add_label   | 增加标签 |
|remove_label| 删除标签 |
|update_label| 更新标签 |
|add_type    | 增加类型 |
|remove_type| 删除类型 |
|update_type| 更新类型 |
|add_salary| 增加薪资 |
|remove_salary| 删除薪资 |
|update_salary| 更新薪资 |
|add_company| 添加公司 |
|remove_company| 删除公司 |
|update_company| 更新公司 |
|add_position| 增加职位 |
|remove_position| 删除职位 |
|update_position| 更新职位 |
|get_user_info| 获取用户信息 |
|get_MyConllection| 获取收藏信息 |
|update_MyConllection| 更新收藏信息 |
|get_user| 获取用户 |
|update_user| 更新用户 |
|remove_user| 删除用户 |
|add_user| 增加用户 |
|remove_pic| 删除轮播图 |
|update_join| 更新入驻图 |
|update_swiper| 更新轮播图 |