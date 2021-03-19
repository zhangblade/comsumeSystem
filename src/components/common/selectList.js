/** 卡类型 */
export const cardType = [
    {label: '临时卡', value: '0'},
    {label: '套餐卡', value: '1'},
    {label: '特权卡', value: '2'},
    {label: '管理卡', value: '3'},
    {label: '储值卡', value: '6'},
]
/** 车型 */
export const vehicleType = [
    {label: '未知', value: '0'},
    {label: '摩托车', value: '1'},
    {label: '小型汽车', value: '2'},
    {label: '中型汽车', value: '3'},
    {label: '大型汽车', value: '4'},
    {label: '其他车型', value: '5'},
]
/** 车辆颜色 */
export const vehicleColor = [
    {label: '蓝色', value: '0'},
    {label: '黄色', value: '1'},
    {label: '白色', value: '2'},
    {label: '黑色', value: '3'},
    {label: '绿色', value: '4'},
]
/** 锁定状态 */
export const bLocktype = [
    {label: '不锁车', value: '0'},
    {label: '自动锁车', value: '1'},
]
/** 车位占用 */
export const useFixed = [
    {label: '占用非固定车位', value: '0'},
    {label: '占用固定车位', value: '1'},
    {label: '不计入车位数', value: '2'},
]
/** 计时方式 */
export const naturalDay = [
    {label: '默认值', value: '-1'},
    {label: '24小时', value: '0'},
    {label: '自然天', value: '1'},
]
/** 开闸类型 */
export const openType = [
    {label: '遥控开闸', value: '0'},
    {label: '管理卡开闸', value: '1'},
    {label: '刷卡开闸', value: '2'},
    {label: '车牌识别开闸', value: '3'},
    {label: '车牌识别开闸', value: '4'},
    {label: '手术车牌开闸', value: '5'},
    {label: '手机验证码开闸', value: '6'},
    {label: '取纸票开闸', value: '7'},
    {label: '手机APP开闸', value: '8'},
    {label: '微信支付宝扫码开闸', value: '9'},
]


// 时间比例按值
export const timePrecentList = () => {
    var len = 24*4+1, arr = []
    for (let index = 0; index < len; index++) {
        let val = .25*index+ 0
        let lab = (.25*index+ 0).toString()
        arr.push({ value: val, label: lab})
    }
    return arr
}

// 时间比例按索引
export const timePrecentListByIndexWithoutZero = () => {
    var len = 24*4, arr = []
    for (let index = 0; index < len; index++) {
        let lab = (.25*index+ .25).toString()
        arr.push({ value: index+1, label: lab})
    }
    return arr
}

// 时间比例按索引
export const timePrecentListByIndex = () => {
    var len = 24*4+1, arr = []
    for (let index = 0; index < len; index++) {
        let lab = (.25*index+ 0).toString()
        arr.push({ value: index, label: lab})
    }
    return arr
}

// 报表下载字段
export const exportType = {
    openGateView                : 107, // 开闸记录
    carFlowView                 : 106, // 车流量报表
    carAccessView               : 111, // 车辆进出时长统计
    presenceView                : 105, // 在场车辆查询
    unusualOutView              : 104, // 异常出场记录
    operatorFeeStatisView       : 101, // 操作员收费汇总
    contFeesView                : 103, // 套餐收费记录
    parkFeeView                 : 102, // 停车场收费记录
    businessStatisView          : 113, // 停车场营业报表
    parkFeeStatisView           : 100, // 停车场收费汇总
    opperlogView                : 114, // 操作日志
    publishCouponsView          : 112, // 优惠券发行
    personView                  : 115, // 人员列表
	cardView                    : 116, // 卡发行查询
    cardDepositView             : 117, // 卡押金收取记录
    cardWorkView                : 118, // 卡片操作记录
    couponsBuyLogView           : 119, // 优惠卷购买记录
    openView                    : 120, // 门禁通行记录
    devAlarmEventView           : 121, // 门禁事件记录
    acvDeviceEventlog           : 122, // 主控事件记录
    auth                        : 123, // 门禁权限
    access_areaView             : 125, // 区域统计记录
    access_areaView_history     : 124, // 区域信息
    issueView                   : 126, // 故障
    repaireView                 : 127, // 维修
    warnView                    : 128, // 报警与处理
}

// 产品列表
export const productMenu = [
    {appName: '系统管理', productCode: 'system', appId: 'Cm_System' },
    {appName: '智慧社区', productCode: 'community', appId: 'Cm_Community' },
    {appName: '人车智慧', productCode: 'parking', appId: 'Cpw_Parking' },
    {appName: '智能门禁', productCode: 'access', appId: 'Acv_Access' },
]
// 设备类型
export const deviceType = [
    {label: '门禁', value: 'CONTROLLER'},
    {label: '人脸', value: 'FACE'},
    {label: '发卡器', value: 'CARD'},
    {label: '主控', value: 'MAIN'},
]
// 读卡器
export const readerList = [
    { value: '0', label : 'NONE' },
    { value: '1', label : '1号读卡器' }, //进
    { value: '2', label : '2号读卡器' }, //出
    { value: '4', label : '3号读卡器' }, //进
    { value: '8', label : '4号读卡器' } //出
]
// 门禁类型
export const workModeList = [
    { value: '1', label : '普通门禁' },
    { value: '2', label : '卡或密码' },
    { value: '3', label : '卡加密码' },
    { value: '4', label : '卡加双密码' },
    { value: '5', label : '双卡门禁' },
    { value: '6', label : '三卡门禁' },
    { value: '7', label : '指纹门禁' },
    { value: '8', label : '指纹加卡' },
]
// 权限类型
export const AuthWorkModeList = [
    { value: '1', label : '单卡' },
    { value: '2', label : '密码' },
    { value: '3', label : '卡或密码' },
    { value: '4', label : '卡加密码' },
    { value: '8', label : '卡加双密码' },
    { value: '16', label : '双卡门禁' },
    { value: '32', label : '三卡门禁' },
]
// 卡状态
export const cardStateList = [
    { value: '0', label : '未发卡' },
    { value: '1', label : '已发卡' },
    { value: '2', label : '已挂失' },
    { value: '3', label : '已过期' },
]
// 报警图标名称
export const warnIcon = [
    {value: 'icon-fq', label: '防撬'},
    {value: 'icon-hj', label: '火警'},
    {value: 'icon-jjanycdl', label: '紧急按钮异常短路'},
    {value: 'icon-jjanyckl', label: '紧急按钮异常开路'},
    {value: 'icon-lx', label: '离线'},
    {value: 'icon-mcyc', label: '门磁异常'},
    {value: 'icon-mcycdl', label: '门磁异常短路'},
    {value: 'icon-mcyckl', label: '门磁异常开路'},
    {value: 'icon-pbycdl', label: '破玻异常短路'},
    {value: 'icon-pbyckl', label: '破玻异常开路'},
    {value: 'icon-tw', label: '体温'},
    {value: 'icon-ibp', label: 'IBP盘紧急释放'},
    {value: 'icon-jjkmanba', label: '紧急开门按钮被按'},
    {value: 'icon-pbanba', label: '破玻按钮被按'},
    {value: 'icon-mcck', label: '门磁常开'},
    {value: 'icon-xpkm', label: '胁迫开门报警'},
]


// 指令 // isCommon: 是否通用, matchIns: 匹配项可用, needDoor: 是否需要选择门（用于控制其状态）
export const instructList = {
    CARD: [],
    DOOR: [],
    FACE: [
        {value:'faceRemoteOpen', label: '远程开门', needDoor: true, matchIns: ['FACE0407']},
    ],
    MAIN: [
        {value:'subcontrolleraddress', label: '下发就地级分控地址', isCommon: true},
        {value:'mainLoopStatus', label: '维修巡检', isCommon: true},
        {value:'upgrade', label: '设备程序升级', isCommon: true},
        {value:'emergencyaccess', label: '紧急通行', isCommon: true},
        {value:'emergencyunaccess', label: '撤销紧急通行', isCommon: true},
        {value:'emergencylock', label: '紧急封锁', needDoor: false, isCommon: true},
        {value:'emergencyunlock', label: '撤销紧急封锁', needDoor: false, isCommon: true},
    ],
    CONTROLL: [
        {value:'remoteopen', label: '远程开门', needDoor: true, isCommon: true},
        {value:'emergencyaccess', label: '紧急通行', needDoor: false, isCommon: true},
        {value:'emergencyunaccess', label: '撤销紧急通行', needDoor: false, isCommon: true},
        {value:'emergencylock', label: '紧急封锁', needDoor: false, isCommon: true},
        {value:'emergencyunlock', label: '撤销紧急封锁', needDoor: false, isCommon: true},
        {value:'collect', label: '提取离线数据', needDoor: true, isCommon: true},
    ],
}
// 指令 // isCommon: 是否通用, matchIns: 匹配项可用, needDoor: 是否需要选择门（用于地图）
export const mapInstructList = {
    CARD: [],
    DOOR: [
        {value:'remoteopen', label: '远程开门', needDoor: true, isCommon: true},
        {value:'collect', label: '提取离线数据', needDoor: true, isCommon: true},
        {value:'normallyOpen', label: '常开', needDoor: true, isCommon: true},
        {value:'normallyClose', label: '常闭', needDoor: true, isCommon: true},
    ],
    FACE: [
        {value:'faceRemoteOpen', label: '远程开门', needDoor: true, matchIns: ['FACE0407']},
    ],
    MAIN: [
        {value:'subcontrolleraddress', label: '下发就地级分控地址', isCommon: true},
        {value:'mainLoopStatus', label: '维修巡检', isCommon: true},
        {value:'upgrade', label: '设备程序升级', isCommon: true},
        {value:'emergencyaccess', label: '紧急通行', isCommon: true},
        {value:'emergencyunaccess', label: '撤销紧急通行', isCommon: true},
        {value:'emergencylock', label: '紧急封锁', needDoor: false, isCommon: true},
        {value:'emergencyunlock', label: '撤销紧急封锁', needDoor: false, isCommon: true},
    ],
    CONTROLL: [
        {value:'emergencyaccess', label: '紧急通行', needDoor: false, isCommon: true},
        {value:'emergencyunaccess', label: '撤销紧急通行', needDoor: false, isCommon: true},
        {value:'emergencylock', label: '紧急封锁', needDoor: false, isCommon: true},
        {value:'emergencyunlock', label: '撤销紧急封锁', needDoor: false, isCommon: true},
    ],
}
// 
export const deviceStatusColorList = [
    {value:'online', label: '正常'},
    {value:'offline', label: '离线'},
    {value:'online-o', label: 'OUT端在线'},
    {value:'online-i', label: 'IN端在线'},
    {value:'offline-1', label: '回路1断路'},
    {value:'offline-2', label: '回路2断路'},
    {value:'offline-lose-1', label: '回路1既有断路又有设备丢失'},
    {value:'offline-lose-2', label: '回路2既有断路又有设备丢失'},
]