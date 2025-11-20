const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const ChemicalCategory = require('../model/chemicalCategory');
const fs = require('fs');
const path = require('path');
const Chemical = require('../model/chemical');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed!'), false);
    }
  }
});

// Helper function to create slug
const createSlug = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Route to generate demo Excel file
router.get('/download-demo-excel', (req, res) => {
  try {
    const workbook = XLSX.utils.book_new();

    // Categories Sheet
    const categoriesData = [
      {
        'Category Name': 'Organic Chemicals',
        'Photo URL': 'https://example.com/organic.jpg',
        'Alt Text': 'Organic Chemicals',
        'Image Title': 'Organic Chemical Category',
        'Details': 'High-quality organic chemicals for various applications',
        'Meta Title': 'Organic Chemicals | Chemical Supplier',
        'Meta Description': 'Premium organic chemicals for industrial and research use',
        'Meta Keywords': 'organic, chemicals, suppliers',
        'Priority': 0.9,
        'Change Frequency': 'weekly'
      },
      {
        'Category Name': 'Inorganic Chemicals',
        'Photo URL': 'https://example.com/inorganic.jpg',
        'Alt Text': 'Inorganic Chemicals',
        'Image Title': 'Inorganic Chemical Category',
        'Details': 'Comprehensive range of inorganic chemicals',
        'Meta Title': 'Inorganic Chemicals | Chemical Supplier',
        'Meta Description': 'Quality inorganic chemicals for various industries',
        'Meta Keywords': 'inorganic, chemicals, industrial',
        'Priority': 0.9,
        'Change Frequency': 'weekly'
      }
    ];

    // Sub Categories Sheet
    const subCategoriesData = [
      {
        'Parent Category': 'Organic Chemicals',
        'Sub Category Name': 'Alcohols',
        'Photo URL': 'https://example.com/alcohols.jpg',
        'Alt Text': 'Alcohols',
        'Details': 'Various types of alcohol compounds',
        'Meta Title': 'Alcohols | Organic Chemicals',
        'Meta Description': 'High-purity alcohols for industrial use',
        'Priority': 0.8,
        'Change Frequency': 'monthly'
      },
      {
        'Parent Category': 'Organic Chemicals',
        'Sub Category Name': 'Acids',
        'Photo URL': 'https://example.com/acids.jpg',
        'Alt Text': 'Organic Acids',
        'Details': 'Organic acid compounds',
        'Meta Title': 'Organic Acids | Chemical Supplier',
        'Meta Description': 'Premium organic acids',
        'Priority': 0.8,
        'Change Frequency': 'monthly'
      }
    ];

    // Sub-Sub Categories Sheet
    const subSubCategoriesData = [
      {
        'Parent Category': 'Organic Chemicals',
        'Sub Category': 'Alcohols',
        'Sub-Sub Category Name': 'Methanol',
        'Photo URL': 'https://example.com/methanol.jpg',
        'Alt Text': 'Methanol',
        'Details': 'Pure methanol products',
        'Meta Title': 'Methanol | Alcohols',
        'Priority': 0.7,
        'Change Frequency': 'monthly'
      }
    ];

    // Products Sheet
    const productsData = [
      {
        'Category': 'Organic Chemicals',
        'Sub Category': 'Alcohols',
        'Sub-Sub Category': 'Methanol',
        'Product Name': 'Methanol 99.9% Pure',
        'CAS Number': '67-56-1',
        'Chemical Type': 'Organic',
        'Unit': 'Liter',
        'Grade': 'Technical',
        'IUPAC Name': 'Methanol',
        'HS Code': '2905.11.00',
        'Molecular Formula': 'CH3OH',
        'Molecular Weight': 32.04,
        'Description': 'High purity methanol for industrial applications',
        'Global Tagline': 'Premium Quality Methanol',
        'Synonyms': 'Methyl alcohol, Wood alcohol, Carbinol',
        'Applications': 'Solvent, Fuel, Chemical synthesis',
        'Industries': 'Chemical, Pharmaceutical, Automotive',
        'Packings': '1L, 5L, 25L, 200L',
        'Product Code': 'METH-001',
        'Assay': '99.9%',
        'Meta Title': 'Methanol 99.9% Pure | Chemical Supplier',
        'Meta Description': 'Buy high-purity methanol for industrial use',
        'Meta Keywords': 'methanol, methyl alcohol, solvent'
      },
      {
        'Category': 'Inorganic Chemicals',
        'Sub Category': '',
        'Sub-Sub Category': '',
        'Product Name': 'Sodium Chloride',
        'CAS Number': '7647-14-5',
        'Chemical Type': 'Inorganic',
        'Unit': 'Kg',
        'Grade': 'Industrial',
        'IUPAC Name': 'Sodium chloride',
        'HS Code': '2501.00.00',
        'Molecular Formula': 'NaCl',
        'Molecular Weight': 58.44,
        'Description': 'High-quality sodium chloride',
        'Global Tagline': 'Pure Sodium Chloride',
        'Synonyms': 'Common salt, Table salt',
        'Applications': 'Chemical processing, Water treatment',
        'Industries': 'Chemical, Food, Water treatment',
        'Packings': '25kg, 50kg',
        'Product Code': 'NACL-001',
        'Assay': '99.5%',
        'Meta Title': 'Sodium Chloride | Industrial Grade',
        'Meta Description': 'Premium industrial sodium chloride',
        'Meta Keywords': 'sodium chloride, salt, NaCl'
      }
    ];

    // Create worksheets
    const categoriesWS = XLSX.utils.json_to_sheet(categoriesData);
    const subCategoriesWS = XLSX.utils.json_to_sheet(subCategoriesData);
    const subSubCategoriesWS = XLSX.utils.json_to_sheet(subSubCategoriesData);
    const productsWS = XLSX.utils.json_to_sheet(productsData);

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, categoriesWS, 'Categories');
    XLSX.utils.book_append_sheet(workbook, subCategoriesWS, 'Sub Categories');
    XLSX.utils.book_append_sheet(workbook, subSubCategoriesWS, 'Sub-Sub Categories');
    XLSX.utils.book_append_sheet(workbook, productsWS, 'Products');

    // Define the path for the upload directory
    const uploadDir = path.join(__dirname, '..', 'upload');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, 'chemical_import_demo.xlsx');

    // Write the file to the specified path
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({ success: true, message: 'File saved successfully on the server.', path: filePath });
  } catch (error) {
    console.error('Error generating demo file:', error);
    res.status(500).json({ error: 'Failed to generate demo file', details: error.message });
  }
});

// Route to import Excel file
router.post('/import-excel', upload.single('file'), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    
    const categoriesSheet = workbook.Sheets['Categories'];
    const subCategoriesSheet = workbook.Sheets['Sub Categories'];
    const subSubCategoriesSheet = workbook.Sheets['Sub-Sub Categories'];
    const productsSheet = workbook.Sheets['Products'];

    if (!categoriesSheet || !productsSheet) {
      throw new Error('Required sheets (Categories, Products) not found in Excel file');
    }

    // Convert sheets to JSON
    const categories = XLSX.utils.sheet_to_json(categoriesSheet);
    const subCategories = subCategoriesSheet ? XLSX.utils.sheet_to_json(subCategoriesSheet) : [];
    const subSubCategories = subSubCategoriesSheet ? XLSX.utils.sheet_to_json(subSubCategoriesSheet) : [];
    const products = XLSX.utils.sheet_to_json(productsSheet);

    const categoryMap = new Map();
    const importStats = {
      categories: { created: 0, updated: 0, errors: [] },
      products: { created: 0, updated: 0, errors: [] }
    };

    // Process Categories
    for (const cat of categories) {
      try {
        const slug = createSlug(cat['Category Name'] || '');
        const categoryData = {
          category: cat['Category Name'] || 'Unnamed Category',
          photo: cat['Photo URL'] || '',
          alt: cat['Alt Text'] || '',
          imgtitle: cat['Image Title'] || '',
          details: cat['Details'] || '',
          slug: slug,
          metatitle: cat['Meta Title'] || '',
          metadescription: cat['Meta Description'] || '',
          metakeywords: cat['Meta Keywords'] || '',
          metacanonical: cat['Meta Canonical'] || '',
          metalanguage: cat['Meta Language'] || 'en',
          metaschema: cat['Meta Schema'] || '',
          otherMeta: cat['Other Meta'] || '',
          url: `/${slug}`,
          priority: cat['Priority'] || 0.5,
          changeFreq: cat['Change Frequency'] || 'monthly',
          subCategories: []
        };

        const existing = await ChemicalCategory.findOne({ category: cat['Category Name'] }).session(session);
        let savedCategory;
        
        if (existing) {
          Object.assign(existing, categoryData);
          existing.updatedAt = new Date();
          savedCategory = await existing.save({ session });
          importStats.categories.updated++;
        } else {
          savedCategory = await ChemicalCategory.create([categoryData], { session });
          savedCategory = savedCategory[0];
          importStats.categories.created++;
        }

        categoryMap.set(cat['Category Name'], savedCategory);
      } catch (error) {
        importStats.categories.errors.push({
          category: cat['Category Name'],
          error: error.message
        });
      }
    }

    // Process Sub Categories
    for (const subCat of subCategories) {
      try {
        const parentCategory = categoryMap.get(subCat['Parent Category']);
        if (!parentCategory) continue;

        const slug = createSlug(subCat['Sub Category Name'] || '');
        const subCategoryData = {
          category: subCat['Sub Category Name'] || 'Unnamed Sub-Category',
          photo: subCat['Photo URL'] || '',
          alt: subCat['Alt Text'] || '',
          slug: slug,
          details: subCat['Details'] || '',
          metatitle: subCat['Meta Title'] || '',
          metadescription: subCat['Meta Description'] || '',
          metakeywords: subCat['Meta Keywords'] || '',
          url: `/${parentCategory.slug}/${slug}`,
          priority: subCat['Priority'] || 0.5,
          changeFreq: subCat['Change Frequency'] || 'monthly',
          subSubCategory: []
        };

        parentCategory.subCategories.push(subCategoryData);
        await parentCategory.save({ session });
      } catch (error) {
        importStats.categories.errors.push({
          subCategory: subCat['Sub Category Name'],
          error: error.message
        });
      }
    }

    // Process Sub-Sub Categories
    for (const subSubCat of subSubCategories) {
      try {
        const parentCategory = categoryMap.get(subSubCat['Parent Category']);
        if (!parentCategory) continue;

        const subCategory = parentCategory.subCategories.find(
          sc => sc.category === subSubCat['Sub Category']
        );
        if (!subCategory) continue;

        const slug = createSlug(subSubCat['Sub-Sub Category Name'] || '');
        const subSubCategoryData = {
          category: subSubCat['Sub-Sub Category Name'] || 'Unnamed Sub-Sub-Category',
          photo: subSubCat['Photo URL'] || '',
          alt: subSubCat['Alt Text'] || '',
          slug: slug,
          details: subSubCat['Details'] || '',
          metatitle: subSubCat['Meta Title'] || '',
          metadescription: subSubCat['Meta Description'] || '',
          url: `/${parentCategory.slug}/${subCategory.slug}/${slug}`,
          priority: subSubCat['Priority'] || 0.5,
          changeFreq: subSubCat['Change Frequency'] || 'monthly'
        };

        subCategory.subSubCategory.push(subSubCategoryData);
        await parentCategory.save({ session });
      } catch (error) {
        importStats.categories.errors.push({
          subSubCategory: subSubCat['Sub-Sub Category Name'],
          error: error.message
        });
      }
    }

    // Process Products
    for (const prod of products) {
      try {
        const category = categoryMap.get(prod['Category']);
        if (!category) {
          throw new Error(`Category "${prod['Category']}" not found`);
        }

        let subCategoryId = undefined;
        let subCategorySlug = '';
        let subSubCategoryId = undefined;
        let subSubCategorySlug = '';

        if (prod['Sub Category']) {
          const subCat = category.subCategories.find(sc => sc.category === prod['Sub Category']);
          if (subCat) {
            subCategoryId = subCat._id;
            subCategorySlug = subCat.slug;

            if (prod['Sub-Sub Category']) {
              const subSubCat = subCat.subSubCategory.find(ssc => ssc.category === prod['Sub-Sub Category']);
              if (subSubCat) {
                subSubCategoryId = subSubCat._id;
                subSubCategorySlug = subSubCat.slug;
              }
            }
          }
        }

        const productSlug = createSlug(prod['Product Name'] || '');
        const productData = {
          category: category._id,
          categorySlug: category.slug,
          sub_category: subCategoryId,
          subCategorySlug: subCategorySlug,
          subsub_category_id: subSubCategoryId,
          subSubCategorySlug: subSubCategorySlug,
          name: prod['Product Name'] || 'Unnamed Product',
          slug: productSlug,
          cas_number: prod['CAS Number'] || '',
          chemical_type: prod['Chemical Type'] || '',
          unit: prod['Unit'] || '',
          grade: prod['Grade'] || '',
          iupac: prod['IUPAC Name'] || '',
          h_s_code: prod['HS Code'] || '',
          molecular_formula: prod['Molecular Formula'] || '',
          molecular_weight: prod['Molecular Weight'] || null,
          description: prod['Description'] || '',
          global_tagline: prod['Global Tagline'] || '',
          synonyms: prod['Synonyms'] ? prod['Synonyms'].split(',').map(s => s.trim()) : [],
          application: prod['Applications'] ? prod['Applications'].split(',').map(a => a.trim()) : [],
          chemical_industries: prod['Industries'] ? prod['Industries'].split(',').map(i => i.trim()) : [],
          packings: prod['Packings'] ? prod['Packings'].split(',').map(p => p.trim()) : [],
          product_code: prod['Product Code'] || '',
          assay: prod['Assay'] || '',
          metatitle: prod['Meta Title'] || '',
          metadescription: prod['Meta Description'] || '',
          metakeywords: prod['Meta Keywords'] || ''
        };

        const existingProduct = await Chemical.findOne({ 
          name: prod['Product Name'],
          category: category._id 
        }).session(session);

        if (existingProduct) {
          Object.assign(existingProduct, productData);
          await existingProduct.save({ session });
          importStats.products.updated++;
        } else {
          await Chemical.create([productData], { session });
          importStats.products.created++;
        }
      } catch (error) {
        importStats.products.errors.push({
          product: prod['Product Name'],
          error: error.message
        });
      }
    }

    await session.commitTransaction();
    
    res.json({
      success: true,
      message: 'Import completed',
      stats: importStats
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Import error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Import failed', 
      details: error.message 
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;