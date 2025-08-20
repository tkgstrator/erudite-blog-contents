---
title: iOSアプリにFirebaseを組み込む話 
date: 2025-08-21
description: FirebaseでiOSアプリの利用者を調査します 
tags: [Swift, Xcode, Firebase]
authors: ['tkgstrator']
---

## 概要

FirebaseのiOS向けSDKをSPMを使って導入した前提で書いています。

まず、デバッグモードを有効にしてログの詳細が見れるようにします。

**Run > Arguments > Arguments Passed On Launch**から`-FIRDebugEnabled`を設定します。

詳しいことは公式ドキュメントの[イベントをデバッグする](https://firebase.google.com/docs/analytics/debugview)に書いてあります。

`-FIRAnalyticsDebugEnabled`これも追加しておいても良いかもしれません。

あと、これも必要かどうかわからないのですが、アプリのビルド設定からリンカーの設定をします。

これも公式ドキュメントの[アプリに Analytics SDK を追加する](https://firebase.google.com/docs/analytics/get-started?hl=ja&platform=ios#add-sdk)に載っています。最初は何もデータが送られてこなかったのですが、これらの設定をつけてアップデートしたらデータがくるようになったので多分必要なのだと思います。

### Firebase Analysis

どのくらいアプリが利用されているか調査するときに使います。

```swift
import Firebase

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        return true
    }
}
```

AppDelegateで`FirebaseApp.configure()`を実行するだけです。

このときユーザーを識別する情報を取ってくるかどうかでまた変わってきます。

#### IDFAを利用する場合

```swift
@main
struct Main: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentIsFirstLaunch()
                .onChange(of: scenePhase, perform: { newPhase in
                    if newPhase == .active {
                        guard ATTrackingManager.trackingAuthorizationStatus == .notDetermined else { return }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                            ATTrackingManager.requestTrackingAuthorization(completionHandler: { _ in
                            })
                        }
                    }
                })
        }
    }
}
```

IDFAを利用する場合にはシーンがアクティブになって、かつ一度もダイアログを出したことがない場合にダイアログを出すようにします。いきなり表示させようとするとシーンの切り替わりと被ってしまうためか、ダイアログが出てこない場合があるので一秒遅延実行するようにしています。

`Info.plist`に`Privacy - Tracking Usage Description`を追加して値に`NSUserTrackingUsageDescription`を設定します。

ここに直接メッセージを書くこともできるのですが、その場合多言語化がめんどくさくなるのでキー名を書きます。

翻訳を反映させるために`InfoPlist.strings`を作成し、

```zsh
/* 
  InfoPlist.strings
  ThunderApp

  Created by devonly on 2025/07/08.
  Copyright © 2025 QuantumLeap. All rights reserved.
  
*/

"NSCameraUsageDescription" = "QRコードを読み取るためにカメラを使います。";
"NSUserTrackingUsageDescription" = "「許可」すると、アプリの利用状況を解析して体験を改善します。";
```

このような感じで書いておきます。

```swift
ATTrackingManager.requestTrackingAuthorization(completionHandler: { _ in
})
```

を呼び出すときに`NSUserTrackingUsageDescription`が定義されていないとアプリがクラッシュするので、書き忘れるということはないと思います。

### Firebase Cloud Messaging

プッシュ通知を送ることができる仕組みです。

FCMを有効にしていると、アプリが立ち上がったときにFCMのトークンを取得するのでそれを自分で管理するサーバーに送信して、ユーザーに対してプッシュ通知を送る感じです。

```swift
import Firebase
import FirebaseMessaging

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()

        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge], completionHandler: { granted, _ in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        })
        Messaging.messaging().delegate = self
        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }
}

extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        #if DEBUG || targetEnvironment(simulator)
        if let fcmToken {
            Logger.debug("FCM Token: \(fcmToken)")
        }
        #endif
    }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound])
    }
}
```

今回の場合にはアプリが起動した直後に通知を許可するかどうかのダイアログを出していますが、ユーザーインタラクティブにしてもいいと思います。

プッシュ通知をする場合には**Signing & Capabilities > Push Notifications**を有効にする必要があります。

また、実際にプッシュ通知を送る場合にはAPNsをApple Developerから発行する必要もあります。

これらについても公式ドキュメントの[Apple プラットフォームで Firebase Cloud Messaging クライアント アプリを設定する](https://firebase.google.com/docs/cloud-messaging/ios/client)に書いてあるので、この通りにやれば問題ないと思います。

### Firebase AppCheck

よくわかっていないのですが、公式ドキュメント[Firebase App Check](https://firebase.google.com/docs/app-check)によると、

> App Check は、未承認のクライアントがバックエンド リソースにアクセスするのを防ぐことで、アプリのバックエンドを不正使用から保護します。Google サービス（Firebase や Google Cloud サービスを含む）と独自のカスタム バックエンドの両方と連携して、リソースを安全に保ちます。

ということなので、実装して損はないと思います。

```swift
import FirebaseAppCheck

class AppCheckReleaseProviderFactory: NSObject, AppCheckProviderFactory {
    func createProvider(with app: FirebaseApp) -> (any AppCheckProvider)? {
        if #available(iOS 14.0, *) {
            return AppAttestProvider(app: app)
        } else {
            return DeviceCheckProvider(app: app)
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        #if DEBUG || targetEnvironment(simulator)
        AppCheck.setAppCheckProviderFactory(AppCheckDebugProviderFactory())
        #else
        AppCheck.setAppCheckProviderFactory(AppCheckReleaseProviderFactory())
        #endif
        FirebaseApp.configure()
        return true
    }
}
```

これで、開発機でもAppCheckをパスできるようになります。

## まとめ

まだまだ、使ってみたいサービスとかがあるので続きを書くことになると思います。