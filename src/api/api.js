const REQUEST_URL = process.env.ROOT_API;
// 代理地址
const DEV_PROXY = REQUEST_URL +'/api';
// 用户服务接口
const USER = {
    USER_LOGIN: DEV_PROXY + "/v1/login", // 登录
    USER_LOGOUT: DEV_PROXY + "", // 退出
    USER_INFO: DEV_PROXY + '', // 检查用户登录状态&获取用户信息
    USER_INFO_MATCH: DEV_PROXY + '', // 根据账号获取用户详情
}

//获取统计数据接口
const DETAIL = {
    AREA_LIST:  DEV_PROXY +"/v1/bigdata/areas",//地区列表
    DAILY_DATA: DEV_PROXY +"/v1/bigdata/summary",//日报
    CURRENT_DATA: DEV_PROXY  +"/v1/bigdata/realtimedata",//实时数据
    GET_COMMINFOS: DEV_PROXY  +"/v1/bigdata/comminfos",//获取社区经纬度
    GET_INCOME_INDICATOR: DEV_PROXY  +"/v1/bigdata/incomeIndicator",//获取收入指标
}

export{
    USER,
    DETAIL
}