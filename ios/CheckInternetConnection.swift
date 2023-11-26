//
//  CheckInternetConnection.swift
//  cafbridge_faceliveness
//
//  Created by Lorena Zanferrari on 26/11/23.
//

import Network

class CheckInternetConnection {
  static let shared = CheckInternetConnection()
  
  public let monitor = NWPathMonitor()
  
  private init() {
    monitor.pathUpdateHandler = { path in
      if path.status == .satisfied {
        print("Internet is available")
      } else {
        print("No internet connection")
      }
    }
    
    let queue = DispatchQueue(label: "NetworkMonitor")
    monitor.start(queue: queue)
  }
  
  deinit {
    monitor.cancel()
  }
}
