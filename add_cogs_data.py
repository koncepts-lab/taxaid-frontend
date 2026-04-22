import json
import re

with open('public/data/data.json', 'r', encoding='utf-8') as f:
    text = f.read()

cogs_data = {
  "summary": [
    {
      "label": "Product Sales",
      "labelAr": "مبيعات المنتجات",
      "currentYear": "1,850,000",
      "previousYear": "1,620,000",
      "budget": "1,900,000",
      "variance": 14.2,
      "progress": 50
    },
    {
      "label": "Service",
      "labelAr": "خدمة",
      "currentYear": "450,000",
      "previousYear": "380,000",
      "budget": "480,000",
      "variance": 18.4,
      "progress": 30
    },
    {
      "label": "Subscriptions",
      "labelAr": "الاشتراكات",
      "currentYear": "280,000",
      "previousYear": "240,000",
      "budget": "300,000",
      "variance": -16.7,
      "progress": 20
    }
  ],
  "summaryTotal": {
    "currentYear": "2,775,000",
    "previousYear": "2,405,000",
    "budget": "2,890,000",
    "variance": 15.4,
    "progress": 25
  },
  "breakdown": {
    "categories": [
      { "en": "Product Sales", "ar": "مبيعات المنتجات" },
      { "en": "Service", "ar": "خدمة" },
      { "en": "Consulting", "ar": "استشارات" },
      { "en": "Subscription", "ar": "الاشتراك" },
      { "en": "SaaS", "ar": "برمجيات" },
      { "en": "Training", "ar": "التدريب" },
      { "en": "Support", "ar": "دعم" },
      { "en": "Licensing", "ar": "الترخيص" },
      { "en": "Logistics", "ar": "الخدمات اللوجستية" },
      { "en": "Manufacturing", "ar": "التصنيع" }
    ],
    "previousYearData": [1.6, 3.8, 3.4, 2.4, 2.5, 4.5, 2.7, 3.5, 4.5, 4.8],
    "currentYearData": [1.8, 4.5, 2.8, 2.8, 1.7, 5.0, 3.0, 4.0, 5.0, 5.0]
  },
  "last6Months": {
    "months": [
      { "en": "Apr", "ar": "أبريل" },
      { "en": "May", "ar": "مايو" },
      { "en": "Jun", "ar": "يونيو" },
      { "en": "Jul", "ar": "يوليو" },
      { "en": "Aug", "ar": "أغسطس" },
      { "en": "Sep", "ar": "سبتمبر" }
    ],
    "previousYearData": [2.4, 3.0, 1.8, 4.7, 1.0, 2.6],
    "currentYearData": [0.7, 1.0, 3.5, 4.6, 2.0, 4.2]
  },
  "revenueToCogs": {
    "months": [
      { "en": "Apr", "ar": "أبريل" },
      { "en": "May", "ar": "مايو" },
      { "en": "Jun", "ar": "يونيو" },
      { "en": "Jul", "ar": "يوليو" },
      { "en": "Aug", "ar": "أغسطس" },
      { "en": "Sep", "ar": "سبتمبر" }
    ],
    "cogsData": [1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
    "revenueData": [2.4, 2.6, 2.1, 3.0, 3.2, 3.4]
  }
}

content_str = json.dumps(cogs_data, ensure_ascii=False, indent=2)

comment_block = """  "__comment: cogs": "============================================================",
  "__comment: cogs": "  PAGE → pages/cogs/index.vue | URL → /cogs ",
  "__comment: cogs": "  Summary, Breakdown, Last 6 Months, Revenue to COGS Monthly ",
  "__comment: cogs": "============================================================",
  "cogsPage": """

# Insert at the end before the last closing brace
new_text = re.sub(r'(\n\})', ',\n' + comment_block + content_str + r'\1', text)

with open('public/data/data.json', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated data.json for cogs')
