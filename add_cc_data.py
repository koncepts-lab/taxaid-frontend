import json
import re

with open('public/data/data.json', 'r', encoding='utf-8') as f:
    text = f.read()

cc_data = {
  "summary": [
    {
      "label": "Residential Projects",
      "labelAr": "المشاريع السكنية",
      "revenue": "2,400,000",
      "cogs": "1,500,000",
      "indirectExp": "600,000",
      "profit": "300,000",
      "margin": 12.5
    },
    {
      "label": "Commercial Projects",
      "labelAr": "المشاريع التجارية",
      "revenue": "1,800,000",
      "cogs": "1,100,000",
      "indirectExp": "400,000",
      "profit": "300,000",
      "margin": 16.7
    },
    {
      "label": "Infrastructure",
      "labelAr": "البنية التحتية",
      "revenue": "2,000,000",
      "cogs": "1,200,000",
      "indirectExp": "500,000",
      "profit": "300,000",
      "margin": 15.0
    }
  ],
  "summaryTotal": {
    "label": "Total Project Cost",
    "labelAr": "إجمالي تكلفة المشروع",
    "revenue": "17,500,000",
    "cogs": "12,800,000",
    "indirectExp": "1,030,000",
    "profit": "3,670,000",
    "margin": 21.0
  },
  "overallRevenueVsCost": {
    "categories": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    "costData": [1.6, 3.8, 3.4, 2.4, 2.5, 4.0, 3.1, 3.5, 4.5, 4.8, 4.0, 3.6],
    "revenueData": [1.8, 4.5, 2.8, 2.8, 1.7, 5.0, 3.5, 4.0, 5.0, 5.0, 4.8, 4.6],
    "mappingFullNames": {
      "A": "Residential Project",
      "B": "Infrastructure",
      "C": "Commercial",
      "D": "Prime Logistics",
      "E": "Emirates Trading",
      "F": "Alpha Tech",
      "G": "Mena Retail",
      "H": "Crescent",
      "I": "Vertex Corp",
      "J": "Vertex Trading",
      "K": "Future Projects",
      "L": "City Center"
    }
  },
  "projectDetail": {
    "tableData": [
      { "label": "Revenue", "labelAr": "الإيرادات", "actual": "2,400,000", "budget": "2,500,000", "progress": 60, "color": "#03D8B0" },
      { "label": "COGS", "labelAr": "تكلفة المبيعات", "actual": "1,500,000", "budget": "1,400,000", "progress": 30, "color": "#FFBC01" },
      { "label": "Indirect Expenses", "labelAr": "المصروفات غير المباشرة", "actual": "600,000", "budget": "550,000", "progress": 10, "color": "#FB7554" }
    ],
    "grossProfit": {
      "label": "Gross Profit",
      "labelAr": "إجمالي الربح",
      "actual": "17,500,000",
      "budget": "550,000",
      "progress": 10
    },
    "actualVsBudget": {
      "categories": [
        { "en": "Revenue", "ar": "الإيرادات" },
        { "en": "COGS", "ar": "تكلفة المبيعات" },
        { "en": "Indirect Expense", "ar": "المصروفات غير المباشرة" }
      ],
      "actualData": [2.4, 2.5, 4.5],
      "budgetData": [2.8, 1.7, 4.7]
    },
    "summaryCards": [
      { "label": "Contract Value", "labelAr": "قيمة العقد", "value": "AED 3.10 M", "icon": "/images/icons/Contract-Value.svg" },
      { "label": "Invoiced", "labelAr": "المفوترة", "value": "AED 2.45 M", "icon": "/images/icons/Invoiced.svg" },
      { "label": "Yet to Invoice", "labelAr": "لم يتم الفوترة بعد", "value": "AED 8.12 M", "icon": "/images/icons/Yet-to-Invoice.svg" }
    ]
  }
}

content_str = json.dumps(cc_data, ensure_ascii=False, indent=2)

comment_block = """  "__comment: cost-center page": "============================================================",
  "__comment: cost-center page": "  PAGE → pages/cost-center/index.vue | URL → /cost-center ",
  "__comment: cost-center page": "  Summary, Overall Revenue vs Cost, Project Detail components ",
  "__comment: cost-center page": "============================================================",
  "costCenterPage": """

new_text = re.sub(r'(\n\})', ',\n' + comment_block + content_str + r'\1', text)

with open('public/data/data.json', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated data.json for cost-center')
