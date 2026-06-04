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
        
        # Pattern 1: const token = localStorage.getItem("adminToken");\n        if (!token) { router.push("/admin"); return; }\n        fetchXxx(token);
        # Replace with just fetchXxx();
        content = re.sub(
            r'const token = localStorage\.getItem\("adminToken"\);\s*\n\s*if \(!token\) \{\s*router\.push\("/admin"\);\s*return;\s*\}\s*\n\s*(\w+)\(token\);',
            r'\1();',
            content
        )
        
        # Pattern 2: const token = localStorage.getItem("adminToken");\n        if (!token) { router.push("/admin"); } else { fetchXxx(); }
        content = re.sub(
            r'const token = localStorage\.getItem\("adminToken"\);\s*\n\s*if \(!token\) \{\s*router\.push\("/admin"\);\s*\} else \{\s*\n\s*([^}]+)\}\s*\n',
            r'\1\n',
            content
        )
        
        # Pattern 3: const token = localStorage.getItem("adminToken");\n        if (!token) return;\n        fetchXxx(token);
        content = re.sub(
            r'const token = localStorage\.getItem\("adminToken"\);\s*\n\s*if \(!token\) return;\s*\n\s*(\w+)\(token\);',
            r'\1();',
            content
        )
        
        # Pattern 4: const token = localStorage.getItem("adminToken");\n        if (!token) { router.push("/admin"); return; }\n        (multiple statements)
        content = re.sub(
            r'const token = localStorage\.getItem\("adminToken"\);\s*\n\s*if \(!token\) \{\s*router\.push\("/admin"\);\s*return;\s*\}\s*\n',
            '',
            content
        )
        
        # Pattern 5: const token = localStorage.getItem("adminToken");\n        if (!token) return;\n        (just remove these lines)
        content = re.sub(
            r'const token = localStorage\.getItem\("adminToken"\);\s*\n\s*if \(!token\) return;\s*\n',
            '',
            content
        )
        
        # Pattern 6: const token = localStorage.getItem("adminToken"); (standalone, used later)
        # Remove the declaration line
        content = re.sub(
            r'^\s*const token = localStorage\.getItem\("adminToken"\);\s*\n',
            '',
            content,
            flags=re.MULTILINE
        )
        
        # Remove Authorization headers from fetch calls
        # Pattern: headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        content = re.sub(
            r',?\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{localStorage\.getItem\("adminToken"\)\}`\s*\}',
            '',
            content
        )
        
        # Pattern: headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        # Keep only Content-Type
        content = re.sub(
            r'(headers:\s*\{\s*"Content-Type":\s*"application/json"),\s*Authorization:\s*`Bearer \$\{localStorage\.getItem\("adminToken"\)\}`\s*\}',
            r'\1 }',
            content
        )
        content = re.sub(
            r'(headers:\s*\{\s*"Content-Type":\s*"application/json",)\s*\n\s*Authorization:\s*`Bearer \$\{localStorage\.getItem\("adminToken"\)\}`,?\s*\n\s*\}',
            r'\1\n        }',
            content
        )
        
        # Pattern: headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        content = re.sub(
            r'headers:\s*\{\s*\.\.\.\(token\s*&&\s*\{\s*Authorization:\s*`Bearer \$\{token\}`\s*\}\)\s*\}',
            '',
            content
        )
        
        # Pattern: ...(token && { Authorization: `Bearer ${token}` })
        content = re.sub(
            r',?\s*\.\.\.\(token\s*&&\s*\{\s*Authorization:\s*`Bearer \$\{token\}`\s*\}\)',
            '',
            content
        )
        
        # Pattern: const headers: any = {}; if (token) headers.Authorization = ...
        content = re.sub(
            r'const headers:\s*any\s*=\s*\{\};\s*\n\s*if\s*\(token\)\s*\{\s*\n\s*headers\.Authorization\s*=\s*`Bearer \$\{token\}`;\s*\n\s*\}\s*\n',
            '',
            content
        )
        
        # Remove token parameter from function signatures where token is no longer used
        # This is trickier - only do it for simple cases
        # e.g., const fetchXxx = async (token: string) => {
        content = re.sub(
            r'const (\w+) = async \(token:\s*string\) => \{',
            r'const \1 = async () => {',
            content
        )
        
        # Clean up any remaining token references in fetch calls
        content = re.sub(
            r',?\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{token\}`\s*\}',
            '',
            content
        )
        
        # Remove empty headers objects
        content = re.sub(
            r',\s*headers:\s*\{\s*\}',
            '',
            content
        )
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
        else:
            # Check if there are still localStorage references
            if 'localStorage.getItem("adminToken")' in content:
                print(f"WARNING: Still has localStorage: {filepath}")

print("Done!")
