//
//  AppLogin.m
//  ArtsBuzzV2
//
//  Created by BrianLee on 16/2/18.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AppLogin.h"
#import "RCTEventDispatcher.h"
#import "RCTBridge.h"
#import <AdSupport/ASIdentifierManager.h>

/*
 Wechat login: 
 1.WeChatAPI means wechat rct login module.
 2.() means exec in js side.
 3.[] means operation in wechat
 4.data1 
    body[@"state"] = r.state;
    body[@"lang"] = r.lang;
    body[@"country"] =r.country;
    body[@"type"] = @"SendAuth.Resp";
    body[@"appid"] = gAppID;
    body[@"code"]= r.code;
 
 (WeChatAPI.login())->
 [login]-callback->
 WeChatAPI.onResp-event & data1->
 (NativeAppEventEmitter.addListener('WeChat_Resp'))-->
 (AppLogin.wxLoginWithRespInfo)
 
 Facebook Login:
 (FBLoginManager.logInWithReadPermissions)-->
 (FBSDKAccessToken.getCurrentAccessToken)-->
 (var profileRequest = new FBSDKGraphRequest(
     _this._facebookLoginInfoGet,
     '/' + event.userID,
     {
     type: {string: 'public_profile'},
     fields: {string: 'id,name,picture,gender'}
     }
     );
 profileRequest.start();)-callback->
 (_facebookLoginInfoGet)-->
 (AppLogin.facebookLoginWithInfo)
 */


NSString * const USER_LOGIN_SESSION=@"userloginsession";
NSString * const LOG_POST_HISTORY=@"logposthistory";
NSString * const INVOKE_SUCCESS = @"success";
NSString * const INVOKE_FAILED = @"failed";
NSString * const MESSAGE_FIRST_LOGIN = @"FIRST";
NSString * const MESSAGE_USERID_EXIST = @"EXIST";
static NSString *gAppSecret = @"";
NSString * const URL_CREATE_USER = @"http://arts.things.buzz:2397/api/users";
//Method:POST
//body:{
//  "firstname":"brian",
//  "lastname":"lee",
//  "nickname":"freshman",
//  "password":"P@ssw0rd",
//  "gender":"M",
//  "email":"brianlee@qq.com",
//  "photo":null,
//  "facebook":{
//    "id":"123456"
//  },
//  "wechat":{
//    "id":"345678"
//  }
//  
//  
//}
//return-->User created!
//NSString * const URL_CHECK_LOGIN = @"http://arts.things.buzz:2397/api/users/login/";

//NSString * const URL_CHECK_EXIST = @"http://things.buzz/webuzz/index.php?api=checkexist";
NSString * const URL_CHECK_WECHAT_EXIST=@"http://arts.things.buzz:2397/api/users/wechat/";
//Method:GET
//return--> nil ||
//body:{
//  "firstname":"brian",
//  "lastname":"lee",
//  "nickname":"freshman",
//  "password":"P@ssw0rd",
//  "gender":"M",
//  "email":"brianlee@qq.com",
//  "photo":null,
//  "facebook":{
//    "id":"123456"
//  },
//  "wechat":{
//    "id":"345678"
//  }
//
//
//}
NSString * const URL_CHECK_FACEBOOK_EXIST=@"http://arts.things.buzz:2397/api/users/facebook/";
//Method:GET
//return--> nil ||
//body:{
//  "firstname":"brian",
//  "lastname":"lee",
//  "nickname":"freshman",
//  "password":"P@ssw0rd",
//  "gender":"M",
//  "email":"brianlee@qq.com",
//  "photo":null,
//  "facebook":{
//    "id":"123456"
//  },
//  "wechat":{
//    "id":"345678"
//  }
//
//
//}
NSString * const URL_CHECK_LOGINUSER_EXIST=@"http://arts.things.buzz:2397/api/users/login/"; //暂时弃用，该方法用于检查用用户名，密码登陆

//NSString * const URL_GET_USER = @"http://things.buzz/webuzz/";
NSString * const USER_LOGIN_INFO=@"userlogininfo";
NSString * const SOURCE_WECHAT=@"wechat";
NSString * const SOURCE_FACEBOOK=@"facebook";
NSString * const SOURCE_USERLOGIN=@"userlogin";
@implementation Wechat
- (void)setID:(NSString *)ID{
  _ID = ID;
}
@end
@implementation Facebook
- (void)setID:(NSString *)ID{
  _ID = ID;
}
@end
@implementation AppLogin
  RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(refreshUserInfo:(NSDictionary*)userInfo){
  [self saveUserDBInfo:userInfo];
}

RCT_EXPORT_METHOD(facebookLoginWithInfo:(NSString *)email
                  nickname:(NSString *)nickname
                  firstname:(NSString *)firstname
                  lastname:(NSString *)lastname
                  gender:(NSString *)gender
                  wechat:(NSDictionary *)wechat
                  facebook:(NSDictionary *)facebook
                  callback:(RCTResponseSenderBlock)callback)
{
  AppLogin * al = [[AppLogin alloc] init];
  bool isLogin=YES;
  if(![self checkIfUserIDExist:[facebook objectForKey:@"id"] loginType:SOURCE_FACEBOOK loginInfo:facebook]){
    
    if(![self checkIfUserLinkInfo:facebook withSource:SOURCE_FACEBOOK]){
      
      NSDictionary * Userinfo = [self getUserInfoWithEmail:email
                                                  nickname:nickname
                                                 firstname:firstname
                                                  lastname:lastname
                                                    gender:gender
                                                    wechat:wechat
                                                  facebook:facebook];
    
      isLogin = [al saveAndPostUserInfo:Userinfo withSource:@"facebook"];
    }
  }
  callback(@[isLogin ? INVOKE_SUCCESS:INVOKE_FAILED]);
}

RCT_EXPORT_METHOD(getADID:(RCTResponseSenderBlock)callback){
  NSString *adId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
  callback(@[adId]);
}

RCT_EXPORT_METHOD(signUpWithUseridandPassword:(NSString *)userid password:(NSString *)password callback:(RCTResponseSenderBlock)callback)
{
  NSDictionary * signUpInfo = [NSDictionary dictionaryWithObjectsAndKeys:userid,@"email",password,@"password",userid,@"nickname",nil];
  if(![self checkIfUserIDExist:userid loginType:@"user" loginInfo:nil])
  {
    NSRange  range = [[self postSyn:URL_CREATE_USER jsonData:[self DataTOjsonString:signUpInfo]] rangeOfString:@"User created!"];
    BOOL issignup = range.length>0;
    if (issignup) {
      [self checkIfUserIDExist:userid loginType:@"userlogin" loginInfo:nil];
    }
    callback(@[issignup ? INVOKE_SUCCESS:INVOKE_FAILED]);
  }
  else
  {
    callback(@[MESSAGE_USERID_EXIST]);
  }
}

//RCT_EXPORT_METHOD(loginWithUseridandPassword:(NSString *)userid password:(NSString *)password callback:(RCTResponseSenderBlock)callback)
//{
////  NSDictionary * logininfo = [NSDictionary dictionaryWithObjectsAndKeys:userid,@"userid",password,@"password",nil];
////  BOOL islogin =[[self postSyn:URL_CHECK_LOGIN
////                      jsonData:[self DataTOjsonString:logininfo]] isEqual:@"1" ];
//  BOOL islogin=NO;
//  
//  NSString * urlstr = [[[URL_CHECK_LOGIN stringByAppendingString:userid] stringByAppendingString:@"/"] stringByAppendingString:password];
//  
//  NSURL * url = [NSURL URLWithString:urlstr];
//  
//  NSData * responseData = [self getSyn:url];
//  if (responseData != nil) {
//    NSDictionary * dic = [(NSMutableDictionary *)[NSJSONSerialization JSONObjectWithData:responseData options:0 error:nil] mutableCopy];
//    if(dic != nil && dic.count>0 )
//    {
//      
//      [self saveUserLoginSession:[dic objectForKey:@"_id"]];
//      [self saveUserDBInfo:dic];
//      
//      islogin=YES;
//    }
//  }
//  callback(@[islogin ? INVOKE_SUCCESS:INVOKE_FAILED]);
//}

//RCT_EXPORT_METHOD(loginWithOpenID:(NSString *)openid callback:(RCTResponseSenderBlock)callback)
//{
//  BOOL result =[self checkIfUserIDExist:openid];
//  if (!result) {
//    callback(@[[self createUserInfobyOpenID:openid]? MESSAGE_FIRST_LOGIN:INVOKE_FAILED]);
//  }
//  else
//  {
//    callback(@[INVOKE_SUCCESS]);
//  }
//}

RCT_EXPORT_METHOD(isLogin:(RCTResponseSenderBlock)callback)
{
  callback(@[[self isLogin]? INVOKE_SUCCESS:INVOKE_FAILED]);
}

//RCT_EXPORT_METHOD(logPostHistory:(NSDictionary * )body)
//{
//  NSDictionary * pool =(NSDictionary *)[[NSUserDefaults standardUserDefaults] objectForKey:LOG_POST_HISTORY];
//  if (pool != nil && pool.count>0) {
//    for (NSDictionary * item in pool) {
//      if ([[item objectForKey:@"major"] isEqualToString:[body objectForKey:@"major"]] &&
//          [[item objectForKey:@"minor"] isEqualToString:[body objectForKey:@"minor"]]) {
//        NSDate * logtime
//      }
//    }
//  }
//}

RCT_EXPORT_METHOD(logoutApp){
  [self logout];
}

RCT_EXPORT_METHOD(getUserIdFromNative:(RCTResponseSenderBlock)callback){
  NSString * userid = (NSString *)[[NSUserDefaults standardUserDefaults] objectForKey:USER_LOGIN_SESSION];
  if (userid == nil) {
    userid=@"";
  }
  callback(@[userid]);
}

RCT_EXPORT_METHOD(getUserInfoFromNative:(RCTResponseSenderBlock)callback){
  NSDictionary * userid = (NSDictionary *)[[NSUserDefaults standardUserDefaults] objectForKey:USER_LOGIN_INFO];
  if (userid != nil) {
    callback(@[userid]);
  }
  else
  {
    callback(@[@""]);
  }
  
}

RCT_EXPORT_METHOD(wxLoginWithRespInfo:(NSDictionary * )body callback:(RCTResponseSenderBlock)callback)
{
  @try {
    
    if(body == nil || body.count<=0)
    {
      callback(@[@"cancel"]);
      return;
    }
  
    if(body[@"code"]==nil)
    {
      callback(@[@"cancel"]);
      return;
    }
    AppLogin * app = [[AppLogin alloc]init];
    NSString * codeStr = body[@"code"];
    NSString * grantStr =@"grant_type=authorization_code";
    //通过code获取access_token https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
    NSString * tokenUrl =@"https://api.weixin.qq.com/sns/oauth2/access_token?";
    NSString * tokenUrl1 = [tokenUrl stringByAppendingString:[NSString stringWithFormat:@"appid=%@&",body[@"appid"]]];
    NSString * tokenUrl2 = [tokenUrl1 stringByAppendingString:[NSString stringWithFormat:@"secret=%@&",[self getAppSecret]]];
    NSString * tokenUrl3 = [tokenUrl2 stringByAppendingString:[NSString stringWithFormat:@"code=%@&",codeStr]];
    NSString * tokenUrlend = [tokenUrl3 stringByAppendingString:grantStr];
    NSLog(@"%@",tokenUrlend);
    NSURL *url = [NSURL URLWithString:tokenUrlend];
    
    NSData *responseData = [app getSyn:url];
    if(responseData==nil)
    {
      UIAlertView *av=[[UIAlertView new] initWithTitle:@"Infomation" message:@"Login time out" delegate:nil cancelButtonTitle:@"Cancel" otherButtonTitles:nil, nil];
      [av show];
      return;
    }
    
    NSDictionary * dic =  [NSJSONSerialization JSONObjectWithData:responseData options:0 error:nil];
    NSLog(@"%@",[dic objectForKey:@"access_token"]);
    NSString * access_token     = [dic objectForKey:@"access_token"];
    NSString * openid           = [dic objectForKey:@"openid"];
    //NSString * expires_in       = [dic objectForKey:@"expires_in"];
    //NSString * refresh_token    = [dic objectForKey:@"refresh_token"];
    
    
    NSLog(openid);
    //第三步：通过access_token得到昵称、unionid等信息
    NSString * userfulStr = [NSString stringWithFormat:@"https://api.weixin.qq.com/sns/userinfo?access_token=%@&openid=%@",access_token,openid];
    NSURL * userfulUrl = [NSURL URLWithString:userfulStr];
    
    
    NSData *responseDataUserinfo = [app getSyn:userfulUrl];
    if(responseDataUserinfo==nil)
    {
      UIAlertView *av=[[UIAlertView new] initWithTitle:@"Infomation" message:@"Login time out" delegate:nil cancelButtonTitle:@"Cancel" otherButtonTitles:nil, nil];
      [av show];
      return;
    }
    
    NSMutableDictionary * userInfoDic =  [(NSMutableDictionary *)[NSJSONSerialization JSONObjectWithData:responseDataUserinfo options:0 error:nil] mutableCopy];
    
    NSString *unionid = [userInfoDic objectForKey:@"unionid"];
    
    NSMutableDictionary * wechatDic = [[NSMutableDictionary alloc]init];
    [wechatDic setObject:unionid forKey:@"id"];
    [wechatDic setObject:[userInfoDic objectForKey:@"headimgurl"] forKey:@"headimgurl"];
    [wechatDic setObject:[userInfoDic objectForKey:@"nickname"] forKey:@"nickname"];
    [wechatDic setObject:openid forKey:@"openid"];
    
    if(![self checkIfUserIDExist:openid loginType:SOURCE_WECHAT loginInfo:wechatDic])
    {
      if(![self checkIfUserLinkInfo:wechatDic withSource:SOURCE_WECHAT]){
        
        NSDictionary * loginInfoDic = [[NSDictionary alloc]init];
        
        NSNumber * sex =(NSNumber *)[userInfoDic objectForKey:@"sex"];
        NSString * gender;
        if([sex isEqualToNumber:[NSNumber numberWithInt:1]])
        {
          gender = @"M";
        }
        else
        {
          gender = @"F";
        }
        
        
        loginInfoDic=[self getUserInfoWithEmail:@""
                                       nickname:[userInfoDic objectForKey:@"nickname"]
                                      firstname:@""
                                       lastname:@""
                                         gender:gender
                                         wechat:wechatDic facebook:nil];
        
        [app saveAndPostUserInfo:loginInfoDic withSource:SOURCE_WECHAT];
      }
      
    }
    callback(@[@"success"]);
  }
  @catch (NSException *exception) {
    callback(@[@"error"]);
  }

}

-(BOOL)checkIfUserLinkInfo:(NSDictionary*)infoDic withSource:(NSString*)source{
  
  BOOL result = NO;
  NSMutableDictionary * userInfo =((NSMutableDictionary *)[[NSUserDefaults standardUserDefaults] objectForKey:USER_LOGIN_INFO]).mutableCopy;
  
  if(userInfo != nil){
    if([userInfo objectForKey:source] == nil){
      
      [userInfo setObject:infoDic forKey:source];
      
      [self saveUserDBInfo:userInfo];
      
      result = YES;
    }
    
  }
  return result;
}

-(NSString*)getAppSecret
{
  if([gAppSecret isEqualToString:@""])
  {
    NSArray *list = [[[NSBundle mainBundle] infoDictionary] valueForKey:@"CFBundleURLTypes"];
    for (NSDictionary *item in list) {
      NSString *name = item[@"CFBundleURLName"];
      if ([name isEqualToString:@"weixin"]) {
        NSArray *schemes = item[@"CFBundleURLSchemes"];
        if (schemes.count > 0)
        {
          gAppSecret=schemes[1];
          break;
        }
      }
    }
    return gAppSecret;
  }
  else
  {
    return  gAppSecret;
  }
}

-(BOOL)createUserInfobyOpenID:(NSString *)openid
{
  NSDictionary * userinfo = [NSDictionary dictionaryWithObjectsAndKeys:openid,@"userid",@"",@"password",nil];
  return [[self postSyn:URL_CREATE_USER
               jsonData:[self DataTOjsonString:userinfo]] isEqual:@"1"];
}

-(void)onFaceBookLoginFinish
{
  [self.bridge.eventDispatcher sendAppEventWithName:@"abc123" body:@[@"123"]];
}

-(void)logout
{
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:USER_LOGIN_SESSION];
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:USER_LOGIN_INFO];
//  [[NSUserDefaults standardUserDefaults] setObject:@"" forKey:USER_LOGIN_SESSION];
//  [[NSUserDefaults standardUserDefaults] setObject:@"" forKey:USER_LOGIN_INFO];
}

//-(BOOL)checkIfUserIDExist:(NSString *)openid
//{
//  NSDictionary * userinfo = [NSDictionary dictionaryWithObjectsAndKeys:openid,@"userid",@"",@"password",nil];
//  BOOL result= [[self postSyn:URL_CHECK_EXIST
//                     jsonData:[self DataTOjsonString:userinfo]] isEqual:@"1"];
//  return result;
//}


//Check if this login account resgisted in our server.
//Update the account info and keep the user info in session if exist
-(BOOL)checkIfUserIDExist:(NSString *)userid loginType:(NSString * )loginType loginInfo:(NSDictionary*)loginInfo
{
  BOOL result = NO;
  NSURL * loginURL;
  if([loginType isEqualToString: SOURCE_WECHAT])
  {
    loginURL = [NSURL URLWithString:[URL_CHECK_WECHAT_EXIST stringByAppendingString:userid]];
    
  }
  else if([loginType isEqualToString: SOURCE_FACEBOOK])
  {
    loginURL = [NSURL URLWithString:[URL_CHECK_FACEBOOK_EXIST stringByAppendingString:userid]];
  }
  else
  {
    loginURL = [NSURL URLWithString:[URL_CHECK_LOGINUSER_EXIST stringByAppendingString:userid]];
  }
  
  NSData * responeData = [self getSyn:loginURL];
  
  if(responeData==nil)
  {
    UIAlertView *av=[[UIAlertView new] initWithTitle:@"Infomation" message:@"Login time out" delegate:nil cancelButtonTitle:@"Cancel" otherButtonTitles:nil, nil];
    [av show];
    return NO;
  }
  
  //if exist
  NSArray * userInfoArray =  [(NSArray *)[NSJSONSerialization JSONObjectWithData:responeData options:0 error:nil] mutableCopy];
  NSMutableDictionary * userInfoDic=[[NSMutableDictionary alloc] init];
  
  if (userInfoArray.count>0 && userInfoArray.count==1) {
    userInfoDic = [(NSDictionary *)[userInfoArray objectAtIndex:0] mutableCopy];
  }
  else{
    userInfoDic = [(NSDictionary *)userInfoArray mutableCopy];
  }
  
  //Use the most update info for link account.
  if(loginInfo != nil){
    [userInfoDic setObject:loginInfo forKey:loginType];
  }
  
  if( userInfoDic != nil && userInfoDic.count>0 && [userInfoDic objectForKey:@"_id"])
  {
    [self saveUserDBInfo:userInfoDic];
    [self saveUserLoginSession:[userInfoDic objectForKey:@"_id"]];
      
    result = YES;
  }
  
  
  
  return result;
}

//-(BOOL)checkIfUserIDExistAndSaveInfo:(NSString *)openid
//{
//  if(![openid isEqualToString: @""])
//  {
//    NSString * fileName = [openid stringByAppendingString:@".json"];
//    NSURL * urlfilename = [NSURL URLWithString:[URL_GET_USER stringByAppendingString: fileName]];
//    NSData * responseData = [self getSyn:urlfilename];
//    if (responseData != nil) {
//      NSDictionary * dic = [(NSMutableDictionary *)[NSJSONSerialization JSONObjectWithData:responseData options:0 error:nil] mutableCopy];
//      if(dic != nil && dic.count>0 )
//      {
//        [self saveUserDBInfo:dic];
//        return  true;
//      }
//      else
//      {
//        return false;
//      }
//    }
//    else
//    {
//      return false;
//    }
//    
//  }
//  else
//  {
//    return false;
//  }
//}

//-(BOOL)saveUserInfo:(NSString *)openID jasonData:(NSString *)jsonData
//{
//  return [[self postSyn:URL_CREATE_USER jsonData:jsonData] isEqual:@"1"];
//}

-(BOOL)saveAndPostUserInfo:(NSDictionary *) userinfo withSource:(NSString*)source
{
  NSString * userid;
  if ([source isEqualToString:SOURCE_WECHAT]) {
    userid = [[userinfo objectForKey:SOURCE_WECHAT] objectForKey:@"id"];
  }
  else if([source isEqualToString:SOURCE_FACEBOOK]){
    userid = [[userinfo objectForKey:SOURCE_FACEBOOK] objectForKey:@"id"];
  }
  else if([source isEqualToString:SOURCE_USERLOGIN]){
    userid = [userinfo objectForKey:@"email"];
  }
//  = [userinfo objectForKey:@"userid"];
  [self saveUserLoginSession:userid];
  [self saveUserDBInfo:userinfo];
//  NSData *userinfodic = [NSJSONSerialization dataWithJSONObject:userinfo
//                                                     options:NSJSONWritingPrettyPrinted
//                                                       error:nil];
//  NSString *userinfojson = [[NSString alloc] initWithData:userinfodic encoding:NSUTF8StringEncoding];
  NSRange  range = [[self postSyn:URL_CREATE_USER jsonData:[self DataTOjsonString:userinfo]] rangeOfString:@"User created!"];
  BOOL issave = range.length>0;
  if (issave) {
    [self checkIfUserIDExist:userid loginType:source loginInfo:[userinfo objectForKey:source]];
  }
  return issave;
  
}
-(void)saveUserLoginSession:(NSString *) userid
{
  if(userid != nil)
  {
    
    [[NSUserDefaults standardUserDefaults] setObject:userid forKey:USER_LOGIN_SESSION];
    [[NSUserDefaults standardUserDefaults] synchronize];
  }
}

-(void)saveUserDBInfo:(NSDictionary *) userinfo
{
  @try {
    [[NSUserDefaults standardUserDefaults] setObject:userinfo forKey:USER_LOGIN_INFO];
    [[NSUserDefaults standardUserDefaults] synchronize];
  }
  @catch (NSException *exception) {
    NSLog(exception);
  }

  
}

-(BOOL)isLogin
{
  id userid = [[NSUserDefaults standardUserDefaults] objectForKey:USER_LOGIN_SESSION];
  return  (userid != nil && ![(NSString *)userid isEqualToString: @""]);
 
}

-(NSString*)DataTOjsonString:(id)object
{
  NSString *jsonString = nil;
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object
                                                     options:NSJSONWritingPrettyPrinted // Pass 0 if you don't care about the readability of the generated string
                                                       error:&error];
  if (! jsonData) {
    NSLog(@"Got an error: %@", error);
  } else {
    jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  }
  return jsonString;
}


-(NSData *)getSyn:(NSURL *)urlstr
{
  @try {
    NSMutableURLRequest * request = [[NSMutableURLRequest alloc]initWithURL:urlstr];
    [request setHTTPMethod:@"GET"]; //设置发送方式
    [request setTimeoutInterval: 60000]; //设置连接超时
    //[request setValue:length forHTTPHeaderField:@"Content-Length"]; //设置数据长度
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"]; //设置发送数据的格式
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"]; //设置预期接收数据的格式
    
    NSHTTPURLResponse* urlResponse = nil;
    NSError *error = [[NSError alloc] init] ;
    NSData *responseData = [NSURLConnection sendSynchronousRequest:request
                                                 returningResponse:&urlResponse
                                                             error:&error];
    return responseData;
  }
  @catch (NSException *exception) {
    return nil;
  }
 

}

-(NSDictionary *)getUserInfoWithEmail:(NSString *)email
                        nickname:(NSString *)nickname
                       firstname:(NSString *)firstname
                        lastname:(NSString *)lastname
                          gender:(NSString *)gender
                             wechat:(NSDictionary *)wechat
                           facebook:(NSDictionary *)facebook
{
  NSMutableDictionary * userInfo = [[NSMutableDictionary alloc]init];
  
  if (email != nil) {
    [userInfo setObject:email forKey:@"email"];
  }
  
  if(nickname != nil){
    [userInfo setObject:nickname forKey:@"nickname"];
  }
  
  if (firstname != nil) {
    [userInfo setObject:firstname forKey:@"firstname"];
  }
  
  if (lastname != nil) {
    [userInfo setObject:lastname forKey:@"lastname"];
  }
  
  if (gender != nil) {
    [userInfo setObject:gender forKey:@"gender"];
  }
  
  if (wechat != nil && wechat.count>0) {
    [userInfo setObject:wechat forKey:SOURCE_WECHAT];
  }
  
  if (facebook != nil && facebook.count>0) {
    [userInfo setObject:facebook forKey:SOURCE_FACEBOOK];
  }
  
  
  return userInfo;
}


-(NSString *)postSyn:(NSString *)urlStr jsonData:(NSString *)jsonData{
  NSLog(@"post_begin");
  
  NSData* postData = [jsonData dataUsingEncoding:NSUTF8StringEncoding allowLossyConversion:YES];//数据转码;
  NSString *length = [NSString stringWithFormat:@"%lu", [postData length]];
  
  NSMutableURLRequest* request = [[NSMutableURLRequest alloc]init];
  [request setURL:[NSURL URLWithString:urlStr]]; //设置地址
  [request setHTTPMethod:@"POST"]; //设置发送方式
  [request setTimeoutInterval: 20]; //设置连接超时
  [request setValue:length forHTTPHeaderField:@"Content-Length"]; //设置数据长度
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"]; //设置发送数据的格式
  [request setValue:@"application/json" forHTTPHeaderField:@"Accept"]; //设置预期接收数据的格式
  [request setHTTPBody:postData]; //设置编码后的数据
  
  //发起连接，接受响应
  NSHTTPURLResponse* urlResponse = nil;
  NSError *error = [[NSError alloc] init] ;
  NSData *responseData = [NSURLConnection sendSynchronousRequest:request
                                               returningResponse:&urlResponse
                                                           error:&error];
  NSString *responseString = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding]; //返回数据，转码
  
  NSLog(responseString);
  NSLog(@"post_end");
  return responseString;
}
@end

