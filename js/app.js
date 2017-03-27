/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-08-15 11:54:44
 * @version $Id$
 */
//时间控件封装
function datatime(startdate, enddate) {
    return {
        language: 'zh-CN',//中文格式
        weekStart: 1,//一周从哪一天开始，0表示星期天
        todayBtn: 1,//日期时间选择器组件的底部显示一个 "Today" 按钮用以选择当前日期
        autoclose: 1,//当选择一个日期之后是否立即关闭此日期时间选择器
        todayHighlight: 1,//如果为true, 高亮当前日期
        startView: 2,//日期时间选择器打开之后首先显示的视图。 2 or 'month' for month view (the default)
        forceParse: 0,//当选择器关闭的时候，是否强制解析输入框中的值
        showMeridian: 0,//选项里是否有天或小时
        pickerPosition:"bottom-left",
        // minView:minView,
        startDate:startdate,//new Date()
        // format: format
        endDate:enddate
    }
}
// modal垂直居中
$("[data-toggle='modal']").on('click',function(){
var _target = $(this).attr('data-target')
t=setTimeout(function () {
var _modal = $(_target).find(".modal-dialog")
_modal.animate({'margin-top': parseInt(($(window).height() - _modal.height())/2)}, 300 )
},200)
});

$("#textempty").click(function () {
    $("textarea").val("");//短信内容,模版内容清空
    $("#templateTitle").val("");//模版名称清空
});
function emptyTemplate(){
    $("textarea").val("");//短信内容,模版内容清空
    $("#templateTitle").val("");//模版名称清空
}




Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,
        //月份
        "d+": this.getDate(),
        //日
        "h+": this.getHours(),
        //小时
        "m+": this.getMinutes(),
        //分
        "s+": this.getSeconds(),
        //秒
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0;
//获得本月的开始日期
function getMonthStartDate() {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}

function formatDate(date) {
    return date.Format("yyyy-MM-dd hh:mm:ss");
}

function formatDate(data, row) {
    return (new Date(data)).Format("yyyy-MM-dd hh:mm:ss");
}

// 以当前时间作为key值
function MathRand() {
    var date = new Date();
    var dateStr  = date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
    return dateStr;
}


function sendSMS(message) {
    $(".floatingInfor").hide();
    var div = $('<div class="floatingInfor" style="top:15px;"><p><span class="f_L"></span><span class="f_C"></span><span class="f_R"></span></p></div>');
    $(".f_C", div).text(message);

    var w1 = $(window).width();
    var w2 = $(".floatingInfor").width();
    var w = Math.floor((w1 - w2) / 2) + $(window).scrollLeft();
    if (w1 - w2 < 0) {
        w = w + (w1 - w2);
    }
    var t = 15 + $(window).scrollTop();
    t = t + 160;
    div.css( {
        "left" : w + "px",
        "top" : t + "px",
        "width" : w2 + 250 + "px",
        "display" : "block"
    });
    $("#indexBody").append(div);
    setTimeout(function() {
        div.remove();
    }, 3000);
}

//手机号验证
function isPhone(phone) {
    // 正则
    var pattern=/^1\d{10}$/;
    // 校验
    if(pattern.test(phone)) {
        return true;
    }
    return false;
}
var enddate = new Date();
var startdate = new Date();
