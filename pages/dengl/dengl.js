// pages/dengl/dengl.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
		app.setNavigationBarTitle('拿抓')
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

  },

  getCodeUserInfo(dd) {

    var that = this
    wx.login({
      success(res) {
        if (dd.detail.userInfo) {
          wx.getUserInfo({
            success: (e) => {
              if (res.code) {
// console.log(res)
// console.log('这是获取到的用户code')

// wx.request({
// 	url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx04816cefac2d5cf2&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
// 	data:{},
// 	method:'GET',
// 	success:(base)=>{
// 		console.log('拿到了')
// 		console.log(base)
// 	}
// })
                // 发起网络请求
                wx.showLoading({
                  title: '正在登陆',
                })
                app.request.post({
                  url: 'user/login',
                  data: {
                    code: res.code,
                    userInfo: e.userInfo
                  },
                  success: (we) => {
                    wx.setStorageSync('user_id', we.user_id);
                    wx.setStorageSync('user_info', e.userInfo);
										that.mydenglu();
                  }
                })
              }
            }
          })
        } else {
          console.log('用户点了否')
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
            showCancel: false,
            confirmText: '返回授权',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击了“返回授权”')
              }
            }
          })
        }
      }
    })

	},
	mydenglu() {
	app.status.dengluzhuangtai = 8

		wx.navigateBack({
			url:'?youhuiquanquan=99'
		})

		// wx.switchTab({
		// 	url:'/pages/personal/person/person'
		// })
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