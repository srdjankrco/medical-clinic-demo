# ⚠️ Deployment Token Required

**Status:** Deployment failing - Missing Azure token  
**Date:** October 6, 2025

---

## 🎯 What Happened

Your deployment to Azure Static Web Apps is failing because the GitHub Actions workflow needs an Azure deployment token, but it hasn't been configured yet.

**Error:**
```
deployment_token was not provided.
The deployment_token is required for deploying content.
```

---

## ✅ How to Fix (3 Steps - 5 minutes)

### Step 1: Get Your Azure Deployment Token

**Go to Azure Portal:**
1. Visit: https://portal.azure.com
2. Find your Static Web App: **purple-meadow-0bc882803**
3. Click **"Manage deployment token"** (top menu)
4. Click **"Reset"** or **"Generate new token"**
5. **Copy the token** (save it immediately!)

### Step 2: Add Token to GitHub

**Go to GitHub Secrets:**
1. Visit: https://github.com/srdjankrco/medical-clinic-demo/settings/secrets/actions
2. Click **"New repository secret"**
3. **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. **Value:** Paste the token from Azure
5. Click **"Add secret"**

### Step 3: Trigger Deployment

```powershell
cd "c:\Users\SrdjanKrco\OneDrive - DunavNET\DunavNET\Projekti\kiro\Medical Clinic\demo-prototype"

# Push to trigger deployment
git push origin development

# OR re-run the failed workflow in GitHub Actions UI
```

---

## 📚 Detailed Guide

See **SETUP-DEPLOYMENT-TOKEN.md** for:
- Detailed step-by-step instructions
- Alternative methods (Azure CLI)
- Troubleshooting guide
- Manual deployment options

---

## 🔍 Quick Checklist

- [ ] Get deployment token from Azure Portal
- [ ] Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to GitHub Secrets
- [ ] Push commit or re-run workflow
- [ ] Verify deployment succeeds (green ✓)
- [ ] Test app on Azure URL

---

## 📝 What's Already Done

✅ **Code Fix Complete:**
- ✅ Fixed `staticwebapp.config.json` - MIME types corrected
- ✅ Updated GitHub Actions workflow
- ✅ Documentation created

⚠️ **What's Missing:**
- [ ] Azure deployment token in GitHub Secrets

---

## 🚀 After Adding Token

Once you add the token and push:

1. **GitHub Actions will run** (~3-4 minutes)
2. **App will deploy to Azure** automatically
3. **MIME type fix will be applied** ✅
4. **App will work correctly** ✅

---

## 💡 Alternative: Manual Deployment

If you can't get the token right now, you can deploy manually:

```powershell
# Build locally
npm run build

# Deploy via Azure CLI (if installed)
az staticwebapp deploy `
    --name purple-meadow-0bc882803 `
    --resource-group <your-resource-group> `
    --source-location ./dist
```

---

## 📞 Need Help?

**Can't find Static Web App in Azure?**
- You may need to create one first
- See SETUP-DEPLOYMENT-TOKEN.md for instructions

**Don't have Azure Portal access?**
- Contact your Azure administrator
- They can provide the deployment token

**Token added but still failing?**
- Verify token has no extra spaces
- Check secret name is exactly: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- Try regenerating the token

---

## 🎉 Once Fixed

After adding the token, your deployment will work automatically every time you push to the `development` or `main` branch!

**Next push will:**
1. ✅ Build your app
2. ✅ Deploy to Azure
3. ✅ Apply the MIME type fix
4. ✅ Make your app accessible

---

**Time to fix:** ~5 minutes  
**Detailed guide:** See SETUP-DEPLOYMENT-TOKEN.md

---

*Quick Reference Guide*  
*For full details, see: SETUP-DEPLOYMENT-TOKEN.md*
