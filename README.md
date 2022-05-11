# 使用说明

## 导入database

### 选择云环境

#### 选择安装依赖

# 开发文档

## 字段说明  user、company、admin

### company 公司数据集合

| 名称            | 类型   | 空   | 默认 | 说明              |
| --------------- | ------ | ---- | ---- | ----------------- |
| _id             | string | 否   |      | 公司唯一标识      |
| address         | string | 否   |      | 公司详细地区      |
| created_at      | number | 否   |      | 创建时间戳        |
| desc            | string | 否   |      | 公司              |
| id              | string | 否   |      | 用户绑定的ID      |
| legal_ID        | string | 否   |      | 法人身份证        |
| legal_name      | string | 否   |      | 法人姓名          |
| legal_phone     | string | 否   |      | 法人电话          |
| legal_sex       | string | 否   |      | 法人性别          |
| license         | array  | 否   |      | 营业许可证照片URL |
| location        | object | 否   |      | 公司大概地址      |
| logo            | string | 否   |      | 公司LOGO的URL     |
| name            | string | 否   |      | 公司名称          |
| phone           | string | 否   |      | 公司电话          |
| position_number | number | 否   |      | 公司发表的职位数  |

### f_area  地区数据集合

| 名称       | 类型   | 空   | 默认 | 说明                 |
| ---------- | ------ | ---- | ---- | -------------------- |
| _id        | string | 否   |      | 地区（城市）唯一标识 |
| created_at | number | 否   |      | 创建时间戳           |
| name       | string | 否   |      | 地区（城市）名称     |

### f_label  标签数据集合

| 名称       | 类型   | 空   | 默认 | 说明         |
| ---------- | ------ | ---- | ---- | ------------ |
| _id        | string | 否   |      | 标签唯一标识 |
| created_at | number | 否   |      | 创建时间戳   |
| name       | string | 否   |      | 标签名称     |

### f_salary  薪资数据集合

| 名称       | 类型   | 空   | 默认 | 说明         |
| ---------- | ------ | ---- | ---- | ------------ |
| _id        | string | 否   |      | 薪资唯一标识 |
| created_at | number | 否   |      | 创建时间戳   |
| name       | string | 否   |      | 薪资名称     |

### f_type  类型数据集合

| 名称       | 类型   | 空   | 默认 | 说明         |
| ---------- | ------ | ---- | ---- | ------------ |
| _id        | string | 否   |      | 类型唯一标识 |
| created_at | number | 否   |      | 创建时间戳   |
| name       | string | 否   |      | 类型名称     |

### fail_company 企业审核失败数据集合

| 名称        | 类型   | 空   | 默认 | 说明              |
| ----------- | ------ | ---- | ---- | ----------------- |
| _id         | string | 否   |      | 公司唯一标识      |
| address     | string | 否   |      | 公司详细地区      |
| created_at  | number | 否   |      | 创建时间戳        |
| desc        | string | 否   |      | 公司              |
| id          | string | 否   |      | 用户绑定的ID      |
| legal_ID    | string | 否   |      | 法人身份证        |
| legal_name  | string | 否   |      | 法人姓名          |
| legal_phone | string | 否   |      | 法人电话          |
| legal_sex   | string | 否   |      | 法人性别          |
| license     | array  | 否   |      | 营业许可证照片URL |
| location    | object | 否   |      | 公司大概地址      |
| logo        | string | 否   |      | 公司LOGO的URL     |
| name        | string | 否   |      | 公司名称          |
| phone       | string | 否   |      | 公司电话          |
| comment     | string | 否   |      | 审核失败的备注    |

### fail_position  职位审核失败数据集合

| 名称       | 类型   | 空   | 默认 | 说明           |
| ---------- | ------ | ---- | ---- | -------------- |
| _id        | string | 否   |      | 唯一标识       |
| area       | string | 否   |      | 职位所在城市   |
| company    | object | 否   |      | 职位所属公司   |
| created_at | number | 否   |      | 创建时间戳     |
| desc       | string | 否   |      | 职位描述       |
| label      | object | 否   |      | 职位类型       |
| location   | object | 否   |      | 职位地址       |
| name       | string | 否   |      | 职位名称       |
| phone      | string | 否   |      | 职位联系方式   |
| salary     | object | 否   |      | 职位薪资       |
| type       | object | 否   |      | 职位所属类型   |
| weixin     | string | 否   |      | 职位联系微信   |
| comment    | string | 否   |      | 审核失败的备注 |

### pending_company 公司待审核数据集合

| 名称        | 类型   | 空   | 默认 | 说明              |
| ----------- | ------ | ---- | ---- | ----------------- |
| _id         | string | 否   |      | 公司唯一标识      |
| address     | string | 否   |      | 公司详细地区      |
| created_at  | number | 否   |      | 创建时间戳        |
| desc        | string | 否   |      | 公司              |
| id          | string | 否   |      | 用户绑定的ID      |
| legal_ID    | string | 否   |      | 法人身份证        |
| legal_name  | string | 否   |      | 法人姓名          |
| legal_phone | string | 否   |      | 法人电话          |
| legal_sex   | string | 否   |      | 法人性别          |
| license     | array  | 否   |      | 营业许可证照片URL |
| location    | object | 否   |      | 公司大概地址      |
| logo        | string | 否   |      | 公司LOGO的URL     |
| name        | string | 否   |      | 公司名称          |
| phone       | string | 否   |      | 公司电话          |

### pending_position 职位待审核数据集合

| 名称       | 类型   | 空   | 默认 | 说明         |
| ---------- | ------ | ---- | ---- | ------------ |
| _id        | string | 否   |      | 唯一标识     |
| area       | string | 否   |      | 职位所在城市 |
| company    | object | 否   |      | 职位所属公司 |
| created_at | number | 否   |      | 创建时间戳   |
| desc       | string | 否   |      | 职位描述     |
| label      | object | 否   |      | 职位类型     |
| location   | object | 否   |      | 职位地址     |
| name       | string | 否   |      | 职位名称     |
| phone      | string | 否   |      | 职位联系方式 |
| salary     | object | 否   |      | 职位薪资     |
| type       | object | 否   |      | 职位所属类型 |
| weixin     | string | 否   |      | 职位联系微信 |

### position 职位数据集合

| 名称           | 类型   | 空   | 默认 | 说明             |
| -------------- | ------ | ---- | ---- | ---------------- |
| _id            | string | 否   |      | 唯一标识         |
| deliveredTotal | number | 是   | 0    | 职位被投递数     |
| delivered      | array  | 是   | NULL | 职位被投递的简历 |
| area           | string | 否   |      | 职位所在城市     |
| company        | object | 否   |      | 职位所属公司     |
| created_at     | number | 否   |      | 创建时间戳       |
| desc           | string | 否   |      | 职位描述         |
| id             | string | 否   |      | 企业标识ID       |
| info_readTotal | number | 是   | 0    | 消息阅读数       |
| label          | object | 否   |      | 职位类型         |
| location       | object | 否   |      | 职位地址         |
| name           | string | 否   |      | 职位名称         |
| phone          | string | 否   |      | 职位联系方式     |
| salary         | object | 否   |      | 职位薪资         |
| type           | object | 否   |      | 职位所属类型     |
| weixin         | string | 否   |      | 职位联系微信     |

### resume 简历数据集合

| 名称            | 类型   | 空   | 默认 | 说明           |
| --------------- | ------ | ---- | ---- | -------------- |
| _id             | string | 否   |      | 唯一标识       |
| age             | string | 否   |      | 年龄           |
| created_at      | number | 否   |      | 创建时间戳     |
| degree          | string | 否   |      | 学历           |
| deliveryRecord  | array  | 否   |      | 简历投递的职位 |
| email           | string | 否   |      | 邮箱           |
| entrance_time   | string | 否   |      | 入学时间       |
| exp_Location    | string | 否   |      | 期望城市       |
| exp_posistion   | string | 否   |      | 期望行业       |
| exp_Salary      | string | 否   |      | 期望薪资       |
| graduation_time | string | 否   |      | 毕业时间       |
| hobbies         | string | 是   | NULL | 爱好           |
| introduction    | string | 是   | NULL | 个人介绍       |
| name            | string | 否   |      | 名字           |
| openid          | string | 否   |      | 用户标识       |
| origin          | string | 否   |      | 居住地         |
| phone           | string | 否   |      | 联系电话       |
| remarks         | string | 否   |      | 备注           |
| school          | string | 否   |      | 毕业学校       |
| sex             | string | 否   |      | 性别           |
| winnings        | array  | 是   | NULL | 荣获奖项       |
| workExps        | array  | 是   | NULL | 工作经验       |

### swiper 轮播图数据集合

| 名称  | 类型   | 空   | 默认 | 说明     |
| ----- | ------ | ---- | ---- | -------- |
| _id   | string | 否   |      | 唯一标识 |
| prics | array  | 否   |      | 图片地址 |

### user 用户数据集合

| 名称            | 类型    | 空   | 默认 | 说明           |
| --------------- | ------- | ---- | ---- | -------------- |
| _id             | string  | 否   |      | 自动编号       |
| _openid         | string  | 否   |      | 唯一标识       |
| avatarUrl       | string  | 否   |      | 头像地址       |
| city            | string  | 否   |      | 手机号归属地   |
| country         | string  | 否   |      | 归属国家       |
| created_at      | number  | 否   |      | 创建时间戳     |
| gender          | string  | 否   |      | 性别           |
| is_admin        | boolean | 否   |      | 是否管理员     |
| is_company      | boolean | 否   |      | 是否企业       |
| language        | string  | 否   |      | 归属语言       |
| my_conllections | array   | 是   | NULL | 收藏职位集合   |
| nickName        | string  | 否   |      | 昵称           |
| province        | string  | 否   |      | 手机号所属省份 |