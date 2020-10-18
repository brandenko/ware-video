<template>
  <div>
  <!-- 搜索 -->
    <div>
      <a-input-search placeholder="输入视频hash检索"
          style="width: 50%;"
          size="large"
          class="mg20 topfix"
          enter-button @search="onSearch"/> 
    </div>
    <div class="video-tabs">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="播放最多">
            <video  controls autoplay height="400">
              <source src="http://61.155.145.10:8080/ipfs/QmRGmJgP4q4FkyZ7xiLH4UKuN4ZGF5WbYHQ4W94uXUeqfL" type="video/mp4"/>
            </video>
        </a-tab-pane>
        <a-tab-pane key="2" tab="搞笑" force-render>
          Content of Tab Pane 2
        </a-tab-pane>
        <a-tab-pane key="3" tab="电影">
          Content of Tab Pane 3
        </a-tab-pane>
      </a-tabs>
    </div>
  
   
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
  },

  methods: {
    handleAddressChange(value) {
       this.value = value
       this.getTransfers(1, 20)
    },

    getWallet: function() {
      axios.get('/wallet').then((response) => {
        this.walletAddress = response.data
      })
    },
    getTransfers: function(page, pagesize) {
      var conditions = this.buildCondition()
      var u = '/api/wallet/' + this.value + "?page=" + page + "&pageSize=" + pagesize
      if (conditions.length > 0) {
        u += conditions
      }
      axios.get(u).then((response) => {
        this.tableData = response.data.data
        this.pagination.total = response.data.total
      })
    },

    handleTableChange: function(pagination, filters, sorter, { currentDataSource }) {
      this.getTransfers(pagination.current, pagination.pageSize)
      console.log(filters)
      console.log(sorter)
      console.log(currentDataSource)
    },

    formatterTime: function(val) {
      return val ? moment(val*1000).format('YYYY-MM-DD HH:mm:ss') : ''
    },

    formatFilValue: function(val) {
      var fvalue = +(val)
      
      if (Math.abs(fvalue) > Math.pow(10, 15) ) {
        return (fvalue/Math.pow(10,18)).toFixed(5) + " FIL"
      }
      if (Math.abs(fvalue) > Math.pow(10, 6) ) {
        return (fvalue/Math.pow(10,9)).toFixed(5) + " nanoFIL"
      }
      return fvalue.toFixed(5) + " attoFIL"
    },

    buildCondition: function() {
      var qstr = ""
      if (this.search.filtertype.length > 0) {
        qstr += "&type="+this.search.filtertype
      }
      if (this.search.filteroperator.length >0) {
        qstr += "&op=" + this.search.filteroperator + "&value=" + this.search.filtervalue*this.search.filterunit
      }
      return qstr
    },
    submitFilter: function() {
      this.getTransfers(1, 20)
    },
    gotomessage: function(cid) {
       var href="http://se.sycdn.kuwo.cn/03b9c356fae87bdd305b704dec7adaa6/5f8a8b7b/resource/n2/66/97/703846473.mp3" + cid
       window.open(href,'_blank')
    },
    fix: function(str) {
      if  (str.length > 10) {
        return str.substring(0, 10)+'****'+str.substring(str.length-10,str.length)
      }
      return str
    },
    onSearch: function(value) {
      console.log(value);
    },
    tosize: function(bytes) {
      if (bytes === 0) return '0 B';
      var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    startPlay: function(record, ind) {
      record.play = false
      if (this.playStatus.isPlay) {
        this.tableData[this.playStatus.currentIndex]['play'] = true
        this.playStatus.audio.pause();
      }
      this.playStatus.isPlay = true
      this.playStatus.currentIndex = (this.playStatus.currentPage - 1) * this.pagination.pageSize + ind
      this.playSound(record.url)
    },
    stopPlay: function(record) {
      record.play = true
      this.playStatus.isPlay = false 
      this.playStatus.audio.pause();

    },
    playSound: function (sound) {
      if(sound) {
        var audio = new Audio(sound);
        this.playStatus.audio = audio
        this.playStatus.audio.play();
      }
    }
  },
  data: function() {
    return {
      walletAddress:  [],
      value: "",
      pagination: {
        total: 50,
        pageSize: 8,
        defaultCurrent: 1,
        onChange: (current) => {this.playStatus.currentPage = current}
      },
      playStatus: {
        isPlay: false,
        currentIndex: 0, // 当前数据索引
        currentPage: 1, // 当前页面索引
        audio: {},
      },
      search: {
        filtervalue: 0,
        filtertype: "",
        filterunit: 1,
        filteroperator: "",
      },
      filters: {
        typefilter: [
          {
            text: 'NONE',
            value: '',
          },
          {
            text: 'receive',
            value: 'receive',
          }, {
            text: 'send',
            value: 'send',
          }, {
            text: 'burn-fee',
            value: 'burn-fee',
          }, {
            text: 'miner-fee',
            value: 'miner-fee',
          }, {
            text: 'reward',
            value: 'reward',
          }, {
            text: 'burn',
            value: 'burn',
          }, 
        ],
        unitfilters: [
          {text: 'FIL', value: Math.pow(10,18)},
          {text: 'nanoFIL', value: Math.pow(10,9)},
          {text: 'attoFIL', value: 1},
        ],
        operatorfilters: [
          {text: 'NONE', value: ''},
          {text: '=', value: '$eq'},
          {text: '>', value: '$gt'},
          {text: '<', value: '$lt'},
        ],

      },

    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #42b983;
}

.mg20 {
  margin: 5px;
}

.video-tabs {
  margin-left: 100px;
  margin-right: 100px;
}
</style>
