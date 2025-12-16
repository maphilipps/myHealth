---
title: 'iOS: Sign in with Apple'
status: done
type: feature
priority: high
tags:
    - ios
    - auth
created_at: 2025-12-15T20:51:52Z
updated_at: 2025-12-16T09:30:00Z
links:
    - parent: myHealth-mudp
---

## Beschreibung
Apple Sign In Integration (App Store Requirement).

## Requirements
- Apple Developer Account
- Sign in with Apple Capability
- Server-side Token Validation

## Implementation
```swift
import AuthenticationServices

struct AppleSignInButton: View {
    var body: some View {
        SignInWithAppleButton(.signIn) { request in
            request.requestedScopes = [.fullName, .email]
        } onCompletion: { result in
            switch result {
            case .success(let auth):
                handleAuthorization(auth)
            case .failure(let error):
                handleError(error)
            }
        }
    }
}
```

## Definition of Done
- [ ] Apple Sign In Button
- [ ] Server Token Validation
- [ ] Account Linking
- [ ] App Store Compliance
- [ ] `/code-review:code-review` ausführen