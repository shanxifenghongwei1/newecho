// pages/recharge/recharge.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        id: '9',
        value: '微信支付',
        checked: 'true'
      },
      {
        id: '6',
        value: '余额支付'
      },
      {
        id: '3',
        value: '买单币支付'
      }
    ],
    hidden: true,
    money: '',
    pay_mode: 9,
    background: 0
  },
  //点击选择银行卡

  checked_bank(e) {
    this.setData({
      background: e.currentTarget.dataset.id,
      bank_id: e.currentTarget.dataset.bank_id
    })

  },
  // 选择支付
  radioChange(e) {
    this.setData({
      pay_mode: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
		if(options.payforid == 6){
			this.setData({
				items: [{
					id: '9',
					value: '微信支付',
					checked: 'true'
				},
				{
					id: '6',
					value: '余额支付'
				}
				],
			})
		}
		// 获取用户手机号
    wx.login({
      success: (res) => {
        var code = res.code;
        this.setData({
          code: code,
        })
      }
    });
    let a = wx.getStorageSync('iphone')

    if (a == 1) {
      this.setData({
        hidden: false
      })
    }
    app.setNavigationBarTitle("充值消费");
    this.setData({
      conten: options.conten,
      payforid: options.payforid,
      shop_id: options.shop_id,
      ac_id: options.ac_id,
      zongyue: options.zongyue,
      business_id: options.business_id,
			opmymoney:options.money
    });
    this.mybanklist();
  },

  moneyinthis(e) {
		e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
		e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
		if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
			e.detail.value = parseFloat(e.detail.value);
		} else if (e.detail.value.indexOf(".") == 0) {
			e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
			e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
		}


      this.setData({
        usermoney: e.detail.value,
        money: Number(e.detail.value) * 6 / 100 + '元',
        mones: Number(e.detail.value) * 2 / 100 + '元',
      })
 
  },
  //我的银行卡
  mybanklist() {
    app.request.post({
      url: "cash/bankList",
      success: (e) => {
        if (this.data.payforid == 4 || this.data.payforid == 7) {
          if (e.list.length == 0) {
            wx.redirectTo({
              url: "/pages/personal/bandcard/addbandcard/addbandcard",
              success: function() {
                setTimeout(() => {
                  wx.showToast({
                    title: '请您先绑定银行卡再提现',
                    icon: 'none',
                    duration: 3000,
                    mask: true,
                  })
                }, 500)
              }
            })
          } else {
            this.setData({
              bank_list: e.list,
              bank_id: e.list[0].id
            })
          }
        }

      }
    })
  },

  // 支付充值
  zhifcz() {
		
		if (this.data.usermoney < 1){
		app.showtost('最少输入一元哦')
		}else if (!this.data.usermoney) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
    } else {
  wx.showLoading({
		title: '正在提交..',
		mask:true
	})
      app.request.post({
        url: "pay/Wx_Shop_pay",
        // isLoading: true,
        data: {
          order_number: 1, //"订单数量",
          order_money: this.data.usermoney, //"支付的金额",
          ac_id: this.data.ac_id, //"优惠券Id",
          order_type: 1,
          shop_id: Number(this.data.shop_id),
          pay_mode: this.data.pay_mode,
        },
        success: (e) => {
          if (e.state !== 1) {
            let t = '失败'
            let c = e.msg
            app.showmodal(t, c);
            return false;
          }
          if (e.pay_mode == 9) {
            wx.requestPayment({
              timeStamp: e.timeStamp,
              nonceStr: e.nonceStr,
              package: e.package,
              signType: e.signType,
              paySign: e.paySign,
              success: (res) => {
								wx.hideLoading()
                app.request.post({
                  url: "pay/editOrderStatus",
                  // isLoading: true,
                  data: {
                    order_id: e.order_id, //"订单Id"
                  },
                  success: (e) => {
								
                    wx.switchTab({
                      url: '/pages/personal/order/order',
                    })
										app.status.pay_order = 1
									
										setTimeout(() => {
											wx.showToast({
												title: '支付成功',
												mask: true,
												icon: 'success',
												duration: 2000,
											})
										}, 1000)
                  }
                })
              },
              fail: () => {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
              }
            })
          } else {
            app.request.post({
              url: "pay/editOrderStatus",
              // isLoading: true,
              data: {
                order_id: e.order_id, //"订单Id",
                pay_mode: e.pay_mode
              },
              success: (e) => {
								wx.hideLoading()
                wx.switchTab({
                  url: '/pages/personal/order/order',
                })

								setTimeout(() => {
									wx.showToast({
										title: '支付成功',
										mask: true,
										icon: 'success',
										duration: 2000,
									})
								}, 1000)
              }
            })
          }
        }
      })
    }
  },
  // 排队返现充值
  paiduicz() {
		if (this.data.usermoney < 1) {
			app.showtost('最少输入一元哦')
		}else if (!this.data.usermoney) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
    } else {
     wx.showLoading({
			 title: '正在提交..',
			 mask:true
		 })
      app.request.post({
        url: "pay/Wx_Shop_pay",
        // isLoading: true,
        data: {
          order_number: 1, //"订单数量",
          order_money: this.data.usermoney, //"支付的金额",
          return_id: this.data.ac_id, //"排队返现Id",
          order_type: 1,
          shop_id: Number(this.data.shop_id),
          pay_mode: this.data.pay_mode,
        },
        success: (e) => {
          if (e.state !== 1) {
						wx.hideLoading()
            let t = '失败'
            let c = e.msg
            app.showmodal(t, c);
            return false;
          }
          if (e.pay_mode == 9) {
            wx.requestPayment({
              timeStamp: e.timeStamp,
              nonceStr: e.nonceStr,
              package: e.package,
              signType: e.signType,
              paySign: e.paySign,
              success: (res) => {
                app.request.post({
                  url: "pay/editOrderStatus",
                  // isLoading: true,
                  data: {
                    order_id: e.order_id, //"订单Id"
                  },
                  success: (e) => {
										wx.hideLoading()
                    wx.switchTab({
                      url: '/pages/personal/order/order'
                    })
										setTimeout(() => {
											wx.showToast({
												title: '支付成功',
												mask: true,
												icon: 'success',
												duration: 2000,
											})
										}, 1000)
                  }
                })
              },
              fail: () => {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
              }
            })
          } else {
            app.request.post({
              url: "pay/editOrderStatus",
              // isLoading: true,
              data: {
                order_id: e.order_id, //"订单Id",
                pay_mode: e.pay_mode
              },
              success: (e) => {
								wx.hideLoading()
								app.status.pay_order = 1
                wx.switchTab({
                  url: '/pages/personal/order/order',
                })
							
								setTimeout(() => {
									wx.showToast({
										title: '支付成功',
										mask: true,
										icon: 'success',
										duration: 2000,
									})
								}, 1000)
              }
            })
          }

        }
      })

    }
  },
  // 买单币充值
  mdbcz() {
		if (this.data.usermoney < 1) {
			app.showtost('最少输入一元哦')
		} else if (!this.data.usermoney) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
    } 	else {
wx.showLoading({
	title: '正在提交',
	mask:true
})


      wx.showModal({
        title: '提醒',
        content: '请您选择支付方式',
        showCancel: true,
        cancelText: '微信支付',
        confirmText: '余额支付',
        success: (res) => {
          if (res.cancel == true) {

            app.request.post({
              url: "pay/pay_bill_recharge",
              data: {
                shop_id: this.data.shop_id,
                money: this.data.usermoney,
                pay_mode: 9
              },
              success: (e) => {

                wx.requestPayment({
                  timeStamp: e.timeStamp,
                  nonceStr: e.nonceStr,
                  package: e.package,
                  signType: e.signType,
                  paySign: e.paySign,
                  success: (wer) => {
										
                    app.request.post({
                      url: "pay/edit_pay_bill",
                      data: {
                        type: e.type,
                        desc_sn: e.desc_sn
                      },
                      success: (e) => {
												wx.hideLoading()
                        wx.navigateBack({
                          url: '?shop_id=' + this.data.shop_id,
                        })
												
												setTimeout(() => {
													wx.showToast({
														title: '充值成功',
														mask: true,
														icon: 'success',
														duration: 2000,
													})
												}, 1000)
                      }
                    })
                  },
                  fail: (sb) => {
                    wx.showToast({
                      title: '充值失败',
                      icon: 'none'
                    })
                  }
                })
              }
            })
          } else if (res.confirm == true) {
            app.request.post({
              url: "pay/pay_bill_recharge",
              data: {
                shop_id: this.data.shop_id,
                money: this.data.usermoney,
                pay_mode: 6
              },
              success: (e) => {
								
									if(e.state==2){
										wx.hideLoading()
										app.showtost(e.msg)
									}else if(e.state==1){
                app.request.post({
                  url: "pay/edit_pay_bill",
                  // isLoading: true,
                  data: {
                    desc_sn: e.desc_sn, //"订单Id",
                    pay_mode: 6
                  },
                  success: (e) => {
										wx.hideLoading()
                    wx.switchTab({
                      url: '/pages/personal/person/person'
                    })
										setTimeout(() => {
											app.showtost(e.msg)
										}, 1000)
                  }
                })

									}
              }
            })

          }
        }
      })


    }
  },
  // yecz
  xjcz(pop) {
		if (this.data.usermoney < 1) {
			app.showtost('最少输入一元哦')
		} else if (!this.data.usermoney) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
      app.request.post({
        url: "activity/re_money",
        data: {
          money: this.data.usermoney
        },
        success: (e) => {
          wx.requestPayment({
            timeStamp: e.timeStamp,
            nonceStr: e.nonceStr,
            package: e.package,
            signType: e.signType,
            paySign: e.paySign,
            success: (res) => {
              app.request.post({
                url: "activity/valire_money",
                data: {
                  desc_sn: e.desc_sn,
									formid: pop.detail.formId
                },
                success: (e) => {
									wx.hideLoading()
                  wx.switchTab({
                    url: '/pages/personal/person/person'
                  })
									setTimeout(() => {
										wx.showToast({
											title: '充值成功',
											mask: true,
											icon: 'success',
											duration: 2000,
										})
									}, 1000)
                }
              })
            },
            fail: (sb) => {
              app.request.post({
                url: "activity/valire_money",
                data: {
                  type: e.type,
                  desc_sn: e.desc_sn,
                  pay_state: 2
                },
                success: (sbyh) => {
                  wx.showToast({
                    title: '充值失败',
                    icon: 'none'
                  })
                }
              })
            }

          })
        }
      })
    }
  },
  // yetx
  xjtx() {

		if (this.data.usermoney < 1) {
		app.showtost('最少输入一元哦')
		} else if (!this.data.usermoney) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
    } else if (Number(this.data.usermoney) > Number(this.data.zongyue)) {
      wx.showToast({
        title: '您没有这么多钱',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    } else {

      app.request.post({
        url: "cash/cash",
        data: {
          cash_money: this.data.usermoney,
          bank_id: this.data.bank_id,
          business_id: this.data.business_id
        },
        success: (e) => {
   
          if (e.state == 1) {
            wx.switchTab({
              url: '/pages/personal/person/person'
            })
						setTimeout(() => {
							wx.showToast({
								title: '申请成功',
								mask:true,
								duration: 2000
							})
						}, 1000)
          } else {
            setTimeout(() => {
              wx.showToast({
                title: e.msg,
                icon: 'none',
                duration: 2000
              })
            }, 1000)

          }

        },
        fail: (sb) => {

        }
      })
    }
  },
  // hdcz
  hdcz() {
		if (this.data.usermoney < 1) {
			app.showtost('最少输入一元哦')
		} else if (!this.data.usermoney) {
      wx.showToast({
        title: '请输入金额',
				icon:'none'
      })
		} else if (this.data.opmymoney - this.data.usermoney > 0 ) {
			wx.showToast({
				title: '不满足活动条件',
				icon: 'none'
			})
		} else {


      wx.showModal({
        title: '提醒',
        content: '请您选择支付方式',
        showCancel: true,
        cancelText: '微信支付',
        confirmText: '余额支付',
        success: (res) => {
					wx.showLoading({
						title: '正在提交..',
						mask:true
					})
          if (res.cancel == true) {
            app.request.post({
              url: "pay/pay_bill_recharge",
              data: {
                ac_id: this.data.ac_id,
                shop_id: this.data.shop_id,
                money: this.data.usermoney,
                pay_mode: 9
              },
              success: (e) => {
                wx.requestPayment({
                  timeStamp: e.timeStamp,
                  nonceStr: e.nonceStr,
                  package: e.package,
                  signType: e.signType,
                  paySign: e.paySign,
                  success: (res) => {

                    app.request.post({
                      url: "pay/edit_pay_bill",
                      data: {
                        pay_mode: e.pay_mode,
                        desc_sn: e.desc_sn,
                      },
                      success: (e) => {
												wx.hideLoading()
                        // console.log(e)
                        if (e.state == 1) {
                          wx.navigateBack({
                            url: 'shop_id=' + this.data.shop_id
                          })
													setTimeout(()=>{
														wx.showToast({
															title: e.msg,
															duration: 2000,
															icon: 'none'
														})
													},1000)

                        } else {
                          wx.showToast({
                            title: e.msg,
                            duration: 2000,
                            icon: 'none'
                          })
                        }
                      }
                    })
                  },
                  fail: (sb) => {
                    wx.showToast({
                      title: '充值失败',
                      icon: 'none'
                    })
                  }
                })
              }
            })
          } else if (res.confirm == true) {
            app.request.post({
              url: "pay/pay_bill_recharge",
              data: {
                ac_id: this.data.ac_id,
                shop_id: this.data.shop_id,
                money: this.data.usermoney,
                pay_mode: 6
              },
              success: (e) => {
                if (e.state == 1) {
                  app.request.post({
                    url: "pay/edit_pay_bill",
                    data: {
                      pay_mode: e.pay_mode,
                      desc_sn: e.desc_sn,
                    },
                    success: (e) => {
											wx.hideLoading()
                      // console.log(e)
                      if (e.state == 1) {
                        wx.navigateBack({
                          url: 'shop_id=' + this.data.shop_id
                        })
												setTimeout(() => {
													wx.showToast({
														title: e.msg,
														duration: 2000,
														icon: 'none'
													})
												}, 1000)
                      } else {
                        wx.showToast({
                          title: e.msg,
                          duration: 2000,
                          icon: 'none'
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: e.msg,
                    duration: 2000,
                    icon: 'none'
                  })
                }

              }
            })
          }
        }
      })

    }


  },
  // 获取用户手机号
  getPhoneNumber: function(e) {
    var that = this
    if (this.data.code.length < 0) {
      wx.login({
        success: function(res) {
          var code = res.code;
          that.setData({
            code: code,
          })
        }
      });
    } else {
      if (e.detail.encryptedData.length > 0) {
        var that = this;
				wx.showLoading({
					title: '正在提交',
				})
        //发起请求解密手机号
        app.request.post({
          url: "user/getiphone",
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: this.data.code,
          },
          success: (as) => {
						wx.hideLoading();
 
            if (as.msg !== 1) {
              wx.showModal({
                title: '获取失败',
                content: '您的状态已过期了哟请重新授权',
              })
              wx.login({
                success: function(res) {
                  var code = res.code;
                  that.setData({
                    code: code,
                  })
                }
              });
            } else {
							wx.hideLoading()
              wx.showModal({
                title: '成功',
                content: '拿抓将为您提供更多优质服务!',
              })
              wx.setStorageSync('iphone', as.phone_type)
              that.setData({
                hidden: false,
              })
            }
          }
        })
      }
    }
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