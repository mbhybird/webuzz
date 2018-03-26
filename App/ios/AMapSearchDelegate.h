//
//  AMapSearchDelegate.h
//  Webuzz
//
//  Created by BrianLee on 16/4/19.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AMapSearchKit/AMapSearchKit.h>
#import "RCTBridgeModule.h"
#import <MapKit/MapKit.h>
@interface AMapSearchDelegate : NSObject<RCTBridgeModule,AMapSearchDelegate>
  
@end
