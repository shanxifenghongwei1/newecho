// pages/personal/business/bussinessmessage/bussinessusermessage.js
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		banner:[],
		src:[],
		date: '00:00',
		time: '00:00',
	},
	// 开始时间
	bigintime(e) {
		this.setData({
			date: e.detail.value
		})
	},
	// 结束时间
	endtime(e) {
		this.setData({
			time: e.detail.value
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
				console.log('改动了')
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
	// 获取商店信息
	init(){
		app.request.post({
			url:'business/getBusinessInfo',
			data:{
				shop_id:this.data.shop_id
			},
			success:(e)=>{
				this.setData({
					business:e.business,
					src: e.business.shop_logo,
					ars: e.business.shop_logo,
					date: e.business.business_start_hours,
					time: e.business.business_end_hours,
					banner:e.business.shop_img,
					banneras:e.business.shop_img,
				})
			}
		})
	},
	// 文字修改函数
	text_addshop(ads){
		app.request.post({
			url: 'business/editBusiness',
			data: ads,
			success: (e) => {
				wx.hideLoading()
				if (e.state == 1) {
					wx.navigateBack()
					setTimeout(() => {
						app.showtost(e.msg)
					}, 1000)
				} else {
					app.showtost(e.msg)
				}
			}
		})
	},
	// 修改商店信息
	addshopproduct(e){
		let ads = e.detail.value

		wx.showLoading({
			title: '正在提交',
			mask:true
		})
		ads.shop_id = this.data.shop_id



	//  缩略图上传校验
	 let path = this.data.ars == this.data.src ? this.data.src + '': this.data.src[0] + ''  
		if (this.data.ars == this.data.src){
			ads.shop_logo = ''
			this.text_addshop(ads)
		} else {
			wx.showLoading({
				title: '缩略图上传中',
				mask:true
			})
			wx.uploadFile({
				url: app.host.image + 'api/business/upload',
				name: 'shop_logo',
				filePath: path,
				success: (res) => {
					ads.shop_logo = res.data
					wx.hideLoading()
					// wx.showLoading({
					// 	title: '轮播图上传中',
					// 	mask: true
					// })
					this.text_addshop(ads)
				},

			})
		}




	},





	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		app.setNavigationBarTitle('信息修改')
		this.setData({
			shop_id:options.shop_id
		})
		this.init()
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