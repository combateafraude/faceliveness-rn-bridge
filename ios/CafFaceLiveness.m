//
//  CafFaceLiveness.m
//  cafbridge_faceliveness
//
//  Created by Lorena Zanferrari on 20/11/23.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(CafFaceLiveness, RCTEventEmitter)
    RCT_EXTERN_METHOD(faceLiveness:(NSString *)token personId:(NSString *)personId config:(NSString *)config)
@end
