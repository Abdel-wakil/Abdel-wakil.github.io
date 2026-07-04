# Image folders

One folder per project/mention, matching the project's slug (same name as its page under `projects/`, or the mention's slug for the "Also worth noting" section).

## Naming convention

Drop files in using these names and they'll slot into the existing placeholders without any code changes needed beyond swapping the `.media-placeholder` div for an `<img>`:

- `cover.jpg` (or `.png`) — the thumbnail shown on the homepage card and at the top of the project page. Aim for a 16:10 landscape crop.
- `01.jpg`, `02.jpg`, `03.jpg`, ... — additional in-page photos, used in the `.media-block` sections through the write-up (CAD renders, test rigs, plots, etc.), in numeric order.
- `demo.mp4` — an optional short clip (e.g. the robot walking, the arm moving) if you have one for that project.

## Folders

- `biped/` — PiB bipedal robot
- `robotic-arm/` — 3D-printed robotic arm
- `robot-control-design/` — 3-DOF manipulator dynamics & control
- `ocp/` — OCP sulphuric acid line
- `torsion-bench/` — torsion test bench
- `life-cycle/` — life cycle management project
- `pid-temp-controller/` — PID temperature controller (mention)
- `buoyant-threads/` — Buoyant Threads (mention)
- `generative-design/` — generative design sheet metal part (mention)

Once real files land in a folder, tell me and I'll wire up the corresponding `<img>`/`<video>` tags in place of the placeholders.
