import SwiftUI

@objc(NativeListViewManager)
class NativeListViewManager: RCTViewManager {
    override func view() -> UIView! {
        let hostingController = UIHostingController(rootView: NativeListWrapper(items: []))
        return hostingController.view
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

struct NativeListWrapper: View {
    var items: [String] // Dynamiczna lista produktów

    var body: some View {
        List(items, id: \.self) { item in
            Text(item) // Wyświetlanie produktu
        }
    }
}
