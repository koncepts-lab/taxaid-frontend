import json
import re

with open('public/data/data.json', 'r', encoding='utf-8') as f:
    text = f.read()

tq_data = {
  "tableData": {
    "vat": [
        { "quarter": "Q1 2025", "budgeted": 1200000, "recorded": 1150000, "variance": 50000, "variancePercent": -4.2 },
        { "quarter": "Q2 2025", "budgeted": 1200000, "recorded": 1150000, "variance": 130000, "variancePercent": -9.0 },
        { "quarter": "Q3 2025", "budgeted": 1200000, "recorded": 1150000, "variance": 20000, "variancePercent": -1.2 },
        { "quarter": "Q4 2025", "budgeted": 1200000, "recorded": 1150000, "variance": 130000, "variancePercent": -7.4 }
    ],
    "corporate": [
        { "quarter": "FY 2025", "budgeted": 5000000, "recorded": 4800000, "variance": 200000, "variancePercent": -4.0 }
    ],
    "ifrs": [],
    "accounting": []
  },
  "suggestions": [
    { "label": "How strong is your business?", "icon": "/images/icons/chat-1.svg" },
    { "label": "What areas need attention?", "icon": "/images/icons/chat-2.svg" },
    { "label": "How to improve cash flow?", "icon": "/images/icons/chat-3.svg" },
    { "label": "Revenue growth analysis?", "icon": "/images/icons/chat-1.svg" }
  ],
  "tabs": [
    { "id": "vat", "name": "VAT Queries", "icon": "/images/icons/vat.svg" },
    { "id": "corporate", "name": "Corporate Tax", "icon": "/images/icons/corporate-tax.svg" },
    { "id": "ifrs", "name": "IFRS", "icon": "/images/icons/ifrs.svg" },
    { "id": "accounting", "name": "General Accounting", "icon": "/images/icons/general.svg" }
  ],
  "historyGroups": [
    {
        "label": "Today",
        "queries": [
            "How can I claim input VAT on business...",
            "What are the UAE VAT return filing...",
            "Why is my VAT refund taking longer...",
            "How to handle VAT for export services..."
        ]
    },
    {
        "label": "Previous 7 Days",
        "queries": [
            "How can I claim input VAT on business...",
            "What are the UAE VAT return filing...",
            "Why is my VAT refund taking longer...",
            "How to handle VAT for export services..."
        ]
    },
    {
        "label": "Previous 30 Days",
        "queries": [
            "How can I claim input VAT on business...",
            "What are the UAE VAT return filing...",
            "Why is my VAT refund taking longer...",
            "How to handle VAT for export services..."
        ]
    }
  ],
  "deadlines": [
    { "label": "VAT Return Date", "date": "28 Jan 2026", "color": "orange-50" },
    { "label": "CT Return Date", "date": "20 Jun 2026", "color": "orange-50" }
  ]
}

content_str = json.dumps(tq_data, ensure_ascii=False, indent=2)

comment_block = """  "__comment: tax-queries page": "============================================================",
  "__comment: tax-queries page": "  PAGE → pages/tax-queries/index.vue | URL → /tax-queries ",
  "__comment: tax-queries page": "  LeftSideBar, TaxTable, ChatWindow components ",
  "__comment: tax-queries page": "============================================================",
  "taxQueriesPage": """

new_text = re.sub(r'(\n\})', ',\n' + comment_block + content_str + r'\1', text)

with open('public/data/data.json', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated data.json for tax-queries')
