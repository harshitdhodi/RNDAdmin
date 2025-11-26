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

// POST /import-categories
router.post('/import-categories', upload.single('file'), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    const categoriesSheet = workbook.Sheets['Categories'];
    const subCategoriesSheet = workbook.Sheets['Sub Categories'];
    const subSubCategoriesSheet = workbook.Sheets['Sub-Sub Categories'];

    if (!categoriesSheet) {
      throw new Error('Required sheet "Categories" not found');
    }

    const categories = XLSX.utils.sheet_to_json(categoriesSheet);
    const subCategories = subCategoriesSheet ? XLSX.utils.sheet_to_json(subCategoriesSheet) : [];
    const subSubCategories = subSubCategoriesSheet ? XLSX.utils.sheet_to_json(subSubCategoriesSheet) : [];

    const categoryMap = new Map(); // categoryName → document
    const stats = {
      categories: { created: 0, updated: 0, errors: [] },
      subCategories: { created: 0, errors: [] },
      subSubCategories: { created: 0, errors: [] }
    };

    // ── 1. Process Main Categories ─────────────────────
    for (const cat of categories) {
      try {
        const slug = createSlug(cat['Category Name'] || '');
        const categoryData = {
          category: cat['Category Name']?.trim() || 'Unnamed Category',
          photo: cat['Photo URL'] || '',
          alt: cat['Alt Text'] || '',
          imgtitle: cat['Image Title'] || '',
          details: cat['Details'] || '',
          slug,
          metatitle: cat['Meta Title'] || '',
          metadescription: cat['Meta Description'] || '',
          metakeywords: cat['Meta Keywords'] || '',
          metacanonical: cat['Meta Canonical'] || '',
          metalanguage: cat['Meta Language'] || 'en',
          metaschema: cat['Meta Schema'] || '',
          otherMeta: cat['Other Meta'] || '',
          url: `/${slug}`,
          priority: Number(cat['Priority']) || 0.5,
          changeFreq: cat['Change Frequency'] || 'monthly',
          subCategories: []
        };

        let doc = await ChemicalCategory.findOne({ category: categoryData.category }).session(session);

        if (doc) {
          Object.assign(doc, categoryData);
          doc.updatedAt = new Date();
          await doc.save({ session });
          stats.categories.updated++;
        } else {
          doc = await ChemicalCategory.create([categoryData], { session: session });
          doc = doc[0];
          stats.categories.created++;
        }

        categoryMap.set(categoryData.category, doc);
      } catch (err) {
        stats.categories.errors.push({ name: cat['Category Name'], error: err.message });
      }
    }

    // ── 2. Process Sub-Categories ───────────────────────
    for (const sub of subCategories) {
      try {
        const parentDoc = categoryMap.get(sub['Parent Category']?.trim());
        if (!parentDoc) {
          stats.subCategories.errors.push({ name: sub['Sub Category Name'], error: 'Parent category not found' });
          continue;
        }

        const slug = createSlug(sub['Sub Category Name'] || '');
        const subData = {
          category: sub['Sub Category Name']?.trim() || 'Unnamed Sub-Category',
          photo: sub['Photo URL'] || '',
          alt: sub['Alt Text'] || '',
          slug,
          details: sub['Details'] || '',
          metatitle: sub['Meta Title'] || '',
          metadescription: sub['Meta Description'] || '',
          metakeywords: sub['Meta Keywords'] || '',
          url: `/${parentDoc.slug}/${slug}`,
          priority: Number(sub['Priority']) || 0.5,
          changeFreq: sub['Change Frequency'] || 'monthly',
          subSubCategory: []
        };

        // Avoid duplicates
        const exists = parentDoc.subCategories.some(sc => sc.category === subData.category);
        if (!exists) {
          parentDoc.subCategories.push(subData);
          stats.subCategories.created++;
        }

        await parentDoc.save({ session });
      } catch (err) {
        stats.subCategories.errors.push({ name: sub['Sub Category Name'], error: err.message });
      }
    }

    // ── 3. Process Sub-Sub-Categories ───────────────────
    for (const ssc of subSubCategories) {
      try {
        const parentDoc = categoryMap.get(ssc['Parent Category']?.trim());
        if (!parentDoc) continue;

        const subCat = parentDoc.subCategories.find(sc => sc.category === ssc['Sub Category']?.trim());
        if (!subCat) {
          stats.subSubCategories.errors.push({ name: ssc['Sub-Sub Category Name'], error: 'Sub-category not found' });
          continue;
        }

        const slug = createSlug(ssc['Sub-Sub Category Name'] || '');
        const subSubData = {
          category: ssc['Sub-Sub Category Name']?.trim() || 'Unnamed Sub-Sub-Category',
          photo: ssc['Photo URL'] || '',
          alt: ssc['Alt Text'] || '',
          slug,
          details: ssc['Details'] || '',
          metatitle: ssc['Meta Title'] || '',
          metadescription: ssc['Meta Description'] || '',
          url: `/${parentDoc.slug}/${subCat.slug}/${slug}`,
          priority: Number(ssc['Priority']) || 0.5,
          changeFreq: ssc['Change Frequency'] || 'monthly'
        };

        if (!subCat.subSubCategory.some(x => x.category === subSubData.category)) {
          subCat.subSubCategory.push(subSubData);
          stats.subSubCategories.created++;
          await parentDoc.save({ session });
        }
      } catch (err) {
        stats.subSubCategories.errors.push({ name: ssc['Sub-Sub Category Name'], error: err.message });
      }
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Categories hierarchy imported successfully',
      stats
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Category import error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});


// POST /import-products
router.post('/import-products', upload.single('file'), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const productsSheet = workbook.Sheets['Products'];
    if (!productsSheet) throw new Error('Sheet "Products" not found');

    const products = XLSX.utils.sheet_to_json(productsSheet);
    const stats = { created: 0, updated: 0, errors: [] };

    for (const prod of products) {
      try {
        const catName = prod['Category']?.trim();
        if (!catName) throw new Error('Category missing');

        const categoryDoc = await ChemicalCategory.findOne({ category: catName }).session(session);
        if (!categoryDoc) throw new Error(`Category "${catName}" not found`);

        // Resolve sub & sub-sub
        let subCategoryId = null, subCategorySlug = '';
        let subSubCategoryId = null, subSubCategorySlug = '';

        if (prod['Sub Category']) {
          const sub = categoryDoc.subCategories.find(sc => sc.category === prod['Sub Category']?.trim());
          if (sub) {
            subCategoryId = sub._id;
            subCategorySlug = sub.slug;

            if (prod['Sub-Sub Category']) {
              const subSub = sub.subSubCategory.find(ssc => ssc.category === prod['Sub-Sub Category']?.trim());
              if (subSub) {
                subSubCategoryId = subSub._id;
                subSubCategorySlug = subSub.slug;
              }
            }
          }
        }

        const productSlug = createSlug(prod['Product Name'] || 'Unnamed Product');

        const productData = {
          category: categoryDoc._id,
          categorySlug: categoryDoc.slug,
          sub_category: subCategoryId,
          subCategorySlug,
          subsub_category_id: subSubCategoryId,
          subSubCategorySlug,
          name: prod['Product Name']?.trim() || 'Unnamed Product',
          slug: productSlug,
          cas_number: prod['CAS Number'] || '',
          chemical_type: prod['Chemical Type'] || '',
          unit: prod['Unit'] || '',
          grade: prod['Grade'] || '',
          iupac: prod['IUPAC Name'] || '',
          h_s_code: prod['HS Code'] || '',
          molecular_formula: prod['Molecular Formula'] || '',
          molecular_weight: prod['Molecular Weight'] ? Number(prod['Molecular Weight']) : null,
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

        const existing = await Chemical.findOne({
          name: productData.name,
          category: categoryDoc._id
        }).session(session);

        if (existing) {
          Object.assign(existing, productData);
          await existing.save({ session });
          stats.updated++;
        } else {
          await Chemical.create([productData], { session });
          stats.created++;
        }
      } catch (err) {
        stats.errors.push({ product: prod['Product Name'], error: err.message });
      }
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Products imported successfully',
      stats
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Product import error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;