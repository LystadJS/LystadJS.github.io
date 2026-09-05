# START HERE — GitHub Pages for a Complete Beginner

## Part 1 — Create the website repository

1. Sign in to GitHub.
2. In the upper-right corner, click the **+** menu.
3. Click **New repository**.
4. In **Repository name**, type exactly:

   `YOUR-USERNAME.github.io`

   Replace `YOUR-USERNAME` with the username shown on your GitHub profile.

5. Choose **Public** if you are using GitHub Free.
6. Turn **Add a README file** on.
7. Click **Create repository**.

## Part 2 — Upload this starter site

1. Unzip the starter package on your computer.
2. Open the unzipped folder.
3. In your new GitHub repository, click **Add file** → **Upload files**.
4. Drag the CONTENTS of the starter folder into the upload area.
   - Drag `index.html`, `research.html`, `projects.html`, `notes.html`, `cv.html`, `404.html`, `.nojekyll`, plus the `assets` and `notes` folders.
   - If GitHub already created a `README.md` for you, skip the starter `README.md` during this first upload. It is documentation only and is not required for the website.
   - Do not drag the outer `jinx_academic_site_starter` folder itself.
5. In the commit message box, type:

   `Add initial academic website`

6. Commit the files.

## Part 3 — Turn on GitHub Pages

1. In the repository, click **Settings**.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, select `main`.
5. Select `/(root)`.
6. Click **Save**.
7. Your site address will be:

   `https://YOUR-USERNAME.github.io`

## Part 4 — Personalize it

The fastest workflow is to edit files directly in GitHub:

1. Open a file, such as `index.html`.
2. Click the pencil icon.
3. Replace placeholders.
4. Click **Commit changes**.
5. Repeat.

Search for all instances of:
- `YOUR NAME`
- `YOUR-USERNAME`
- `YOUR.EMAIL@EXAMPLE.COM`
- `YOUR-LINKEDIN`
- `[placeholder text]`

## Part 5 — Add your CV

Create or export your CV as a PDF named `cv.pdf`.

Upload it into the `assets` folder so its path is:

`assets/cv.pdf`

Then edit `cv.html` and change the download button link from `href="#"` to:

`href="assets/cv.pdf"`

## What should go on an academic site?

Strong defaults:
- short research statement
- research interests
- publications / manuscripts with accurate status labels
- conference talks / posters
- selected projects with readable GitHub repositories
- methods / technical skills
- CV
- professional contact information
- optional public research notes

Avoid:
- every class assignment you have ever completed
- unclean repositories with no README
- exaggerated publication status
- confidential data or unpublished private research
- personal content that does not support the professional identity you want

## Later upgrades

Once the site is stable, reasonable upgrades are:
- custom domain
- ORCID / Google Scholar links
- structured publication metadata
- analytics that respect visitor privacy
- a static-site generator such as Quarto, Hugo, or Jekyll if the notes/publications grow large
