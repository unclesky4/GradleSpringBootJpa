
var oneTabPanel;//tab标识
$(function() {

	/**
	 * 滚动条
	 */
	var $menuPanel = $("#oneMenuPanel");
	$menuPanel.scrollator({
		zIndex: 5,
		onMouseEnter: function() {
			$menuPanel.addClass("one-list-showIcon");
		},
		onMouseLeave: function() {
			$menuPanel.removeClass("one-list-showIcon");
		}
	});
	//----------end
	
	/**
	  * 隐藏菜单面板
	  */
	//先左边，再中间
	$("#oneLayoutWestExpand").click(function(e) {
		e.preventDefault();
		var left = parseFloat($("#oneLayoutWestExpand").css("width"));
		$("#oneLayoutWestExpand").css("left", -left);
		$("#oneLayoutWest").animate({
			left: 0
		}, 200, function() {
			var westWidth = parseFloat($("#oneLayoutWest").css("width"));
			$("#oneLayoutCenter").css("left", westWidth);
			$(window).trigger('resize');
			//$menuPanel.scrollator("refresh");
			var rightBorder = parseFloat($("#oneLayoutWest").css("border-right-width"));
			$("#oneLayoutWestResize").css("left", westWidth - rightBorder);
		});
		return false;
	});
	//先中间，再左边
	$("#oneMenuClose").click(function(e) {
		e.preventDefault();
		var left = parseFloat($("#oneLayoutWest").css("width"));
		$("#oneLayoutWest").animate({
			left: -left
		}, 200, function() {
			$("#oneLayoutWestExpand").css("left", 0);
			$(window).trigger('resize');
			//$menuPanel.scrollator("refresh");
		});
		$("#oneLayoutCenter").css("left", $("#oneLayoutWestExpand").css("width"));
		$("#oneLayoutWestResize").css("left", 0);
		return false;
	});
	//----------end
	
	/**
	 * 隐藏头部面板
	 */
	var contentExpandIcon = function(flag, elem) {
		if(flag < 0) {//被隐藏
			elem.children("span").removeClass("icon-double-angle-down")
				.addClass("icon-double-angle-up");
		} else {
			elem.children("span").removeClass("icon-double-angle-up")
				.addClass("icon-double-angle-down");
		}
	};
	var contentExpand = function(e) {
		e.preventDefault();
		var height = parseFloat($("#oneLayoutNorth").css("height"));
		var top = parseFloat($("#oneLayoutNorth").css("top"));
		contentExpandIcon(top, $("#oneNorthOpenExpand"));
		contentExpandIcon(top, $("#oneNorthCloseExpand"));
		contentExpandIcon(top, $("#oneContentExpand"));
		if(top < 0) {//被隐藏
			top = height;
			height = 0;
		}
		$("#oneLayoutNorth").css("top", - height);
		$("#oneLayoutWest").css("top", top);
		$("#oneLayoutWestExpand").css("top", top);
		$("#oneLayoutWestResize").css("top", top);
		$("#oneLayoutCenter").css("top", top);
		$(window).trigger('resize');
		return false;
	};
	$("#oneNorthOpenExpand").click(contentExpand);
	$("#oneNorthCloseExpand").click(contentExpand);
	$("#oneContentExpand").click(contentExpand);
	//----------end
	
	
	/**
	  * 拖动改变大小
	  */
	var $menuResizeElem = $("#oneLayoutWestResize");
	var targetMousedown = function(e) {
		e.preventDefault();
		$menuResizeElem.css("background", "#cccccc");
		$("body").css("cursor", "e-resize");
		$(window).on("mousemove", windowMousemove)
			.on("mouseup", windowMouseup);
		return false;
	};
	var windowMousemove = function(e) {
		var xx = e.pageX;
		if(xx < 0) {
			xx = 0;
		}
		$menuResizeElem.css("left", xx);
		return false;
	};
	var windowMouseup = function(e) {
		$menuResizeElem.css("background", "");
		$("body").css("cursor", "");
		$(window).off("mousemove", windowMousemove)
			.off("mouseup", windowMouseup);
		var xx = e.pageX;
		if(xx < 0) {
			xx = 0;
		}
		onResize(xx);
		return false;
	};
	var onResize = function(xx) {
		//减去右边边框的大小
		xx += parseFloat($("#oneLayoutWest").css("border-right-width"));
		$("#oneLayoutWest").css("width", xx);
		$("#oneLayoutCenter").css("left", xx);
		$(window).trigger('resize');
		//$menuPanel.scrollator("refresh");
	};
	$menuResizeElem.on("mousedown", targetMousedown);
	//----------end
	
	
	/**
	  * 菜单打开和关闭点击动作
	  */
	//当前打开的菜单
	var activeMenu = function(elem) {
		$menuPanel.find("ul:visible div").removeClass("one-list-active");
		if(elem) {
			elem.addClass("one-list-active");
		}
	}
	//展开或折叠菜单
	var menuExpand = function(e) {
		e.preventDefault();
		var $thisElem = $(this);
		var menu = $thisElem.data("menu");
		if(menu!=null) {
			activeMenu($thisElem);
		} else {
			if($thisElem.is("span")) {//点击在折叠图标上
				$thisElem = $thisElem.parent();
			}
			if($thisElem.data("open")) {
				$thisElem.next("ul").slideUp(200, function() {
					//$(window).trigger('resize');
					$menuPanel.scrollator("refresh");
				});
				$thisElem.children("span:last").removeClass("icon-angle-down")
					.addClass("icon-angle-left");
				$thisElem.data("open", false);
			} else {
				//console.log($thisElem);
				if($thisElem.find('span').hasClass("one-list-icon")){
					var ul_li_ul = $("#oneMenuPanel").find('ul li ul');
					$.each(ul_li_ul, function(){  
						if($(this).prev("div").data("open") && $(this).css("display") == 'block') {
							$(this).slideUp(200, function() {
								$menuPanel.scrollator("refresh");
							});
			           	$(this).prev("div").children("span:last").removeClass("icon-angle-down")
								.addClass("icon-angle-left");
							$(this).prev("div").data("open", false);
						}
					}); 
				}
				
				$thisElem.next("ul").slideDown(200, function() {
					//$(window).trigger('resize');
					$menuPanel.scrollator("refresh");
				});
				$thisElem.children("span:last").removeClass("icon-angle-left")
					.addClass("icon-angle-down");
				$thisElem.data("open", true);
			}
		}
		return false;
	};
	//点击菜单的响应
	var menuClick = function(e) {
		e.preventDefault();
		
		var $thisElem = $(this);
		activeMenu($thisElem);
		var menu = $thisElem.data("menu");
		
		var tabId = "tab" + menu.id;//一定要string类型
		if(oneTabPanel.exists(tabId)) {
			$.onecloud.opened();
			oneTabPanel.show(tabId)
		} else {
			$.onecloud.opening();
			if(menu.html != null && menu.html.length!=0){
				$.onecloud.openSucc();
				oneTabPanel.addTab({
					id: tabId,
					title: menu.name,
					html: menu.html
				});
			}else if(menu.url != null && menu.url.length!=0) {
				$.ajax({
					url: menu.url,
					async: false,
					dataType: "html",
					success: function(data) {
						$.onecloud.openSucc();
						oneTabPanel.addTab({
							id: tabId,
							title: menu.name,
							html: data
						});
					}
				});
			}else{
				$.onecloud.succShow('研发中');
			}
		}
		return false;
	};
	//----------end

	/**
	 * 菜单生成
	 */
	//获取菜单
	$.getJSON("/public/js/temp.js", function(adminList){
		var adminTree = $.onecloud.listToTree(adminList);
		$menuPanel.append(createTree(adminTree));
	});
	//生成菜单树
	var createTree = function(tree, level) {
		if(level == null) {
			level = 1;
		} else if(level==1) {
			level=level +3;//临时
		} else{
			level=level +2;
		}
		var treeUl = $('<ul class="list-group one-list-group"></ul>');
		$.each(tree, function(k, v) {
			//菜单
			var treeLi = $('<li class="list-group-item"></li>');
			var liBody = $('<div class="one-list-body"></div>');
			treeUl.append(treeLi);
			treeLi.append(liBody);
			//层次递进空白
			if(level != 1) {
				var space = level;  
				if(level > 10) {
					space = 10;
				}
				var liLevel = $('<span class="one-list-' + space + 'f"></span>');
				liBody.append(liLevel);
			}
			//图标
			if(level == 1 && v.iconClass) {
				var liIcon = $('<span class="' + v.iconClass + ' one-list-icon"></span>');
				liBody.append(liIcon);
			}
			//内容
			var liContent = null;
			if(level == 1) {
				liContent = $('<b>' + v.name + '</b>');
			} else {
				liContent = $('<span class="one-list-small-content">' + v.name + '</span>');
			}
			liBody.append(liContent).data("menu", v);
			//子菜单
			if(v.children != null) {
				var liOpen = null;
				if(level == 1) {
					liOpen = $('<span class="icon-angle-left one-list-open-large-icon"></span>');
				} else {
					liOpen = $('<span class="icon-angle-left one-list-open-icon"></span>');
				}
				liOpen.click(menuExpand);
				liBody.append(liOpen)
					.click(menuExpand)
					.data("open", false);
				var liChildren = createTree(v.children, level);
				liChildren.hide();
				treeLi.append(liChildren);
			} else {
				liBody.click(menuClick);
			}
		});
		return treeUl;
	}
	//----------end
	
	/**
	  * 控制台
	  */
	$.ajax({
		url: '/public/js/temp.js',
		//async: false,
		dataType: "html",
		success: function(data) {
			oneTabPanel = new TabPanel({
		        renderTo: 'oneContentTab',
		        //border: 'none',
		        active : 0,
				autoResizable: true,
		        //maxLength : 5,
		        items : [
		            {id:'toolbarPlugin1',title:'控制台',html: data, closable: false}
		        ]
		    });
		}
	});
	
});