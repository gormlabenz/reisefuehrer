platform :ios, '11.0'
use_frameworks!
project: 'App.xcodeproj'

# workaround to avoid Xcode caching of Pods that requires
# Product -> Clean Build Folder after new Cordova plugins installed
# Requires CocoaPods 1.6 or newer
install! 'cocoapods', :disable_input_output_paths => true

def capacitor_pods
  # Automatic Capacitor Pod dependencies, do not delete
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'
  pod 'CordovaPlugins', :path => '../capacitor-cordova-ios-plugins'
  # Do not delete
end

target 'App' do
  capacitor_pods
  # Add your Pods here
end
