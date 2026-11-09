export const categoryAgent = {
  name: 'CATEGORY_AGENT',

  classifyProduct({ productName, rawText = '', productType = '' }) {
    const combined = `${productName} ${rawText} ${productType}`.toLowerCase();

    // Medicine Keywords
    if (this.matchesAny(combined, ['paracetamol', 'dolo', 'tablet', 'capsule', 'syrup', 'medicine', 'antibiotic', 'painkiller', 'vitamin', 'aspirin', 'ointment', 'first aid', 'bandage'])) {
      let subcategory = 'Tablets';
      if (combined.includes('syrup') || combined.includes('liquid')) subcategory = 'Syrups';
      else if (combined.includes('capsule')) subcategory = 'Capsules';
      else if (combined.includes('aid') || combined.includes('bandage')) subcategory = 'First Aid';

      return {
        category: 'MEDICINE',
        subcategory,
        recommendedLocation: 'Medicine Box',
        confidenceScore: 95
      };
    }

    // Personal Care Keywords
    if (this.matchesAny(combined, ['shampoo', 'conditioner', 'soap', 'facewash', 'toothpaste', 'sunscreen', 'lotion', 'cream', 'cosmetic', 'serum', 'perfume', 'deodorant', 'hair', 'oral'])) {
      let subcategory = 'Skincare';
      if (combined.includes('shampoo') || combined.includes('hair') || combined.includes('conditioner')) subcategory = 'Haircare';
      else if (combined.includes('toothpaste') || combined.includes('brush') || combined.includes('oral')) subcategory = 'Oral Care';
      else if (combined.includes('makeup') || combined.includes('lipstick') || combined.includes('cosmetic')) subcategory = 'Cosmetics';

      return {
        category: 'PERSONAL CARE',
        subcategory,
        recommendedLocation: subcategory === 'Cosmetics' ? 'Cosmetic Shelf' : 'Bathroom',
        confidenceScore: 92
      };
    }

    // Food Keywords
    if (this.matchesAny(combined, ['milk', 'cheese', 'butter', 'yogurt', 'curd', 'paneer', 'bread', 'fruit', 'apple', 'banana', 'vegetable', 'tomato', 'snack', 'biscuit', 'juice', 'beverage', 'packaged', 'egg', 'meat', 'chicken'])) {
      let subcategory = 'Packaged Food';
      let recommendedLocation = 'Kitchen Cupboard';

      if (this.matchesAny(combined, ['milk', 'cheese', 'butter', 'yogurt', 'curd', 'paneer'])) {
        subcategory = 'Dairy';
        recommendedLocation = 'Refrigerator';
      } else if (this.matchesAny(combined, ['bread', 'bun', 'cake', 'bakery'])) {
        subcategory = 'Bakery';
        recommendedLocation = 'Kitchen Cupboard';
      } else if (this.matchesAny(combined, ['fruit', 'apple', 'banana', 'orange'])) {
        subcategory = 'Fruits';
        recommendedLocation = 'Refrigerator';
      } else if (this.matchesAny(combined, ['vegetable', 'tomato', 'potato', 'onion'])) {
        subcategory = 'Vegetables';
        recommendedLocation = 'Refrigerator';
      } else if (this.matchesAny(combined, ['juice', 'drink', 'soda', 'coke', 'pepsi'])) {
        subcategory = 'Beverages';
        recommendedLocation = 'Refrigerator';
      }

      return {
        category: 'FOOD',
        subcategory,
        recommendedLocation,
        confidenceScore: 90
      };
    }

    // Cleaning Products Keywords
    if (this.matchesAny(combined, ['detergent', 'disinfectant', 'cleaner', 'lysol', 'dettol', 'bleach', 'harpic', 'soap powder', 'dishwash', 'vim'])) {
      return {
        category: 'CLEANING PRODUCTS',
        subcategory: combined.includes('dish') ? 'Dishwashing' : 'Disinfectants',
        recommendedLocation: 'Cleaning Storage',
        confidenceScore: 94
      };
    }

    // Sanitary Products Keywords
    if (this.matchesAny(combined, ['pad', 'tampon', 'sanitary', 'wipe', 'hygiene', 'tissue'])) {
      return {
        category: 'SANITARY PRODUCTS',
        subcategory: 'Hygiene',
        recommendedLocation: 'Bathroom',
        confidenceScore: 91
      };
    }

    // Baby Products Keywords
    if (this.matchesAny(combined, ['baby', 'diaper', 'pampers', 'cerelac', 'formula', 'wipes baby'])) {
      return {
        category: 'BABY PRODUCTS',
        subcategory: combined.includes('diaper') ? 'Diapers' : 'Baby Food',
        recommendedLocation: 'Storeroom',
        confidenceScore: 93
      };
    }

    // Groceries Keywords
    if (this.matchesAny(combined, ['rice', 'flour', 'atta', 'dal', 'pulse', 'oil', 'spice', 'sugar', 'salt'])) {
      return {
        category: 'GROCERIES',
        subcategory: combined.includes('oil') ? 'Oils' : 'Grains',
        recommendedLocation: 'Grocery Shelf',
        confidenceScore: 89
      };
    }

    // Default fallback
    return {
      category: 'OTHER',
      subcategory: 'General',
      recommendedLocation: 'Kitchen Cupboard',
      confidenceScore: 60
    };
  },

  matchesAny(text, keywords) {
    return keywords.some(kw => text.includes(kw));
  }
};
