//
//  AppLogin.h
//  ArtsBuzzV2
//
//  Created by BrianLee on 16/2/18.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"
@interface AppLogin : NSObject<RCTBridgeModule>
-(NSString *)postSyn:(NSString *)urlStr jsonData:(NSString *)jsonData;
//-(BOOL)saveUserInfo:(NSString *)openID jasonData:(NSString *)jsonData;
-(BOOL)saveAndPostUserInfo:(NSDictionary *) userinfo withSource:(NSString*)source;
//-(BOOL)checkIfUserIDExist:(NSString *)openid;
-(NSData *)getSyn:(NSURL *)urlstr;
-(void)logout;
-(void)saveUserLoginSession:(NSString *) userid;
-(void)onFaceBookLoginFinish;
-(BOOL)checkIfUserIDExist:(NSString *)userid loginType:(NSString * )loginType loginInfo:(NSDictionary*)loginInfo;
-(BOOL)isLogin;
-(BOOL)checkIfUserLinkInfo:(NSDictionary*)infoDic withSource:(NSString*)source;

-(NSDictionary *)getUserInfoWithEmail:(NSString *)email
                             nickname:(NSString *)nickname
                            firstname:(NSString *)firstname
                             lastname:(NSString *)lastname
                               gender:(NSString *)gender
                               wechat:(NSDictionary *)wechat
                             facebook:(NSDictionary *)facebook;

@end

@interface Wechat : NSObject
@property (nonatomic, retain) NSString* ID;
@property (nonatomic, retain) NSString* headimgurl;
@end

@interface Facebook : NSObject
@property (nonatomic, retain) NSString* ID;
@end