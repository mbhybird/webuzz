//
//  AudioHandler.m
//  Webuzz
//
//  Created by BrianLee on 16/5/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AudioHandler.h"
#import "RCTBridge.h"
#import "VoiceConverter.h"



typedef enum : NSInteger {
  
  ConvertFailed = 0 << 0,
  ConvertSuccess = 1 << 1,
  FileExist = 2 << 2
  
} ConvertOptions;

@interface AudioHandler()
  @property (nonatomic, strong) RCTResponseSenderBlock callback;
@end

@implementation AudioHandler

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (instancetype)init
{
  self = [super init];
  if (self) {
    
    [self setAudioSession];
  }
  return self;
}
#pragma mark - 私有方法
/**
 *  设置音频会话
 */
-(void)setAudioSession{
  AVAudioSession *audioSession=[AVAudioSession sharedInstance];
  //设置为播放和录音状态，以便可以在录制完之后播放录音
  [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
  
//  [AVAudioSessionCategoryPlayAndRecord
//  [audioSession setCategory:AVAudioSessionPortOverrideSpeaker error:nil];
  [audioSession overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:nil];
  AudioSessionAddPropertyListener (kAudioSessionProperty_AudioRouteChange,
                                   audioRouteChangeListenerCallback,
                                   CFBridgingRetain(self));
  [audioSession setActive:YES error:nil];
}

void audioRouteChangeListenerCallback (
                                       void                      *inUserData,
                                       AudioSessionPropertyID    inPropertyID,
                                       UInt32                    inPropertyValueSize,
                                       const void                *inPropertyValue
                                       ) {
  if (inPropertyID != kAudioSessionProperty_AudioRouteChange) return;
  // Determines the reason for the route change, to ensure that it is not
  //        because of a category change.
  
  CFDictionaryRef    routeChangeDictionary = inPropertyValue;
  CFNumberRef routeChangeReasonRef =
  CFDictionaryGetValue (routeChangeDictionary,
                        CFSTR (kAudioSession_AudioRouteChangeKey_Reason));
  SInt32 routeChangeReason;
  CFNumberGetValue (routeChangeReasonRef, kCFNumberSInt32Type, &routeChangeReason);
//  NSLog(@" ======================= RouteChangeReason : %d"(int), routeChangeReason);
  if (routeChangeReason == kAudioSessionRouteChangeReason_OldDeviceUnavailable) {
    AVAudioSession *audioSession=[AVAudioSession sharedInstance];
    [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
    [audioSession overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:nil];
  }
}

-(NSString*)getSoundFilePath{
  return [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject] stringByAppendingString:@"/"];
}

/**
 *  取得录音文件保存路径
 *
 *  @return 录音文件路径
 */
-(NSURL *)getSavePath{
  NSString *urlStr= [self getSoundFilePath];
  urlStr=[urlStr stringByAppendingPathComponent:kRecordAudioFile];
  NSLog(@"file path:%@",urlStr);
  NSURL *url=[NSURL fileURLWithPath:urlStr];
  return url;
}

-(NSURL *)getConvertPath{
  NSString *urlStr=[self getSoundFilePath];
  urlStr=[urlStr stringByAppendingPathComponent:kWavAudioFile];
  NSLog(@"file path:%@",urlStr);
  NSURL *url=[NSURL fileURLWithPath:urlStr];
  return url;
}

-(NSURL *)getFilePathWithName:(NSString*)name{
  NSString *urlStr=[self getSoundFilePath];
  urlStr=[urlStr stringByAppendingPathComponent:name];
  NSLog(@"file path:%@",urlStr);
  NSURL *url=[NSURL fileURLWithPath:urlStr];
  return url;
}

/**
 *  取得录音文件设置
 *
 *  @return 录音设置
 */
-(NSDictionary *)getAudioSetting{
  NSMutableDictionary *dicM=[NSMutableDictionary dictionary];
  //设置录音格式
//  [dicM setObject:[NSNumber numberWithInt:kAudioFormatAMR] forKey:AVFormatIDKey];
  [dicM setObject:@(kAudioFormatLinearPCM) forKey:AVFormatIDKey];
  //设置录音采样率，8000是电话采样率，对于一般录音已经够了
  [dicM setObject:@(8000) forKey:AVSampleRateKey];
  //设置通道,这里采用单声道
  [dicM setObject:@(1) forKey:AVNumberOfChannelsKey];
  //每个采样点位数,分为8、16、24、32
  [dicM setObject:@(16) forKey:AVLinearPCMBitDepthKey];
  //是否使用浮点数采样
  [dicM setObject:@(YES) forKey:AVLinearPCMIsFloatKey];
  //....其他设置等
  return dicM;
}

/**
 *  获得录音机对象
 *
 *  @return 录音机对象
 */
-(AVAudioRecorder *)audioRecorder{
  if (!_audioRecorder) {
    //创建录音文件保存路径
    NSURL *url=[self getSavePath];
    //创建录音格式设置
    NSDictionary *setting=[self getAudioSetting];
    //创建录音机
    NSError *error=nil;
    _audioRecorder=[[AVAudioRecorder alloc]initWithURL:url settings:setting error:&error];
    _audioRecorder.delegate=self;
    _audioRecorder.meteringEnabled=YES;//如果要监控声波则必须设置为YES
    if (error) {
      NSLog(@"创建录音机对象时发生错误，错误信息：%@",error.localizedDescription);
      return nil;
    }
  }
  return _audioRecorder;
}

-(AVAudioRecorder *)audioRecorderWithUrl:(NSURL*)url{
//    //创建录音文件保存路径
//    NSURL *url=[self getSavePath];
    //创建录音格式设置
    NSDictionary *setting=[self getAudioSetting];
    //创建录音机
    NSError *error=nil;
    _audioRecorder=[[AVAudioRecorder alloc]initWithURL:url settings:setting error:&error];
    _audioRecorder.delegate=self;
    _audioRecorder.meteringEnabled=YES;//如果要监控声波则必须设置为YES
    if (error) {
      NSLog(@"创建录音机对象时发生错误，错误信息：%@",error.localizedDescription);
      return nil;
    }
  
  return _audioRecorder;
}

/**
 *  创建播放器
 *
 *  @return 播放器
 */
-(AVAudioPlayer *)audioPlayer{
  if (!_audioPlayer) {
    NSURL *url=[self getSavePath];
    NSError *error=nil;
    _audioPlayer=[[AVAudioPlayer alloc]initWithContentsOfURL:url error:&error];
    _audioPlayer.numberOfLoops=0;
    [_audioPlayer prepareToPlay];
    if (error) {
      NSLog(@"创建播放器过程中发生错误，错误信息：%@",error.localizedDescription);
      return nil;
    }
  }
  return _audioPlayer;
}

-(AVAudioPlayer *)audioPlayerWithUrl:(NSURL *)url{
  NSError *error=nil;
  _audioPlayer=[[AVAudioPlayer alloc]initWithContentsOfURL:url error:&error];
  _audioPlayer.numberOfLoops=0;
  [_audioPlayer prepareToPlay];
  if (error) {
    NSLog(@"创建播放器过程中发生错误，错误信息：%@",error.localizedDescription);
    return nil;
  }
  return _audioPlayer;
}

/**
 *  录音声波监控定制器
 *
 *  @return 定时器
 */
-(NSTimer *)timer{
  if (!_timer) {
    _timer=[NSTimer scheduledTimerWithTimeInterval:0.1f target:self selector:@selector(audioPowerChange) userInfo:nil repeats:YES];
  }
  return _timer;
}

/**
 *  录音声波状态设置
 */
-(void)audioPowerChange{
  [self.audioRecorder updateMeters];//更新测量值
  float power= [self.audioRecorder averagePowerForChannel:0];//取得第一个通道的音频，注意音频强度范围时-160到0
  CGFloat progress=(1.0/160.0)*(power+160.0);
//  NSLog(@"ten: %f", progress);
//  [self.audioPower setProgress:progress];
}
#pragma mark - UI事件
/**
 *  点击录音按钮
 *
 *  @param sender 录音按钮
 */

RCT_EXPORT_METHOD(playAudioWithName:(NSString * )audioname){
  NSURL *filePath = [self getFilePathWithName:audioname];
  AVAudioPlayer *audioPlayer = [self audioPlayerWithUrl:filePath];
  if (![audioPlayer isPlaying]) {
    [audioPlayer play];
  }
}

- (void)startRecording{
  
  //create a file name using guid
  NSString *fileName = [[self stringWithUUID] stringByAppendingString:@".wav"];
  
  //get file full path with name
  NSURL *filePath = [self getFilePathWithName:fileName];
  
  //init record with path
  AVAudioRecorder *recorder = [self audioRecorderWithUrl:filePath];
  
  if (![recorder isRecording]) {
    [recorder record];//首次使用应用时如果调用record方法会询问用户是否允许使用麦克风
    self.timer.fireDate=[NSDate distantPast];
  }
  
  
//  if (![self.audioRecorder isRecording]) {
//    [self.audioRecorder record];//首次使用应用时如果调用record方法会询问用户是否允许使用麦克风
//    self.timer.fireDate=[NSDate distantPast];
//  }
}

- (NSString *)startRecordingAndGetName{
  
  //create a file name using guid
  NSString *randomName = [self stringWithUUID];
  NSString *fileName = [randomName stringByAppendingString:@".wav"];
  
  //get file full path with name
  NSURL *filePath = [self getFilePathWithName:fileName];
  
  //init record with path
  AVAudioRecorder *recorder = [self audioRecorderWithUrl:filePath];
  
  if (![recorder isRecording]) {
    [recorder record];//首次使用应用时如果调用record方法会询问用户是否允许使用麦克风
    self.timer.fireDate=[NSDate distantPast];
  }
  
  return randomName;
}

RCT_EXPORT_METHOD(getSoundFileDuration:(NSString*) filename callback:(RCTResponseSenderBlock)callback){
  NSURL *filePath = [self getFilePathWithName:filename];
  AVAudioPlayer *avp = [self audioPlayerWithUrl:filePath];
  NSNumber *duration = [[NSNumber alloc] initWithFloat:avp.duration];
  callback(@[duration]);
}

RCT_EXPORT_METHOD(startRecord:(RCTResponseSenderBlock)callback){
  NSString *fileName = [self startRecordingAndGetName];
  callback(@[fileName]);
}

RCT_EXPORT_METHOD(stopRecord:(RCTResponseSenderBlock)callback){
  [self stopRecording];
  self.callback = callback;
  
}

/* Just for test. See the size of the file. */
RCT_EXPORT_METHOD(getRecordingFileSize:(RCTResponseSenderBlock)callback){
  NSFileManager* manager = [NSFileManager defaultManager];
//  NSString * filePath =[[NSString alloc] initWithContentsOfURL:[self getSavePath]];
  
  NSString *filePath=[self getSoundFilePath];
  filePath=[filePath stringByAppendingPathComponent:kRecordAudioFile];
  
  if ([manager fileExistsAtPath:filePath isDirectory:false]){

    unsigned long long a =[[manager attributesOfItemAtPath:filePath error:nil] fileSize];
    NSNumber * b = [[NSNumber alloc] initWithLongLong:a/1024.0];
//    NSDictionary *dicAttributes =[manager attributesOfItemAtPath:filePath error:nil];
    callback(@[b]);
//    callback(@[[[NSNumber alloc] initWithInt:0]]);
    return;
  }
  callback(@[[[NSNumber alloc] initWithInt:0]]);
//  NSData * audioFile = [NSData dataWithContentsOfFile:filePath];
  
}

/*
 * Play the sound with file url
 */
-(void)playSoundWithURL:(NSURL*)url{
  AVAudioPlayer *player = [self audioPlayerWithUrl:url];
  if (![player isPlaying]) {
    [player play];
  }
}

RCT_EXPORT_METHOD(powerProgress:(RCTResponseSenderBlock)callback){
  [self.audioRecorder updateMeters];//更新测量值
  float power= [self.audioRecorder averagePowerForChannel:0];//取得第一个通道的音频，注意音频强度范围时-160到0
  CGFloat progress=(1.0/160.0)*(power+160.0);
  NSNumber *result = [[NSNumber alloc] initWithFloat:progress];
  callback(@[result]);
}

RCT_EXPORT_METHOD(playSoundWithFileName:(NSString*)filename){
  
  //Get file name
  NSString *filePath = [[self getSoundFilePath] stringByAppendingString:filename];
  NSURL *fileURL = [[NSURL alloc] initWithString:filePath];
  [self playSoundWithURL:fileURL];
}

RCT_EXPORT_METHOD(batchConvertAmrToWav:(NSArray *)amrarr callback:(RCTResponseSenderBlock)callback){
  //amrarr struct is [{amrName:"aaaaa.amr",amrBase64:"odjfkcoa="},{...}...]
  
  //make a mutable copy to add convert status to it
  NSMutableArray *resultArr = [[NSMutableArray alloc]init];
  
  //just for test if ui will be blocked
//  [NSThread sleepForTimeInterval:10.0f];
  
  for (NSMutableDictionary *amrItem in amrarr) {
    
    NSString *fileString =[amrItem objectForKey:@"audio"];
    NSString *fileName = [amrItem objectForKey:@"audioName"];
    
    NSMutableDictionary *resutlItem = amrItem.mutableCopy;
    
    int option = [self convertSoundFileToWavWithBase64:fileString andAmrName:fileName];
    
    if (option==ConvertSuccess) {
      [resutlItem setObject:@"success" forKey:@"convertStatus"];
    }else if(option==ConvertFailed){
      [resutlItem setObject:@"failed" forKey:@"convertStatus"];
    }else if (option==FileExist){
      [resutlItem setObject:@"exist" forKey:@"convertStatus"];
    }
    
    [resultArr addObject:resutlItem];
  }
  
  callback(@[resultArr]);
  
}

RCT_EXPORT_METHOD(createWavFileWith:(NSString*)base64String andName:(NSString*)fileName){
  
  NSString *amrFileName = [fileName stringByAppendingString:@".amr"];
  [self convertSoundFileToWavWithBase64:base64String andAmrName:amrFileName];
  
}


RCT_EXPORT_METHOD(renameAudioFile:(NSString*)currentFileName replaceBy:(NSString*)newFileName){
  NSFileManager* fm = [NSFileManager defaultManager];
  NSString *currentFilePath = [[self getSoundFilePath] stringByAppendingString:currentFileName];
  NSString *newFilePath = [[self getSoundFilePath] stringByAppendingString:newFileName];
  NSString *currentAmrFilePath = [currentFilePath stringByReplacingOccurrencesOfString:@".wav" withString:@".amr"];
  [fm moveItemAtPath:currentFilePath toPath:newFilePath error:nil];
  [fm removeItemAtPath:currentAmrFilePath error:nil];
}

-(int)convertSoundFileToWavWithBase64:(NSString*)filestring andAmrName:(NSString*)name{
  
  @try{
    
    NSFileManager* fm = [NSFileManager defaultManager];
    NSString *amrFilePath = [[self getSoundFilePath] stringByAppendingString:name];
    NSString *wavFilePath = [amrFilePath stringByReplacingOccurrencesOfString:@".amr" withString:@".wav"];
    
    //delete the amr file
    [fm removeItemAtPath:amrFilePath error:nil];
    
    //if wav file exist then do nothing.
    if([self isFileExist:wavFilePath]){
      return FileExist;
    }
    
    //save the amr file to hardisk
    int result;
    NSData *amrFileData = [[NSData alloc] initWithBase64EncodedString:filestring options:0];
    
    if([fm createFileAtPath:amrFilePath contents:amrFileData attributes:nil]){
      
      if([VoiceConverter amrToWav:amrFilePath wavSavePath:wavFilePath]==1){
        
        result = ConvertSuccess;
        
      }else{

        result = ConvertFailed;
        
      }
      
      [fm removeItemAtPath:amrFilePath error:nil];
      
    }else{
      
      result = ConvertFailed;
    }
    
    return result;
    
  }
  @catch(NSException *ex){
    NSLog(@"%@",ex);
    return ConvertFailed;
  }
  
}

-(BOOL)isFileExist:(NSString*)fileURL{
  
  NSFileManager* manager = [NSFileManager defaultManager];
  return  [manager fileExistsAtPath:fileURL isDirectory:false];
}

/**
 *  点击暂定按钮
 *  @param sender 暂停按钮
 */
- (void)pauseRecording {
  if ([self.audioRecorder isRecording]) {
    [self.audioRecorder pause];
    self.timer.fireDate=[NSDate distantFuture];
  }
}

/**
 *  点击恢复按钮
 *  恢复录音只需要再次调用record，AVAudioSession会帮助你记录上次录音位置并追加录音
 *
 *  @param sender 恢复按钮
 */
- (void)resumeRecording {
  [self startRecording];
}

/**
 *  点击停止按钮
 *
 *  @param sender 停止按钮
 */
- (void)stopRecording {
  [self.audioRecorder stop];
  self.timer.fireDate=[NSDate distantFuture];
//  self.audioPower.progress=0.0;
}

#pragma mark - 录音机代理方法
/*
 * When finish recording convert the file to amr
 */
-(void)audioRecorderDidFinishRecording:(AVAudioRecorder *)recorder successfully:(BOOL)flag{
 
  @try {
    //Get amr file base64 encode string
    NSString *fileBase64 = [self convertWavToAmrWithRecorder:recorder];
    
    //this callback now is specially for RCT method stopRecording.
    self.callback(@[fileBase64]);
    
    NSLog(@"录音完成!");
  }
  @catch (NSException *exception) {
    NSLog(@"%@",exception);
  }
}

/*
 * Convert wav file to amr format and do the base64 encodiing.
 */
-(NSString*) convertWavToAmrWithRecorder:(AVAudioRecorder *)recorder{
  
  //get path from record's url
  NSString *filePathWav= recorder.url.absoluteString;
  filePathWav = [filePathWav stringByReplacingOccurrencesOfString:@"file://" withString:@""];
  
  //create amr file path with wav file paht
  NSString *filePathAmr = [filePathWav stringByReplacingOccurrencesOfString:@".wav" withString:@".amr"];
  
  //Convert wav->amr and save
  [VoiceConverter wavToAmr:filePathWav amrSavePath:filePathAmr];
  
  //Get amr file data and encode to base64
  NSURL *fileURLAmr =[[NSURL alloc] initFileURLWithPath:filePathAmr];
  NSData *fileUpload = [[NSData alloc] initWithContentsOfURL:fileURLAmr];
  NSString *fileBase64 = [fileUpload base64EncodedStringWithOptions:0];
  
  return fileBase64;
}

-(NSString*) stringWithUUID {
  CFUUIDRef    uuidObj = CFUUIDCreate(nil);//create a new UUID
  //get the string representation of the UUID
  NSString    *uuidString = (NSString*)CFBridgingRelease(CFUUIDCreateString(nil, uuidObj));
  uuidString = [uuidString stringByReplacingOccurrencesOfString:@"-" withString:@""];
  CFRelease(uuidObj);
  return uuidString;
}

RCT_EXPORT_METHOD(addWaterPrint:(NSString*)base64 callback:(RCTResponseSenderBlock)callback){
  NSString * result = [self addWaterPrintToBase64Image:base64];
  callback(@[result]);
}


- (UIImage *)addImage:(UIImage *)useImage addImage1:(UIImage *)addImage1 image1Width:(float)w image1Height:(float)h
{
  UIGraphicsBeginImageContext(useImage.size);
  [useImage drawInRect:CGRectMake(0, 0, useImage.size.width, useImage.size.height)];
  [addImage1 drawInRect:CGRectMake(useImage.size.width-(w+2.0f), useImage.size.height-(h+2.0f), w, h)];
  UIImage *resultingImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return resultingImage;
}

-(NSString*) addWaterPrintToBase64Image:(NSString*)base64{
  
  NSData *sourceData = [[NSData alloc] initWithBase64EncodedString:base64 options:0];
  UIImage *sourceImage = [[UIImage alloc] initWithData:sourceData];
  
  UIImage *resultImg = [self addImage:sourceImage addImage1:[UIImage imageNamed:@"img-waterprint.png"] image1Width:60.0f image1Height:30.0f];
  
  NSData *result = UIImageJPEGRepresentation(resultImg,1.0);
  return [result base64EncodedStringWithOptions:0];
  
}

@end
