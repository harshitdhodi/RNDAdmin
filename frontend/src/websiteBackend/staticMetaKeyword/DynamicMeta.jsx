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
        const response = await axios.get("/api/meta/get-meta");
        if (response.data && Array.isArray(response.data.data)) {
          const metaDataList = response.data.data;
          const currentPath = location.pathname.toLowerCase();

          // Check for exact match
          let matchedMeta = metaDataList.find(
            (meta) => `/${meta.pageSlug.toLowerCase()}` === currentPath
          );

          if (!matchedMeta) {
            // Fallback to "static-page" if no exact match
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

  // Update document title and meta tags
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

export default useDocumentTitle;
