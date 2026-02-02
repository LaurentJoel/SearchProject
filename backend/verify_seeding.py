# verify_seeding.py
import psycopg2
import json

print("🔍 VERIFYING DATABASE SEEDING STATUS")
print("=" * 60)

conn = psycopg2.connect(
    host='localhost',
    port=5432,
    user='postgres',
    password='postgres',
    database='search_presentation'
)
cur = conn.cursor()

# ========== CHECK CONTENT SECTIONS ==========
print("\n📄 CONTENT SECTIONS CHECK")
print("-" * 40)

# Get all content sections
cur.execute("""
    SELECT section_key, title 
    FROM content_sections 
    ORDER BY section_key
""")
existing_sections = cur.fetchall()

print(f"Found {len(existing_sections)} content sections:")

# Expected sections from your seed file
expected_sections = [
    'hero', 'features', 'platform', 'video', 'future', 'cta',
    'welcome_auth', 'intelligent_search', 'dashboard_management',
    'advanced_features', 'secure_reliable', 'footer'
]

existing_keys = [section[0] for section in existing_sections]

print("\nMissing sections:")
missing_sections = []
for expected in expected_sections:
    if expected not in existing_keys:
        missing_sections.append(expected)
        print(f"  ❌ {expected}")

if not missing_sections:
    print("  ✅ All expected sections are present")

# ========== CHECK FEATURES ==========
print("\n⭐ FEATURES CHECK")
print("-" * 40)

cur.execute("SELECT COUNT(*), title FROM features GROUP BY title ORDER BY title")
features = cur.fetchall()

print(f"Found {sum(f[0] for f in features)} features across {len(features)} unique titles:")

expected_features = [
    'AI-Powered Search',
    'Bandwidth Optimized', 
    'Workflow Automation',
    'Enterprise Security',
    'Document Management',
    'Team Collaboration'
]

existing_feature_titles = [f[1] for f in features]

print("\nMissing features:")
missing_features = []
for expected in expected_features:
    if expected not in existing_feature_titles:
        missing_features.append(expected)
        print(f"  ❌ {expected}")

if not missing_features:
    print("  ✅ All expected features are present")

# ========== CHECK DYNAMIC SECTIONS ==========
print("\n🎯 DYNAMIC SECTIONS CHECK")
print("-" * 40)

# Check by section_type
cur.execute("""
    SELECT section_type, COUNT(*) as count
    FROM dynamic_sections 
    WHERE is_active = true
    GROUP BY section_type
    ORDER BY section_type
""")
dynamic_by_type = cur.fetchall()

print("Dynamic sections by type:")
for section_type, count in dynamic_by_type:
    print(f"  • {section_type}: {count} sections")

# Expected counts from seed file
expected_counts = {
    'future': 6,
    'cta': 3,
    'platform': 3
}

print("\nChecking counts:")
for section_type, expected_count in expected_counts.items():
    actual_count = next((c for t, c in dynamic_by_type if t == section_type), 0)
    if actual_count >= expected_count:
        print(f"  ✅ {section_type}: {actual_count}/{expected_count}")
    else:
        print(f"  ❌ {section_type}: {actual_count}/{expected_count} (missing {expected_count - actual_count})")

# ========== CHECK BULLET POINTS ==========
print("\n📋 BULLET POINTS CHECK")
print("-" * 40)

# Check sections that should have bullet points
bullet_sections = ['welcome_auth', 'intelligent_search', 'dashboard_management', 
                   'advanced_features', 'secure_reliable']

cur.execute("""
    SELECT section_key, bullet_points 
    FROM content_sections 
    WHERE section_key IN %s
""", (tuple(bullet_sections),))

bullet_results = cur.fetchall()

print("Bullet points status:")
for section_key, bullet_points in bullet_results:
    if bullet_points and bullet_points.strip() and bullet_points != '[]':
        try:
            data = json.loads(bullet_points)
            if data and len(data) > 0:
                print(f"  ✅ {section_key}: {len(data)} bullet points")
            else:
                print(f"  ⚠️ {section_key}: Empty bullet points array")
        except:
            print(f"  ⚠️ {section_key}: Invalid JSON format")
    else:
        print(f"  ❌ {section_key}: No bullet points")

# ========== FINAL SUMMARY ==========
print("\n" + "=" * 60)
print("📊 SEEDING VERIFICATION SUMMARY")
print("=" * 60)

total_issues = len(missing_sections) + len(missing_features)

if total_issues == 0:
    print("\n🎉 PERFECT! All data is properly seeded.")
    print("Your database is fully populated with all required content.")
else:
    print(f"\n⚠️  Found {total_issues} issues:")
    if missing_sections:
        print(f"  • Missing content sections: {len(missing_sections)}")
    if missing_features:
        print(f"  • Missing features: {len(missing_features)}")
    
    print("\n💡 Run your seed_database.py script to fix these issues.")

conn.close()
