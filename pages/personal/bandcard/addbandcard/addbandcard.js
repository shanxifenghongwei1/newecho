// pages/personal/bandcard/addbandcard/addbandcard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
	movemove(e){
		var that = this
		wx.showModal({
			title: '解除绑定',
			content: '是否确认解除绑定该张银行卡',
			success:(res)=>{
				if (res.confirm) {
					app.request.post({
						url: "moneycard/outcard",
						data: {
							moneycard_id: e.currentTarget.dataset.id
						},
						success: (e) => {
							wx.showToast({
								title: '取消绑定成功',
								icon: 'success',
								duration: 1500,
								mask: true
							})
							that.init();
						}
					})
				}
			}
		})
		


	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
		app.setNavigationBarTitle("我的银行卡");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init();
  },

  init() {
    app.request.post({
      url: "moneycard/mymoneycard",
      success: (e) => {
        this.setData({
          mymoneycard: e.mymoneycard
        })


      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})