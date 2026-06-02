# RadonEye Analytics Dashboard

An interactive, responsive, and completely client-side dashboard for visualizing and analyzing RadonEye (RD200) radon log data. Designed to run directly in the browser and easily hostable via GitHub Pages.

Live analytics demo loaded with example log data.

## Key Features

- **Drag-and-Drop Parsing**: Upload your RadonEye `.csv` or `.txt` log file directly.
- **Smart Date Estimation**: The app automatically extracts the measurement end date and time from standard RadonEye exported filenames (matching the `_YYYYMMDD HHMMSS` or `_YYYYMMDD_HHMMSS` format).
- **Date/Time Correction**: Since RadonEye logs do not store absolute timestamps inside the file, the app lets you adjust the ending time manually via a date-time picker. All readings adjust instantly!
- **Exposure Statistics**: Displays average radon levels, peak levels, lowest levels, and the total/percentage time spent above the alarm threshold.
- **Dynamic Safety Badges**: Classifies radon safety status (Safe, Elevated, High Risk) based on World Health Organization (WHO) and US Environmental Protection Agency (EPA) reference limits.
- **Unit Conversion**: Seamlessly toggles between Becquerels per cubic meter (`Bq/m³`) and picocuries per liter (`pCi/L`).
- **Interactive Graphing**: Zoom, pan, and hover over data points in a premium, dark-themed time-series chart powered by ApexCharts. Displays a red threshold guideline indicator.
- **Record Explorer**: A paginated, searchable, and exportable data table of individual readings.
- **Persistent Caching**: Uses `localStorage` to cache your uploaded CSV so that your data is preserved across page refreshes.
- **Zero Server Overhead**: 100% client-side execution ensures your data never leaves your computer, ensuring complete privacy.

## Getting Started

### Local Running
Simply open `index.html` in any web browser! No compilation or package installation is required.

### Serving with a Local Server (Optional)
To avoid minor CORS issues or browser restriction warnings when fetching the local example dataset, you can run a simple local web server:

Using Python:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

## How the Date Calculation Works

RadonEye log files store readings in regular intervals (default: 1 hour) but do not record timestamps inside the text structure. To plot this data on a timeline:
1. **Filename Extraction**: The app checks the uploaded filename for a timestamp signature (e.g. `_20260602_102725`). If found, it establishes this as the **End Date/Time**.
2. **Fallback**: If not found in the filename, the app falls back to the file's last modified timestamp, and finally the current date/time.
3. **Distribution**: The start date is computed by subtracting the elapsed hours from the end date:
   $$\text{Start Date} = \text{End Date} - (N - 1) \times \text{Interval}$$
   Where $N$ is the total number of readings and $\text{Interval}$ is the hours per reading (usually 1 hour).
4. **Assignment**: Timestamps are incremented sequentially:
   $$\text{Reading}_i = \text{Start Date} + i \times \text{Interval} \quad (\text{for } i \in [0, N-1])$$

## Deploying to GitHub Pages

Since this is a fully static single-page app, deploying to GitHub Pages is incredibly simple:

1. **Commit and Push**: Ensure all files (`index.html`, `style.css`, `app.js`, `README.md`, and the example CSV `example_LogData.csv`) are committed and pushed to your GitHub repository.
2. **Configure Pages**:
   - Go to your repository on GitHub.
   - Click on **Settings** > **Pages** in the left sidebar.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Under **Branch**, choose your main branch (e.g., `main` or `master`) and select the `/ (root)` folder.
   - Click **Save**.
3. **Visit URL**: Within a minute, your app will be live at `https://<your-username>.github.io/<your-repo-name>/`.

## Technical Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Flexbox & Grid)
- **Charts**: [ApexCharts](https://apexcharts.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Typography**: Inter & Outfit (Google Fonts)
