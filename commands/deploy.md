---
description: Deploy myHealth components (Agent Backend to Fly.io, iOS to TestFlight)
argument-hint: "[component: 'agents', 'ios', 'all'] [environment: 'staging', 'production']"
---

# Deploy myHealth

Deploy myHealth components to their respective platforms.

## Deployment Target

<deploy_args> #$ARGUMENTS </deploy_args>

**Components:**
- `agents` - Agent Backend to Fly.io
- `ios` - iOS App to TestFlight (requires Xcode)
- `all` - Both components

**Environments:**
- `staging` - Pre-production testing
- `production` - Live release

## Agent Backend Deployment (Fly.io)

### Pre-Deploy Checks

```bash
cd agent-backend

# 1. Tests pass
npm test

# 2. Build succeeds
npm run build

# 3. Check current status
fly status -a myhealth-agents

# 4. Review secrets
fly secrets list -a myhealth-agents
```

### Deploy to Fly.io

```bash
# Deploy (uses Dockerfile and fly.toml)
fly deploy -a myhealth-agents

# Watch logs
fly logs -a myhealth-agents

# Verify health
curl https://myhealth-agents.fly.dev/api/health
```

### Post-Deploy Verification

```bash
# Test chat endpoint
curl -X POST https://myhealth-agents.fly.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Check all agents respond
curl https://myhealth-agents.fly.dev/api/health | jq '.agents'
```

### Rollback (if needed)

```bash
# List releases
fly releases -a myhealth-agents

# Rollback to previous
fly releases rollback -a myhealth-agents
```

## iOS App Deployment (TestFlight)

### Pre-Deploy Checks

```bash
cd myhealth-ios

# 1. Build succeeds
xcodebuild -project myHealth.xcodeproj \
  -scheme myHealth \
  -configuration Release \
  -destination generic/platform=iOS \
  build

# 2. Tests pass
xcodebuild test \
  -project myHealth.xcodeproj \
  -scheme myHealth \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro'
```

### Archive and Upload

```bash
# Archive
xcodebuild archive \
  -project myHealth.xcodeproj \
  -scheme myHealth \
  -archivePath ./build/myHealth.xcarchive

# Export for App Store
xcodebuild -exportArchive \
  -archivePath ./build/myHealth.xcarchive \
  -exportPath ./build/Export \
  -exportOptionsPlist ExportOptions.plist

# Upload to TestFlight (requires API key)
xcrun altool --upload-app \
  -f ./build/Export/myHealth.ipa \
  -t ios \
  --apiKey [KEY_ID] \
  --apiIssuer [ISSUER_ID]
```

### TestFlight Notes

After upload, update TestFlight notes with:
- What's new in this build
- Known issues
- Testing focus areas

## Deployment Checklist

### Before Deploy
- [ ] All tests passing
- [ ] .beans for release updated to `done`
- [ ] CHANGELOG updated (if applicable)
- [ ] Version numbers bumped

### Agent Backend
- [ ] `fly deploy` successful
- [ ] Health endpoint responds
- [ ] Chat endpoint responds
- [ ] No errors in `fly logs`

### iOS App
- [ ] Archive builds successfully
- [ ] Upload to TestFlight completes
- [ ] Build appears in App Store Connect
- [ ] TestFlight notes added

### After Deploy
- [ ] Smoke test key features
- [ ] Monitor for errors
- [ ] Update .beans deployment status

## Environment Variables

### Fly.io Secrets (Agent Backend)

```bash
# Set secrets
fly secrets set ANTHROPIC_API_KEY=xxx -a myhealth-agents
fly secrets set SUPABASE_URL=xxx -a myhealth-agents
fly secrets set SUPABASE_SERVICE_KEY=xxx -a myhealth-agents

# List current
fly secrets list -a myhealth-agents
```

### iOS (via Xcode)

- API endpoints configured in Info.plist
- Supabase keys in secure storage
- Use different configs for Debug/Release

## Monitoring

### Agent Backend
```bash
# Live logs
fly logs -a myhealth-agents -f

# Metrics
fly dashboard -a myhealth-agents
```

### iOS
- App Store Connect → TestFlight → Crashes
- App Store Connect → Analytics

## Notifications

After successful deploy, notify:
- Update relevant .beans to reflect deployment
- Log in deployment tracking (if applicable)
