// pages/scattered/userAgreement/userAgreement.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
		html:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.init()
  },

init(){
app.request.post({
	url: 'problem/agreement',
	data:{},
	success:(res)=>{
		
		let a = res.msg
		let html = { name: '支付协议', text: '<div style="padding:10px">' + a + '</div>' }
		this.setData({
			html: html
		})
	}
})
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