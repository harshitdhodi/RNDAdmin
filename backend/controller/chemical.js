const path = require('path');
const Chemical = require('../model/chemical');  // Assuming the model is in models/Chemical.js
const Customer = require('../model/customer');
const Supplier = require('../model/supplier');
// Create new chemical
exports.createChemical = async (req, res) => {
  console.log(req.files)
  try {
    // Generate a unique 6-digit product code
    const generateUniquePCode = async () => {
      while (true) {
        const auto_p_code = Math.floor(100000 + Math.random() * 900000).toString();
        const existingChemical = await Chemical.findOne({ auto_p_code });
        if (!existingChemical) {
          return auto_p_code;
        }
      }
    };

    const uniquePCode = await generateUniquePCode();

    // Initialize the images array if files are provided
    let images = [];

    // Check if 'images' field exists in req.files and process accordingly
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      images = imageFiles.map((file, index) => ({
        url: path.basename(file.path),
        altText: req.body[`altText-${index}`],
        title: req.body[`title-${index}`]
      }));
    }

    // Handle the catalog file (if uploaded)
    const catalog = req.files?.catalog?.[0]?.filename || '';
    const msds = req.files?.msds?.[0]?.filename || '';  // Add MSDS handling

    // Prepare chemical data
    const chemical = new Chemical({
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
      categorySlug: req.body.categorySlug,
      sub_category: req.body.sub_category,
      subCategorySlug: req.body.subCategorySlug,
      subsub_category_id: req.body.subsub_category_id,
      subSubCategorySlug: req.body.subSubCategorySlug,
      unit: req.body.unit,
      chemical_type: req.body.chemical_type,
      cas_number: req.body.cas_number,
      packings: req.body.packings,
      grade: req.body.grade,
      iupac: req.body.iupac,
      h_s_code: req.body.h_s_code,
      molecular_weight: req.body.molecular_weight,
      molecular_formula: req.body.molecular_formula,
      synonyms: req.body.synonyms || [],
      chemical_industries: req.body.chemical_industries || [],
      product_code: req.body.product_code,
      auto_p_code: uniquePCode,
      packing: req.body.packing,
      hs_code: req.body.hs_code,
      metatitle: req.body.metatitle,
      metadescription: req.body.metadescription,
      metakeywords: req.body.metakeywords,
      metacanonical: req.body.metacanonical,
      metalanguage: req.body.metalanguage,
      metaschema: req.body.metaschema,
      otherMeta: req.body.otherMeta,
      images: images,
      catalog: catalog,
      msds: msds  // Add MSDS field
    });

    // Save the chemical data in the database
    const savedChemical = await chemical.save();
    res.status(201).json({ message: 'Chemical inserted successfully', chemical: savedChemical });
  } catch (err) {
    console.error('Error creating chemical:', err);
    res.status(400).json({ message: err.message });
  }
};


exports.updateProduct = async (req, res) => {
  const { slugs } = req.query;
  const updateFields = { ...req.body };

  try {
      const existingProduct = await Product.findOne({ slug: slugs });

      if (!existingProduct) {
          return res.status(404).json({ message: 'Product not found' });
      } 

      // Process new uploaded photos
      if (req.files?.photo?.length > 0) {
          const newPhotoPaths = req.files.photo.map(file => ({
              url: file.filename,
              altText: req.body.altName || '',
              title: req.body.imgTitle || ''
          }));
          updateFields.photo = [...existingProduct.photo, ...newPhotoPaths];
      } else {
          updateFields.photo = existingProduct.photo; // Keep existing photos if no new photos are uploaded
      }

      // Process new uploaded catalog
      if (req.files?.catalogue?.[0]?.filename) {
          updateFields.catalogue = req.files.catalogue[0].filename;
      } else {
          updateFields.catalogue = existingProduct.catalogue; // Keep existing catalog if no new catalog is uploaded
      }

      const updatedProduct = await Product.findOneAndUpdate(
          { slug: slugs },
          updateFields,
          { new: true, runValidators: true }
      );

      res.status(200).json(updatedProduct);
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};


// Get all chemicals
exports.getAllChemicals = async (req, res) => {
  try {
      // Step 1: Fetch all chemicals from the Chemical collection
      const chemicals = await Chemical.find();

      // Step 2: Initialize counts for Customer and Supplier separately
      const customerChemicalCounts = {};
      const supplierChemicalCounts = {};

      // Step 3: Count occurrences of each chemicalId in the Customer schema
      const customers = await Customer.find();
      customers.forEach(customer => {
          customer.chemicalId.forEach(chemicalId => {
              customerChemicalCounts[chemicalId] = (customerChemicalCounts[chemicalId] || 0) + 1;
          });
      });

      // Step 4: Count occurrences of each chemicalId in the Supplier schema
      const suppliers = await Supplier.find();
      suppliers.forEach(supplier => {
          supplier.chemical_ids.forEach(chemicalId => {
              supplierChemicalCounts[chemicalId] = (supplierChemicalCounts[chemicalId] || 0) + 1;
          });
      });

      // Step 5: Enhance the chemical data with the count of occurrences for Customer and Supplier separately
      const enhancedChemicals = chemicals.map(chemical => {
          const chemicalId = chemical._id.toString(); // Convert ObjectId to string
          return {
              ...chemical.toObject(),
              customerCount: customerChemicalCounts[chemicalId] || 0,
              supplierCount: supplierChemicalCounts[chemicalId] || 0
          };
      });

      // Step 6: Return the enhanced chemicals with separate counts for customer and supplier
      res.status(200).json(enhancedChemicals);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};

// Get chemical by ID
exports.getChemicalById = async (req, res) => {
    try {
        const chemical = await Chemical.findById(req.query.id);
        if (!chemical) return res.status(404).json({ message: 'Chemical not found' });
        res.status(200).json(chemical);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { slugs } = req.query;
  
    try {
      const product = await Chemical.findOne({slug:slugs});
  
      product.photo.forEach(filename => {
        const filePath = path.join(__dirname, '../images', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`File not found: ${filename}`);
        }
      });
  
      const deletedProduct = await Product.findOneAndDelete({slug:slugs});
    
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
// get chemical by slug
exports.getChemicalBySlug = async (req, res) => {
  try {
    const { slug } = req.query;
    const chemical = await Chemical.findOne({ slug })
      .populate({
        path: 'category',
        select: 'name slug',
        model: 'ChemicalCategory'
      })
      .populate({
        path: 'sub_category',
        select: 'name slug',
        model: 'ChemicalCategory'
      })
      .populate({
        path: 'subsub_category_id',
        select: 'name slug',
        model: 'ChemicalCategory'
      });
    
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical not found' });
    }
    
    res.status(200).json(chemical);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  // count Chemical 
exports.countChemicals = async (req, res) => {
    try {
      // Count the total number of chemicals in the collection
      const chemicalCount = await Chemical.countDocuments();
  
      res.status(200).json({
        totalChemicals: chemicalCount,
        message: "Total number of chemicals counted successfully",
      });
    } catch (err) {
      console.log(err)
      res.status(400).json({
        message: "Error counting chemicals",
        error: err.message,
      });
    }
  };
  
  //Filter Chemical
exports.filterChemical = async (req, res) => {
  try {
    // Get the starting alphabet from the query parameter
    const { alphabet } = req.query;

    // Create a filter to match chemicals starting with the specified alphabet (case-insensitive)
    const filter = alphabet
      ? { name: new RegExp(`^${alphabet}`, 'i') }
      : {};

    // Fetch chemicals based on the filter
    const chemicals = await Chemical.find(filter);

    res.status(200).json(chemicals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.filterChemicalByName_CASNumber = async (req, res) => {
  try {
    // Get the starting alphabet from the query parameter
    const { alphabet } = req.query;

    // Create a filter to match chemicals starting with the specified alphabet (case-insensitive)
    const filter = alphabet
      ? {
          $or: [
            { name: new RegExp(`^${alphabet}`, 'i') },  // Match name starting with the alphabet
            { cas_number: new RegExp(`^${alphabet}`, 'i') }  // Match cas_number starting with the alphabet
          ]
        }
      : {};

    // Fetch chemicals based on the filter
    const chemicals = await Chemical.find(filter);

    res.status(200).json(chemicals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get chemical by category and sub category slug 
exports.getChemicalByCategorySubCategorySlug = async (req, res) => {
 
  try {
    // Destructure category and subCategory from query parameters
    const { categoryslug, subcategoryslug } = req.query;
    
    // Step 1: Query for chemicals by category and subCategory
    const chemicals = await Chemical.find({
      'categorySlug': categoryslug, // Query based on category
      'subCategorySlug': subcategoryslug, // Query based on subCategory slug within the subCategories array
    });

    // Step 2: Return the fetched chemicals
    res.status(200).json(chemicals);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// get chemical by category and Alphabet 
exports.getChemicalByCategoryAndAlphabet = async (req, res) => {
  try {
    // Destructure categoryslug and the selected alphabet from query parameters
    const { categoryslug, alphabet } = req.query;
    
    // Step 1: Query for chemicals by category and name starting with the provided alphabet (case-insensitive)
    const chemicals = await Chemical.find({
      'categorySlug': categoryslug, // Query based on category
      'name': { $regex: `^${alphabet}`, $options: 'i' } // Match name starting with alphabet (case-insensitive)
    });

    // Step 2: Return the fetched chemicals
    res.status(200).json(chemicals);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


//get chemical by sub sub category slug
exports.getChemicalBysubsubCategorySlug = async (req, res) => {
  try {
    const { slug } = req.query;  // Destructure the slug from the query parameters
    const chemical = await Chemical.find({ 
      subSubCategorySlug:slug });  // Use findOne to find a single document by slug
    
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical not found' });
    }
    
    res.status(200).json(chemical);  // Send the found chemical as the response
  } catch (err) {
    res.status(400).json({ message: err.message });  // Send error message if something goes wrong
  }
};

exports.deleteChemical = async (req, res) => {
  try {
      const { id } = req.query; // Get the chemical ID from the URL parameters

      // Find the chemical by its unique ID or product code
      const chemical = await Chemical.findById(id);
      
      if (!chemical) {
          return res.status(404).json({ message: "Chemical not found" });
      }

      // Optionally, you can also delete the images associated with the chemical (if needed)
      // You might use a file system operation here, depending on how you handle image storage

      // Delete the chemical from the database
      await Chemical.findByIdAndDelete(id);

      res.status(200).json({ message: "Chemical deleted successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred while deleting the chemical" });
  }
};

// Add update chemical method
exports.updateChemical = async (req, res) => {
  try {
    const { id } = req.query;

    // Find the existing chemical in the database
    const existingChemical = await Chemical.findById(id);
    if (!existingChemical) {
      return res.status(404).json({ message: 'Chemical not found' });
    }

    // Initialize the images array with existing images
    let images = existingChemical.images || [];

    // Handle new images from the request
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      const newImages = imageFiles.map((file, index) => ({
        url: path.basename(file.path),
        altText: req.body[`altText-${index}`] || '',
        title: req.body[`title-${index}`] || ''
      }));

      images = [...images, ...newImages];
    }

    // Handle the catalog and MSDS files
    const catalog = req.files?.catalog?.[0]?.filename || existingChemical.catalog;
    const msds = req.files?.msds?.[0]?.filename || existingChemical.msds;  // Add MSDS handling

    // Update data with the new request body and fields
    const updateData = {
      ...req.body,
      images: images,
      catalog: catalog,
      msds: msds,  // Add MSDS field
      auto_p_code: existingChemical.auto_p_code,
    };

    // Remove unnecessary fields from the update payload
    delete updateData.images; // Already handled
    delete updateData.altText; // Not needed
    delete updateData.title; // Not needed

    // Update the chemical in the database
    const updatedChemical = await Chemical.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });

    res.status(200).json({ message: 'Chemical updated successfully', chemical: updatedChemical });
  } catch (err) {
    console.error('Error updating chemical:', err);
    res.status(400).json({ message: err.message });
  }
};


exports.searchChemicals = async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from URL parameters
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Create a case-insensitive regular expression for the search query
        const searchRegex = new RegExp(query, 'i');

        // Search across multiple fields
        const chemicals = await Chemical.find({
            $or: [
                { name: searchRegex },
                { cas_number: searchRegex },
                { grade: searchRegex },
                { chemical_type: searchRegex },
                { molecular_formula: searchRegex },
                { synonyms: searchRegex },
                { product_code: searchRegex },
                { auto_p_code: searchRegex }
            ]
        })
        .select('name cas_number grade slug chemical_type molecular_formula product_code auto_p_code') // Select only needed fields
        .limit(10); // Limit results for better performance

        // Format the response
        const formattedResults = chemicals.map(chemical => ({
            _id: chemical._id,
            name: chemical.name,
            cas_number: chemical.cas_number,
            grade: chemical.grade,
            slug: chemical.slug,
            chemical_type: chemical.chemical_type,
            molecular_formula: chemical.molecular_formula,
            product_code: chemical.product_code,
            auto_p_code: chemical.auto_p_code,
            matchedOn: [ // Indicate which fields matched the search
                chemical.name.match(searchRegex) ? 'name' : null,
                chemical.cas_number.match(searchRegex) ? 'cas_number' : null,
                chemical.grade.match(searchRegex) ? 'grade' : null,
                chemical.chemical_type.match(searchRegex) ? 'chemical_type' : null,
                chemical.molecular_formula.match(searchRegex) ? 'molecular_formula' : null,
                chemical.product_code.match(searchRegex) ? 'product_code' : null,
                chemical.auto_p_code.match(searchRegex) ? 'auto_p_code' : null
            ].filter(Boolean)
        }));

        return res.status(200).json({
            success: true,
            count: formattedResults.length,
            data: formattedResults
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error searching chemicals',
            error: error.message
        });
    }
};

exports.getLatestChemicals = async (req, res) => {
    try {
        // Step 1: Fetch latest 6 chemicals from the Chemical collection
        const chemicals = await Chemical.find()
            .sort({ createdAt: -1 })  // Sort by creation date in descending order
            .limit(6);                // Limit to 6 items

        // Step 2: Initialize counts for Customer and Supplier separately
        const customerChemicalCounts = {};
        const supplierChemicalCounts = {};

        // Step 3: Count occurrences of each chemicalId in the Customer schema
        const customers = await Customer.find();
        customers.forEach(customer => {
            customer.chemicalId.forEach(chemicalId => {
                customerChemicalCounts[chemicalId] = (customerChemicalCounts[chemicalId] || 0) + 1;
            });
        });

        // Step 4: Count occurrences of each chemicalId in the Supplier schema
        const suppliers = await Supplier.find();
        suppliers.forEach(supplier => {
            supplier.chemical_ids.forEach(chemicalId => {
                supplierChemicalCounts[chemicalId] = (supplierChemicalCounts[chemicalId] || 0) + 1;
            });
        });

        // Step 5: Enhance the chemical data with the count of occurrences
        const enhancedChemicals = chemicals.map(chemical => {
            const chemicalId = chemical._id.toString();
            return {
                ...chemical.toObject(),
                customerCount: customerChemicalCounts[chemicalId] || 0,
                supplierCount: supplierChemicalCounts[chemicalId] || 0
            };
        });

        res.status(200).json(enhancedChemicals);
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Error fetching latest chemicals",
            error: err.message 
        });
    }
};





 