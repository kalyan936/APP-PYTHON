// ==================== AUTH MANAGER ====================
// To enable Google Sign-In:
// 1. Go to: https://console.cloud.google.com/apis/credentials
// 2. Create an OAuth 2.0 Client ID (Web application)
// 3. Replace the string below with your actual Client ID
// Global Error Logging for Debugging
window.onerror = function(msg, url, line, col, error) {
    const errStr = `Error: ${msg}\nLine: ${line}\nURL: ${url}`;
    console.error(errStr);
    // If there's a terminal on screen, show it there too
    const term = document.getElementById('terminal-output');
    if (term) term.innerText += `\n[Fatal Script Error] ${errStr}`;
    return false;
};

console.log("PY-Learn app.js initializing...");

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const ADMIN_EMAIL    = 'admin@pylearn.com';
const ADMIN_PASS     = 'PyLearn@Admin2026';

const AuthManager = {
    async hashPassword(password) {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn("Secure context not detected. Using insecure fallback for hash.");
            return btoa(password + 'pylearn_fallback_salt');
        }
        const enc = new TextEncoder();
        const data = enc.encode(password + 'pylearn_secure_salt_2026');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // --- Global Navigation Engine ---
    navigateTo(targetScreenId) {
        console.log("Navigating to:", targetScreenId);
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(targetScreenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            const mainContent = targetScreen.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.animation = 'none';
                mainContent.offsetHeight; 
                mainContent.style.animation = null; 
            }
        }

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const ontouchAttr = item.getAttribute('onclick');
            if (ontouchAttr && ontouchAttr.includes(targetScreenId)) {
                item.classList.add('active');
            }
        });
        
        const scrollable = targetScreen?.querySelector('.scrollable');
        if (scrollable) scrollable.scrollTop = 0;

        if (targetScreenId === 'screen-editor' && !window.pyodideReadyPromise) {
            window.pyodideReadyPromise = initPyodide();
        }
    },

    getUsers() {
        return JSON.parse(localStorage.getItem('pylearn_users') || '[]');
    },
    saveUsers(users) {
        localStorage.setItem('pylearn_users', JSON.stringify(users));
    },
    setSession(user) {
        const safeUser = { ...user };
        delete safeUser.password; // Never store password hash in session
        localStorage.setItem('pylearn_session', JSON.stringify(safeUser));
    },
    getSession() {
        return JSON.parse(localStorage.getItem('pylearn_session') || 'null');
    },
    clearSession() {
        localStorage.removeItem('pylearn_session');
    },

    async login() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        const btn = document.getElementById('login-btn');
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        if (!email || !password) { errorEl.textContent = '⚠️ Please fill in all fields.'; errorEl.style.display = 'block'; return; }
        btn.textContent = 'Verifying...';
        btn.disabled = true;

        // ── Admin Route ──
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
            btn.textContent = 'Sign In ▸'; btn.disabled = false;
            showAdminPanel();
            return;
        }

        const hash = await this.hashPassword(password);
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === hash);
        if (!user) {
            errorEl.textContent = '❌ Invalid email or password.';
            errorEl.style.display = 'block';
            btn.textContent = 'Sign In ▸'; btn.disabled = false; return;
        }
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);
        this.setSession(user);
        this.onLoginSuccess(user);
    },

    async register() {
        const name = document.getElementById('reg-name').value.trim();
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const errorEl = document.getElementById('reg-error');
        const btn = document.getElementById('register-btn');
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        if (!name || !username || !email || !password) { errorEl.textContent = '⚠️ Please fill in all fields.'; errorEl.style.display = 'block'; return; }
        if (password.length < 6) { errorEl.textContent = '⚠️ Password must be at least 6 characters.'; errorEl.style.display = 'block'; return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = '⚠️ Please enter a valid email.'; errorEl.style.display = 'block'; return; }
        btn.textContent = 'Creating Account...';
        btn.disabled = true;
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            errorEl.textContent = '❌ Email already registered. Please sign in.';
            errorEl.style.display = 'block';
            btn.textContent = 'Create Account ▸'; btn.disabled = false; return;
        }
        const hash = await this.hashPassword(password);
        const newUser = {
            id: 'user_' + Date.now(),
            name, username: username.replace('@', ''), email,
            password: hash, provider: 'email',
            createdAt: new Date().toISOString(),
            loginCount: 1, lastLogin: new Date().toISOString()
        };
        users.push(newUser);
        this.saveUsers(users);
        this.setSession(newUser);
        this.onLoginSuccess(newUser);
    },

    googleSignIn() {
        console.log("AuthManager: googleSignIn initiated");
        // Direct login for testing efficiency
        const testEmail = "testuser@gmail.com";
        const testName = "Test Developer";

        const mockPayload = {
            email: testEmail,
            name: testName,
            picture: null
        };
        
        this._mockGoogleResponse(mockPayload);
    },

    _mockGoogleResponse(payload) {
        const users = this.getUsers();
        let user = users.find(u => u.email === payload.email);
        if (!user) {
            user = {
                id: 'guser_' + Date.now(),
                name: payload.name, username: payload.email.split('@')[0],
                email: payload.email, password: null, provider: 'google',
                avatar: payload.picture, createdAt: new Date().toISOString(),
                loginCount: 1, lastLogin: new Date().toISOString()
            };
            users.push(user);
        } else {
            user.loginCount = (user.loginCount || 0) + 1;
            user.lastLogin = new Date().toISOString();
        }
        this.saveUsers(users);
        this.setSession(user);
        this.onLoginSuccess(user);
    },
    onLoginSuccess(user) {
        console.log("AuthManager: Login success for", user.email);
        const initial = user.name.charAt(0).toUpperCase();
        // Update all avatar elements
        document.querySelectorAll('.avatar').forEach(el => {
            el.textContent = initial;
            el.style.background = 'linear-gradient(135deg, #c0c1ff, #4b4dd8)';
            el.style.color = '#fff';
            el.style.fontWeight = '700';
            el.style.cursor = 'pointer';
            el.onclick = () => toggleProfileDropdown();
        });
        // Sync profile dropdown content
        const dropdownInitial = document.getElementById('dropdown-initial');
        const dropdownName = document.getElementById('dropdown-user-name');
        const dropdownEmail = document.getElementById('dropdown-user-email');
        if (dropdownInitial) dropdownInitial.textContent = initial;
        if (dropdownName) dropdownName.textContent = user.name;
        if (dropdownEmail) dropdownEmail.textContent = user.email;

        // Navigate to dashboard
        this.navigateTo('screen-dashboard');
    },

    logout() {
        this.clearSession();
        const dd = document.getElementById('profile-dropdown');
        if (dd) dd.classList.remove('open');
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screen-auth').classList.add('active');
        document.querySelectorAll('.avatar').forEach(el => {
            el.textContent = '\ud83d\udc68\u200d\ud83d\udcbc';
            el.removeAttribute('style');
            el.onclick = null;
        });
    },

    exportToExcel() {
        console.warn("Excel export feature has been removed.");
    },

    checkAndAutoLogin() {
        const session = this.getSession();
        if (session) { this.onLoginSuccess(session); }
    }
};

function switchAuthTab(tab) {
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginErr = document.getElementById('login-error');
    const regErr = document.getElementById('reg-error');
    // Clear and hide errors
    loginErr.textContent = ''; loginErr.style.display = 'none';
    regErr.textContent = '';   regErr.style.display = 'none';
    if (tab === 'login') {
        loginForm.style.display = 'flex'; registerForm.style.display = 'none';
        loginTab.classList.add('active'); registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none'; registerForm.style.display = 'flex';
        loginTab.classList.remove('active'); registerTab.classList.add('active');
    }
}

// ==================== ADMIN PANEL ====================
function showAdminPanel() {
    // Switch to admin screen
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-admin').classList.add('active');
    renderAdminTable();
}

function renderAdminTable() {
    const users = AuthManager.getUsers();
    const tbody = document.getElementById('admin-user-tbody');
    const countEl = document.getElementById('admin-user-count');
    const todayEl = document.getElementById('admin-today-count');
    const activeEl = document.getElementById('admin-active-count');

    if (countEl) countEl.textContent = users.length;

    // Compute stats
    const now = new Date();
    const todayStr = now.toDateString();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    if (todayEl) {
        const todayCount = users.filter(u => new Date(u.createdAt).toDateString() === todayStr).length;
        todayEl.textContent = todayCount;
    }
    if (activeEl) {
        const activeCount = users.filter(u => new Date(u.lastLogin) >= sevenDaysAgo).length;
        activeEl.textContent = activeCount;
    }

    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--grey-text);padding:2rem;">No users registered yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map((u, i) => `
        <tr class="admin-row" style="animation-delay:${i * 0.05}s">
            <td>${i + 1}</td>
            <td>
                <div class="admin-user-name">${u.name}</div>
                <div class="admin-user-sub">@${u.username}</div>
            </td>
            <td><a href="mailto:${u.email}" class="admin-email-link">${u.email}</a></td>
            <td><span class="admin-badge ${u.provider === 'google' ? 'badge-google' : 'badge-email'}">${u.provider || 'email'}</span></td>
            <td>${new Date(u.createdAt).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</td>
            <td>${new Date(u.lastLogin).toLocaleString('en-IN', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</td>
            <td><span class="admin-count-badge">${u.loginCount || 1}</span></td>
        </tr>
    `).join('');
}

function exportAdminExcel() {
    console.warn("Admin Excel export disabled.");
}

function adminLogout() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-auth').classList.add('active');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    switchAuthTab('login');
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

// Expose to window for HTML onclick handlers
window.AuthManager = AuthManager;
window.navigateTo = (...args) => AuthManager.navigateTo(...args);
window.switchAuthTab = switchAuthTab;
window.showAdminPanel = showAdminPanel;
window.renderAdminTable = renderAdminTable;
window.exportAdminExcel = exportAdminExcel;
window.adminLogout = adminLogout;
window.toggleProfileDropdown = toggleProfileDropdown;

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown && dropdown.classList.contains('open')) {
        if (!dropdown.contains(e.target) && !e.target.classList.contains('avatar')) {
            dropdown.classList.remove('open');
        }
    }
});

// ==================== THEORY MODULES ====================
const theoryModules = [
    {
        id: 1,
        title: "Introduction to Python",
        tag: "THE GENESIS",
        overview: "Welcome to the world of Python, the most influential programming language of the 21st century. Whether you are aiming to build the next generation of AI, analyze the global economy, or simply automate your daily tasks, Python is the gateway to your future. It is a language designed not just to be executed by machines, but to be read by humans.",
        explanation: `<strong>1. The Philosophy of Zen:</strong> Python follows a strict set of principles known as the 'Zen of Python'. One of its core tenets is: <em>"Beautiful is better than ugly."</em> This means Python code is intentionally designed to look clean, organized, and almost like the English language. Unlike traditional languages that use complex brackets <code>{ }</code> and semicolons <code>;</code>, Python uses whitespace (indentation). This isn't just a style choice—it's a requirement that forces developers to write readable code.<br><br>
        <strong>2. Why Python Dominates Today:</strong><br>
        • <strong>AI and Machine Learning:</strong> 90% of AI research is done in Python. Libraries like TensorFlow and PyTorch have made it the heartbeat of Silicon Valley.<br>
        • <strong>Data Science:</strong> From predicting weather patterns to analyzing stock markets, Python's Pandas and NumPy libraries are the industry standard.<br>
        • <strong>Web Backend:</strong> Instagram, Spotify, and Pinterest all run on Python-based frameworks like Django and Flask.<br>
        • <strong>NASA & SpaceX:</strong> From controlling telescopes to launching rockets, Python is used for critical mission-control software.<br><br>
        <strong>3. The Interpreter Advantage:</strong> Python is an <em>Interpreted</em> language. This means that unlike languages like C++, you don't have to wait for your plan to 'compile' into a file. You write a line, and Python executes it instantly. This creates a tight feedback loop that is perfect for learning and rapid prototyping.<br><br>
        <strong>4. The Ecosystem (Batteries Included):</strong> Python is famous for its 'Batteries Included' philosophy. This means that out of the box, it comes with a massive library of tools to handle everything from internet protocols to complex mathematics. If Python doesn't have it built-in, the community has likely created a 'Package' for it among the 400,000+ available on PyPI.`,
        code: `# Your journey begins with a simple output
print("Establishing connection with the Python environment...")

# Python is self-documenting. Use comments to explain your 'why'
# The computer ignores these lines, but they are vital for your team

x = 10
y = 20

# Python executes logic top-to-bottom
if x < y:
    print("Logic confirmed: 10 is indeed less than 20.")
    print("Notice how this line is indented? That signifies it belongs to the 'if' block.")`,
        visual: "A glowing, neon-green digital bridge appearing out of thin air, connecting a human consciousness to a massive, pulsating crystalline computer core.",
        recap: "Python is a high-level, interpreted language focused on readability.<br>It is the primary language for Artificial Intelligence and Data Science.<br>Indentation is mandatory and defines the structure of your program.<br>It follows the 'Zen of Python' principle: Simple is better than complex.",
        hook: "Run your first script! Type: print('I am starting my career as a Python Developer') and watch the terminal respond."
    },
    {
        id: 2,
        title: "Variables",
        tag: "DIGITAL CONTAINERS",
        overview: "Variables are the memory of your program. Without them, a computer would have no way to remember a user's name, a player's score, or the status of a mission. In Python, variables are like 'intelligent jars' that automatically adapt to whatever you put inside them.",
        explanation: `<strong>1. The Assignment Operator (=):</strong> In math, = means 'is equal to'. In Python, it means 'RECEIVE'. When you write <code>score = 100</code>, you are telling the computer to create a memory slot named 'score' and slide the value 100 inside it.<br><br>
        <strong>2. Dynamic Typing (The Python Power):</strong> In languages like Java or C, you must tell the computer: 'This jar will ONLY ever hold numbers.' If you try to put text in it, the program crashes. Python is different. It is <em>Dynamically Typed</em>. This means you can store a number in a variable, and later replace it with text or a list. The variable adapts to the data.<br><br>
        <strong>3. Variable Naming Conventions:</strong><br>
        • <strong>Lower_snake_case:</strong> This is the standard for variables (e.g., <code>user_score</code>, <code>is_logged_in</code>).<br>
        • <strong>Meaningful Names:</strong> Never name a variable <code>x</code> if it stores a price. Use <code>product_price</code>. This makes your code 'Self-Documenting'.<br>
        • <strong>Reserved Words:</strong> You cannot name a variable <code>print</code> or <code>if</code>, as these are reserved for Python's own internal commands.<br><br>
        <strong>4. Memory Addresses:</strong> Under the hood, Python doesn't actually 'put the value in the jar'. It puts the value in a physical location in your RAM and makes the variable name 'point' to that location. If you change the value, the variable points to a new location. This is why Python is so memory-efficient with large datasets.`,
        code: `# Assignment
player_name = "Stitch"
player_health = 100
is_ready = True

print(f"Player {player_name} starting with {player_health} HP.")

# Dynamic Typing in Action
# We update the 'player_health' from a number to a status string
player_health = "Critical Condition"
print(f"Status Update: {player_health}")

# Multiple Assignment
a, b, c = 1, 2, 3
print(f"Rapid variables: {a}, {b}, {c}")`,
        visual: "A massive, infinitely tall warehouse where robotic arms are slapping holographic labels onto glowing crystal canisters of light.",
        recap: "Variables are named references to memory locations.<br>Python uses '=' to assign values, moving from right to left.<br>Dynamic typing allows variables to change their data type at runtime.<br>Use snake_case and descriptive names for all variable declarations.",
        hook: "Create three variables: 'city', 'country', and 'population'. Print them in a single sentence using an f-string!"
    },
    {
        id: 3,
        title: "Operators",
        tag: "LOGIC ENGINES",
        overview: "Operators are the 'verbs' of the programming world. They are the symbols that indicate a specific action should be performed on your data. Whether you are building a calculator, a physics engine for a game, or a facial recognition system, operators are what make the data MOVE.",
        explanation: `<strong>1. Arithmetic Operators (The Mathematician):</strong><br>
        • <code>**</code> (Exponentiation): Calculate powers (e.g., 2**3 is 8).<br>
        • <code>//</code> (Floor Division): Divides and rounds DOWN to the nearest whole number.<br>
        • <code>%</code> (Modulo): Returns only the remainder. This is used in coding to check if numbers are even/odd or to create scrolling loops.<br><br>
        <strong>2. Comparison Operators (The Decision Maker):</strong> These compare two items and return a <code>Boolean</code> (True or False).<br>
        • <code>==</code>: Checks if values are identical. (Note: different from the single = assignment operator).<br>
        • <code>!=</code>: Checks if values are NOT identical.<br><br>
        <strong>3. Logical Operators (The Architect):</strong> These allow you to build complex 'if/then' rules.<br>
        • <code>and</code>: Returns True only if BOTH conditions are met.<br>
        • <code>or</code>: Returns True if at least ONE condition is met.<br>
        • <code>not</code>: Reverses the result (True becomes False).<br><br>
        <strong>4. Assignment Operators:</strong> Shortcuts for updating variables. <code>score += 10</code> is the same as <code>score = score + 10</code>. This is used thousands of times in professional game loops and financial tracking systems.`,
        code: `# Arithmetic: The power of Modulo
number = 15
print(f"Is {number} Even? {number % 2 == 0}")

# Logic: Building a Security Check
user_age = 25
has_permission = True
banned = False

# Complex logical chain
access_granted = (user_age >= 21 or has_permission) and not banned
print(f"System Access: {access_granted}")

# Augmented Assignment
gold = 100
gold += 50 # Add loot
gold *= 2  # Double with a power-up
print(f"Total Gold: {gold}")`,
        visual: "A massive, brass Victorian-era mechanical computer where giant gears with symbols (+, -, *, /) interlock perfectly to output glowing numbers.",
        recap: "Arithmetic operators handle numeric math and exponents.<br>Comparison operators are the basis of all computer decisions.<br>Logical operators (and, or, not) combine multiple conditions.<br>Augmented assignment (+=, -=) provides a concise way to update data.",
        hook: "Calculate 2 raised to the power of 10 using the ** operator and check if it is greater than 1000!"
    },
    {
        id: 4,
        title: "Input & Output",
        tag: "HUMAN INTERFACE",
        overview: "A program that cannot interact with a human is just a silent box of code. Input and Output (I/O) are the digital sensory organs of your application. They allow your script to 'listen' to the user and 'speak' through the screen.",
        explanation: `<strong>1. Output with f-strings (The Modern Standard):</strong> In the past, joining text and variables was messy. Today, we use <em>Formatted String Literals</em>. By placing an <code>f</code> before the opening quote, you can drop any variable directly into curly braces <code>{ }</code>. It is fast, readable, and handles different data types automatically.<br><br>
        <strong>2. The Input Function:</strong> This function pauses the entire program and waits for the user to type something and press 'Enter'. This is how we build interactive chatbots, CLI tools, and login screens.<br><br>
        <strong>3. The Data Type Trap (CRITICAL):</strong> The <code>input()</code> function is 'type-blind'. It treats everything—even numbers—as <strong>Text (Strings)</strong>. If you ask for a user's age and they type '25', Python sees it as the word '25', not the number. You cannot do math with words! To fix this, you must 'wrap' the input in a converter like <code>int()</code> or <code>float()</code>.<br><br>
        <strong>4. Escape Characters:</strong> Sometimes you need to format your output with more than just words. Use <code>\\n</code> for a new line or <code>\\t</code> for a tab space. This allows you to create structured tables and professional-looking reports in the terminal.`,
        code: `# Phase 1: Interactive Conversation
user_name = input("Identify yourself, Engineer: ")
print(f"Hello, {user_name}. Accessing neural network...\\n")

# Phase 2: Numeric Input with Casting
# We take the input and immediately convert it to float (decimal number)
current_temp = float(input("Enter current reactor temperature (°C): "))
threshold = 100.5

if current_temp > threshold:
    print(f"WARNING: Temperature {current_temp} exceeds safety margin of {threshold}!")
else:
    print("Reactor status: STABLE")

# Phase 3: Multi-line reporting
print("\\n--- SYSTEM REPORT ---")
print(f"USER:\\t{user_name}")
print(f"STATUS:\\tOperational")`,
        visual: "A high-definition holographic console where glowing text cascades down in front of a user, responding in real-time to their touch and voice commands.",
        recap: "print() is used to display data; f-strings are the preferred formatting method.<br>input() always returns data as a String (Text).<br>Explicit casting (int(), float()) is required to use input for math.<br>Escape characters like \\n and \\t allow for structured text formatting.",
        hook: "Write a script that asks the user for two numbers, multiplies them, and prints the result in a friendly message!"
    },
    {
        id: 5,
        title: "Data Types",
        tag: "NATURE OF DATA",
        overview: "In Python, everything has a 'Nature'. Data Types define what a piece of data is, what it can do, and how it is stored in your computer's brain. Mastering these types is the difference between writing 'scripts' and building 'software'.",
        explanation: `<strong>1. Integers (int):</strong> Whole numbers without decimals. They can be positive, negative, or zero. In Python, integers have <em>arbitrary precision</em>, meaning they can grow as large as your computer's memory allows. You can calculate the number of atoms in the universe without fear of 'overflow'.<br><br>
        <strong>2. Floating Point Numbers (float):</strong> These represent real numbers with a decimal point. While extremely powerful, they are slightly less precise than integers due to how computers handle binary fractions. Use them for coordinates, currency (usually), and scientific measurements.<br><br>
        <strong>3. Strings (str):</strong> Any sequence of characters wrapped in quotes. Strings in Python are <em>Immutable</em>, meaning once you create a string, you cannot change a single character inside it—you must create a new string instead.<br><br>
        <strong>4. Booleans (bool):</strong> The simplest but most powerful type. It can only be <code>True</code> or <code>False</code>. They are the foundation of all computer logic, acting as the 'On/Off' switches of your code.<br><br>
        <strong>5. Sequence and Mapping Types:</strong> Python also includes complex types like Lists, Tuples, and Dictionaries which act as 'Compound' types to hold multiple values at once. We will explore these in depth in Module 11-14.`,
        code: `# Integers: No limit to size!
stars_in_galaxy = 100_000_000_000 
print(f"Stars: {stars_in_galaxy}")

# Floats: Precision matters
pi_value = 3.14159
print(f"Pi is approximately: {pi_value}")

# Strings: Multi-line and concatenation
message = "Python is" + " Awesome"
multi_line_str = """
This is a long 
multi-line string
block.
"""

# Booleans: The Logic Switches
is_learning = True
is_tired = False
print(f"Is student succeeding? {is_learning and not is_tired}")`,
        visual: "A high-tech lab where a scientist is analyzing different substances—some solid (integers), some liquid (floats), and some glowing energy pulses (booleans).",
        recap: "int handles whole numbers; float handles decimals.<br>Strings are immutable text sequences wrapped in quotes.<br>Booleans (True/False) drive the decision-making of the program.<br>Use the type() function to inspect any variable's nature at runtime.",
        hook: "Identify the data type of '123' versus 123. If you add them, will Python be happy? Try it!"
    },
    {
        id: 6,
        title: "Type Casting",
        tag: "SHAPE-SHIFTING",
        overview: "Data is often provided in a format that isn't ready for work. Type Casting (or Type Conversion) is the process of changing a value from one 'Nature' to another. It is the core of data cleaning and user input handling.",
        explanation: `<strong>1. Implicit Casting (The Automatic Way):</strong> Python is helpful. If you add an integer (5) to a float (2.0), it knows the result must be a float (7.0) to prevent losing data. You don't have to do anything here.<br><br>
        <strong>2. Explicit Casting (The Manual Way):</strong> This is when YOU take control. <br>
        • <code>int()</code>: Chops off the decimal point of a float. It is NOT rounding; it is truncation.<br>
        • <code>float()</code>: Adds a .0 to an integer to prepare it for high-precision math.<br>
        • <code>str()</code>: Turns anything (even lists or advanced objects) into readable text. This is vital for logging and reporting.<br><br>
        <strong>3. The Value Error Risk:</strong> You can't cast 'Hello' into an <code>int</code>. If you try, Python will throw a <em>ValueError</em>. As a professional, you must ensure your data is 'clean' before you attempt to cast it.<br><br>
        <strong>4. Bool Casting:</strong> In Python, everything has a 'Truthy' or 'Falsy' value. 0, empty strings "", and empty lists [] are Falsy. Almost everything else is Truthy. You can use <code>bool()</code> to check if a variable actually contains data.`,
        code: `# Implicit: Float wins
result = 10 + 4.5
print(f"Implicit casting result: {result} is a {type(result)}")

# Explicit: Truncation
pi = 3.99
print(f"Casting Pi to Int: {int(pi)}") # Result: 3

# String conversion for concatenation
age = 25
print("I am " + str(age) + " years old.")

# Truthy check
username = ""
print(f"Does username exist? {bool(username)}")`,
        visual: "A digital alchemy table where a block of solid ice (string) is melted into water (float) and then frozen into a precise geometric cube (integer).",
        recap: "Implicit casting happens automatically to preserve precision.<br>Explicit casting uses constructor functions like int(), float(), and str().<br>Casting to int always truncates (removes decimals) without rounding.<br>The bool() function assesses the 'truthiness' of any data object.",
        hook: "Ask the user for their birth year, cast it to an integer, and subtract it from the current year to reveal their age!"
    },
    {
        id: 7,
        title: "Conditional Statements",
        tag: "DECISION ARCHITECTURE",
        overview: "In a static script, every line runs in order. In a real application, the program must sense its environment and choose a path. Conditional statements (if, elif, else) are the brain cells of your software, allowing for complex decision-making based on dynamic data.",
        explanation: `<strong>1. The 'If' Foundation:</strong> Every decision starts with <code>if</code>. If the condition is True, the indented code block below it runs. If False, Python skips it entirely.<br><br>
        <strong>2. Branching with 'Elif':</strong> Short for 'Else If'. Use this to check multiple specific conditions in sequence. Python checks them one by one and stops as soon as it finds a True one.<br><br>
        <strong>3. The Catch-All 'Else':</strong> This is your fallback. If none of the conditions were met, the <code>else</code> block executes. It is incredibly important for error handling and providing default behaviors.<br><br>
        <strong>4. Nested Conditionals:</strong> You can place an <code>if</code> inside another <code>if</code>. This allows you to build 'Deep Logic' (e.g., 'If the user is logged in, AND if they are an admin, then allow access').<br><br>
        <strong>5. Shorthand (Ternary):</strong> For simple decisions, you can write them in one line: <code>status = "Adult" if age >= 18 else "Minor"</code>. High-level developers use this to keep code succinct.`,
        code: `# Scenario: Automated Smart Home
temp = 22
is_day = True

if temp > 25:
    print("Action: Cooling active.")
elif temp < 18:
    print("Action: Heating active.")
else:
    print("Action: Temperature optimal.")

# Nested Logic Check
user_active = True
has_premium = False

if user_active:
    if has_premium:
        print("Welcome to the Platinum Lounge.")
    else:
        print("Welcome, Basic User.")
else:
    print("Account suspended.")`,
        visual: "A literal 3D fork in a glowing digital highway where neon signs light up in real-time, guiding data packets into different tunnels based on logic gates.",
        recap: "Indentations (4 spaces) define the code blocks for each condition.<br>Python stops at the FIRST True condition in an if-elif chain.<br>The 'else' block provides a vital safety default for your logic.<br>Nested conditionals allow for multi-layered decision trees.",
        hook: "Write a script that takes a student's numerical grade and outputs 'A', 'B', 'C', or 'F' using an elif chain!"
    },
    {
        id: 8,
        title: "While Loops",
        tag: "PERSISTENT EXECUTION",
        overview: "While loops are the 'heartbeat' of interactive software. They keep the program alive as long as a certain condition stays True. Whether it is an app waiting for you to click a button, or a game loop running at 60 frames per second, the while loop is the engine under the hood.",
        explanation: `<strong>1. The Anatomy of a While Loop:</strong> It consists of a <em>Condition</em> and a <em>Body</em>. The loop checks the condition, runs the body, and then immediately jumps back up to check the condition again. This cycle repeats indefinitely.<br><br>
        <strong>2. Avoiding the Infinite Abyss:</strong> If your condition never becomes False, your program hangs. This is an 'Infinite Loop'. To avoid this, you must ALWAYS include a line inside the loop that modifies a variable used in the condition.<br><br>
        <strong>3. The Sentinel Control:</strong> Use while loops when you don't know how many times you need to repeat. For example: 'Keep asking for an email until the user types a valid one'.<br><br>
        <strong>4. Break and Continue:</strong> <br>
        • <code>break</code>: Acts as an emergency eject button. It stops the loop immediately and moves to the code below it.<br>
        • <code>continue</code>: Skips the rest of the current turn and jumps back to the top of the loop for the next check.`,
        code: `# Reactor Startup Sequence
power_level = 0
target = 30

while power_level < target:
    power_level += 5
    print(f"Current Output: {power_level} GW")
    if power_level == 15:
        print("Note: Stabilizers engaged.")

print("Reactor Online.")

# Sentinel Input Example
secret_key = ""
while secret_key != "1234":
    secret_key = input("Enter Security Key (Hint: 1234): ")
    if secret_key == "quit":
        break

print("Vault Unlocked.")`,
        visual: "A circular particle accelerator where a beam of light keeps spinning faster and faster until a specific energy threshold is hit.",
        recap: "While loops execute based on truth conditions, not predefined counts.<br>Infinite loops can crash apps; always ensure an exit strategy exists.<br>Break exits the loop; Continue restarts the loop from the top.<br>While loops are most common in game engines and user-input validation.",
        hook: "Create a loop that prints 'Hello' and then asks the user if they want to 'stop'. Exit the loop only when they type 'yes'!"
    },
    {
        id: 9,
        title: "For Loops",
        tag: "LINEAR PROCESSING",
        overview: "If while loops are about persistence, for loops are about precision. A for loop is an iterator used to step through a sequence of items one by one. It is the gold standard for processing lists of users, pixels in an image, or files on a hard drive.",
        explanation: `<strong>1. The 'For-In' Concept:</strong> In Python, you don't 'count' from 1 to 10 in a for loop like in older languages. Instead, you say: 'For every target in this group, do this'. This is incredibly readable and reduces errors.<br><br>
        <strong>2. The Marvelous Range() Function:</strong> <code>range(10)</code> creates a sequence of integers from 0 to 9. <br>
        • <code>range(5, 10)</code>: Start at 5, stop before 10.<br>
        • <code>range(0, 100, 10)</code>: Count by tens (0, 10, 20...).<br><br>
        <strong>3. Iterating Over Strings:</strong> Since a string is just a collection of characters, you can loop through words. This is vital for text processing and cryptography.<br><br>
        <strong>4. Else with Loops:</strong> A unique Python feature! You can add an <code>else</code> block AFTER a loop. It runs only if the loop completed naturally WITHOUT hitting a <code>break</code>. This is perfect for searching tasks.`,
        code: `# Automating a Message Broadcast
recipients = ["Alice", "Bob", "Charlie"]

for person in recipients:
    print(f"Sending encrypted invite to: {person}")

# Power Calculation Table
print("\\nPower Table:")
for x in range(1, 5):
    print(f"{x} squared is {x**2}")

# Searching with Loop-Else
search_item = "Diamond"
inventory = ["Wood", "Stone", "Iron"]

for item in inventory:
    if item == search_item:
        print("Item found!")
        break
else:
    print("Warning: Item not found in database.")`,
        visual: "A high-speed maglev train stopping for exactly one second at every station on a map before reaching the final terminal.",
        recap: "For loops are used for iterating over sequences (lists, ranges, strings).<br>The range() function is the primary tool for generating numeric sequences.<br>For loops are generally safer and cleaner than while loops for collections.<br>Loop-else blocks provide a way to handle 'not found' scenarios effectively.",
        hook: "Use a for loop with a range(10, 0, -1) to create a rocket countdown from 10 to 1!"
    },
    {
        id: 10,
        title: "Strings & Indexing",
        tag: "TEXT ARCHITECTURE",
        overview: "Strings are more than just words; they are an 'Array of Characters'. In Python, strings are one of the most powerful and flexible data structures, equipped with an arsenal of tools for slicing, dicing, and analyzing text data at scale.",
        explanation: `<strong>1. Zero-Based Indexing:</strong> The most important concept in coding. The first character of a string is at position <code>0</code>, not 1. This is because the index represents the <em>offset</em> from the start of the memory block.<br><br>
        <strong>2. Slicing Mastery:</strong> Use <code>[start:stop:step]</code> to extract pieces.<br>
        • <code>text[0:4]</code>: All characters from index 0 to 3.<br>
        • <code>text[::-1]</code>: A Python 'magic trick' that reverses the entire string instantly.<br><br>
        <strong>3. Immutability Principle:</strong> Strings are frozen in memory. You can't write <code>text[0] = "X"</code>. To change a string, you must create a new version using methods like <code>.replace()</code> or by joining different slices together.<br><br>
        <strong>4. Essential Methods:</strong><br>
        • <code>.strip()</code>: Removes unwanted spaces (vital for user input cleaning).<br>
        • <code>.split()</code>: Breaks a sentence into a list of words. Great for analyzing data CSVs.<br>
        • <code>.join()</code>: The opposite of split. Glues a list of words back into a sentence.`,
        code: `# The Anatomy of a String
subject = "Python Engineering"

# Slicing
title = subject[:6] # "Python"
skill = subject[7:] # "Engineering"
print(f"Topic: {title} | Skill: {skill}")

# Cleaning messy data
raw_input = "   stitch_user   "
clean_user = raw_input.strip().capitalize()
print(f"Normalized UID: '{clean_user}'")

# Reversing strings (Palindrome check)
word = "radar"
is_palindrome = word == word[::-1]
print(f"Is '{word}' a palindrome? {is_palindrome}")

# Formatting for Reports
report = "id,name,level"
columns = report.split(",")
print(f"Header 2: {columns[1]}")`,
        visual: "A vertical glass stack of characters where a laser beam reflects off specific levels to extract glowing letters for a new word.",
        recap: "Indexes start at 0; negative indexes (-1) count from the end.<br>Slicing is non-destructive and creates a new string fragment.<br>Strings are immutable—you cannot modify them after creation.<br>Methods like strip, split, and join are the workhorses of data processing.",
        hook: "Take the string 'Python_Mastery' and slice it to get only the word 'Mastery'. Then reverse it!"
    },
    {
        id: 11,
        title: "Lists",
        tag: "DYNAMIC ARRAYS",
        overview: "Lists are the most versatile data structure in Python. They are essentially 'Dynamic Arrays' that can grow or shrink as your program runs. Whether you are storing a list of users, a series of logs, or a high-score table, lists are your primary tool for managing collections of data that change over time.",
        explanation: `<strong>1. Mutable Architecture:</strong> Unlike strings, lists are <em>Mutable</em>. This means you can overwrite any single element, add new ones, or delete ones you don't need without destroying the original list. This makes them extremely efficient for handling real-time data flow.<br><br>
        <strong>2. Indexing and Slicing:</strong> Lists follow the same zero-based indexing rules as strings. You can use <code>list[0]</code> to get the first item or <code>list[-1]</code> to grab the last. Slicing allowing you to 'subset' your data instantly.<br><br>
        <strong>3. The Powerful List Arsenal:</strong><br>
        • <code>.append()</code>: Add a single item to the very end.<br>
        • <code>.extend()</code>: Merge an entire second list into the first one.<br>
        • <code>.insert(index, value)</code>: Squeeze an item between two existing ones.<br>
        • <code>.pop()</code>: Remove and 'hand back' the last item in the list.<br><br>
        <strong>4. List Comprehensions (The Pythonic Way):</strong> One of Python's greatest features. Instead of writing 4 lines of a for-loop to filter a list, you can do it in one line: <code>[x for x in list if x > 10]</code>. This is what separates junior devs from senior engineers.`,
        code: `# Managing a futuristic inventory
inventory = ["Plasma Rifle", "Medkit", "Energy Cell"]

# Adding and modifying
inventory.append("Shield Generator")
inventory[1] = "Advanced Medkit" # Overwriting
print(f"Updated Stock: {inventory}")

# Slicing the first two items
essential_gear = inventory[:2]
print(f"Priority Gear: {essential_gear}")

# List Comprehension: Filtering expensive items
items = [100, 250, 45, 600, 12]
expensive_items = [p for p in items if p > 100]
print(f"Luxury items: {expensive_items}")

# Popping out an item for use
last_item = inventory.pop()
print(f"Equipped: {last_item}")`,
        visual: "A high-speed digital conveyor belt where storage slots can expand, contract, or swap colors instantly as they move through a factory.",
        recap: "Lists are ordered, changeable collections identified by [].<br>They can hold multiple data types simultaneously (int, str, etc.).<br>Methods like append and pop provide efficient stack-like management.<br>List comprehensions offer a succinct way to filter and transform data.",
        hook: "Create a list of 5 numbers and use a list comprehension to create a new list that doubles all of them!"
    },
    {
        id: 12,
        title: "Tuples",
        tag: "IMMUTABLE SEQUENCES",
        overview: "Tuples are the 'Steadfast Siblings' of lists. Once a tuple is born, it cannot be changed. This 'Immutability' makes them a mission-critical tool for data that must remain constant throughout your program's life, such as screen resolutions, API keys, or physical constants.",
        explanation: `<strong>1. Why Immutability Matters:</strong> In a large team, a developer might accidentally overwrite a global list variable. If that variable was a Tuple, Python would throw an error instantly. This makes your code 'Self-Protecting'.<br><br>
        <strong>2. Performance and Efficiency:</strong> Because Tuples are fixed in size, Python can store them more efficiently in memory than Lists. If you have a massive collection of data that won't change, using a Tuple will make your app run faster.<br><br>
        <strong>3. Packing and Unpacking (Structural Magic):</strong> You can assign a tuple's values to separate variables in a single line. This is the cleanest way to handle functions that need to 'return' more than one piece of information.<br><br>
        <strong>4. Syntax Note:</strong> Tuples use parentheses <code>( )</code>. Special Case: To create a tuple with only ONE item, you must include a trailing comma <code>(item,)</code>, otherwise Python thinks it's just a regular variable in parentheses.`,
        code: `# Coordinates that must never shift
origin = (0, 0)
print(f"Starting System at: {origin}")

# Attempting to change would fail:
# origin[0] = 5 <-- TypeError

# Powerful Unpacking
user_data = ("Admin", "192.168.1.1", "Secure")
role, ip, security = user_data
print(f"Logging in {role} from {ip}")

# Swapping values (Classic Python trick using Tuples!)
a, b = 10, 20
a, b = b, a 
print(f"After swap: a={a}, b={b}")`,
        visual: "A rows of solid diamond cubes, each containing a piece of data that is perfectly visible but permanently sealed behind unbreakable glass.",
        recap: "Tuples are immutable (cannot be changed) and use ().<br>They are more memory-efficient and safer than lists for static data.<br>Unpacking allows for multi-variable assignment from a single tuple.<br>A trailing comma is required for single-item tuples (e.g., 'val',).",
        hook: "Create a tuple representing your 'Home' location with latitude and longitude. Try to update the latitude and see the error!"
    },
    {
        id: 13,
        title: "Sets",
        tag: "UNBIASED COLLECTIONS",
        overview: "Sets are unordered collections of unique elements. Think of a set as a magical room where duplicate items simply evaporate. In professional programming, sets are used for lightning-fast membership testing, deduplicating massive datasets, and performing mathematical set operations.",
        explanation: `<strong>1. The Power of Uniqueness:</strong> If you try to add 'User123' to a set that already contains it, the set will simply ignore the request. This makes sets the perfect tool for tracking 'Unique Visitors' to a website or 'Distinct Keywords' in a document.<br><br>
        <strong>2. Membership Speed:</strong> Checking if an item is 'in' a List requires Python to look at every item one by one (this is slow). Checking if an item is 'in' a Set is near-instant, regardless of how many millions of items are in it. This is due to a technique called 'Hashing'.<br><br>
        <strong>3. Mathematical Brilliance:</strong> Use sets to compare groups of data:<br>
        • <strong>Union (|):</strong> All unique items from both groups.<br>
        • <strong>Intersection (&):</strong> Only items that appear in BOTH groups.<br>
        • <strong>Difference (-):</strong> items in Group A that are NOT in Group B.<br><br>
        <strong>4. Syntax:</strong> Defined with curly braces <code>{ }</code>. Caution: <code>{}</code> creates an empty Dictionary. To create an empty Set, you must use the <code>set()</code> function.`,
        code: `# Deduplicating a log of IDs
raw_logs = ["id1", "id2", "id1", "id3", "id2"]
unique_ids = set(raw_logs)
print(f"Filtered log: {unique_ids}") # Duplicate 'id1' and 'id2' are gone

# Comparing User Groups
active_users = {"Alice", "Bob", "Charlie"}
premium_users = {"Charlie", "David"}

# Who is active AND premium?
both = active_users & premium_users
print(f"VIP Online: {both}")

# Who is active but has NOT paid for premium?
standard = active_users - premium_users
print(f"Show Ads to: {standard}")`,
        visual: "A chaotic, floating cloud of unique symbols that constantly shift positions but never allow two of the same symbol to exist simultaneously.",
        recap: "Sets are unordered collections with no duplicate values.<br>Membership testing using the 'in' keyword is extremely fast.<br>Set operations (union, intersection) allow for complex group comparisons.<br>Empty sets must be created using the set() constructor function.",
        hook: "Create a set of your 5 favorite fruits. Use the .add() method to add a fruit already in the set and print it!"
    },
    {
        id: 14,
        title: "Dictionaries",
        tag: "ASSOCIATIVE MAPPING",
        overview: "Dictionaries (or 'Dicts') are the most powerful data structure for organized web development and software engineering. While lists use numbers for indexing, Dictionaries use 'Keys'. It's like having a giant box of wires where every wire has a specific label that tells you exactly where it goes.",
        explanation: `<strong>1. Key-Value Pairs:</strong> Data is stored in the format <code>{Key: Value}</code>. The 'Key' is your label (usually a string), and the 'Value' is the data itself. You can find any value instantly just by knowing its label.<br><br>
        <strong>2. No Duplicates Allowed (Keys):</strong> Every key in a dictionary must be unique. If you try to add a new value to an existing key, Python will simply 'Overwrite' the old data. This is how we update user profiles or stock prices.<br><br>
        <strong>3. Mapping Complexity:</strong> Values in a dictionary can be <em>anything</em>—another dictionary, a list of objects, or even a function. This allows you to build deeply nested data structures like JSON (the language of the internet).<br><br>
        <strong>4. Iteration Mastery:</strong> Use <code>.items()</code> to loop through both labels and data at once. Use <code>.get()</code> instead of direct indexing to safely look up data without crashing the app if the key is missing.`,
        code: `# Modeling a Game Protagonist
player = {
    "uid": "stitch_7",
    "lvl": 100,
    "inventory": ["Shield", "Key"],
    "is_pro": True
}

# Accessing and Updating
print(f"Current Level: {player['lvl']}")
player["lvl"] += 1 # Level up

# Safe access with .get()
# If 'guild' is missing, it returns 'None' instead of crashing
guild_name = player.get("guild", "No Guild Joined")
print(f"Alliance: {guild_name}")

# Iterating through everything
print("\\n--- SYSTEM DUMP ---")
for key, value in player.items():
    print(f"NODE {key.upper()}: {value}")`,
        visual: "A high-tech terminal wall with millions of glowing labels; you touch a label and a secret compartment slides open to reveal the data stored inside.",
        recap: "Dictionaries use curly braces {} and store data in key-value pairs.<br>Keys must be unique and immutable; values can be any data type.<br>Use dict.get() for safe data retrieval and dict.items() for iteration.<br>Dictionaries are the foundation of working with web APIs and JSON data.",
        hook: "Create a dictionary called 'book' with keys for 'title', 'author', and 'year'. Change the year to 2024!"
    },
    {
        id: 15,
        title: "Functions",
        tag: "PROCEDURAL LOGIC",
        overview: "Functions are the 'Brain Modules' of your program. They are self-contained blocks of code that perform a specific task. By separating your logic into functions, you create code that is easier to read, easier to test, and completely reusable across different parts of your application.",
        explanation: `<strong>1. The DRY Principle:</strong> Professional engineers live by the motto: <strong>Don't Repeat Yourself</strong>. If you notice you've copied and pasted the same 5 lines of code twice, you should turn them into a function.<br><br>
        <strong>2. Parameters vs Arguments:</strong> Think of a function like a recipe. <em>Parameters</em> are the placeholders (like 'ingredient_a'), and <em>Arguments</em> are the actual values you pass in (like 'Sugar'). This allows one function to behave differently based on the input.<br><br>
        <strong>3. Scope (Local vs Global):</strong> Variables created inside a function are 'Local'. They exist only while the function is running. This prevents 'Variable Pollution' where different parts of your app accidentally interfere with each other.<br><br>
        <strong>4. Docstrings (Professionalism):</strong> Use triple quotes <code>""" """</code> at the start of your function to explain what it does. This allows tools and other developers to understand your logic without reading the code itself.`,
        code: `# Designing a Modular Logic Block
def calc_net_salary(gross, tax_rate=0.2):
    """
    Calculates the final salary after tax deduction.
    Default tax rate is 20%.
    """
    tax_amount = gross * tax_rate
    return gross - tax_amount

# Utilizing the function
user1_final = calc_net_salary(5000)
user2_final = calc_net_salary(5000, tax_rate=0.35)

print(f"Net Standard: ${user1_final}")
print(f"Net Executive: ${user2_final}")

# Functional Scoping
def secret_operation():
    internal_token = "ABC-123" # Local
    return internal_token

# print(internal_token) # Error! Not accessible globally`,
        visual: "A futuristic modular engine where you can swap out 'logic batteries' (functions) depending on whether you need the engine to fly, swim, or drill.",
        recap: "Functions (def) enable code reusability and modular design.<br>Parameters define the inputs; the return statement provides the output.<br>Scope protects variables inside functions from being accessed outside.<br>Default parameter values allow for flexible function calls.",
        hook: "Write a function 'square' that takes a number and returns it multiplied by itself. Call it with the number 7!"
    },
    {
        id: 16,
        title: "Lambda Expressions",
        tag: "STREAMLINED LOGIC",
        overview: "Lambda expressions are the 'Special Ops' of Python functions. They are small, anonymous functions defined without a name, designed for quick, one-time operations. While traditional functions are like factories, lambdas are like handheld tools—compact, efficient, and perfect for working inside other functions.",
        explanation: `<strong>1. The Syntax of Simplicity:</strong> A lambda follows a strict one-line rule: <code>lambda arguments: expression</code>. You can have multiple inputs, but you can only have ONE calculation. This forces you to write code that is clean and focused.<br><br>
        <strong>2. Functional Programming Power:</strong> Lambdas truly shine when paired with built-in functions like <code>map()</code>, <code>filter()</code>, and <code>sorted()</code>. Instead of writing a helper function and calling it by name, you can inject the logic directly where it's needed.<br><br>
        <strong>3. Anonymous Nature:</strong> Because they don't have a variable name attached, they are automatically cleaned up from memory after use. This makes them ideal for large-scale data processing where you want to keep your memory footprint low.<br><br>
        <strong>4. When to Use (and When to Pass):</strong> Use lambdas for simple math or sorting logic. However, if your logic requires multiple lines, loops, or complex error handling, stick to a traditional <code>def</code> function for the sake of your teammates' sanity.`,
        code: `# The Classic Lambda: Squaring numbers
square = lambda x : x * x
print(f"5 squared is {square(5)}")

# Real-world usage: Sorting complex data
# We want to sort users by their 'level' key inside a list
users = [
    {"name": "Alice", "level": 50},
    {"name": "Bob", "level": 10},
    {"name": "Charlie", "level": 85}
]

# Using lambda as a 'Key' for sorting
users.sort(key=lambda u: u["level"])
print(f"Users sorted by XP: {users}")

# Filter: Getting only high-level players
pro_players = list(filter(lambda u: u["level"] > 40, users))
print(f"Pro Squad: {pro_players}")`,
        visual: "A tiny, high-frequency energy pulse that performs a complex calculation in a fraction of a millisecond and then vanishes into the digital ether.",
        recap: "Lambdas are anonymous, single-expression functions.<br>Syntax: lambda arguments : expression.<br>They are most effective when used with map, filter, and sort.<br>Always prioritize code readability—avoid using lambdas for complex logic.",
        hook: "Create a lambda that takes two numbers and returns the larger one. Test it with 15 and 42!"
    },
    {
        id: 17,
        title: "Classes & Objects",
        tag: "ARCHITECTURAL BLUEPRINTS",
        overview: "Object-Oriented Programming (OOP) is the philosophy that powers almost all modern software. Instead of writing code as a list of instructions, you build your app as a collection of interacting 'Objects'. Every object is an instance of a 'Class'—a master blueprint that defines its properties and behaviors.",
        explanation: `<strong>1. Modeling Reality:</strong> If you are building a game, don't use loose variables like <code>enemy_hp</code>. Create an <code>Enemy</code> class. This class acts as the template. When you create 100 enemies, they are all 'Objects' born from that one template. This is the secret to scaling applications.<br><br>
        <strong>2. Attributes (The 'What'):</strong> These are variables that belong to the object. If the object is a 'Car', attributes might be <code>color</code>, <code>fuel_level</code>, and <code>speed</code>. They define the 'State' of the object at any given moment.<br><br>
        <strong>3. Methods (The 'How'):</strong> These are functions that live inside the class. They define what the object can DO. A car can <code>drive()</code>, <code>refuel()</code>, and <code>honk()</code>. Every method must take <code>self</code> as its first parameter.<br><br>
        <strong>4. The Constructor (__init__):</strong> This is a special method that runs automatically the moment an object is created. It is the 'Birth Certificate' of the object, where you set its starting attributes (like giving the robot its name).`,
        code: `# The Master Prototype
class Drone:
    def __init__(self, model, battery=100):
        # Setting the initial state
        self.model = model
        self.battery = battery
        self.status = "Idle"

    def launch(self):
        if self.battery > 10:
            self.status = "Flight"
            self.battery -= 5
            return f"{self.model} is airborne!"
        return "Insufficient power for takeoff."

# Deploying Objects from the Blueprint
scout_1 = Drone("Seeker-V1")
heavy_1 = Drone("Tanker-X", battery=50)

print(scout_1.launch())
print(f"Scout Status: {scout_1.status} | Battery: {scout_1.battery}%")`,
        visual: "A glowing, 3D holographic wireframe of a futuristic aircraft that suddenly solidifies into a physical, metal drone that flies away.",
        recap: "Classes are templates; Objects are the actual instances in memory.<br>The __init__ method initializes attributes when an object is created.<br>'self' represents the specific instance of the object being manipulated.<br>Methods represent the actions or behaviors of the object.",
        hook: "Create a 'Account' class with an 'owner' attribute and a 'balance'. Add a 'deposit' method!"
    },
    {
        id: 18,
        title: "Inheritance",
        tag: "SYSTEM EVOLUTION",
        overview: "In software engineering, complexity is the enemy. Inheritance allows you to build a general system and then create specialized versions of it without retyping the code. This 'is-a' relationship allows Child classes to inherit everything from Parent classes, enabling rapid development and clean hierarchies.",
        explanation: `<strong>1. The Base Class (Parent):</strong> This class defines the general properties shared by many objects. For example, all 'Users' have an email and a password. This is your foundation.<br><br>
        <strong>2. The Derived Class (Child):</strong> This is a specialized version of the parent. An 'Admin' <em>is a</em> 'User', but they have extra powers. Instead of recreating the email logic, 'Admin' just inherits it from 'User' and adds its own <code>delete_database()</code> method.<br><br>
        <strong>3. Method Overriding:</strong> Sometimes, the child needs to behave differently than the parent. You can define a method with the same name in the child class, and Python will use that version instead of the parent's. This is called <em>Polymorphism</em>.<br><br>
        <strong>4. The Super() Function:</strong> A powerful tool that allows a child to call a method from its parent class. This is useful when you want to use the parent's logic but add just a little bit more on top of it.`,
        code: `# Base Architecture: General AI
class CoreAI:
    def __init__(self, version):
        self.version = version
    
    def process(self, data):
        return f"v{self.version} processing {data}"

# Specialized Branch: Language AI
class LanguageAI(CoreAI):
    def translate(self, text, target_lang):
        # Inherits 'process' method but adds translation
        base_log = self.process(text)
        return f"Translating: '{text}' to {target_lang} (Logic: {base_log})"

# Specialized Branch: Vision AI (Overriding logic)
class VisionAI(CoreAI):
    def process(self, image):
        # We override the base 'process' with vision-specific logic
        return f"Analyzing pixels in {image}... Found 10 objects."

# Utilizing the Hierarchy
translator = LanguageAI("4.0")
scanner = VisionAI("2.1")

print(translator.translate("Hello", "French"))
print(scanner.process("view_source.jpg"))`,
        visual: "A master sword being placed into a magical furnace and emerging as a specialized 'Fire Sword', glowing with new runes while retaining its original sharp edge.",
        recap: "Inheritance creates a hierarchy where children gain traits from parents.<br>Subclasses promote 'Code Reusability' by sharing base logic.<br>Use super() to extend parent methods without overwriting them entirely.<br>Overriding allows specialized behavior in child classes.",
        hook: "Create a 'Bird' class with a 'fly' method, then a 'Penguin' class that overrides 'fly' to say 'I walk instead'!"
    },
    {
        id: 19,
        title: "Error Handling",
        tag: "SYSTEM RESILIENCE",
        overview: "Professional software doesn't just work when things go right; it handles things when they go wrong. Errors (exceptions) are part of life—users will input text where numbers should be, files will be deleted, and internet connections will fail. Error handling is the safety net that prevents your app from crashing.",
        explanation: `<strong>1. The Try-Except Block:</strong> This is your protective shield. You 'try' a piece of risky code. If it works, great! If it fails, Python looks for an <code>except</code> block that matches the error. This keeps the application alive instead of showing a scary red error message.<br><br>
        <strong>2. Catching Specific Exceptions:</strong> Don't just catch 'all' errors. If you catch <code>ZeroDivisionError</code> specifically, you can tell the user: 'Hey, you can't divide by zero!'. If you catch <code>FileNotFoundError</code>, you can tell them: 'That file is missing'. Specificity is key to good UX.<br><br>
        <strong>3. Raising Exceptions (Raise):</strong> Sometimes, you want to trigger your own errors. For example, 'If user age is negative, RAISE an error'. This allows you to enforce your own business rules within your code.<br><br>
        <strong>4. The Finally Clause:</strong> This is for mission-critical cleanup. Whether the code succeeded or failed, the <code>finally</code> block will ALWAYS run. This is where you close database connections or save files to ensure no data is lost during a crash.`,
        code: `# Building a Resilient Data Parser
def divide_resources(total, agents):
    try:
        # Risky Calculation
        each = total / agents
        print(f"Distribution logic successful: {each} per agent.")
    except ZeroDivisionError:
        print("ALERT: System cannot divide by zero agents. Request aborted.")
    except TypeError:
        print("ALERT: Input must be numeric. Translation failed.")
    finally:
        print("Network Connection: SECURE")

# Testing the Safety Net
divide_resources(100, 0)      # Triggers ZeroDivision
divide_resources(100, "Two")  # Triggers TypeError
divide_resources(100, 5)      # Success!`,
        visual: "A fragile glass sculpture being dropped from a building but being caught by a soft, high-tech carbon-fiber net just inches from the pavement.",
        recap: "Exceptions are signals that something unexpected happened.<br>Try blocks isolate risky code; Except blocks handle specific failures.<br>Use multiple except clauses to provide tailored feedback for specific errors.<br>The finally block ensures critical cleanup logic runs every single time.",
        hook: "Try to open a file called 'ghost.txt' in a try block, and use 'except FileNotFoundError' to print a custom warning!"
    },
    {
        id: 20,
        title: "Git & GitHub",
        tag: "COLLABORATIVE MASTERY",
        overview: "In the professional world, software is built by teams, not individuals. Git is the 'Time Machine' and 'Parallel Universe Generator' of the software industry. GitHub is the cloud-based hub where the entire world's code lives. Mastering these tools is what bridges the gap between a student and a professional engineer.",
        explanation: `<strong>1. Distributed Version Control (Git):</strong> Git tracks every single character change in your project. If you break your code on a Friday, you can 'roll back' to the version from Wednesday in three seconds. It removes the fear of making mistakes.<br><br>
        <strong>2. The Commit Cycle:</strong> Think of a <code>commit</code> as a save point in a game. You make changes, you <code>add</code> them to the stage, and then you <code>commit</code> them with a meaningful message explaining WHY the change was made.<br><br>
        <strong>3. Branching (Parallel Universes):</strong> This is the most powerful feature. You can create a 'Branch' to test a new crazy idea. If it works, you 'Merge' it into the main project. If it fails, you delete the branch and the main project remains perfectly safe.<br><br>
        <strong>4. GitHub & Pull Requests:</strong> GitHub is the social network for developers. You 'Push' your code to the cloud, and when you want your team to approve your changes, you open a 'Pull Request'. Experts review your code, leave comments, and then merge it.`,
        code: `# The Professional Workflow Workflow:
# PHASE 1: Initialization
# git init               <-- Establish a new timeline

# PHASE 2: Development Loop
# git status             <-- Peek at current changes
# git add main.py        <-- Stage a specific file for saving
# git add .              <-- Stage ALL changes
# git commit -m "Fix login glitch" <-- Create a permanent save point

# PHASE 3: Cloud Synchronization
# git push origin main   <-- Upload your timeline to GitHub

# PHASE 4: Collaborative Branches
# git checkout -b feature-ai <-- Create and jump to a new universe`,
        visual: "A massive multi-dimensional tree where thousands of branches grow out of a single trunk, each with its own developers working on it simultaneously.",
        recap: "Git provides version history and enables safe experimentation.<br>Commits are snapshots; Branches are isolated environments for features.<br>GitHub allows for code hosting, social review, and team collaboration.<br>Mastering Pull Requests (PRs) is a critical career milestone.",
        hook: "Research what 'git clone' does — it's how you teleport any public project in the world down to your computer!"
    },
    {
        id: 21,
        title: "Deployment",
        tag: "THE ARRIVAL",
        overview: "Code on your laptop is a hobby. Code on a server is a business. Deployment is the final transition where your application leaves your personal machine and becomes a digital service available to billions of people across the globe via the cloud.",
        explanation: `<strong>1. Virtual Environments (venv):</strong> This is the most important prep step. A computer might have 10 different versions of libraries installed. A Virtual Environment creates a clean, isolated 'bubble' where ONLY the libraries your app needs are installed. This ensures that if it works on your machine, it WILL work on the server.<br><br>
        <strong>2. Requirements Tracking:</strong> Use <code>pip freeze > requirements.txt</code> to create a recipe of every dependency your app needs. The server reads this file and automatically installs everything required to bake your app into a working service.<br><br>
        <strong>3. Cloud Providers:</strong> Industry giants like <strong>AWS, Google Cloud, and Azure</strong> provided the massive global infrastructure. For beginners, platforms like <strong>Railway, Render, or Heroku</strong> offer one-click deployment that connects directly to your GitHub repository.<br><br>
        <strong>4. Continuous Integration (CI/CD):</strong> Pros don't deploy manually. They set up pipelines so that every time they <code>git push</code>, the server automatically runs tests and launches the new version of the app. This is the gold standard of modern software delivery.`,
        code: `# Phase 1: Isolation (Local Laptop)
# python -m venv env          <-- Create the bubble
# source env/bin/activate     <-- Enter the bubble

# Phase 2: Dependency Management
# pip install pandas requests <-- Install what you need
# pip freeze > requirements.txt <-- Create the blueprint

# Phase 3: Cloud Interaction (Command Line Deployment)
# railway login
# railway up                  <-- Launch code to the stratosphere

# Phase 4: Production Hygiene
# .gitignore                  <-- Create a file to hide passwords!`,
        visual: "A gleaming rocket ship lifting out of a misty forest, breaking through the clouds, and docking with a massive orbital space station (The Internet).",
        recap: "Deployment moves code from local development to production servers.<br>Virtual environments (venv) prevent library conflicts and 'Dependency Hell'.<br>requirements.txt is the essential map for server-side installation.<br>Modern platforms use Git-based deployment for seamless, automated scaling.",
        hook: "Go to Render.com or Railway.app and look at their 'Deploy from GitHub' button — that's the future!"
    }
];

let pyodideReadyPromise = null;
async function initPyodide() {
    const terminal = document.getElementById('terminal-output');
    if(terminal) terminal.innerText = "$ Establishing Secure WebAssembly Environment...\n";
    
    try {
        if (!window.loadPyodide) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        let pyodide = await loadPyodide();
        
        // Load micropip for handling external packages
        await pyodide.loadPackage("micropip");
        const micropip = pyodide.pyimport("micropip");
        
        if(terminal) terminal.innerText = "$ Python Engine & Micropip Loaded ✓\n$ Ready for execution.";
        return pyodide;
    } catch(err) {
        console.error(err);
        if(terminal) terminal.innerText = "$ Fatal Engine Error: Your device's browser architecture may be too old to support WebAssembly (WASM), or your network connection rejected the download.";
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Python Engine
    pyodideReadyPromise = initPyodide();

    const theoryMenuList = document.getElementById('theory-menu-list');
    const theoryContainer = document.getElementById('theory-dynamic-container');

    // Populate Menu
    if (theoryMenuList) {
        let menuHTML = '';
        theoryModules.forEach((mod) => {
            menuHTML += `
                <div class="card theory-menu-card" onclick="openTheoryModule(${mod.id})">
                    <div class="module-number">${mod.id}</div>
                    <div class="module-info">
                        <h3 class="white-text">${mod.title}</h3>
                        <p class="tag-pill" style="margin-top: 4px;">${mod.tag}</p>
                    </div>
                    <div class="chevron">▸</div>
                </div>
            `;
        });
        theoryMenuList.innerHTML = menuHTML;
    }    

    window.openTheoryModule = function(moduleId) {
        const mod = theoryModules.find(m => m.id === moduleId);
        if(!mod) return;

        // Render Theory HTML
        let htmlSnippet = `
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

        theoryContainer.innerHTML = htmlSnippet;
        navigateTo('screen-theory');
        
        // Magically apply rich python syntax highlighting if library loaded
        if (window.Prism) {
            Prism.highlightAllUnder(theoryContainer);
        }
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.innerHTML = `
        .screen.active .main-content { animation: slideUpFade 0.3s ease-out forwards; }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Menu Specific */
        .theory-menu-card { display: flex; align-items: center; gap: 1rem; cursor: pointer; padding: 1rem; transition: 0.2s; border-bottom: 1px solid var(--surface-high); }
        .theory-menu-card:active { transform: scale(0.98); background: var(--surface-bright); }
        .module-number { font-family: var(--font-mono); font-size: 1.5rem; color: var(--tertiary); font-weight: bold; }
        .module-info { flex: 1; }
        .chevron { color: var(--grey-text); font-size: 1.2rem; }
    `;
    document.head.appendChild(style);

    window.handleQuiz = function(element, isCorrect) {
        // Reset options
        document.querySelectorAll('#quiz-options .option').forEach(opt => {
            opt.classList.remove('selected');
            opt.classList.remove('wrong-selection');
            opt.querySelector('.radio').classList.remove('active');
            opt.querySelector('.radio').innerText = '';
        });

        element.classList.add('selected');
        const radio = element.querySelector('.radio');
        radio.classList.add('active');

        if (isCorrect) {
            radio.innerText = '✔️';
            document.getElementById('quiz-accuracy').innerText = '100%';
        } else {
            element.classList.add('wrong-selection');
            element.style.borderColor = '#ff4d4d';
            radio.innerText = '❌';
            radio.style.background = '#ff4d4d';
            document.getElementById('quiz-accuracy').innerText = '0%';
        }
    };

    // Execution Logic
    const runBtn = document.getElementById('run-code-btn');
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            const code = document.getElementById('python-code-editor').value;
            const terminal = document.getElementById('terminal-output');
            
            if(!pyodideReadyPromise) {
                terminal.innerText = "Error: Engine didn't boot. Are you offine? Check connection.";
                return;
            }
            
            try {
                terminal.innerText = "$ Checking local environment...\n";
                let pyodide = await pyodideReadyPromise;
                
                // Identify potential micropip packages from the user's code
                // This covers libraries like seaborn, category_encoders, feature_engine, missingno, etc.
                const packageMap = {
                    'seaborn': 'seaborn',
                    'category_encoders': 'category_encoders',
                    'feature_engine': 'feature-engine',
                    'missingno': 'missingno',
                    'imblearn': 'imbalanced-learn',
                    'janitor': 'pyjanitor',
                    'mlflow': 'mlflow',
                    'sketch': 'sketch',
                    'ydata_profiling': 'ydata-profiling',
                    'sweetviz': 'sweetviz',
                    'dtale': 'dtale',
                    'xgboost': 'xgboost',
                    'lightgbm': 'lightgbm',
                    'catboost': 'catboost'
                };

                const lines = code.split('\n');
                let packagesToInstall = [];
                lines.forEach(line => {
                    for (const [key, pkg] of Object.entries(packageMap)) {
                        if (line.includes(`import ${key}`) || line.includes(`from ${key}`)) {
                            packagesToInstall.push(pkg);
                        }
                    }
                });

                if (packagesToInstall.length > 0) {
                    terminal.innerText = `$ Installing external dependencies: ${packagesToInstall.join(', ')}...\n`;
                    for (const pkg of [...new Set(packagesToInstall)]) {
                        try {
                            await pyodide.runPythonAsync(`import micropip; await micropip.install('${pkg}')`);
                        } catch (e) {
                            terminal.innerText += `! Warning: Could not install ${pkg}. Some features might be unavailable.\n`;
                        }
                    }
                }

                terminal.innerText += "$ Loading scientific stack...\n";
                // Automatically load core packages based on import statements (numpy, pandas, sklearn, statsmodels, etc.)
                await pyodide.loadPackagesFromImports(code);
                
                // Route Standard Output directly to HTML terminal
                pyodide.setStdout({ batched: (msg) => { terminal.innerText += msg + "\n"; } });
                
                terminal.innerText += "$ Executing code sequence...\n";
                await pyodide.runPythonAsync(code);
                terminal.innerText += "\n[Process Completed]";
                
                // Show completion banner natively!
                document.querySelector('.success-notification').style.display = 'flex';
                setTimeout(() => { document.querySelector('.success-notification').style.display = 'none'; }, 3000);
            } catch (err) {
                // Strip the brutal pyodide stack trace formatting purely to readable errors
                let cleanErr = err.toString().split('File "<exec>"').pop();
                terminal.innerText += "\n[Exception Caught]\n" + cleanErr.trim();
            }
        });
    }

    const clearBtn = document.querySelector('.debug-btn');
    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('terminal-output').innerText = "$ Console cleared.";
        });
    }

    // Hide success pill by default
    document.querySelector('.success-notification').style.display = 'none';

    // Check for existing session (auto-login if user was previously signed in)
    AuthManager.checkAndAutoLogin();
});
