# 🚀 Deploy Now - Step by Step

## Prerequisites Check

Do you have:
- [ ] Azure account ([Get free account](https://azure.microsoft.com/free/))
- [ ] GitHub account ([Sign up](https://github.com/signup))
- [ ] Git installed ([Download](https://git-scm.com/downloads))

---

## 🎯 Deployment in 3 Steps

### **Step 1: Test Build Locally (2 minutes)**

Open PowerShell in the `demo-prototype` folder and run:

```powershell
.\deploy.ps1
```

This will:
1. Install dependencies
2. Build the project
3. Start preview server at `http://localhost:4173`

**Test it works, then press Ctrl+C to stop.**

---

### **Step 2: Push to GitHub (3 minutes)**

#### If you DON'T have a GitHub repo yet:

1. Go to [GitHub](https://github.com/new)
2. Create new repository:
   - Name: `medical-clinic-demo`
   - Public or Private: Your choice
   - Don't initialize with README
3. Click **Create repository**

#### Then run these commands in PowerShell:

```powershell
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Medical Clinic Management System - Demo Prototype"

# Add your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/medical-clinic-demo.git

# Push to GitHub
git push -u origin main
```

**If it asks for login:** Use your GitHub username and a [Personal Access Token](https://github.com/settings/tokens)

---

### **Step 3: Deploy to Azure (5 minutes)**

#### Option A: Via Azure Portal (Easiest)

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in with your Microsoft account

2. **Create Static Web App**
   - Click **"Create a resource"** (top left)
   - Search: **"Static Web Apps"**
   - Click **Create**

3. **Fill in the form:**

   **Basics:**
   - Subscription: Select yours
   - Resource Group: Click **"Create new"** → Name: `medical-clinic-rg`
   - Name: `medical-clinic-demo`
   - Plan type: **Free**
   - Region: Select closest to you (e.g., Central US, West Europe)
   
   **Deployment:**
   - Source: **GitHub**
   - Click **"Sign in with GitHub"**
   - Authorize Azure Static Web Apps
   
   **Select your repo:**
   - Organization: Your GitHub username
   - Repository: `medical-clinic-demo`
   - Branch: `main`
   
   **Build Details:**
   - Build Presets: **Custom**
   - App location: `/demo-prototype`
   - Api location: *(leave empty)*
   - Output location: `dist`

4. **Deploy**
   - Click **"Review + create"**
   - Click **"Create"**
   - Wait 2-5 minutes ⏱️

5. **Get Your URL**
   - Once deployment completes, click **"Go to resource"**
   - You'll see your URL like: `https://happy-beach-12345.azurestaticapps.net`
   - Click it to view your live demo! 🎉

#### Option B: Via Azure CLI (For Advanced Users)

```bash
# Install Azure CLI first
# https://aka.ms/installazurecli

# Login
az login

# Create resource group
az group create --name medical-clinic-rg --location centralus

# Create Static Web App
az staticwebapp create \
  --name medical-clinic-demo \
  --resource-group medical-clinic-rg \
  --source https://github.com/YOUR_USERNAME/medical-clinic-demo \
  --location centralus \
  --branch main \
  --app-location "/demo-prototype" \
  --output-location "dist" \
  --login-with-github
```

---

## ✅ After Deployment

Once deployed, you'll have:

- **Production URL:** `https://[your-app].azurestaticapps.net`
- **Auto-deployments:** Every git push triggers new deployment
- **Free SSL:** HTTPS enabled automatically
- **Global CDN:** Fast worldwide access

### Test Your Live Demo:

1. Visit your Azure URL
2. Click through all pages
3. Test patient registration
4. Check appointment calendar
5. View reports
6. Check compliance pages

---

## 🔄 To Update Later

Just push to GitHub:

```powershell
# Make changes to code
# Then:
git add .
git commit -m "Update demo"
git push

# Azure will auto-deploy in 2-3 minutes
```

---

## 🆘 Troubleshooting

### Build Fails in Azure

**Check GitHub Actions:**
1. Go to your GitHub repo
2. Click **"Actions"** tab
3. Click the failed workflow
4. Read the error log

**Common fixes:**
- Make sure `demo-prototype` folder is at repo root
- Verify package.json exists in demo-prototype folder
- Check all dependencies are listed

### Can't Push to GitHub

**If it says "rejected":**
```powershell
git pull origin main --rebase
git push
```

**If it asks for password:**
- Don't use your GitHub password
- Create a Personal Access Token: https://github.com/settings/tokens
- Use token as password

### Azure Portal Issues

**Can't create Static Web App:**
- Make sure you have an active Azure subscription
- Try a different region
- Check you're signed in

**Can't connect to GitHub:**
- Authorize Azure in GitHub settings
- Try signing out and back in

---

## 📞 Need Help?

1. **Check logs:**
   - GitHub: Actions tab
   - Azure: Static Web App → Deployment History

2. **Full documentation:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide

3. **Test locally first:**
   - Run `.\deploy.ps1` to verify build works

---

## 🎯 Quick Checklist

Before deploying:
- [ ] Code builds locally (`npm run build` works)
- [ ] Preview looks good (`npm run preview`)
- [ ] Code pushed to GitHub
- [ ] Azure account ready
- [ ] GitHub and Azure connected

During deployment:
- [ ] Created Azure Static Web App
- [ ] Connected to GitHub repo
- [ ] Build settings correct (`/demo-prototype` and `dist`)
- [ ] Deployment succeeded (check GitHub Actions)

After deployment:
- [ ] URL accessible
- [ ] All pages work
- [ ] No console errors
- [ ] Demo ready to share!

---

**Ready? Start with Step 1!** 🚀
