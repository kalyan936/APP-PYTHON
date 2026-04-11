// ==================== AUTH ENGINE ====================
const AuthManager = {
    currentUser: null,

    init() {
        const savedUser = localStorage.getItem('py_learn_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.onAuthenticated(this.currentUser);
        } else {
            this.initGoogleSignIn();
        }
    },

    async initGoogleSignIn() {
        // Detect Platform
        const isNative = window.Capacitor && window.Capacitor.isNativePlatform();
        console.log("Platform Check - isNative:", isNative);

        if (isNative) {
            // NATIVE LOGIN (Android/iOS)
            const btn = document.getElementById('google-signin-btn');
            if (btn) {
                btn.onclick = async () => {
                    try {
                        const { GoogleSignIn } = window.Capacitor.Plugins;
                        const result = await GoogleSignIn.signIn({
                            clientId: '1006797435922-kjaroc53f58tg4vgepj8kjnk900l8tep.apps.googleusercontent.com',
                        });
                        console.log("Native Google Result:", result);
                        
                        const user = {
                            name: result.name || "Learner",
                            email: result.email,
                            provider: "google",
                            avatar: result.imageUrl || "👤"
                        };
                        this.onAuthenticated(user);
                    } catch (err) {
                        console.error("Native Google Login Fail:", err);
                        const errorEl = document.getElementById('auth-error');
                        errorEl.innerText = "Google Sign-In failed. Please try again.";
                        errorEl.style.display = 'block';
                    }
                };
            }
        } else {
            // WEB LOGIN (Browser)
            if (window.google) {
                google.accounts.id.initialize({
                    client_id: "1006797435922-kjaroc53f58tg4vgepj8kjnk900l8tep.apps.googleusercontent.com",
                    callback: (response) => this.handleGoogleResponse(response)
                });
                const btn = document.getElementById('google-signin-btn');
                if (btn) {
                    btn.onclick = () => google.accounts.id.prompt();
                }
            }
        }
    },

    handleGoogleResponse(response) {
        console.log("Google Auth Response:", response);
        // In a real app, you'd verify the JWT token on your backend.
        // Here we'll mock a successful login.
        const user = {
            name: "Google User",
            email: "user@gmail.com",
            provider: "google",
            avatar: "👤"
        };
        this.onAuthenticated(user);
    },

    handleEmailAuth(type) {
        const email = document.getElementById(`${type}-email`).value;
        const password = document.getElementById(`${type}-password`).value;
        const errorEl = document.getElementById('auth-error');

        if (!email || !password) {
            errorEl.innerText = "Please fill in all fields.";
            errorEl.style.display = 'block';
            return;
        }

        // Mock authentication
        const user = {
            name: type === 'signup' ? document.getElementById('signup-name').value : "Learner",
            email: email,
            provider: "email",
            avatar: "🐍"
        };
        this.onAuthenticated(user);
    },

    onAuthenticated(user) {
        this.currentUser = user;
        localStorage.setItem('py_learn_user', JSON.stringify(user));
        
        // Update UI
        const avatarEl = document.getElementById('main-avatar');
        if (avatarEl) avatarEl.innerText = user.avatar || "🐍";
        
        // Add a smooth success transition
        const authContent = document.querySelector('.auth-content');
        if (authContent) {
            authContent.style.transition = '0.5s';
            authContent.style.opacity = '0';
            authContent.style.transform = 'scale(0.95)';
        }

        setTimeout(() => {
            renderTheoryMenu(); // Ensure modules are rendered
            NavigationManager.navigateTo('screen-dashboard');
        }, 500);
    },

    logout() {
        localStorage.removeItem('py_learn_user');
        this.currentUser = null;
        window.location.reload(); // Refresh to clean state
    },

    switchTab(tab) {
        const isLogin = tab === 'login';
        const loginForm = document.getElementById('auth-login-form');
        const signupForm = document.getElementById('auth-signup-form');
        
        if (loginForm && signupForm) {
            loginForm.style.display = isLogin ? 'flex' : 'none';
            signupForm.style.display = isLogin ? 'none' : 'flex';
        }

        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-signup').classList.toggle('active', !isLogin);
        document.getElementById('auth-error').style.display = 'none';
    }
};

window.switchAuthTab = (tab) => AuthManager.switchTab(tab);
window.handleEmailAuth = (type) => AuthManager.handleEmailAuth(type);
window.AuthManager = AuthManager;

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

        // Handle Bottom Nav visibility
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            bottomNav.style.display = targetScreenId === 'screen-auth' ? 'none' : 'flex';
        }

        // Update Bottom Nav active state
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
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.2/full/pyodide.js";
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
    const modules = window.theoryModules || theoryModules;
    
    if (!theoryMenuList) return;
    if (!modules) {
        console.warn("Theory modules not found. Retrying in 1s...");
        setTimeout(renderTheoryMenu, 1000);
        return;
    }

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    modules.forEach((mod) => {
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
    // Initialize Auth
    AuthManager.init();

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
