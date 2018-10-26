(function (window,Vue,undefined) {
	//传入window是为了少一级作用域链,传入Vue,和undefined
	//定义一个数组
	var list = [
		{
			id:1,
			content: 'aaa',
			isfinish: true,
		},
		{
			id:2,
			content: 'aaa',
			isfinish: false,
		},
		{
			id:3,
			content: 'aaa',
			isfinish: true,
		}
	]
	new Vue ({
		el:'#app',
		data: {
			//json格式的字符串，存储在localstorage
			datalist:JSON.parse(window.localStorage.getItem('datalist')) || [],
			newTodo : '',
			//用来保存没有修改之前的li的内容
			beforeUpdata : {},
			activeBtn : 1,
			showArr : []
		},
		methods : {
			//设置添加的事件
			addTodo : function() {
				//判断输入的内容是否为空
				if(!this.newTodo.trim()) {
					return 
				}
				this.datalist.push({
					content : this.newTodo.trim(),
					isfinish : false,
					//设置id的排序,传入的数组有没有长度，如果有排序，去到它的id,如果没有设置他的id值为1.
					id : this.datalist.length ? this.datalist.sort((a,b) => a.id - b.id)[this.datalist.length-1]['id'] + 1 : 1	
				})
				this.newTodo = ''
			},
			//删除事件
			delTodo : function(index) {
				//数组中删除一个元素
				this.datalist.splice(index,1)
			},
			//删除全部的isfinish为true的选项
			delAll : function() {
				// 拿到的是所有的数组中isfinish为flase的选项
				this.datalist = this.datalist.filter(item => !item.isfinish)
			},
			//当前li添加类名 显示编辑的文本框
			showEdit : function(index) {
				//所有li的类名清空
				this.$refs.show.forEach(item => {
					item.classList.remove('editing')
				})
				//当前li的类名显示
				this.$refs.show[index].classList.add('editing')
				//将没有修改的数据保存到定义的对象中
				this.beforeUpdata = this.datalist[index]
				//列表式数据 深拷贝 没有函数的时候将数据变成字符串,在转换成数组
				this.beforeUpdata = JSON.parse(JSON.stringify(this.datalist[index]))
			},
			updataTodo : function(index) {
				if(!this.datalist[index].content.trim()) return this.datalist.splice(index,1)
				//修改了以后设置修改完的li的isfinish属性为false，未完成的。
				if(this.datalist[index].content !== this.beforeUpdata.content) this.datalist[index].isfinish = false
				//让框不显示 删除类名的操作
				this.$refs.show[index].classList.remove('editing')
				//优化操作
				this.updataTodo = {}
			},
			backTodo : function(index) {
				this.datalist[index].content = this.beforeUpdata.content
				//让框不显示 删除类名的操作
				this.$refs.show[index].classList.remove('editing')
			},
			//哈希事件
			hashChange : function() {
				switch(window.location.hash){
					case '':
					case '#/':
						this.activeBtn = 1
						this.showAll()
						break
					case '#/active':
						this.activeBtn = 2
						this.activeAll(false)
						break
					case '#/completed':
						this.activeBtn = 3
						this.activeAll(true)
						break
				}
			},
			showAll : function() {
				this.showArr = this.datalist.map(() => true)
			},
			activeAll(boo) {
				this.showArr = this.datalist.map(item => item.isfinish === boo)
				if(this.datalistvery(item => item.isfinish === !boo)) {
					window.location.hash ='#/'
				}
			}
		},
		watch : {
			datalist : {
				handler(newArr){
					window.localStorage.setItem('datalist',JSON.stringify(newArr))
					//重新判断 跳转页面
					this.hashChange()
				},
				//深度监听，就可以将数据存入localstorage
				deep: true
			}
		},
		//计算属性
		computed : {
			activeNum () {
				//所有的选中的为false的选项的数量
				return this.datalist.filter(item => !item.isfinish).length
			},
			toggleAll : {
				get() {
					//判断是不是每一个都是true
				return this.datalist.every(item => item.isfinish)	
				},
				set(val) {
					//设置每一个选项和上面选项框的同步,只是上面的选项框控制
					this.datalist.forEach(item => item.isfinish = val)
				}
			}
		},
		//自定义指令
		//自动获取光标。
		directives: {
			focus : {
				inserted(el) {
				el.focus()	
				}
			}
		},
		//生命周期，页面刚打开的时候执行
		created() {
			this.hashChange() 
			window.onhashchange = () => {
				this.hashChange()
			}
		}
	})


})(window,Vue);
