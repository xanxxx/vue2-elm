<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-wrapper">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>	
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>	
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"  @on-type-change="onTypeChange" @on-only-content-change="onOnlyContentChange"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item boder-1px">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28" alt="">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend" class="item">{{item}}</span>
							</div>
							<div class="time">
								{{rating.rateTime |　formatDate}}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>	

<script>
	import star from 'components/star/star';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	import {formatDate} from '../../common/js/date';
	import BScroll from 'better-scroll';

	const ALL = 2;
	const ERR_OK = 0;

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: false
			};
		},
		created() {
			this.$http.get('/api/ratings').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.ratings = response.data;
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.ratings, {
								click: true
							});
						} else {
							this.scroll.refresh();
						}
					});
				}
			});
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
			star,
			split,
			ratingselect
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../common/stylus/mixin.styl'
	@import '../../common/stylus/base.styl'
	.ratings
		position: absolute;
		top:174px
		bottom:0
		left:0
		width:100%
		overflow:hidden
		.overview
			padding:18px 0
			display:flex
			.overview-left
				padding:6px 0
				flex:0 0 137px
				width:137px
				border-right:1px solid rgba(7,17,27,.1)
				text-align:center
				@media only screen and (max-width: 320px)
					flex:0 0 120px
					width:120px
				.score
					line-height: 28px
					font-size: 24px
					color:rgb(255,153,0)
					margin-bottom:6px
				.title
					margin-bottom:8px
					line-height:12px
					font-size:12px
					color:rgb(7,17,27)
				.rank
					line-height:10px
					font-size:10px
					color:rgb(147,153,159)
			.overview-right
				flex:1
				padding-left:24px
				@media only screen and (max-width: 320px)
					padding-left:6px
				.score-wrapper
					margin-bottom:8px
					font-size:0
					.title
						display:inline-block
						line-height :18px
						vertical-align:top
						font-size:12px
						color:rgb(7,17,27)
					.star
						display:inline-block
						vertical-align:top
						margin:0 12px
					.score
						display:inline-block
						vertical-align:top
						font-size:12px
						color:rgb(255,153,0)
						line-height:18px
				.delivery-wrapper
					font-size:0
					.title
						line-height :18px
						font-size:12px
						color:rgb(7,17,27)
					.delivery
						margin-left:12px
						font-size:12px
						color:rgb(147,153,159)
		.rating-wrapper
			padding:0 18px
			.rating-item
				display: flex
				padding:18px 0
				border-1px(rgba(7, 17, 27, .1))
				.avatar
					flex:0 0 28px
					width:28px
					margin-right:12px
					img
						border-radius:50%
				.content
					position: relative;
					flex:1
					.name
						margin-bottom:4px
						line-height:12px
						font-size:10px
						color:rgb(7,17,27)
					.star-wrapper
						margin-bottom:6px
						font-size:0
						.star
							display:inline-block
							margin-right:6px
							vertical-align:top
						.delivery
							display:inline-block
							vertical-align:top
							line-height:12px
							font-size:10px
							color:rgb(147,153,159)
					.text
						line-height:18px
						color:rgb(7,17,27)
						font-size:12px
						margin-bottom:8px
					.recommend
						font-size:0
						line-height:16px
						.icon-thumb_up,.item
							display:inline-block
							margin:0 8px 4px 0
							font-size:9px
						.icon-thumb_up
							color:rgb(0,160,220)
						.item
							padding:0 6px
							border:1px solid rgba(7, 17, 27, .1)
							border-radius:1px
							color:rgb(147,153,159)
							background-color:#fff
					.time
						position: absolute;
						top:0
						right:0
						line-height:12px
						font-size:10px
						color:rgb(147,153,159)

							
						
</style>