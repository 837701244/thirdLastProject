## 这是商城页面以及后台管理

### woniushop是商城页面

### wouniushop_back是商城的后端服务器

### wouniushop_back是后台管理

### back_server是后台管理的后端服务器

### 前端是由webpack搭建，后端是由express搭建

## 后台后端服务器文件介绍

```js
bin (脚手架自带文件，npm run start会打开这个文件)

config db.js (配置文件，里面装的是mongoose插件，以及连接数据库的信息)

public (一般存放上传图片以及下载的文件)
/uploads(图片上传的地方)

util(放工具js文件)

routes(路由模块按,照接口的业务功能来将不同的路由封装成一个个独立的模块)

controller(专门放置路由模块中的请求，里面调用操作数据库的方法)

model(按照不同需求创建文件，连接数据库，操作数据库)

app.js(主要的文件，配置各种，)
```



