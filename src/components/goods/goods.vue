<template>
	<div class="goods-wrapper">
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
				<ul>
					<li class="menu-item" v-for="(item,index) in goods"  :class="{'current':currentIndex===index}" @click='selectMenu(index,$event)'>
						<span class="text border-1px"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper"  ref="foodsWrapper">
				<ul>
					<li class="food-list food-list-hook" v-for="item in goods">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item border-1px">
								<div class="icon">
									<img height="57" width="57" :src="food.icon" alt="">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc">{{food.description}}</p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}份</span>
										<span>好评率{{food.rating}}%</span>
									</div>
									<div class="price">
										<span class="now">￥{{food.price}}</span>
										<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
									</div>
									<div class="cartcontrol-wrapper">
										<cartcontrol v-on:cart-add="_drop" :food="food"></cartcontrol>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<food ref="food" v-on:cart-add="_drop" :food="selectedFood"></food>
	</div>
</template>	

<script>
	import BScroll from 'better-scroll';
	import shopcart from 'components/shopcart/shopcart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import food from 'components/food/food';

	const ERR_OK = 0;

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				selectedFood: {}
			};
		},
		computed: {
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count > 0) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				}
			});
		},
		methods: {
			selectMenu(index, event) {
				if (!event._constructed) {
					return;
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el, 150);
			},
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					click: true,
					probeType: 3
				});
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			_calculateHeight() {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			_drop(target) {
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);
				});
			},
			selectFood(food, event) {
				if (!event._constructed) {
					return;
				}
				this.selectedFood = food;
				this.$refs.food.show();
			},
			hideFood() {
				this.$refs.food.hide();
			}
		},
		components: {
			shopcart,
			cartcontrol,
			food
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../common/stylus/mixin.styl'
	.goods-wrapper
		position: absolute;
		top:174px
		left:0
		bottom:0;
		padding-bottom:46px;
	.goods
		display:flex
		width:100%
		height:100%
		overflow:hidden
		.menu-wrapper
			width:80px
			background-color:#f3f5f7
			// overflow:hidden
			// &::-webkit-scrollbar
			// 	display:none
			.menu-item
				display:table
				width:56px
				height:54px
				line-height: 14px
				padding: 0 12px;
				&.current
					background-color:#fff
					font-weight: 700
					z-index: 10
					position:relative
					margin-top:-1px
					.text
						border-none()
				.icon
					display:inline-block
					vertical-align:top
					width:12px
					height:12px
					margin-right:2px
					background-size:12px 12px
					background-repeat:no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display:table-cell
					width:56px
					margin:0 auto
					vertical-align:middle
					font-size: 12px
					border-1px(rgba(1, 17, 27, 0.1))
		.foods-wrapper
			flex:1
			// overflow:hidden
			// &::-webkit-scrollbar
			// 	display:none
			.title
				padding-left:14px
				height:26px
				line-height: 26px
				border-left:2px solid #d9dde1
				font-size:12px
				color: rgb(147,152,159)
				background-color:#f3f5f7
			.food-item
				display:flex
				margin:18px
				padding-bottom:18px
				border-1px(rgba(7,17,  27, .1))
				&:last-child
					border-none()
					margin-bottom:0
				.icon
					flex:0 0 57px
					margin-right:10px
				.content
					flex:1
					.name
						margin:2px 0 8px 0
						height:14px
						line-height:14px
						font-size:14px
						color:rgb(7,17,27)
					.desc
						margin-bottom:8px
						font-size:10px
						line-height:12px
					.desc,.extra
						color:rgb(147,152,159)
					.extra
						line-height:10px
						font-size:0
						span
							font-size:10px
						.count
							margin-right:12px
					.price
						font-size:0
						line-height:24px
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
						right:0
						bottom:12px
</style>