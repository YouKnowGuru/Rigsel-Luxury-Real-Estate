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
        
        # Replace bg-white with bg-card for containers and cards
        # But keep bg-white for small interactive elements like buttons, checkboxes
        
        # Main content containers
        content = content.replace('bg-white rounded-[20px] p-6 border', 'bg-card rounded-[20px] p-6 border')
        content = content.replace('bg-white rounded-xl border', 'bg-card rounded-xl border')
        
        # Chat input area
        content = content.replace('border-t border-ink-100/60 bg-white', 'border-t border-ink-100/60 bg-card')
        
        # Action buttons (small icon buttons) - keep white in light mode but add dark support
        # Instead of bg-white, use bg-card for consistency
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            # For small icon buttons in tables/lists, use bg-card
            if 'w-9 h-9' in line and 'bg-white' in line and 'rounded-lg' in line:
                line = line.replace('bg-white', 'bg-card')
            elif 'w-9 h-9' in line and 'bg-white' in line and 'rounded-[14px]' in line:
                line = line.replace('bg-white', 'bg-card')
            elif 'w-10 h-10' in line and 'bg-white' in line:
                line = line.replace('bg-white', 'bg-card')
            new_lines.append(line)
        content = '\n'.join(new_lines)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")

print("Done!")
