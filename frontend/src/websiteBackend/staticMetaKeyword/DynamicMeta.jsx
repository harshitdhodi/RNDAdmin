<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const useDocumentTitle = () => {
  const location = useLocation();
  const [metaTitle, setMetaTitle] = useState("Loading...");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const currentPath = location.pathname.toLowerCase();
        const categoryResponse = await axios.get("/api/chemicalCategory/getAll");
console.log(categoryResponse.data)
        if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
          const categoryList = categoryResponse.data;

          // Function to find match in nested structure
          const findMatchingCategory = (categories) => {
            console.log(categories)
            for (const category of categories) {
              // Check top-level category
              if (`/${category.slug.toLowerCase()}` === currentPath) {
                return category;
              }

              // Check subcategories
              if (category.subCategories && category.subCategories.length > 0) {
                for (const subCat of category.subCategories) {
                  if (`/${subCat.slug.toLowerCase()}` === currentPath) {
                    return subCat;
                  }

                  // Check sub-subcategories
                  if (subCat.subSubCategory && subCat.subSubCategory.length > 0) {
                    const subSubMatch = subCat.subSubCategory.find(
                      (subSub) => `/${subSub.slug.toLowerCase()}` === currentPath
                    );
                    if (subSubMatch) return subSubMatch;
                  }
                }
              }
            }
            return null;
          };

          const matchedCategory = findMatchingCategory(categoryList);

          if (matchedCategory) {
            setMetaTitle(matchedCategory.metatitle || "Static Page");
            setMetaDescription(matchedCategory.metadescription || "");
            setMetaKeyword(matchedCategory.metakeywords || "");
            return;
          }
        }

        // Fallback to meta API
        const metaResponse = await axios.get("/api/meta/get-meta");
        if (metaResponse.data && Array.isArray(metaResponse.data.data)) {
          const metaDataList = metaResponse.data.data;
          let matchedMeta = metaDataList.find(
            (meta) => `/${meta.pageSlug.toLowerCase()}` === currentPath
          );

          if (!matchedMeta) {
            matchedMeta = metaDataList.find(
              (meta) => meta.pageSlug.toLowerCase() === "static-page"
            );
          }

          setMetaTitle(matchedMeta ? matchedMeta.metaTitle : "Static Page");
          setMetaDescription(matchedMeta ? matchedMeta.metaDescription : "");
          setMetaKeyword(matchedMeta ? matchedMeta.metaKeyword : "");
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
        setMetaTitle("Static Page - Default Meta Title");
        setMetaDescription("Default meta description for static pages.");
        setMetaKeyword("default, static, page");
      }
    };

    fetchMetaData();
  }, [location]);

  useEffect(() => {
    document.title = metaTitle;
    const updateMetaTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    updateMetaTag("description", metaDescription);
    updateMetaTag("keywords", metaKeyword);
  }, [metaTitle, metaDescription, metaKeyword]);
};

=======
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const useDocumentTitle = () => {
  const location = useLocation();
  const [metaTitle, setMetaTitle] = useState("Loading...");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [favicon, setFavicon] = useState("/favIcon.webp"); // Default favicon

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        // Fetch logo data to get the favicon
        const logoResponse = await axios.get("/api/logo/get-logo");
        if (logoResponse.data && logoResponse.data.data && logoResponse.data.data.favIcon) {
          // Assuming the API returns the path like '/uploads/favicon.webp'
          // If it's a full URL, this will also work.
          setFavicon(logoResponse.data.data.favIcon);
        }

        const currentPath = location.pathname.toLowerCase();
        const categoryResponse = await axios.get("/api/chemicalCategory/getAll");

        if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
          const categoryList = categoryResponse.data;

          // Function to find match in nested structure
          const findMatchingCategory = (categories) => {
            for (const category of categories) {
              // Check top-level category
              if (`/${category.slug.toLowerCase()}` === currentPath) {
                return category;
              }

              // Check subcategories
              if (category.subCategories && category.subCategories.length > 0) {
                for (const subCat of category.subCategories) {
                  if (`/${subCat.slug.toLowerCase()}` === currentPath) {
                    return subCat;
                  }

                  // Check sub-subcategories
                  if (subCat.subSubCategory && subCat.subSubCategory.length > 0) {
                    const subSubMatch = subCat.subSubCategory.find(
                      (subSub) => `/${subSub.slug.toLowerCase()}` === currentPath
                    );
                    if (subSubMatch) return subSubMatch;
                  }
                }
              }
            }
            return null;
          };

          const matchedCategory = findMatchingCategory(categoryList);

          if (matchedCategory) {
            setMetaTitle(matchedCategory.metatitle || "Static Page");
            setMetaDescription(matchedCategory.metadescription || "");
            setMetaKeyword(matchedCategory.metakeywords || "");
            return;
          }
        }

        // Fallback to meta API
        const metaResponse = await axios.get("/api/meta/get-meta");
        if (metaResponse.data && Array.isArray(metaResponse.data.data)) {
          const metaDataList = metaResponse.data.data;
          let matchedMeta = metaDataList.find(
            (meta) => `/${meta.pageSlug.toLowerCase()}` === currentPath
          );

          if (!matchedMeta) {
            matchedMeta = metaDataList.find(
              (meta) => meta.pageSlug.toLowerCase() === "static-page"
            );
          }

          setMetaTitle(matchedMeta ? matchedMeta.metaTitle : "Static Page");
          setMetaDescription(matchedMeta ? matchedMeta.metaDescription : "");
          setMetaKeyword(matchedMeta ? matchedMeta.metaKeyword : "");
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
        setMetaTitle("Static Page - Default Meta Title");
        setMetaDescription("Default meta description for static pages.");
        setMetaKeyword("default, static, page");
      }
    };

    fetchMetaData();
  }, [location]);

  useEffect(() => {
    document.title = metaTitle;
    const updateMetaTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const updateFavicon = (href) => {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "icon");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    updateMetaTag("description", metaDescription);
    updateMetaTag("keywords", metaKeyword);
    updateFavicon(favicon);
  }, [metaTitle, metaDescription, metaKeyword, favicon]);
};

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
export default useDocumentTitle;