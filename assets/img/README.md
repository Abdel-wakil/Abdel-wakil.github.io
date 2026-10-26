# Image folders

One folder per project/mention, matching the project's slug (same name as its page under `projects/`, or the mention's slug for the "Also worth noting" section).

## Naming convention

Drop files in using these names and they'll slot into the existing placeholders without any code changes needed beyond swapping the `.media-placeholder` div for an `<img>`:

- `cover.jpg` (or `.png`) — the thumbnail shown on the homepage card and at the top of the project page. Aim for a 16:10 landscape crop.
- `01.jpg`, `02.jpg`, `03.jpg`, ... — additional in-page photos, used in the `.media-block` sections through the write-up (CAD renders, test rigs, plots, etc.), in numeric order.
- `demo.mp4` — an optional short clip (e.g. the robot walking, the arm moving) if you have one for that project.

## Folders

- `biped/` — planar bipedal robot
- `robotic-arm/` — 3D-printed robotic arm
- `robot-control-design/` — 3-DOF manipulator dynamics & control
- `ocp/` — OCP sulphuric acid line
- `torsion-bench/` — torsion test bench
- `life-cycle/` — life cycle management project
- `pid-temp-controller/` — PID temperature controller (mention)
- `buoyant-threads/` — Buoyant Threads (mention)
- `generative-design/` — generative design sheet metal part (mention)

Once real files land in a folder, tell me and I'll wire up the corresponding `<img>`/`<video>` tags in place of the placeholders.

## Looping CAD animations (exploded views, assembly)

Use short, muted video loops rather than GIFs: an MP4 is typically 10-20x smaller than the same GIF and looks sharper.

1. Export from Fusion 360 (Animation workspace → Publish Video) or SolidWorks (Animation Wizard → Explode/Collapse → Save Animation), around 1280x720, 5-10 s, ideally a seamless loop (explode then collapse).
2. Put the files in `biped/anim/` as `exploded_full.mp4`, `exploded_leg.mp4`, `exploded_actuator.mp4`, plus a `.jpg` of the first frame with the same name (used as the poster). Aim for under ~4 MB each.
3. Uncomment the `ASSEMBLY & EXPLODED VIEWS` block in `projects/biped.html`.

Videos tagged `data-autoplay` play only while on screen (`assets/js/site.js`), so several clips on one page don't drain a laptop battery.

## Gallery photos

Phone photos are too heavy to serve directly. `biped/gallery/` keeps the originals; the page uses resized copies in `biped/gallery/web/` (1800 px, lightbox) and `biped/gallery/thumb/` (720 px, grid), with the EXIF rotation baked in.
