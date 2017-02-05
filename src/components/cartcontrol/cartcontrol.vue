<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)"></div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
	</div>
</template>

<script>
	import Vue from 'vue';
	export default{
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart(event) {
				if (!event._constructed) {
					return;
				}
				if (!this.food.count) {
					Vue.set(this.food, 'count', 1);
				} else {
					this.food.count++;
				}
				this.$emit('cart-add', event.target);
			},
			decreaseCart(event) {
				if (!event._constructed) {
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>	

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.cartcontrol
		font-size: 0
		overflow:hidden
		.cart-add,.cart-decrease
			display:inline-block
			padding:6px
			line-height: 24px
			font-size:24px 
			color:rgb(0,160,220)
		.cart-count
			display:inline-block
			vertical-align:top
			width:12px
			padding-top:6px;
			line-height:24px;
			text-align:center
			font-size:10px
			color:rgb(143,153,159)
		.cart-add
			color:rgb(0,160,220)
		.cart-decrease
			webkit-backface-visibility:hidden;
	.move-enter,.move-leave-active
		opacity: 0
		transform:translate3d(24px,0,0) rotate(180deg)
	.move-enter-active,.move-leave-active
		transition:all 0.4s linear
	
</style>