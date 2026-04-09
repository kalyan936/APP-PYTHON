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
        tag: "THE BEGINNING",
        overview: "Programming shouldn't feel like math homework; it should feel like magic. Python is the world's most friendly bridge between your human ideas and the computer's raw power.",
        explanation: "Imagine talking to a super-intelligent robot using plain English. That is Python. Created in 1991, its entire design philosophy is built around <strong>Readability</strong>. If the code is hard to read, it's not 'Pythonic'.<br><br>Today, Python is the undisputed king of:<br>• <strong>Artificial Intelligence:</strong> Researching the future.<br>• <strong>Data Science:</strong> Making sense of the world's chaos.<br>• <strong>Web Dev:</strong> Powering Instagram, Netflix, and NASA.<br><br><strong>Why you'll love it:</strong> Unlike other languages, Python doesn't force you to use cryptic symbols like { } or ; to end your sentences. Instead, it uses simple <strong>Indentation</strong> (4 spaces). It forces your code to look clean, organized, and beautiful.",
        code: `# Your first conversation with Python
print("Hello Future Programmer!")

# Python can do math instantly
print(f"2 + 2 is {2 + 2}")

# It's as readable as a story
if 5 > 2:
    print("Five is indeed greater than two!")`,
        visual: "A glowing, neon-green circuit board morphing into a friendly robotic hand reaching out for a high-five.",
        recap: "Python is focused on human readability first.<br>It uses indentation (spaces) to structure code instead of messy brackets.<br>It is the primary language for AI and Data Science globally.",
        hook: "Try running: print('I am a Python developer!') and watch the computer respond!"
    },
    {
        id: 2,
        title: "Variables",
        tag: "DATA STORAGE",
        overview: "In Python, we don't just 'use' data; we store it in magical jars called Variables. You give each jar a name, and you can swap its contents whenever you want.",
        explanation: `<strong>Dynamic Typing:</strong> In older languages, you had to tell the computer exactly what was in the jar (Number, Text, etc.). Python is smarter. It looks inside the jar and figures it out for you.<br><br><strong>The Core Data Types:</strong><br><table style='width:100%; border-collapse: collapse; margin-top: 10px;'>
<tr style='background: rgba(255,255,255,0.05);'>
<td style='padding: 8px; border-bottom: 1px solid #333;'><strong>Type</strong></td>
<td style='padding: 8px; border-bottom: 1px solid #333;'><strong>Purpose</strong></td>
</tr>
<tr>
<td style='padding: 8px; border-bottom: 1px solid #333;'><code>int</code></td>
<td style='padding: 8px; border-bottom: 1px solid #333;'>Whole numbers (age, score)</td>
</tr>
<tr>
<td style='padding: 8px; border-bottom: 1px solid #333;'><code>float</code></td>
<td style='padding: 8px; border-bottom: 1px solid #333;'>Decimal numbers (price, GPA)</td>
</tr>
<tr>
<td style='padding: 8px; border-bottom: 1px solid #333;'><code>str</code></td>
<td style='padding: 8px; border-bottom: 1px solid #333;'>Text strings (\"Hello world\")</td>
</tr>
<tr>
<td style='padding: 8px; border-bottom: 1px solid #333;'><code>bool</code></td>
<td style='padding: 8px; border-bottom: 1px solid #333;'>True or False logic</td>
</tr>
</table><br>You can 'cast' (convert) data between types using functions like <code>str()</code> or <code>int()</code>.`,
        code: `# Store text
name = "Stitch"
# Store a number
level = 100

# Swap the number for text (Dynamic Typing!)
level = "Master Level"

print(f"User: {name} is at {level}")`,
        visual: "A row of glowing crystal jars on a floating shelf, each labelled with a holographic tag and glowing with a different color.",
        recap: "Variables are named storage spots in memory.<br>Python defines types automatically (Dynamic Typing).<br>Use descriptive names so your code reads like a book.",
        hook: "Create a variable called 'life_goal' and assign it your dream job!"
    },
    {
        id: 3,
        title: "Operators",
        tag: "MATH & LOGIC",
        overview: "Operators are the gears of your program. They crush numbers, compare truth, and decide which path your code should take next.",
        explanation: "<strong>1. Arithmetic:</strong> Use <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> for basic math. Use <code>//</code> for floor division (removes decimals) and <code>%</code> for modulo (the remainder).<br><br><strong>2. Comparison:</strong> Is X equal to Y? Use <code>==</code>. Is it different? Use <code>!=</code>. These are the basis of all computer decisions.<br><br><strong>3. Logical:</strong> The words <code>and</code>, <code>or</code>, and <code>not</code> allow you to build complex rules (e.g., 'If it is raining AND I have an umbrella').<br><br><strong>4. Membership:</strong> Use the word <code>in</code> to check if an item exists inside a list or a string. It's incredibly readable!",
        code: `# The Modulo trick (is a number even?)
num = 10
print(f"Is {num} even? {num % 2 == 0}")

# Chained logic
age = 25
has_license = True
can_drive = age >= 18 and has_license
print(f"Access Granted: {can_drive}")`,
        visual: "A massive brass mechanical engine where gears of different sizes (operators) interlock to move a golden logic lever.",
        recap: "Arithmetic operators handle calculations.<br>Comparison operators check for equality or size.<br>Logical operators combine truth values into smart conditions.",
        hook: "Calculate 2 raised to the power of 10 using the ** operator!"
    },
    {
        id: 4,
        title: "Input & Output",
        tag: "USER INTERACTION",
        overview: "A program that doesn't talk is just a ghost. We use Input and Output to bridge the gap between human users and the digital brain.",
        explanation: "<strong>Output (Print):</strong> We use <code>print()</code> to show data. Use <strong>f-strings</strong> (by adding an 'f' before your quotes) to inject variables directly into curly braces <code>{}</code>.<br><br><strong>Input (Asking):</strong> The <code>input()</code> function pauses the program and waits for the user to type. <br><br><strong>The Trap:</strong> Everything the user types returns as a <strong>String</strong>. You must wrap it in <code>int()</code> if you want to perform math on it!",
        code: `# Asking the user
favorite_food = input("What's your favorite meal? ")

# Responding with f-string
print(f"Excellent choice! I love {favorite_food} too.")

# Numeric conversion
height_cm = int(input("How tall are you in cm? "))
height_m = height_cm / 100
print(f"You are {height_m} meters tall.")`,
        visual: "A futuristic holographic interface where text bubbles float between a human and a glowing computer core.",
        recap: "print() sends data out; input() brings data in.<br>f-strings are the most efficient way to format text with data.<br>Always convert user input to a number if you need to calculate.",
        hook: "Ask the user for their name and their age, then print a personalized greeting!"
    },
    {
        id: 5,
        title: "Data Types",
        tag: "DECISION MAKING",
        overview: "Right now, our programs simply execute line by line. Real software makes decisions! Conditionals give your code a brain to make structural choices.",
        explanation: "<strong>1. If Statements:</strong> Decisions at a crossroad. Use <code>if</code> for the first check, <code>elif</code> for secondary checks, and <code>else</code> for the catch-all.<br><br><strong>2. Loops:</strong> Humans hate repetition; computers thrive on it.<br>• <strong>For Loops:</strong> Use when you know exactly how many times to repeat (e.g., for each item in a list).<br>• <strong>While Loops:</strong> Runs as long as a condition is True. Perfect for 'Keep going until the battery dies'.",
        code: `# Branching Decisions
weather = "raining"
if weather == "raining":
    print("Take an umbrella")
else:
    print("Enjoy the sun")

# Predictable Repetition
for i in range(3):
    print(f"Repetition {i+1}")`,
        visual: "A literal fork in a golden digital road, where glowing signs point you in different directions based on logic gates.",
        recap: "if/elif/else allows logical branching.<br>for loops iterate predictably over sequences.<br>while loops execute continuously until a condition becomes False.",
        hook: "Write an if-statement that checks if a score is 100 and prints 'Perfect Game!'"
    },
    {
        id: 6,
        title: "Type Casting",
        tag: "COLLECTIONS",
        overview: "As your data grows, you need smarter containers to hold related groups of information. List, Tuples, Sets, and Dictionaries are your storage heroes.",
        explanation: "<strong>1. Lists [ ]:</strong> Ordered rows of items. You can add, remove, and shuffle them anytime. Access them by index (starts at 0).<br><br><strong>2. Dictionaries { }:</strong> Label-based storage. Instead of 'item #1', you look up 'username' to get 'Stitch'. Lightning fast for data retrieval.<br><br><strong>3. Sets & Tuples:</strong> Use <strong>Sets</strong> to automatically delete duplicates and <strong>Tuples</strong> for data that must never change (like GPS coordinates).",
        code: `# A versatile list
inventory = ["Sword", "Shield", "Potion"]
inventory.append("Map")
print(f"First item: {inventory[0]}")

# A powerful dictionary
player = {"name": "Stitch", "level": 100}
print(f"Player {player['name']} is ready!")`,
        visual: "A high-tech digital filing cabinet where the list drawer holds ordered items and the dictionary drawer has labelled index cards.",
        recap: "Lists [] are your daily driver for sequences.<br>Dictionaries {} map labels to values for fast retrieval.<br>Sets handle unique items; Tuples handle immutable data.",
        hook: "Create a list of your 3 favorite movies and print the second one (Index 1)!"
    },
    {
        id: 7,
        title: "Conditional Statements",
        tag: "TEXT PROCESSING",
        overview: "In programming, text isn't just a list of words; it's a sequence of data that you can slice, dice, and transform with surgical precision.",
        explanation: `<strong>1. Slicing:</strong> Think of a word like a piece of wood. You can use <code>[start:stop]</code> to cut out exact sections. Want the first 4 letters? Use <code>[:4]</code>.<br><br><strong>2. Cleaning:</strong> Use <code>.strip()</code> to remove annoying whitespace from user input, and <code>.replace()</code> to swap out whole sections of text instantly.<br><br><strong>3. Searching:</strong> The <code>re</code> module (Regular Expressions) is like a metal detector for text. It can find every email address or phone number hidden in a massive document in milliseconds.`,
        code: `# Slicing a word
word = "Programming"
print(f"First 4: {word[:4]}") # result: Prog

# Multi-method chaining
data = "  python code  "
print(data.strip().upper()) # result: "PYTHON CODE"`,
        visual: "A robotic, pinpoint laser cleanly slicing through a floating 3D word block, rearranging the glowing letters gracefully.",
        recap: "Strings are sequences of characters that can be sliced.<br>Methods like .strip() and .upper() handle common cleaning tasks.<br>Regular Expressions (re) provide advanced pattern searching.",
        hook: "Take the word 'Learning' and slice out only the 'Learn' part (Index 0 to 5)!"
    },
    {
        id: 8,
        title: "While Loops",
        tag: "REUSABLE CODE",
        overview: "Functions are the ultimate time-savers. They package complex logic into reusable factories so you don't have to keep writing the same code over and over.",
        explanation: `<strong>The DRY Rule:</strong> Don't Repeat Yourself. If you type the same logic twice, put it in a function.<br><br><strong>1. Inputs (Arguments):</strong> Raw materials you drop into the factory.<br><strong>2. Output (Return):</strong> The finished product that pops out the other side.<br><br><strong>3. Lambdas:</strong> These are tiny, one-liner functions (like a mini-conveyor belt) for simple tasks.`,
        code: `# A function factory
def create_greeting(name, time="Morning"):
    return f"Good {time}, {name}!"

# Using the factory
print(create_greeting("Stitch", "Evening"))

# A mini Lambda conveyor belt
double = lambda x: x * 2
print(f"Double of 10: {double(10)}")`,
        visual: "A futuristic chrome vending machine where raw materials (arguments) go in, gears turn (logic), and the finished soda (return) pops out.",
        recap: "Functions prevent code duplication (the DRY principle).<br>Use 'def' to create the blueprint and 'return' to send the result out.<br>Default parameters allow flexibility without extra work.",
        hook: "Create a function called 'multiply' that takes two numbers and returns their product!"
    },
    {
        id: 9,
        title: "For Loops",
        tag: "CODE LIBRARIES",
        overview: "You don't need to reinvent the wheel. Python gives you access to a limitless library of pre-written code that you can teleport into your project instantly.",
        explanation: `<strong>1. The Standard Library:</strong> Python comes with 'batteries included'. Modules like <code>math</code>, <code>random</code>, and <code>datetime</code> are already on your machine.<br><br><strong>2. External Packages:</strong> There are over 400,000 community libraries. Use <strong>PIP</strong> (the Package Installer) to grab them.<br><br><strong>3. Main Guards:</strong> Use <code>if __name__ == "__main__":</code> to ensure code only runs when you execute the file directly, not when someone else imports it.`,
        code: `import math
from random import randint

# Teleporting math logic
print(f"Square root of 81 is {math.sqrt(81)}")

# Rolling a digital die
print(f"You rolled a: {randint(1, 6)}")`,
        visual: "A massive, towering library stretching to the clouds. You whisper 'import physics' and an entire book of calculations flies into your hands.",
        recap: "Modules allow you to use code written by others or yourself across different files.<br>PIP is the gateway to the global Python ecosystem.<br>Keep your code modular for easier debugging and maintenance.",
        hook: "Import the 'datetime' module and print out the current date and time!"
    },
    {
        id: 10,
        title: "Strings & Indexing",
        tag: "STORAGE",
        overview: "When your computer turns off, variables vanish. To make data permanent, you must store it in the Iron Vault of your hard drive.",
        explanation: `<strong>1. The Safety Net:</strong> Always use <code>with open()</code>. It's like a robotic arm that opens the drawer, writes the notes, and guaranteed-slams the drawer shut even if the building catches fire.<br><br><strong>2. File Modes:</strong><br>• <code>'w'</code>: Wipe and write fresh.<br>• <code>'a'</code>: Append (add) to the end of the existing file.<br>• <code>'r'</code>: Read the contents back into your brain.`,
        code: `# Writing into the vault safely
with open("quest.txt", "w") as vault:
    vault.write("Objective: Master Python!")

# Peeking back inside
with open("quest.txt", "r") as vault:
    print(f"Current quest: {vault.read()}")`,
        visual: "A tiny robotic arm carefully sliding a piece of paper into a heavy steel filing cabinet and locking it with a loud CLICK.",
        recap: "Always use 'with open()' to prevent data corruption.<br>File modes decide if you overwrite or add to a file.<br>Persistence is what separates scripts from real applications.",
        hook: "Write a script that creates 'notes.txt' and writes your name inside it!"
    },
    {
        id: 11,
        title: "Lists",
        tag: "CRASH PROTECTION",
        overview: "Users will break your code. They type text into number boxes and delete files they shouldn't. Exceptions are the safety nets that catch the fall so the app doesn't die.",
        explanation: `<strong>1. Try-Except:</strong> Wrap risky code in <code>try</code>. If it triggers an error, the <code>except</code> block catches the fire.<br><br><strong>2. Specificity:</strong> Don't just catch 'anything'. Catch the exact problem (like <code>ZeroDivisionError</code>) so you can fix it properly.<br><br><strong>3. Finally:</strong> The <code>finally</code> block runs no matter what. It's used for mission-critical cleanup, like turning off a laser before the program exits.`,
        code: `try:
    num = int(input("Enter divisor: "))
    print(f"10 / {num} = {10 / num}")
except ZeroDivisionError:
    print("Security Alert: You cannot divide by zero!")
except ValueError:
    print("Input Error: Please only type numbers.")`,
        visual: "A high-speed train derailing off a broken track, but jumping safely into a massive, soft carbon-fiber net.",
        recap: "Anticipate user errors before they happen.<br>Try-Except blocks keep your application running during failures.<br>Specific error names make debugging 10x faster.",
        hook: "Try to divide 10 by 'hello' in a try block and catch the error!"
    },
    {
        id: 12,
        title: "Tuples",
        tag: "BLUEPRINTS",
        overview: "Object-Oriented Programming (OOP) allows you to model the real world. Instead of loose variables, you create 'Classes' which are blueprints for objects like 'Users', 'Enemies', or 'Cars'.",
        explanation: `<strong>1. Classes:</strong> The theoretical architectural blueprint.<br><strong>2. Objects:</strong> The actual houses built from that blueprint.<br><br><strong>The Core Pillars:</strong><br>• <strong>Attributes:</strong> What the object HAS (e.g., color, name, health).<br>• <strong>Methods:</strong> What the object DOES (e.g., drive, speak, attack).<br>• <strong>Inheritance:</strong> Creating a 'Super Class' (Vehicle) and making specialized versions (Car, Plane) that inherit its traits.`,
        code: `class Robot:
    def __init__(self, name):
        self.name = name # Attribute

    def speak(self): # Method
        return f"Greetings, I am {self.name}!"

# Create an object from the blueprint
bot = Robot("Dexter")
print(bot.speak())`,
        visual: "A glowing blue holographic blueprint morphing and sparking until it solidifies into a tangible metal robot that walks away.",
        recap: "Classes are templates; Objects are the living instances in memory.<br>The __init__ method is a special 'constructor' that runs when the object is born.<br>'Self' allows an object to talk to its own internal data.",
        hook: "Create a class called 'Warrior' with a 'power' attribute and print it!"
    },
    {
        id: 13,
        title: "Sets",
        tag: "META PROGRAMMING",
        overview: "As you move from coder to engineer, you need to understand the hidden mechanisms that make Python scale to millions of users.",
        explanation: `<strong>1. Iterators & Generators:</strong> Memory is expensive. Instead of creating a list of 1 million items, use a <strong>Generator</strong> (with <code>yield</code>) to produce them one at a time. It's like a faucet instead of a bucket.<br><br><strong>2. Decorators:</strong> A way to wrap your code in specialized logic. Use <code>@decorator</code> to add logging, authentication, or timing to any function without changing its internal code.<br><br><strong>3. The GIL:</strong> Python's 'Global Interpreter Lock'. Understanding this is key to mastering <strong>Multiprocessing</strong> and high-performance computing.`,
        code: `# A memory-saving generator
def countdown(n):
    while n > 0:
        yield n
        n -= 1

# Using the generator
for num in countdown(3):
    print(num)

# A simple decorator wrapper
def log_call(func):
    return lambda *args: (print("Calling..."), func(*args))`,
        visual: "A room of infinite mirrors where every action (function) is reflected and modified by golden rings (decorators) while energy flows as needed (generators).",
        recap: "Generators save memory by producing data on-demand.<br>Decorators allow you to inject logic once and use it everywhere.<br>Advanced Python is about efficiency and architecture.",
        hook: "Research what 'yield' does compared to 'return' — it's the heart of streaming data!"
    },
    {
        id: 14,
        title: "Dictionaries",
        tag: "BATTERIES INCLUDED",
        overview: "Python says it comes with 'batteries included'. This means it ships with an massive internal Power Grid of tools that can handle almost any task imaginable.",
        explanation: `<strong>1. Time & OS:</strong> The <code>datetime</code> module handles messy timezones, while <code>os</code> and <code>sys</code> let you talk to the operating system itself.<br><br><strong>2. Collections:</strong> Use <code>Counter</code> to instantly count duplicates or <code>deque</code> for lightning-fast lists.<br><br><strong>3. Math & Random:</strong> From rolling dice (<code>random.randint</code>) to calculating complex geometry (<code>math.pi</code>), the power is at your fingertips.`,
        code: `import math
from random import randint
from datetime import datetime

# Rolling a digital die
print(f"You rolled a {randint(1, 20)}!")

# Modern timestamping
now = datetime.now()
print(f"Recorded at: {now.strftime('%H:%M:%S')}")`,
        visual: "A massive industrial power grid with thousands of plugs, each granting access to a different superpower like time travel or advanced physics.",
        recap: "The Standard Library is built-in and requires no installation.<br>'import' is how you plug into the grid.<br>Mastering these modules separate beginners from pros.",
        hook: "Import 'random' and print a random choice from a list of your 3 favorite colors!"
    },
    {
        id: 15,
        title: "Functions",
        tag: "DATA PERSISTENCE",
        overview: "Professional applications don't use text files; they use Databases. Databases are organized vaults that can search through billions of rows in the blink of an eye.",
        explanation: `<strong>1. SQL:</strong> The universal language of data. Even if you aren't a coder, knowing SQL is a career superpower.<br><br><strong>2. SQLite:</strong> Python has a full database engine built-in. It's file-based, meaning you don't need a server to start building database-powered apps.<br><br><strong>3. CRUD:</strong> The four operations of the vault: <strong>C</strong>reate, <strong>R</strong>ead, <strong>U</strong>pdate, and <strong>D</strong>elete.`,
        code: `import sqlite3

# Create a vault in your RAM
conn = sqlite3.connect(":memory:")
cur = conn.cursor()

# Create a table
cur.execute("CREATE TABLE users (name TEXT, level INTEGER)")
cur.execute("INSERT INTO users VALUES ('Stitch', 100)")

# Retrieve data
cur.execute("SELECT * FROM users")
print(f"Logged in: {cur.fetchone()}")`,
        visual: "A massive, glowing bank vault where data is slotted into perfectly organized grids, rows, and tightly guarded tables.",
        recap: "Databases provide structured, fast, and secure storage.<br>SQLite is perfect for small apps and learning.<br>SQL is the standard language for interacting with data.",
        hook: "Look up what a 'Primary Key' is in a database — it's how we keep data unique!"
    },
    {
        id: 16,
        title: "Lambda Expressions",
        tag: "BUILDING THE WEB",
        overview: "Python is the heartbeat of the internet. It powers the 'Backend' — the invisible brain behind websites like Instagram, Pinterest, and Netflix.",
        explanation: `<strong>1. Frameworks:</strong> Use <strong>Flask</strong> for simple, fast websites and <strong>Django</strong> for massive enterprise platforms.<br><br><strong>2. API Bridges:</strong> Websites talk to each other using <strong>APIs</strong>. Python is the world's best tool for building these digital bridges.<br><br><strong>3. Routing:</strong> Mapping a URL (like /home) to a specific Python function that serves a webpage.`,
        code: `# A tiny Flask server example
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "<h1>Python Web App Live!</h1>"

# In a real app, you would run: app.run()`,
        visual: "A bustling dispatch center where request envelopes fly in from around the world and Python blasts back webpages in milliseconds.",
        recap: "The Backend handles logic, security, and data storage.<br>Flask and Django are the two industry-standard choices.<br>APIs allow your Python code to talk to browsers and mobile apps.",
        hook: "Search for 'Flask Hello World' — you can have a website live in 5 minutes!"
    },
    {
        id: 17,
        title: "Classes & Objects",
        tag: "DATA INSIGHTS",
        overview: "Raw data is just noise. Data Science is the art of turning that noise into clear, actionable stories. Python is the undisputed king of this field.",
        explanation: `<strong>1. NumPy:</strong> High-performance math arrays. Fast as lightning.<br><strong>2. Pandas:</strong> This is Excel on steroids. It can clean and analyze millions of rows of data instantly.<br><strong>3. Visualization:</strong> Turning numbers into art. Libraries like <code>Matplotlib</code> allow you to build charts, graphs, and heatmaps that reveal hidden trends.`,
        code: `import pandas as pd

# Creating a mini-spreadsheet (DataFrame)
stats = {"Level": [1, 2, 3], "XP": [100, 250, 500]}
df = pd.DataFrame(stats)

# Instantly finding the average
print(f"Average XP: {df['XP'].mean()}")`,
        visual: "A chaotic hurricane of numbers flowing into a funnel and coming out as perfectly color-coded, elegant charts.",
        recap: "Pandas is the primary tool for data manipulation.<br>Data cleaning is 80% of the job for an Oracle (Data Scientist).<br>Visualization turns cold numbers into compelling stories.",
        hook: "Research 'What is a DataFrame' — it's the fundamental unit of all data science!"
    },
    {
        id: 18,
        title: "Inheritance",
        tag: "ARTIFICIAL INTEL",
        overview: "Teaching computers to find patterns without explicit instructions. This is the foundation of self-driving cars, medicine, and chatbots like ChatGPT.",
        explanation: `<strong>1. Supervised Learning:</strong> Training models using 'labeled data' (inputs + correct answers). It's like teaching a child by showing them pictures of apples and oranges.<br><br><strong>2. Regression vs Classification:</strong> Regression predicts numbers (like house prices), while Classification predicts categories (like 'Dog' vs 'Cat').<br><br><strong>3. Neural Networks:</strong> Massive layers of digital 'neurons' (modeled after the human brain) that can learn complex patterns in images and voice.`,
        code: `# Using Scikit-learn (Industry Standard)
# from sklearn.ensemble import RandomForestClassifier

# ML Workflow:
# 1. Gather Data
# 2. Train Model: model.fit(X_train, y_train)
# 3. Predict: result = model.predict(X_test)

print("AI learns from history to predict the future.")`,
        visual: "A digital brain digesting thousands of chess games, building internal connections, until it achieves total mastery.",
        recap: "Machine Learning is about pattern recognition at scale.<br>Scikit-learn is the primary library for traditional ML in Python.<br>Data quality is more important than the algorithm itself.",
        hook: "Look up 'What is a Neural Network' — it's the engine behind modern AI!"
    },
    {
        id: 19,
        title: "Error Handling",
        tag: "CODE QUALITY",
        overview: "Professional code isn't just code that works; it's code that is tested. Testing finds bugs before your users do, making your app bulletproof.",
        explanation: `<strong>1. Debugging:</strong> Using tools like <code>pdb</code> to pause time and inspect your variables mid-execution.<br><br><strong>2. Unit Testing:</strong> Writing small scripts that 'test' your main code. If you change something and the tests fail, you know exactly what broke.<br><br><strong>3. Pytest:</strong> The most popular testing framework in Python. It's simple, fast, and incredibly powerful.`,
        code: `# A simple test case
def add(a, b): return a + b

# Using assert to check logic
def test_add():
    assert add(1, 2) == 3
    print("Test Passed! ✓")

test_add()`,
        visual: "A robotic inspector arm scanning every component on an assembly line to ensure nothing ever snaps under pressure.",
        recap: "Testing saves you from 'regression' (breaking old features with new code).<br>Pytest is the professional standard for testing in Python.<br>Write tests for your most critical logic first.",
        hook: "Research 'TDD' (Test Driven Development) — it's how the world's best engineers write code!"
    },
    {
        id: 20,
        title: "Git & GitHub",
        tag: "COLLABORATION",
        overview: "Git is the ultimate time machine for your code. It tracks every change, allowing you to go back in time or work with thousands of people at once.",
        explanation: `<strong>1. Commits:</strong> Snapshots of your project. Each commit is a saved point in history.<br><br><strong>2. Branching:</strong> Parallel universes. Create a 'feature branch' to try something crazy without breaking the main app.<br><br><strong>3. GitHub:</strong> The cloud for your code. It's where the global developer community hosts projects, collaborates, and shares ideas.`,
        code: `# The Big 4 Git Commands:
# 1. git init (Start a project)
# 2. git add . (Prepare changes)
# 3. git commit -m "Message" (Save snapshot)
# 4. git push (Upload to the cloud)`,
        visual: "A glowing timeline showing parallel threads of code branching off, then elegantly weaving back together into a stronger master thread.",
        recap: "Git handles local version history; GitHub handles cloud collaboration.<br>Never share code by zip file — always use Git.<br>Clear commit messages are a key professional skill.",
        hook: "Create a free GitHub account today — it's the first step to becoming a pro!"
    },
    {
        id: 21,
        title: "Deployment",
        tag: "GOING LIVE",
        overview: "Moving your code from your laptop to the real world. Deployment is the final stage where your app becomes a live service used by people.",
        explanation: `<strong>1. Environments:</strong> Use <code>venv</code> (Virtual Environments) to isolate your project's libraries. This prevents 'Dependency Hell'.<br><br><strong>2. Packaging:</strong> Creating a <code>requirements.txt</code> file so a server knows exactly which tools to install to run your app.<br><br><strong>3. Cloud Hosting:</strong> Services like Railway, Render, or AWS that host your app 24/7 so it's always accessible to the world.`,
        code: `# Preparing for launch:
# 1. Create venv: python -m venv venv
# 2. Save requirements: pip freeze > requirements.txt
# 3. Deploy to cloud (e.g., git push heroku main)`,
        visual: "A shiny glass dome shielding your code as it's lifted by drones into a massive glowing cloud server in the sky.",
        recap: "Virtual environments keep your project libraries clean and isolated.<br>A requirements file acts as a map for the server.<br>Launchpad (Deployment) makes your work real and accessible.",
        hook: "Look up 'Railway.app' — it's one of the easiest ways to host your first Python app!"
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
