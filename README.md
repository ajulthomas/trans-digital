# TRANS DIGITAL – GTFS Builder

A lightning-fast, web-based tool that turns raw bus-schedule spreadsheets into **GTFS-compliant** zip files in just **0.3 seconds (≈ 300 000 × faster than the manual macro workflow)**, complete with route maps and instant data validation .

---

## Table of contents

1. [Why TRANS DIGITAL?](#why-trans-digital)
2. [Key features](#key-features)
3. [Tech stack](#tech-stack)
4. [Quick start](#quick-start)
5. [Project structure](#project-structure)
6. [Development process](#development-process)
7. [Road-map](#road-map)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

---

## Why TRANS DIGITAL?

Electric-bus fleet planners (e.g., Batik Solo Trans in Solo, Indonesia) rely on BetterFleet, which requires data in GTFS format. The existing Excel-macro workflow is slow, error-prone and complicated. **TRANS DIGITAL**—built by Team VINC (UC Capstone, NEVCE partner)—automates the conversion, slashes processing time, and shows routes on a map so planners can spot mistakes instantly .

---

## Key features

| #   | Feature                                                                                                  | Benefit                                                                          |
| --- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | **Simple .xlsx upload**                                                                                  | No scripting required                                                            |
| 2   | **SheetJS parser → GTFS converter**                                                                      | Generates all 8 core GTFS text files                                             |
| 3   | **Interactive data preview tabs** (Overview, Agency, Calendar, Routes, Trips, Stops, Stop Times, Shapes) | Instant sanity checks                                                            |
| 4   | **Google Maps visualisation**                                                                            | Street & satellite views of routes/stops                                         |
| 5   | **One-click ZIP & download**                                                                             | Ready to upload to journey planners                                              |
| 6   | **Device-agnostic UI**                                                                                   | Works on desktop & mobile                                                        |
| 7   | **Demo site**                                                                                            | [https://trans-digital-dev.netlify.app/](https://trans-digital-dev.netlify.app/) |

---

## Tech stack

| Layer                                                                   | Tools                                |
| ----------------------------------------------------------------------- | ------------------------------------ |
| Front end                                                               | **Angular** (TypeScript)             |
| Parsing & conversion                                                    | **SheetJS**, custom GTFS transformer |
| Mapping                                                                 | **Google Maps Platform**             |
| DevOps / Hosting                                                        | **GitHub**, **Netlify**              |
| PM / Docs                                                               | **Jira**, **Notion**                 |
| All chosen for rapid delivery during eight weekly Agile-SCRUM sprints . |                                      |

---

## Quick start

### Prerequisites

- **Node 22.x** (managed with `fnm`)&#x20;
- Git

### Setup

```powershell
# 1. Install fnm (Fast Node Manager)
winget install Schniz.fnm   # Windows example

# 2. Install & activate Node 22
fnm install 22
fnm use 22

# 3. Verify versions
node -v   # v22.14.0+
npm  -v   # 10.9.2+

# 4. Clone the repo
git clone https://github.com/ajulthomas/trans-digital
cd trans-digital

# 5. Install dependencies & run
npm install
npm run start

# 6. Build the app
npm run build:dev # the built files will be placed within dist\browser folder
# copy these files an place them in the server to be complete the deployment

```

---

## Project structure

```
/
├─ .angular/
├─ .vscode/
├─ node_modules/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ agency-details/        # component: agency table & modal
│  │  ├─ calendar-details/      # component: calendar/date view
│  │  ├─ data-table/            # reusable data-grid wrapper
│  │  ├─ gtfs-builder/          # wizard for XLSX ➜ GTFS
│  │  ├─ navbar/                # top-level navigation bar
│  │  ├─ overview/              # dashboard landing page
│  │  ├─ route-map/             # Google Maps route visualiser
│  │  ├─ services/              # shared Angular services
│  │  │  ├─ excel-utils.service.ts
│  │  │  ├─ gtfs-utils.service.ts
│  │  │  ├─ gtfs.service.ts
│  │  │  ├─ map-utils.service.ts
│  │  │  └─ message.service.ts
│  │  ├─ types/                 # TypeScript interfaces & models
│  │  │  ├─ gtfs.interface.ts
│  │  │  └─ route-data.interface.ts
│  │  ├─ app.component.html
│  │  ├─ app.component.scss
│  │  ├─ app.component.ts
│  │  ├─ app.config.ts
│  │  └─ app.routes.ts
│  ├─ environments/
│  │  └─ environment.*.ts       # dev / prod configs
│  ├─ index.html
│  ├─ main.ts
│  └─ styles.scss
├─ angular.json
├─ package.json
├─ package-lock.json
├─ tsconfig.app.json
└─ README.md

```

---

## Development process

The team followed **Agile-SCRUM** across **8 weekly sprints**, delivering incremental demos to NEVCE and iterating on feedback to reach the sub-second conversion milestone .

---

## Road-map

Planned enhancements include :

- Accept additional input/output formats.
- In-app route editing & shape plotting.
- Inclusive-planning filters (e.g., accessible stops).
- Multi-tenant back-end with database storage to eliminate file redundancy.
- Trip-planning validation & external operations-system integrations.

---

## Contributing

1. Fork the repository, create a feature branch, and open a PR.
2. Follow Angular’s commit-message guidelines.
3. Write unit tests where possible.

---

## Acknowledgements

Special thanks to project sponsor **Toby Roxburgh** and mentor **Shaun Crain** for their guidance, and to **NEVCE** for domain expertise and data access .
