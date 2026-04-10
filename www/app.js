// ==================== NAVIGATION ENGINE ====================
const NavigationManager = {
    navigateTo(targetScreenId) {
        console.log("Navigating to:", targetScreenId);
        
        // Performance optimization: prevent redundant navigations
        const currentActive = document.querySelector('.screen.active');
        if (currentActive && currentActive.id === targetScreenId) return;

        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(targetScreenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            
            // Trigger animation
            const mainContent = targetScreen.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.animation = 'none';
                mainContent.offsetHeight; 
                mainContent.style.animation = null; 
            }
        }

        // Update Bottom Nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const onclickAttr = item.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(targetScreenId)) {
                item.classList.add('active');
            }
        });
        
        const scrollable = targetScreen?.querySelector('.scrollable');
        if (scrollable) scrollable.scrollTop = 0;

        // Lazy load Pyodide ONLY when entering editor
        if (targetScreenId === 'screen-editor' && !window.pyodideInstance) {
            startPyodideInitialization();
        }
    }
};

window.navigateTo = (id) => NavigationManager.navigateTo(id);

// Global Error Logging
window.onerror = function(msg, url, line, col, error) {
    console.error(`Error: ${msg}\nLine: ${line}\nURL: ${url}`);
    return false;
};

// ==================== PYODIDE ENGINE (LAZY & OPTIMIZED) ====================
let pyodideInstance = null;
let pyodideInitInProgress = false;

async function startPyodideInitialization() {
    if (pyodideInitInProgress || pyodideInstance) return;
    pyodideInitInProgress = true;
    
    const terminal = document.getElementById('terminal-output');
    if (terminal) {
        terminal.innerHTML = '<div class="loader-pulse">Establishing Secure WebAssembly Environment...</div>';
    }

    try {
        // Load Script dynamically if not present
        if (!window.loadPyodide) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/pyodide/v1.17.0/full/pyodide.js"; // Using more stable version
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        pyodideInstance = await loadPyodide();
        await pyodideInstance.loadPackage("micropip");
        
        if (terminal) {
            terminal.innerHTML = '<span class="output-green">$ Python Engine Loaded ✓</span>\n$ Ready for execution.';
        }
        console.log("Pyodide Ready.");
    } catch (err) {
        console.error("Pyodide Load Fail:", err);
        if (terminal) {
            terminal.innerHTML = '<span style="color:#ff6b6b">$ Error: Browser version incompatible or connection timeout.</span>';
        }
    } finally {
        pyodideInitInProgress = false;
    }
}

// ==================== THEORY ENGINE ====================
function renderTheoryMenu() {
    const theoryMenuList = document.getElementById('theory-menu-list');
    if (!theoryMenuList || !window.theoryModules) return;

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    window.theoryModules.forEach((mod) => {
        const div = document.createElement('div');
        div.className = 'card theory-menu-card';
        div.onclick = () => openTheoryModule(mod.id);
        div.innerHTML = `
            <div class="module-number">${mod.id}</div>
            <div class="module-info">
                <h3 class="white-text">${mod.title}</h3>
                <p class="tag-pill" style="margin-top: 4px;">${mod.tag}</p>
            </div>
            <div class="chevron">▸</div>
        `;
        fragment.appendChild(div);
    });
    theoryMenuList.innerHTML = '';
    theoryMenuList.appendChild(fragment);
}

window.openTheoryModule = function(moduleId) {
    const mod = theoryModules.find(m => m.id === moduleId);
    if (!mod) return;

    const theoryContainer = document.getElementById('theory-dynamic-container');
    if (!theoryContainer) return;

    theoryContainer.innerHTML = `
        <h1 class="title-manrope white-text margin-bot">${mod.id}. ${mod.title}</h1>
        <p class="lesson-body margin-bot" style="font-size: 1.1rem; line-height: 1.6; color: var(--grey-text);">${mod.overview}</p>
        
        <div class="card theory-card component-margin">
            <div class="tag-pill">${mod.tag}</div>
            <h3 class="flex-align"><span class="icon">💡</span> Concept Explanation</h3>
            <p class="theory-text margin-bot" style="font-size: 1.05rem; line-height: 1.7;">${mod.explanation}</p>
            <div class="code-gimmick">
                <pre><code class="language-python">${mod.code}</code></pre>
            </div>
        </div>

        <div class="card theory-card component-margin" style="border-left: 4px solid var(--accent-purple);">
            <h3 class="flex-align"><span class="icon">✨</span> Visualization</h3>
            <p class="theory-text" style="font-style: italic;">${mod.visual}</p>
        </div>

        <div class="accordion card component-margin" onclick="this.classList.toggle('open')">
            <div class="acc-header">
                <span class="icon">⚡</span> <span>Summary Breakdown</span>
                <span class="arrow">▼</span>
            </div>
            <div class="acc-content">
                <p class="theory-body">${mod.recap}</p>
            </div>
        </div>

        <div class="card sandbox-card component-margin" style="background: var(--surface-bright); text-align: center;">
            <h3 class="white-text margin-bot">🏋️ Practice Challenge</h3>
            <p class="theory-text margin-bot" style="font-size: 1.1rem; color: #fff;">${mod.hook}</p>
            <button class="primary-btn" onclick="navigateTo('screen-editor')">Launch Code Sandbox ▸</button>
        </div>

        <div class="nav-actions flex-between margin-bot">
            <button class="text-btn grey" onclick="navigateTo('screen-theory-menu')">← Back to Curriculum</button>
        </div>
        <div style="height: 100px;"></div>
    `;

    navigateTo('screen-theory');
    
    if (window.Prism) {
        Prism.highlightAllUnder(theoryContainer);
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderTheoryMenu();

    // Quiz Logic
    window.handleQuiz = function(element, isCorrect) {
        document.querySelectorAll('#quiz-options .option').forEach(opt => {
            opt.classList.remove('selected', 'wrong-selection');
            const radio = opt.querySelector('.radio');
            radio.classList.remove('active');
            radio.innerText = '';
        });

        element.classList.add('selected');
        const radio = element.querySelector('.radio');
        radio.classList.add('active');

        if (isCorrect) {
            radio.innerText = '✔️';
            document.getElementById('quiz-accuracy').innerText = '100%';
        } else {
            element.classList.add('wrong-selection');
            radio.innerText = '❌';
            document.getElementById('quiz-accuracy').innerText = '0%';
        }
    };

    // Execution Logic
    const runBtn = document.getElementById('run-code-btn');
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            const terminal = document.getElementById('terminal-output');
            
            if (!pyodideInstance) {
                terminal.innerText = "$ Waiting for engine to initialize...\n";
                await startPyodideInitialization();
            }

            const code = document.getElementById('python-code-editor').value;
            terminal.innerText = "$ Executing sequence...\n";

            try {
                // Optimization: load only what's needed
                await pyodideInstance.loadPackagesFromImports(code);
                
                // Set output
                pyodideInstance.setStdout({ batched: (msg) => { terminal.innerText += msg + "\n"; } });
                
                await pyodideInstance.runPythonAsync(code);
                terminal.innerText += "\n[Process Completed]";
                
                // Success notification
                const successMsg = document.querySelector('.success-notification');
                successMsg.style.display = 'flex';
                setTimeout(() => { successMsg.style.display = 'none'; }, 2500);
            } catch (err) {
                let cleanErr = err.toString().split('File "<exec>"').pop();
                terminal.innerText += "\n[Exception] " + cleanErr.trim();
            }
        });
    }

    // Clear Terminal
    const clearBtn = document.querySelector('.debug-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('terminal-output').innerText = "$ Console cleared.";
        });
    }

    // Dynamic Style Injection for speed
    const style = document.createElement('style');
    style.innerHTML = `
        .loader-pulse { animation: pulse 1.5s infinite; color: var(--amber); font-weight: 600; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .screen.active .main-content { animation: slideUpFade 0.25s ease-out forwards; }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .success-notification { display: none; }
    `;
    document.head.appendChild(style);
});
