const theoryModules = [
    {
        id: 1,
        title: "Introduction to Python",
        tag: "THE FRIENDLY SNAKE",
        overview: "Python is a high-level, dynamically typed programming language. Its purpose is to prioritize human readability over machine-level code. Imagine giving instructions to a human assistant—Python reads almost like plain English.",
        explanation: "Unlike older languages requiring semicolons and curly braces, Python relies purely on indentation (whitespace). Code blocks are defined by spaces. <strong>Pitfall:</strong> Mixing spaces and tabs will crash your program. Always use 4 spaces.",
        code: `# Correct Usage\nprint("Hello, World!")\n\n# Incorrect Usage (Indentation Error)\n  print("Crash!")`,
        visual: "Animation Idea: A block of messy C++ code smoothly morphing into clean, minimal Python code, with syntax elements dissolving away.",
        recap: "Python is readable and beginner-friendly.<br>It uses indentation instead of brackets.<br><em>Why it matters:</em> You spend less time debugging syntax.",
        hook: "Can you make the computer say your name? Write a print() statement in the sandbox!"
    },
    {
        id: 2,
        title: "Basic Syntax",
        tag: "THE GRAMMAR OF PYTHON",
        overview: "Syntax is the spelling and grammar of programming. Without it, the computer cannot understand your commands. It's like punctuation in literature.",
        explanation: "Use the # symbol for notes (comments). Python is case-sensitive, meaning <code>apple</code> is totally different from <code>Apple</code>. Always keep your code clean by writing notes.",
        code: `# This is a comment. Python ignores me!\nuserName = "Alice"\nusername = "Bob" # A separate variable!`,
        visual: "Interactive Idea: Hovering over the # turns the rest of the text transparent grey.",
        recap: "Python is case-sensitive.<br>Use # to write human-readable comments.",
        hook: "Try writing a line of code and put a # in front of it. Run it and watch nothing happen!"
    },
    {
        id: 3,
        title: "Variables & Data Types",
        tag: "DIGITAL CONTAINERS",
        overview: "Variables store information you can use later. Think of a variable as a labeled moving box. The data type defines what goes inside—books (Text), a bowling ball (Number), or a light switch (True/False).",
        explanation: "Python is dynamically typed. Integer (whole numbers), Float (decimals), String (text in quotes), and Boolean (True/False). <strong>Pitfall:</strong> Don't accidentally wrap numbers in quotes!",
        code: `age = 25          # Integer\nprice = 19.99     # Float\nname = "Python"   # String\n\nprint("10" + "10") # Pitfall Output: 1010`,
        visual: "Animation Idea: A carton box labeled 'age' dropping down, as the number 25 falls directly into it.",
        recap: "Variables act as data containers.<br>There are core types: int, float, str, bool.",
        hook: "Ready to pack your own boxes? Create a variable called my_favorite_food!"
    },
    {
        id: 4,
        title: "Operators",
        tag: "PYTHON'S CALCULATOR",
        overview: "Operators are symbols that perform arithmetic or logical operations. They are the verbs of your math sentences.",
        explanation: "Arithmetic: +, -, *, /, ** (exponent). The Modulo % operator returns the remainder of a division—highly useful for checking even/odd numbers! Assignment: = assigns a value.",
        code: `result = 10 ** 2 # 10 to power of 2 (100)\nremainder = 10 % 3 # Returns 1\n\nscore = 10\nscore += 5 # Score is now 15`,
        visual: "Animation Idea: A visual equation where 10 % 3 splits 10 blocks into three groups of 3, leaving 1 lonely red block.",
        recap: "Math operators work standardly.<br>Modulo % gives the remainder.",
        hook: "Use the modulo operator to find the remainder of 100 divided by 7!"
    },
    {
        id: 5,
        title: "Control Flow",
        tag: "MAKING DECISIONS",
        overview: "Control Flow allows programs to make decisions based on conditions. Imagine a train approaching a junction: green light goes right, red light stops.",
        explanation: "if checks a condition. elif checks alternate conditions. else is the catch-all. Every statement must end with a colon : and the next line must be strictly indented.",
        code: `if temp > 25:\n    print("Hot!")\nelif temp > 15:\n    print("Nice.")\nelse:\n    print("Cold.")`,
        visual: "Diagram: A flowchart where a glowing ball hits a diamond (IF) and splits down the correct glowing path based on state.",
        recap: "if, elif, and else control dynamic logic.<br>Don't forget the colon : at the end!",
        hook: "Write an if/else block that checks your age. If 18+, print 'Access Granted'!"
    },
    {
        id: 6,
        title: "Loops",
        tag: "THE ART OF REPETITION",
        overview: "Loops run the same block of code multiple times. A for loop plays a playlist exactly 5 times. A while loop plays it until your battery dies.",
        explanation: "for loops iterate over known collections. while loops run while a condition is True. Use break to kill the loop and continue to skip a cycle. <strong>Pitfall:</strong> Infinite while loops!",
        code: `for i in range(3):\n    print(i) # 0, 1, 2\n\nbatt = 100\nwhile batt > 0:\n    batt -= 50\n    if batt == 0:\n        break`,
        visual: "Animation: A loop gear rotating continuously. A 'break' command visually jams a stick into the gear instantly.",
        recap: "for iterates a known number of times.<br>while loops conditionally.<br>break stops it forever.",
        hook: "Write a loop that prints the numbers 1 through 10!"
    },
    {
        id: 7,
        title: "Functions",
        tag: "REUSABLE BLUEPRINTS",
        overview: "A function is a packaged block of code designed to do one job. Like a blender, you provide parameters (fruit) and it returns a smoothie.",
        explanation: "Use def to create one. Parameters are variables passed in. return pushes data out. Variables created inside are local (Scope limitation).",
        code: `def make_smoothie(fruit):\n    return fruit + " smoothie"\n\nprint(make_smoothie("Mango"))`,
        visual: "Interactive Stack: An animatic box opens, inputs drop in, gears spin, and data pops out the return side.",
        recap: "Define functions utilizing def.<br>Params go in, returns come out.<br>Functions keep code DRY.",
        hook: "Build a greet() function that takes a name and returns 'Hello [name]'!"
    },
    {
        id: 8,
        title: "Data Structures",
        tag: "ORGANIZING THE CHAOS",
        overview: "Containers that organize data natively. Lists are cargo trains. Tuples are locked time-capsules. Sets have no duplicates. Dictionaries hold key-value lookups.",
        explanation: "Lists [] are mutable. Tuples () are immutable. Sets {} are unique-only. Dictionaries mapped unique keys to values for extreme speed.",
        code: `lst = ["App", "App"] # Mutable\nmy_set = {"App", "App"} # Becomes {"App"}\n\nd = {"name": "Python"}\nprint(d["name"]) # Fast lookup!`,
        visual: "Animation: A Dictionary visually drawing a glowing neon line across the screen between a Key lock and a Value chest.",
        recap: "Choose structures based on the job.<br>Tuples save memory; Dicts guarantee speed.",
        hook: "Create a Dictionary with your name and age, then print your age!"
    },
    {
        id: 9,
        title: "String Handling",
        tag: "TEXT SURGERY",
        overview: "Rather than manually editing a block of text, you can give Python the scalpel to slice, change, and construct dynamic sentences instantly.",
        explanation: "Slicing extracts text pieces: [start:stop]. Methods like .upper() modify case. f-Strings are the ultimate way to inject variables seamlessly.",
        code: `text = "Python Programming"\nprint(text[0:6]) # 'Python'\n\nv = 3\nprint(f"I love {text} {v}!")`,
        visual: "Hover-Action: Scissor icons appear to dynamically cut the word 'Python' out of the main string.",
        recap: "Strings behave similarly to generic Lists.<br>f-Strings format cleanly and rapidly.",
        hook: "Take the string 'racecar' and try to reverse it using negative slicing!"
    },
    {
        id: 10,
        title: "File Handling",
        tag: "READING THE ARCHIVES",
        overview: "Allows your program to read existing files and write permanent notes to the hard drive. Like a physical notebook you can read 'r' or overwrite 'w'.",
        explanation: "Use open(). Mode 'r' reads, 'w' destroys old data and writes fresh, 'a' appends to the end. Always use the with statement to auto-close memory safely.",
        code: `with open("notes.txt", "w") as f:\n    f.write("Hello disk!")\n\nwith open("notes.txt", "r") as f:\n    print(f.read())`,
        visual: "Diagram: A script visually opening a glowing yellow folder, inserting data, and dropping a secure padlock onto it.",
        recap: "W mode overwrites everything completely.<br>Always use the context manager (with open).",
        hook: "Use 'w' mode to write your name into a user.txt file."
    },
    {
        id: 11,
        title: "Error Handling",
        tag: "CRASH PREVENTION",
        overview: "Code breaks. Error handling acts as a safety net. If an acrobat falls, the net catches them gracefully so the show can continue without a crash.",
        explanation: "try attempts code. except catches specific errors and intervenes. finally executes unconditionally at the end to clean up the workspace.",
        code: `try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("You can't divide by zero!")\nfinally:\n    print("Cleaning up...")`,
        visual: "Animation: A line of execution hits a bomb (Error), a TRY shield forms, defusing it and landing safely onto the EXCEPT pad.",
        recap: "Anticipate crashes dynamically.<br>Use finally to always close server connections.",
        hook: "Try converting 'hello' into an int() and catch the error!"
    },
    {
        id: 12,
        title: "Modules and Packages",
        tag: "BORROWING SUPERPOWERS",
        overview: "You don't write everything from scratch. Modules are files written by others. 'pip' is the store, 'import' is snapping the lego block onto your app.",
        explanation: "Use import to pull in global libraries. Use from X import Y to pull specific features. pip installs them directly via terminal.",
        code: `import math\nfrom datetime import datetime\n\nprint(math.sqrt(16)) # 4.0\nprint(datetime.now())`,
        visual: "Interactive: A terminal visually downloading internet packages that instantly snap into the Python script UI.",
        recap: "Import allows leveraging massive tools.<br>Pip accesses global community projects.",
        hook: "Import random, and use random.randint(1,10)!"
    },
    {
        id: 13,
        title: "Object-Oriented Programming",
        tag: "REAL WORLD MAPPING",
        overview: "OOP models software around real objects. A Class is the blueprint (Cookie cutter). Objects are the physical creations (Cookies) with unique attributes.",
        explanation: "Classes declare blueprints. Attributes are variables (Adjectives). Methods are functions (Verbs). init is the constructor setup function.",
        code: `class Dog:\n    def __init__(self, name):\n        self.name = name # Attribute\n\n    def bark(self): # Method\n        return f"{self.name} says Woof!"\n\nmy_dog = Dog("Rex")\nprint(my_dog.bark())`,
        visual: "Animation: A blueprint factory stamping a Dog mold, outputting visually distinct 3D dog instances based on __init__ rules.",
        recap: "Classes equal Blueprints.<br>Objects equal Physical Memory Instances.",
        hook: "Write a Car class with a drive() method and test it!"
    }
];

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

    // Navigation overrides
    window.navigateTo = function(targetScreenId) {
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
            if (item.getAttribute('onclick')?.includes(targetScreenId)) {
                item.classList.add('active');
            }
        });
        
        const activeScrollable = targetScreen?.querySelector('.scrollable');
        if (activeScrollable) {
            activeScrollable.scrollTop = 0;
        }
    };

    window.openTheoryModule = function(moduleId) {
        const mod = theoryModules.find(m => m.id === moduleId);
        if(!mod) return;

        // Render Theory HTML
        let htmlSnippet = `
            <h1 class="title-manrope white-text margin-bot">${mod.id}. ${mod.title}</h1>
            <p class="lesson-body margin-bot">${mod.overview}</p>
            
            <div class="card theory-card component-margin">
                <div class="tag-pill">${mod.tag}</div>
                <h3 class="flex-align"><span class="icon">🔍</span> Detailed Explanation</h3>
                <p class="theory-text margin-bot">${mod.explanation}</p>
                <div class="code-gimmick">
                    <pre><code class="language-python">${mod.code}</code></pre>
                </div>
            </div>

            <div class="card theory-card component-margin">
                <h3 class="flex-align"><span class="icon">✨</span> Visualization Queue</h3>
                <p class="theory-text">${mod.visual}</p>
            </div>

            <div class="accordion card component-margin" onclick="this.classList.toggle('open')">
                <div class="acc-header">
                    <span class="icon">⚡</span> <span>Quick Recap</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="acc-content">
                    <p class="theory-body">${mod.recap}</p>
                </div>
            </div>

            <div class="card sandbox-card component-margin" style="background: var(--surface-bright); text-align: center;">
                <h3 class="white-text margin-bot">🏋️ Practice Hook</h3>
                <p class="theory-text margin-bot">${mod.hook}</p>
                <button class="primary-btn" onclick="navigateTo('screen-editor')">Launch Sandbox Workspace ▸</button>
            </div>

            <div class="nav-actions flex-between margin-bot">
                <button class="text-btn grey" onclick="navigateTo('screen-theory-menu')">← Back to Menu</button>
            </div>
            <div style="height: 100px;"></div>
        `;

        theoryContainer.innerHTML = htmlSnippet;
        navigateTo('screen-theory');
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
});
