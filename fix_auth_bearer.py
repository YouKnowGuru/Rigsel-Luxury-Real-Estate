import os

admin_dir = "src/app/admin"

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if not file.endswith('.tsx'):
            continue
        filepath = os.path.join(root, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        lines = content.split('\n')
        new_lines = []
        i = 0
        while i < len(lines):
            line = lines[i]
            stripped = line.strip()
            
            # Pattern 1: Single line Authorization with localStorage
            if 'Authorization: `Bearer ${localStorage.getItem("adminToken")}`' in stripped:
                i += 1
                continue
            
            # Pattern 2: onClick with localStorage token
            if 'fetchSettings(localStorage.getItem("adminToken") || "")' in stripped:
                line = line.replace('fetchSettings(localStorage.getItem("adminToken") || "")', 'fetchSettings()')
                new_lines.append(line)
                i += 1
                continue
            
            new_lines.append(line)
            i += 1
        
        content = '\n'.join(new_lines)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
        
        if 'localStorage.getItem("adminToken")' in content:
            print(f"WARNING: Still has localStorage: {filepath}")

print("Done!")
