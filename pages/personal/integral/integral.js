// pages/integral/integral.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money_list: [],
    symbolw:'',
    mast:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
		app.setNavigationBarTitle("我的积分");
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
			url: "integral/get_integral",
      isLoading: true,
      success: (e) => {
				console.log(e)

        this.setData({
					more: e.inte_desc.integral_sum,
					money_list: e.inte_desc.desc,
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