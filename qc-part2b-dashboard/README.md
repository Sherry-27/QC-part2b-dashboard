# Quality Control Lab - Part 2B

Static, Vercel-ready dashboard for Statistics for Management, Chapter 10, Exercises 10-40 through 10-59.

## Included

- All 20 question numbers.
- 11 numerical exercises with fixed textbook data, formulas, answers, graphs, and interpretation.
- 9 analytical exercises with answers and an explanation when simulation is not applicable.
- Seeded Monte Carlo checks for probability questions.
- Print and JSON export.
- NumPy/Matplotlib verification script and generated figures.

## Local use

Open index.html directly, or run python -m http.server 8000 in this folder and visit http://localhost:8000.

## Python verification

Install requirements with python -m pip install -r requirements.txt, then run python verify_results.py.

## Vercel deployment

Import this folder or repository into Vercel. Choose Framework Preset: Other, leave Build Command empty, and use a dot as the Output Directory. This project has no server or build dependency.

## Data policy

All exercise observations are fixed values transcribed from the supplied Chapter 10 pages. Randomness is used only for labelled Monte Carlo verification, with a visible seed.
