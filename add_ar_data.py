import json
import re

with open('public/data/data.json', 'r', encoding='utf-8') as f:
    text = f.read()

accounts_receivable = {
  "summary": [
    {
      "label": "Corporate Clients",
      "labelAr": "عملاء الشركات",
      "total": "550,000",
      "age30": "250,000",
      "age3060": "150,000",
      "age6090": "90,000",
      "age90plus": "60,000",
      "invoices": [
        { "id": "Invoice 1", "total": "550,000", "age30": "250,000", "age3060": "150,000", "age6090": "90,000", "age90plus": "60,000", "selected": True },
        { "id": "Invoice 2", "total": "550,000", "age30": "250,000", "age3060": "150,000", "age6090": "90,000", "age90plus": "60,000", "selected": True },
        { "id": "Invoice 3", "total": "550,000", "age30": "250,000", "age3060": "150,000", "age6090": "90,000", "age90plus": "60,000", "selected": False },
        { "id": "Invoice 4", "total": "550,000", "age30": "250,000", "age3060": "150,000", "age6090": "90,000", "age90plus": "60,000", "selected": False }
      ]
    },
    {
      "label": "Retail Customers",
      "labelAr": "عملاء التجزئة",
      "total": "265,000",
      "age30": "120,000",
      "age3060": "80,000",
      "age6090": "40,000",
      "age90plus": "25,000",
      "invoices": []
    },
    {
      "label": "Export Clients",
      "labelAr": "عملاء التصدير",
      "total": "145,000",
      "age30": "70,000",
      "age3060": "40,000",
      "age6090": "25,000",
      "age90plus": "10,000",
      "invoices": []
    }
  ],
  "topCustomers": {
    "customersData": [
      { "id": "A", "name": "Horizon Global", "nameAr": "هورايزون جلوبال", "value": 3.3, "color": "#04C18F" },
      { "id": "B", "name": "Orion Tech", "nameAr": "أوريون تك", "value": 4.1, "color": "#04C18F" },
      { "id": "C", "name": "Gulf Trading", "nameAr": "جلف تريدينج", "value": 2.9, "color": "#04C18F" },
      { "id": "D", "name": "Prime Logistics", "nameAr": "برايم لوجيستكس", "value": 3.7, "color": "#04C18F" },
      { "id": "E", "name": "Emirates Trading", "nameAr": "الإمارات للتجارة", "value": 4.4, "color": "#04C18F" },
      { "id": "F", "name": "Alpha Tech", "nameAr": "ألفا تك", "value": 1.9, "color": "#04C18F" },
      { "id": "G", "name": "Mena Retail", "nameAr": "مينا لتجارة التجزئة", "value": 3.7, "color": "#04C18F" },
      { "id": "H", "name": "Crescent", "nameAr": "كريسنت", "value": 4.0, "color": "#04C18F" },
      { "id": "I", "name": "Vertex Corp", "nameAr": "فيرتكس كورب", "value": 2.8, "color": "#04C18F" },
      { "id": "J", "name": "Vertex Trading", "nameAr": "فيرتكس للتجارة", "value": 3.2, "color": "#04C18F" }
    ],
    "cumulativeLine": [40, 62, 70, 78, 85, 88, 92, 95, 97, 100]
  },
  "historicalMovement": {
    "arBalance": [1.6, 3.2, 3.8, 4.3, 4.6, 4.8],
    "percentage": [],
    "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  },
  "agingGraph": {
    "agingCategories": [
      { "en": "Overdue >30 Days",  "ar": "متأخر أكثر من 30 يوم" },
      { "en": "Overdue 30-60 Days", "ar": "متأخر 30-60 يوم" },
      { "en": "Overdue 60-90 Days", "ar": "متأخر 60-90 يوم" },
      { "en": "Overdue <90 Days",  "ar": "متأخر أقل من 90 يوم" }
    ],
    "previousYearData": [2.7, 1.9, 2.8, 2.8],
    "currentYearData": [4.0, 4.7, 2.8, 4.3],
    "cumulativeData": [45, 65, 75, 88],
    "percentOfTotal": [16, 16, 10, 15]
  }
}

content_str = json.dumps(accounts_receivable, ensure_ascii=False, indent=2)

comment_block = """  "__comment: accounts-receivable": "============================================================",
  "__comment: accounts-receivable": "  PAGE → pages/accounts-receivable/index.vue | URL → /accounts-receivable ",
  "__comment: accounts-receivable": "  Summary, Top Customers, Historical Movement, Aging Graph ",
  "__comment: accounts-receivable": "============================================================",
  "accountsReceivablePage": """

# Insert at the end before the last closing brace
new_text = re.sub(r'(\n\})', ',\n' + comment_block + content_str + r'\1', text)

with open('public/data/data.json', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated data.json')
