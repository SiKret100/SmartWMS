#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(NativeListViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(items, NSArray) // Deklaracja props `items` jako tablicy
@end
