import os

admin_dir = "src/app/admin"

replacements = [
    # useEffect patterns
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
        } else {
            fetchBlogs();
        }
    }, [router]);''',
     '''    useEffect(() => {
        fetchBlogs();
    }, []);'''),
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
        } else {
            fetchBlogs();
        }
    }, []);''',
     '''    useEffect(() => {
        fetchBlogs();
    }, []);'''),
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) { router.push("/admin"); return; }
        fetchDashboardData(token);
    }, [router]);''',
     '''    useEffect(() => {
        fetchDashboardData();
    }, []);'''),
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) { router.push("/admin"); return; }
        fetchDashboardData(token);
    }, []);''',
     '''    useEffect(() => {
        fetchDashboardData();
    }, []);'''),
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
            return;
        }
        fetchDocuments(token);
    }, []);''',
     '''    useEffect(() => {
        fetchDocuments();
    }, []);'''),
    ('''  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
    } else {
      fetchProperties();
      fetchPropertyTypes();
    }
  }, [router]);''',
     '''  useEffect(() => {
    fetchProperties();
    fetchPropertyTypes();
  }, []);'''),
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
        } else {
            fetchProperty();
        }
    }, [id]);''',
     '''    useEffect(() => {
        fetchProperty();
    }, [id]);'''),
    ('''    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("adminToken");
        if (!token) { router.push("/admin"); return; }
        fetchSettings(token);
    }, [router]);''',
     '''    useEffect(() => {
        setMounted(true);
        fetchSettings();
    }, []);'''),
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) { router.push("/admin"); return; }
        fetchSettings(token);
    }, [router]);''',
     '''    useEffect(() => {
        fetchSettings();
    }, []);'''),
    ('''    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) { router.push("/admin"); return; }
        fetchSettings(token);
    }, []);''',
     '''    useEffect(() => {
        fetchSettings();
    }, []);'''),
]

func_replacements = [
    ('const fetchDashboardData = async (token: string) => {', 'const fetchDashboardData = async () => {'),
    ('const fetchDocuments = async (token: string) => {', 'const fetchDocuments = async () => {'),
    ('const fetchSettings = async (token: string) => {', 'const fetchSettings = async () => {'),
]

fetch_replacements = [
    (', headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }', ''),
    (', headers: { Authorization: `Bearer ${token}` }', ''),
    ('headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }', ''),
    ('headers: { Authorization: `Bearer ${token}` }', ''),
    (', ...(token && { "Authorization": `Bearer ${token}` })', ''),
    (', ...(token && { Authorization: `Bearer ${token}` })', ''),
]

decl_removals = [
    '    const token = localStorage.getItem("adminToken");\n',
    '      const token = localStorage.getItem("adminToken");\n',
    '        const token = localStorage.getItem("adminToken");\n',
    '            const token = localStorage.getItem("adminToken");\n',
]

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if not file.endswith('.tsx'):
            continue
        filepath = os.path.join(root, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        for old, new in replacements:
            content = content.replace(old, new)
        
        for old, new in func_replacements:
            content = content.replace(old, new)
        
        for old, new in fetch_replacements:
            content = content.replace(old, new)
        
        for old in decl_removals:
            content = content.replace(old, '')
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
        
        if 'localStorage.getItem("adminToken")' in content:
            print(f"WARNING: Still has localStorage: {filepath}")

print("Done!")
