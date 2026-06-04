import os

admin_dir = "src/app/admin"

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if not file.endswith('.tsx'):
            continue
        filepath = os.path.join(root, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        skip_until_brace_close = 0
        skip_lines = 0
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # Skip "const token = localStorage.getItem(...)" lines
            if 'localStorage.getItem("adminToken")' in line and 'const token' in line:
                i += 1
                continue
            
            # Skip "if (!token)" guard blocks (various patterns)
            if 'if (!token)' in line and 'router.push("/admin")' in line:
                # Skip this line and possibly the next lines until we find the closing brace
                brace_count = line.count('{') - line.count('}')
                i += 1
                while i < len(lines) and brace_count > 0:
                    brace_count += lines[i].count('{') - lines[i].count('}')
                    i += 1
                # Also skip the "else {" and its body if present
                if i < len(lines) and 'else' in lines[i]:
                    brace_count = lines[i].count('{') - lines[i].count('}')
                    i += 1
                    while i < len(lines) and brace_count > 0:
                        brace_count += lines[i].count('{') - lines[i].count('}')
                        i += 1
                continue
            
            if 'if (!token) return;' in line:
                i += 1
                continue
            
            if 'if (!token) return' in line and 'router.push' not in line:
                i += 1
                continue
            
            # Remove Authorization headers from fetch calls
            if 'Authorization:' in line and ('Bearer' in line or 'token' in line):
                i += 1
                continue
            
            # Remove lines with ...(token && { Authorization... })
            if '...(token' in line and 'Authorization' in line:
                i += 1
                continue
            
            # Remove "const headers: any = {}" blocks
            if 'const headers:' in line and 'any' in line and '{}' in line:
                i += 1
                # Skip until we find the empty line or next statement
                while i < len(lines) and (lines[i].strip().startswith('if') or 'headers.' in lines[i] or lines[i].strip() == ''):
                    if 'headers.' in lines[i] and 'Authorization' in lines[i]:
                        i += 1
                        continue
                    if lines[i].strip().startswith('if') and 'token' in lines[i]:
                        brace_count = lines[i].count('{') - lines[i].count('}')
                        i += 1
                        while i < len(lines) and brace_count > 0:
                            brace_count += lines[i].count('{') - lines[i].count('}')
                            i += 1
                        continue
                    i += 1
                continue
            
            # Remove "headers: { Authorization... }" from fetch calls
            # Check if this line starts a headers object with Authorization
            stripped = line.strip()
            if stripped.startswith('headers:') and 'Authorization' in stripped:
                # If it's a one-liner, skip it
                if '}' in stripped:
                    i += 1
                    continue
                # Multi-line: skip until closing brace
                brace_count = stripped.count('{') - stripped.count('}')
                i += 1
                while i < len(lines) and brace_count > 0:
                    brace_count += lines[i].count('{') - lines[i].count('}')
                    i += 1
                continue
            
            # Remove token parameter from function calls like fetchXxx(token)
            if 'fetch' in line and '(token)' in line:
                line = line.replace('(token)', '()')
            
            # Remove token from fetch call headers that span multiple lines
            if stripped == 'headers':
                # Check next line
                if i + 1 < len(lines) and ':' in lines[i + 1]:
                    j = i + 1
                    header_block = ''
                    brace_count = 0
                    while j < len(lines):
                        header_block += lines[j]
                        brace_count += lines[j].count('{') - lines[j].count('}')
                        if brace_count <= 0 and '}' in lines[j]:
                            break
                        j += 1
                    if 'Authorization' in header_block and 'token' in header_block:
                        # Skip the headers block
                        i = j + 1
                        continue
            
            new_lines.append(line)
            i += 1
        
        # Post-process: clean up empty headers objects and trailing commas
        content = ''.join(new_lines)
        
        # Remove empty headers: { } or headers: {},
        content = content.replace('headers: { },', '')
        content = content.replace('headers: { }', '')
        content = content.replace('headers: {},', '')
        content = content.replace('headers: {}', '')
        
        # Remove trailing commas before closing braces in fetch calls
        import re
        content = re.sub(r',\s*\n(\s*)\}', r'\n\1}', content)
        
        # Clean up double newlines
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Check if still has issues
        with open(filepath, 'r', encoding='utf-8') as f:
            remaining = f.read()
        if 'localStorage.getItem("adminToken")' in remaining:
            print(f"WARNING: Still has localStorage: {filepath}")
        if 'Authorization' in remaining and 'Bearer' in remaining:
            print(f"WARNING: Still has Authorization: {filepath}")

print("Done!")
