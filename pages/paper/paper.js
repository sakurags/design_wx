const qiniuUploader = require("../../utils/qiniuUploader");


// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'SCN', // 华南区
    uptokenURL: 'http://localhost:8090/plugin/qiniu/uptoken',
    // uptoken: 'xxx',
    domain: 'pm38954kj.bkt.clouddn.com',
    shouldUseQiniuFileName: true
  };
  qiniuUploader.init(options);
}

const app = getApp()

Page({
  data: {
    uid:'',
    paperid: '',
    imageObject: {},
    array: '[{"name": "试卷", "tname": "张si" }]',
    qid:'',
    img:'',
    que:{},
    ques:{},
    tfque:{},
    fque:{},
    saque:{},
    aque:{}
  },
  onLoad: function (options) {
    this.setData({
      paperid: options.paperid,
      uid: options.userid
    })
    var that = this;
    wx.request({
      url: 'http://localhost:8090/pdet/getpaperdetaile', // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        paperid: that.data.paperid
      },
      success(res) {
        console.log(res.data);
        that.setData({
          array: res.data
        })
      }
    })
    

  },

  gopaper: function (e) {
    var bean = e.currentTarget.dataset;

  },

  didPressChooesImage: function (e) {
    var id=e.currentTarget.id;
    this.setData({
      'qid': id
    });
console.log(this.data.qid)
    var that = this;
    didPressChooesImage(that,id);
  },
  didCancelTask: function () {
    this.data.cancelTask()
  },
  formSubmit(e){
    var that = this;
    wx.request({
      url: 'http://localhost:8090/stupaper/add', // 仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        uid:that.data.uid,
        paperid:that.data.paperid,
        que: that.data.que,
        ques: that.data.ques, 
        tfque: that.data.tfque,
        fque:that.data.fque,
        saque: that.data.saque,
        aque: that.data.aque
      },
      success(res) {
        console.log(res.data);
        that.setData({
          array: res.data
        })
      }
    })
 
  },



  radiochange(e){
    var id = e.currentTarget.id;
    var value = e.detail.value;
    
    this.setData({
      ['que.'+id]:value
    });

  },

  boxchange(e) {
    var id = e.currentTarget.id;
    var value = e.detail.value;
    this.setData({
      ['ques.' + id]:value
    });
   console.log(value);
  },

  tfchange(e) {
    var id = e.currentTarget.id;
    var value = e.detail.value;
    this.setData({
      ['tfque.' + id]: value
    });
   
  },

  fchange(e) {
    var id = e.currentTarget.id;
    var value = e.detail.value;
    this.setData({
      ['fque.' + id]:value
    });
  },


 sachange(e) {
    var id = e.currentTarget.id;
    var value = e.detail.value;
    this.setData({
      ['saque.' + id]:value
    });
    console.log(this.data.saque);
  },



});

function didPressChooesImage(that,id) {
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        that.setData({
          'imageObject': res
        });
       
        var value = that.data.imageObject.key
        that.setData({
          ['aque.' + id]: value
        });
    

        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        });

        
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      },
        // , {
        //     region: 'NCN', // 华北区
        //     uptokenURL: 'https://[yourserver.com]/api/uptoken',
        //     domain: 'http://[yourBucketId].bkt.clouddn.com',
        //     shouldUseQiniuFileName: false
        //     key: 'testKeyNameLSAKDKASJDHKAS'
        //     uptokenURL: 'myServer.com/api/uptoken'
        // }
        null,// 可以使用上述参数，或者使用 null 作为参数占位符
        (progress) => {
          console.log('上传进度', progress.progress)
          console.log('已经上传的数据长度', progress.totalBytesSent)
          console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
        }, cancelTask => that.setData({ cancelTask })
      );
    }
  })
}
