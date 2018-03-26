//
//  AMapSearchDelegate.m
//  Webuzz
//
//  Created by BrianLee on 16/4/19.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AMapSearchDelegate.h"
#import "RCTEventDispatcher.h"
#import "RCTBridge.h"

@implementation AMapSearchDelegate

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;
AMapSearchAPI *_search;

- (instancetype)init
{
  self = [super init];
  [AMapSearchServices sharedServices].apiKey = @"2b9c7cdf85c6a34ae2f3666c8c3fd78d";
  return self;
}

RCT_EXPORT_METHOD(getDriveLineWithOriginLat:(float)originLat
                  originLng:(float)originLng
                  destinationLat:(float)destinationLat
                  destinationLng:(float)destinationLng)
{
  
  _search = [[AMapSearchAPI alloc] init];
  _search.delegate = self;
  AMapDrivingRouteSearchRequest *request = [[AMapDrivingRouteSearchRequest alloc] init];
  
  request.origin = [AMapGeoPoint locationWithLatitude: originLat longitude:originLng];
  request.destination = [AMapGeoPoint locationWithLatitude:destinationLat longitude:destinationLng];
  request.strategy = 2;//距离优先
  request.requireExtension = YES;
  
  //发起路径搜索
  [_search AMapDrivingRouteSearch: request];
}

- (void)onRouteSearchDone:(AMapRouteSearchBaseRequest *)request response:(AMapRouteSearchResponse *)response
{
  if(response.route == nil)
  {
    return;
  }
  
  NSArray * routePaths =  response.route.paths;
  NSMutableArray * result = [[NSMutableArray alloc] init];
  for (AMapPath * path in routePaths) {
    
    int i= 0;
    NSArray * routeSteps = path.steps;
    NSMutableArray * pathArr = [[NSMutableArray alloc] init];
    
    for (AMapStep *step in routeSteps) {
      
      int j = 0;
      NSArray * polylines = [step.polyline componentsSeparatedByString:@";"];
      NSMutableArray *polylinesArr =[[NSMutableArray alloc] init];
      
      for (NSString *polyline in polylines) {
        
        int z=0;
        NSMutableDictionary *lineDic = [[NSMutableDictionary alloc] init];
        NSArray *line =[polyline componentsSeparatedByString:@","];
        
        [lineDic setObject:line[1] forKey:@"latitude"];
        [lineDic setObject:line[0] forKey:@"longitude"];
        [polylinesArr insertObject:lineDic atIndex:z];
        z++;
        
      }
      
      [pathArr insertObject:polylinesArr atIndex:j];
      j++;
    }
    [result insertObject:pathArr atIndex:i];
    i++;
  }
  //通过AMapNavigationSearchResponse对象处理搜索结果
//  NSString *route = [NSString stringWithFormat:@"Navi: %@", response.route];
//  NSLog(@"%@", route);
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"Amap_SearchDone" body:result];
}

RCT_EXPORT_METHOD(getRouteWithOriginLat:(float)originLat
                        originLng:(float)originLng
                   destinationLat:(float)destinationLat
                   destinationLng:(float)destinationLng
                  callback:(RCTResponseSenderBlock)callback
                  )
{
//  CLLocationCoordinate2D * from =CLLocationCoordinate2DMake(originLat,originLng);
//  CLLocationCoordinate2D * to;
//  
//  from->latitude =originLat;
//  from->latitude =originLng;
//  
//  to->latitude =destinationLat;
//  to->latitude =destinationLng;
  
  MKPlacemark *source = [[MKPlacemark alloc]initWithCoordinate:CLLocationCoordinate2DMake(originLat, originLng) addressDictionary:[NSDictionary dictionaryWithObjectsAndKeys:@"",@"", nil] ];
  
  MKMapItem *srcMapItem = [[MKMapItem alloc]initWithPlacemark:source];
  [srcMapItem setName:@""];
  
  MKPlacemark *destination = [[MKPlacemark alloc]initWithCoordinate:CLLocationCoordinate2DMake(destinationLat, destinationLng) addressDictionary:[NSDictionary dictionaryWithObjectsAndKeys:@"",@"", nil] ];
  
  MKMapItem *distMapItem = [[MKMapItem alloc]initWithPlacemark:destination];
  [distMapItem setName:@""];
  
  MKDirectionsRequest *request = [[MKDirectionsRequest alloc]init];
  
  [request setSource:srcMapItem];
  [request setDestination:distMapItem];
  [request setTransportType:MKDirectionsTransportTypeAutomobile];
  
  MKDirections *direction = [[MKDirections alloc]initWithRequest:request];
  
  [direction calculateDirectionsWithCompletionHandler:^(MKDirectionsResponse *response, NSError *error) {
    
    NSLog(@"response = %@",response);
    NSArray *arrRoutes = [response routes];
    callback(arrRoutes);
  }];

}



@end
