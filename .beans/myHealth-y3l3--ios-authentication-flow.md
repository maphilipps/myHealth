---
title: 'iOS: Authentication Flow'
status: todo
type: feature
priority: high
tags:
    - ios
    - auth
created_at: 2025-12-15T20:51:51Z
updated_at: 2025-12-15T20:51:51Z
links:
    - parent: myHealth-mudp
---

## Beschreibung
Native iOS Authentication mit SwiftUI.

## Screens
1. Welcome/Onboarding
2. Login (Email/Password)
3. Registration
4. Forgot Password
5. Email Verification Pending

## Features
- Biometric Login (Face ID/Touch ID)
- Keychain Token Storage
- Auto-Login
- Logout

## SwiftUI Views
```swift
struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()
    
    var body: some View {
        VStack {
            TextField("Email", text: $viewModel.email)
            SecureField("Password", text: $viewModel.password)
            Button("Login") { viewModel.login() }
            
            // Social Login
            SignInWithAppleButton(...)
        }
    }
}
```

## Definition of Done
- [ ] Login/Register Screens
- [ ] Biometric Auth
- [ ] Keychain Storage
- [ ] Error Handling