<template>
	<div class="shopcart">
		<div class="content">
			<div class="content-left" @click="toggleList">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click="pay">
				<div class="pay"  :class="payClass">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball-container">
	       	<transition :css="false" v-for="ball in balls" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            	<div class="ball" v-show="ball.show">
              		<div class="inner inner-hook"></div>
            	</div>
          	</transition>
	    </div>
	    <transition name="fold">
    	    <div class="shopcart-list" v-show="listShow">
    	    	<div class="list-header">
    	    		<h1 class="title">购物车</h1>
    	    		<span class="empty" @click="empty">清空</span>
    	    	</div>
    	    	<div class="list-content" ref="listContent">
    	    		<ul>
    	    			<li class="food" v-for="food in selectFoods">
    	    				<span class="name">{{food.name}}</span>
    	    				<div class="price">
    	    					<span>￥{{food.price*food.count}}</span>
    	    				</div>
    						<div class="cartcontrol-wrapper">
    							<cartcontrol v-on:cart-add="drop"  :food="food"></cartcontrol>
    						</div>
    	    			</li>
    	    		</ul>
    	    	</div>
    	    </div>
	    </transition>
	    <transition name="fade">
	    	<div class="list-mask" @click="toggleList" v-show="listShow"></div>
	    </transition>	
	</div>
		
</template>

<script>
	import BScroll from 'better-scroll';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	export default{
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			},
			deliveryPrice: {
				type: Number
			},
			minPrice: {
				type: Number
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],
				fold: true
			};
		},
		computed: {
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差${diff}元起送`;
				} else {
					return '去结算';
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							});
						} else {
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		},
		methods: {
			drop(el) {
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeDrop(el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			dropping(el, done) {
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = `translate3d(0,0,0)`;
					inner.style.transform = `translate3d(0,0,0)`;
				});
				el.addEventListener('transitionend', done);
			},
			afterDrop(el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList() {
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			pay() {
				if (this.totalPrice < this.minPrice) {
					return;
				}
				window.alert(`支付${this.totalPrice}元`);
			}
		},
		components: {
			cartcontrol
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../common/stylus/mixin.styl'
	.shopcart
		position:fixed
		left:0
		bottom:0
		width:100%
		height:48px
		z-index:50
		.content
			display:flex
			background-color:#141d27
			font-size:0px
			color:rgba(255, 255, 255, 0.4)
			.content-left
				flex:1
				.logo-wrapper
					display:inline-block
					position:relative
					top:-10px
					box-sizing:border-box
					width:56px
					height:56px
					margin:0 12px
					padding:6px
					vertical-align:top
					background-color:#141d27
					border-radius: 50%;
					.logo
						width:100%;
						height:100%
						border-radius:50%
						background-color:rgba(255,255,255,.2)
						text-align: center
						&.highlight
							background-color:rgb(0, 160, 220)
							.icon-shopping_cart
								color:#fff;
						.icon-shopping_cart
							font-size:24px
							line-height: 44px
					.num
						position: absolute;
						top:0
						right:0
						width:24px
						height:16px
						line-height:16px
						text-align: center
						border-radius:16px
						font-size:9px
						color:#fff
						background-color:rgb(240,20,20)
						box-shadow:0px 4px 8px 0px rgba(0,0,0,.4)
				.price
					display:inline-block
					vertical-align:top
					box-sizing:border-box
					margin-top:12px
					padding-right:12px
					line-height:24px
					border-right:1px solid rgba(255, 255, 255, 0.1)
					font-size:16px
					font-weight: 700
					&.highlight
						color:#fff
				.desc
					display:inline-block
					vertical-align:top
					line-height:24px
					margin:12px 0 0 12px
					font-size: 10px
			.content-right
				flex:0 0 105px
				width:105px
				.pay
					height:48px
					line-height:48px
					text-align:center
					font-size:12px
					font-weight: 700
					&.not-enough
						background-color:#2b333b
					&.enough
						background-color:#00b43c
						color:#fff
		.ball-container
			.ball
				position: fixed;
				left:32px
				bottom:22px
				z-index:200
				transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
				.inner
					width:16px;
					height:16px;
					border-radius:50%
					background-color:rgb(0,160,220)
					transition:all 0.4s linear
		.shopcart-list
			position: absolute;
			top:0
			left:0
			z-index: -1
			width:100%
			transform:translate3d(0,-100%,0)
			&.fold-enter-active,&.fold-leave-active
				transition:all .5s
			&.fold-enter,&.fold-leave-active
				transform:translate3d(0,0,0)
			.list-header
				height:40px
				line-height:40px
				padding:0 18px
				background-color:#f3f5f7
				border-bottom:1px solid rgba(7, 17, 27, .1)
				.title
					float:left
					font-size:14px
					color:rgb(7,17,27)
				.empty
					float:right
					font-size:12px
					color:rgb(0,160,220)
			.list-content
				padding:0 18px
				max-height:217px
				background-color:#fff;
				overflow:hidden
				.food
					position: relative;
					padding: 12px 0
					box-sizing:border-box
					border-1px(rgba(7,17,27,.1))
					.name
						line-height:24px
						font-size:14px
						color:rgb(7,17,27)
					.price
						position: absolute;
						right:90px
						bottom:12px
						line-height:24px
						font-weight: 700
						font-size:14px
						color:rgb(240,20,20)
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:6px
	.list-mask
		position: fixed;
		top:0
		left:0
		width:100%
		height:100%
		z-index:-2	
		opacity: 1
		background-color:rgba(7, 17, 27, 0.6)
		backdrop-filter:blur(10px)
		&.fade-enter-active,&.fade-leave-active
			transition: all 0.5s
		&.fade-enter,&.fade-leave-active
			opacity: 0
			background-color:rgba(7, 17, 27, 0)
</style>
