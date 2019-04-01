// pages/personal/coupon/mycoupon/mycoupon.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	
	},
	run(e) {
		wx.switchTab({
			url: '/pages/personal/person/person',
		})
		this.popseare(e)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var huser_id = wx.getStorageSync('user_id')
console.log(options.youhuiquanquan)

		if(options.joinpage == 1){
			this.setData({
				joinpage: 1,
			})
		}else{
			this.setData({
				joinpage: 2,
			})
		}


		this.setData({
			huser_id: huser_id,
			card_sn: options.card_sn
		})




	},

	goo(){
		if(!this.data.goods_id){
			
		}
		else{
			wx.navigateTo({
				url: 'pages/shop/details/details?goods=' + this.data.goods_id,
			})
		}

	},
// 
	popseare(e) {

		console.log(e)
		console.log('我动了！')
		let formId = e.detail.formId;
		// 忽略开发者工具里边的formId
		// if ( formId !== 'the formId is a mock one') {
		app.request.post({
			url: 'send/getFormId',
			data: {
				form_id: formId
			},
			success: (res) => {
				console.log(res)
			}
		})
		// }
	},
//  
init(asd){
	app.request.post({
		url: "virtual/shareCard?jionpage=" + this.data.joinpage,
		data: {
			card_sn:this.data.card_sn,	
		},
		success: (e) => {
			wx.hideLoading()
			if(e.state==1){
				console.log(this.data.joinpage)
				this.setData({
					qr_code: e.virtual.qr_code,
					shop_name: e.virtual.shop_name,
					titlie: e.virtual.card_name,
					card_sn: e.virtual.sign,
					shop_id: e.virtual.shop_id,
					goods_id: e.virtual.goods_id,
					shop_logo: e.virtual.shop_logo
				})
				
				if(this.data.joinpage == 2){

					setTimeout(()=>{
						app.showtost(e.msg)
					},1000)
				} 
				if (this.data.joinpage == 1) {
					// setTimeout(() => {
					// 	app.showtost('点击界面进来的')
					// }, 1000)
					
				}
			}else{
				wx.navigateBack({
					delta: 1,
				})
				setTimeout(() => {
					app.showtost(e.msg)
				}, 1000)
				
			}

		}
	})
},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		app.setNavigationBarTitle("优惠券详情");
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var huser_id = wx.getStorageSync('user_id')
		if (!huser_id) {
			console.log('没登录')
			app.dengluzt({})
		} else {
			wx.showLoading({
				title: '加载中..',
				mask:true
			})
			setTimeout(()=>{
				this.init()
			},2000)
			
		}
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
		return {
			title:'您的朋友送给你' + this.data.titlie,
			path: '/pages/personal/coupon/mycoupon/mycoupon?card_sn=' + this.data.card_sn + '&joinpage=2',
			imageUrl: this.data.shop_logo,
		}
	}
})