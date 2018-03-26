'use strict'
// var hostUrl = "http://arts.things.buzz:2397";
// var hostUrl = "http://localhost:2397";

import Storage from 'react-native-storage';

var storage = new Storage({
  //最大容量，默认值1000条数据循环存储
  size: 1000,

  //数据过期时间，默认一整天（1000 * 3600 * 24秒）
  defaultExpires: 1000 * 3600 * 24,

  //读写时在内存中缓存数据。默认启用。
  enableCache: true,

  //如果storage中没有相应数据，或数据已过期，
  //则会调用相应的sync同步方法，无缝返回最新数据。
  sync : {
    //同步方法的具体说明会在后文提到
  }
});



var constants = {
	WEBUZZ_HOST : "http://arts.things.buzz:2397",
  // WEBUZZ_HOST : "http://192.168.0.116:2397",

  WEBUZZ_API_THINGS:function(thingId){
    let url = this.WEBUZZ_HOST + "/api/things/";
    if(thingId)
    {
      url = url + thingId;
    }
    return url;
  } ,
  WEBUZZ_API_OWNER_THINGS:function(owner){
    return this.WEBUZZ_HOST+"/api/things/owner/"+owner;
  },
  WEBUZZ_API_TYPE:function(){
    return this.WEBUZZ_HOST+"/api/types/";
  },
  WEBUZZ_API_THINGS_TYPE:function(typeName){
    if(typeName && typeName != ""){
      return this.WEBUZZ_HOST + "/api/things/type/"+ typeName;
    } else {
      return this.WEBUZZ_HOST + "/api/things/type/";
    }
  },
  WEBUZZ_API_LOGS:function(){
    return this.WEBUZZ_HOST+"/api/logs/";
  },
  WEBUZZ_API_THINGS_BEACON:function(major,minor){
    return this.WEBUZZ_HOST+"/api/things/beacon/"+major+"/"+minor;
  },
  WEBUZZ_API_GROUPS:function(groupid){
    let url = this.WEBUZZ_HOST + "/api/groups/";
    if(groupid)
    {
      url = url + groupid;
    }
    return url;
  },
  WEBUZZ_API_CACHE_HEATCHART:function(){
    return this.WEBUZZ_HOST + "/api/cache/heatchart";
  },
  WEBUZZ_API_THINGS_LOCATION:function(latmin,latmax,lngmin,lngmax){
    return this.WEBUZZ_HOST + "/api/things/location/" + latmin + "/" + latmax + "/" + lngmin + "/"+ lngmax + "/";
  },
  WEBUZZ_API_USER_FAVOR:function(ownerId){
    if(ownerId && ownerId != ""){
      return this.WEBUZZ_HOST + "/api/user/favor/"+ownerId;
    }else{
      return this.WEBUZZ_HOST + "/api/user/favor/";
    }

  },
  WEBUZZ_API_CACHE_THING_DUCKS:function(thingId){

    if(thingId && thingId != ""){
      return this.WEBUZZ_HOST + "/api/cache/thing/ducks/"+thingId;
    }else{
      return this.WEBUZZ_HOST + "/api/cache/thing/ducks/";
    }
  },
  WEBUZZ_API_THINGS_ADDCOMMENT:function(thingId,title){
    if(thingId && title && thingId != "" && title!=""){
      return this.WEBUZZ_HOST + "/api/things/addcomment/"+thingId + "/" + title;
    }else{
      return this.WEBUZZ_HOST + "/api/things/addcomment/";
    }
  },
  WEBUZZ_API_THINGS_ALL_LOCATION:function(){
    return this.WEBUZZ_HOST +"/api/things/getAllChangingLocation";
  },
  WEBUZZ_API_THING_UPDATE_LOCATION:function(thingId){
    
    if(thingId && thingId != ""){
      return this.WEBUZZ_HOST + "/api/things/updatelocation/" + thingId;
    }else{
      return this.WEBUZZ_HOST + "/api/things/updatelocation/";
    }

  },
  WEBUZZ_API_THINGS_SEARCH:function(search){
    if(search && search != ""){
      return this.WEBUZZ_HOST + "/api/things/search/" + search;
    }else{
      return this.WEBUZZ_HOST + "/api/things/search/";
    }
  },

  WEBUZZ_API_FRIENDS: function(userId){
    if(userId && userId != ""){
      return this.WEBUZZ_HOST + "/api/friends/" + userId;
    } else {
      return this.WEBUZZ_HOST + "/api/friends/";
    }
  },

  WEBUZZ_API_FRIENDS_WECHAT: function(userId){
    if(userId && userId != ""){
      return this.WEBUZZ_HOST + "/api/friends/wechat/" + userId;
    } else {
      return this.WEBUZZ_HOST + "/api/friends/wechat/";
    }
  },

  WEBUZZ_API_USERS:function(userid){
    // http://arts.things.buzz:2397/api/users

    if(userid && userid != ""){
      return this.WEBUZZ_HOST + "/api/users/" + userid;
    }else{
      return this.WEBUZZ_HOST + "/api/users/";
    }
  },
  WEBUZZ_WECHAT_ADD_FRIENDS: function(userid){

        if(userid && userid != ""){
          return "http://webuzz.buzztech.mo/weixin_oauth/webuzzoauth/UserInfo?userid=" + userid;
        }else{
          return "";
        }
  },
  WEBUZZ_STORAGE:storage,
  BEACON_MAJOR_MINOR_SEPARATOR:"@@@",
  IMAGE_BASE64_PREFIX:'data:image/jpeg;base64,',

  //用于集中管理EVENT的名称。
  EVENT:{
    proximity:"proximity"
  },
  
  SETTING:{
    language:"language",
    proximity:"proximity"
  },

  PROXIMITY:{
    immediate:"immediate",
    near:"near",
    far:"far"
  },

  PROXIMITY_VALUE:function(proximity){
    let _proximity = proximity.toLowerCase();
    if (_proximity==this.PROXIMITY.near){
      return 1;
    } else if (_proximity==this.PROXIMITY.far){
      return 2;
    } else {
      return 0 ;
    }
  }


};

storage.sync = {
    //同步方法的名字必须和所存数据的key完全相同
    //方法接受的参数为一整个object，所有参数从object中解构取出
    //这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject。
    thing(params){
      let { id, resolve, reject } = params;
      let url = constants.WEBUZZ_API_THINGS(id);
      fetch(url).then( response => {
        return response.json();
      }).then( json => {
        //console.log(json);
        if(json){
          storage.save({
            key: 'thing',
            id:id,
            rawData: json
          });
          // 成功则调用resolve
          resolve && resolve(json);
        }
        else{
          // 失败则调用reject
          reject && reject('data parse error');
        }
      }).catch( err => {
        console.warn(err);
        reject && reject(err);
      });
    },

  ownerThings(params){
    let { id, resolve, reject } = params;
    let url = constants.WEBUZZ_API_OWNER_THINGS(id);
    fetch(url).then( response => {
      return response.json();
    }).then( json => {
      //console.log(json);
      if(json){
        storage.save({
          key: 'ownerThings',
          id:id,
          rawData: json
        });
        // 成功则调用resolve
        resolve && resolve(json);
      }
      else{
        // 失败则调用reject
        reject && reject('data parse error');
      }
    }).catch( err => {
      console.warn(err);
      reject && reject(err);
    });
  },

  ownerInfo(params){
    let { id, resolve, reject } = params;
    let url = constants.WEBUZZ_API_USERS(id);
    fetch(url).then( response => {
      return response.json();
    }).then( json => {
      //console.log(json);
      if(json){
        storage.save({
          key: 'ownerInfo',
          id:id,
          rawData: json
        });
        // 成功则调用resolve
        resolve && resolve(json);
      }
      else{
        // 失败则调用reject
        reject && reject('data parse error');
      }
    }).catch( err => {
      console.warn(err);
      reject && reject(err);
    });
  },

  types(params){
    let { id, resolve, reject } = params;
    let url = constants.WEBUZZ_API_TYPE();
    fetch(url).then( response => {
      return response.json();
    }).then( json => {
      //console.log(json);
      if(json){
        storage.save({
          key: 'types',
          rawData: json
        });
        // 成功则调用resolve
        resolve && resolve(json);
      }
      else{
        // 失败则调用reject
        reject && reject('data parse error');
      }
    }).catch( err => {
      console.warn(err);
      reject && reject(err);
    });
  },

    ducks(params){
      let { id, resolve, reject } = params;
      let url = constants.WEBUZZ_API_CACHE_THING_DUCKS(id);
      fetch(url).then( response => {
        return response.json();
      }).then( json => {
        //console.log(json);
        if(json){
          storage.save({
            key: 'ducks',
            id:id,
            rawData: !json ? 0 : json.count
          });
          // 成功则调用resolve
          resolve && resolve(json);
        }
        else{
          // 失败则调用reject
          reject && reject('data parse error');
        }
      }).catch( err => {
        console.warn(err);
        reject && reject(err);
      });
    },

    thingsType(params){
      let { id, resolve, reject } = params;
      let url = constants.WEBUZZ_API_THINGS_TYPE(id);
      fetch(url).then( response => {
        return response.json();
      }).then( json => {
        //console.log(json);
        if(json){
          storage.save({
            key: 'thingsType',
            id:id,
            rawData: !json ? 0 : json.count,
            expires: 1000
          });
          // 成功则调用resolve
          resolve && resolve(json);
        }
        else{
          // 失败则调用reject
          reject && reject('data parse error');
        }
      }).catch( err => {
        console.warn(err);
        reject && reject(err);
      });
    },
}

module.exports = constants

// var hostUrl = "http://arts.things.buzz:2397";
//
// class constants{
//   constructor() {
//     this.WEBUZZ_HOST = 123;
//   }
// }
//
// module.exports = constants;
