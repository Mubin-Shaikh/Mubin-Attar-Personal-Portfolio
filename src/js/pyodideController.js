export class PyodideController {
  constructor() {
    this.runButton = document.getElementById('run-python-btn');
    // New icon selectors
    this.runIcon = this.runButton?.querySelector('.run-icon');
    this.loadingIcon = this.runButton?.querySelector('.loading-icon');
    
    this.codeInput = document.getElementById('pyodide-input');
    this.outputElement = document.getElementById('pyodide-output');
    this.statusElement = document.getElementById('pyodide-status');
    this.pyodideCard = document.getElementById('pyodide-card');

    this.pyodide = null;
    this.isLoading = false;

    this.init();
  }

  async init() {
    if (!this.runButton || !this.codeInput || !this.outputElement) {
        console.log("Pyodide elements not found. Skipping initialization.");
        return;
    }
    
    this.setButtonState('loading', 'Loading Pyodide...');
    
    const lazyLoad = () => this.lazyLoadPyodide();
    this.pyodideCard.addEventListener('mouseenter', lazyLoad, { once: true });
    this.pyodideCard.addEventListener('click', lazyLoad, { once: true });

    this.runButton.addEventListener('click', () => this.runPythonCode());
  }

  setButtonState(state, statusText) {
    if (!this.runButton) return;

    const isRunning = state === 'running';
    const isLoading = state === 'loading';

    this.runButton.disabled = isRunning || isLoading;
    this.updateStatus(statusText, state);

    if (this.runIcon) this.runIcon.style.display = isRunning ? 'none' : 'inline-block';
    if (this.loadingIcon) this.loadingIcon.style.display = isRunning ? 'inline-block' : 'none';
  }

  async lazyLoadPyodide() {
    if (this.pyodide || this.isLoading) return;
    this.isLoading = true;

    try {
        if (typeof loadPyodide === 'undefined') {
            throw new Error("Pyodide script not loaded.");
        }
        
        this.setButtonState('loading', 'Initializing...');
        this.pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        
        this.setButtonState('loading', 'Loading Pandas...');
        await this.pyodide.loadPackage("pandas");

        this.setButtonState('ready', 'Ready');
        this.updateStatus('Ready', 'success');

    } catch (error) {
        console.error("Pyodide initialization failed:", error);
        this.setButtonState('error', 'Error');
        this.updateStatus('Load Failed', 'error');
    } finally {
        this.isLoading = false;
    }
  }

  async runPythonCode() {
    if (!this.pyodide) {
      this.updateStatus('Pyodide not ready.', 'error');
      return;
    }

    const pythonCode = this.codeInput.value;
    this.outputElement.textContent = ''; // Clear previous output
    this.setButtonState('running', 'Executing...');

    try {
        this.pyodide.runPython(`
            import sys, io
            sys.stdout = io.StringIO()
        `);
        
        await this.pyodide.runPythonAsync(pythonCode);
        
        const stdout = this.pyodide.runPython("sys.stdout.getvalue()");
        this.outputElement.textContent = stdout || "[No output produced]";
        this.updateStatus('Success', 'success');

    } catch (error) {
        this.outputElement.textContent = `Error: ${error.message}`;
        this.updateStatus('Failed', 'error');
    } finally {
        this.setButtonState('ready', 'Ready');
    }
  }

  updateStatus(message, state = 'loading') {
    if (!this.statusElement) return;

    this.statusElement.textContent = message;
    this.statusElement.className = 'status-text'; // Reset classes
    
    if (state === 'success') this.statusElement.classList.add('success');
    else if (state === 'error') this.statusElement.classList.add('error');
    else if (state === 'running' || state === 'loading') this.statusElement.classList.add('running');
  }
}