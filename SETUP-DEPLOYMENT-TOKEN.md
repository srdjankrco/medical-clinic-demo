# 🔐 Azure Static Web Apps Deployment Token Setup

**Issue:** GitHub Actions deployment failing with "deployment_token was not provided"  
**Status:** ⚠️ Needs Configuration  
**Date:** October 6, 2025

---

## 🎯 Problem

The GitHub Actions workflow requires an Azure Static Web Apps deployment token to deploy your app, but it's not configured as a GitHub secret.

**Error Message:**
```
deployment_token was not provided.
The deployment_token is required for deploying content.
```

---

## ✅ Solution: Get Your Azure Deployment Token

### Option 1: Get Token from Azure Portal (Recommended)

#### Step 1: Go to Azure Portal
1. Navigate to: https://portal.azure.com
2. Find your Static Web App resource (purple-meadow-0bc882803)

#### Step 2: Get the Deployment Token
1. In your Static Web App, go to **Overview**
2. Click on **"Manage deployment token"** (top menu)
3. Click **"Reset"** or **"Generate new token"**
4. **Copy the token** (it looks like: `0123456789abcdef...`)

⚠️ **Important:** Save this token immediately! You won't be able to see it again.

#### Step 3: Add Token to GitHub Secrets
1. Go to your GitHub repository: https://github.com/srdjankrco/medical-clinic-demo
2. Click **Settings** (top menu)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **"New repository secret"**
5. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
6. Value: Paste the token from Azure Portal
7. Click **"Add secret"**

---

### Option 2: Get Token via Azure CLI

If you have Azure CLI installed:

```powershell
# Login to Azure
az login

# Get your Static Web App details
az staticwebapp list --query "[].{name:name, resourceGroup:resourceGroup}"

# Get the deployment token
az staticwebapp secrets list `
    --name purple-meadow-0bc882803 `
    --resource-group <your-resource-group-name> `
    --query "properties.apiKey" -o tsv
```

Copy the output token and add it to GitHub secrets (Step 3 above).

---

### Option 3: Create New Static Web App (If you don't have one)

If you don't have an Azure Static Web App yet:

#### Using Azure Portal:

1. Go to https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Static Web App"**
4. Click **Create**
5. Fill in:
   - **Subscription:** Your Azure subscription
   - **Resource Group:** Create new or use existing
   - **Name:** medical-clinic-demo
   - **Plan type:** Free
   - **Region:** Choose closest to your users
   - **Deployment details:**
     - Source: **GitHub**
     - Organization: srdjankrco
     - Repository: medical-clinic-demo
     - Branch: development
   - **Build Details:**
     - Build Presets: Custom
     - App location: `/`
     - Output location: `dist`
6. Click **Review + create**
7. Click **Create**

Azure will:
- Create the Static Web App
- Add the deployment token to your GitHub repository automatically
- Create a GitHub Actions workflow file

#### Using Azure CLI:

```powershell
az staticwebapp create `
    --name medical-clinic-demo `
    --resource-group <your-resource-group> `
    --location "East US 2" `
    --source https://github.com/srdjankrco/medical-clinic-demo `
    --branch development `
    --app-location "/" `
    --output-location "dist" `
    --login-with-github
```

---

## 🔧 Update GitHub Workflow (Current Status)

Your workflow file is already configured correctly at:
`.github/workflows/azure-static-web-apps.yml`

It expects the secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`

The workflow will now skip deployment if the token is missing (won't fail the build).

---

## 🧪 Verify Setup

After adding the secret to GitHub:

### 1. Check Secret is Added
1. Go to: https://github.com/srdjankrco/medical-clinic-demo/settings/secrets/actions
2. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` is listed

### 2. Trigger New Deployment
```powershell
# Make a small change or re-run the workflow
cd "c:\Users\SrdjanKrco\OneDrive - DunavNET\DunavNET\Projekti\kiro\Medical Clinic\demo-prototype"

# Option 1: Push a new commit
git commit --allow-empty -m "trigger deployment"
git push origin development

# Option 2: Re-run failed workflow in GitHub Actions UI
```

### 3. Check Deployment
1. Go to: https://github.com/srdjankrco/medical-clinic-demo/actions
2. Wait for workflow to complete (~3-4 minutes)
3. Should show green checkmark ✅

### 4. Test Your App
Open your Azure Static Web App URL and verify it works!

---

## 📋 Quick Checklist

- [ ] **Get Azure deployment token** (from Azure Portal or CLI)
- [ ] **Add token to GitHub Secrets**
  - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
  - Value: Your deployment token
- [ ] **Trigger new deployment** (push commit or re-run workflow)
- [ ] **Verify deployment succeeds** (check GitHub Actions)
- [ ] **Test app** (open Azure URL)

---

## 🔍 Troubleshooting

### Issue: Can't find Static Web App in Azure Portal

**Solution:** You may need to create one first. See "Option 3: Create New Static Web App" above.

### Issue: Don't have access to Azure Portal

**Solution:** Contact your Azure administrator to:
1. Grant you access to the Static Web App resource
2. Or, provide you with the deployment token

### Issue: Token added but still failing

**Possible causes:**
1. Token was copied incorrectly (has extra spaces)
2. Token has expired (regenerate new token)
3. Secret name is wrong (must be exactly: `AZURE_STATIC_WEB_APPS_API_TOKEN`)

**Solution:**
1. Delete the secret in GitHub
2. Get a fresh token from Azure Portal
3. Add it again (ensure no extra spaces)

### Issue: Deployment succeeds but app doesn't work

**Solution:** This is a different issue - see `AZURE-DEPLOYMENT-FIX.md` for MIME type troubleshooting.

---

## 🎯 Alternative: Manual Deployment

If you can't get the GitHub Actions working, you can deploy manually:

### Using Azure CLI:

```powershell
# Build the app
cd "c:\Users\SrdjanKrco\OneDrive - DunavNET\DunavNET\Projekti\kiro\Medical Clinic\demo-prototype"
npm run build

# Deploy
az staticwebapp deploy `
    --name purple-meadow-0bc882803 `
    --resource-group <your-resource-group> `
    --source-location ./dist
```

### Using SWA CLI:

```powershell
# Install SWA CLI (once)
npm install -g @azure/static-web-apps-cli

# Build
npm run build

# Deploy
swa deploy ./dist `
    --app-name purple-meadow-0bc882803 `
    --deployment-token <your-deployment-token>
```

---

## 📚 Additional Resources

### Azure Documentation:
- [Azure Static Web Apps Deployment](https://learn.microsoft.com/en-us/azure/static-web-apps/getting-started)
- [GitHub Actions for Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)
- [Deployment Tokens](https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-token-management)

### GitHub Documentation:
- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Using Secrets in Workflows](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

---

## 📝 Summary

**Current Status:** ⚠️ Deployment token not configured

**Next Steps:**
1. Get deployment token from Azure Portal
2. Add to GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Push commit or re-run workflow
4. Verify deployment succeeds

**Time Required:** 5-10 minutes

---

## ❓ Need Help?

If you're stuck:

1. **Check Azure Portal** - Verify you have a Static Web App resource
2. **Check GitHub Secrets** - Verify token is added correctly
3. **Check GitHub Actions logs** - Look for specific error messages
4. **Use manual deployment** - As a temporary workaround

---

**Once the token is configured, your deployments will work automatically!** 🚀

---

*Setup Guide Generated: October 6, 2025*  
*Issue: Missing deployment token*  
*Solution: Add AZURE_STATIC_WEB_APPS_API_TOKEN secret*
