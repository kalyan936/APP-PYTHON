const theoryModules = [
    {
        id: 1,
        title: "Introduction to Python",
        tag: "THE ECOSYSTEM",
        overview: "Python is a high-level, interpreted, general-purpose programming language. Created by Guido van Rossum and first released in 1991, Python's design philosophy emphasizes code readability with its notable use of significant whitespace.",
        explanation: `<strong>1. What is Python?</strong> Python is a dynamically-typed, garbage-collected language that supports multiple programming paradigms, including structured, object-oriented, and functional programming.<br><br>
        <strong>2. History and Features:</strong> Originally conceived as a successor to the ABC language, Python has evolved into the most popular language globally. Its key features include:<br>
        • <strong>Simplicity:</strong> Focuses on readable English-like syntax.<br>
        • <strong>Extensive Libraries:</strong> A massive standard library (Batteries Included).<br>
        • <strong>Interpreted:</strong> Code is executed line by line, making debugging easier.<br>
        • <strong>Portable:</strong> Runs on Windows, Mac, and Linux without changes.<br><br>
        <strong>3. Applications:</strong> From <strong>Web Development</strong> (Django, Flask) to <strong>AI</strong> (TensorFlow, PyTorch) and <strong>Data Science</strong> (Pandas, NumPy), Python powers the modern world from NASA to Instagram.<br><br>
        <strong>4. Setting up Environment:</strong><br>
        • <strong>Installation:</strong> Download the latest version from python.org.<br>
        • <strong>IDEs:</strong> Professional developers use <strong>VS Code</strong>, <strong>PyCharm</strong>, or <strong>Jupyter Notebooks</strong> for data science work.<br><br>
        <strong>5. Syntax and Indentation:</strong> Unlike other languages, Python uses indentation to define blocks. A standard indentation is 4 spaces. Keywords like <code>if</code>, <code>def</code>, and <code>class</code> are reserved and cannot be used as identifiers.`,
        code: `# Running your first program
print("Establishing connection...")

# Keywords are reserved: print, if, for, while, etc.
import keyword
print(f"Total Python Keywords: {len(keyword.kwlist)}")

# Correct Indentation Example
def hello_python():
    message = "Welcome to the Python Universe"
    print(message)

hello_python()`,
        visual: "A high-tech terminal scanning a glowing DNA strand of Python code, displaying 'SYNTAX: STABLE' and 'VERSION: 3.x'.",
        recap: "Python is interpreted and emphasizes readability.<br>Setup involves installing Python and choosing an IDE like VS Code.<br>Indentation is not optional—it defines the structure of your code.<br>Keywords are reserved tokens that guide the interpreter.",
        hook: "Open your terminal and type 'python --version' to see if your system is ready for flight!"
    },
    {
        id: 2,
        title: "Variables and Data Types",
        tag: "DATA FOUNDATION",
        overview: "Variables are the storage units for information in your program. In Python, variables do not require explicit declaration of their type; the language understands what you are storing based on the value you provide.",
        explanation: `<strong>1. Variables and Assignment:</strong> Use the <code>=</code> operator to assign a value to a name. Variables in Python are case-sensitive (<code>age</code> and <code>Age</code> are different).<br><br>
        <strong>2. Dynamic Typing:</strong> This allows you to reassign a variable to a different type. For example, <code>data = 10</code> can later become <code>data = "Text"</code>.<br><br>
        <strong>3. Basic Data Types:</strong><br>
        • <strong>Integers:</strong> Whole numbers (e.g., 25, -100).<br>
        • <strong>Float:</strong> Numbers with decimal points (e.g., 9.8, 3.14).<br>
        • <strong>Complex Numbers:</strong> Numbers with real and imaginary parts (e.g., 3 + 5j).<br>
        • <strong>Strings:</strong> Sequences of characters wrapped in quotes.<br>
        • <strong>Boolean:</strong> Represents <code>True</code> or <code>False</code>.<br><br>
        <strong>4. Type Conversion:</strong><br>
        • <strong>Implicit:</strong> Python automatically converts types (e.g., adding an int and float).<br>
        • <strong>Explicit (Casting):</strong> Manually using <code>int()</code>, <code>float()</code>, <code>str()</code>, or <code>bool()</code>.<br><br>
        <strong>5. Verification:</strong> Use the <code>type()</code> function to inspect the nature of any variable at runtime.`,
        code: `# Assignment and Dynamic Typing
status_code = 200
print(f"Code: {status_code} | Type: {type(status_code)}")

status_code = "SUCCESS" # Reassigned to string
print(f"Status: {status_code} | Type: {type(status_code)}")

# Complex Numbers
j_number = 4 + 7j
print(f"Imaginary Part: {j_number.imag}")

# Casting
age_str = "25"
age_int = int(age_str)
print(f"Next Year: {age_int + 1}")`,
        visual: "A row of floating energy crystals, each changing color (Type) as they move through a digital validator.",
        recap: "Variables are case-sensitive and dynamically typed.<br>Core types include int, float, complex, str, and bool.<br>Implicit conversion is automatic; Explicit casting is manual.<br>type() is the primary tool for data inspection.",
        hook: "Create a complex number 'z = 2 + 3j' and print its real and imaginary parts using z.real and z.imag!"
    },
    {
        id: 3,
        title: "Operators",
        tag: "COMPUTIONAL LOGIC",
        overview: "Operators are symbols that trigger actions on data. From mathematical calculations to complex logical comparisons, operators are the engine that provides functionality to your script.",
        explanation: `<strong>1. Arithmetic Operators:</strong> Standard math: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>//</code> (floor), <code>%</code> (modulo), <code>**</code> (exponent).<br><br>
        <strong>2. Comparison Operators:</strong> Used to compare values, returning Booleans: <code>==</code>, <code>!=</code>, <code>></code>, <code><</code>, <code>>=</code>, <code><=</code>.<br><br>
        <strong>3. Logical Operators:</strong> Combining conditions: <code>and</code>, <code>or</code>, <code>not</code>.<br><br>
        <strong>4. Assignment Operators:</strong> Shortcuts like <code>+=</code>, <code>-=</code>, <code>*=</code>, <code>/=</code>.<br><br>
        <strong>5. Bitwise Operators:</strong> Operating at the binary (bit) level: <code>&</code> (AND), <code>|</code> (OR), <code>^</code> (XOR), <code>~</code> (NOT), <code><<</code>, <code>>></code>.<br><br>
        <strong>6. Membership Operators:</strong> Check for presence in a collection: <code>in</code>, <code>not in</code>.<br><br>
        <strong>7. Identity Operators:</strong> Check if two variables point to the same memory object: <code>is</code>, <code>is not</code>.<br><br>
        <strong>8. Operator Precedence:</strong> Follows the PEMDAS rule (Parentheses, Exponents...); use brackets to override default priority.`,
        code: `# Membership and Identity
authorized_users = ["Admin", "Stitch", "Root"]
user = "Stitch"

# Membership check
if user in authorized_users:
    print(f"Access granted to {user}")

# Identity check (Memory level)
a = [1, 2]
b = [1, 2]
print(f"Value check: {a == b}") # True
print(f"Identity check: {a is b}") # False (Different memory slots)

# Bitwise Example
x = 10 # 1010 in binary
y = 4  # 0100 in binary
print(f"X & Y (Binary AND): {x & y}") # 0000 -> 0`,
        visual: "A vast mechanical gears system where binary bits are being flipped, compared, and calculated by interlocking diamond-edged teeth.",
        recap: "Arithmetic and Assignment operators handle basic math.<br>Logical and Comparison operators drive decision branches.<br>Membership operators (in) are vital for collection searching.<br>Identity operators (is) check memory addresses, not just values.",
        hook: "Using the bitwise shift operator '<<', calculate what 2 becomes when shifted twice to the left (2 << 2)!"
    },
    {
        id: 4,
        title: "Input and Output",
        tag: "INTERFACE FLOW",
        overview: "Interaction is key to any software. Python provides simple but powerful ways to receive data from a user and format the results for display.",
        explanation: `<strong>1. The Input Function:</strong> <code>input("Prompt")</code> always returns data as a <strong>String</strong>. You must wrap it in <code>int()</code> or <code>float()</code> if you need numbers.<br><br>
        <strong>2. Output with print():</strong> The <code>print()</code> function can take multiple arguments separated by commas and customized with <code>sep</code> (separator) and <code>end</code> (line ending) parameters.<br><br>
        <strong>3. String Formatting Masterclass:</strong><br>
        • <strong>f-strings (Modern):</strong> <code>f"Text {variable}"</code>. The fastest and most readable method.<br>
        • <strong>.format():</strong> <code>"{} is {}".format(name, age)</code>. Highly flexible for complex templates.<br>
        • <strong>% formatting (Legacy):</strong> <code>"%s is %d" % (name, age)</code>. Old-style C-like formatting, still useful in logging.`,
        code: `# Modern Output Customization
name = "Stitch"
age = 100

# Separators and Line Endings
print("SYSTEM", "STABLE", sep="---", end=" [✓]\\n")

# Triple Threat of Formatting
print(f"F-String: {name} is {age}")
print("{0} is {1} (using .format)".format(name, age))
print("%s is %d (using C-style)" % (name, age))

# Taking and Casting Input
# speed = int(input("Enter Velocity: "))
# print(f"Speed Squared: {speed**2}")`,
        visual: "A stream of raw data entering a filter (input) and emerging as perfectly aligned, glowing holographic text (output).",
        recap: "input() pauses the script and returns a string.<br>print() displays data with customizable separators and endings.<br>f-strings are the industry standard for variable integration.<br>Use escape characters like \\n for structured output layout.",
        hook: "Ask the user for their name and print it in reverse using f-strings and slicing: f'{name[::-1]} is your backwards name'!"
    },
    {
        id: 5,
        title: "Control Flow Statements",
        tag: "DECISION LOGIC",
        overview: "Control flow dictates which lines of code run and how many times. It is the intelligence layer that allows your program to react to different scenarios and process bulk data efficiently.",
        explanation: `<strong>1. Conditional Statements:</strong> <code>if</code>, <code>elif</code>, and <code>else</code> create branches. Use colons and indentation to define scope.<br><br>
        <strong>2. Forbidden Loops (While):</strong> Runs as long as a condition is <code>True</code>. Perfect for persistent tasks or game loops.<br><br>
        <strong>3. Iteration Loops (For):</strong> Used to iterate over a sequence (list, range, string).<br><br>
        <strong>4. Loop Control Keywords:</strong><br>
        • <strong>break:</strong> Exits the loop immediately.<br>
        • <strong>continue:</strong> Skips the rest of the current turn and jumps to the next.<br>
        • <strong>pass:</strong> A placeholder for empty code blocks (prevents errors during development).<br><br>
        <strong>5. Generating Sequences:</strong> The <code>range(start, stop, step)</code> function is the primary way to generate numeric sequences for loops.`,
        code: `# Loop Control in Action
for i in range(1, 11):
    if i == 5:
        print("Breaking at 5...")
        break
    if i % 2 == 0:
        continue # Skip even numbers
    print(f"Odd Number: {i}")

# The While Sentential
count = 0
active = True
while active:
    count += 1
    if count >= 3:
        active = False # Safe shutdown
    print(f"Heartbeat {count}")`,
        visual: "A glowing flowchart where a data packet hits a divider and splits into multiple paths, with some packets being sent back to the top by a circular loop.",
        recap: "if/elif/else handle logical branching.<br>for loops process sequences; while loops run until conditions change.<br>break stops the loop; continue restarts it from the top.<br>pass is a non-action placeholder for structural code.",
        hook: "Create a loop that prints only even numbers from 0 to 20 using the range(0, 21, 2) function!"
    },
    {
        id: 6,
        title: "Data Structures",
        tag: "COLLECTION ARCHITECTURE",
        overview: "Data structures are specialized formats for organizing and storing data. Python provides four built-in collection types that handle everything from simple lists to complex mapping systems.",
        explanation: `<strong>a. Lists:</strong> Ordered, mutable (changeable), and allows duplicates. Used for sequences of items.<br>
        • <strong>Methods:</strong> <code>append()</code>, <code>remove()</code>, <code>sort()</code>, <code>reverse()</code>.<br>
        • <strong>Comprehensions:</strong> <code>[x for x in data if x > 0]</code>.<br><br>
        <strong>b. Tuples:</strong> Ordered, IMMUTABLE (cannot change). Used for fixed data like coordinates.<br>
        • <strong>Unpacking:</strong> <code>x, y = (10, 20)</code>.<br><br>
        <strong>c. Sets:</strong> Unordered, unique elements only. Used for math operations and deduplication.<br>
        • <strong>Operations:</strong> <code>Union</code>, <code>Intersection</code>, <code>Difference</code>.<br>
        • <strong>Frozen Sets:</strong> Immutable versions of sets.<br><br>
        <strong>d. Dictionaries:</strong> Unordered (mostly), mutable mapping of <strong>Key-Value Pairs</strong>. Used for indexed lookups.<br>
        • <strong>Nested Dicts:</strong> Dictionaries within dictionaries, similar to JSON structures.`,
        code: `# Advanced List Comprehension
nums = [1, 2, 3, 4, 5]
squares = [x**2 for x in nums if x > 2]
print(f"Squares: {squares}")

# Set Deduplication
emails = {"a@x.com", "b@x.com", "a@x.com"}
print(f"Unique Emails: {len(emails)}")

# Dictionary Mapping
user_db = {
    "id": 101,
    "roles": ["Admin", "User"],
    "meta": {"last_login": "2024-01-01"}
}
print(f"Primary Role: {user_db['roles'][0]}")`,
        visual: "A high-tech sorting facility where different shapes of data are being funneled into square boxes (Lists), sealed glass cases (Tuples), and cloud-like clusters (Sets).",
        recap: "Lists are dynamic; Tuples are fixed.<br>Sets automatically remove duplicates.<br>Dictionaries provide fast, label-based data retrieval.<br>Use comprehensions for elegant, one-line data transformation.",
        hook: "Create a list of numbers 1-5, convert it to a tuple, and try to change the first item to see the error!"
    },
    {
        id: 7,
        title: "Strings",
        tag: "LINGUISTIC DATA",
        overview: "Strings are sequences of characters used to store text. In Python, strings are sophisticated objects with extensive built-in methods for manipulation and searching.",
        explanation: `<strong>1. Architecture:</strong> Strings are <strong>Immutable</strong>. Once created, they cannot be changed—you must create a new string instead.<br><br>
        <strong>2. Indexing and Slicing:</strong> Access specific characters with <code>str[0]</code> or fragments with <code>str[1:5]</code>. Negative indexing <code>str[-1]</code> starts from the end.<br><br>
        <strong>3. String Methods:</strong><br>
        • <code>lower() / upper()</code>: Case transformation.<br>
        • <code>split() / join()</code>: Breaking sentences or gluing words.<br>
        • <code>strip()</code>: Removing whitespace.<br>
        • <code>replace()</code>: Swapping substrings.<br><br>
        <strong>4. Escape Characters:</strong> Use <code>\\n</code> for new line, <code>\\t</code> for tab, and <code>\\\\</code> for a literal backslash.<br><br>
        <strong>5. Regular Expressions:</strong> Introduction to <code>re</code> module for advanced pattern matching (finding emails, phone numbers, or complex text patterns).`,
        code: `# Slicing Mastery
phrase = "Python Developer"
print(f"Language: {phrase[:6]}")
print(f"Role: {phrase[7:]}")

# Joining and Splitting
words = ["Code", "is", "Art"]
sentence = " ".join(words)
print(f"Joined: {sentence}")

# Immutability Check
# phrase[0] = "J" # TypeError!

# Raw Strings (Useful for Regex)
path = r"C:\\Users\\Desktop"
print(f"Raw Path: {path}")`,
        visual: "A vertical stream of characters where a cursor slices through the letters like a laser, extracting specific words to build new sentences.",
        recap: "Strings are immutable sequences of characters.<br>Slicing allows for precise substring extraction.<br>The join() method is the most efficient way to combine lists of strings.<br>Escape characters allow for advanced output formatting.",
        hook: "Take the string 'Learning' and use slicing to reverse it in one line: 'Learning'[::-1]!"
    },
    {
        id: 8,
        title: "Functions",
        tag: "MODULAR LOGIC",
        overview: "Functions are reusable blocks of code that perform specific tasks. They allow you to break your program into logical, manageable pieces, following the DRY (Don't Repeat Yourself) principle.",
        explanation: `<strong>1. Defining and Calling:</strong> Use the <code>def</code> keyword. A function only runs when it is called by its name followed by parentheses.<br><br>
        <strong>2. Function Arguments:</strong><br>
        • <strong>Positional:</strong> Value assigned based on order.<br>
        • <strong>Keyword:</strong> Values assigned by name (e.g., <code>param=value</code>).<br>
        • <strong>Default:</strong> Parameters that have a fallback value if none is provided.<br>
        • <strong>Variable-length:</strong> Use <code>*args</code> for a list of positioning arguments and <code>**kwargs</code> for a dictionary of keyword arguments.<br><br>
        <strong>3. Return Values:</strong> Functions can send data back using <code>return</code>. If no return is specified, they return <code>None</code>.<br><br>
        <strong>4. Lambda Functions:</strong> Anonymous, small functions defined on a single line using the <code>lambda</code> keyword.<br><br>
        <strong>5. Recursion:</strong> A function calling itself to solve a smaller version of the same problem (e.g., Factorials).<br><br>
        <strong>6. Docstrings:</strong> Use triple quotes to document what the function does for other developers.`,
        code: `# Designing a Swiss-army Function
def system_report(status, *logs, priority="Normal", **details):
    """Generates a high-level system diagnostic."""
    print(f"REPORT: {status} | PRIORITY: {priority}")
    for entry in logs:
        print(f"LOG: {entry}")
    for key, val in details.items():
        print(f"DATA {key.upper()}: {val}")

# Utilizing advanced arguments
system_report("STABLE", "Buffer cleared", "CPU cooled", 
              priority="High", user="Stitch", uptime="99.9%")

# Anonymous Lambda
sqr = lambda x: x * x
print(f"Square of 9: {sqr(9)}")`,
        visual: "A high-tech terminal wall where plug-in 'logic modules' (Functions) are being swapped in and out of a motherboard to change its core capabilities.",
        recap: "Functions (def) enable code reusability and clean architecture.<br>Arguments can be positional, keyword, or variable-length (*args, **kwargs).<br>The return statement sends data back to the caller.<br>Docstrings are essential for documenting function behavior.",
        hook: "Write a recursive function to calculate the factorial of 5! (Hint: 5 * 4 * 3 * 2 * 1)"
    },
    {
        id: 9,
        title: "Modules and Packages",
        tag: "SYSTEM SCALING",
        overview: "As your project grows, keeping everything in one file becomes impossible. Modules and Packages are Python's way of organizing code into multiple files and folders, creating a professional project structure.",
        explanation: `<strong>1. Importing Modules:</strong> Use <code>import module_name</code> or <code>from module_name import function</code>. This allows you to use code written elsewhere.<br><br>
        <strong>2. Built-in Modules:</strong> Python comes with 400+ modules ready to use, such as <code>math</code> for complex math and <code>random</code> for generating unpredictable data.<br><br>
        <strong>3. Custom Modules:</strong> Any <code>.py</code> file you create is a module. You can import your own logic into new scripts seamlessly.<br><br>
        <strong>4. Python Packages:</strong> A package is simply a folder containing multiple modules and a special <code>__init__.py</code> file. This allows for deep organization (e.g., 'Project.Finance.TaxCalculation').<br><br>
        <strong>5. __name__ == "__main__":</strong> A vital check that allows a file to behave differently when it is run directly versus when it is imported as a module.`,
        code: `# Using Standard Libraries
import math
import random as rnd

# Accessing mathematical constants
print(f"Precise Pi: {math.pi}")

# Generating complex random numbers
secret_key = rnd.randint(1000, 9999)
print(f"Encrypted Key: {secret_key}")

# Module Execution Check
if __name__ == "__main__":
    print("This file was run as a standalone script.")
else:
    print("This file was imported as a utility.")`,
        visual: "A massive warehouse where crates (Modules) are being organized into logical shipping lanes (Packages) for global distribution.",
        recap: "Modules are .py files; Packages are folders with __init__.py.<br>Importing allows you to cross-reference code from different files.<br>Built-in modules like math and random provide powerful ready-to-use tools.<br>The __name__ check controls script execution behavior.",
        hook: "Import the 'datetime' module and print the 'today()' value to see the current server time!"
    },
    {
        id: 10,
        title: "File Handling",
        tag: "PERSISTENT STORAGE",
        overview: "Memory (RAM) is temporary. Files are forever. File handling allows your Python script to save data to the hard drive, read configurations, and process massive datasets stored in CSV or JSON formats.",
        explanation: `<strong>1. Opening and Closing:</strong> Use <code>open(filename, mode)</code>. Modes include <code>'r'</code> (read), <code>'w'</code> (write/overwrite), <code>'a'</code> (append), and <code>'b'</code> (binary).<br><br>
        <strong>2. The 'With' Statement (Context Manager):</strong> The modern way to handle files. It automatically closes the file for you, even if the program crashes, preventing data corruption.<br><br>
        <strong>3. Reading and Writing:</strong> Use <code>.read()</code>, <code>.readline()</code>, or <code>.write()</code> to move data. Python handles text as strings and binary files (like images) as bytes.<br><br>
        <strong>4. CSV and JSON:</strong> Real-world data isn't just raw text. Python has built-in <code>csv</code> and <code>json</code> modules to handle structured spreadsheet data and web-API responses.<br><br>
        <strong>5. File Pointers:</strong> Use <code>seek()</code> to jump to a specific character in a file and <code>tell()</code> to find out where your 'cursor' currently is inside the document.`,
        code: `# Safety First: Writing with Context Managers
with open("system.log", "w") as f:
    f.write("LOG: Startup sequence initiated...\\n")
    f.write("LOG: Connection secure.")

# Reading back the data
with open("system.log", "r") as f:
    content = f.read()
    print(f"FILE DATA:\\n{content}")

# JSON Handling (The Web Standard)
import json
config = {"theme": "Dark", "font": 12}
json_data = json.dumps(config)
print(f"Serialized JSON: {json_data}")`,
        visual: "A massive digital library where a laser scribe (File Pointer) is engraving text onto glowing silicon tablets for permanent storage.",
        recap: "Always use 'with open()' to ensure files are closed correctly.<br>Use mode 'w' to overwrite and 'a' to add to existing data.<br>JSON and CSV modules enable structured data processing.<br>seek() and tell() provide precise control over file navigation.",
        hook: "Try to open a file that doesn't exist and see what 'FileNotFoundError' looks like!"
    },
    {
        id: 11,
        title: "Exception Handling",
        tag: "SYSTEM RESILIENCE",
        overview: "Errors (Exceptions) are inevitable in the real world. Exception handling allows your program to detect problems like missing files or invalid user input and recover gracefully instead of crashing.",
        explanation: `<strong>1. Errors vs Exceptions:</strong> Errors are usually syntax mistakes (like a missing colon). Exceptions are issues that happen while the code is running (like dividing by zero).<br><br>
        <strong>2. try/except block:</strong> Wrap risky code in <code>try</code>. If an error occurs, the <code>except</code> block runs. You can catch specific errors (e.g., <code>ValueError</code>) or multiple errors in a tuple.<br><br>
        <strong>3. Else and Finally:</strong> <br>
        • <strong>Else:</strong> Runs ONLY if no exceptions occurred.<br>
        • <strong>Finally:</strong> Runs ALWAYS, used for critical cleanup like closing databases.<br><br>
        <strong>4. Custom Exceptions:</strong> You can create your own specialized error types by inheriting from the <code>Exception</code> class.<br><br>
        <strong>5. Raising Exceptions:</strong> Use the <code>raise</code> keyword to intentionally trigger an error when a business rule is broken (e.g., 'Raise error if age < 0').`,
        code: `# Multi-layered Safety Net
def secure_process(val):
    try:
        res = 100 / int(val)
    except (ZeroDivisionError, ValueError) as e:
        print(f"CATCH: Invalid input detected ({e})")
    else:
        print(f"SUCCESS: Operation returned {res}")
    finally:
        print("MONITOR: System cycle complete.")

# Testing
secure_process(0)      # Triggers ZeroDivision
secure_process("ABC")  # Triggers ValueError
secure_process(10)     # Works!`,
        visual: "A high-speed racing drone hitting a digital wall but being instantly caught by a soft, carbon-fiber net that resets it back onto the track.",
        recap: "Try-Except blocks prevent crashes and improve user experience.<br>Specificity is better: catch ZeroDivisionError, not just generic Exception.<br>Finally guarantees that cleanup code (like closing files) always runs.<br>Custom exceptions help document domain-specific software rules.",
        hook: "Write a try block that asks for a number and catches the error if the user types a letter!"
    },
    {
        id: 12,
        title: "Object-Oriented Programming (OOP)",
        tag: "BLUEPRINT DESIGN",
        overview: "OOP is a paradigm based on 'Objects' which can contain data (attributes) and code (methods). It is the foundation of modern, scalable software architecture.",
        explanation: `<strong>1. Classes and Objects:</strong> A class is a blueprint (e.g., 'Car'). An object is an instance (e.g., 'Your Red Tesla').<br><br>
        <strong>2. The Constructor (__init__):</strong> A special method that initializes an object's starting data.<br><br>
        <strong>3. Core Pillars:</strong><br>
        • <strong>Inheritance:</strong> Creating specialized child classes from a parent.<br>
        • <strong>Polymorphism:</strong> Using a single interface for different types (e.g., different animals making different 'speak' sounds).<br>
        • <strong>Encapsulation:</strong> Hiding internal data and requiring methods to change it.<br>
        • <strong>Abstraction:</strong> Hiding complexity and showing only the necessary functionality.<br><br>
        <strong>4. Dunder Methods:</strong> Double-underscore methods like <code>__str__</code> and <code>__len__</code> that allow your objects to work with built-in Python functions.`,
        code: `# Designing a High-Level Hierarchy
class Machine:
    def __init__(self, serial):
        self.serial = serial
    def __str__(self):
        return f"Machine ID: {self.serial}"

class Drone(Machine): # Inheritance
    def __init__(self, serial, model):
        super().__init__(serial)
        self.model = model
    def activate(self):
        return f"Drone {self.model} starting logic..."

# Creating the Object
uav_1 = Drone("SN-007", "Phantom")
print(uav_1)
print(uav_1.activate())`,
        visual: "A 3D holographic wireframe of a robot arm that suddenly solidifies into a physical, moving machine under the control of a class blueprint.",
        recap: "Classes define templates; objects are the physical data in memory.<br>The __init__ method is the 'birth certificate' of an object.<br>Inheritance promotes code reuse and logical hierarchies.<br>Encapsulation protects data integrity by hiding internal state.",
        hook: "Add a '__len__' dunder method to a class and return a fixed number to see what len(obj) does!"
    },
    {
        id: 13,
        title: "Advanced Python Concepts",
        tag: "ENGINEERING POWER",
        overview: "Beyond basics lie the tools used by senior Python engineers to write highly efficient, professional, and high-concurrency software.",
        explanation: `<strong>1. Iterators and Generators:</strong> Generators use <code>yield</code> to produce values one by one, saving massive amounts of memory compared to lists.<br><br>
        <strong>2. Decorators:</strong> A pythonic way to 'wrap' functions with extra logic (like timing how long a function takes or checking permissions) without changing the function's code.<br><br>
        <strong>3. Context Managers:</strong> Creating your own <code>with</code> objects using <code>__enter__</code> and <code>__exit__</code>.<br><br>
        <strong>4. Concurrency:</strong><br>
        • <strong>Multithreading:</strong> Handling multiple I/O tasks (like web requests) at once.<br>
        • <strong>Multiprocessing:</strong> Using multiple CPU cores for heavy calculations.<br><br>
        <strong>5. GIL and Memory:</strong> Understanding the **Global Interpreter Lock** (the reason Python runs one thread at a time) and how Python's garbage collector manages memory.`,
        code: `# Efficient Generator Loop
def memory_efficient_counter(n):
    num = 0
    while num < n:
        yield num # Pauses and returns value
        num += 1

# Consuming the generator
for val in memory_efficient_counter(100_000):
    if val > 5: break
    print(f"Gen Value: {val}")

# Simple Decorator
def log_wrap(func):
    def wrapper():
        print("[TRACE] Start Pulse")
        func()
        print("[TRACE] End Pulse")
    return wrapper

@log_wrap
def alert():
    print(">>> SYSTEM CRITICAL ALERT <<<")

alert()`,
        visual: "A high-speed engine where data pulses are selectively timed and routed through specialized 'wrappers' (Decorators) for maximum efficiency.",
        recap: "Generators (yield) are memory-saving heroes for big data.<br>Decorators (@) allow for clean, non-intrusive feature extension.<br>Multiprocessing is the key to bypassing the GIL for heavy math.<br>Context managers handle setup/cleanup automation safely.",
        hook: "Create a simple generator that yields even numbers and try to loop through it!"
    },
    {
        id: 14,
        title: "Python Standard Libraries",
        tag: "BUILT-IN AUTOMATION",
        overview: "You don't need to reinvent the wheel. Python's standard library is packed with thousands of functions to handle common developer tasks out of the box.",
        explanation: `<strong>1. datetime:</strong> Working with dates, times, and time zones which is critical for logging and financial apps.<br><br>
        <strong>2. os and sys:</strong> Interacting with the operating system (moving files, checking directory paths) and the Python interpreter itself.<br><br>
        <strong>3. math and random:</strong> High-precision calculations and statistical sampling tools for simulations.<br><br>
        <strong>4. collections:</strong> Advanced specialized containers like <code>deque</code> (fast queues), <code>Counter</code> (automatic tallying), and <code>defaultdict</code>.<br><br>
        <strong>5. itertools:</strong> Powerful memory-efficient tools for creating complex loops (calculating combinations, permutations, or infinite cycling).`,
        code: `# Tallying with Collections
from collections import Counter
data = "python programming is efficient"
tally = Counter(data.split())
print(f"Word Count: {tally}")

# Directory Mapping with OS
import os
print(f"Current Path: {os.getcwd()}")

# Infinite loop with itertools
import itertools
count = 0
for i in itertools.cycle(["UP", "DOWN"]):
    print(f"Signal: {i}")
    count += 1
    if count >= 4: break`,
        visual: "A giant Swiss-army knife where every blade is labeled with a library name like 'math' or 'os', ready to be unfolded at a moment's notice.",
        recap: "Standard libraries provide robust, tested solutions for common tasks.<br>datetime is vital for timestamping and interval math.<br>os/sys allow scripts to interact with the underlying hardware/folder structure.<br>itertools/collections provide the 'pro levels' of data management.",
        hook: "Use 'len(os.listdir())' to see how many files are in your current directory!"
    },
    {
        id: 15,
        title: "Working with Databases",
        tag: "DATA PERSISTENCE",
        overview: "While files are good for small projects, real-world applications store their data in Databases. Python's integration with SQLite and SQLAlchemy allows you to manage millions of records with high speed and reliability.",
        explanation: `<strong>1. Introduction:</strong> Database management systems (DBMS) allow for structured data storage, indexing for fast search, and multi-user access.<br><br>
        <strong>2. SQLite with Python:</strong> A lightweight, disk-based database that doesn't require a separate server process. It is perfect for mobile apps and small web services.<br><br>
        <strong>3. CRUD Operations:</strong> The four horsemen of data—**Create** (insert), **Read** (select), **Update** (modify), and **Delete**.<br><br>
        <strong>4. Connecting with sqlite3:</strong> Python's built-in module to execute SQL commands directly from your script.<br><br>
        <strong>5. Introduction to ORM:</strong> Object-Relational Mapping (like **SQLAlchemy**) allows you to interact with a database using Python classes instead of writing raw SQL strings, making your code cleaner and safer.`,
        code: `# Using SQLite in a script
import sqlite3

# Phase 1: Establish Connection
# Uses a memory-database for this demo (temp storage)
db = sqlite3.connect(":memory:")
cursor = db.cursor()

# Phase 2: Create Table
cursor.execute("CREATE TABLE users (name TEXT, xp INTEGER)")

# Phase 3: Insert (Create)
cursor.execute("INSERT INTO users VALUES (?, ?)", ("Stitch", 5000))
db.commit()

# Phase 4: Read
cursor.execute("SELECT * FROM users WHERE xp > 1000")
print(f"Top Performer: {cursor.fetchone()}")

db.close()`,
        visual: "A high-security digital vault with millions of drawers, where a robotic librarian instantly retrieves the exact file you requested by its ID label.",
        recap: "Databases provide structured and fast storage for massive data.<br>SQLite is built-in and serverless, ideal for local storage.<br>CRUD represents the fundamental actions on any database.<br>ORMs like SQLAlchemy allow for managing data using Python objects.",
        hook: "Research what 'SQL Injection' is—it's the #1 reason why we use '?' in our execute commands instead of f-strings!"
    },
    {
        id: 16,
        title: "Web Development with Python",
        tag: "GLOBAL CONNECTIVITY",
        overview: "Python is the backbone of some of the world's largest websites. Web frameworks allow you to build servers that handle HTTP requests, serve HTML pages, and communicate with mobile applications via APIs.",
        explanation: `<strong>1. Basics of Web:</strong> Understanding the Client-Server model and how HTTP status codes (like 200 OK and 404 Not Found) guide the internet.<br><br>
        <strong>2. Flask (The Minimalist):</strong> A 'micro-framework' that is easy to set up and perfect for small projects and REST APIs.<br><br>
        <strong>3. Django (The Industrialist):</strong> A 'batteries-included' framework that provides everything out of the box—admin panels, authentication, and database ORMs.<br><br>
        <strong>4. REST APIs and Routing:</strong> Designing URLs (routes) that send back data (usually JSON) to mobile apps like this one.<br><br>
        <strong>5. Templates:</strong> Using engines like **Jinja2** to inject dynamic Python data into static HTML pages.`,
        code: `# Minimal Flask Application
# from flask import Flask, jsonify
# app = Flask(__name__)

# @app.route("/api/status")
# def get_status():
#     return jsonify({"server": "Online", "ping": "15ms"})

# if __name__ == "__main__":
#     app.run(debug=True)

# Routing Logic Demo
routes = {
    "/home": "index.html",
    "/login": "auth.py"
}

target = "/home"
print(f"Server routing {target} to -> {routes.get(target)}")`,
        visual: "A massive intersection where billions of data packets are being perfectly routed by a traffic-control AI into different building entrances (Servers).",
        recap: "Frameworks like Flask and Django simplify server creation.<br>REST APIs allow Python backends to talk to mobile/web frontends.<br>Routing maps a URL to a specific Python function.<br>Templates allow for dynamic HTML generation.",
        hook: "Look up what 'HTTP 418: I'm a teapot' is—it's one of the few official joke status codes in web history!"
    },
    {
        id: 17,
        title: "Data Science with Python",
        tag: "NUMERICAL INSIGHTS",
        overview: "Data is the new oil, and Python is the refinery. Using NumPy and Pandas, Python can process billions of rows of data to find patterns and make predictions that humans would miss.",
        explanation: `<strong>1. NumPy (Arrays):</strong> The foundation of scientific computing. NumPy arrays are 50x faster than standard Python lists because they use continuous memory blocks.<br><br>
        <strong>2. Pandas (DataFrames):</strong> The spreadsheet of Python. It allows you to load CSVs or SQL data into 'DataFrames' where you can filter, group, and calculate complex statistics with one click.<br><br>
        <strong>3. Data Cleaning:</strong> The most important job—handling missing values, fixing duplicates, and normalizing data formats before analysis.<br><br>
        <strong>4. Visualization (Matplotlib & Seaborn):</strong> Turning raw numbers into beautiful, interactive charts, graphs, and heatmaps that reveal the 'story' within the data.`,
        code: `# Mocking a Pandas Operation
# import pandas as pd
# df = pd.read_csv("sales_data.csv")

# Simulated Data Cleaning Pulse
dataset = [10, 20, None, 40, 20] # 'None' is missing data
clean_data = [x for x in dataset if x is not None]
unique_data = list(set(clean_data))

print(f"Raw Count: {len(dataset)}")
print(f"Cleaned Mean: {sum(unique_data)/len(unique_data)}")

# NumPy-style Vectorization Logic
prices = [100, 200, 300]
discounted = [p * 0.9 for p in prices] # Fast processing
print(f"Sale Prices: {discounted}")`,
        visual: "A vast, glowing matrix of numbers where a lens scan reveals hidden geometric shapes and trends that were invisible to the naked eye.",
        recap: "NumPy provides high-speed array processing.<br>Pandas is the industry standard for spreadsheet-like data manipulation.<br>Data visualization turns complex numbers into actionable insights.<br>Python is the #1 choice for data scientists due to its massive math library.",
        hook: "Download a small CSV from Kaggle and try to open it with Pandas 'read_csv' function!"
    },
    {
        id: 18,
        title: "Machine Learning Basics",
        tag: "ARTIFICIAL COGNITION",
        overview: "Machine Learning (ML) is the science of getting computers to act without being explicitly programmed. With Python, you can build systems that recognize faces, predict prices, or play complex games.",
        explanation: `<strong>1. Introduction to ML:</strong> Moving from 'Hard-coded logic' (if/else) to 'Learned logic' where the computer finds the rules itself by looking at data.<br><br>
        <strong>2. Scikit-learn:</strong> The gold standard library for 'Classical' ML. It provides easy-to-use tools for regression, classification, and clustering.<br><br>
        <strong>3. Supervised Learning:</strong> Teaching the model using labeled examples (e.g., 'This is a picture of a cat').<br><br>
        <strong>4. Unsupervised Learning:</strong> Letting the model find hidden patterns on its own (e.g., grouping customers into 'Big Spenders' vs 'Budget Shoppers').<br><br>
        <strong>5. Training & Evaluation:</strong> Splitting data into 'Training' (to learn) and 'Testing' (to check if it learned correctly).`,
        code: `# Logical Flow of an ML Script
# from sklearn.linear_model import LinearRegression
# model = LinearRegression()

# PHASE 1: Data Preparation
# features = [[room_count, area], ...]
# targets = [prices]

# PHASE 2: Training (Fit)
# model.fit(features, targets)

# PHASE 3: Prediction (Inference)
# result = model.predict([[3, 1500]])

# Manual Neuron Logic Simulation
def predict_success(study_hours):
    weight = 0.8
    bias = 10
    prediction = (study_hours * weight) + bias
    return min(100, prediction)

print(f"Predicted Score for 80hrs: {predict_success(80)}%")`,
        visual: "A glowing brain made of circuitry where neurons are firing and connecting in new patterns as millions of data points pass through it.",
        recap: "Machine Learning finds patterns in data to make predictions.<br>Scikit-learn is the go-to library for implementing standard ML algorithms.<br>Supervised learning uses examples; Unsupervised finds hidden groups.<br>Always evaluate your model on 'New' data to ensure it actually works.",
        hook: "Research what 'Overfitting' is—it's when a student memorizes the exam answers but doesn't understand the subject!"
    },
    {
        id: 19,
        title: "Testing and Debugging",
        tag: "CODE QUALITY",
        overview: "Professional code is tested code. Debugging is the process of finding errors, while Testing (Unit Testing) is the process of ensuring those errors never come back.",
        explanation: `<strong>1. Debugging Techniques:</strong> Using <code>print()</code> statements (manual), using high-speed debugger tools in IDEs, and analyzing 'Tracebacks' to find exactly which line failed.<br><br>
        <strong>2. Unit Testing (unittest & pytest):</strong> Writing small scripts that test specific parts of your code. For example: 'If I pass 10 to the sqr function, does it really return 100?'.<br><br>
        <strong>3. Assertions:</strong> Using <code>assert</code> to force a check. If the condition is False, the program stops immediately and tells you what went wrong.<br><br>
        <strong>4. Logging:</strong> Instead of print(), pros use the <code>logging</code> module. It allows you to save errors to a file and categorize them by severity (DEBUG, INFO, WARNING, ERROR, CRITICAL).`,
        code: `# Using Assertions for safety
def set_age(age):
    assert age >= 0, "Age cannot be negative!"
    return f"User age set to {age}"

print(set_age(25))
# set_age(-5) # This would stop the program!

# Simple Test Case Logic
def add(a, b): return a + b

def test_add():
    if add(2, 3) == 5:
        print("TEST: Addition Logic - PASSED")
    else:
        print("TEST: Addition Logic - FAILED")

test_add()

# Logging Simulation
import logging
logging.warning("Reactor coolant low. Auto-regulating...")`,
        visual: "A holographic scanner passing over a jagged, glowing circuit board, identifying red 'glitches' and repairing them with blue light pulses.",
        recap: "Debugging removes existing bugs; Testing prevents new ones.<br>Pytest is the most popular modern testing framework for Python.<br>Assertions are internal checks that ensure logic stays correct.<br>Logging provides a permanent record of what happened inside your app.",
        hook: "Deliberately cause a 'ZeroDivisionError' and read the 'Traceback' from bottom to top—that's how you debug like a pro!"
    },
    {
        id: 20,
        title: "Version Control",
        tag: "TIME MANAGEMENT",
        overview: "Git is the safety net of the software world. It allows you to track every change, collaborate with thousands of developers, and 'travel back in time' if you break your project.",
        explanation: `<strong>1. Introduction to Git:</strong> A distributed system that records snapshots of your project. If your hard drive dies, your code lives on in the Git cloud.<br><br>
        <strong>2. Basic Git Commands:</strong><br>
        • <code>git init</code>: Create a new history timeline.<br>
        • <code>git add</code>: Stage changes for a save point.<br>
        • <code>git commit -m "msg"</code>: Create a permanent save point.<br>
        • <code>git status</code>: See what has changed since the last save.<br><br>
        <strong>3. GitHub:</strong> The social network for code. It hosts your 'Repositories' (Repos) so you can share your work or contribute to open-source projects like Linux or Python itself.<br><br>
        <strong>4. Collaboration:</strong> Using 'Branches' to work on new features without breaking the main app, and 'Pull Requests' to ask teammates to review your code.`,
        code: `# Typical Professional Workflow:
# PHASE 1: Local Setup
# git config --global user.name "YourName"

# PHASE 2: The Save Cycle
# git add .             (Stage all files)
# git commit -m "Fix login" (Lock in the change)

# PHASE 3: Moving to Cloud
# git push origin main  (Upload to GitHub)

# Mocked status check
current_branch = "feature-login"
unstaged_changes = ["auth.py", "styles.css"]
print(f"Working on {current_branch}. Ready to stage: {len(unstaged_changes)} files.")`,
        visual: "A multi-dimensional timeline where many parallel versions of a city are being built at once before being merged into a single perfect metropolis.",
        recap: "Git provides a version history and enables parallel development.<br>Commits are permanent checkpoints; branches are experiments.<br>GitHub is the central hub for hosting and collaborating on code.<br>Pull Requests are the standard way to merge new features into a team project.",
        hook: "Go to GitHub.com and find the 'Python' repository—you can read the actual code that runs the language!"
    },
    {
        id: 21,
        title: "Deployment and Packaging",
        tag: "THE FINAL LAUNCH",
        overview: "Writing code is only 50% of the job. Deployment is the process of putting your application on a server so the entire world can use it.",
        explanation: `<strong>1. Packaging:</strong> Turning your folder of scripts into a 'Package' that others can install with <code>pip install</code>.<br><br>
        <strong>2. Virtual Environments (venv):</strong> Creating an isolated 'bubble' for your project. This prevents you from breaking other apps on your computer by having different versions of libraries.<br><br>
        <strong>3. Requirements File:</strong> A file called <code>requirements.txt</code> that lists every library your app needs to run. The server reads this file to set up the environment automatically.<br><br>
        <strong>4. Deployment:</strong> Uploading your code to cloud platforms like **Heroku**, **Railway**, or using **Docker Containers**—which wrap your app in a virtual 'shipping container' that works on any server in the world.`,
        code: `# Phase 1: Environment Isolation
# python -m venv app_env
# source app_env/bin/activate

# Phase 2: Dependency Logging
# pip install requests flask pandas
# pip freeze > requirements.txt

# Phase 3: Launch Simulation
target_env = "AWS Production"
docker_status = "Container Sealed"
print(f"Deploying build v2.1 to {target_env}...")
print(f"Status: {docker_status}... LAUNCH SUCCESSFUL.")

# Mock requirements check
with open("requirements.txt", "w") as req:
    req.write("flask==3.0\\nrequests==2.31\\npandas==2.1")`,
        visual: "A gleaming rocket ship lifting out of a misty forest, breaking through the clouds, and docking with a massive orbital space station (The Internet).",
        recap: "Deployment moves code from local development to production servers.<br>Virtual environments (venv) prevent library version conflicts.<br>requirements.txt is the essential 'parts list' for your server.<br>Containerization (Docker) ensures your app works on any machine globally.",
        hook: "Look up what a 'Docker Container' is—it's the reason why modern websites never have 'it worked on my machine' problems!"
    }
];
