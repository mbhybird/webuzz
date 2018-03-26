var g_ConstInfo = require('../constants/GlobalConstants');

var storage = g_ConstInfo.WEBUZZ_STORAGE;

this.refreshMyThingsHash = function (things, callback) {

    let mapping = {};
    if (things) {
        for (var i = 0; i < things.length; i++) {
            mapping[things[i]._id] = things[i]._id;
        }
    }

    storage.save({
        key: 'mythings',  //注意:请不要在key中使用_下划线符号!
        rawData: mapping,
        expires: 1000 * 300
    });

    if (callback) {
        callback(mapping);
    }
},

this.setPushNotificationThing = function(thing){
    storage.save({
        key: 'pushThingMap',  //注意:请不要在key中使用_下划线符号!
        id:thing.name,
        rawData: thing._id
    });
    this.updateThingsStorage([thing]);
}

this.getPushNotificationThing = function(name,callback){
    if(!name && name==""){
        if(callback){
            callback(undefined);
        }
        return;
    }
    storage.load({
        key: 'pushThingMap',
        id: name,
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        this.getThingFromStorage(ret,callback);
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        console.log("getPushNotificationThing err"+err);
        if (callback) {
            callback(undefined);
        }
    })
}
    
this.getOwnerThings = function(ownerId,callback){
    if(!ownerId && ownerId==""){
        if(callback){
            callback([]);
        }
        return;
    }
    storage.load({
        key: 'ownerThings',
        id: ownerId,
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        console.log("getOwnerThings err"+err);
        if (callback) {
            callback([]);
        }
    })
}

this.getOwnerInfo = function(ownerId,callback){
    if(!ownerId && ownerId==""){
        if(callback){
            callback(undefined);
        }
        return;
    }
    storage.load({
        key: 'ownerInfo',
        id: ownerId,
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        console.log("getOwnerInfo err"+err);
        if (callback) {
            callback(undefined);
        }
    })
}

this.getTypes = function(callback){
    storage.load({
        key: 'types'
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        if (callback) {
            callback([]);
        }
    })
}

this.getThingsByTypes = function(typeName,callback){
    storage.load({
        key: 'thingsType',
        id:typeName,
        syncInBackground:false
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        if (callback) {
            callback([]);
        }
    })
},

this.recordAudioReadStatus = function(audioName){
    storage.save({
        key: 'audioreadstatus',  //注意:请不要在key中使用_下划线符号!
        id:audioName,
        rawData:true
    });
},

this.checkAudioReadStatus = function(audioName,callback){
    if(!audioName){
        if (callback) {
            callback(undefined);
        }
        return;
    }
    storage.load({
        key: 'audioreadstatus',
        id: audioName,
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        if (callback) {
            callback(undefined);
        }
    })
}

this.refreshMyThingsHashFromURL = function (userid, callback) {

    if (!userid || userid == "") {
        if (callback) {
            callback(undefined);
        }
        return;
    }

    let url = g_ConstInfo.WEBUZZ_API_OWNER_THINGS(userid);

    console.log(url);

    fetch(url)
        .then(response=>response.json())
        .catch(err=> {
            alert('Can not get your favors.Please retry.')
        })
        .then(response=> {
            this.refreshMyThingsHash(response, callback);
        })
        .done();
},

this.refreshDucksHashFromURL = function (thingId, callback) {

    if (!thingId || thingId == "") {
        if (callback) {
            callback(undefined);
        }
        return;
    }
    let url = g_ConstInfo.WEBUZZ_API_CACHE_THING_DUCKS(thingId);
    console.log(url);

    fetch(url)
        .then(response=>response.json())
        .catch(err=> {
            alert('Can not get your favors.Please retry.')
        })
        .then(response=> {
            if (callback) {
                callback(!response ? 0 : response.count);
            }
            storage.save({
                key: 'ducks',  //注意:请不要在key中使用_下划线符号!
                id: thingId,
                rawData: !response ? 0 : response.count,
                expires: 1000 * 30
            });

        })
        .done();
},

this.getDucksHash = function (thingId, callback) {
    storage.load({
        key: 'ducks',
        id: thingId,
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        console.log(err);
        console.log("getDucksHash");
        if (callback) {
            callback(undefined);
        }
    })
},

this.getMythingsHashFromStorage = function (callback) {
    storage.load({
        key: 'mythings',
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        console.log("getMythingsHashFromStorage");
        console.log(err);
        if (callback) {
            callback(undefined);
        }
    })
},

this.checkIsMyThings = function (thing, callback) {
    getMythingsHashFromStorage(function (data) {
        if (data) {
            callback(data[thing._id] !== undefined);
        }
    })
},

this.getFovorsRelatedFromStorage = function (callback) {
    storage.load({
        key: 'favors',
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        if (callback) {
            callback(ret);
        }
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        console.log(err);
        console.log("getFovorsRelatedFromStorage");
        if (callback) {
            callback(undefined);
        }
    })
},

this.refreshFavorsRelated = function (things, callback) {
    let mapping = {};
    if (things) {
        for (var i = 0; i < things.length; i++) {
            mapping[things[i]._id] = things[i]._id;
        }
    }
    storage.save({
        key: 'favors',  //注意:请不要在key中使用_下划线符号!
        rawData: mapping,
        expires: 1000 * 300
    });
    if (callback) {
        callback(mapping);
    }
},


this.checkIsFavorThings = function (thing, callback) {
    getFovorsRelatedFromStorage(function (data) {
        if (data) {
            callback(data[thing._id] !== undefined);
        }
    })
},

this.getFavorsRelatedFromURL = function (userid, callback) {
    if (!userid || userid == "") {
        if (callback) {
            callback([]);
        }
        return;
    }
    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR(userid);

    console.log(url);

    fetch(url)
        .then(response=>response.json())
        .catch(err=> {
            // alert('Can not get your favors.Please retry.')
            if(callback){
                callback([]);
            }
        })
        .then(response=> {
            if(callback){
                callback(response);
            }
        })
        .done();
},

this.refreshFavorsRelatedFromURL = function (userid, callback) {
    if (!userid || userid == "") {
        if (callback) {
            callback(undefined);
        }
        return;
    }
    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR(userid);

    console.log(url);

    fetch(url)
        .then(response=>response.json())
        .catch(err=> {
            // alert('Can not get your favors.Please retry.')
            if(callback){
                callback([]);
            }
        })
        .then(response=> {
            this.refreshFavorsRelated(response, callback);
        })
        .done();
},

this.addFavorsRelatedFromStorage = function (things, callback) {
    storage.load({
        key: 'favors',
    }).then(mapping => {
        for (var thing of things) {
            if (mapping[thing._id] != undefined) {
                mapping[thing._id] = thing._id;
            }
        }
        storage.save({
            key: 'favors',  //注意:请不要在key中使用_下划线符号!
            rawData: mapping,
            expires: 1000 * 300
        });
        if (callback) {
            callback(mapping);
        }
    }).catch(err => {
        this.refreshFavorsRelatedFromStorage(things, function (data) {
            storage.save({
                key: 'favors',  //注意:请不要在key中使用_下划线符号!
                rawData: data,
                expires: 1000 * 300
            });
            if (callback) {
                callback(data);
            }
        })
    })
},
    

// this.refreshFavorsFromStorage = function(id,callback){
//   if(!id && id==""){return}
//   let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR(id);
//   console.log(url);
//   fetch(url)
//     .then(response=>response.json())
//     .catch(err=>{ alert('Can not get your favors.Please retry.') })
//     .then(response=>{
//       if(!response || response.length<=0){
//         this.getFavorsFromStorage(id,callback);
//         return;
//       }
//       storage.save({
//         key: 'favors',  //注意:请不要在key中使用_下划线符号!
//         id: id,   //注意:请不要在id中使用_下划线符号!
//         rawData: response,
//         expires: 1000 * 300
//       });
//       callback(response);
//     })
//     .done();
// }

this.getThingFromStorage = function (id, callback) {
    //load 读取
    storage.load({
        key: 'thing',
        id: id
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        callback(ret);
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        callback(false);
    })

},

this.getThingWithBeacon = function(major,minor,callback){
    storage.load({
        key: "thingBeaconHash",
        id: major+g_ConstInfo.BEACON_MAJOR_MINOR_SEPARATOR+minor
    }).then(ret => {
        //如果找到数据，则在then方法中返回
        getThingFromStorage(ret,callback);
    }).catch(err => {
        //如果没有找到数据且没有同步方法，
        //或者有其他异常，则在catch中返回
        // console.log(err);
        callback(false);
    })
}

this.setThingBeaconMap = function(major,minor,thingId){
    storage.save({
        key: 'thingBeaconHash',  //
        id:major+g_ConstInfo.BEACON_MAJOR_MINOR_SEPARATOR+minor,
        rawData: thingId,
        expires: 1000 * 300
    });
}

this.updateThingsStorage = function (things) {
    things.map(function (item, index) {
        storage.save({
            key: 'thing',  //注意:请不要在key中使用_下划线符号!
            id: item._id,   //注意:请不要在id中使用_下划线符号!
            rawData: item,
            expires: 1000 * 300
        });
    })
},

//TODO:Add storage for saving sounds which need repost.
this.addAudioNeedRepost = function(audioRecord,callback){
    storage.load({
        key: 'failedAudios',
    }).then(audios => {
        let audiosArray = [];
        if(audios && audios.length>0){
            audiosArray = audios;
        }
        audiosArray.push(audioRecord);
        this.refreshAudioNeedRepost(audiosArray);
        if (callback) {
            callback(audiosArray);
        }
    }).catch(err => {
        let audiosArray = [];
        audiosArray.push(audioRecord);
        this.refreshAudioNeedRepost(audiosArray);
        console.log("addAudioNeedRepost err"+err);
    })
},

this.settingName = g_ConstInfo.SETTING;

this.getAudioNeedRepost = function(callback){
    storage.load({
        key: 'failedAudios',
    }).then(audios => {
        if (callback) {
            callback(audios);
        }
    }).catch(err => {
        console.log("addAudioNeedRepost err"+err);
    })

},

this.setSystemSetting = function(settingName,settingValue){
    storage.save({
        key: 'systemSetting',  //注意:请不要在key中使用_下划线符号!
        id:settingName,
        rawData: settingValue,
    });
}

this.getSystemSetting = function(settingName,callback){
    storage.load({
        key: 'systemSetting',  //注意:请不要在key中使用_下划线符号!
        id:settingName,
    }).then(settingValue => {
        if (callback) {
            callback(settingValue);
        }
    }).catch(err => {
        console.log("getSystemSetting err"+err);
        if (callback) {
            callback(undefined);
        }
    })
}

this.getSystemSettingAsync = async function(settingName,callback){
    storage.load({
        key: 'systemSetting',  //注意:请不要在key中使用_下划线符号!
        id:settingName,
    }).then(settingValue => {
        if (callback) {
            callback(settingValue);
        }
    }).catch(err => {
        console.log("getSystemSetting err"+err);
    })
    return "";
}

this.refreshAudioNeedRepost = function(audios){
    storage.save({
        key: 'failedAudios',  //注意:请不要在key中使用_下划线符号!
        rawData: audios,
        expires: 1000 * 300
    });
}

this.releaseAllStorage = function () {
    storage.clearMap();

    storage.remove({
        key: 'favors'
    });

    storage.remove({
        key: 'mythings'
    });
},



module.exports = this;
