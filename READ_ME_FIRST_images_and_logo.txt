########################################################################
  HOW TO MAKE YOUR POSTER IMAGES + LOGO SHOW UP  (read this — 2 minutes)
########################################################################

Right now the banners and logo are BLANK because the image files are not on
your computer yet. The app loads them from a folder. Do this once:

--- STEP 1: Save your 6 poster images ---------------------------------

1. Open File Explorer and go to:
   C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\frontend\public\banners\

   (If the "banners" folder isn't there, create a new folder named exactly
    banners inside the "public" folder.)

2. Copy your 6 poster images into that banners folder.

3. Rename them EXACTLY like this (right-click > Rename):
      banner1.png
      banner2.png
      banner3.png
      banner4.png
      banner5.png
      banner6.png

   * The name must be lowercase "banner", a number, then ".png"
   * If your files are .jpg, that's fine — but then rename them to .png will
     NOT work. Instead keep .jpg and open
     frontend\components\ui\IndianHero.tsx, and in the BANNER_CANDIDATES list
     change each ".png" to ".jpg". (Ask me and I'll do it for you.)

--- STEP 2: Save your logo --------------------------------------------

1. Save your JanNITI logo image (just the leaf/name mark, ideally with a
   transparent or white background) as:
      C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\frontend\public\logo.png

   The file MUST be named exactly  logo.png

--- STEP 3: Refresh ---------------------------------------------------

Go to the browser at http://localhost:3000 and press Ctrl+F5 (hard refresh).
- The posters now animate in the hero (fading + drifting).
- Your logo shows top-left instead of "JanNiti" text.

You do NOT need to restart the servers for images — just refresh the page.

--- Troubleshooting ---------------------------------------------------

* Still blank? Check the file names are EXACTLY banner1.png (not
  "banner1.png.png", not "Banner1.PNG"). Turn on "File name extensions" in
  File Explorer's View menu so you can see the real extension.
* Only some show? That's fine — missing numbers are skipped. Use 1..8.
* Logo too big/small? It's set to fit the navbar height automatically.
########################################################################
