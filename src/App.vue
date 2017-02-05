<template>
  <div id="app">
    <v-header :seller='seller'></v-header>  
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="{ name: 'goods', params: { pageId: 1 }}" replace>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{ name: 'ratings', params: { pageId: 2 }}" replace>评价</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{ name: 'seller', params: { pageId: 3 }}" replace>商家</router-link>
      </div>
    </div>
    <transition :name='transitionName' mode="out-in">
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive> 
    </transition>  
  </div>
</template>

<script>
  import header from './components/header/header';
  // import goods from './components/goods/goods';
  import {urlParse} from './common/js/util';
  const ERR_OK = 0;

  export default{
    data() {
      return {
        transitionName: 'slide-left',
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      this.$http.get('/api/seller').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data);
        }
      }, (response) => {
        console.log(1);
      });
    },
    components: {
      'v-header': header
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.params.pageId;
        const fromDepth = from.params.pageId || 1;
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
  #app
    .tab
      display:flex
      width:100%
      height:40px
      line-height: 40px
      // border-bottom:1px solid rgba(7,17,27,0.1)
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex:1
        text-align:center
        & > a
          display:block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:rgb(240,20,20)
  
  .slide-left-enter-active,.slide-left-leave-active{
    transition: all .2s ease;
  }
  .slide-left-enter {
    transform: translate3d(100px,0,0);
    opacity: 0;
  }
  .slide-left-leave-active {
    transform: translate3d(-100px,0,0);
    opacity: 0;
  }
  
  .slide-right-enter-active,.slide-right-leave-active {
    transition: all .2s ease;
  }
  .slide-right-enter {
    transform: translate3d(-100px,0,0);
    opacity: 0;
  }
  .slide-right-leave-active {
      transform: translate3d(100px,0,0);
      opacity: 0;
    }
</style>
