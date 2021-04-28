import axios from '@/libs/api.request'

export default {
    // 5.加载社区列表
    getCommunityList: req => {
        return axios.request({
			url: '/community/list',
			method: 'get',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			params: req
        })
    },
    // 5.加载人员群树
    getPersonGroup: req => {
        return axios.request({
			url: 'group/findtree',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			data: req
        })
    },
    // 7.分页查询人员群下人员数据
    getPersonByGroup: req => {
        return axios.request({
			url: '/personnel/personnelUnderGroupTree',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			data: req
        })
    },
    // 7.设备组
    getDevGroup: req => {
        return axios.request({
			url: '/consume/group/findtree',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			data: req
        })
	},
    // 7.设备组
    getDevByGroup: req => {
        return axios.request({
			url: '/consume/device/query',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			data: req
        })
	},
	// 修改密码
	resetPassword: req => {
		return axios.request({
			url: '/user/resetpassword',
			method: 'post',
			data: req,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		})
	},
	// 密码国企强制修改密码
	forceresetpwd: req => {
		return axios.request({
			url: 'forceresetpwd',
			method: 'post',
			data: req,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		})
	},
	// 充值明细 
	// 充值类型 charge_type;
   	// 补助标识 charge_issue;
	// 消费明细
   	// 状态 source_status;
    // 数据类型 source_data_type;
    // 支付类型 source_pay_type;
   	// 消费类型 source_cost_type;
	// 支付场景 source_pay_scen;
	// 人员
	// 人员类型 personnel_type;
	// 设备
	// 设备分类	dev_class;
	// 设备类型	dev_type;

    // 7.数据字典
    getDict: req => {
        return axios.request({
			url: '/consume/datadict/findDictBytypes',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			data: req
        })
    },
}
  