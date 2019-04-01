// pages/personal/putaway/putaway.js
const app = getApp();
var timestamp = Date.parse(new Date());
var date = new Date(timestamp);
//获取年份  
var Y = date.getFullYear();
//获取月份  
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//获取当日日期 
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
Page({

  /**
   * 页面的初始数据
   */
	data: {
		type_array: [],
		type_index: 0,
		mmm: [],
		type_id: 0,
		idd: 2,
		cuxiao:0,
		src: '',
		is_hot: 1,
		date:Y+'-'+M+"-"+D,
		time: Y + '-' + M + "-" + D,
		banner: [],
		items: [{
			name: 'USA',
			value: '七天不退'
		},
		{
			name: 'CHN',
			value: '不满减不优惠',
			checked: 'true'
		},
		{
			name: 'BRA',
			value: '仅能使用优惠券'
		},
		{
			name: 'JPN',
			value: '不支持优惠券付款'
		},

		],
		itemsas: [{
			id: '1',
			value: '是',
		},
		{
			id: '0',
			value: '否',
			checked: 'true'
		},
		],
		itemsa: [{
			id: '1',
			value: '是',
			checked: 'true'
		},
		{
			id: '2',
			value: '否'
		},
		],

	},


// 促销开始时间
	bigintime(e) {
		this.setData({
			date: e.detail.value
		})
	},

	// 活动结束时间
	endtime(e) {
		this.setData({
			time: e.detail.value
		})
	},

	// 是否热销
	radioChange(e) {
		this.setData({
			like: e.detail.value
		})
	},
	radioChanges(e){
		this.setData({
			cuxiao:e.detail.value,
			date: Y + '-' + M + "-" + D,
			time: Y + '-' + M + "-" + D
		})
	},
	// 选择产品类型
	bindPickerChange: function (e) {
		console.log(e)
		let ab = this.data.type_array
		ab.forEach((k, v) => {
			if (v == e.detail.value) {
				this.setData({
					idd: ab[v].id
				})
			}
		})
		this.setData({
			type_index: e.detail.value
		})

	},
	// 产品条件
	checkboxChange: function (e) {
		console.log('checkbox发生change事件，携带value值为：', e.detail.value)
	},
	danjia(e) {
		this.setData({
			danjia: e.detail.value
		})
	},
	// 修改商家logo图
	user: function () {


		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				var tempFilePaths = res.tempFilePaths
				this.setData({
					src: tempFilePaths
				})
			},
			fail: function (res) {
				console.log(res.errMsg)
			}
		})
	},

	// 添加商家banner图
	addimageones: function (e) {
		if (this.data.banner.length >= 3) {
			wx.showToast({
				title: '最多能添加3张哦',
				icon: 'none',
				duration: 2000
			})
		} else {
			wx.chooseImage({
				count: 3,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					var tempFilePaths = res.tempFilePaths
					this.setData({
						banner: this.data.banner.concat(tempFilePaths)
					})
				}
			})
		}
	},
	// 修改商家banner图
	image_exchange: function (e) {
		var data_id = e.currentTarget.dataset.id
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				var tempFilePaths = res.tempFilePaths
				var abc = this.data.banner
				abc.forEach((v, k) => {
					if (k == data_id) {
						abc[k] = tempFilePaths[0]
					}
				})
				this.setData({
					banner: abc,
				})
			},
			fail: function (res) {
				console.log(res.errMsg)
			}
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		app.setNavigationBarTitle('产品添加')
		if (options.type == 1) {
			this.init(options.goods_id);
			this.setData({
				gotype: options.type
			})
		}
		this.setData({
			myshop_id: options.myshop_id
		})
		// 拿到列表
		app.request.post({
			url: "Shopcenter/getcat",
			isLoading: true,
			success: (res) => {
				console.log(res)
				this.setData({
					type_array: res.tree
				})
			}
		})
	},
	// 拿到商品数据
	init(a) {
		app.request.post({
			url: "goods/getGoodsInfo",
			isLoading: true,
			data: {
				goods_id: a
			},
			success: (e) => {
				console.log(e)
				this.setData({
					goods: e.goods,
					banner: this.data.banner.concat(e.goods.goods_img),
					listimg: e.goods.goods_img,
					src: e.goods.goods_thumb,
					idd: e.goods.cat_id,
					date: e.goods.promote_start_date,
					time: e.goods.promote_end_date
					// like:e.is_hot
				})
				if (e.goods.is_hot == 1) {
					this.setData({
						itemsa: [{
							id: '1',
							value: '是',
							checked: 'true'
						},
						{
							id: '2',
							value: '否'
						},
						],
					})
				} else if (e.goods.is_hot == 2) {
					this.setData({
						itemsa: [{
							id: '1',
							value: '是',
						},
						{
							id: '2',
							value: '否',
							checked: 'true'
						},
						],
					})
				}
				if (e.goods.is_promote == 1){
					this.setData({
						itemsas: [{
							id: '1',
							value: '是',
							checked: 'true'
						},
						{
							id: '0',
							value: '否',
						},
						],
						cuxiao:1
					})
				}else{
					this.setData({
						itemsas: [{
							id: '1',
							value: '是',
						},
						{
							id: '0',
							value: '否',
							checked: 'true'
						},
						],
						cuxiao:0
					})
				}
			}
		})
	},
	// 提交修改
	change(e) {
		let times = this.data.time
		let a_times = times.split("-")
		let b_times = a_times.join("")
		console.log(b_times)
		console.log(Y + M + D)
		wx.showLoading({
			title: '正在提交',
			mask: true
		})

// if()

		this.setData({
			llllll: e.detail.value
		})

		// 商品属性
		let shop_price = e.detail.value.shop_price.split('')
		if (e.detail.value.goods_name == '') {
			app.showtost('请输入产品名称')
		} else if (e.detail.value.keywords == '') {
			app.showtost('请输入产品关键词')
		} else if (e.detail.value.goods_brief == '') {
			app.showtost('请输入产品简介')
		} else if (e.detail.value.goods_brief.length >= 51) {
			app.showtost('产品简介最多50个字')
		}
		else if (e.detail.value.shop_price == '') {
			app.showtost('请输入产品单价')
		} else if (e.detail.value.goods_number == '') {
			app.showtost('请输入产品数量')
		}
		else if (this.data.time && b_times <= Y+M+D ) {
			app.showtost('结束时间错误')
		}
		
		 else if (e.detail.value.goods_desc == '') {
			app.showtost('请输入产品详情')
		} else if (this.data.src == '') {
			app.showtost('请上传产品缩略图')
		} else if (this.data.banner.length <= 0) {
			app.showtost('请上传产品详情图')
		} else {

			// 缩略图上传
			app.upload_img({
				url: app.host.image + 'api/shopcenter/uploadimg?goods_id=' + this.data.goods.goods_id,
				path: this.data.src[0],
				name: 'goods_thumb',
				success: (res) => {

				}
			})
			// 轮播图上传=
			let i = 0
			if (this.data.banner[i] !== this.data.listimg[i]) {
				app.upload_img({
					url: app.host.image + 'api/shopcenter/uploadimg?goods_id=' + this.data.goods.goods_id + '&page=' + i,
					path: this.data.banner[i],
					name: 'goods_img',
					success: (res) => {
						// ----
						if (res.statusCode == 200) {
							i++
							if (this.data.banner[i] !== this.data.listimg[i]) {
								app.upload_img({
									url: app.host.image + 'api/shopcenter/uploadimg?goods_id=' + this.data.goods.goods_id + '&page=' + i,
									path: this.data.banner[i],
									name: 'goods_img',
									success: (res) => {
										if (res.statusCode == 200) {
											i++
											// --
											if (this.data.banner[i] !== this.data.listimg[i]) {
												app.upload_img({
													url: app.host.image + 'api/shopcenter/uploadimg?goods_id=' + this.data.goods.goods_id + '&page=' + i,
													path: this.data.banner[i],
													name: 'goods_img',
													success: (res) => {
														if (res.statusCode == 200) {
															i++
															// --
															if (this.data.banner[i] !== this.data.listimg[i]) {
																app.upload_img({
																	url: app.host.image + 'api/shopcenter/uploadimg?goods_id=' + this.data.goods.goods_id + '&page=' + i,
																	path: this.data.banner[i],
																	name: 'goods_img',
																	success: (res) => {
																		if (res.statusCode == 200) {
																			console.log('第三张图片完成')
																		}
																	}
																})

															}
															// --
														}
													}
												})
											}
											// --
										}
									}
								})
								// -----
							} else {
								console.log('第一张图片上传失败')
							}
						}
					}
				})
			}

			this.textgo()

			// wx.uploadFile({
			// 	url: 'https://www.nazhua.net/api/shopcenter/uploadimg?goods_id=' + this.data.goods.goods_id + '&page=' + i,
			// 	filePath: this.data.banner[i],
			// 	name: 'goods_img',
			// 	success: function (res) {

			// 	}
			// })

			// 上传文字


		}
	},
	textgo() {
		app.request.post({
			url: "Shopcenter/editgoods",
			isLoading: true,
			data: {
				shop_edit: this.data.llllll
			},
			success: (e) => {
				wx.hideLoading()
				wx.navigateBack()
				setTimeout(() => {
					app.showtost('修改成功')
				}, 500)
			}
		})
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {

	},
	// 添加商品
	addshopproduct(e) {

		wx.showLoading({
			title: '正在提交',
			mask: true
		})
		// 商品属性
		// e.detail.value.cat_id = this.data.idd
		let goods_number = e.detail.value.goods_number.split('')
		let shop_price = e.detail.value.shop_price.split('')
		if (e.detail.value.goods_name == '') {
			app.showtost('请输入产品名称')
		} else if (e.detail.value.keywords == '') {
			app.showtost('请输入产品关键词')
		} else if (e.detail.value.goods_brief == '') {
			app.showtost('请输入产品简介')
		} else if (e.detail.value.goods_brief.length >= 51) {
			app.showtost('产品简介最多50个字')
		}
		else if (e.detail.value.shop_price == '') {
			app.showtost('请输入产品单价')
		} else if (e.detail.value.goods_number == '') {
			app.showtost('请输入产品数量')
		} else if (e.detail.value.goods_desc == '') {
			app.showtost('请输入产品详情')
		} else if (this.data.src == '') {
			app.showtost('请上传产品缩略图')
		} else if (this.data.banner.length <= 0) {
			app.showtost('请上传产品详情图')
		} else {




			// 发送文件
			app.request.post({
				url: "shopcenter/addgoods",
				// isLoading: true,
				data: {
					shop_add: e.detail.value
				},
				success: (e) => {
					if (e.state == 1) { 

					let ps = 1
					// 添加banner图
					app.upload_imgs({
						url: app.host.image + 'api/shopcenter/uploadimg',
						n_url: '?goods_id= ' + e.goods_id + '&page=',
						name: 'goods_img',
						banner: this.data.banner,
						i: 0,
						success: (res) => {
							console.log(ps)
							if (ps >= this.data.banner.length) {
								console.log('ps > ')
								// 添加缩略图
								wx.uploadFile({
									url: app.host.image + 'api/shopcenter/uploadimg?goods_id=' + e.goods_id,
									filePath: this.data.src[0],
									name: 'goods_thumb',
									success: function (res) {
										wx.hideLoading()
										// app.showtost('缩略图上传成功')
										wx.navigateBack()
										setTimeout(() => {
											app.showtost('添加成功')
										}, 1000)

									}
								})
							} else {
								ps++
							}

						}
					})

					}else{

						app.showtost(e.msg)

					}





					// let i = 0
					// let data = {
					//   url: 'https://www.nazhua.net/api/shopcenter/uploadimg?goods_id=' + e.goods_id + '&page=' + i,
					//   path: this.data.banner[i],
					//   name: 'goods_img',
					//   success: (res) => {
					// 		app.upload_img(data)
					//   }
					// }
					// // ----
					// for (var i = 0; i < 3; i++) {
					//   wx.uploadFile({
					//     url: 'https://www.nazhua.net/api/shopcenter/uploadimg?goods_id=' + e.goods_id + '&page=' + i,
					//     filePath: this.data.banner[i],
					//     name: 'goods_img',
					//     success: function(res) {
					//       // app.showtost('第' + i + '张图片上传成功')
					//     }
					//   })
					// }

				}
			})
		}
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