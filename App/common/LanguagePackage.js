'use strict';

// 语言包格式 0--英文 1--繁体中文 2--简体中文
/* function temp
 
 name: (index)=>{
    return ["en", "cht", "chs"][index!=undefined? index : currentLan]
 },

*/
var currentLan = -1;
var $ = {};
var MutiLanguageMixin = require('./MutiLanguageMixin');
var EventEmitterMixin = require('react-event-emitter-mixin');
var storageHandler = require('./StorageHandler');

storageHandler.getSystemSetting(storageHandler.settingName.language, function(data){
    if (data) {
        currentLan = data;
    } else {
        currentLan = 0;
    }
    EventEmitterMixin.eventEmitter('emit', 'LanguageRefresh',parseInt(currentLan));
});

$.LanguagePackage = {

    MutiLanguageMixin:MutiLanguageMixin,

    CURRENT_LAN: ()=>{
            return parseInt(currentLan);
    },
    setCurrentLan: function (cl) {
        currentLan = parseInt(cl);
        storageHandler.setSystemSetting(storageHandler.settingName.language, parseInt(cl));
        EventEmitterMixin.eventEmitter('emit', 'LanguageRefresh',parseInt(cl));
    },

    //分享语言设定
    wechat: (index)=>{
        return ["wechat", "Wechat", "Wechat"][index!=undefined? index : currentLan]
    },
    facebook: (index)=>{
        return ["Facebook", "Facebook", "Facebook"][index!=undefined? index : currentLan]
    },
    share_to_wechat: (index)=>{
        return ["Share To Wechat", "分享至微信", "分享至微信"][index!=undefined? index : currentLan]
    },
    share_to_facebook: (index)=>{
        return ["Share To Facebook", "分享至Facebook", "分享至Facebook"][index!=undefined? index : currentLan]
    },
    share_photo_to_time_line: (index)=>{
        return ["Share Photo To Time Line", "分享照片到朋友圈", "分享照片到朋友圈"][index!=undefined? index : currentLan]
    },
    share_link_to_time_line: (index)=>{
        return ["Share Link To Session", "分享連結到朋友圈", "分享链接到朋友圈"][index!=undefined? index : currentLan]
    },
    share_link_to_session: (index)=>{
        return ["Share Link To Session", "分享連結給朋友", "分享链接给朋友"][index!=undefined? index : currentLan]
    },
    add_friends_from_wechat: (index)=>{
        return ["Add Friends From Wechat", "通過微信添加好友", "通过微信添加好友"][index!=undefined? index : currentLan]
    },
    send_invite_link_to_time_line: (index)=>{
        return ["Send Invite Link TO Time Line", "分享邀請到朋友圈", "分享邀请到朋友圈"][index!=undefined? index : currentLan]
    },
    send_invite_link_to_session: (index)=>{
        return ["Send Invite Link TO Session", "分享邀請給朋友", "分享邀请到给朋友"][index!=undefined? index : currentLan]
    },
    cancel: (index)=>{
        return ["cancel", "取消", "取消"][index!=undefined? index : currentLan]
    },

    confirm: (index)=>{
        return ["confirm", "確認", "确定"][index!=undefined? index : currentLan]
    },



    //通用
    location: (index)=>{
        return ["Location", "位置", "位置"][index!=undefined? index : currentLan]
    },
    information: (index)=>{
        return ["Information", "資訊", "资讯"][index!=undefined? index : currentLan]
    },
    profile: (index)=>{
        return ["Profile", "個人資料", "个人资料"][index!=undefined? index : currentLan]
    },
    add_friends: (index)=>{
        return ["Add Friends", "增加好友", "增加好友"][index!=undefined? index : currentLan]
    },
    my_webuzz: (index)=>{
        return ["My Things", "我的weBuzz", "我的weBuzz"][index!=undefined? index : currentLan]
    },
    settings: (index)=>{
        return ["Settings", "設定", "设定"][index!=undefined? index : currentLan]
    },
    help: (index)=>{
        return ["Help", "使用說明", "使用说明"][index!=undefined? index : currentLan]
    },
    categories: (index)=>{
        return ["Categories", "類別", "类别"][index!=undefined? index : currentLan]
    },
    english: (index)=>{
        return ["English", "英語", "英语"][index!=undefined? index : currentLan]
    },
    traditional_chinese: (index)=>{
        return ["Traditional Chinese", "繁體中文", "繁体中文"][index!=undefined? index : currentLan]
    },
    simplified_chinese: (index)=>{
        return ["Simplified Chinese", "簡體中文", "简体中文"][index!=undefined? index : currentLan]
    },
    language: (index)=>{
        return ["Language", "語言", "语言"][index!=undefined? index : currentLan]
    },
    immediate: (index)=>{
        return ["Immediate", "很近", "很近"][index!=undefined? index : currentLan]
    },
    near: (index)=>{
        return ["Near", "附近", "附近"][index!=undefined? index : currentLan]
    },
    far: (index)=>{
        return ["Far", "很遠", "很远"][index!=undefined? index : currentLan]
    },
    PROXIMITY: (index)=>{
        return [
            $.LanguagePackage.immediate(index),
            $.LanguagePackage.near(index),
            $.LanguagePackage.far(index)
        ];
    },
    proximity: (index)=>{
        return ["Proximity", "感應距離", "感应距离"][index!=undefined? index : currentLan]
    },
    LANGUAGES: (index)=>{
        return [
            // $.LanguagePackage.english(index),
            // $.LanguagePackage.traditional_chinese(index),
            // $.LanguagePackage.simplified_chinese(index),
          "English",
          "繁體中文",
          "简体中文"
        ];
    },

    //消息提示
    ALERT_TITLE_INFORMATION: (index)=>{
        return this.information(index);
    },
    MSG_INSTALL_FACEBOOK: (index)=>{
        return ["Please install Facebook", "請安裝 Facebook", "请安装 Facebook"][index!=undefined? index : currentLan]
    },
    MSG_LINK_FACEBOOK: (index)=>{
        return ["Please link Facebook", "請連結 Facebook", "请连接 Facebook"][index!=undefined? index : currentLan]
    },
    MSG_INSTALL_WECHART: (index)=>{
        return ["Please install Wechat", "請安裝微信", "请安装微信"][index!=undefined? index : currentLan]
    },
    MSG_CAN_NOT_FIND_THING: (index)=>{
        return ["Can not load things, please retry", "獲取資料失敗,請重試", "获取资料失败,请重试"][index!=undefined? index : currentLan]
    },
    MSG_NO_THINGS_REGISTERED: (index)=>{
        return ["He/She has no things yet", "他/她還未登記過 things", "他/她还未登记过 things"][index!=undefined? index : currentLan]
    },
    MSG_PLEASE_Link_Account: (index)=>{
        return ["Please link account in profile", "請于個人資料處連結社交賬戶", "请于个人资料中连接社交账号"][index!=undefined? index : currentLan]
    },
    //thing's tool bar
    toolbar_information: (index)=>{
        return $.LanguagePackage.information(index);
    },
    toolbar_location: (index)=>{
        return $.LanguagePackage.location(index);
    },
    toolbar_comment: (index)=>{
        return ["Comment", "評論", "评论"][index!=undefined? index : currentLan]
    },
    toolbar_share: (index)=>{
        return ["Share", "分享", "分享"][index!=undefined? index : currentLan]
    },
    toolbar_favor: (index)=>{
        return ["Favor", "喜愛", "喜爱"][index!=undefined? index : currentLan]
    },

    //tabbar
    tab_bar_home: (index)=>{
        return ["Home", "主頁", "主页"][index!=undefined? index : currentLan]
    },
    tab_bar_location: (index)=>{
        return $.LanguagePackage.location(index);
    },
    tab_bar_favor: (index)=>{
        return ["Favor", "最愛", "最爱"][index!=undefined? index : currentLan]
    },
    tab_bar_friends: (index)=>{
        return ["Friends", "好友", "好友"][index!=undefined? index : currentLan]
    },
    tab_bar_search: (index)=>{
        return ["Search", "搜尋", "搜寻"][index!=undefined? index : currentLan]
    },

};

module.exports = $.LanguagePackage;