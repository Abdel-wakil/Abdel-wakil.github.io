# Portfolio site

Static HTML/CSS site. No build step, no dependencies.

## Structure

```
index.html                 landing page
projects/biped.html         Bipedal Robot (dissertation)
projects/life-cycle.html    Life Cycle Management Project
projects/robotic-arm.html   3D-Printed Robotic Arm
assets/css/style.css        shared styles
resume.pdf                  your resume (currently the latest version — swap in updates as needed)
```

## Before you publish

1. **Find and replace `your-username`** across all HTML files with your actual GitHub username (used in GitHub link buttons).
2. **Fill the `[Grant Name]` placeholder** — this is only on your resume.pdf currently; if you regenerate the resume, drop the new PDF in here as `resume.pdf`.
3. **Replace media placeholders.** Every gray boxed area with "ADD PHOTO" / "ADD VIDEO" text is a `<div class="media-placeholder">...</div>` inside a `<div class="media-block">` or `<div class="media">` wrapper. To swap in a real image:

   ```html
   <!-- before -->
   <div class="media-block">
     <div class="media-placeholder"><div class="txt">ADD PHOTO<br>full assembled leg</div></div>
   </div>

   <!-- after -->
   <div class="media-block">
     <img src="../assets/img/biped-leg.jpg" alt="Assembled biped leg on the test bench" style="width:100%;height:100%;object-fit:cover;">
   </div>
   ```

   For video, replace the placeholder div with an `<iframe>` (YouTube/Vimeo embed) or an HTML5 `<video>` tag, same wrapper pattern. Put image/video files in `assets/img/`.

## Deploying to GitHub Pages (free)

1. Create a new GitHub repository. Name it exactly `your-username.github.io` if you want the site at the root domain (e.g. `abdelwakilkhamsi.github.io`) — otherwise it'll be served at `your-username.github.io/repo-name`.
2. Push this folder's contents to that repo's `main` branch:
   ```bash
   cd portfolio-site
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/your-username/your-username.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**, set the source branch to `main` and folder to `/ (root)`, save.
4. Your site will be live at the URL GitHub shows you within a minute or two.

No hosting cost, no configuration beyond that.

## Adding a new project later

Copy `projects/robotic-arm.html` as a template (it has the simplest structure), rename it, update the content, then add a new `<a class="card">` block to the grid in `index.html` pointing to it.
