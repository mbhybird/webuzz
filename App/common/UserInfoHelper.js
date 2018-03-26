'use strict'
var AppLogin = require('react-native').NativeModules.AppLogin;
var EventEmitterMixin = require('react-event-emitter-mixin');
var g_ConstInfo = require("../constants/GlobalConstants.js");
// var Promise = require('Promise');
var m_callback;
var UserInfoHelper = {

    getUserIdWithCheck: function (callback) {
        AppLogin.getUserIdFromNative(function (data) {
            //没有资料说明没有登录过
            if (data && data != "") {
                if (callback) {
                    callback(data);
                }
            } else {
                //发送事件通知弹出login页面

                EventEmitterMixin.eventEmitter('emit', 'ShowLogin', callback);
            }
        });

    },
    showLoginPageAndGetLoginId: function (callback) {
        EventEmitterMixin.eventEmitter('emit', 'ShowLogin', callback);
    },
    //Set user info including user photo to comment.
    getCommentDTOUserInfo: function (thingsProfileDTO, callback) {
        AppLogin.getUserInfoFromNative(function (userInfo) {

            thingsProfileDTO.user = userInfo;

            var userPhoto = require('image!img-user-photo');

            //Set user photo to things profile DTO.
            if (thingsProfileDTO.user.photo) {
                userPhoto = {uri:g_ConstInfo.IMAGE_BASE64_PREFIX + thingsProfileDTO.user.photo};
            } else if (thingsProfileDTO.user.wechat && thingsProfileDTO.user.wechat.headimgurl) {
                userPhoto = {uri: thingsProfileDTO.user.wechat.headimgurl};
            } else if (thingsProfileDTO.user.facebook && thingsProfileDTO.user.facebook.headimgurl) {
                userPhoto = {uri: thingsProfileDTO.user.facebook.headimgurl};
            }
            thingsProfileDTO.userPhoto = userPhoto;
            if (callback) {
                callback(thingsProfileDTO);
            }
        });
    },

    getUserPhotoInfo: function(callback) {
        AppLogin.getUserInfoFromNative(function(userInfo){
            var userPhoto = require('image!img-user-photo');

            if (userInfo.photo) {
                userPhoto = {uri:g_ConstInfo.IMAGE_BASE64_PREFIX + userInfo.photo};
            } else if (userInfo.wechat && userInfo.wechat.headimgurl) {
                userPhoto = {uri: userInfo.wechat.headimgurl};
            } else if (userInfo.facebook && userInfo.facebook.headimgurl) {
                userPhoto = {uri: userInfo.facebook.headimgurl};
            }
            if (callback) {
                callback(userPhoto);
            }
        });
    },

    getUserPhotoWithUserInfo:function(userInfo){
        var userPhoto = require('image!img-user-photo');
        if(userInfo){
            if (userInfo.photo) {
                userPhoto = {uri:g_ConstInfo.IMAGE_BASE64_PREFIX + userInfo.photo};
            } else if (userInfo.wechat && userInfo.wechat.headimgurl) {
                userPhoto = {uri: userInfo.wechat.headimgurl};
            } else if (userInfo.facebook && userInfo.facebook.headimgurl) {
                userPhoto = {uri: userInfo.facebook.headimgurl};
            }
        }
        return userPhoto;
    },

    getUserInfoWithCheck: function (callback) {
        AppLogin.getUserInfoFromNative(function (data) {
            //没有资料说明没有登录过
            if (data && data != "") {
                if (callback) {
                    callback(data);
                }
            } else {
                //发送事件通知弹出login页面

                EventEmitterMixin.eventEmitter('emit', 'ShowLogin', callback);
            }
        });
    }
};

module.exports = UserInfoHelper;