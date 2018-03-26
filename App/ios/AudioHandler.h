//
//  AudioHandler.h
//  Webuzz
//
//  Created by BrianLee on 16/5/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "RCTBridgeModule.h"


#define kRecordAudioFile @"myRecord.wav"
#define kSaveAudioFile @"mySave.amr"
#define kWavAudioFile @"myConvert.wav"
//#define kRecordAudioFile @"myRecord.caf"

@interface AudioHandler : NSObject<RCTBridgeModule,AVAudioRecorderDelegate>
@property (nonatomic,strong) AVAudioRecorder *audioRecorder;//音频录音机
@property (nonatomic,strong) AVAudioPlayer *audioPlayer;//音频播放器，用于播放录音文件
@property (nonatomic,strong) NSTimer *timer;//录音声波监控（注意这里暂时不对播放进行监控）

@end
