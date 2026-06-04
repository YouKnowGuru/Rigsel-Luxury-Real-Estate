import os
import re

admin_dir = "src/app/admin"

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if not file.endswith('.tsx'):
            continue
        filepath = os.path.join(root, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix pattern: method: "POST",\n                ,\n                body:
        content = re.sub(r'(method:\s*"[A-Z]+",)\s*\n\s*,\s*\n', r'\1\n', content)
        
        # Fix pattern: fetch(url, {\n                ,\n            });
        content = re.sub(r'(fetch\([^,]+,\s*\{)\s*\n\s*,\s*\n', r'\1\n', content)
        
        # Fix pattern: headers: {\n                ,\n            }
        content = re.sub(r'(headers:\s*\{)\s*\n\s*,\s*\n', r'\1\n', content)
        
        # Fix more general pattern: any line with just a comma after removing headers
        lines = content.split('\n')
        new_lines = []
        for i, line in enumerate(lines):
            stripped = line.strip()
            # If this line is just a comma
            if stripped == ',':
                # Check if previous line ends with a comma
                if new_lines and new_lines[-1].rstrip().endswith(','):
                    new_lines[-1] = new_lines[-1].rstrip()[:-1]
                continue
            # If this line starts with a comma (like `,` on its own or `, body:`)
            if stripped.startswith(','):
                # Remove the leading comma
                line = line.replace(',', '', 1)
                # If the line is now empty or just whitespace, skip it
                if line.strip() == '':
                    # But check if previous line ends with comma
                    if new_lines and new_lines[-1].rstrip().endswith(','):
                        new_lines[-1] = new_lines[-1].rstrip()[:-1]
                    continue
            new_lines.append(line)
        
        content = '\n'.join(new_lines)
        
        # Clean up double newlines
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")

print("Done!")
