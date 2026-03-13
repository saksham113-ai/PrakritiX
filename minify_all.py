import os
import re
import glob
def minify(content):
    # Split content by strings to avoid minifying inside literal strings.
    # Handles "...",'...',and `...`
    parts=re.split(r'(".*?(?<!\\)"|\'.*?(?<!\\)\'|`[\s\S]*?(?<!\\)`)',content,flags=re.DOTALL)
    ops=r'[=+\*/<>:;,{}()\[\]\-]'
    for i in range(0,len(parts),2):
        # 1. Remove blank lines(multiple newlines to single newline)
        parts[i]=re.sub(r'\n\s*\n','\n',parts[i])
        # 2. Remove horizontal spaces BEFORE operators,only if preceded by non-whitespace(\S)
        parts[i]=re.sub(r'(?<=\S)[ \t]+(' +ops+')',r'\1',parts[i])
        # 3. Remove horizontal spaces AFTER operators
        parts[i]=re.sub('(' +ops+r')[ \t]+',r'\1',parts[i])
    return ''.join(parts)
# Target specific extensions that the agent writes and modifies.
# To ensure safety,we'll avoid binaries, node_modules, etc.
files_to_process = []
for ext in ['**/*.tsx', '**/*.ts', '**/*.js', '**/*.jsx', '**/*.css', '**/*.py']:
    files_to_process.extend(glob.glob('src/' + ext, recursive=True))
    files_to_process.extend(glob.glob(ext, recursive=True)) # for root level files

# Make list unique
files_to_process = list(set(files_to_process))

for f in files_to_process:
    if 'node_modules' in f or 'dist' in f or '.git' in f or '__pycache__' in f:
        continue
    
    try:
        with open(f, 'r', encoding='utf-8') as file:
            original_content = file.read()
            
        minified_content = minify(original_content)
        
        # Additional step to remove literal leading/trailing blank lines in the file
        minified_content = minified_content.strip() + '\n'
        
        if original_content != minified_content:
            with open(f, 'w', encoding='utf-8')as file:
                file.write(minified_content)
            print(f"Minified {f}")
    except Exception as e:
        print(f"Failed to minify {f}: {e}")
print("Minification complete.")
