<template>
	<transition name="move">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image" alt="">
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>	
				<div class="content">
					<div class="title">{{food.name}}</div>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span>
						<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol v-on:cart-add="_drop" :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
					</transition>
				</div>
				<split  v-if="food.info"></split>	
				<div class="info" v-if="food.info">
					<h1 class="title">商品介绍</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="food.ratings" :desc="desc" @on-type-change="onTypeChange" @on-only-content-change="onOnlyContentChange"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px" >
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar" width="12" height="12" alt="">
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
	
</template>		
	
<script>
	import BScroll from 'better-scroll';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import Vue from 'vue';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	import {formatDate} from '../../common/js/date';

	// const POSITIVE = 0;
	// const NEGATIVE = 1;
	const ALL = 2;

	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: false,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		methods: {
			onTypeChange(val) {
				this.selectType = val;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			onOnlyContentChange(type) {
				this.onlyContent = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			show() {
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = false;
				// 模拟后退事件
				let food = this;
				window.history.pushState({}, '', 'food');
				window.onpopstate = function(e) {
					food.hide();
				};
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			},
			hide() {
				this.showFlag = false;
			},
			addFirst(event) {
				if (!event._constructed) {
					return;
				}
				this.$emit('cart-add', event.target);
				Vue.set(this.food, 'count', 1);
			},
			_drop(target) {
				this.$emit('cart-add', target);
			},
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},
		components: {
			cartcontrol,
			split,
			ratingselect
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus"  scoped>
	@import '../../common/stylus/mixin.styl'
	@import '../../common/stylus/base.styl'
	.food
		position: fixed;
		top:0
		left:0
		bottom:48px
		z-index:30
		width:100%
		background-color:#fff
		.image-header
			position:relative
			width:100%
			height:0
			padding-bottom:100%
			img
				position: absolute;
				top:0
				left:0
				width:100%
				height:100%
			.back
				position: absolute;
				top:10px
				left:0
				.icon-arrow_lift
					display:block
					padding:10px
					font-size: 20px
					color:#fff
		.content
			padding:18px
			position: relative;
			.title
				line-height: 14px
				margin-bottom:8px
				font-size:14px	
				font-weight: 700
				color:rgb(7,17,27)
			.detail
				margin-bottom:18px
				line-height:10px
				font-size:0
				height:10px
				.sell-count,.rating
					font-size:10px
					color:rgb(143,153,159)
				.sell-count
					margin-right:12px
			.price
				line-height:24px
				font-size:0
				.now
					font-weight: 700
					margin-right:8px
					color:rgb(240,20,20)
					font-size:14px
				.old
					font-weight: 700
					text-decoration:line-through
					color:rgb(147,152,159)
					font-size:10px
			.cartcontrol-wrapper
				position: absolute;
				right:12px
				bottom:12px
			.buy
				position: absolute;
				right:18px
				bottom:18px
				z-index:10
				height:24px
				line-height:24px
				padding:0 12px
				box-sizing: border-box
				font-size:10px
				border-radius:12px
				color:#fff
				background-color:rgb(0,160,220)
		.info
			padding: 18px
			.title
				line-height:14px
				margin-bottom:6px
				font-size:14px
				color:rgb(7,17,27)
			.text
				line-height:24px
				font-size:12px
				padding:0 8px
				color:rgb(77,85,93)
		.rating
			padding-top:18px
			.title
				line-height:14px
				margin-left:18px
				font-size:14px
				color:rgb(7,17,27)
			.rating-wrapper
				padding:0 18px
				.rating-item
					position:relative;
					padding:16px 0
					border-1px(rgba(7,17,27,.1))
					.user
						position: absolute;
						right:0
						top:16px
						font-size:0
						line-height:12px
						.name
							display:inline-block
							margin-right:6px
							vertical-align:top
							font-size:10px
							color:rgb(147,153,159)
						.avatar
							border-radius:50%
					.time
						margin-bottom:6px
						line-height:12px
						font-size:10px
						color:rgb(147,153,159)
					.text
						line-height:16px
						font-size:12
						color:rgb(7,17,27)
						.icon-thumb_up,icon-thumb_down
							margin-right:4px
							line-height:16px
							font-size:12px
						.icon-thumb_up
							color:rgb(0,160,220)
						.icon-thumb_down
							color:rgb(147,153,159)
				.no-rating
					padding:16px 0
					font-size:12px
					color:rgb(147,153,159)
	.move-enter-active,.move-leave-active
		transition:all .4s linear
	.move-enter,.move-leave-active
		transform: translate3d(100%,0,0);
		opacity: 0
	.fade-enter-active,.fade-leave-active
		transition:all .4s linear
	.fade-enter,.fade-leave-active
		width:10px
		opacity: 0
</style>