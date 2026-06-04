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
        
        # Replace bg-white with bg-card for main content cards/containers
        # But NOT for buttons, inputs, or small elements that should stay white in light mode
        # We need to be selective - only replace bg-white on larger containers
        
        # Pattern 1: bg-white rounded-2xl border (property cards, blog cards, etc.)
        content = content.replace('bg-white rounded-2xl border', 'bg-card rounded-2xl border')
        content = content.replace('bg-white rounded-xl border', 'bg-card rounded-xl border')
        content = content.replace('bg-white rounded-[20px] border', 'bg-card rounded-[20px] border')
        
        # Pattern 2: bg-white in empty state containers
        content = content.replace('text-center py-16 bg-white rounded-xl', 'text-center py-16 bg-card rounded-xl')
        content = content.replace('text-center py-20 bg-white rounded-xl', 'text-center py-20 bg-card rounded-xl')
        
        # Pattern 3: Main page containers
        content = content.replace('className="bg-white rounded-[20px] border', 'className="bg-card rounded-[20px] border')
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")

print("Done!")
