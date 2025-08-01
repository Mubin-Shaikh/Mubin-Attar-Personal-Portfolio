// export class PyodideController {
//   constructor() {
//     this.runButton = document.getElementById('run-python-btn');
//     this.resetButton = document.getElementById('reset-python-btn');
    
//     this.runIcon = this.runButton?.querySelector('.run-icon');
//     this.loadingIcon = this.runButton?.querySelector('.loading-icon');
    
//     this.codeInput = document.getElementById('pyodide-input');
//     this.outputElement = document.getElementById('pyodide-output');
//     this.statusElement = document.getElementById('pyodide-status');
//     this.pyodideCard = document.getElementById('pyodide-card');

//     this.pyodide = null;
//     this.isLoading = false;
//     this.defaultCode = '';
    
//     // NEW: A flag to track if the script has been loaded
//     this.isScriptLoaded = false;

//     this.init();
//   }

//   async init() {
//     if (!this.runButton || !this.codeInput || !this.outputElement) {
//         console.log("Pyodide elements not found. Skipping initialization.");
//         return;
//     }
    
//     this.defaultCode = this.codeInput.value;

//     // We no longer set the button state to "Loading" on page load.
//     // It starts as "Ready" until the user interacts.
//     this.updateStatus('Ready', 'success');

//     const lazyLoad = () => this.lazyLoadPyodide();
//     this.pyodideCard.addEventListener('mouseenter', lazyLoad, { once: true });
//     this.pyodideCard.addEventListener('click', lazyLoad, { once: true });

//     this.runButton.addEventListener('click', () => this.runPythonCode());

//     if (this.resetButton) {
//       this.resetButton.addEventListener('click', () => this.resetCode());
//     }
//   }

//   // NEW METHOD: Handles dynamically adding the Pyodide <script> tag to the page
//   _loadPyodideScript() {
//     // Return a promise that resolves when the script is loaded
//     return new Promise((resolve, reject) => {
//       // If script is already loaded, resolve immediately
//       if (this.isScriptLoaded) {
//         resolve();
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
//       script.onload = () => {
//         this.isScriptLoaded = true;
//         console.log('Pyodide script loaded successfully.');
//         resolve();
//       };
//       script.onerror = () => {
//         console.error('Failed to load the Pyodide script.');
//         reject(new Error('Pyodide script loading failed.'));
//       };
//       document.head.appendChild(script);
//     });
//   }

//   setButtonState(state, statusText) {
//     // ... (This method remains unchanged)
//     if (!this.runButton) return;

//     const isRunning = state === 'running';
//     const isLoading = state === 'loading';

//     this.runButton.disabled = isRunning || isLoading;
//     this.updateStatus(statusText, state);

//     if (this.runIcon) this.runIcon.style.display = isRunning ? 'none' : 'inline-block';
//     if (this.loadingIcon) this.loadingIcon.style.display = isRunning ? 'inline-block' : 'none';
//   }

//   // UPDATED: This method now orchestrates script loading AND initialization
//   async lazyLoadPyodide() {
//     if (this.pyodide || this.isLoading) return;
//     this.isLoading = true;
//     this.setButtonState('loading', 'Loading Pyodide...');

//     try {
//       // Step 1: Wait for the script to be downloaded and ready
//       await this._loadPyodideScript();

//       // Step 2: Now that the script is loaded, the `loadPyodide` function exists globally
//       if (typeof loadPyodide === 'undefined') {
//         throw new Error("Pyodide script loaded, but `loadPyodide` is not defined.");
//       }
      
//       this.setButtonState('loading', 'Initializing...');
//       this.pyodide = await loadPyodide();
      
//       this.setButtonState('loading', 'Loading Pandas...');
//       await this.pyodide.loadPackage("pandas");

//       this.setButtonState('ready', 'Ready');
//       this.updateStatus('Ready', 'success');

//     } catch (error) {
//         console.error("Pyodide initialization failed:", error);
//         this.setButtonState('error', 'Error');
//         this.updateStatus('Load Failed', 'error');
//     } finally {
//         this.isLoading = false;
//     }
//   }

//   async runPythonCode() {
//     // ... (This method remains unchanged)
//     if (!this.pyodide) {
//       this.updateStatus('Pyodide not ready.', 'error');
//       // If the user clicks run before Pyodide is ready, trigger the lazy load
//       this.lazyLoadPyodide();
//       return;
//     }

//     const pythonCode = this.codeInput.value;
//     this.outputElement.textContent = '';
//     this.setButtonState('running', 'Executing...');

//     try {
//         this.pyodide.runPython(`
//             import sys, io
//             sys.stdout = io.StringIO()
//         `);
        
//         await this.pyodide.runPythonAsync(pythonCode);
        
//         const stdout = this.pyodide.runPython("sys.stdout.getvalue()");
//         this.outputElement.textContent = stdout || "[No output produced]";
//         this.updateStatus('Success', 'success');

//     } catch (error) {
//         this.outputElement.textContent = `Error: ${error.message}`;
//         this.updateStatus('Failed', 'error');
//     } finally {
//         this.setButtonState('ready', 'Ready');
//     }
//   }

//   updateStatus(message, state = 'loading') {
//     // ... (This method remains unchanged)
//     if (!this.statusElement) return;

//     this.statusElement.textContent = message;
//     this.statusElement.className = 'status-text';
    
//     if (state === 'success') this.statusElement.classList.add('success');
//     else if (state === 'error') this.statusElement.classList.add('error');
//     else if (state === 'running' || state === 'loading') this.statusElement.classList.add('running');
//   }

//   resetCode() {
//     // ... (This method remains unchanged)
//     if (this.codeInput) {
//       this.codeInput.value = this.defaultCode;
//       this.updateStatus('Code Reset', 'success');
//       setTimeout(() => {
//         if (this.statusElement.textContent === 'Code Reset') {
//           this.updateStatus('Ready', 'success');
//         }
//       }, 1500);
//     }
//   }
// }