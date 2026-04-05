const theoryModules = [
    {
        id: 1,
        title: "Introduction to Python",
        tag: "THE FRIENDLY SNAKE",
        overview: "Welcome to Python! If you've never coded before, take a deep breath—you are exactly where you need to be. Python was intentionally designed to look and read almost like plain English. It removes all the intimidating mathematical jargon and formatting you might see in older languages like C++ or Java.",
        explanation: "In standard computer languages, you explicitly have to use semicolons (;) at the end of every single sentence, and wrap everything in confusing curly braces { }. If you miss one, the whole program crashes!<br><br>Python threw all that away. Instead, Python relies purely on <strong>whitespaces and indentation</strong> (just hitting the spacebar or Tab key). It forces your code to look visually neat and organized. <br><br><strong>Beginner Pitfall:</strong> The only golden rule here is consistency. If you use 4 spaces to indent a block of code, you can't suddenly use 3 spaces later. Python loves structure and will kindly remind you if your spaces don't match up!",
        code: `# Here's how simple it is to talk to the computer:\nprint("Hello, World!")\n\n# Notice there are no semicolons or brackets fighting for space!`,
        visual: "Picture a messy room instantly organizing itself. That's what reading Python feels like compared to other languages.",
        recap: "Python is famous for being incredibly readable and perfect for beginners.<br>It entirely relies on clean spaces (indentation) instead of brackets.<br><em>Why it matters:</em> You can focus strictly on solving fun problems instead of memorizing confusing grammar rules.",
        hook: "Ready to make the computer speak? Head to the sandbox and write your first print() statement!"
    },
    {
        id: 2,
        title: "Basic Syntax",
        tag: "THE GRAMMAR OF PYTHON",
        overview: "Every language has rules—even English! Syntax is simply the grammar of programming. As long as we follow Python's grammar rules, the computer will understand exactly what we want without any confusion.",
        explanation: "One of the absolute best habits you can build right now is leaving <strong>Comments</strong>. By simply putting a hashtag (#) in front of a line, you're telling Python: <em>'Hey, ignore this line, it's just a note for me.'</em> It’s a literal sticky note for your future self!<br><br>Also, remember that Python is strictly <strong>case-sensitive</strong>. To a computer, <code>apple</code> and <code>Apple</code> are two completely different things, like entirely different buildings in a city.",
        code: `# I am making a sticky note! Python will not run this line.\nuserName = "Alice"\nusername = "Bob" # Notice the lowercase 'u'. This is completely separate!`,
        visual: "Imagine holding a highlighter. When you type '#', everything on that line highlights in grey, making it completely invisible to the robot reading it.",
        recap: "Python respects case sensitivity. (A != a)<br>Use # to write human-readable notes exactly where you need them.",
        hook: "Jump into the code editor, throw down a #, and write a secret message just for yourself!"
    },
    {
        id: 3,
        title: "Variables & Data Types",
        tag: "DIGITAL CONTAINERS",
        overview: "Imagine you're packing up your bedroom. You wouldn't just throw everything loosely into your car—you'd put things in labeled boxes. Variables are just labeled digital moving boxes. Data types define exactly what kind of objects you can put inside those boxes.",
        explanation: "Python is amazingly smart. It automatically guesses what you're putting in the box, so you don't have to specify it!<br><br>Here are the 4 essential boxes you'll use everyday:<br>• <strong>Strings:</strong> Just regular text. They MUST be wrapped in quotes.<br>• <strong>Integers:</strong> Solid, whole numbers (like counting apples).<br>• <strong>Floats:</strong> Numbers with decimals (like money).<br>• <strong>Booleans:</strong> Simple True or False switches.<br><br><strong>Pitfall Warning:</strong> If you put a number inside quotes (like \"25\"), Python treats it strictly as Text. So \"10\" + \"10\" becomes \"1010\", not 20!",
        code: `age = 25          # This is an Integer box\nprice = 19.99     # This is a Float box\nname = "Python"   # This is a String box (Notice the quotes!)\nis_awake = True   # Boolean switch turned ON\n\nprint("10" + "10") # Watch out! output is 1010`,
        visual: "Imagine a cardboard box dropping down labeled 'age', and the raw number 25 neatly folds and packs itself right inside.",
        recap: "Variables are temporary containers for your dynamic data.<br>Don't wrap physical math numbers in quotes unless you want them treated as flat text.",
        hook: "Ready to pack your own boxes? Go create a variable named `favorite_food`!"
    },
    {
        id: 4,
        title: "Operators",
        tag: "PYTHON'S CALCULATOR",
        overview: "At the end of the day, computers are just wildly fast calculators. Operators are the action verbs that let you manipulate those numbers.",
        explanation: "You already know the basics: <code>+</code>, <code>-</code>, <code>*</code> (multiply), and <code>/</code> (divide). <br><br>But Python has a secret weapon called <strong>Modulo (%)</strong>. Instead of giving you the split answer, Modulo exclusively gives you the remainder! If I have 10 slices of pizza and 3 friends, we each get 3 slices, and there is 1 left over. 10 % 3 gives us exactly that 1!<br><br>You'll also use <code>=</code> purely to assign items into variables. It doesn't mean 'equals' in the math sense!",
        code: `result = 10 ** 2 # 10 to the power of 2 (100!)\nleftovers = 10 % 3 # Returns 1\n\n# Quick updating!\nscore = 10\nscore += 5 # Exactly the same as saying: score = score + 5`,
        visual: "A cool animation showing 10 puzzle pieces splitting evenly into three groups of three, isolating 1 lonely red block as the 'Modulo'.",
        recap: "Math operators work standardly.<br>Modulo % is your best friend for finding out if a number is Even or Odd.",
        hook: "Use the modulo % operator to figure out the remainder of 100 divided by 7!"
    },
    {
        id: 5,
        title: "Control Flow",
        tag: "MAKING DECISIONS",
        overview: "Right now, your code runs like a simple shopping list—top to bottom. But what if we want the computer to actually make decisions dynamically? Control Flow is exactly how we give software a 'brain'.",
        explanation: "Think of a train track approaching a junction box. <br><br>• <code>if</code>: If the traffic light is green, take the right path.<br>• <code>elif</code> (Else If): If it's orange, take the slow path.<br>• <code>else</code>: If everything else fails, hit the brakes!<br><br><strong>Crucial Rule:</strong> Every single if/elif/else statement absolutely must end with a colon (:). The very next line drops down and gets indented inward so Python knows what actions belong to what decision.",
        code: `temperature = 30\n\nif temperature > 25:\n    # This block triggers because 30 > 25!\n    print("It's a hot day!")\nelif temperature > 15:\n    print("It's a nice day.")\nelse:\n    print("It's freezing cold.")`,
        visual: "Imagine a glowing orb travelling down a pipe. It hits a diamond labeled 'IF', logically reads the condition, and seamlessly routes down the correct neon path.",
        recap: "if, elif, and else inject logical choices into your app.<br>Don't ever forget the trailing colon :!",
        hook: "Write a quick if/else block that checks a user's age. If they are over 18, print 'Access Granted!'."
    },
    {
        id: 6,
        title: "Loops",
        tag: "THE ART OF REPETITION",
        overview: "Computers never get tired. Loops let you harness that extreme energy by running the same block of code thousands of times without you having to retype doing the chore over and over.",
        explanation: "There are two main engines: <br><br>1. <strong>The 'For' Loop:</strong> You use this when you specifically know how many times you want to run. Hand a playlist of 5 songs to a <code>for</code> loop, and it plays them 5 times confidently.<br>2. <strong>The 'While' Loop:</strong> You use this when you don't know the exact count! It runs strictly <em>until</em> an internal condition changes. <br><br><strong>Major Pitfall:</strong> If you accidentally launch a <code>while</code> loop that never becomes False, you create an 'Infinite Loop' and your entire computer will freeze trying to run forever!",
        code: `# A controlled For Loop\nfor i in range(3):\n    print(i) # Prints 0, then 1, then 2\n\n# A protective While Loop\nbattery = 100\nwhile battery > 0:\n    battery -= 50\n    if battery == 0:\n        break # Safely hits the brakes!`,
        visual: "A spinning mechanical gear constantly rotating. Suddenly, the 'break' command visually shoves a steel pipe into the gear mechanism, instantly stopping it.",
        recap: "Use for loops to iterate predictably.<br>Use while loops strictly for conditional running.<br>Use the word 'break' to escape panic scenarios.",
        hook: "Jump securely into the sandbox and build a loop that automatically prints counting numbers from 1 to 10!"
    },
    {
        id: 7,
        title: "Functions",
        tag: "REUSABLE BLUEPRINTS",
        overview: "Imagine writing a recipe for a cake, but you have to re-read it constantly every time you want to add sugar. That's inefficient! A function lets you formally bundle that whole recipe under a clean, single name so you only ever have to type it once.",
        explanation: "Think of a function exactly like a Kitchen Blender. <br><br>• <strong>Parameters:</strong> These are your raw fruit ingredients dropping into the top.<br>• <strong>def:</strong> This is the button you press to declare the blender is running.<br>• <strong>return:</strong> This is the spout that safely pours out the delicious, finished data back to you.<br><br>By packing code tightly into a function, you keep your main script beautiful, readable, and highly reusable.",
        code: `def make_smoothie(fruit):\n    # The blending process...\n    result = fruit + " smoothie"\n    return result # Pours it out!\n\n# Calling the blender\nprint(make_smoothie("Mango"))`,
        visual: "An interactive animation dropping raw fruit items (Parameters) into a shiny steel machine. The <code>return</code> valve pops open and hands you a sealed package.",
        recap: "Define a custom blueprint using the 'def' keyword.<br>Pass specific data in, let the logic run, push data out using 'return'.",
        hook: "Go build a secure greet() function that takes a person's name as a parameter, and magically returns 'Hello [Name]'."
    },
    {
        id: 8,
        title: "Data Structures",
        tag: "ORGANIZING THE CHAOS",
        overview: "Data structures are explicitly how Python beautifully organizes mass chunks of related information. If Variables are moving boxes, Data Structures are an entire industrial rack system.",
        explanation: "1. <strong>Lists [ ]:</strong> Just like a grocery list. You can continuously add, cross out, or modify items whenever you want. Great for dynamic data like scores.<br>2. <strong>Tuples ( ):</strong> Think of these like a locked museum glass case. Once you create it, you cannot legally modify it. Extremely safe and fast for strict coordinates.<br>3. <strong>Dictionaries { }:</strong> A literal dictionary. You have a unique word (Key) mapped to a specific definition (Value). Instantly search a million files by just looking up the Key!",
        code: `my_list = ["Apple", "Orange"] \nmy_list.append("Banana") # You can always add to lists!\n\ndata_dict = {\n    "name": "Python",\n    "era": 1991\n}\nprint(data_dict["name"]) # Returns 'Python' massively fast!`,
        visual: "A neon glowing line violently tracing back and forth connecting strict Dictionary keys physically to their treasure-chest values.",
        recap: "Tuples explicitly protect memory.<br>Dictionaries dominate performance speeds for data lookups.",
        hook: "Build a Dictionary containing your name and age, then ask Python to print just the age!"
    },
    {
        id: 9,
        title: "String Handling",
        tag: "TEXT SURGERY",
        overview: "Working perfectly with text sentences is a monumental part of programming apps. Instead of manually editing paragraphs, you can dynamically give Python a scalpel and slice up words automatically.",
        explanation: "Rather than treating a text string as one block, Python literally looks at it like a list of individual letters. <br><br>With <strong>Slicing [start:stop]</strong>, you can magically rip out just the middle section of a word. <br>Even better are <strong>f-Strings</strong>. Placing a tiny 'f' right before a quote allows you to embed wildly dynamic variables directly into the text organically without clunky math additions.",
        code: `text = "Python Programming"\n# Grab specifically the first 6 letters\nprint(text[0:6]) # 'Python'\n\nversion = 3\n# Direct variable injection!\nprint(f"I am actively studying {text} {version} today.")`,
        visual: "A pair of glowing scissor icons appearing above the word 'Python' and dynamically cutting the sub-string out securely.",
        recap: "Strings behave similarly to numbered lists.<br>Use modern f-Strings constantly for elegant readouts.",
        hook: "Take the string 'racecar' and reverse it backwards using a negative slicing hook [::-1] !"
    },
    {
        id: 10,
        title: "File Handling",
        tag: "READING THE ARCHIVES",
        overview: "Normally, everything your program remembers disappears permanently when you shut it down. File handling allows your script to officially read and write notes to actual hard drive files so data practically lives forever.",
        explanation: "Using the <code>open()</code> command lets us peer into a physical text file. We have to tell Python how we want to handle it securely:<br><br>• <strong>'r' (Read):</strong> Safely opens the file to just observe.<br>• <strong>'w' (Write):</strong> Incredibly destructive. Instantly wipes the entire text file clean and writes your new statement.<br>• <strong>'a' (Append):</strong> Safely scrolls right to the bottom and simply adds a new line of text.",
        code: `# The 'with' keyword beautifully auto-closes the file to lock data safe\nwith open("notes.txt", "w") as f:\n    f.write("Hello physical hard drive!")\n\nwith open("notes.txt", "r") as f:\n    print(f.read())`,
        visual: "A robotic hand unzipping a physical manilla folder, replacing the paper, and sealing it securely with a titanium padlock.",
        recap: "Always open files using the 'with' manager.<br>Be incredibly careful using the 'w' mode on vital data files.",
        hook: "Generate a custom file called user.txt and permanently write your name into it!"
    },
    {
        id: 11,
        title: "Error Handling",
        tag: "CRASH PREVENTION",
        overview: "Crashes happen. Period. Professional apps distinguish themselves not by avoiding breaks, but by actively deploying invisible safety nets so when issues trigger, the user never fundamentally notices.",
        explanation: "If you logically ask Python to divide by zero, it rightfully panics and crashes to the desktop. <br><br>But if we wrap that dangerous code in a <strong>try/except</strong> block, python calmly attempts the code. If the explosive happens, the protective <code>except</code> shield absorbs the blast, stops the crash, and comfortably prints a custom excuse while keeping the program running.",
        code: `try:\n    danger = 10 / 0 # Impossible math!\nexcept ZeroDivisionError:\n    print("Whoops! Divison by zero intercepted safely.")\nfinally:\n    print("Cleaning up memory unconditionally...")`,
        visual: "An incoming bright red error blast being smoothly intercepted and absorbed entirely by a thick glowing TRY shield.",
        recap: "Foresee mistakes creatively.<br>Use finally to always close server connections regardless of outcomes.",
        hook: "Intentionally try to convert the word 'hello' into an int() and build the net to catch the crash!"
    },
    {
        id: 12,
        title: "Modules and Packages",
        tag: "BORROWING SUPERPOWERS",
        overview: "Why actively reinvent the wheel when millions of developers already perfectly coded solutions? Modules let you legally 'borrow' complex toolkits and snap them onto your basic software.",
        explanation: "You can magically summon external libraries straight into your project file at the top using the <code>import</code> command. <br><br>Need advanced physics? Import <code>math</code>. Need to hook up internet web-scraping? Open terminal and use <strong>pip</strong> (Python's Package Installer) to download <code>requests</code>. It dramatically expands your abilities overnight.",
        code: `import math # Instantly acquires major tools\nfrom datetime import datetime # Sharp targeting\n\nprint(math.sqrt(16)) # 4.0\nprint(datetime.now()) # Triggers the system clock`,
        visual: "A sleek terminal simulation visually routing server packets to your screen, clicking perfectly like lego blocks into the system.",
        recap: "Import cleanly grants access to monumental global libraries.<br>Pip is your direct access store to the open-source community.",
        hook: "Import the 'random' module securely and try randomly generating a dice roll from 1 to 6!"
    },
    {
        id: 13,
        title: "Object-Oriented Programming",
        tag: "REAL WORLD MAPPING",
        overview: "Welcome to the absolute pinnacle of structural software design! Object-Oriented Programming (OOP) allows you to model your code physically after real-world living objects rather than reading a flat script.",
        explanation: "Imagine you're running an absolute bakery. <br><br>The <strong>Class</strong> is your rigid metal Cookie Cutter (the core blueprint). <br>The <strong>Objects</strong> are the actual dozens of soft cookies you violently stamp out of the dough from that cutter. <br><br>Every single cookie has unique <strong>Attributes</strong> (Adjectives: size, chocolate chips) and dynamic <strong>Methods</strong> (Verbs: crumble, bake). But they efficiently all share the same structural master blueprint!",
        code: `class Dog:\n    # The Blueprint Core Initializer\n    def __init__(self, name, breed):\n        self.name = name  # Physical Attribute\n        self.breed = breed\n\n    # Verbal Action Method\n    def bark(self):\n        return f"{self.name} precisely barks!"\n\n# Stamping out the Object!\nmy_dog = Dog("Rex", "Husky")\nprint(my_dog.bark())`,
        visual: "A colossal industrial factory assembly line aggressively stamping out completely unique digital 3D dog profiles heavily based off a singular glowing blueprint.",
        recap: "Classes firmly establish the core blueprint protocols.<br>Objects represent the independent living data instances taking action in RAM.",
        hook: "Code your own dream Car class defining heavily custom attributes like top_speed and brand!"
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
        if(terminal) terminal.innerText = "$ Python Engine Loaded ✓\n$ Ready for execution.";
        return pyodide;
    } catch(err) {
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

        // Auto-boot python engine organically if navigating strictly to practice screen
        if (targetScreenId === 'screen-editor' && !pyodideReadyPromise) {
            pyodideReadyPromise = initPyodide();
        }
    };

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
            
            terminal.innerText = "$ Executing sequence...\n";
            try {
                let pyodide = await pyodideReadyPromise;
                
                // Route Standard Output directly to HTML terminal
                pyodide.setStdout({ batched: (msg) => { terminal.innerText += msg + "\n"; } });
                
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
});
