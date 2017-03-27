(function($) {
	$.fn.formJSON = function() {
		var serializeObj = {};
		var array = this.serializeArray();
		var str = this.serialize();
		$(array).each(
			function() {
				if (serializeObj[this.name]) {
					if ($.isArray(serializeObj[this.name])) {
						serializeObj[this.name].push(this.value);
					} else {
						serializeObj[this.name] = [
							serializeObj[this.name], this.value ];
					}
				} else {
					serializeObj[this.name] = this.value;
				}
			});
		return serializeObj;
	};
})(jQuery);
function isEmpty(str) {
	return (str == null || $.trim(str).length == 0);
}
/**
 * 调用dataTables分页查询
 *
 * @param options
 *            此参数是个对象 此对象的 table,action 属性为必须属性 query为查询条件包裹元素id，即父元素id
 */

function query_dataTable(options) {
	var data_table_object;
	// options参数说明 function 有complete 查询完成后会调用的事件
	// load 替换现有在加载函数 调用自己的加载函数来加载datatable数据 调用load函数会传递 这个4个参数url, queryParam,
	// callback, oSettings
	// success 在表格数据成功加载后需要调用的function 会传递json数据 即后台返回的数据包
	// table对象中 data-options 设置每个对象即一列 里面的参数包括 Class title visible width out
	// render 四个属性 Class自定义样式 title标题 visible是否显示列 width 自定义每列宽度 默认平均分配宽度
	// out 自定义此列输出内容 返回字符串 会传递2个参数 当前值 跟当前行的所有列对象数据
	// render 跟out函数用法差不多 此函数覆盖原来的输出列函数 自定义列输出 三个参数 当前行数据 当前列数据 oSettings对象
	// hidden_title 是否隐藏表头 默认显示
	// selected 是否显示选择列
	// sequences 是否显示序列
	// selectType 单选或多选 默认多选
	// selectCall 选择框change时的触发事件调用函数 传递当前选中的内容json数组格式
	// 可以调selectedAll()函数获取当前选中的内容json数组
	var url = options.url ? options.url : "自定义默认url";
	var table = options.table;// 显示列表数据 table
	var query = options.query ? options.query : "#queryParam";// 查询条件包裹元素id
	var table_class = $(table).attr("class"); // 是否自定义样式
	var hidden_title = options.hidden_title ? options.hidden_title : null;// 是否隐藏表头
	var complete = function() {// 加载完成调用事件
		if (options.complete)
			options.complete();
	}
	var columns = [];
	if (isEmpty(table_class)) {
		$(table).removeClass("table table-striped table-hover table-bordered");
		$(table).addClass("table table-striped table-hover table-bordered");
	}
	var data_options = $(table).attr("data-column");// 表头的自定义列属性
	var bSort = options.sort ? options.sort : false;// 自定义表格否排序 true false
	data_options = JSON.parse(data_options);
	var selectedType = options.selectType ? options.selectType : "checkbox";// 选择类型单选或多选
	// checkbox
	// radio
	var dis = (selectedType == "radio") ? "disabled" : "";
	if (options.selected) {// 是否显示复选框默认不显示
		columns.push({
			"mDataProp" : "",
			"sTitle" : "<input title='全选/反选' type='" + selectedType + "' "
			+ dis + " name='bootstarp_data_table_checkbox'>",
			"sClass" : "center",
			"bVisible" : true,
			"sWidth" : "2%",
			"bSortable" : false,
			"render" : function() {
				return "<input title='选择' type='" + selectedType
					+ "' name='bootstarp_data_table_checkbox'>";
			}
		});
	}

	var displayLen = data_options.length;// 获取显示列数量
	$.each(data_options, function() {
		var visible = this["visible"];
		if (visible)
			displayLen--;
	});
	$.each(data_options, function(index, td) {// 初始化列数据
		var sClass = td.Class ? td.Class : "center";// 居中
		var sTitle = td.title ? td.title : "";// 标题
		var bVisible = td["visible"] ? false : true;// 是否隐藏
		var sWidth = td.width ? td.width : (100 / displayLen) + "%";// 不设置宽度默认
		var bSortable = td.sort ? td.sort : bSort;// 自定义列是否排序 true false
		// 平均分配
		var column = {
			"mDataProp" : td.name,
			"sTitle" : sTitle,
			"sClass" : sClass,
			"bVisible" : bVisible,
			"sWidth" : sWidth,
			"bSortable" : bSortable
		};
		if (td.out) {
			column["render"] = function(data, type, row, meta) {// 编辑列需要执行的自定义函数输出内容
				// 此函数会接收两个参数 （第一个是此列的值
				// 第二个是当前行所有内容）
				return calculateFunctionValue(td.out,[data,row,type,meta]);// key 为当前列数据
				// row.aData为当前行数据
			}
		}
		if (td.render) {// 覆盖原有的编辑列自定义输出内容函数 此函数有三个参数 oSettings 对象
			// row对象 col列对象
			column["render"] = td.render;
		}
		columns.push(column);
	});
	function success(json) {
		//封装返回数据
		var returnData = {};
		returnData.recordsTotal = json.totalPages;//返回数据全部记录
		returnData.recordsFiltered = json.total;//后台不实现过滤功能，每次查询均视作全部结果
		returnData.data = json.data;//返回的数据列表
		return returnData;
		// to code
	}
	var successFunc = options.success ? options.success : success;
	// 3个参数的名字可以随便命名,但必须是3个参数,少一个都不行
	function datatable_callback(url, queryParam, callback, oSettings) {
		queryParam = $(query).formJSON();// 查询条件
		queryParam["page"] = (oSettings._iDisplayStart/oSettings._iDisplayLength)+1;// 当前页
		queryParam["pageSize"] = oSettings._iDisplayLength;
		parent.layer.load(1, {
			shade: 0.5,
		});
		$.ajax({
			type : 'POST',
			dataType : 'json',
			cache : false,
			url : url,// 这个就是请求地址对应sAjaxSource
			data : queryParam, // 这个是把datatable的一些基本数据传给后台,比如起始位置,每页显示的行数
			success : function(data) {
				if(data.success) {
					data["sEcho"] = oSettings._sEcho | oSettings.iDraw;
					if (options.success)
						options.success(data);
					else
						callback(success(data));// 把返回的数据传给这个方法就可以了,datatable会自动绑定数据的
				} else {
					//callback([]);
					parent.layer.msg(data.msg,{
						offset: 0,
						shift: 6
					});
				}
			},
			error:function(e){
				callback([]);
				parent.layer.msg('对不起数据加载失败',{
					offset: 0,
					shift: 6
				});
			}
		}).always(function(){
			parent.layer.closeAll('loading');
		});
	}
	var data_table_load = options.load ? options.load : datatable_callback;
	data_table_object = $(table).DataTable({
		stripeClasses: ["odd", "even"],  //为奇偶行加上样式，兼容不支持CSS伪类的场合
		processing: true,  //隐藏加载提示,自行处理
		serverSide: true,  //启用服务器端分页
		searching: false,  //禁用原生搜索
		"sAjaxSource" : url,
		"fnServerData" : data_table_load, // 获取数据的处理函数
		"bSort" : bSort,// 是否使用排序
		"aoColumns" : columns,
		orderMulti: false,  //启用多列排序
		order: [],  //取消默认排序查询,否则复选框一列会出现小箭头
		renderer: "bootstrap",  //渲染样式：Bootstrap和jquery-ui
		"lengthChange": true,
		pagingType: "full_numbers",  //分页样式：simple,simple_numbers,full,full_numbers
		"dom": 'rt<"bottom"ilp>',
		/*select: {
		 style: 'multi',
		 selector: 'td:first-child'
		 },*/
		"language": {
			"sProcessing": "正在加载数据-请等待...",
			"sLengthMenu": "显示 _MENU_ 记录",
			"sZeroRecords": "对不起，查询不到任何相关数据",
			"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
			"sInfoEmpty": "当前显示0到0条，共0条记录",
			"sInfoFiltered": "",
			"sInfoPostFix": "",
			"sSearch": "搜索:",
			"sUrl": "",
			"sEmptyTable": "表中数据为空",
			"sLoadingRecords": "载入中...",
			"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "上页",
				"sNext": "下页",
				"sLast": "末页",
				"sJump": "跳转"
			},
		}
	});

	if(options.sequences) {
		//添加索引列
		data_table_object.on('order.dt search.dt',
			function () {
				table.column(0, {
					search: 'applied',
					order: 'applied'
				}).nodes().each(function (cell, i) {
					cell.innerHTML = i + 1;
				});
			});
	}

	if (options.selected) {// 显示选择框
		$('tbody', $(table)).on('click', 'td', function() {
			if ($(this).find(":input[name='bootstarp_data_table_checkbox']").length = 1) {
				var box = $(this).parent().find(":input[name='bootstarp_data_table_checkbox']");
				var checked = !$(this).parent().hasClass('selected');
				if(checked){
					$(this).parent().addClass('selected');
				}  else {
					$(this).parent().removeClass('selected');
				}
				box.prop("checked", checked);

			}
			if (options.selectCall) {// 选择框点击时触发selectCall函数
				var selecteds = data_table_object.selectedAll();
				options.selectCall(selecteds);
			}
		});
		$('thead', $(table)).find(":input[name='bootstarp_data_table_checkbox']").on("click", function() {
			var checked  = $(this).is(":checked");
			$('tbody', $(table)).find(":input[name='bootstarp_data_table_checkbox']").prop("checked", checked);
			if(checked) {
				$('tbody', $(table)).find("tr").addClass("selected");
			} else {
				$('tbody', $(table)).find("tr").removeClass("selected");
			}


			if (options.selectCall) {// 选择框点击时触发selectCall函数
				var selecteds = data_table_object.selectedAll();
				options.selectCall(selecteds);
			}
		});
		// 获取datatable选中行的所有数据
		data_table_object.selectedAll = function() {
			var selected = [];
			$.each(data_table_object.rows('.selected')[0], function() {
				var index = this;
				selected.push(data_table_object.row(index).data());
			});
			return selected;
		};
	}
	$(table).prev().hide();
	if (hidden_title) {
		$(table).find("tr:eq(0)").hide();
	}
	return data_table_object;
}

var calculateFunctionValue = function (func, args, defaultValue) {
	if (typeof func === 'string') {
		// support obj.func1.func2
		var fs = func.split('.');

		if (fs.length > 1) {
			func = window;
			$.each(fs, function (i, f) {
				func = func[f];
			});
		} else {
			func = window[func];
		}
	}
	if (typeof func === 'function') {
		return func.apply(null, args);
	}
	return defaultValue;
};
