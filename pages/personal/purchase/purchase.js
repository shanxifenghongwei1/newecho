// pages/purchase/purchase.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		app.setNavigationBarTitle("我的买单币");
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  init(){
    app.request.post({
      url: "activity/mynoblecardlist",
      data: {
        page: this.data.page
      },
      success: (e) => {
        console.log(e)
        this.setData({
					mymonet: e.pay_bill,
          list:e.all_pay_bill
        })
        
      }
    })
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
			this.init()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})