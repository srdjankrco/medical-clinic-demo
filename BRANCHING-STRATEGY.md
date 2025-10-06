# 🌿 Branching & Deployment Strategy

**Current Setup:** Development branch deploys to Azure  
**Date:** October 6, 2025

---

## 📊 Current Configuration

### **Active Branch: `development`**
- ✅ All active development happens here
- ✅ Deploys automatically to Azure on push
- ✅ Contains the latest MIME type fix
- ✅ Ready for testing

### **Branch: `main`**
- ⚠️ Currently behind remote (has conflicts)
- ⚠️ Does NOT trigger deployments
- 📋 Will be synced later when stable

---

## 🚀 Deployment Flow

```
┌─────────────────┐
│   development   │  ← Active development branch
│   branch        │
└────────┬────────┘
         │
         │ git push origin development
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │  ← Builds and deploys
│   Workflow      │
└────────┬────────┘
         │
         │ Deploys to...
         │
         ▼
┌─────────────────┐
│ Azure Static    │  ← Production site
│   Web App       │     purple-meadow-0bc882803
└─────────────────┘
```

---

## 📋 Workflow Triggers

### **Push to `development`:**
```yaml
on:
  push:
    branches:
      - development
```

**What happens:**
1. ✅ GitHub Actions runs
2. ✅ Installs dependencies (`npm install`)
3. ✅ Builds app (`npm run build`)
4. ✅ Deploys to Azure Static Web Apps
5. ✅ Updates live site (~3-4 minutes)

### **Pull Request to `development`:**
```yaml
pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - development
```

**What happens:**
1. ✅ Creates preview deployment
2. ✅ Tests changes in isolation
3. ✅ Provides unique URL for testing
4. ✅ Closes preview when PR merged/closed

---

## 🔄 Development Workflow

### **Day-to-Day Development:**

```powershell
# 1. Make changes in demo-prototype
cd "c:\Users\SrdjanKrco\OneDrive - DunavNET\DunavNET\Projekti\kiro\Medical Clinic\demo-prototype"

# 2. Test locally
npm run dev  # or npm run build && npm run preview

# 3. Commit changes
git add .
git commit -m "feat: your changes"

# 4. Push to deploy
git push origin development

# 5. Wait ~3-4 minutes for deployment
# 6. Test on Azure URL
```

---

## 🎯 When to Use Each Branch

### **`development` Branch**
**Use for:**
- ✅ Active feature development
- ✅ Bug fixes
- ✅ Testing new features
- ✅ Quick iterations
- ✅ Client demos (latest features)

**Benefits:**
- Fast feedback cycle
- Immediate deployment
- Easy to test changes

### **`main` Branch** (Future Use)
**Use for:**
- ✅ Stable releases
- ✅ Production-ready code
- ✅ Tagged versions
- ✅ Long-term support

**When to merge to `main`:**
- After thorough testing on `development`
- When ready for stable release
- Before major client presentations
- When tagging versions

---

## 🔀 Syncing Branches (Later)

When `development` is stable and you want to update `main`:

### **Option 1: Merge Development into Main**
```powershell
git checkout main
git pull origin main  # Get latest remote changes
git merge development  # Merge development
git push origin main
```

### **Option 2: Reset Main to Development** (if main is broken)
```powershell
git checkout main
git reset --hard development
git push origin main --force  # ⚠️ Force push (use with caution)
```

### **Option 3: Create Pull Request** (Recommended for teams)
```powershell
# Push development
git push origin development

# Then on GitHub:
# 1. Go to repository
# 2. Click "Pull Requests"
# 3. Click "New Pull Request"
# 4. Base: main, Compare: development
# 5. Review changes
# 6. Merge when ready
```

---

## 🌐 Multiple Environments (Future Enhancement)

If you want separate staging and production:

### **Setup:**
1. Create two Azure Static Web Apps:
   - `medical-clinic-staging` (for development branch)
   - `medical-clinic-production` (for main branch)

2. Update workflow:
```yaml
on:
  push:
    branches:
      - main         # → Production
      - development  # → Staging
      
jobs:
  deploy_staging:
    if: github.ref == 'refs/heads/development'
    # Deploy to staging Azure app
    
  deploy_production:
    if: github.ref == 'refs/heads/main'
    # Deploy to production Azure app
```

3. Benefits:
   - ✅ Test in staging before production
   - ✅ Separate URLs for each environment
   - ✅ No risk to production
   - ✅ Can test with real Azure environment

---

## 📊 Current Status

| Branch | Status | Deploys? | Purpose |
|--------|--------|----------|---------|
| `development` | ✅ Active | ✅ Yes | Active development |
| `main` | ⚠️ Conflicts | ❌ No | Stable releases (future) |

---

## 🎯 Next Steps

### **Immediate (Now):**
1. ✅ Continue developing on `development` branch
2. ✅ Push changes → automatic deployment
3. ✅ Test on Azure URL

### **Soon (After Testing):**
1. Sync `main` branch with `development`
2. Update `main` to be stable
3. Decide on branching strategy (current vs. gitflow)

### **Future (Optional):**
1. Set up separate staging/production environments
2. Add environment-specific configurations
3. Implement PR-based workflow for `main`

---

## 🔍 Why This Strategy?

### **Current Situation:**
- ✅ You have fixes ready on `development`
- ✅ Need fast deployment to test
- ✅ `main` has conflicts to resolve
- ✅ Single Azure Static Web App

### **This Strategy:**
- ✅ Deploys working code immediately
- ✅ Avoids merge conflicts for now
- ✅ Allows rapid testing and iteration
- ✅ Simple and straightforward

### **Later You Can:**
- Implement proper gitflow
- Add staging environment
- Set up protected branches
- Add code review process

---

## 📚 Git Workflow Patterns

### **Current: Simple Development Flow**
```
development → push → deploy
```

### **Future Option 1: Main as Stable**
```
development → test → merge to main → deploy
```

### **Future Option 2: GitFlow**
```
feature/* → development → release → main → deploy
```

### **Future Option 3: Trunk-Based**
```
feature/* → main (with feature flags) → deploy
```

---

## 📝 Summary

**Current Setup:**
- ✅ `development` branch deploys to Azure automatically
- ✅ Fast deployment cycle for testing
- ✅ Single command: `git push origin development`
- ✅ Perfect for active development phase

**Remember:**
- Every push to `development` = Deployment
- Takes ~3-4 minutes to go live
- Test locally first with `npm run build && npm run preview`

---

## 🎉 Benefits of Current Setup

1. **Fast Iteration** - Push and see changes in minutes
2. **Simple** - One branch, one deployment
3. **No Conflicts** - Avoiding `main` branch issues for now
4. **Flexible** - Can change strategy later
5. **Testable** - Real Azure environment

---

**Your current deployment strategy is optimal for the development phase!** 🚀

When you're ready for production stability, we can add:
- Protected main branch
- Code review process
- Staging environment
- Release tagging

---

*Branching Strategy Document*  
*Updated: October 6, 2025*  
*Current Branch: development*  
*Deployment: Automatic on push*
