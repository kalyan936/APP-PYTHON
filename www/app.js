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
        overview: "Python is a high-level, interpreted programming language known for its clear syntax and readability. It is the perfect starting point for any software engineer.",
        explanation: "Created in 1991, Python's design philosophy emphasizes <strong>readability</strong>. It uses simple indentation instead of curly braces to define blocks of code.<br><br>Today, it is used for:<br>• <strong>Web Development:</strong> Backend logic for sites like Instagram.<br>• <strong>Data Science:</strong> Analyzing massive datasets.<br>• <strong>Machine Learning:</strong> Creating AI models.<br>• <strong>Automation:</strong> Writing scripts to handle repetitive tasks.",
        code: `# Your first Python code
print("Hello World!")

# Python is like talking to a computer
if 5 > 2:
    print("Logic is simple in Python!")`,
        visual: "A glowing Python logo transforming into a bridge connecting a human brain to a computer core.",
        recap: "Python is designed for humans first.<br>Clean indentation is required for structure.<br>It is the lead language for AI and Data Science.",
        hook: "Run your first print statement to start your coding journey!"
    },
    {
        id: 2,
        title: "Variables",
        tag: "DATA STORAGE",
        overview: "Variables are containers for storing data values. In Python, you don't need to declare types; you just assign a name to a value.",
        explanation: `<strong>Naming Rules:</strong> Variable names must start with a letter or underscore and are case-sensitive.<br><br><strong>Dynamic Typing:</strong> You can change a variable's type simply by assigning it a new value. This makes Python extremely flexible during development.`,
        code: `name = "Stitch"    # A String
level = 100         # An Integer
is_active = True    # A Boolean

# Variables can change!
level = "Master"
print(f"{name} is now at {level} level.")`,
        visual: "A row of colorful glowing jars, each labelled with a name and containing different types of data liquid.",
        recap: "Variables store information for later use.<br>Python handles data types automatically.<br>Use descriptive names for better readability.",
        hook: "Create a variable called 'xp' and set it to 500!"
    },
    {
        id: 3,
        title: "Operators",
        tag: "MATH & LOGIC",
        overview: "Operators are used to perform operations on variables and values. They are the building blocks of every calculation and logical check.",
        explanation: "<strong>1. Arithmetic:</strong> <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>//</code> (floor), <code>%</code> (remainder).<br><strong>2. Comparison:</strong> <code>==</code>, <code>!=</code>, <code>></code>, <code><</code>. Returns True or False.<br><strong>3. Logical:</strong> <code>and</code>, <code>or</code>, <code>not</code>. These allow you to combine multiple conditions into a single decision.",
        code: `# Math operations
result = 10 % 3 # Remainder is 1

# Logical checks
age = 20
has_ticket = True
can_enter = age >= 18 and has_ticket

print(f"Can enter? {can_enter}")`,
        visual: "A complex clockwork mechanism with interweaving gears representing different math symbols.",
        recap: "Arithmetic operators handle numeric calculations.<br>Logical operators evaluate truth values.<br>Comparison operators compare two values.",
        hook: "Try calculating the remainder of 15 divided by 4 using the % operator!"
    },
    {
        id: 4,
        title: "Input & Output",
        tag: "INTERACTION",
        overview: "Programs need to communicate. Input allows users to provide data, and Output displays results back to the user.",
        explanation: "<strong>1. Output:</strong> Use <code>print()</code>. F-strings (e.g., <code>f'Hello {name}'</code>) are the modern way to include variables in text.<br><br><strong>2. Input:</strong> Use <code>input()</code>. <strong>Crucial:</strong> input() always returns data as a <strong>string</strong>. You must convert it (casting) if you want to use it as a number.",
        code: `# Getting user data
user_name = input("Enter your name: ")
age = int(input("Enter your age: ")) # Convert to int

print(f"Welcome {user_name}! In 10 years, you will be {age + 10}.")`,
        visual: "A futuristic holographic interface where speech bubbles float between a human and a terminal.",
        recap: "print() sends data to the screen.<br>input() pauses execution and waits for user typing.<br>Always cast inputs if you need numeric data.",
        hook: "Ask the user for their favorite color and print it back with a message!"
    },
    {
        id: 5,
        title: "Data Types",
        tag: "CORE TYPES",
        overview: "Everything in Python is an object, and every object has a data type. Understanding these types is vital for memory and logic.",
        explanation: "<strong>1. Numeric:</strong> <code>int</code> (whole numbers), <code>float</code> (decimals), <code>complex</code>.<br><strong>2. Text:</strong> <code>str</code> (strings of characters).<br><strong>3. Boolean:</strong> <code>bool</code> (True or False values).<br><strong>4. Sequence Types:</strong> Groups like <code>list</code> and <code>tuple</code>.<br><br>Use <code>type()</code> to check what type of data a variable is holding.",
        code: `x = 10.5        # float
y = "Hello"     # str
z = True        # bool

print(f"x is a {type(x)}")
print(f"z is a {type(z)}")`,
        visual: "A sorting machine placing different shapes (data) into specialized bins (types).",
        recap: "Integers and Floats handle numbers.<br>Strings handle text data.<br>Booleans handle yes/no logic.",
        hook: "Check the type of the value 100.0 using the type() function!"
    },
    {
        id: 6,
        title: "Type Casting",
        tag: "TRANSFORMATION",
        overview: "Type Casting is the process of converting one data type into another. This is often necessary when mixing different types of data.",
        explanation: "<strong>1. Implicit Casting:</strong> Python does this automatically (e.g., adding an int to a float).<br><strong>2. Explicit Casting:</strong> You manually convert using functions like <code>int()</code>, <code>float()</code>, or <code>str()</code>.<br><br>This is most common when reading numeric input from a user or combining strings with numbers in old-style printing.",
        code: `age_str = "25"
age_int = int(age_str) # Conversion to int

price = 19.99
price_rounded = int(price) # results in 19 (removes decimals)

print(f"Age plus 5: {age_int + 5}")`,
        visual: "A magical lens that turns a block of wood (string) into a solid block of metal (integer).",
        recap: "int() converts to whole numbers.<br>str() converts anything to text.<br>float() adds decimal points to integers.",
        hook: "Convert the string '55' into a float and print it!"
    },
    {
        id: 7,
        title: "Conditional Statements",
        tag: "LOGIC GATES",
        overview: "Conditional statements allow your program to make decisions. Without them, your code would just run the same way every single time.",
        explanation: "<strong>1. If:</strong> Executes if a condition is True.<br><strong>2. Elif:</strong> Short for 'else if'; checks another condition if the first was False.<br><strong>3. Else:</strong> The 'catch-all' that runs if none of the previous conditions were met.<br><br>Python uses <strong>colon (:)</strong> and <strong>indentation</strong> to define which code belongs to the condition.",
        code: `score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
else:
    print("Keep studying!")`,
        visual: "A literal fork in the road where a digital sign post lights up based on your data input.",
        recap: "if starts the check sequence.<br>elif adds extra logic branches.<br>else provides the default behavior.",
        hook: "Write an if statement that prints 'Access Granted' if a variable password is 'secret'!"
    },
    {
        id: 8,
        title: "While Loops",
        tag: "REPETITION",
        overview: "A While Loop repeats a block of code as long as a specified condition remains True. It's useful when you don't know the exact number of iterations beforehand.",
        explanation: "<strong>The Structure:</strong> First, initialize a variable. Then, set the <code>while</code> condition. Inside the loop, you must <strong>update</strong> the variable so the loop eventually ends, otherwise you create an 'Infinite Loop'.<br><br><strong>Break:</strong> Use <code>break</code> to stop the loop immediately, even if the condition is still True.",
        code: `count = 1
while count <= 3:
    print(f"Iteration number: {count}")
    count += 1  # Increment to avoid infinite loop

print("Loop finished!")`,
        visual: "A circular race track where a car keeps going until its 'gas' variable hits zero.",
        recap: "While loops run while a condition is True.<br>Always update the control variable inside the loop.<br>Use them for listener loops or retry logic.",
        hook: "Create a while loop that prints numbers from 5 down to 1!"
    },
    {
        id: 9,
        title: "For Loops",
        tag: "ITERATION",
        overview: "A For Loop is used to iterate over a sequence (like a list, string, or range). It is predictable and executes a set number of times.",
        explanation: "<strong>1. Range:</strong> <code>range(5)</code> generates numbers from 0 to 4.<br><strong>2. Iterating Sequences:</strong> You can loop through every letter in a word or every item in a list directly.<br><strong>3. Continue:</strong> Use <code>continue</code> to skip the rest of the current iteration and move to the next one.",
        code: `# Using range
for i in range(1, 4):
    print(f"Step {i}")

# Iterating a string
for char in "PY":
    print(f"Letter: {char}")`,
        visual: "A conveyor belt moving standardized boxes (data items) past a scanner (the loop body).",
        recap: "For loops are used for predefined sequences.<br>range(start, stop) is commonly used for counting.<br>Continue skips one step; Break stops the whole loop.",
        hook: "Use a for loop to print every character in your name!"
    },
    {
        id: 10,
        title: "Strings & Indexing",
        tag: "TEXT MASTERY",
        overview: "Strings are sequences of characters. In Python, you can manipulate text by accessing specific positions called indexes.",
        explanation: "<strong>1. Indexing:</strong> Python indexes start at <strong>0</strong>. Use <code>str[0]</code> for the first letter.<br><strong>2. Slicing:</strong> Use <code>[start:stop]</code> to extract a portion of the string.<br><strong>3. Negative Indexing:</strong> Use <code>-1</code> to get the last character of the string, which is useful when you don't know the string's length.",
        code: `text = "Python"
# Get first letter
print(text[0])  # P

# Slice middle parts
print(text[0:2]) # Py

# Get last letter
print(text[-1]) # n`,
        visual: "A long train where each carriage holds one letter and has a specific number painted on the side.",
        recap: "Indexes always start at 0.<br>Slicing [start:end] excludes the ending index.<br>Negative indexes count backwards from the end.",
        hook: "Take the word 'Learning' and slice out the 'Learn' part!"
    },
    {
        id: 11,
        title: "Lists",
        tag: "COLLECTIONS",
        overview: "Lists are used to store multiple items in a single variable. They are ordered, changeable, and allow duplicate values.",
        explanation: "<strong>1. Creation:</strong> Defined with square brackets <code>[ ]</code>.<br><strong>2. Methods:</strong> Use <code>.append()</code> to add to the end, <code>.insert()</code> to add at a specific spot, and <code>.pop()</code> to remove an item.<br><strong>3. Nested Lists:</strong> A list can contain other lists, allowing you to create grids or matrices.",
        code: `fruits = ["Apple", "Banana"]
fruits.append("Orange")

# Accessing
print(f"Second item: {fruits[1]}")

# Updating
fruits[0] = "Mango"
print(fruits)`,
        visual: "A digital filing cabinet where you can easily slide new drawers in and out or reorder them.",
        recap: "Lists are mutable (can be changed).<br>Items are accessed via zero-based indexing.<br>Lists can hold different data types at once.",
        hook: "Create a list of 3 colors and append 'Purple' to it!"
    },
    {
        id: 12,
        title: "Tuples",
        tag: "CONSTANT DATA",
        overview: "Tuples are similar to lists but are IMMUTABLE. Once a tuple is created, its contents cannot be changed, added to, or removed.",
        explanation: "<strong>1. Why use them?</strong> They are faster than lists and safer for data that must not change (like coordinates or configuration).<br><strong>2. Syntax:</strong> Defined with parentheses <code>( )</code>.<br><strong>3. Packing/Unpacking:</strong> You can assign a tuple to multiple variables in one line.",
        code: `coordinates = (10, 20)
# coordinates[0] = 5  # This would cause an ERROR!

# Unpacking
x, y = coordinates
print(f"X is {x}, Y is {y}")`,
        visual: "A sealed, transparent glass safe where you can see the data inside but cannot reach in to change it.",
        recap: "Tuples use () and are immutable.<br>Used for fixed data sequences like GPS points.<br>Faster and more memory-efficient than lists.",
        hook: "Try to create a tuple of your birth day, month, and year!"
    },
    {
        id: 13,
        title: "Sets",
        tag: "UNIQUE ITEMS",
        overview: "A Set is an unordered collection of items where every element is unique. Sets are great for removing duplicates and performing math operations like unions.",
        explanation: "<strong>1. No Duplicates:</strong> If you add the same item twice, the set will only keep one.<br><strong>2. Operations:</strong> You can easily find the intersection (items in both), union (items in either), or difference (items in one but not the other) between two sets.<br><strong>3. Unordered:</strong> You cannot access items by index because the order is not guaranteed.",
        code: `nums = {1, 2, 2, 3}
print(nums) # results in {1, 2, 3}

# Check for existence
print(1 in nums) # True`,
        visual: "A magical bag that automatically dissolves any duplicate items you try to put inside.",
        recap: "Sets use {} and only store unique values.<br>Items are unordered and cannot be indexed.<br>Perfect for math-heavy comparison tasks.",
        hook: "Create a set from the list [1, 1, 2, 2, 3, 3] and see what happens!"
    },
    {
        id: 14,
        title: "Dictionaries",
        tag: "KEY-VALUE PAIRS",
        overview: "Dictionaries store data in Key:Value pairs. They are unordered, changeable, and indexed by keys instead of numbers.",
        explanation: "<strong>1. Mapping:</strong> Think of a real dictionary; you look up the 'Word' (Key) to find the 'Definition' (Value).<br><strong>2. Keys:</strong> Must be unique and immutable (like strings or numbers).<br><strong>3. Methods:</strong> Use <code>.keys()</code>, <code>.values()</code>, or <code>.items()</code> to see different parts of your dictionary.",
        code: `user = {
    "name": "Stitch",
    "level": 100,
    "role": "Admin"
}

print(user["name"]) # Stitch
user["level"] = 101 # Update`,
        visual: "A wall of numbered locks where each lock has a specific label and opens to reveal its own prize.",
        recap: "Dictionaries use {'key': 'value'} syntax.<br>Keys must be unique; values can be anything.<br>Fastest way to retrieve data by a specific label.",
        hook: "Create a dictionary representing a car with 'brand' and 'model' keys!"
    },
    {
        id: 15,
        title: "Functions",
        tag: "REUSABLE BLOCKS",
        overview: "A function is a block of code which only runs when it is called. Functions allow you to reuse logic without retyping it.",
        explanation: "<strong>1. Parameters:</strong> Data passed into the function to influence its behavior.<br><strong>2. Return:</strong> The keyword used to send a value back to where the function was called.<br><strong>3. DRY Principle:</strong> Don't Repeat Yourself! If you write the same code twice, make it a function.",
        code: `def greet(name):
    return f"Hello, {name}!"

# Call the function
message = greet("Programmer")
print(message)`,
        visual: "A vending machine where you insert currency (parameters) and it pushes out a specific product (return value).",
        recap: "Use 'def' to create a function.<br>Functions make code modular and easier to debug.<br>Local variables inside a function stay inside that function.",
        hook: "Write a function 'add' that takes a and b and returns their sum!"
    },
    {
        id: 16,
        title: "Lambda Expressions",
        tag: "ONE-LINERS",
        overview: "Lambda expressions are small, anonymous functions. They are used for simple, short-term tasks that don't require a full 'def' block.",
        explanation: "<strong>Syntax:</strong> <code>lambda arguments : expression</code>. You can have any number of arguments, but only <strong>one expression</strong>.<br><br>They are often used as arguments to other functions like <code>map()</code>, <code>filter()</code>, or for quick calculations.",
        code: `sqr = lambda x : x * x
print(sqr(5)) # 25

# Used in sorting
pairs = [(1, 'one'), (2, 'two')]
pairs.sort(key=lambda p: p[1]) # Sort by name`,
        visual: "A tiny portable tool that performs one specific job and fits right in your pocket.",
        recap: "Lambdas are anonymous (no name required).<br>Limited to a single expression.<br>Perfect for quick data filtering or sorting.",
        hook: "Create a lambda that multiplies two numbers 'a' and 'b'!"
    },
    {
        id: 17,
        title: "Classes & Objects",
        tag: "BLUEPRINTS",
        overview: "Object-Oriented Programming (OOP) allows you to model real-world concepts. A Class is a blueprint, and an Object is the actual item built from it.",
        explanation: "<strong>1. Attributes:</strong> Data stored within the object (e.g., color, health).<br><strong>2. Methods:</strong> Functions that belong to the object (e.g., walk, fire_laser).<br><strong>3. __init__:</strong> The special 'constructor' method that runs when an object is first created to set its initial state.",
        code: `class Robot:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"Beep! I am {self.name}"

my_bot = Robot("Dexter")
print(my_bot.speak())`,
        visual: "A holographic blueprint of a car that sparkles and solidifies into a real, driveable car.",
        recap: "Classes are templates; Objects are the instances.<br>'self' refers to the current object itself.<br>OOP helps organize complex, large-scale code.",
        hook: "Create a 'Dog' class with a 'bark' method!"
    },
    {
        id: 18,
        title: "Inheritance",
        tag: "SPECIALIZATION",
        overview: "Inheritance allows a class (Child) to take on the characteristics of another class (Parent). This prevents code duplication and allows for complex hierarchies.",
        explanation: "<strong>1. Parent Class:</strong> The base class containing general attributes.<br><strong>2. Child Class:</strong> The specialized class that inherits from the parent.<br><strong>3. Method Overriding:</strong> A child can replace a parent's method with its own version to behave differently.",
        code: `class Animal:
    def speak(self): print("Noise")

class Dog(Animal): # Inherits from Animal
    def speak(self): print("Woof!")

rexi = Dog()
rexi.speak() # Uses specialized version`,
        visual: "A family tree where the children inherit the height of the parents but develop their own unique skills.",
        recap: "Inheritance creates a 'is-a' relationship.<br>Child classes can add new methods or change old ones.<br>Pass the parent class name in parentheses during definition.",
        hook: "Make a 'Car' class inherit from a 'Vehicle' class!"
    },
    {
        id: 19,
        title: "Error Handling",
        tag: "CRASH PROTECTION",
        overview: "Errors (exceptions) are inevitable. Error handling allows your program to gracefully catch these errors instead of crashing and closing.",
        explanation: "<strong>1. Try:</strong> The block of code that might fail.<br><strong>2. Except:</strong> The block that runs if an error occurs. You can catch specific errors like <code>ZeroDivisionError</code>.<br><strong>3. Finally:</strong> Code that runs no matter what, often used for cleanup like closing files.",
        code: `try:
    num = int(input("Enter divisor: "))
    print(100 / num)
except ZeroDivisionError:
    print("Cannot divide by zero!")
except ValueError:
    print("Please enter a valid number!")`,
        visual: "A high-tech safety net that catches a falling gymnast and gently places them back on their feet.",
        recap: "Try-Except blocks keep your app alive.<br>Specific exceptions help you identify exactly what went wrong.<br>Finally is used for mission-critical cleanup.",
        hook: "Try to divide by zero in a try-except block and print a catch message!"
    },
    {
        id: 20,
        title: "Git & GitHub",
        tag: "VERSION CONTROL",
        overview: "Git is a version control system that tracks changes in your code. GitHub is a cloud platform where you can host and share your Git repositories.",
        explanation: "<strong>1. Commit:</strong> A snapshot of your work at a specific time.<br><strong>2. Branch:</strong> A parallel version of your code to test features without breaking the main app.<br><strong>3. Pull Request:</strong> A way to propose changes to a project and have others review your code before merging it.",
        code: `# Basic Git Commands
# git init         (Start project)
# git add .        (Stage changes)
# git commit -m "" (Save snapshot)
# git push         (Upload to cloud)`,
        visual: "A glowing timeline where you can travel back to any saved point in history or jump into parallel universes.",
        recap: "Git handles local version history.<br>GitHub enables global collaboration.<br>Branches isolate risky changes from stable code.",
        hook: "Create a GitHub account and push your first 'Hello World' file today!"
    },
    {
        id: 21,
        title: "Deployment",
        tag: "GOING LIVE",
        overview: "Deployment is the process of making your application available to the real world. It moves your code from your laptop to a server on the internet.",
        explanation: "<strong>1. Virtual Environments:</strong> Use <code>venv</code> to isolate your project's libraries so they don't conflict with other projects.<br><strong>2. Requirements:</strong> A list of tools your app needs to run (e.g., <code>pip freeze > requirements.txt</code>).<br><strong>3. Hosting:</strong> Platforms like Railway, Render, or AWS that run your code 24/7.",
        code: `# Deployment Prep
# 1. Create venv: python -m venv venv
# 2. Activate: venv\\Scripts\\activate
# 3. Create map: pip freeze > requirements.txt`,
        visual: "A rocket ship carrying a glass-shielded server box up into a glowing cloud in the sky.",
        recap: "Venv keeps your project clean and portable.<br>Requirements.txt is the recipe for your environment.<br>Launchpad (Deployment) makes your code real.",
        hook: "Look up Railway.app — it is one of the easiest ways to host a Python app for free!"
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
