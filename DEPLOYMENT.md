# Deployment Guide - Azure Static Web Apps

## Prerequisites

- Azure subscription
- GitHub account
- Git installed locally

## Option 1: Deploy via Azure Portal (Recommended for First Time)

### Step 1: Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource**
3. Search for **Static Web Apps**
4. Click **Create**

### Step 2: Configure Basic Settings

**Basics Tab:**
- **Subscription:** Select your subscription
- **Resource Group:** Create new or select existing (e.g., `medical-clinic-rg`)
- **Name:** `medical-clinic-demo` (or your preferred name)
- **Plan type:** Free (for demo) or Standard (for production)
- **Region:** Choose closest to your users
- **Deployment source:** GitHub

### Step 3: Connect to GitHub

1. Click **Sign in with GitHub**
2. Authorize Azure Static Web Apps
3. Select:
   - **Organization:** Your GitHub username/org
   - **Repository:** Your repository name
   - **Branch:** `main` (or your main branch)

### Step 4: Build Configuration

**Build Details:**
- **Build Presets:** Custom
- **App location:** `/demo-prototype`
- **Api location:** (leave empty)
- **Output location:** `dist`

### Step 5: Review and Create

1. Click **Review + create**
2. Review settings
3. Click **Create**

Azure will:
- Create the Static Web App resource
- Create a GitHub Actions workflow in your repository
- Trigger the first deployment automatically

### Step 6: Get the URL

1. Once deployment completes, go to your Static Web App resource
2. The **URL** will be displayed (e.g., `https://happy-beach-xxxxx.azurestaticapps.net`)
3. Click the URL to view your deployed app

---

## Option 2: Deploy via Azure CLI

### Prerequisites
```bash
# Install Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure
az login

# Install Static Web Apps extension
az extension add --name staticwebapp
```

### Deploy
```bash
# Set variables
RESOURCE_GROUP="medical-clinic-rg"
LOCATION="centralus"
APP_NAME="medical-clinic-demo"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Static Web App
az staticwebapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location $LOCATION \
  --branch main \
  --app-location "/demo-prototype" \
  --output-location "dist" \
  --login-with-github
```

---

## Option 3: Manual Deployment (No GitHub)

### Step 1: Build the Application

```bash
cd demo-prototype
npm install
npm run build
```

This creates a `dist` folder with the production build.

### Step 2: Deploy Using SWA CLI

```bash
# Install SWA CLI globally
npm install -g @azure/static-web-apps-cli

# Login to Azure
swa login

# Deploy
swa deploy ./dist \
  --app-name medical-clinic-demo \
  --resource-group medical-clinic-rg \
  --env production
```

---

## GitHub Actions Workflow (Automatic)

The deployment includes a GitHub Actions workflow at `.github/workflows/azure-static-web-apps.yml`.

### Workflow Triggers

- **Push to main branch** → Automatic deployment
- **Pull Request** → Creates preview environment
- **PR Closed** → Removes preview environment

### Workflow Configuration

Already configured with:
- ✅ Build command: `npm run build`
- ✅ App location: `/demo-prototype`
- ✅ Output location: `dist`
- ✅ Node version: Latest LTS

---

## Configuration Files

### staticwebapp.config.json

Located in `demo-prototype/staticwebapp.config.json`

**Features:**
- ✅ SPA routing (all routes redirect to index.html)
- ✅ 404 handling
- ✅ Cache headers for static assets
- ✅ MIME type configuration

**No changes needed** - already configured for React Router.

---

## Post-Deployment Steps

### 1. Verify Deployment

Visit your Static Web App URL and test:
- [ ] Dashboard loads
- [ ] All navigation works
- [ ] Patient list displays
- [ ] Forms work
- [ ] Charts render
- [ ] No console errors

### 2. Configure Custom Domain (Optional)

1. Go to Azure Portal → Your Static Web App
2. Click **Custom domains**
3. Click **Add**
4. Enter your domain name
5. Follow DNS configuration instructions

### 3. Set Up Environment Variables (If Needed)

1. Go to Azure Portal → Your Static Web App
2. Click **Configuration**
3. Add environment variables if needed (none required for demo)

### 4. Enable Application Insights (Optional)

1. Go to Azure Portal → Your Static Web App
2. Click **Application Insights**
3. Click **Enable**
4. Select or create Application Insights resource

---

## Updating the Deployment

### Via Git Push
```bash
git add .
git commit -m "Update demo"
git push origin main
```

GitHub Actions will automatically rebuild and deploy.

### Via Manual Build
```bash
cd demo-prototype
npm run build
swa deploy ./dist --app-name medical-clinic-demo
```

---

## Troubleshooting

### Build Fails

**Check:**
1. All dependencies in package.json
2. Node version compatibility
3. Build logs in GitHub Actions

**Solution:**
```bash
# Test build locally first
cd demo-prototype
npm install
npm run build
```

### App Shows Blank Page

**Check:**
1. Browser console for errors
2. Network tab for 404s
3. staticwebapp.config.json is in dist folder

**Solution:**
Ensure `staticwebapp.config.json` is in the root of demo-prototype (it will be copied to dist during build).

### Routing Not Working

**Check:**
- staticwebapp.config.json has correct rewrite rules

**Solution:**
The provided config already handles SPA routing correctly.

### Build Takes Too Long

**Optimization:**
1. Use npm ci instead of npm install (faster)
2. Enable caching in GitHub Actions
3. Consider upgrading to Standard plan

---

## Monitoring

### GitHub Actions

- View deployment status: Repository → Actions tab
- Check build logs for errors
- Monitor deployment time

### Azure Portal

- View metrics: Static Web App → Metrics
- Check logs: Static Web App → Log stream
- Monitor usage: Static Web App → Usage

### Application Insights (If Enabled)

- Performance metrics
- User analytics
- Error tracking
- Custom events

---

## Cost Estimation

### Free Tier
- **Cost:** $0/month
- **Bandwidth:** 100 GB/month
- **Custom domains:** 2
- **SSL:** Included
- **Suitable for:** Demo, small projects

### Standard Tier
- **Cost:** ~$9/month
- **Bandwidth:** Unlimited
- **Custom domains:** Unlimited
- **SLA:** 99.95%
- **Suitable for:** Production

---

## Security

### Included Features
- ✅ Free SSL certificates
- ✅ DDoS protection
- ✅ Global CDN
- ✅ Automatic HTTPS redirect

### Additional Security
1. Enable authentication (Azure AD B2C)
2. Set up custom headers
3. Configure CORS if needed
4. Enable Web Application Firewall (WAF)

---

## Backup & Rollback

### Rollback to Previous Version

1. Go to GitHub → Actions
2. Find successful previous deployment
3. Re-run the workflow

**Or via CLI:**
```bash
git revert HEAD
git push origin main
```

### Backup Strategy

- GitHub repository is your backup
- All code versioned in Git
- Can redeploy anytime from any commit

---

## URLs After Deployment

### Automatic URLs
- **Production:** `https://[app-name]-[hash].azurestaticapps.net`
- **PR Preview:** `https://[app-name]-[hash]-[pr-number].azurestaticapps.net`

### Custom Domain
- **Your domain:** `https://demo.your-domain.com`

---

## Next Steps After Deployment

1. ✅ Test all functionality on live URL
2. ✅ Share URL with stakeholders
3. ✅ Gather feedback
4. ✅ Set up custom domain (optional)
5. ✅ Configure monitoring (optional)
6. ✅ Plan for backend integration (future)

---

## Support & Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Deployment Troubleshooting](https://docs.microsoft.com/en-us/azure/static-web-apps/troubleshooting)

---

**Deployment Status:** Ready to deploy
**Estimated Time:** 5-10 minutes for first deployment
**Difficulty:** Easy (mostly automated)
