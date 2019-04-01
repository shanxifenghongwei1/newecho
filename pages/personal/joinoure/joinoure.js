// pages/personal/joinoure/joinoure.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: [app.host.resources + 'shangchuantupian.png'],
    asrc: [app.host.resources + 'shangchuantupian.png'],
    banner: [],
    identity: [],
    type_array: [],
    address_add: '',
    address: '',
    date: '00:00',
    time: '00:00',
    idd: 2,
		issure:false,
    type_index: 0,
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
		app.setNavigationBarTitle('申请加盟')
    if (options.id) {
      this.setData({
        msg_id: options.id
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
    this.init()
  },
	checkboxChange(e){
		console.log(e.detail.value)
		if(e.detail.value.length > 0) {
			this.setData({
				issure:false
			})
		}else{
			this.setData({
				issure: true
			})
		}
	},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 获取用户地址
  get_userlocal() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          jingwei: {
            lat: res.latitude,
            lon: res.longitude
          },
          address: res.name
        })
      }
    })
  },
  // 拿到类型列表
  init() {
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

  // 选择商家类型
  bindPickerChange: function(e) {
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
  // 添加店铺照片图
  addimageones: function(e) {
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
  // 添加修改身份证
  addshenfenimageones: function(e) {
    if (this.data.identity.length >= 2) {
      wx.showToast({
        title: '最多能添加3张哦',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.chooseImage({
        count: 2,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths
          this.setData({
            identity: this.data.identity.concat(tempFilePaths)
          })
        }
      })
    }
  },
  // 身份证图片修改：
  shenfen_exchange: function(e) {
    console.log('我点击了这个东西')
    console.log(e)
    var data_id = e.currentTarget.dataset.id
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        var abc = this.data.identity
        abc.forEach((v, k) => {
          if (k == data_id) {
            abc[k] = tempFilePaths[0]
          }
        })
        this.setData({
          identity: abc,
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 修改商家banner图
  image_exchange: function(e) {
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
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 商店缩略图
  auser: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        this.setData({
          asrc: tempFilePaths
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 营业执照图修改
  user: function() {
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
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
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
  // 店铺详细地址
  address_add(e) {
    this.setData({
      address_add: e.detail.value
    })
  },
  // 获取formid
  popseare(e) {
    console.log(e)
    console.log('我动了！')
    let formId = e.detail.formId;
    app.request.post({
      url: 'send/getFormId',
      data: {
        form_id: formId
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  addshopproduct(e) {
    this.popseare(e)
    // 添加需要发送的字段
    let boom = e.detail.value
    // console.log(this.data.acrc)
    // 营业执照
    console.log(boom)
    console.log('iphone')
    console.log(boom.iphone)
    this.checkForm(boom.iphone)
    if (boom.shop_name.length >= 30) {
      app.showtost('店铺名称最大长度为30')
    } else if (boom.shop_name.length == 0) {
      app.showtost('请输入店铺名称')
    } else if (boom.keywords.length == 0) {
      app.showtost('请输入关键词')
    } else if (boom.keywords.length > 20) {
      app.showtost('关键词最大长度为20')
    } else if (boom.brief.length == 0) {
      app.showtost('请输入店铺简介')
    } else if (boom.brief.length > 240) {
      app.showtost('店铺简介最大长度为240')
    } else if (boom.iphone.length == 0) {
      app.showtost('请输入联系方式')
    } else if (boom.business_hours_re.length == 0) {
      app.showtost('请输入备注')
    } else if (boom.business_hours_re.length > 7) {
      app.showtost('备注最大长度为7')
    } else if (!this.data.jingwei) {
      app.showtost('请选择地址')
    } else if (this.data.address_add.length == 0) {
      app.showtost('请输入详细地址')
    } else if (this.data.address_add.length > 80) {
      app.showtost('详细地址最大80字')
    } else if (this.data.asrc == 'https://cd.nazhua.net/upload/shangchuantupian.png') {
      app.showtost('请上传店铺缩略图')
    } else if (this.data.src == 'https://cd.nazhua.net/upload/shangchuantupian.png') {
      app.showtost('请上传营业执照')
    } else if (this.data.identity.length == 0) {
      app.showtost('请上传身份证正反面')
    } else if (this.data.identity.length < 2) {
      app.showtost('请上传身份证正反面')
    } else if (this.data.banner.length == 0) {
      app.showtost('请上传店铺轮播图')
    } else if (this.data.banner.length < 1) {
      app.showtost('请上传店铺轮播图')
    } else if (this.data.iphone == false) {
      app.showtost('请输入正确的手机号')
    } else {
			wx.showLoading({
				title: '正在提交',
				mask:true
			})
      boom.lat = this.data.jingwei.lat
      boom.lng = this.data.jingwei.lon
      boom.classification = this.data.idd
      boom.msg_id = this.data.msg_id
      let b = this.data.address
      b += this.data.address_add
      boom.address = b
      app.request.post({
        url: 'shopcenter/addbusiness',
        isLoading: true,
        data: boom,
        success: (res) => {
					wx.hideLoading()
					console.log('审核文成之后')
					console.log(res)
          
          if (res.state == 2) {
						setTimeout(()=>{
							app.showtost(res.msg)
						},500)
					
          } else {
            wx.showToast({
              title: '店铺创建成功',
              duration: 700,
              mask: true,
              success: () => {
                this.bannergo(res.business_id)
              }
            })
          }
        }

      })
    }

  },
  checkForm(esd) {
    console.log('正则在执行')
    var re = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|6[567]\d{2}|4[579]\d{2})\d{6}$/;
    if (!re.test(esd)) {
      app.showtost('请输入正确的手机号码。');
      this.setData({
        iphone: false
      })
      return false;
    } else {
      this.setData({
        iphone: true
      })
    }
  },

  // 店铺轮播上传
  bannergo(id) {
    wx.showLoading({
      title: '轮播图上传中',
      mask: true,
    })
    let banner = this.data.banner
    let i = 1
    app.upload_imgs({
      url: app.host.image + 'api/shopcenter/uploadImage?business_id=' + id + '&msg_id=' + this.data.msg_id,
      banner: banner,
      name: 'shop_img',
      success: () => {
        if (i < banner.length) {
          i++
        } else {
          wx.hideLoading()
          console.log('可以继续执行了')
          console.log(i)
          wx.showToast({
            title: '轮播图上传成功',
            duration: 700,
            mask: true,
            success: () => {
              this.shenfenz(id)
            }
          })
        }



      }
    })
  },
  // 身份证上传
  shenfenz(id) {
    wx.showLoading({
      title: '身份证上传中',
      mask: true,
    })
    let banner = this.data.identity
    let i = 1
    app.upload_imgs({
      url: app.host.image + 'api/shopcenter/uploadIdCard?business_id=' + id + '&msg_id=' + this.data.msg_id,
      banner: banner,
      name: 'id_card',
      success: () => {
        console.log('身份证上传成功')
        if (i < banner.length) {
          i++
        } else {
          console.log('可以继续执行了')
          console.log(i)
          wx.hideLoading()
          wx.showToast({
            title: '身份证上传成功',
            duration: 700,
            mask: true,
            success: () => {
              this.shop_logo_go(id)
            }
          })
        }
      }
    })
  },


  // 店铺缩略图上传
  shop_logo_go(id) {

    wx.showLoading({
      title: '缩略图上传中',
      mask: true,
    })

    let banner = this.data.asrc
    let i = 1
    app.upload_imgs({
      url: app.host.image + 'api/shopcenter/uploadImage?business_id=' + id + '&msg_id=' + this.data.msg_id,
      banner: banner,
      name: 'shop_logo',
      success: () => {
        console.log('logo上传成功')
        if (i < banner.length) {
          i++
        } else {
          console.log('可以继续执行了')
          console.log(i)
          wx.hideLoading()
          wx.showToast({
            title: '店铺缩略图上传成功',
            duration: 700,
            mask: true,
            success: () => {
              this.yinyezhizhao(id)
            }
          })
        }
      }
    })

  },


  // 营业执照上传
  yinyezhizhao(id) {

    wx.showLoading({
      title: '营业执照上传中',
      mask: true,
    })
    let banner = this.data.src
    let i = 1
    app.upload_imgs({
      url: app.host.image + 'api/shopcenter/uploadIdCard?business_id=' + id + '&msg_id=' + this.data.msg_id,
      banner: banner,
      name: 'business_license',
      success: () => {
        console.log('营业上传成功')
        if (i < banner.length) {
          i++
        } else {
          console.log('可以继续执行了')
          console.log(i)
          wx.hideLoading()
          wx.showToast({
            title: '营业执照上传成功',
            duration: 1000,
            mask: true,
            success: () => {
								wx.switchTab({
									url: '/pages/personal/person/person'
									})
									app.showtost('您的申请资料已上传到审核队列中')
            }
          })
        }
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