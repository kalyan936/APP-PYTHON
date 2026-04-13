// ==================== AUTH MODULE (SECURE & PERSISTENT) ====================
const Auth = {
    currentUser: null,

    init() {
        console.log("Auth System Initializing...");
        const saved = localStorage.getItem('pylearn_session');
        if (saved) {
            try {
                this.currentUser = JSON.parse(saved);
                console.log("Session restored:", this.currentUser.email || "Guest");
                this.onSignedIn(this.currentUser, false);
            } catch(e) {
                console.error("Session corruption. Clearing cache.");
                localStorage.removeItem('pylearn_session');
            }
        }
    },

    onSignedIn(user, navigateToDash = true) {
        this.currentUser = user;
        localStorage.setItem('pylearn_session', JSON.stringify(user));
        this.updateUI(user);
        
        if (navigateToDash) {
            NavigationManager.navigateTo('screen-dashboard');
        }
    },

    signOut() {
        console.log("Closing Neural Link...");
        this.currentUser = null;
        localStorage.removeItem('pylearn_session');
        
        // Disable auto-select to prevent infinite loops on reload
        if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
        
        this.updateUI(null);
        NavigationManager.navigateTo('screen-login');
    },

    updateUI(user) {
        const avatarEl = document.getElementById('main-avatar');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileAvatar = document.getElementById('profile-avatar-img');
        const profileBadge = document.getElementById('profile-badge');
        const authSection = document.getElementById('profile-auth-section');

        if (user) {
            const isGuest = user.isGuest;
            const displayName = isGuest ? 'Guest Architect' : (user.name || 'User');
            const displayEmail = isGuest ? 'Neural Sync Disabled' : (user.email || 'Cloud Connection Active');
            const imageHtml = (!isGuest && user.picture) ? `<img src="${user.picture}" alt="avatar">` : '🐍';

            if (avatarEl) avatarEl.innerHTML = imageHtml;
            if (profileAvatar) profileAvatar.innerHTML = imageHtml;
            if (profileName) profileName.textContent = displayName;
            if (profileEmail) profileEmail.textContent = displayEmail;
            
            if (profileBadge) {
                profileBadge.textContent = isGuest ? 'GUEST' : 'ELITE';
                profileBadge.className = `profile-badge ${isGuest ? 'guest' : 'google'}`;
            }

            if (authSection) {
                if (isGuest) {
                    authSection.innerHTML = `
                        <p class="login-disclaimer" style="margin-bottom:15px;">Connect your Google ID to persist progress across the Nexus.</p>
                        <button class="primary-btn" onclick="navigateTo('screen-login')">Connect Neural Link</button>
                    `;
                } else {
                    authSection.innerHTML = `
                        <div class="user-row" style="margin-bottom:15px;">
                            <span class="overline-text">LOGGED IN AS</span>
                            <p style="font-weight:700;">${user.email}</p>
                        </div>
                        <button class="signout-btn" onclick="Auth.signOut()">Sever Connection</button>
                    `;
                }
            }
        } else {
            if (avatarEl) avatarEl.textContent = '🐍';
        }
    }
};

// ==================== GOOGLE AUTH HELPERS ====================
window.handleGoogleSignIn = function(response) {
    console.log("Decoding Neural Credentials...");
    try {
        const base64Url = response.credential.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
            base64 += '='.repeat(4 - pad);
        }
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const user = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            id: payload.sub,
            isGuest: false
        };
        
        Auth.onSignedIn(user, true);
    } catch(e) {
        console.error('Authentication Sequence Failure:', e);
        alert('Authentication failed. Please check your credentials.');
    }
};

window.handleNativeGoogleSignIn = async function() {
    try {
        console.log("Initiating Native Capacitor Google Auth...");
        if (!window.Capacitor || !window.Capacitor.Plugins.GoogleSignIn) {
            throw new Error("Native Plugin Not Found");
        }
        
        const result = await window.Capacitor.Plugins.GoogleSignIn.signIn();
        if (result.idToken) {
            // Verify and decode ID token similar to Web
            const base64Url = result.idToken.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const pad = base64.length % 4;
            if (pad) {
                base64 += '='.repeat(4 - pad);
            }
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            const user = {
                name: payload.name || (result.user && result.user.givenName) || 'Native User',
                email: payload.email || (result.user && result.user.email),
                picture: payload.picture || (result.user && result.user.imageUrl),
                id: payload.sub || (result.user && result.user.id),
                isGuest: false
            };
            Auth.onSignedIn(user, true);
        }
    } catch(e) {
        console.error('Native Auth Failure:', e);
        alert('Native sign-in failed. Error: ' + e.message);
    }
};

window.signInAsGuest = function() {
    Auth.onSignedIn({ name: 'Guest', isGuest: true }, true);
};

// ==================== NAVIGATION ENGINE ====================
const NavigationManager = {
    navigateTo(targetId) {
        console.log("Shifting perspective to:", targetId);
        
        const screens = document.querySelectorAll('.screen');
        const target = document.getElementById(targetId);
        
        if (!target) return;

        screens.forEach(s => s.classList.remove('active'));
        target.classList.add('active');

        // Scroll safety
        const scroller = target.querySelector('.scrollable');
        if (scroller) scroller.scrollTop = 0;

        // Bottom Nav Sync
        document.querySelectorAll('.nav-item').forEach(btn => {
            const clickAction = btn.getAttribute('onclick') || "";
            btn.classList.toggle('active', clickAction.includes(targetId));
        });

        // Contextual Actions
        if (targetId === 'screen-editor' && !window.pyodideInstance) {
            startPyodideInitialization();
        }
    }
};

window.navigateTo = (id) => NavigationManager.navigateTo(id);

// ==================== PYODIDE (WASM ENGINE) ====================
let pyodideInstance = null;
let pyodideLoading = false;

async function startPyodideInitialization() {
    if (pyodideLoading || pyodideInstance) return;
    pyodideLoading = true;
    
    const term = document.getElementById('terminal-output');
    if (term) term.innerHTML = '<div class="loader-pulse">Initializing WASM Neural Core...</div>';

    try {
        if (!window.loadPyodide) {
            await new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
                s.async = true;
                s.onload = res;
                s.onerror = (e) => rej(new Error("CDN Load Failure: Check connection/CSP."));
                document.head.appendChild(s);
            });
        }

        pyodideInstance = await loadPyodide();
        await pyodideInstance.loadPackage(["numpy", "pandas", "micropip"]);
        
        if (term) {
            term.innerHTML = '<span style="color:var(--green)">$ Neural Engine Online ✓</span>\n$ Standard Ops Active: NumPy, Pandas\n$ Ready for execution commands.';
        }
    } catch (e) {
        console.error("Engine failure:", e);
        if (term) term.innerHTML = `<span style="color:var(--red)">$ Protocol Error: ${e.message}</span>`;
    } finally {
        pyodideLoading = false;
    }
}

// ==================== THEORY & CURRICULUM ====================
function renderTheoryMenu() {
    const list = document.getElementById('theory-menu-list');
    const modules = window.theoryModules;
    
    if (!list || !modules) return;

    list.innerHTML = modules.map(mod => `
        <div class="card theory-menu-card glass" onclick="openTheoryModule(${mod.id})">
            <div class="module-number">${mod.id}</div>
            <div class="module-info">
                <h3 class="white-text" style="font-size:1rem;">${mod.title}</h3>
                <p class="overline-text" style="margin-top:4px; font-size:0.55rem;">${mod.tag}</p>
            </div>
            <div class="chevron">▸</div>
        </div>
    `).join('');
}

window.openTheoryModule = function(id) {
    const mod = theoryModules.find(m => m.id === id);
    if (!mod) return;

    const container = document.getElementById('theory-dynamic-container');
    container.innerHTML = `
        <div class="theory-header" style="margin-bottom:30px;">
            <p class="overline-text" style="color:var(--accent-blue)">MODULE ${mod.id}</p>
            <h1 class="title-outfit white-text" style="font-size:2rem; line-height:1.2;">${mod.title}</h1>
        </div>

        <p class="theory-text" style="font-size:1.1rem; color:var(--text-main); margin-bottom:30px;">${mod.overview}</p>

        <div class="card glass-bright">
            <div class="pill-label purple">${mod.tag}</div>
            <h3 class="white-text" style="margin-bottom:15px; display:flex; align-items:center; gap:10px;">
                <span style="font-size:1.4rem;">💡</span> Conceptual Matrix
            </h3>
            <div class="theory-text" style="font-size:1rem;">${mod.explanation}</div>
            <div class="code-snippet glass-dark">
                <pre><code class="language-python">${mod.code}</code></pre>
            </div>
        </div>

        <div class="card glass" style="border-left: 4px solid var(--accent-purple);">
            <h3 class="white-text" style="margin-bottom:10px; font-size:1rem;">✨ Neuro-Visualization</h3>
            <p class="theory-text" style="font-style: italic; font-size:0.9rem;">${mod.visual}</p>
        </div>

        <div class="accordion card glass" onclick="this.classList.toggle('open')">
            <div class="acc-header">
                <span class="white-text" style="font-weight:700; font-size:0.9rem;">⚡ Efficiency Breakdown</span>
                <span class="arrow" style="transition:0.3s">▼</span>
            </div>
            <div class="acc-content theory-text">${mod.recap}</div>
        </div>

        <div class="card primary-grad" style="text-align:center;">
            <h3 class="white-text">Neural Challenge</h3>
            <p class="white-text" style="margin: 10px 0 20px; font-size:0.9rem; opacity:0.9;">${mod.hook}</p>
            <button class="primary-btn white" onclick="navigateTo('screen-editor')">Initialize Sandbox</button>
        </div>
        
        <div style="height:100px;"></div>
    `;

    navigateTo('screen-theory');
    if (window.Prism) Prism.highlightAllUnder(container);
};

// ==================== CORE INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c PY-LEARN NEURAL SYSTEM ONLINE ", "background: #7000ff; color: #fff; font-weight: 800; padding: 5px 10px; border-radius: 5px;");
    
    Auth.init();
    renderTheoryMenu();

    // If no active session, force login
    if (!Auth.currentUser) {
        NavigationManager.navigateTo('screen-login');
    }

    // Execution Logic
    const runBtn = document.getElementById('run-code-btn');
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            const term = document.getElementById('terminal-output');
            const code = document.getElementById('python-code-editor').value;
        
        if (!pyodideInstance) {
            term.innerHTML = "$ Initializing WASM Core...\n";
            await startPyodideInitialization();
        }

        term.innerText = "$ Executing sequence...\n";

        try {
            term.innerText += "$ Analyzing imports for ML modules...\n";
            await pyodideInstance.loadPackagesFromImports(code);
            
            pyodideInstance.setStdout({ 
                batched: (msg) => { term.innerText += msg + "\n"; term.scrollTop = term.scrollHeight; } 
            });
            pyodideInstance.setStderr({
                batched: (msg) => { term.innerText += "[Warning] " + msg + "\n"; term.scrollTop = term.scrollHeight; }
            });
            
            await pyodideInstance.runPythonAsync(code);
            term.innerText += "\n[Process Completed]";
            
            // Show Success Notification
            const note = document.querySelector('.success-notification');
            if (note) {
                note.style.display = 'flex';
                setTimeout(() => note.style.display = 'none', 3000);
            }
        } catch (e) {
            let errorText = e.toString();
            const execIndex = errorText.indexOf('File "<exec>"');
            if (execIndex !== -1) {
                errorText = 'Traceback (most recent call last):\n  ' + errorText.substring(execIndex);
            } else {
                // If the error occurred outside of standard execution (e.g. module missing)
                errorText = errorText.split('\n').pop() || errorText;
            }
            term.innerText += `\n[Exception]\n${errorText}`;
        }
        term.scrollTop = term.scrollHeight;
        });
    }

    // Reset Terminal
    const debugBtn = document.querySelector('.debug-btn');
    if (debugBtn) {
        debugBtn.addEventListener('click', () => {
            document.getElementById('terminal-output').innerText = "$ Terminal reset.";
            document.getElementById('python-code-editor').value = "";
        });
    }

    // Detect Native Platform to swap Google Sign In Buttons
    if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
        const webSignIn = document.getElementById('web-google-signin');
        const nativeSignIn = document.getElementById('native-google-signin');
        if (webSignIn && nativeSignIn) {
            webSignIn.style.display = 'none';
            nativeSignIn.style.display = 'flex';
        }
        
        // Initialize Native Plugin if available
        if (window.Capacitor.Plugins.GoogleSignIn) {
            window.Capacitor.Plugins.GoogleSignIn.initialize({
                clientId: '1006797435922-blgc259idks35vsq5dnbn5qpd180vq67.apps.googleusercontent.com'
            }).catch(console.error);
        }
    }

    // Quiz Handler
    window.handleQuiz = (el, isCorrect) => {
        const options = document.querySelectorAll('#quiz-options .option');
        options.forEach(o => {
            o.classList.remove('selected', 'wrong-selection');
            o.querySelector('.radio').innerText = '';
        });

        el.classList.add('selected');
        if (isCorrect) {
            el.querySelector('.radio').innerText = '✓';
            document.getElementById('quiz-accuracy').innerText = '100%';
        } else {
            el.classList.add('wrong-selection');
            el.querySelector('.radio').innerText = '×';
            document.getElementById('quiz-accuracy').innerText = '0%';
        }
    };
});
