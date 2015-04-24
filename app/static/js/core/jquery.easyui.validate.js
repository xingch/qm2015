$.extend($.fn.validatebox.defaults.rules, {
	idcard: {// 验证身份证
		validator: function (value) {
			//return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
			value		= $.trim(value);
			var errors = new Array("验证通过", "身份证号码位数不对", "身份证含有非法字符", "身份证号码校验错误","身份证地区非法");
			//身份号码位数及格式检验
			var re;
			var len = value.length;
			//身份证位数检验
			if (len != 18) {
				return false;
				//return errors[1];
			} else {
				re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})([0-9xX])$/);
			}
			var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西",
					     15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海",
					     32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西",
					     37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东",
					     45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州",
					     53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海",
					     64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门",
					     91: "国外"};

			var idcard_array = new Array();
			idcard_array = value.split("");
			//地区检验
			if (area[parseInt(value.substr(0, 2))] == null) {
				return false;
				//return errors[4];
			}
			//出生日期正确性检验
			var a = value.match(re);
			if (a != null) {
				if (len == 18) {
					var DD = new Date(a[3] + "/" + a[4] + "/" + a[5]);
					var flag = DD.getFullYear() == a[3] && (DD.getMonth() + 1) == a[4] && DD.getDate() == a[5];
				}
				if (!flag) {
					return false;
					//return "身份证出生日期不对！";
				}
			    //检验校验位
				if (len == 18) {
				   S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
					  + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
					  + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
					  + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
					  + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
					  + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
					  + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
					  + parseInt(idcard_array[7]) * 1
					  + parseInt(idcard_array[8]) * 6
					  + parseInt(idcard_array[9]) * 3;

				   Y = S % 11;
				   M = "F";
				   JYM = "10X98765432";
				   M = JYM.substr(Y, 1); //判断校验位

				   //检测ID的校验位
				   if (M == idcard_array[17]) {
					   return true;
				   }else {
					   return false;
					   //return errors[3];
				   }
				}
			} else {
				return false;
				//return errors[2];
			}
			return true;
		},
		message: '身份证号码格式不正确'
	},
	minLength: {
		validator: function (value, param) {
			return value.length >= param[0];
		},
		message: '请输入至少（2）个字符.'
	},
	length: { validator: function (value, param) {
		var len = $.trim(value).length;
		return len >= param[0] && len <= param[1];
	},
		message: "输入内容长度必须介于{0}和{1}之间."
	},
	phone: {// 验证电话号码
		validator: function (value) {
			value		= $.trim(value);
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
		},
		message: '格式不正确,请使用下面格式:020-88888888'
	},
	mobile: {// 验证手机号码
		validator: function (value) {
			value		= $.trim(value);
			return /^(13|15|18|17)\d{9}$/i.test(value);
		},
		message: '手机号码格式不正确'
	},
	intOrFloat: {// 验证整数或小数
		validator: function (value) {
			return /^\d+(\.\d+)?$/i.test(value);
		},
		message: '请输入数字，并确保格式正确'
	},
	money: {// 验证整数或小数
		validator: function (value) {
			return /^\d+(\.\d{1,2})?$/i.test(value);
		},
		message: '请输入数字，小数最多2位'
	},
	currency: {// 验证货币
		validator: function (value) {
			return /^\d+(\.\d+)?$/i.test(value);
		},
		message: '货币格式不正确'
	},
	qq: {// 验证QQ,从10000开始
		validator: function (value) {
			return /^[1-9]\d{4,9}$/i.test(value);
		},
		message: 'QQ号码格式不正确'
	},
	integer: {// 验证整数 可正负数
		validator: function (value) {
			//return /^[+]?[1-9]+\d*$/i.test(value);
	
			return /^([+]?[0-9])|([-]?[0-9])+\d*$/i.test(value);
		},
		message: '请输入整数'
	},
	age: {// 验证年龄
		validator: function (value) {
			return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
		},
		message: '年龄必须是0到120之间的整数'
	},
	
	chinese: {// 验证中文
		validator: function (value) {
			value		= $.trim(value);
			return /^[\u4e00-\u9fa5]+$/i.test(value); 
			//return /^[\Α-\￥]+$/i.test(value);
			//return /^[\u0391-\uFFE5]+$/.test(value);
		},
		message: '请输入中文'
	},
	english: {// 验证英语
		validator: function (value) {
			return /^[A-Za-z]+$/i.test(value);
		},
		message: '请输入英文'
	},
	unnormal: {// 验证是否包含空格和非法字符
		validator: function (value) {
			return /.+/i.test(value);
		},
		message: '输入值不能为空和包含其他非法字符'
	},
	username: {// 验证用户名
		validator: function (value) {
			value		= $.trim(value);
			return /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/i.test(value);
		},
		message: '用户名不合法（请输入5到16个数字或字母）'
	},
	loginname: {// 验证用户名
		validator: function (value) {
			value		= $.trim(value);
			return /^[a-zA-Z][a-zA-Z0-9]{5,19}$/i.test(value);
		},
		message: '用户名不合法（请输入6到20个字母或数字，且以字母开头的账号）'
	},
	faxno: {// 验证传真
		validator: function (value) {
			//            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
		},
		message: '传真号码不正确'
	},
	zip: {// 验证邮政编码
		validator: function (value) {
			return /^[1-9]\d{5}$/i.test(value);
		},
		message: '邮政编码格式不正确'
	},
	ip: {// 验证IP地址
		validator: function (value) {
			return /d+.d+.d+.d+/i.test(value);
		},
		message: 'IP地址格式不正确'
	},
	name: {// 验证姓名，可以是中文或英文
		validator: function (value) {
			value		= $.trim(value);
			return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
		},
		message: '请输入姓名'
	},
	date: {// 验日期
		validator: function (value) {
			//格式yyyy-MM-dd或yyyy-M-d
			return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
		},
		message: '清输入合适的日期格式'
	},
	msn: {
		validator: function (value) {
			return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
		},
		message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
	},
	same: {
		validator: function (value, param) {
			if ($("#" + param[0]).val() != "" && value != "") {
				return $("#" + param[0]).val() == value;
			} else {
				return true;
			}
		},
		message: '两次输入的密码不一致！'
	},
	pwd:{
		validator: function (value) {
			return /^[A-Za-z0-9_!@#=$%^&*()]{6,12}$/.test(value);
		},
		message: '密码长度6-12位字母，数字或符号！'
		
	},
	bankCard:{
		validator: function (value) {
			value		= $.trim(value);
			return /^\d{16,19}$/.test(value);
		},
		message: '银行卡号格式错误！'
	}
}); 