/* ==========================================================================
   RadonEye Analytics - Application Logic & Localisation
   ========================================================================== */

// Global Application State
const state = {
  // Raw Data
  rawCsvText: '',
  filename: '',
  
  // Language & Translation
  language: 'en', // 'en' or 'es'
  
  // Parsed Data
  metadata: {
    modelName: 'RD200',
    serialNumber: 'Unknown',
    unit: 'Bq/m³', // Original unit from file
    alarmThreshold: 148, // Original threshold from file
    interval: '1 hour',
    intervalHours: 1,
    totalReadings: 0
  },
  readings: [], // Elements: { index: Int, value: Float (original unit), timestamp: Date }
  
  // Settings & Adjustments
  endDatetime: new Date(),
  dateParsedFromFilename: false,
  displayUnit: 'Bq/m³', // Current unit chosen by user
  customThreshold: null, // Custom threshold in DISPLAY unit
  
  // Table Pagination & Search
  tablePage: 1,
  tablePageSize: 20,
  tableSearchQuery: '',
  
  // Chart Instance
  chartInstance: null,
  
  // Show data labels on the chart
  showChartLabels: false
};

// EPA and WHO reference constants (in display units)
const RADON_LIMITS = {
  'Bq/m³': { WHO: 100, EPA: 148 },
  'pCi/L': { WHO: 2.7, EPA: 4.0 }
};

// Localisation Dictionary
const TRANSLATIONS = {
  en: {
    seo_title: "RadonEye Analytics Dashboard - Interactive RadonEye Log Visualizer",
    app_title: "RadonEye <span>Analytics</span>",
    app_subtitle: "Interactive RadonEye Log Visualizer",
    upload_title: "Upload Data Log",
    upload_drag_main: "Drag & drop your CSV file here",
    upload_drag_sub: "or click to browse from your computer",
    upload_file_spec: "Accepts RadonEye .csv or .txt logs",
    upload_privacy_note: "Your data stays completely inside your local browser cache. No files are uploaded to any server.",
    no_file_loaded: "No file loaded",
    device_title: "Device Metadata",
    label_model: "Model Name",
    label_serial: "Serial Number",
    label_total_readings: "Total Readings",
    label_interval: "Sample Interval",
    label_date_range: "Date Range",
    settings_title: "Visualizer Settings",
    label_display_unit: "Display Unit",
    help_display_unit: "Converts measurements dynamically (1 pCi/L = 37 Bq/m³)",
    label_end_time: "Measurement End Time",
    help_datetime_source: "Parsed from filename or current time",
    label_alarm_threshold: "Alarm Threshold",
    btn_reset: "Reset to File Default",
    help_threshold: "WHO recommends keeping below 100 Bq/m³ (2.7 pCi/L). EPA action level is 148 Bq/m³ (4.0 pCi/L).",
    metric_avg_label: "Average Radon Level",
    badge_no_data: "No Data Loaded",
    metric_max_label: "Maximum Radon Level",
    at_time_placeholder: "At: --",
    metric_min_label: "Minimum Radon Level",
    metric_exposure_label: "Time Above Threshold",
    hours_placeholder: "-- / -- hours",
    chart_title: "Time-Series Analytics",
    legend_radon: "Radon Level",
    legend_threshold: "Alarm Threshold",
    chart_loader_text: "Waiting for data upload...",
    table_title: "Individual Log Records",
    search_placeholder: "Search records...",
    btn_export: "Export CSV",
    th_no: "Data No.",
    th_datetime: "Date & Time",
    th_value: "Radon Level",
    th_status: "Status",
    table_empty: "No data available. Upload a CSV to view log list.",
    pagination_info_placeholder: "Showing 0 to 0 of 0 entries",
    btn_prev: "Previous",
    btn_next: "Next",
    label_show_chart_values: "Show values on graph",
    guide_title: "RadonEye & Safety Information",
    guide_intro: "Radon is a naturally occurring radioactive gas that can cause lung cancer. Because it is invisible, odorless, and tasteless, measuring is the only way to know if you are exposed.",
    guide_card1_badge: "Safe (Under WHO Guidance)",
    guide_card1_text: "The World Health Organization (WHO) recommends keeping average radon levels below 100 Bq/m³ to minimize health risks. No action is required, though continuous monitoring is advised.",
    guide_card2_badge: "Elevated (WHO Limit)",
    guide_card2_text: "Action is recommended. This level exceeds WHO's reference limit. While it is below the EPA action line, you should consider sealing cracks in your foundation, improving ventilation, or doing a long-term test.",
    guide_card3_badge: "High Risk (EPA Action Level)",
    guide_card3_text: "Immediate action is strongly recommended by the US EPA. Mitigating your home is necessary to lower radon concentration. Levels above 148 Bq/m³ pose significantly elevated health risks over time.",
    footer_copyright: "Not affiliated with RadonEye or Ecosense. Run completely client-side. Data remains in your browser's local cache.",
    footer_link_source: "Source Code",
    
    // Dynamic terms
    start_label: "Start",
    end_label: "End",
    at_time: "At",
    hours_template: "{hours} / {total} hrs",
    badge_safe: "Safe",
    badge_elevated: "Elevated",
    badge_danger: "High Risk",
    status_safe: "Safe",
    status_elevated: "Elevated",
    status_danger: "Danger",
    chart_axis_title: "Concentration",
    table_no_match: "No matching log records found.",
    pagination_info_template: "Showing {start} to {end} of {total} entries",
    source_filename: "Parsed from filename",
    source_upload: "Based on file upload timestamp",
    source_default: "Defaulting to current date"
  },
  es: {
    seo_title: "Panel de Análisis de RadonEye - Visualizador Interactivo de RadonEye",
    app_title: "RadonEye <span>Analytics</span>",
    app_subtitle: "Visualizador Interactivo de Registros de RadonEye",
    upload_title: "Subir Registro de Datos",
    upload_drag_main: "Arrastra y suelta tu archivo CSV aquí",
    upload_drag_sub: "o haz clic para buscar en tu ordenador",
    upload_file_spec: "Acepta registros .csv o .txt de RadonEye",
    upload_privacy_note: "Tus datos permanecen por completo en la caché local del navegador. No se envía ningún archivo al servidor.",
    no_file_loaded: "Ningún archivo cargado",
    device_title: "Metadatos del Dispositivo",
    label_model: "Nombre del Modelo",
    label_serial: "Número de Serie",
    label_total_readings: "Lecturas Totales",
    label_interval: "Intervalo de Muestreo",
    label_date_range: "Rango de Fechas",
    settings_title: "Ajustes del Visualizador",
    label_display_unit: "Unidad de Medida",
    help_display_unit: "Convierte las mediciones dinámicamente (1 pCi/L = 37 Bq/m³)",
    label_end_time: "Hora de Fin de la Medición",
    help_datetime_source: "Extraído del nombre del archivo o fecha actual",
    label_alarm_threshold: "Umbral de Alarma",
    btn_reset: "Restablecer al original",
    help_threshold: "La OMS recomienda mantener por debajo de 100 Bq/m³ (2,7 pCi/L). El nivel de acción de la EPA es 148 Bq/m³ (4,0 pCi/L).",
    metric_avg_label: "Nivel Medio de Radón",
    badge_no_data: "Sin datos cargados",
    metric_max_label: "Nivel Máximo de Radón",
    at_time_placeholder: "A las: --",
    metric_min_label: "Nivel Mínimo de Radón",
    metric_exposure_label: "Tiempo Sobre el Umbral",
    hours_placeholder: "-- / -- horas",
    chart_title: "Análisis de Series Temporales",
    legend_radon: "Nivel de Radón",
    legend_threshold: "Umbral de Alarma",
    chart_loader_text: "Esperando la subida de datos...",
    table_title: "Registros Individuales",
    search_placeholder: "Buscar registros...",
    btn_export: "Exportar CSV",
    th_no: "Nº de Dato",
    th_datetime: "Fecha y Hora",
    th_value: "Nivel de Radón",
    th_status: "Estado",
    table_empty: "Sin datos disponibles. Sube un CSV para ver la lista de registros.",
    pagination_info_placeholder: "Mostrando 0 a 0 de 0 registros",
    btn_prev: "Anterior",
    btn_next: "Siguiente",
    label_show_chart_values: "Mostrar valores en el gráfico",
    guide_title: "Niveles de Radón e Información de Seguridad",
    guide_intro: "El radón es un gas radiactivo de origen natural que puede causar cáncer de pulmón. Al ser invisible, inodoro e insípido, medirlo es la única forma de saber si se está expuesto.",
    guide_card1_badge: "Seguro (Según la OMS)",
    guide_card1_text: "La Organización Mundial de la Salud (OMS) recomienda mantener los niveles medios de radón por debajo de 100 Bq/m³ para minimizar los riesgos. No se requiere ninguna acción, aunque se aconseja vigilancia continua.",
    guide_card2_badge: "Elevado (Límite OMS)",
    guide_card2_text: "Se recomienda actuar. Este nivel supera el límite de referencia de la OMS. Aunque está por debajo del umbral de la EPA, debería considerar sellar grietas en los cimientos, mejorar la ventilación o hacer una prueba a largo plazo.",
    guide_card3_badge: "Riesgo Alto (Nivel de Acción de la EPA)",
    guide_card3_text: "La EPA de EE. UU. recomienda encarecidamente tomar medidas inmediatas. Mitigar su hogar es necesario para reducir la concentración de radón. Los niveles superiores a 148 Bq/m³ plantean riesgos para la salud significativos a largo plazo.",
    footer_copyright: "No afiliado con RadonEye o Ecosense. Ejecutado completamente en el cliente. Los datos permanecen en la caché local de tu navegador.",
    footer_link_source: "Código Fuente",
    
    // Dynamic terms
    start_label: "Inicio",
    end_label: "Fin",
    at_time: "A las",
    hours_template: "{hours} / {total} horas",
    badge_safe: "Seguro",
    badge_elevated: "Elevado",
    badge_danger: "Riesgo Alto",
    status_safe: "Seguro",
    status_elevated: "Elevado",
    status_danger: "Peligro",
    chart_axis_title: "Concentración",
    table_no_match: "No se encontraron registros coincidentes.",
    pagination_info_template: "Mostrando {start} a {end} de {total} registros",
    source_filename: "Extraído del nombre del archivo",
    source_upload: "Basado en la hora de subida del archivo",
    source_default: "Por defecto la fecha actual"
  }
};

// Translate strings based on current state.language
function t(key, replacements = {}) {
  const dict = TRANSLATIONS[state.language] || TRANSLATIONS['en'];
  let text = dict[key] || TRANSLATIONS['en'][key] || key;
  Object.keys(replacements).forEach(k => {
    text = text.replace(`{${k}}`, replacements[k]);
  });
  return text;
}

// Perform page localization translation scan
function translateStaticUI() {
  // Update document title
  document.title = t('seo_title');
  
  // Static Inner Texts/HTML
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerHTML = t(key);
  });
  
  // Input Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
}

// Detect language from user navigator
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  state.language = browserLang.toLowerCase().startsWith('es') ? 'es' : 'en';
}

// Toggle Language between English and Spanish
function toggleLanguage() {
  state.language = state.language === 'en' ? 'es' : 'en';
  translateStaticUI();
  updateLanguageToggleButton();
  
  if (state.readings.length > 0) {
    // Update source helper description text dynamically
    const helpEl = document.getElementById('datetime-source-help');
    if (state.dateParsedFromFilename) {
      helpEl.innerText = t('source_filename');
    } else {
      const loadHelp = helpEl.innerText;
      if (loadHelp === TRANSLATIONS['en']['source_upload'] || loadHelp === TRANSLATIONS['es']['source_upload']) {
        helpEl.innerText = t('source_upload');
      } else {
        helpEl.innerText = t('source_default');
      }
    }
    renderDashboard();
  } else {
    resetDashboardState();
  }
}

// Update the header toggle button label and title attribute
function updateLanguageToggleButton() {
  const toggleBtn = document.getElementById('btn-lang-toggle');
  const toggleText = document.getElementById('lang-toggle-text');
  if (state.language === 'en') {
    toggleText.innerText = 'Español';
    toggleBtn.title = 'Switch to Spanish';
  } else {
    toggleText.innerText = 'English';
    toggleBtn.title = 'Cambiar a Inglés';
  }
}

// Initialize Application on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Detect language and translate
  detectLanguage();
  translateStaticUI();
  updateLanguageToggleButton();
  
  // Initialise icons
  lucide.createIcons();
  
  // Setup Event Listeners
  setupEventListeners();
  
  // Load data: check browser cache first, otherwise fetch local example CSV
  const cachedData = loadFromCache();
  if (cachedData) {
    processData(cachedData.csvText, cachedData.filename);
  } else {
    // If no cache, fetch the example CSV in the repository
    fetchExampleCSV();
  }
});

// Setup Event Listeners
function setupEventListeners() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('csv-file-input');
  const clearBtn = document.getElementById('clear-file-btn');
  const btnBq = document.getElementById('btn-unit-bq');
  const btnPci = document.getElementById('btn-unit-pci');
  const endDatetimeInput = document.getElementById('input-end-datetime');
  const thresholdInput = document.getElementById('input-threshold');
  const resetThresholdBtn = document.getElementById('btn-reset-threshold');
  const tableSearch = document.getElementById('table-search');
  const exportBtn = document.getElementById('btn-export-csv');
  
  // File Upload (Drag & Drop)
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
  
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });
  
  // Clear Loaded File
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearCache();
    resetDashboardState();
  });
  
  // Unit Toggles
  btnBq.addEventListener('click', () => {
    if (state.displayUnit !== 'Bq/m³') {
      setUnit('Bq/m³');
    }
  });
  
  btnPci.addEventListener('click', () => {
    if (state.displayUnit !== 'pCi/L') {
      setUnit('pCi/L');
    }
  });
  
  // End Date Adjustment
  endDatetimeInput.addEventListener('change', (e) => {
    if (e.target.value) {
      state.endDatetime = new Date(e.target.value);
      recalculateTimestamps();
      renderDashboard();
    }
  });
  
  // Custom Threshold Input
  thresholdInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      state.customThreshold = val;
      renderDashboard();
    } else {
      state.customThreshold = null;
      renderDashboard();
    }
  });
  
  resetThresholdBtn.addEventListener('click', () => {
    state.customThreshold = null;
    // Set threshold input back to original converted value
    const origConverted = convertValue(state.metadata.alarmThreshold, state.metadata.unit, state.displayUnit);
    thresholdInput.value = formatValue(origConverted, state.displayUnit);
    renderDashboard();
  });
  
  // Table Search
  tableSearch.addEventListener('input', (e) => {
    state.tableSearchQuery = e.target.value.toLowerCase();
    state.tablePage = 1; // reset page
    renderTable();
  });
  
  // Table Pagination Click Handlers
  document.getElementById('btn-page-prev').addEventListener('click', () => {
    if (state.tablePage > 1) {
      state.tablePage--;
      renderTable();
    }
  });
  
  document.getElementById('btn-page-next').addEventListener('click', () => {
    const totalPages = Math.ceil(getFilteredReadings().length / state.tablePageSize);
    if (state.tablePage < totalPages) {
      state.tablePage++;
      renderTable();
    }
  });
  
  // Export CSV
  exportBtn.addEventListener('click', exportCSV);
  
  // Language Switcher
  document.getElementById('btn-lang-toggle').addEventListener('click', toggleLanguage);
  
  // Chart Labels Toggle
  document.getElementById('checkbox-show-labels').addEventListener('change', (e) => {
    state.showChartLabels = e.target.checked;
    renderChart();
  });
}

// Fetch Example CSV from workspace repository
function fetchExampleCSV() {
  const exampleUrl = './example_LogData.csv';
  fetch(exampleUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Example CSV file not found.');
      }
      return response.text();
    })
    .then(csvText => {
      processData(csvText, 'example_LogData.csv');
      // Save it to cache as requested, so page always opens with cached data
      saveToCache(csvText, 'example_LogData.csv');
    })
    .catch(error => {
      console.warn('Could not fetch example CSV: ', error);
      // Wait for user upload
    });
}

// File Reader Handler
function handleFile(file) {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const csvText = e.target.result;
    processData(csvText, file.name, file.lastModified);
    saveToCache(csvText, file.name);
  };
  reader.readAsText(file);
}

// Parse and Process Uploaded/Cached Data
function processData(csvText, filename, fileLastModified = null) {
  state.rawCsvText = csvText;
  state.filename = filename;
  
  // Parse CSV
  const parseResult = parseRadonEyeCSV(csvText, filename);
  state.metadata = parseResult.metadata;
  state.readings = parseResult.readings;
  state.dateParsedFromFilename = parseResult.dateParsedFromFilename;
  
  // Determine measurement end date
  if (parseResult.dateParsedFromFilename) {
    state.endDatetime = parseResult.endDatetime;
    document.getElementById('datetime-source-help').innerText = t('source_filename');
  } else if (fileLastModified) {
    state.endDatetime = new Date(fileLastModified);
    document.getElementById('datetime-source-help').innerText = t('source_upload');
  } else {
    state.endDatetime = new Date();
    document.getElementById('datetime-source-help').innerText = t('source_default');
  }
  
  // Match initial display unit to file unit
  state.displayUnit = state.metadata.unit === 'pCi/L' ? 'pCi/L' : 'Bq/m³';
  state.customThreshold = null; // Clear custom threshold to use default
  
  // Recalculate timestamps backwards from end date
  recalculateTimestamps();
  
  // Reset table pagination
  state.tablePage = 1;
  state.tableSearchQuery = '';
  document.getElementById('table-search').value = '';
  
  // Update controls display values
  updateControlsUI();
  
  // Show file badge
  const sizeKb = (csvText.length / 1024).toFixed(1);
  document.getElementById('loaded-filename').innerText = filename;
  document.getElementById('loaded-filesize').innerText = `${sizeKb} KB`;
  document.getElementById('file-loaded-badge').classList.remove('hidden');
  document.getElementById('drop-zone').classList.add('hidden');
  
  // Render full dashboard
  renderDashboard();
  
  // Refresh Lucide Icons in dynamically created elements
  lucide.createIcons();
}

// RadonEye CSV and Text Log Parser
function parseRadonEyeCSV(csvText, filename) {
  const lines = csvText.split(/\r?\n/);
  const metadata = {
    modelName: 'RD200',
    serialNumber: 'Unknown',
    unit: 'Bq/m³',
    alarmThreshold: 148,
    interval: '1 hour',
    intervalHours: 1,
    totalReadings: 0
  };
  
  const readings = [];
  let readingDataStarted = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Check for headers
    if (!readingDataStarted) {
      if (line.toLowerCase().startsWith('radoneye log data')) {
        continue;
      }
      
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim().replace(/,$/, '').toLowerCase();
        let val = line.slice(colonIndex + 1).trim();
        // Remove leading comma if present
        if (val.startsWith(',')) {
          val = val.slice(1).trim();
        }

        if (key.includes('model name')) {
          metadata.modelName = val;
        } else if (key.includes('s/n') || key.includes('serial')) {
          metadata.serialNumber = val;
        } else if (key.includes('unit')) {
          metadata.unit = val;
        } else if (key.includes('alarm threshold')) {
          metadata.alarmThreshold = parseFloat(val) || 148;
        } else if (key.includes('interval') || key.includes('time step')) {
          metadata.interval = val;
          // Parse interval string (e.g. "1 hour", "10 minutes")
          const numMatch = val.match(/(\d+)/);
          const num = numMatch ? parseInt(numMatch[1], 10) : 1;
          if (val.toLowerCase().includes('minute')) {
            metadata.intervalHours = num / 60;
          } else {
            metadata.intervalHours = num;
          }
        } else if (key.includes('total # of data')) {
          metadata.totalReadings = parseInt(val, 10) || 0;
        } else if (key.includes('data no')) {
          readingDataStarted = true;
          continue;
        }
      }
    } else {
      // Parse data rows
      // Format 1: "1,1035" or "1, 1035"
      // Format 2: "1) 12.3"
      // Format 3: "1 10.3"
      const match = line.match(/^(\d+)[\s,)]+(\d+(?:\.\d+)?)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const value = parseFloat(match[2]);
        readings.push({ index, value });
      }
    }
  }

  // If totalReadings was not in header, count parsed rows
  if (!metadata.totalReadings || metadata.totalReadings === 0) {
    metadata.totalReadings = readings.length;
  }

  // Look for end date time string in filename: _YYYYMMDD HHMMSS or _YYYYMMDD_HHMMSS
  let endDatetime = new Date();
  let dateParsedFromFilename = false;
  
  if (filename) {
    // Matches YYYYMMDD with space or underscore, then HHMMSS
    const fnMatch = filename.match(/_([0-9]{8})[\s_]([0-9]{6})/);
    if (fnMatch) {
      const dateStr = fnMatch[1]; // YYYYMMDD
      const timeStr = fnMatch[2]; // HHMMSS
      const year = parseInt(dateStr.slice(0, 4), 10);
      const month = parseInt(dateStr.slice(4, 6), 10) - 1; // 0-based month
      const day = parseInt(dateStr.slice(6, 8), 10);
      const hour = parseInt(timeStr.slice(0, 2), 10);
      const min = parseInt(timeStr.slice(2, 4), 10);
      const sec = parseInt(timeStr.slice(4, 6), 10);
      
      endDatetime = new Date(year, month, day, hour, min, sec);
      dateParsedFromFilename = true;
    }
  }

  return { metadata, readings, endDatetime, dateParsedFromFilename };
}

// Recalculate reading timestamps backwards based on Interval and End Date/Time
function recalculateTimestamps() {
  if (state.readings.length === 0) return;
  
  const endMs = state.endDatetime.getTime();
  const stepMs = state.metadata.intervalHours * 3600000;
  
  // Reading indices are 1-based, array is sorted
  state.readings.forEach((reading, idx) => {
    // Distribute time stamps backwards
    const timeOffset = (state.readings.length - 1 - idx) * stepMs;
    reading.timestamp = new Date(endMs - timeOffset);
  });
}

// Set display unit and trigger UI updates
function setUnit(newUnit) {
  // Convert custom threshold if set
  if (state.customThreshold !== null) {
    state.customThreshold = convertValue(state.customThreshold, state.displayUnit, newUnit);
  }
  
  state.displayUnit = newUnit;
  
  // Update toggle button states
  document.getElementById('btn-unit-bq').classList.toggle('active', newUnit === 'Bq/m³');
  document.getElementById('btn-unit-pci').classList.toggle('active', newUnit === 'pCi/L');
  
  // Update unit label texts
  document.getElementById('threshold-unit-label').innerText = newUnit;
  
  // Set threshold input value
  const activeThreshold = getActiveThreshold();
  document.getElementById('input-threshold').value = formatValue(activeThreshold, newUnit);
  
  // Redraw dashboard
  renderDashboard();
}

// Update the configuration form UI fields
function updateControlsUI() {
  // End Datetime Picker (formatted as local datetime YYYY-MM-DDTHH:MM)
  const tzOffset = state.endDatetime.getTimezoneOffset() * 60000; // in ms
  const localISOTime = (new Date(state.endDatetime - tzOffset)).toISOString().slice(0, 16);
  document.getElementById('input-end-datetime').value = localISOTime;
  
  // Display Unit
  document.getElementById('btn-unit-bq').classList.toggle('active', state.displayUnit === 'Bq/m³');
  document.getElementById('btn-unit-pci').classList.toggle('active', state.displayUnit === 'pCi/L');
  document.getElementById('threshold-unit-label').innerText = state.displayUnit;
  
  // Threshold Input
  const threshold = getActiveThreshold();
  document.getElementById('input-threshold').value = formatValue(threshold, state.displayUnit);
}

// Reset app back to empty dashboard
function resetDashboardState() {
  state.rawCsvText = '';
  state.filename = '';
  state.metadata = {
    modelName: 'RD200',
    serialNumber: 'Unknown',
    unit: 'Bq/m³',
    alarmThreshold: 148,
    interval: '1 hour',
    intervalHours: 1,
    totalReadings: 0
  };
  state.readings = [];
  state.customThreshold = null;
  state.dateParsedFromFilename = false;
  state.showChartLabels = false;
  state.tablePage = 1;
  state.tableSearchQuery = '';
  
  // Reset checkbox
  document.getElementById('checkbox-show-labels').checked = false;
  
  // Reset values
  document.getElementById('meta-model').innerText = '--';
  document.getElementById('meta-serial').innerText = '--';
  document.getElementById('meta-readings').innerText = '--';
  document.getElementById('meta-interval').innerText = '--';
  document.getElementById('meta-date-range').innerText = '--';
  
  // Hide loaded file badge, show upload dropzone
  document.getElementById('file-loaded-badge').classList.add('hidden');
  document.getElementById('drop-zone').classList.remove('hidden');
  document.getElementById('csv-file-input').value = '';
  
  document.getElementById('metric-avg-value').innerText = '--';
  document.getElementById('metric-max-value').innerText = '--';
  document.getElementById('metric-min-value').innerText = '--';
  document.getElementById('metric-exposure-percent').innerText = '--';
  document.getElementById('metric-max-time').innerText = t('at_time_placeholder');
  document.getElementById('metric-min-time').innerText = t('at_time_placeholder');
  document.getElementById('metric-exposure-hours').innerText = t('hours_placeholder');
  
  const safetyBadge = document.getElementById('safety-status-badge');
  safetyBadge.className = 'metric-badge';
  safetyBadge.querySelector('.badge-text').innerText = t('badge_no_data');
  
  // Reset legend threshold text
  const legendTextEl = document.getElementById('legend-threshold-text');
  if (legendTextEl) {
    legendTextEl.innerText = t('legend_threshold');
  }
  
  // Clear chart
  if (state.chartInstance) {
    state.chartInstance.destroy();
    state.chartInstance = null;
  }
  document.getElementById('radon-chart').innerHTML = `
    <div class="chart-loader">
      <div class="spinner"></div>
      <p data-i18n="chart_loader_text">${t('chart_loader_text')}</p>
    </div>
  `;
  
  // Reset Table
  document.getElementById('table-rows').innerHTML = `
    <tr>
      <td colspan="4" class="table-empty" id="table-empty-message" data-i18n="table_empty">${t('table_empty')}</td>
    </tr>
  `;
  document.getElementById('pagination-info-text').innerText = t('pagination_info_placeholder');
  document.getElementById('btn-page-prev').disabled = true;
  document.getElementById('btn-page-next').disabled = true;
  document.getElementById('page-numbers').innerHTML = '';
  
  lucide.createIcons();
}

// Convert radon value between units
function convertValue(val, fromUnit, toUnit) {
  if (fromUnit === toUnit) return val;
  if (fromUnit === 'Bq/m³' && toUnit === 'pCi/L') return val / 37;
  if (fromUnit === 'pCi/L' && toUnit === 'Bq/m³') return val * 37;
  return val;
}

// Format Radon value according to unit (integer for Bq, decimals for pCi)
function formatValue(val, unit) {
  if (unit === 'pCi/L') {
    return parseFloat(val.toFixed(2));
  }
  return Math.round(val);
}

// Get active alarm threshold in current display unit
function getActiveThreshold() {
  if (state.customThreshold !== null) {
    return state.customThreshold;
  }
  return convertValue(state.metadata.alarmThreshold, state.metadata.unit, state.displayUnit);
}

// Format date nicely for stats or list
function formatDate(date, includeSeconds = false) {
  if (!date) return '--';
  const pad = (n) => String(n).padStart(2, '0');
  
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const sec = pad(date.getSeconds());
  
  let timeStr = `${hh}:${min}`;
  if (includeSeconds) {
    timeStr += `:${sec}`;
  }
  return `${yyyy}-${mm}-${dd} ${timeStr}`;
}

// Calculate Statistics & Populate Dashboard Widgets
function renderDashboard() {
  if (state.readings.length === 0) return;
  
  const activeThreshold = getActiveThreshold();
  
  // Update legend text dynamically to show active threshold value
  const legendTextEl = document.getElementById('legend-threshold-text');
  if (legendTextEl) {
    legendTextEl.innerText = `${t('legend_threshold')} (${activeThreshold} ${state.displayUnit})`;
  }
  
  const values = state.readings.map(r => convertValue(r.value, state.metadata.unit, state.displayUnit));
  
  // Calculate average, min, max
  const sum = values.reduce((acc, v) => acc + v, 0);
  const avg = sum / values.length;
  
  let maxVal = -Infinity;
  let minVal = Infinity;
  let maxIdx = 0;
  let minIdx = 0;
  
  values.forEach((v, idx) => {
    if (v > maxVal) { maxVal = v; maxIdx = idx; }
    if (v < minVal) { minVal = v; minIdx = idx; }
  });
  
  const maxTime = state.readings[maxIdx].timestamp;
  const minTime = state.readings[minIdx].timestamp;
  
  // Calculate count above threshold
  let aboveCount = 0;
  values.forEach(v => {
    if (v >= activeThreshold) aboveCount++;
  });
  const abovePercent = (aboveCount / values.length) * 100;
  const totalHours = values.length * state.metadata.intervalHours;
  const aboveHours = aboveCount * state.metadata.intervalHours;
  
  // Update Widget Texts
  document.getElementById('metric-avg-value').innerText = formatValue(avg, state.displayUnit);
  document.getElementById('metric-avg-unit').innerText = state.displayUnit;
  
  document.getElementById('metric-max-value').innerText = formatValue(maxVal, state.displayUnit);
  document.getElementById('metric-max-unit').innerText = state.displayUnit;
  document.getElementById('metric-max-time').innerText = `${t('at_time')} ${formatDate(maxTime)}`;
  
  document.getElementById('metric-min-value').innerText = formatValue(minVal, state.displayUnit);
  document.getElementById('metric-min-unit').innerText = state.displayUnit;
  document.getElementById('metric-min-time').innerText = `${t('at_time')} ${formatDate(minTime)}`;
  
  document.getElementById('metric-exposure-percent').innerText = abovePercent.toFixed(1);
  document.getElementById('metric-exposure-hours').innerText = 
    t('hours_template', { hours: aboveHours.toFixed(1), total: totalHours.toFixed(1) });
  
  // Safety Badge logic
  const limits = RADON_LIMITS[state.displayUnit];
  const safetyBadge = document.getElementById('safety-status-badge');
  const badgeText = safetyBadge.querySelector('.badge-text');
  
  if (avg < limits.WHO && maxVal < limits.EPA) {
    safetyBadge.className = 'metric-badge safe-badge';
    badgeText.innerText = t('badge_safe');
  } else if (avg >= limits.EPA || maxVal >= limits.EPA * 2) {
    safetyBadge.className = 'metric-badge danger-badge';
    badgeText.innerText = t('badge_danger');
  } else {
    safetyBadge.className = 'metric-badge warning-badge';
    badgeText.innerText = t('badge_elevated');
  }
  
  // Update Metadata Card
  document.getElementById('meta-model').innerText = state.metadata.modelName;
  document.getElementById('meta-serial').innerText = state.metadata.serialNumber;
  document.getElementById('meta-readings').innerText = state.metadata.totalReadings;
  
  // Sample Interval translation
  let intervalValue = state.metadata.interval;
  if (state.language === 'es') {
    intervalValue = intervalValue.replace('hour', 'hora').replace('hours', 'horas').replace('minute', 'minuto').replace('minutes', 'minutos');
  }
  document.getElementById('meta-interval').innerText = intervalValue;
  
  const startRange = state.readings[0].timestamp;
  const endRange = state.readings[state.readings.length - 1].timestamp;
  document.getElementById('meta-date-range').innerHTML = `
    <strong>${t('start_label')}:</strong> ${formatDate(startRange)}<br>
    <strong>${t('end_label')}:</strong> ${formatDate(endRange)}
  `;
  
  // Render Chart
  renderChart();
  
  // Render Table
  renderTable();
}

// Render Interactive ApexChart
function renderChart() {
  const chartContainer = document.getElementById('radon-chart');
  if (state.readings.length === 0) return;
  
  // Format data points for ApexCharts
  const seriesData = state.readings.map(r => {
    return {
      x: r.timestamp.getTime(),
      y: parseFloat(convertValue(r.value, state.metadata.unit, state.displayUnit).toFixed(2))
    };
  });
  
  const activeThreshold = getActiveThreshold();
  
  // Calculate dynamic color stops for the graph background based on safe, elevated, and high-risk ranges
  const yValues = seriesData.map(d => d.y);
  const yMax = Math.max(...yValues, activeThreshold);
  const yMin = Math.min(...yValues, 0);
  const limits = RADON_LIMITS[state.displayUnit];
  const who = limits.WHO;
  const epa = limits.EPA;
  const range = yMax - yMin || 1;
  const getOffset = (val) => Math.max(0, Math.min(100, ((yMax - val) / range) * 100));
  
  const offsetEpa = getOffset(epa);
  const offsetWho = getOffset(who);
  const stops = [];
  
  if (yMax >= epa) {
    stops.push({ offset: 0, color: '#ef4444', opacity: 0.5 }); // High Risk
    stops.push({ offset: offsetEpa, color: '#ef4444', opacity: 0.4 });
    stops.push({ offset: offsetEpa + 0.1, color: '#f59e0b', opacity: 0.35 }); // Elevated
    stops.push({ offset: offsetWho, color: '#f59e0b', opacity: 0.25 });
    stops.push({ offset: offsetWho + 0.1, color: '#10b981', opacity: 0.2 }); // Safe
    stops.push({ offset: 100, color: '#10b981', opacity: 0.05 });
  } else if (yMax >= who) {
    stops.push({ offset: 0, color: '#f59e0b', opacity: 0.4 }); // Elevated
    stops.push({ offset: offsetWho, color: '#f59e0b', opacity: 0.3 });
    stops.push({ offset: offsetWho + 0.1, color: '#10b981', opacity: 0.2 }); // Safe
    stops.push({ offset: 100, color: '#10b981', opacity: 0.05 });
  } else {
    stops.push({ offset: 0, color: '#10b981', opacity: 0.25 }); // Safe
    stops.push({ offset: 100, color: '#10b981', opacity: 0.05 });
  }
  
  // Set up chart options
  const options = {
    series: [{
      name: `${t('legend_radon')} (${state.displayUnit})`,
      data: seriesData
    }],
    chart: {
      type: 'area',
      height: 330,
      fontFamily: 'Inter, sans-serif',
      foreColor: '#94a3b8', // text-secondary
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500
      }
    },
    dataLabels: {
      enabled: state.showChartLabels
    },
    colors: ['#06b6d4'], // cyan accent
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.05,
        colorStops: stops
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.06)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        style: {
          fontSize: '11px',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: `${t('chart_axis_title')} (${state.displayUnit})`,
        style: {
          color: '#94a3b8',
          fontSize: '12px',
          fontWeight: 600
        }
      },
      labels: {
        formatter: (val) => val.toFixed(1),
        style: {
          fontSize: '11px'
        }
      }
    },
    annotations: {
      yaxis: [{
        y: activeThreshold,
        borderColor: '#ef4444', // Danger red
        borderWidth: 2,
        strokeDashArray: 4
      }]
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'yyyy-MM-dd HH:mm'
      },
      y: {
        formatter: (val) => `${val} ${state.displayUnit}`
      }
    }
  };
  
  // Create or Update Chart
  if (state.chartInstance) {
    state.chartInstance.updateOptions(options);
  } else {
    // Clear spinner loader
    chartContainer.innerHTML = '';
    state.chartInstance = new ApexCharts(chartContainer, options);
    state.chartInstance.render();
  }
}

// Get readings filtered by current search query
function getFilteredReadings() {
  if (state.readings.length === 0) return [];
  
  const activeThreshold = getActiveThreshold();
  const query = state.tableSearchQuery.trim();
  
  return state.readings.map(r => {
    const convertedVal = convertValue(r.value, state.metadata.unit, state.displayUnit);
    const dateStr = formatDate(r.timestamp);
    const statusText = convertedVal >= activeThreshold ? t('status_danger') : t('status_safe');
    
    return {
      index: r.index,
      timestamp: r.timestamp,
      dateStr: dateStr,
      originalValue: r.value,
      value: convertedVal,
      status: statusText
    };
  }).filter(item => {
    if (!query) return true;
    return item.index.toString().includes(query) ||
           item.dateStr.toLowerCase().includes(query) ||
           item.value.toFixed(1).includes(query) ||
           item.status.toLowerCase().includes(query);
  });
}

// Render paginated data table
function renderTable() {
  const tbody = document.getElementById('table-rows');
  const filtered = getFilteredReadings();
  const totalCount = filtered.length;
  
  if (totalCount === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="table-empty">${t('table_no_match')}</td>
      </tr>
    `;
    document.getElementById('pagination-info-text').innerText = t('pagination_info_placeholder');
    document.getElementById('btn-page-prev').disabled = true;
    document.getElementById('btn-page-next').disabled = true;
    document.getElementById('page-numbers').innerHTML = '';
    return;
  }
  
  // Calculate Pagination ranges
  const maxPage = Math.ceil(totalCount / state.tablePageSize);
  if (state.tablePage > maxPage) state.tablePage = maxPage;
  if (state.tablePage < 1) state.tablePage = 1;
  
  const startIdx = (state.tablePage - 1) * state.tablePageSize;
  const endIdx = Math.min(startIdx + state.tablePageSize, totalCount);
  const pageItems = filtered.slice(startIdx, endIdx);
  
  // Update entries label info
  document.getElementById('pagination-info-text').innerText = 
    t('pagination_info_template', { start: startIdx + 1, end: endIdx, total: totalCount });
  
  // Populate Rows
  const activeThreshold = getActiveThreshold();
  const limits = RADON_LIMITS[state.displayUnit];
  
  let html = '';
  pageItems.forEach(item => {
    let badgeClass = 'status-badge safe';
    let label = t('status_safe');
    
    if (item.value >= activeThreshold) {
      badgeClass = 'status-badge danger';
      label = t('status_danger');
    } else if (item.value >= limits.WHO) {
      badgeClass = 'status-badge warning';
      label = t('status_elevated');
    }
    
    html += `
      <tr>
        <td>${item.index}</td>
        <td>${item.dateStr}</td>
        <td><strong>${formatValue(item.value, state.displayUnit)}</strong> <span class="metric-unit">${state.displayUnit}</span></td>
        <td><span class="${badgeClass}">${label}</span></td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
  
  // Configure pagination navigation buttons
  document.getElementById('btn-page-prev').disabled = state.tablePage === 1;
  document.getElementById('btn-page-next').disabled = state.tablePage === maxPage;
  
  renderPageNumbers(maxPage);
}

// Generate pagination page number list with ellipsis for scale
function renderPageNumbers(maxPage) {
  const container = document.getElementById('page-numbers');
  container.innerHTML = '';
  
  const curPage = state.tablePage;
  const range = 1; // page numbers surrounding current page
  
  // Always include Page 1
  container.appendChild(createPageButton(1, curPage === 1));
  
  if (curPage - range > 2) {
    container.appendChild(createEllipsis());
  }
  
  // Add intermediate pages
  const start = Math.max(2, curPage - range);
  const end = Math.min(maxPage - 1, curPage + range);
  for (let i = start; i <= end; i++) {
    container.appendChild(createPageButton(i, curPage === i));
  }
  
  if (curPage + range < maxPage - 1) {
    container.appendChild(createEllipsis());
  }
  
  // Always include last page
  if (maxPage > 1) {
    container.appendChild(createPageButton(maxPage, curPage === maxPage));
  }
}

function createPageButton(num, isActive) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = num;
  btn.className = isActive ? 'page-num active' : 'page-num';
  btn.addEventListener('click', () => {
    state.tablePage = num;
    renderTable();
  });
  return btn;
}

function createEllipsis() {
  const span = document.createElement('span');
  span.className = 'page-ellipsis';
  span.innerText = '...';
  return span;
}

// Export parsed and date-added data table as CSV
function exportCSV() {
  if (state.readings.length === 0) return;
  
  const activeThreshold = getActiveThreshold();
  const headers = [t('th_no'), t('th_datetime'), `${t('th_value')} (${state.displayUnit})`, t('th_status')];
  
  const rows = state.readings.map(r => {
    const val = convertValue(r.value, state.metadata.unit, state.displayUnit);
    const dateStr = formatDate(r.timestamp, true); // Include seconds in exports
    const status = val >= activeThreshold ? t('status_danger') : t('status_safe');
    return [r.index, dateStr, formatValue(val, state.displayUnit), status];
  });
  
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add headers
  csvContent += headers.map(h => `"${h}"`).join(",") + "\n";
  
  // Add data rows
  rows.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
  });
  
  // Create download link and trigger
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  
  // Customize export filename
  const cleanFilename = state.filename.replace(/\.[^/.]+$/, "");
  const exportFilename = `${cleanFilename}_processed_${state.displayUnit.replace('/', '-')}.csv`;
  link.setAttribute("download", exportFilename);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Browser Storage Cache Utilities
function saveToCache(csvText, filename) {
  try {
    localStorage.setItem('radoneye_csv_text', csvText);
    localStorage.setItem('radoneye_filename', filename);
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
  }
}

function loadFromCache() {
  try {
    const csvText = localStorage.getItem('radoneye_csv_text');
    const filename = localStorage.getItem('radoneye_filename') || '';
    if (csvText) {
      return { csvText, filename };
    }
  } catch (e) {
    console.error('Failed to load data from localStorage:', e);
  }
  return null;
}

function clearCache() {
  try {
    localStorage.removeItem('radoneye_csv_text');
    localStorage.removeItem('radoneye_filename');
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}
