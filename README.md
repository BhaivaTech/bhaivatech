# BhaivaTech — Official Website

The official website for **BhaivaTech**, a software development company based in Bangalore, India. We offer web development, web applications, frontend/backend development, AWS, deployment, and hosting services.

🌐 **Live site:** [bhaivatech.com](https://bhaivatech.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Pages | HTML, SHTML (Server Side Includes) |
| Styling | CSS |
| Scripts | JavaScript |
| Backend | PHP |
| Hosting | MilesWeb cPanel (Shared Hosting) |
| Deploy | GitHub Actions → FTP |
| Version Control | Git + GitHub |

---

## Project Structure

```
bhaivatech/
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
├── css/                     # Stylesheets
├── js/                      # JavaScript files
├── images/                  # Images and assets
├── includes/                # Reusable PHP/HTML includes (header, footer)
├── index.shtml              # Home page
├── about.shtml              # About page
├── services.shtml           # Services page
├── projects.shtml           # Projects page
├── contact.shtml            # Contact page
├── contact-process.php      # Contact form handler
├── config.php               # Site configuration
├── sitemap.xml              # XML sitemap
├── robots.txt               # Search engine rules
├── llms.txt                 # AI crawler rules
└── .htaccess                # Apache config
```

---

## Branching Strategy

We use a two-branch model to keep the live site safe.

```
develop  →  (Pull Request)  →  main  →  Auto Deploy  →  bhaivatech.com
```

| Branch | Purpose |
|---|---|
| `main` | Live production site. Only updated via approved Pull Requests. |
| `develop` | Active development branch. All developers push here. |

### Rules

- **Never push directly to `main`** — it is protected and GitHub will block it.
- All changes go to `develop` first.
- When changes are ready to go live, open a Pull Request from `develop` → `main`.
- A review and approval is required before merging.
- Merging to `main` automatically triggers deployment.

---

## CI/CD Pipeline

The pipeline runs automatically via GitHub Actions (`.github/workflows/deploy.yml`).

### On every push to `develop` and every Pull Request:

1. **PHP syntax check** — validates all `.php` files with `php -l`
2. **HTML check** — scans `.html` and `.shtml` files
3. **JS minification** — minifies all JS files in `/js`
4. **CSS minification** — minifies all CSS files in `/css`

If any check fails, the pipeline stops and the PR cannot be merged.

### On merge to `main` only (after checks pass):

5. **FTP Deploy** — uploads changed files to the live server via FTPS

### Pipeline overview

```
Push to develop / Open PR
        ↓
   [check job]
   ├── PHP lint
   ├── HTML check
   ├── Minify JS
   └── Minify CSS
        ↓ (pass)
   [deploy job]  ← only runs on merge to main
   └── FTP upload to bhaivatech.com
```

---

## How to Contribute

### First time setup

```bash
# Clone the repo
git clone https://github.com/BhaivaTech/bhaivatech.git
cd bhaivatech

# Switch to develop branch
git checkout develop

# Pull latest changes
git pull origin develop
```

### Making changes

```bash
# Always start from develop and pull latest
git checkout develop
git pull origin develop

# Make your changes...

# Stage your changes
git add .

# Commit with a clear message
git commit -m "Fix: contact form email not sending"

# Push to develop (never to main)
git push origin develop
```

### Deploying (opening a Pull Request)

1. Go to [github.com/BhaivaTech/bhaivatech](https://github.com/BhaivaTech/bhaivatech)
2. Click **Pull Requests** → **New Pull Request**
3. Set **base:** `main` and **compare:** `develop`
4. Add a title and description of what changed
5. Click **Create Pull Request**
6. Wait for Chethan to review and approve
7. After approval and merge → site deploys automatically

### Commit message format

Use clear, short messages that describe what changed:

```
Fix: contact form not sending emails
Add: new services section to homepage
Update: hero image and headline copy
Remove: unused CSS from about page
```

---

## Secrets & Environment Variables

Deployment secrets are stored in **GitHub Secrets** (Settings → Secrets and variables → Actions). Never hardcode credentials in any file.

| Secret | Description |
|---|---|
| `FTP_SERVER` | MilesWeb FTP server address |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |

---

## Contact

**BhaivaTech**
📧 contact@bhaivatech.com
🌐 bhaivatech.com
📍 Bangalore, India
