import re
import os

base_dir = r'D:\010_Antigravity\010_job\Web_Portfolio'
html_path = os.path.join(base_dir, 'index.html')
css_path = os.path.join(base_dir, 'css', 'style.css')
js_path = os.path.join(base_dir, 'js', 'app.js')

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update ILLUSTRATION text in TOP
sitemap_illustration_old = r'<li style="margin-bottom: 1rem;"><a href="#" onclick="document.querySelector\(\'nav a\[data-target=\\\'illustrations\\\'\]\'\)\.click\(\); return false;" style="color: var\(--accent\); text-decoration: none; font-weight: bold; font-size: 1\.2rem;">ILLUSTRATION</a><br>　制作したイラスト例を紹介します</li>'
sitemap_illustration_new = '<li style="margin-bottom: 1rem;"><a href="#" onclick="document.querySelector(\'nav a[data-target=\\\'illustrations\\\']\').click(); return false;" style="color: var(--accent); text-decoration: none; font-weight: bold; font-size: 1.2rem;">ILLUSTRATION</a><br>　制作したイラスト例を紹介します<br>　※主に動画用のキャラクター素材です</li>'
html = re.sub(sitemap_illustration_old, sitemap_illustration_new, html)

# 2. Update ILLUSTRATION section
ill_section_old = r'(<section id="illustrations">.*?<h2>イラスト紹介</h2>)'
ill_section_new = r'\1\n                <p>※主に動画用のキャラクター素材です</p>'
html = re.sub(ill_section_old, ill_section_new, html, flags=re.DOTALL)

# 3. Fix YouTube iframes
html = re.sub(r'<iframe data-src="([^"]+)"></iframe>', r'<iframe src="\1" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 4. Remove iframe observer from JS
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

js = re.sub(r'''                // YouTube \(iframe\)\s+if \(el\.tagName === 'IFRAME' && el\.hasAttribute\('data-src'\)\) \{\s+el\.src = el\.getAttribute\('data-src'\);\s+el\.removeAttribute\('data-src'\);\s+\}\s+''', '', js)
js = re.sub(r'iframe\[data-src\]', '', js)
js = js.replace('.instagram-media-deferred, ', '.instagram-media-deferred') # Cleanup if empty selector part

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

# 5. Fix mobile background in CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

mobile_bg_fix = '''
@media (max-width: 768px) {
    body {
        background-attachment: scroll;
        background-position: top center;
    }
}
'''
if 'background-attachment: scroll;' not in css:
    css += mobile_bg_fix

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

